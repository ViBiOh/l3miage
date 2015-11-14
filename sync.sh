#!/bin/sh

echo 'Starting synchronization'

while [ 0 == 0 ]
do
  rsync -e ssh \
    -az \
    --delete \
    --exclude node_modules/ \
    --exclude target/ \
    --exclude .idea/ \
    --exclude .git/ \
    /Users/ViBiOh/code/md-genie-logiciel \
    dedibox:/home/vibioh/code
 
  sleep 1 
done
