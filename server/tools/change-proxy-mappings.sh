#!/bin/bash -e

cd /opt/jboss/keycloak

bin/jboss-cli.sh --file=/opt/jboss/tools/cli/proxy-mappings.cli
rm -rf /opt/jboss/keycloak/standalone/configuration/standalone_xml_history
