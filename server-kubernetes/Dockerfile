FROM jboss/keycloak:latest

ENV JGROUPS_VERSION 3.6.14.Final
ENV JGROUPS_PROTOCOL kubernetes

ADD jgroups/change-jgroups.sh /opt/jboss/keycloak/bin/change-jgroups.sh

RUN mkdir -p /opt/jboss/keycloak/modules/system/layers/base/org/jgroups/main; cd /opt/jboss/keycloak/modules/system/layers/base/org/jgroups/main; curl -L http://central.maven.org/maven2/org/jgroups/jgroups/$JGROUPS_VERSION/jgroups-$JGROUPS_VERSION.jar > jgroups.jar
ADD jgroups/module.xml /opt/jboss/keycloak/modules/system/layers/base/org/jgroups/main

ENV JGROUPS_K8S_VERSION 0.9.3
ENV OAUTH_VERSION 20100527

RUN mkdir -p /opt/jboss/keycloak/modules/system/layers/base/org/jgroups/kubernetes/main; cd /opt/jboss/keycloak/modules/system/layers/base/org/jgroups/kubernetes/main; curl -L http://central.maven.org/maven2/org/jgroups/kubernetes/kubernetes/$JGROUPS_K8S_VERSION/kubernetes-$JGROUPS_K8S_VERSION.jar > jgroups-kubernetes.jar
ADD jgroups/kubernetes/module.xml /opt/jboss/keycloak/modules/system/layers/base/org/jgroups/kubernetes/main

RUN mkdir -p /opt/jboss/keycloak/modules/system/layers/base/org/jgroups/kubernetes/common/main; cd /opt/jboss/keycloak/modules/system/layers/base/org/jgroups/kubernetes/common/main; curl -L http://central.maven.org/maven2/org/jgroups/kubernetes/common/$JGROUPS_K8S_VERSION/common-$JGROUPS_K8S_VERSION.jar > jgroups-kubernetes-common.jar
ADD jgroups/kubernetes/common/module.xml /opt/jboss/keycloak/modules/system/layers/base/org/jgroups/kubernetes/common/main

RUN mkdir -p /opt/jboss/keycloak/modules/system/layers/base/org/jgroups/kubernetes/dns/main; cd /opt/jboss/keycloak/modules/system/layers/base/org/jgroups/kubernetes/dns/main; curl -L http://central.maven.org/maven2/org/jgroups/kubernetes/dns/$JGROUPS_K8S_VERSION/dns-$JGROUPS_K8S_VERSION.jar > jgroups-kubernetes-dns.jar
ADD jgroups/kubernetes/dns/module.xml /opt/jboss/keycloak/modules/system/layers/base/org/jgroups/kubernetes/dns/main

RUN mkdir -p /opt/jboss/keycloak/modules/system/layers/base/net/oauth/core/main; cd /opt/jboss/keycloak/modules/system/layers/base/net/oauth/core/main; curl -L http://central.maven.org/maven2/net/oauth/core/oauth/$OAUTH_VERSION/oauth-$OAUTH_VERSION.jar > oauth-core.jar
ADD net/oauth/module.xml /opt/jboss/keycloak/modules/system/layers/base/net/oauth/core/main

ADD cli/jgroups /opt/jboss/keycloak/cli/jgroups
RUN cd /opt/jboss/keycloak && bin/jboss-cli.sh --file=cli/jgroups/standalone-ha-configuration.cli && rm -rf /opt/jboss/keycloak/standalone-ha/configuration/standalone_xml_history

RUN rm -rf /opt/jboss/keycloak/standalone/configuration/standalone_xml_history
RUN rm -rf /opt/jboss/keycloak/standalone_ha/configuration/standalone_xml_history

CMD ["-b", "0.0.0.0", "--server-config", "standalone-ha.xml"]
