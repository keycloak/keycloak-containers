FROM jboss/keycloak:3.0.0.Final

ADD mongo-configure.cli /opt/jboss/keycloak/

RUN /opt/jboss/keycloak/bin/jboss-cli.sh --file=/opt/jboss/keycloak/mongo-configure.cli
