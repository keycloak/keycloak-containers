#!/bin/bash

KEYCLOAK_VERSION=$1

for target in 'server'; do
    sed -i "s/ENV KEYCLOAK_VERSION .*/ENV KEYCLOAK_VERSION $KEYCLOAK_VERSION/" $target/Dockerfile
done
