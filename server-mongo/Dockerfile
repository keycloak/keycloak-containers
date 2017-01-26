FROM jboss/keycloak:2.5.1.Final

ADD mongo-configure.cli /opt/jboss/keycloak/

RUN /opt/jboss/keycloak/bin/jboss-cli.sh --file=/opt/jboss/keycloak/mongo-configure.cli
