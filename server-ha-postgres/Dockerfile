FROM jboss/keycloak-postgres:latest

WORKDIR /opt/jboss
ADD src/NetInfo.java .

RUN sed -i 's/\$@/\$\(eval "echo \$@"\)/' /opt/jboss/docker-entrypoint.sh \
  && $JAVA_HOME/bin/javac NetInfo.java

CMD ["-b", "0.0.0.0", "--server-config", "standalone-ha.xml", "-Djboss.bind.address.private=$(java NetInfo $KEYCLOAK_HA_MULTICAST_NETS)"]
