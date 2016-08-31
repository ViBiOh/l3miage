#!/bin/bash

function readVariableIfRequired() {
  if [ -z "${!1}" ]; then
    read -p "${1}=" $1
  else
    echo "${1}="${!1}
  fi
}

function docker-compose-deploy() {
  PROJECT_NAME=${1}
  readVariableIfRequired "PROJECT_NAME"

  DOMAIN=${2}
  readVariableIfRequired "DOMAIN"

  export DOMAIN=${DOMAIN}
  
  docker-compose -p ${PROJECT_NAME} pull
  docker-compose -p ${PROJECT_NAME} stop
  docker-compose -p ${PROJECT_NAME} rm --all -f -v
  docker-compose -p ${PROJECT_NAME} up -d --force-recreate
  
  docker rmi `docker images --filter dangling=true -q 2>/dev/null` 2>/dev/null
}

PROJECT_NAME=${1}
readVariableIfRequired "PROJECT_NAME"

PROJECT_URL=${2}
readVariableIfRequired "PROJECT_URL"

rm -rf ${PROJECT_NAME}
git clone ${PROJECT_URL} ${PROJECT_NAME}
cd ${PROJECT_NAME}
docker-compose-deploy ${PROJECT_NAME} ${3}
