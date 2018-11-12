#!/usr/bin/env bash

set -e

if ! [ "${CI}" == "true" ]; then
  exit
fi

set -u

for file in www/js/*; do
  cat "${file}" | ./node_modules/.bin/uglifyjs --compress --mangle -o "${file}"
done

for file in www/css/*; do
  cat "${file}" | ./node_modules/.bin/cleancss -O2 -o "${file}"
done
