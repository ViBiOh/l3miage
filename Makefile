default: front docker

front:
	npm install

docker:
	docker build -t vibioh/genie-logiciel --rm .
