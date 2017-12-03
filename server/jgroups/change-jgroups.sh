#!/bin/bash -e

JGROUPS_PROTOCOL=$1

cd /opt/jboss/keycloak

bin/jboss-cli.sh --file=cli/jgroups/$JGROUPS_PROTOCOL/standalone-configuration.cli
rm -rf /opt/jboss/keycloak/standalone/configuration/standalone_xml_history

bin/jboss-cli.sh --file=cli/jgroups/$JGROUPS_PROTOCOL/standalone-ha-configuration.cli
rm -rf standalone/configuration/standalone_xml_history/current/*