#!/bin/bash -e

JGROUPS_DIR=$1

cd /opt/jboss/keycloak

bin/jboss-cli.sh --file=cli/jgroups/$JGROUPS_DIR/standalone-ha-configuration.cli
rm -rf standalone/configuration/standalone_xml_history/current/*
