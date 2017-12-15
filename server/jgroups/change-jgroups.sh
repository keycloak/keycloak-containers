#!/bin/bash -e

JGROUPS_DIR=$1

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

  export JGROUPS_INITIAL_HOSTS="$(echo $JGROUPS_INITIAL_HOSTS | sed 's/,/[7600],/g')[7600]"

  bin/jboss-cli.sh <<__EOF
    embed-server --server-config=standalone-ha.xml --std-out=echo
    run-batch --file=cli/jgroups/tcp-stack.cli
    run-batch --file=cli/jgroups/interface-private-eth0.cli
    run-batch --file=cli/jgroups/mping-remove.cli
    batch
    /subsystem=jgroups/stack=tcp/protocol=TCPPING:add(add-index=0,properties=[ \
      initial_hosts="${JGROUPS_INITIAL_HOSTS}" \
    ])
    run-batch
    stop-embedded-server
__EOF

else

  bin/jboss-cli.sh --file=cli/jgroups/$JGROUPS_DIR/standalone-ha-configuration.cli
  rm -rf standalone/configuration/standalone_xml_history/current/*

fi
