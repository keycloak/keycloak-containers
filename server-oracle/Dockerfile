FROM jboss/keycloak:4.0.0.Final

ENV DB_VENDOR ORACLE
RUN mkdir -p /opt/jboss/keycloak/modules/system/layers/base/com/oracle/jdbc/main
ADD database-module/module.xml /opt/jboss/keycloak/modules/system/layers/base/com/oracle/jdbc/main
ADD cli/ /opt/jboss/keycloak/cli/databases/oracle
ADD docker-entrypoint.sh /opt/jboss/
VOLUME /opt/jboss/keycloak/modules/system/layers/base/com/oracle/jdbc/main/ojdbc8.jar