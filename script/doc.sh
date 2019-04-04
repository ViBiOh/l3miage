#!/usr/bin/env bash

set -o nounset -o pipefail -o errexit

main() {
  GIT_ROOT=$(git rev-parse --show-cdup)

  awk 'FNR==1 && NR!=1 {print "\n\n\n"}{print}' $(ls "${GIT_ROOT:-.}/www/doc/"*.md | grep -v genie.md) > "${GIT_ROOT:-.}/www/doc/genie.md"
}

main "${@}"
