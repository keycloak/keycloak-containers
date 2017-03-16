FROM jboss/keycloak:latest

ADD mongo-configure.cli /opt/jboss/keycloak/

RUN /opt/jboss/keycloak/bin/jboss-cli.sh --file=/opt/jboss/keycloak/mongo-configure.cli

# We need to clean up config history, otherwise jboss won't start.
RUN rm -rf /opt/jboss/keycloak/standalone/configuration/standalone_xml_history/*

