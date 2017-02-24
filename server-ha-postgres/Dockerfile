FROM jboss/keycloak-postgres:latest

RUN sed -i 's/\$@/\$\(eval "echo \$@"\)/' /opt/jboss/docker-entrypoint.sh

CMD ["-b", "0.0.0.0", "--server-config", "standalone-ha.xml", "-Djboss.bind.address.private=$(hostname -i)"]
