#!/usr/bin/env bash

set -e
set -u

./bin/algolia -source www/doc/genie.md -app "${ALGOLIA_APP}" -key "${ALGOLIA_KEY}" -index "${ALGOLIA_INDEX}"
