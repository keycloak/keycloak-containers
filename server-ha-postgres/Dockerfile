FROM jboss/keycloak-postgres:1.3.1.Final

ADD update-standalone-ha.xsl /opt/jboss/keycloak/
RUN java -jar /usr/share/java/saxon.jar -s:/opt/jboss/keycloak/standalone/configuration/standalone-ha.xml -xsl:/opt/jboss/keycloak/update-standalone-ha.xsl -o:/opt/jboss/keycloak/standalone/configuration/standalone-ha.xml; rm /opt/jboss/keycloak/update-standalone-ha.xsl

ADD keycloak-server.json /opt/jboss/keycloak/standalone/configuration/
ADD start.sh /opt/jboss/keycloak/bin/

USER root
RUN chmod 755 /opt/jboss/keycloak/bin/start.sh; chown jboss:jboss /opt/jboss/keycloak/bin/start.sh
USER jboss

CMD ["/opt/jboss/keycloak/bin/start.sh"]
