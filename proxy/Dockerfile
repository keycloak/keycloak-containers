FROM jboss/base-jdk:8

ENV KEYCLOAK_VERSION 4.0.0.Beta2
USER jboss
RUN cd /opt/jboss/ && curl -L https://downloads.jboss.org/keycloak/${KEYCLOAK_VERSION}/keycloak-proxy-${KEYCLOAK_VERSION}.zip | jar xvf /dev/stdin && mv /opt/jboss/keycloak-proxy-${KEYCLOAK_VERSION} /opt/jboss/keycloak-proxy
ADD docker-entrypoint.sh /opt/jboss/
RUN curl http://central.maven.org/maven2/org/mortbay/jetty/alpn/alpn-boot/8.1.11.v20170118/alpn-boot-8.1.11.v20170118.jar -o /opt/jboss/keycloak-proxy/lib/alpn-boot.jar
VOLUME /opt/jboss/conf
EXPOSE 8080
ENTRYPOINT [ "/opt/jboss/docker-entrypoint.sh" ]
CMD ["/opt/jboss/conf/proxy.json"]
