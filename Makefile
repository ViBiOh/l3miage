default: back front docker

back:
	CGO_ENABLED=0 GOGC=off go build -installsuffix nocgo src/server.go

front:
	npm install

docker:
	docker build -t vibioh/genie-logiciel --rm .
