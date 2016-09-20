FROM jboss/keycloak:latest

ADD mongoConfig.xsl /opt/jboss/keycloak/

RUN java -jar /usr/share/java/saxon.jar -s:/opt/jboss/keycloak/standalone/configuration/standalone.xml -xsl:/opt/jboss/keycloak/mongoConfig.xsl -o:/opt/jboss/keycloak/standalone/configuration/standalone.xml
