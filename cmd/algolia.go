package main

import (
	native_errors "errors"
	"flag"
	"fmt"
	"io/ioutil"
	"path"
	"regexp"

	"github.com/ViBiOh/httputils/pkg/errors"
	"github.com/ViBiOh/httputils/pkg/logger"
	"github.com/ViBiOh/httputils/pkg/tools"
	"github.com/algolia/algoliasearch-client-go/algoliasearch"
)

var (
	// ErrIndexNotFound occurs when index is not found in List
	ErrIndexNotFound = native_errors.New(`index not found`)

	chapterTitleRegex = regexp.MustCompile(`#\s+(.*)`)
	imgRegex          = regexp.MustCompile(`\[\]\((.*)\)`)
	strongRegex       = regexp.MustCompile(`\*\*\s*([^*]*)\s*\*\*`)
	italicRegex       = regexp.MustCompile(`\*\s*([^*]*)\s*\*`)
)

// App stores informations
type App struct {
	client    algoliasearch.Client
	indexName string

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

// GetSearchObjects transform input reveal file to algolia object
func (a App) GetSearchObjects(name string) ([]algoliasearch.Object, error) {
	content, err := ioutil.ReadFile(a.source)
	if err != nil {
		return nil, errors.WithStack(err)
	}

	objects := make([]algoliasearch.Object, 0)

	var chapterName string
	var slideImg string
	var keywords []string

	contentStr := string(content)
	for chapterNum, chapter := range a.sep.Split(contentStr, -1) {
		chapterName = chapterTitleRegex.FindStringSubmatch(chapter)[1]

		for slideNum, slide := range a.verticalSep.Split(chapter, -1) {
			slideImg = ``
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
				`url`:      path.Join(`/`, name, fmt.Sprintf(`/#/%d/%d`, chapterNum, slideNum)),
				`h`:        chapterNum,
				`v`:        slideNum,
				`content`:  slide,
				`chapter`:  chapterName,
				`keywords`: keywords,
				`img`:      slideImg,
			})
		}
	}

	return objects, nil
}

func main() {
	algoliaConfig := Flags(``)
	name := flag.String(`name`, ``, `Name prepended`)
	flag.Parse()

	algoliaApp := NewApp(algoliaConfig)

	objects, err := algoliaApp.GetSearchObjects(*name)
	if err != nil {
		logger.Fatal(`%+v`, err)
	}

	if len(objects) == 0 {
		logger.Fatal(`no search object`)
	}
	logger.Fatal(`%d objects found`, len(objects))

	if _, err := algoliaApp.client.DeleteIndex(algoliaApp.indexName); err != nil {
		logger.Fatal(`%+v`, errors.WithStack(err))
	}

	index := algoliaApp.client.InitIndex(algoliaApp.indexName)

	if _, err := index.SetSettings(algoliasearch.Map{
		`searchableAttributes`: []string{`keywords`, `img`, `content`},
	}); err != nil {
		logger.Fatal(`%+v`, errors.WithStack(err))
	}

	output, err := index.AddObjects(objects)
	if err != nil {
		logger.Fatal(`%+v`, errors.WithStack(err))
	}
	logger.Info(`%d objects added to %s index`, len(output.ObjectIDs), algoliaApp.indexName)
}
