#!/bin/bash

KEYCLOAK_VERSION=$1
TAG_NAME=$2

if [ "$KEYCLOAK_VERSION" == "" ] || [ "$TAG_NAME" == "" ]; then
    echo "usage: set-version.sh <KEYCLOAK_VERSION> <TAG_NAME>"
fi

for i in adapter-wildfly examples server; do
	sed -i "s/ENV KEYCLOAK_VERSION .*/ENV KEYCLOAK_VERSION $KEYCLOAK_VERSION/" $i/Dockerfile
done

for i in server-openshift; do
    sed -i "s/FROM jboss\/keycloak:.*/FROM jboss\/keycloak:$TAG_NAME/" $i/Dockerfile
done

for i in server-ha-postgres; do
    sed -i "s/FROM jboss\/keycloak-postgres:.*/FROM jboss\/keycloak-postgres:$TAG_NAME/" $i/Dockerfile
done
