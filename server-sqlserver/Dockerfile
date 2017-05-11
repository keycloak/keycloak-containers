FROM jboss/keycloak:latest

ADD changeDatabase.xsl /opt/jboss/keycloak/
RUN mkdir -p /opt/jboss/keycloak/modules/system/layers/base/net/sourceforge/jtds/main; cd /opt/jboss/keycloak/modules/system/layers/base/net/sourceforge/jtds/main; curl -O http://central.maven.org/maven2/net/sourceforge/jtds/jtds/1.3.1/jtds-1.3.1.jar
ADD module.xml /opt/jboss/keycloak/modules/system/layers/base/net/sourceforge/jtds/main/
RUN java -jar /usr/share/java/saxon.jar -s:/opt/jboss/keycloak/standalone/configuration/standalone.xml -xsl:/opt/jboss/keycloak/changeDatabase.xsl -o:/opt/jboss/keycloak/standalone/configuration/standalone.xml; java -jar /usr/share/java/saxon.jar -s:/opt/jboss/keycloak/standalone/configuration/standalone-ha.xml -xsl:/opt/jboss/keycloak/changeDatabase.xsl -o:/opt/jboss/keycloak/standalone/configuration/standalone-ha.xml; rm /opt/jboss/keycloak/changeDatabase.xsl
