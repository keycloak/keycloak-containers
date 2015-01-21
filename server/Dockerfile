FROM jboss/keycloak-adapter-wildfly:1.1.0.Beta2
MAINTAINER jpkroehling@redhat.com

# KEYCLOAK-872 - The adapter itself contains server code, so, we don't need to copy it here
#RUN cp -R /opt/jboss/keycloak/deployments/* /opt/jboss/wildfly/standalone/deployments/
ADD files/keycloak-standalone-wildfly-8.2.0.Final.xml /opt/jboss/wildfly/standalone/configuration/standalone.xml
