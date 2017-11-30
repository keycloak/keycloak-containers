FROM jboss/wildfly:10.1.0.Final

ENV KEYCLOAK_VERSION 3.4.1.CR1

WORKDIR /opt/jboss/wildfly

RUN curl -L https://downloads.jboss.org/keycloak/$KEYCLOAK_VERSION/adapters/keycloak-oidc/keycloak-wildfly-adapter-dist-$KEYCLOAK_VERSION.tar.gz | tar zx
RUN curl -L https://downloads.jboss.org/keycloak/$KEYCLOAK_VERSION/adapters/saml/keycloak-saml-wildfly-adapter-dist-$KEYCLOAK_VERSION.tar.gz | tar zx

WORKDIR /opt/jboss

# Standalone.xml modifications.
RUN sed -i -e 's/<extensions>/&\n        <extension module="org.keycloak.keycloak-adapter-subsystem"\/>/' $JBOSS_HOME/standalone/configuration/standalone.xml && \
    sed -i -e 's/<profile>/&\n        <subsystem xmlns="urn:jboss:domain:keycloak:1.1"\/>/' $JBOSS_HOME/standalone/configuration/standalone.xml && \
    sed -i -e 's/<security-domains>/&\n                <security-domain name="keycloak">\n                    <authentication>\n                        <login-module code="org.keycloak.adapters.jboss.KeycloakLoginModule" flag="required"\/>\n                    <\/authentication>\n                <\/security-domain>/' $JBOSS_HOME/standalone/configuration/standalone.xml && \ 
    sed -i -e 's/<extensions>/&\n        <extension module="org.keycloak.keycloak-saml-adapter-subsystem"\/>/' $JBOSS_HOME/standalone/configuration/standalone.xml && \
    sed -i -e 's/<profile>/&\n        <subsystem xmlns="urn:jboss:domain:keycloak-saml:1.1"\/>/' $JBOSS_HOME/standalone/configuration/standalone.xml
