FROM jboss/base-jdk:8

ENV KEYCLOAK_VERSION 3.3.0.CR2
# Enables signals getting passed from startup script to JVM
# ensuring clean shutdown when container is stopped.
ENV LAUNCH_JBOSS_IN_BACKGROUND 1
ENV PROXY_ADDRESS_FORWARDING false
USER root

RUN yum install -y epel-release && yum install -y jq && yum clean all

USER jboss

RUN cd /opt/jboss/ && curl -L https://downloads.jboss.org/keycloak/$KEYCLOAK_VERSION/keycloak-$KEYCLOAK_VERSION.tar.gz | tar zx && mv /opt/jboss/keycloak-$KEYCLOAK_VERSION /opt/jboss/keycloak

ADD docker-entrypoint.sh /opt/jboss/

ADD enable-logging.txt /opt/jboss/keycloak

RUN /opt/jboss/keycloak/bin/jboss-cli.sh --file=/opt/jboss/keycloak/enable-logging.txt; \
    sed -i -e 's/standalone/standalone-ha/' /opt/jboss/keycloak/enable-logging.txt; \
    /opt/jboss/keycloak/bin/jboss-cli.sh --file=/opt/jboss/keycloak/enable-logging.txt;

RUN rm -rf /opt/jboss/keycloak/standalone/configuration/standalone_xml_history/current/*; \
    rm -rf /opt/jboss/keycloak/enable-logging.txt

ENV JBOSS_HOME /opt/jboss/keycloak

#Enabling Proxy address forwarding so we can correctly handle SSL termination in front ends
#such as an OpenShift Router or Apache Proxy
RUN sed -i -e 's/<http-listener /& proxy-address-forwarding="${env.PROXY_ADDRESS_FORWARDING}" /' $JBOSS_HOME/standalone/configuration/standalone.xml

EXPOSE 8080

ENTRYPOINT [ "/opt/jboss/docker-entrypoint.sh" ]

CMD ["-b", "0.0.0.0"]
