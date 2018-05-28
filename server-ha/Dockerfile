FROM jboss/keycloak:latest

ADD docker-entrypoint-ha.sh /opt/jboss/docker-entrypoint-ha.sh

EXPOSE 55200
EXPOSE 45688

ENTRYPOINT ["/opt/jboss/docker-entrypoint-ha.sh"]

CMD ["-b", "0.0.0.0","--server-config", "standalone-ha.xml"]
