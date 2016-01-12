FROM jboss/keycloak-postgres:latest

ADD start.sh /opt/jboss/keycloak/bin/

USER root
RUN chmod 755 /opt/jboss/keycloak/bin/start.sh; chown jboss:jboss /opt/jboss/keycloak/bin/start.sh
USER jboss

CMD ["/opt/jboss/keycloak/bin/start.sh"]
