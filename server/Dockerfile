FROM jboss/base-jdk:7

ENV KEYCLOAK_VERSION 1.1.0.Final

RUN cd $HOME; curl -O http://central.maven.org/maven2/org/keycloak/keycloak-appliance-dist-all/$KEYCLOAK_VERSION/keycloak-appliance-dist-all-$KEYCLOAK_VERSION.zip; unzip keycloak-appliance-dist-all-$KEYCLOAK_VERSION.zip; mv $HOME/keycloak-appliance-dist-all-$KEYCLOAK_VERSION/keycloak $HOME/keycloak; rm -rf $HOME/keycloak-appliance-dist-all-$KEYCLOAK_VERSION.zip; rm -rf $HOME/keycloak-appliance-dist-all-$KEYCLOAK_VERSION

ENV JBOSS_HOME /opt/jboss/keycloak

EXPOSE 8080

CMD ["/opt/jboss/keycloak/bin/standalone.sh", "-b", "0.0.0.0"]
