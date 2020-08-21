FROM registry.access.redhat.com/ubi8-minimal

ENV NAME keycloak-gatekeeper
ENV KEYCLOAK_VERSION 11.0.1
ENV GOOS linux
ENV GOARCH amd64

LABEL Name=keycloak-gatekeeper \
      Release=https://github.com/keycloak/keycloak-gatekeeper \
      Url=https://github.com/keycloak/keycloak-gatekeeper \
      Help=https://issues.jboss.org/projects/KEYCLOAK

USER root

WORKDIR "/opt/gatekeeper"

RUN echo "gatekeeper:x:1000:gatekeeper" >> /etc/group
RUN echo "gatekeeper:x:1000:1000:gatekeeper user:/opt/gatekeeper:/sbin/nologin" >> /etc/passwd
RUN chown -R gatekeeper:gatekeeper /opt/gatekeeper && chmod -R g+rw /opt/gatekeeper

RUN microdnf update -y && microdnf install -y ca-certificates tar gzip

RUN curl -fssL "https://downloads.jboss.org/keycloak/$KEYCLOAK_VERSION/gatekeeper/$NAME-$GOOS-$GOARCH.tar.gz" | tar -xz && chmod +x /opt/gatekeeper/$NAME

RUN microdnf remove -y tar gzip && microdnf clean all

USER 1000

ENTRYPOINT [ "/opt/gatekeeper/keycloak-gatekeeper" ]
