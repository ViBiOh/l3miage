#!/usr/bin/env bash

set -o errexit
set -o nounset
set -o pipefail
readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

main() {
  if ! [[ "${CI:-}" == "true" ]]; then
    exit
  fi

  GIT_ROOT=$(git rev-parse --show-cdup)

  for file in "${GIT_ROOT:-.}/www/js/"*; do
    cat "${file}" | ./node_modules/.bin/uglifyjs --compress --mangle -o "${file}"
  done

  for file in "${GIT_ROOT:-.}/www/css/"*; do
    cat "${file}" | ./node_modules/.bin/cleancss -O2 -o "${file}"
  done
}

main "${@}"
