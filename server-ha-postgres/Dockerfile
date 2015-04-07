FROM jboss/base-jdk:7

ENV KEYCLOAK_VERSION 1.2.0.Beta1

RUN cd $HOME; curl -O http://central.maven.org/maven2/org/keycloak/keycloak-appliance-dist-all/$KEYCLOAK_VERSION/keycloak-appliance-dist-all-$KEYCLOAK_VERSION.zip; unzip keycloak-appliance-dist-all-$KEYCLOAK_VERSION.zip; mv $HOME/keycloak-appliance-dist-all-$KEYCLOAK_VERSION/keycloak $HOME/keycloak; rm -rf $HOME/keycloak-appliance-dist-all-$KEYCLOAK_VERSION.zip; rm -rf $HOME/keycloak-appliance-dist-all-$KEYCLOAK_VERSION

RUN mkdir -p /opt/jboss/keycloak/modules/system/layers/base/org/postgresql/jdbc/main; cd /opt/jboss/keycloak/modules/system/layers/base/org/postgresql/jdbc/main; curl -O http://central.maven.org/maven2/org/postgresql/postgresql/9.3-1102-jdbc3/postgresql-9.3-1102-jdbc3.jar
ADD module.xml /opt/jboss/keycloak/modules/system/layers/base/org/postgresql/jdbc/main/

ADD update-standalone-ha.xsl /opt/jboss/keycloak/
RUN java -jar /usr/share/java/saxon.jar -s:/opt/jboss/keycloak/standalone/configuration/standalone-ha.xml -xsl:/opt/jboss/keycloak/update-standalone-ha.xsl -o:/opt/jboss/keycloak/standalone/configuration/standalone-ha.xml; rm /opt/jboss/keycloak/update-standalone-ha.xsl

ADD keycloak-server.json /opt/jboss/keycloak/standalone/configuration/
ADD start.sh /opt/jboss/keycloak/bin/

USER root
RUN chmod 755 /opt/jboss/keycloak/bin/start.sh; chown jboss:jboss /opt/jboss/keycloak/bin/start.sh
USER jboss

ENV JBOSS_HOME /opt/jboss/keycloak

EXPOSE 8080

CMD ["/opt/jboss/keycloak/bin/start.sh"]
