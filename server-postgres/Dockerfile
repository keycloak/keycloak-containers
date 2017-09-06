FROM jboss/keycloak:latest

ENV POSTGRES_JDBC_VERSION 42.1.4

ADD changeDatabase.xsl /opt/jboss/keycloak/

RUN java -jar /usr/share/java/saxon.jar -s:/opt/jboss/keycloak/standalone/configuration/standalone.xml -xsl:/opt/jboss/keycloak/changeDatabase.xsl -o:/opt/jboss/keycloak/standalone/configuration/standalone.xml
RUN java -jar /usr/share/java/saxon.jar -s:/opt/jboss/keycloak/standalone/configuration/standalone-ha.xml -xsl:/opt/jboss/keycloak/changeDatabase.xsl -o:/opt/jboss/keycloak/standalone/configuration/standalone-ha.xml
RUN rm /opt/jboss/keycloak/changeDatabase.xsl

RUN mkdir -p /opt/jboss/keycloak/modules/system/layers/base/org/postgresql/jdbc/main && \
  cd /opt/jboss/keycloak/modules/system/layers/base/org/postgresql/jdbc/main && \
  curl -L http://central.maven.org/maven2/org/postgresql/postgresql/$POSTGRES_JDBC_VERSION/postgresql-$POSTGRES_JDBC_VERSION.jar > postgres-jdbc.jar
ADD module.xml /opt/jboss/keycloak/modules/system/layers/base/org/postgresql/jdbc/main/