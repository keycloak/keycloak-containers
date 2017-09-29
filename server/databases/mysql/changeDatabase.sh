#!/bin/bash

java -jar /usr/share/java/saxon.jar -s:/opt/jboss/keycloak/standalone/configuration/standalone.xml -xsl:/opt/jboss/keycloak/databases/mysql/changeDatabase.xsl -o:/opt/jboss/keycloak/standalone/configuration/standalone.xml; java -jar /usr/share/java/saxon.jar -s:/opt/jboss/keycloak/standalone/configuration/standalone-ha.xml -xsl:/opt/jboss/keycloak/databases/mysql/changeDatabase.xsl -o:/opt/jboss/keycloak/standalone/configuration/standalone-ha.xml
mkdir -p /opt/jboss/keycloak/modules/system/layers/base/com/mysql/jdbc/main/
cp /opt/jboss/keycloak/databases/mysql/module.xml  /opt/jboss/keycloak/modules/system/layers/base/com/mysql/jdbc/main/
