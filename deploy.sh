#!/bin/bash

set -e

function readVariableIfRequired() {
  if [ -z "${!1}" ]; then
    read -p "${1}=" $1
  else
    echo "${1}="${!1}
  fi
}

function docker-clean() {
  imagesToClean=`docker images --filter dangling=true -q 2>/dev/null`

  if [ ! -z "${imagesToClean}" ]; then
    docker rmi ${imagesToClean} 
  fi
}

function docker-compose-deploy() {
  PROJECT_NAME=${1}
  readVariableIfRequired "PROJECT_NAME"

  DOMAIN=${2}
  readVariableIfRequired "DOMAIN"
  export DOMAIN=${DOMAIN}

  docker-compose -p ${PROJECT_NAME} pull
  docker-compose -p ${PROJECT_NAME} up -d
  docker-clean
}

function docker-compose-hot-deploy() {
  PROJECT_NAME=${1}
  readVariableIfRequired "PROJECT_NAME"

  DOMAIN=${2}
  readVariableIfRequired "DOMAIN"
  export DOMAIN=${DOMAIN}

  SERVICE_NAME=${3}
  readVariableIfRequired "SERVICE_NAME"

  existingContainer=`docker-compose -p ${PROJECT_NAME} ps | grep ${SERVICE_NAME} | awk '{print $1}'`

  docker-compose -p ${PROJECT_NAME} pull
  docker-compose -p ${PROJECT_NAME} scale ${SERVICE_NAME}=2

  echo "Waiting 5 seconds to start..."
  sleep 5
  docker stop ${existingContainer}
  docker rm -f -v ${existingContainer}
  
  docker-clean
}

export PATH=${PATH}:/opt/bin

PROJECT_NAME=${1}
readVariableIfRequired "PROJECT_NAME"

PROJECT_URL=${2}
readVariableIfRequired "PROJECT_URL"

rm -rf ${PROJECT_NAME}
git clone ${PROJECT_URL} ${PROJECT_NAME}
cd ${PROJECT_NAME}

export DOMAIN=${3}

if [ `docker-compose -p ${PROJECT_NAME} ps | awk '{if (NR > 2) {print}}' | wc -l` -eq 0 ]; then
  echo "Deploying new instance"
  docker-compose-deploy ${PROJECT_NAME} ${3}
else
  echo "Hot deploying service ${4}"
  docker-compose-hot-deploy ${PROJECT_NAME} ${3} ${4}
fi
