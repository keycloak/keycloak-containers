FROM jboss/keycloak:1.1.0.Beta2
MAINTAINER jpkroehling@redhat.com

RUN echo 'JAVA_OPTS="$JAVA_OPTS -Dkeycloak.import=/opt/jboss/keycloak/testrealm.json"' >> /opt/jboss/wildfly/bin/standalone.conf
ADD files/testrealm.json /opt/jboss/keycloak/testrealm.json

# KEYCLOAK-872 - Because of this issue, the main server image is affected, so, the next line was moved to there
#ADD files/keycloak-standalone-wildfly-8.2.0.Final.xml /opt/jboss/wildfly/standalone/configuration/standalone.xml

ADD files/wars/ /opt/jboss/wildfly/standalone/deployments/
