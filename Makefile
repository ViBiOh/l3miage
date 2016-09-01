default: front docker

front:
	npm install
	npm run build

docker:
	docker build -t vibioh/genie-logiciel .
