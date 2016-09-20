<?xml version="1.0" encoding="UTF-8"?>

<xsl:stylesheet version="2.0"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:server="urn:jboss:domain:keycloak-server:1.1"
                exclude-result-prefixes="server">

    <xsl:output method="xml" indent="yes"/>

    <xsl:template match="node()|@*">
        <xsl:copy>
            <xsl:apply-templates select="node()|@*"/>
        </xsl:copy>
    </xsl:template>

    <xsl:template match="server:spi[@name='eventsStore']">
        <spi name="eventsStore" xmlns="urn:jboss:domain:keycloak-server:1.1">
            <default-provider>mongo</default-provider>
            <provider name="mongo" enabled="true">
                <properties>
                    <property name="exclude-events" value="[&quot;REFRESH_TOKEN&quot;]"/>
                </properties>
            </provider>
        </spi>
    </xsl:template>  

    <xsl:template match="server:spi[@name='userFederatedStorage']">
        <spi name="userFederatedStorage" xmlns="urn:jboss:domain:keycloak-server:1.1">
            <provider name="jpa" enabled="false"/>
        </spi>
    </xsl:template>    

    <xsl:template match="server:spi[@name='realm']/server:default-provider/text()">mongo</xsl:template>
    <xsl:template match="server:spi[@name='user']/server:default-provider/text()">mongo</xsl:template>
    <xsl:template match="server:spi[@name='userSessionPersister']/server:default-provider/text()">mongo</xsl:template>
    <xsl:template match="server:spi[@name='authorizationPersister']/server:default-provider/text()">mongo</xsl:template>

    <xsl:template match="server:spi[@name='connectionsJpa']">
        <spi name="connectionsMongo" xmlns="urn:jboss:domain:keycloak-server:1.1">
            <provider name="default" enabled="true">
                <properties>
                    <property name="host" value="${{env.MONGO_PORT_27017_TCP_ADDR}}"/>
                    <property name="port" value="27017"/>
                    <property name="db" value="${{env.MONGODB_DBNAME:keycloak}}"/>
                    <property name="connectionsPerHost" value="100"/>
                    <property name="migrationStrategy" value="update"/>
                    <property name="databaseSchema" value="update"/>
                </properties>
            </provider>
        </spi>
    </xsl:template>      

</xsl:stylesheet>