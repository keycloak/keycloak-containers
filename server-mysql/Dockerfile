FROM jboss/keycloak:latest

ADD change-database.txt /opt/jboss/keycloak
RUN /opt/jboss/keycloak/bin/jboss-cli.sh --file=/opt/jboss/keycloak/change-database.txt; \
    sed -i -e 's/standalone/standalone-ha/' /opt/jboss/keycloak/change-database.txt; \
    /opt/jboss/keycloak/bin/jboss-cli.sh --file=/opt/jboss/keycloak/change-database.txt;
RUN rm -rf /opt/jboss/keycloak/standalone/configuration/standalone_xml_history/current/*

RUN mkdir -p /opt/jboss/keycloak/modules/system/layers/base/com/mysql/jdbc/main; cd /opt/jboss/keycloak/modules/system/layers/base/com/mysql/jdbc/main && curl -O http://central.maven.org/maven2/mysql/mysql-connector-java/5.1.18/mysql-connector-java-5.1.18.jar
ADD module.xml /opt/jboss/keycloak/modules/system/layers/base/com/mysql/jdbc/main/
