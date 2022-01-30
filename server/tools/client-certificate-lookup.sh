#!/bin/bash

if [ -n "$CERTIFICATE_LOOKUP_DEFAULT_PROVIDER" ]; then
    echo "Setting client certificate lookup provider to $CERTIFICATE_LOOKUP_DEFAULT_PROVIDER"

    echo "set certificate_lookup_provider_apache_enabled=false" >> "$JBOSS_HOME/bin/.jbossclirc"
    echo "set certificate_lookup_provider_nginx_enabled=false" >> "$JBOSS_HOME/bin/.jbossclirc"
    echo "set certificate_lookup_provider_haproxy_enabled=false" >> "$JBOSS_HOME/bin/.jbossclirc"

    sed -i "s/set certificate_lookup_provider_${CERTIFICATE_LOOKUP_DEFAULT_PROVIDER}_enabled=false/set certificate_lookup_provider_${CERTIFICATE_LOOKUP_DEFAULT_PROVIDER}_enabled=true/" "$JBOSS_HOME/bin/.jbossclirc"

    echo "set configuration_file=standalone.xml" >> "$JBOSS_HOME/bin/.jbossclirc"
    $JBOSS_HOME/bin/jboss-cli.sh --file=/opt/jboss/tools/cli/client-certificate-lookup.cli
    sed -i '$ d' "$JBOSS_HOME/bin/.jbossclirc" &> /dev/null

    echo "set configuration_file=standalone-ha.xml" >> "$JBOSS_HOME/bin/.jbossclirc"
    $JBOSS_HOME/bin/jboss-cli.sh --file=/opt/jboss/tools/cli/client-certificate-lookup.cli
    sed -i '$ d' "$JBOSS_HOME/bin/.jbossclirc" &> /dev/null
fi
