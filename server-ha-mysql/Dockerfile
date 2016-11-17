FROM jboss/keycloak-mysql:latest

CMD ["-b", "0.0.0.0", "--server-config", "standalone-ha.xml"]

RUN rm keycloak/standalone/configuration/standalone.xml

ADD jgroups-tcp-jdbc.xsl /opt/jboss/keycloak/
RUN cp /opt/jboss/keycloak/standalone/configuration/standalone-ha.xml /tmp/standalone-ha.xml \
  && java -jar /usr/share/java/saxon.jar -s:/opt/jboss/keycloak/standalone/configuration/standalone-ha.xml \
    -xsl:/opt/jboss/keycloak/jgroups-tcp-jdbc.xsl -o:/opt/jboss/keycloak/standalone/configuration/standalone-ha.xml \
  && rm /opt/jboss/keycloak/jgroups-tcp-jdbc.xsl \
  #&& diff -u /tmp/standalone-ha.xml /opt/jboss/keycloak/standalone/configuration/standalone-ha.xml \
  && rm /tmp/standalone-ha.xml
