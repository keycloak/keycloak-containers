FROM amoevo/keycloak-postgres:latest

ENV DB_VENDOR postgres
ENV JGROUPS_PROTOCOL kubernetes

CMD ["-b", "0.0.0.0", "--server-config", "standalone-ha.xml"]
