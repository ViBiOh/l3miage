package main

import (
	"flag"
	"fmt"
	"io/ioutil"
	"log"
	"regexp"

	"github.com/ViBiOh/httputils/tools"
	"github.com/algolia/algoliasearch-client-go/algoliasearch"
)

// App stores informations
type App struct {
	client    algoliasearch.Client
	indexName string
	index     algoliasearch.IndexRes

	sep         *regexp.Regexp
	verticalSep *regexp.Regexp
	source      string
}

// NewApp creates new App from Flags' config
func NewApp(config map[string]*string) *App {
	return &App{
		client:    algoliasearch.NewClient(*config[`app`], *config[`key`]),
		indexName: *config[`index`],

		sep:         regexp.MustCompile(fmt.Sprintf(`(?m)%s`, *config[`sep`])),
		verticalSep: regexp.MustCompile(fmt.Sprintf(`(?m)%s`, *config[`vsep`])),
		source:      *config[`source`],
	}
}

// Flags adds flags for given prefix
func Flags(prefix string) map[string]*string {
	return map[string]*string{
		`app`:   flag.String(tools.ToCamel(fmt.Sprintf(`%sApp`, prefix)), ``, `[algolia] App`),
		`key`:   flag.String(tools.ToCamel(fmt.Sprintf(`%sKey`, prefix)), ``, `[algolia] Key`),
		`index`: flag.String(tools.ToCamel(fmt.Sprintf(`%sIndex`, prefix)), ``, `[algolia] Index`),

		`source`: flag.String(tools.ToCamel(fmt.Sprintf(`%sSource`, prefix)), ``, `[reveal] Markdown source`),
		`sep`:    flag.String(tools.ToCamel(fmt.Sprintf(`%sSep`, prefix)), `^\n\n\n`, `[reveal] Separator`),
		`vsep`:   flag.String(tools.ToCamel(fmt.Sprintf(`%sVerticalSep`, prefix)), `^\n\n`, `[reveal] Vertical separator`),
	}
}

func (a *App) GetSearchObject() ([]algoliasearch.Object, error) {
	content, err := ioutil.ReadFile(a.source)
	if err != nil {
		return nil, fmt.Errorf(`Error while reading file: %v`, err)
	}

	objects := make([]algoliasearch.Object, 0)

	contentStr := string(content)
	for chapterNum, chapter := range a.sep.Split(contentStr, -1) {
		for slideNum, slide := range a.verticalSep.Split(chapter, -1) {
			objects = append(objects, algoliasearch.Object{
				"url":     fmt.Sprintf(`/#/%d/%d`, chapterNum, slideNum),
				"h":       chapterNum,
				"v":       slideNum,
				"content": slide,
			})
		}
	}

	return objects, nil
}

func main() {
	algoliaConfig := Flags(``)
	flag.Parse()

	algoliaApp := NewApp(algoliaConfig)

	if _, err := algoliaApp.client.DeleteIndex(algoliaApp.indexName); err != nil {
		log.Fatalf(`Error while deleting index: %v`, err)
	}
	index := algoliaApp.client.InitIndex(algoliaApp.indexName)

	objects, err := algoliaApp.GetSearchObject()
	if err != nil {
		log.Fatalf(`Error while splitting source :%v`, err)
	}

	_, err = index.AddObjects(objects)
	if err != nil {
		log.Fatalf(`Error while adding objects to index: %v`, err)
	}
}
