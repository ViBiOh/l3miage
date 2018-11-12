#!/usr/bin/env bash

set -e
set -u

awk 'FNR==1 && NR!=1 {print "\n\n\n"}{print}' `ls www/doc/*md | grep -v genie.md` > www/doc/genie.md
