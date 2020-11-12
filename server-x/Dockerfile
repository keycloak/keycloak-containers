FROM registry.access.redhat.com/ubi8-minimal AS build-env

ARG KEYCLOAK_VERSION=11.0.0
ARG KEYCLOAK_DIST=https://downloads.jboss.org/keycloak/$KEYCLOAK_VERSION/keycloak.x-$KEYCLOAK_VERSION.tar.gz

RUN microdnf install -y tar gzip && \
    mkdir /opt/jboss && \ 
    cd /opt/jboss && \
    curl -L $KEYCLOAK_DIST | tar zx && \
    mv keycloak.x* keycloak
    
ADD tools /opt/jboss/tools

FROM registry.access.redhat.com/ubi8-minimal

COPY --from=build-env /opt/jboss /opt/jboss
COPY probes /probes

RUN microdnf update -y && \
    microdnf install -y java-11-openjdk-headless && microdnf clean all && rm -rf /var/cache/yum/* && \
    echo "jboss:x:0:root" >> /etc/group && \
    echo "jboss:x:1000:0:JBoss user:/opt/jboss:/sbin/nologin" >> /etc/passwd && \
    chown -R jboss:root /opt/jboss && \
    chmod -R g+rwX /opt/jboss

USER 1000

EXPOSE 8080
EXPOSE 8443

ENTRYPOINT [ "/opt/jboss/tools/docker-entrypoint.sh" ]
