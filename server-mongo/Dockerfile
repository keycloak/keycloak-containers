FROM jboss/keycloak:2.2.0.Final

ADD changeDatabase.jq /opt/jboss/keycloak/

RUN INPUT=`cat /opt/jboss/keycloak/standalone/configuration/keycloak-server.json` && echo $INPUT | jq -f /opt/jboss/keycloak/changeDatabase.jq > /opt/jboss/keycloak/standalone/configuration/keycloak-server.json
