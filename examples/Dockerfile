FROM jboss/base-jdk:7

ENV KEYCLOAK_VERSION 1.2.0.Final
ENV JBOSS_HOME /opt/jboss/keycloak-demo/keycloak

USER root

RUN yum -y install maven && yum clean all

USER jboss

RUN cd /opt/jboss && curl -L http://sourceforge.net/projects/keycloak/files/$KEYCLOAK_VERSION/keycloak-demo-$KEYCLOAK_VERSION.tar.gz/download | tar zx && mv /opt/jboss/keycloak-demo-$KEYCLOAK_VERSION /opt/jboss/keycloak-demo

RUN mvn package -f /opt/jboss/keycloak-demo/examples/preconfigured-demo/pom.xml && rm -rf ~/.m2/repository
RUN cd /opt/jboss/keycloak-demo/examples/preconfigured-demo && find -name *.war | grep -v ear | xargs -I {} cp {} /opt/jboss/keycloak-demo/keycloak/standalone/deployments/ && cp /opt/jboss/keycloak-demo/examples/preconfigured-demo/testrealm.json /opt/jboss/keycloak-demo/keycloak/

EXPOSE 8080
CMD ["/opt/jboss/keycloak-demo/keycloak/bin/standalone.sh", "-b", "0.0.0.0", "-Dkeycloak.import=/opt/jboss/keycloak-demo/keycloak/testrealm.json"]
