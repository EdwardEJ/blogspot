#!/bin/bash

echo What should the version be?
read VERSION

docker build -t edwardej/blogspot:$VERSION .
docker push edwardej/blogspot:$VERSION
ssh root@167.172.137.36 "docker pull edwardej/blogspot:$VERSION && docker tag edwardej/blogspot:$VERSION dokku/api:$VERSION && dokku deploy api $VERSION"