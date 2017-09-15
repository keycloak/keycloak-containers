#!/usr/bin/env bash

KEYCLOAK_VERSION=${1:-3.3.0.CR2}
GIT_SHA=$(git log -n1 | head -n1 | cut -c8-16)

wget --timestamping https://downloads.jboss.org/keycloak/$KEYCLOAK_VERSION/keycloak-$KEYCLOAK_VERSION.tar.gz

tar xvf keycloak-$KEYCLOAK_VERSION.tar.gz --strip=3 \
    keycloak-$KEYCLOAK_VERSION/standalone/configuration/standalone-ha.xml \
    keycloak-$KEYCLOAK_VERSION/standalone/configuration/standalone.xml

cd server

docker build -t jboss/keycloak:$GIT_SHA .

echo "Extracting standalone.xml"

docker run --rm --interactive --tty --entrypoint=/usr/bin/cat \
       jboss/keycloak:$GIT_SHA \
       /opt/jboss/keycloak/standalone/configuration/standalone.xml > /tmp/standalone.xml

echo "Extracting standalone-ha.xml"

docker run --rm --interactive --tty --entrypoint=/usr/bin/cat \
       jboss/keycloak:$GIT_SHA \
       /opt/jboss/keycloak/standalone/configuration/standalone-ha.xml > /tmp/standalone-ha.xml

cd ..

echo "Comparing jboss/keycloak - standalone.xml"
diff -u -b standalone.xml /tmp/standalone.xml

echo "Comparing jboss/keycloak - standalone-ha.xml"
diff -u -b standalone-ha.xml /tmp/standalone-ha.xml

