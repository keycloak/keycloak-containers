#!/bin/bash -e

JGROUPS_DIR=$1
DB_VENDOR=$2

cd /opt/jboss/keycloak

if [ "$JGROUPS_DIR" == "TCPPING" ]; then
  [ -z "$JGROUPS_DNS_NAME" ] && export JGROUPS_DNS_NAME=jgroups-dns-ping
  while [ -z "$JGROUPS_INITIAL_HOSTS" ]; do
    sleep 1
    echo "[KEYCLOAK DOCKER IMAGE] Looking up initial hosts for DNS name: $JGROUPS_DNS_NAME"
    getent hosts $JGROUPS_DNS_NAME | tee /tmp/hosts-$JGROUPS_DNS_NAME
    export JGROUPS_INITIAL_HOSTS=$(cat /tmp/hosts-$JGROUPS_DNS_NAME | awk '{ print $1 }' | paste -sd "," - )
  done
  echo "[KEYCLOAK DOCKER IMAGE] Found initial JGroups TCPPING hosts: $JGROUPS_INITIAL_HOSTS"
  # TODO how do we get variables into cli scripts? Some blog posts recommend --properties to jboss-cli.sh but I failed with that
  export JGROUPS_INITIAL_HOSTS="$(echo $JGROUPS_INITIAL_HOSTS | sed 's/,/[7600],/g')[7600]"
  sed "s|\${JGROUPS_INITIAL_HOSTS}|${JGROUPS_INITIAL_HOSTS}|" cli/jgroups/TCPPING/tcp-ping-initial-hosts.cli > /tmp/tcp-ping-initial-hosts.cli
fi

export DB_VENDOR
bin/jboss-cli.sh --file=cli/jgroups/$JGROUPS_DIR/standalone-ha-configuration.cli
rm -rf standalone/configuration/standalone_xml_history/current/*
