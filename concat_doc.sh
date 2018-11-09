#!/usr/bin/env bash

awk 'FNR==1 && NR!=1 {print "\n\n\n"}{print}' web/doc/*md > web/doc/genie.md