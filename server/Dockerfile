FROM jboss/base-jdk:8

ENV KEYCLOAK_VERSION 3.4.1.Final
# Enables signals getting passed from startup script to JVM
# ensuring clean shutdown when container is stopped.
ENV LAUNCH_JBOSS_IN_BACKGROUND 1
ENV PROXY_ADDRESS_FORWARDING false
USER root

RUN yum install -y epel-release && yum install -y jq && yum clean all

USER jboss

RUN cd /opt/jboss/ && curl -L https://downloads.jboss.org/keycloak/$KEYCLOAK_VERSION/keycloak-$KEYCLOAK_VERSION.tar.gz | tar zx && mv /opt/jboss/keycloak-$KEYCLOAK_VERSION /opt/jboss/keycloak

ADD docker-entrypoint.sh /opt/jboss/

ADD cli /opt/jboss/keycloak/cli
RUN cd /opt/jboss/keycloak && bin/jboss-cli.sh --file=cli/standalone-configuration.cli && rm -rf /opt/jboss/keycloak/standalone/configuration/standalone_xml_history
RUN cd /opt/jboss/keycloak && bin/jboss-cli.sh --file=cli/standalone-ha-configuration.cli && rm -rf /opt/jboss/keycloak/standalone-ha/configuration/standalone_xml_history

ENV JDBC_POSTGRES_VERSION 42.1.4
ENV JDBC_MYSQL_VERSION 5.1.18

ADD databases/change-database.sh /opt/jboss/keycloak/bin/change-database.sh

RUN mkdir -p /opt/jboss/keycloak/modules/system/layers/base/com/mysql/jdbc/main; cd /opt/jboss/keycloak/modules/system/layers/base/com/mysql/jdbc/main && curl -O http://central.maven.org/maven2/mysql/mysql-connector-java/$JDBC_MYSQL_VERSION/mysql-connector-java-$JDBC_MYSQL_VERSION.jar
ADD databases/mysql/module.xml /opt/jboss/keycloak/modules/system/layers/base/com/mysql/jdbc/main/module.xml

RUN mkdir -p /opt/jboss/keycloak/modules/system/layers/base/org/postgresql/jdbc/main; cd /opt/jboss/keycloak/modules/system/layers/base/org/postgresql/jdbc/main; curl -L http://central.maven.org/maven2/org/postgresql/postgresql/$JDBC_POSTGRES_VERSION/postgresql-$JDBC_POSTGRES_VERSION.jar > postgres-jdbc.jar
ADD databases/postgres/module.xml /opt/jboss/keycloak/modules/system/layers/base/org/postgresql/jdbc/main

RUN rm -rf /opt/jboss/keycloak/standalone/configuration/standalone_xml_history
RUN rm -rf /opt/jboss/keycloak/standalone_ha/configuration/standalone_xml_history

ENV JBOSS_HOME /opt/jboss/keycloak

EXPOSE 8080

ENTRYPOINT [ "/opt/jboss/docker-entrypoint.sh" ]

CMD ["-b", "0.0.0.0"]
