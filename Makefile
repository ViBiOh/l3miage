SHELL = /bin/bash

ifneq ("$(wildcard .env)","")
	include .env
	export
endif

APP_NAME = l3miage

## help: Display list of commands
.PHONY: help
help: Makefile
	@sed -n 's|^##||p' $< | column -t -s ':' | sort

## name: Output name of app
.PHONY: name
name:
	@echo -n $(APP_NAME)

## version: Output sha1 of last commit
.PHONY: version
version:
	@echo -n $(shell git rev-parse --short HEAD)

## init: Bootstrap your application. e.g. fetch some data files, make some API calls, request user input etc...
.PHONY: init
init:
	@curl --disable --silent --show-error --location --max-time 30 "https://raw.githubusercontent.com/ViBiOh/scripts/main/bootstrap" | bash -s -- "-c" "git_hooks"
