FROM jboss/keycloak:latest

ENV POSTGRES_JDBC_VERSION 42.1.4

ADD change-database.txt /opt/jboss/keycloak

RUN /opt/jboss/keycloak/bin/jboss-cli.sh --file=/opt/jboss/keycloak/change-database.txt; \
    sed -i -e 's/standalone/standalone-ha/' /opt/jboss/keycloak/change-database.txt; \
    /opt/jboss/keycloak/bin/jboss-cli.sh --file=/opt/jboss/keycloak/change-database.txt;
    
RUN rm -rf /opt/jboss/keycloak/standalone/configuration/standalone_xml_history/current/*; \
    rm -rf /opt/jboss/keycloak/change-database.txt

RUN mkdir -p /opt/jboss/keycloak/modules/system/layers/base/org/postgresql/jdbc/main && \
  cd /opt/jboss/keycloak/modules/system/layers/base/org/postgresql/jdbc/main && \
  curl -L http://central.maven.org/maven2/org/postgresql/postgresql/$POSTGRES_JDBC_VERSION/postgresql-$POSTGRES_JDBC_VERSION.jar > postgres-jdbc.jar
ADD module.xml /opt/jboss/keycloak/modules/system/layers/base/org/postgresql/jdbc/main/
