#!/usr/bin/env bash

mkdir -p ./dist/doc/
awk 'FNR==1 && NR!=1 {print "\n\n\n"}{print}' ./doc/*md > ./dist/doc/genie.md