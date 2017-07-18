#!/bin/bash

exec java -Xbootclasspath/p:/opt/jboss/keycloak-proxy/lib/alpn-boot.jar -jar /opt/jboss/keycloak-proxy/bin/launcher.jar $@
exit $?
