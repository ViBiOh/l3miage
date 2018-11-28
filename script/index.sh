#!/usr/bin/env bash

set -e
set -u

GIT_ROOT=`git rev-parse --show-cdup`

curl -X DELETE \
     -H "X-Algolia-API-Key: ${ALGOLIA_KEY}" \
     -H "X-Algolia-Application-Id: ${ALGOLIA_APP}" \
    "https://${ALGOLIA_APP}.algolia.net/1/indexes/${ALGOLIA_INDEX}"

./bin/algolia -source "${GIT_ROOT:-.}/www/doc/genie.md" -app "${ALGOLIA_APP}" -key "${ALGOLIA_KEY}" -index "${ALGOLIA_INDEX}"