#!/bin/bash -e

JGROUPS_PROTOCOL=$1

cd /opt/jboss/keycloak

bin/jboss-cli.sh --file=cli/jgroups/standalone-ha-configuration.cli
rm -rf standalone/configuration/standalone_xml_history/current/*
