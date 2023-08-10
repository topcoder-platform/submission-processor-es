#!/bin/bash
set -eo pipefail
UPDATE_CACHE=""
echo "" > docker/api.env
docker-compose -f docker/docker-compose.yml build submission-processor-es
docker create --name app submission-processor-es:latest

if [ -d node_modules ]
then
  mv yarn.lock old-yarn.lock
  docker cp app:/submission-processor-es/yarn.lock yarn.lock
  set +eo pipefail
  UPDATE_CACHE=$(cmp yarn.lock old-yarn.lock)
  set -eo pipefail
else
  UPDATE_CACHE=1
fi

if [ "$UPDATE_CACHE" == 1 ]
then
  docker cp app:/submission-processor-es/node_modules .
fi