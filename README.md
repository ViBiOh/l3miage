# md-genie-logiciel

[![Build Status](https://travis-ci.org/ViBiOh/genie-logiciel.svg?branch=master)](https://travis-ci.org/ViBiOh/genie-logiciel)

## Course

### Install

You need npm in order to build `/dist` directory and Docker if you want to run inside a light HTTP Server.

```bash
npm run build
docker build -t vibioh/genie-logiciel .
```

### Run

```bash
docker run -d vibioh/genie-logiciel
```

Browse [LocalHost](http://localhost:1080)

## Java sample

```bash
mvn clean install
```
