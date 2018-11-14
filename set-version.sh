#!/bin/bash

KEYCLOAK_VERSION=$1

for i in adapter-wildfly examples server gatekeeper; do
	sed -i "s/ENV KEYCLOAK_VERSION .*/ENV KEYCLOAK_VERSION $KEYCLOAK_VERSION/" $i/Dockerfile
done
