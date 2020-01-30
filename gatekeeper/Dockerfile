FROM alpine:3.8

ENV NAME keycloak-gatekeeper
ENV KEYCLOAK_VERSION 8.0.2
ENV GOOS linux
ENV GOARCH amd64

LABEL Name=keycloak-gatekeeper \
      Release=https://github.com/keycloak/keycloak-gatekeeper \
      Url=https://github.com/keycloak/keycloak-gatekeeper \
      Help=https://issues.jboss.org/projects/KEYCLOAK

RUN adduser -D -u 1000 gatekeeper

RUN apk add --no-cache ca-certificates curl tar

WORKDIR "/opt"

RUN curl -fssL "https://downloads.jboss.org/keycloak/$KEYCLOAK_VERSION/gatekeeper/$NAME-$GOOS-$GOARCH.tar.gz" | tar -xz && chmod +x /opt/$NAME

RUN apk del curl tar

USER 1000

ENTRYPOINT [ "/opt/keycloak-gatekeeper" ]
