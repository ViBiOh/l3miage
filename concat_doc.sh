#!/usr/bin/env bash

awk 'FNR==1 && NR!=1 {print "\n\n\n"}{print}' `ls web/doc/*md | grep -v genie.md` > web/doc/genie.md
