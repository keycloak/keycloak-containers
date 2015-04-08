FROM jboss/wildfly:latest

ENV KEYCLOAK_VERSION 1.2.0.Beta1

WORKDIR /opt/jboss/wildfly

RUN curl http://downloads.sourceforge.net/project/keycloak/$KEYCLOAK_VERSION/adapters/keycloak-wildfly-adapter-dist-$KEYCLOAK_VERSION.tar.gz | tar zx

WORKDIR /opt/jboss

# Standalone.xml modifications.
RUN sed -i -e 's/<extensions>/&\n        <extension module="org.keycloak.keycloak-subsystem"\/>/' $JBOSS_HOME/standalone/configuration/standalone.xml && \
    sed -i -e 's/<profile>/&\n        <subsystem xmlns="urn:jboss:domain:keycloak:1.0"\/>/' $JBOSS_HOME/standalone/configuration/standalone.xml && \
    sed -i -e 's/<security-domains>/&\n                <security-domain name="keycloak">\n                    <authentication>\n                        <login-module code="org.keycloak.adapters.jboss.KeycloakLoginModule" flag="required"\/>\n                    <\/authentication>\n                <\/security-domain>/' $JBOSS_HOME/standalone/configuration/standalone.xml
