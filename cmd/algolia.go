package main

import (
	"encoding/json"
	"errors"
	"flag"
	"fmt"
	"io/ioutil"
	"log"
	"path"
	"regexp"
	"strings"

	"github.com/algolia/algoliasearch-client-go/algoliasearch"
)

var (
	// ErrIndexNotFound occurs when index is not found in List
	ErrIndexNotFound = errors.New("index not found")

	chapterTitleRegex = regexp.MustCompile(`^#\s+(.*)\s*`)
	imgRegex          = regexp.MustCompile(`\[\]\((.*)\)`)
	strongRegex       = regexp.MustCompile(`\*\*\s*([^*]*)\s*\*\*`)
	italicRegex       = regexp.MustCompile(`\*\s*([^*]*)\s*\*`)
)

// App stores informations
type App struct {
	client    algoliasearch.Client
	appName   string
	appKey    string
	indexName string

	sep         *regexp.Regexp
	verticalSep *regexp.Regexp
	source      string
}

// NewApp creates new App from Flags' config
func NewApp(config map[string]*string) *App {
	return &App{
		appName:   strings.TrimSpace(*config["app"]),
		appKey:    strings.TrimSpace(*config["key"]),
		indexName: strings.TrimSpace(*config["index"]),

		sep:         regexp.MustCompile(fmt.Sprintf("(?m)%s", *config["sep"])),
		verticalSep: regexp.MustCompile(fmt.Sprintf("(?m)%s", *config["vsep"])),
		source:      *config["source"],
	}
}

// Flags adds flags for given prefix
func Flags(prefix string) map[string]*string {
	return map[string]*string{
		"app":   flag.String("app", "", "[algolia] App"),
		"key":   flag.String("key", "", "[algolia] Key"),
		"index": flag.String("index", "", "[algolia] Index"),

		"source": flag.String("source", "", "[reveal] Markdown source"),
		"sep":    flag.String("sep", "^\n\n\n", "[reveal] Separator"),
		"vsep":   flag.String("verticalSep", "^\n\n", "[reveal] Vertical separator"),
	}
}

// Init algolia client
func (a *App) Init() {
	a.client = algoliasearch.NewClient(a.appName, a.appKey)
}

// GetSearchObjects transform input reveal file to algolia object
func (a App) GetSearchObjects(name string) ([]algoliasearch.Object, error) {
	content, err := ioutil.ReadFile(a.source)
	if err != nil {
		return nil, err
	}

	objects := make([]algoliasearch.Object, 0)

	chapterName := name
	var slideImg string
	var keywords []string

	contentStr := string(content)
	for chapterNum, chapter := range a.sep.Split(contentStr, -1) {
		if title := chapterTitleRegex.FindStringSubmatch(chapter); len(title) > 1 {
			chapterName = title[1]
		}

		for slideNum, slide := range a.verticalSep.Split(chapter, -1) {
			slideImg = ""
			if matches := imgRegex.FindStringSubmatch(slide); len(matches) > 1 {
				slideImg = matches[1]
			}

			keywords = make([]string, 0)
			if matches := strongRegex.FindStringSubmatch(slide); len(matches) > 1 {
				keywords = append(keywords, matches[1:]...)
			}
			if matches := italicRegex.FindStringSubmatch(slide); len(matches) > 1 {
				keywords = append(keywords, matches[1:]...)
			}

			objects = append(objects, algoliasearch.Object{
				"url":      path.Join("/", name, fmt.Sprintf("/#/%d/%d", chapterNum, slideNum)),
				"h":        chapterNum,
				"v":        slideNum,
				"content":  slide,
				"chapter":  chapterName,
				"keywords": keywords,
				"img":      slideImg,
			})
		}
	}

	return objects, nil
}

func main() {
	algoliaConfig := Flags("")
	debug := flag.Bool("debug", false, "Debug output instead of sending them")
	name := flag.String("name", "", "Name prepended")
	flag.Parse()

	algoliaApp := NewApp(algoliaConfig)

	objects, err := algoliaApp.GetSearchObjects(*name)
	if err != nil {
		log.Fatalf("%#v", err)
	}

	if *debug {
		output, err := json.MarshalIndent(objects, "", "  ")
		if err != nil {
			log.Fatalf("%#v", err)
		}

		log.Printf("%s\n", output)
		return
	}

	if len(objects) == 0 {
		log.Fatalf("no search object")
	}
	log.Printf("%d objects found\n", len(objects))

	algoliaApp.Init()
	index := algoliaApp.client.InitIndex(algoliaApp.indexName)

	if _, err := index.SetSettings(algoliasearch.Map{
		"searchableAttributes": []string{"keywords", "img", "content"},
	}); err != nil {
		log.Fatalf("%#v", err)
	}

	output, err := index.AddObjects(objects)
	if err != nil {
		log.Fatalf("%#v", err)
	}
	log.Printf("%d objects added to %s index\n", len(output.ObjectIDs), algoliaApp.indexName)
}
