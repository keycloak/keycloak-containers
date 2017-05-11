FROM jboss/keycloak-postgres:latest

CMD ["-b", "0.0.0.0", "--server-config", "standalone-ha.xml"]

ADD docker-entrypoint.sh /opt/jboss/

RUN rm keycloak/standalone/configuration/standalone.xml
