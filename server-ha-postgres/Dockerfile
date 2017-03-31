FROM jboss/keycloak-postgres:latest

ENV KEYCLOAK_DIR /opt/jboss/keycloak

USER root
RUN chown -R 1000:0 ${KEYCLOAK_DIR} && chmod -R ug+rw ${KEYCLOAK_DIR}
USER jboss

CMD ["-b", "0.0.0.0", "--server-config", "standalone-ha.xml"]
