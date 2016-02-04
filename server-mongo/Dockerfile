FROM jboss/keycloak:1.9.0.CR1

ADD changeDatabase.jq /opt/jboss/keycloak/

RUN INPUT=`cat /opt/jboss/keycloak/standalone/configuration/keycloak-server.json` && echo $INPUT | jq -f /opt/jboss/keycloak/changeDatabase.jq > /opt/jboss/keycloak/standalone/configuration/keycloak-server.json
