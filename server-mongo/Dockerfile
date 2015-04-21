FROM jboss/keycloak:1.2.0.Beta1

USER root
WORKDIR /opt/jboss

ADD changeDatabase.jq /opt/jboss/keycloak/

RUN yum install -y jq && cat keycloak/standalone/configuration/keycloak-server.json | jq -f keycloak/changeDatabase.jq > keycloak/standalone/configuration/keycloak-server.json
