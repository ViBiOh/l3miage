# md-genie-logiciel

[![Build Status](https://travis-ci.org/ViBiOh/md-genie-logiciel.svg?branch=master)](https://travis-ci.org/ViBiOh/md-genie-logiciel) [![](https://images.microbadger.com/badges/image/vibioh/genie-logiciel.svg)](https://microbadger.com/images/vibioh/genie-logiciel "Get your own image badge on microbadger.com")

## Course

### Install

You need npm in order to build /dist directory and Docker if you want to run inside a light HTTP Server.

```bash
npm run build
docker build -t vibioh/md-genie-logiciel .
```

### Run

```bash
docker run -d --name cours vibioh/md-genie-logiciel
```

Browse [LocalHost](http://localhost:1080)

## Java sample

```bash
mvn clean install
```
