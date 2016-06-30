FROM jboss/base-jdk:8

ENV KEYCLOAK_VERSION 2.0.0.Final
ENV JBOSS_HOME /opt/jboss/keycloak-demo/keycloak
ENV MAVEN_VERSION 3.3.9
# Enables signals getting passed from startup script to JVM
# ensuring clean shutdown when container is stopped.
ENV LAUNCH_JBOSS_IN_BACKGROUND 1

USER root

RUN curl -fsSL https://archive.apache.org/dist/maven/maven-3/$MAVEN_VERSION/binaries/apache-maven-$MAVEN_VERSION-bin.tar.gz | tar xzf - -C /usr/share \
  && mv /usr/share/apache-maven-$MAVEN_VERSION /usr/share/maven \
  && ln -s /usr/share/maven/bin/mvn /usr/bin/mvn

ENV MAVEN_HOME /usr/share/maven

USER jboss

RUN cd /opt/jboss && curl -s http://downloads.jboss.org/keycloak/$KEYCLOAK_VERSION/keycloak-demo-$KEYCLOAK_VERSION.zip -o tmp.zip && unzip tmp.zip -d . && mv /opt/jboss/keycloak-demo-$KEYCLOAK_VERSION /opt/jboss/keycloak-demo

RUN mvn package -f /opt/jboss/keycloak-demo/examples/preconfigured-demo/pom.xml && rm -rf ~/.m2/repository
RUN cd /opt/jboss/keycloak-demo/examples/preconfigured-demo && find -name *.war | grep -v ear | xargs -I {} cp {} /opt/jboss/keycloak-demo/keycloak/standalone/deployments/ && cp /opt/jboss/keycloak-demo/examples/preconfigured-demo/testrealm.json /opt/jboss/keycloak-demo/keycloak/

ADD docker-entrypoint.sh /opt/jboss/

EXPOSE 8080

ENTRYPOINT [ "/opt/jboss/docker-entrypoint.sh" ]

CMD ["-b", "0.0.0.0", "-bmanagement", "0.0.0.0", "-Dkeycloak.import=/opt/jboss/keycloak-demo/keycloak/testrealm.json"]