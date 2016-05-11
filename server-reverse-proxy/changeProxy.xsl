<?xml version="1.0" encoding="UTF-8"?>

<xsl:stylesheet version="2.0"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

    <xsl:output method="xml" indent="yes"/>

    <xsl:template match="@*|node()">
        <xsl:copy>
            <xsl:apply-templates select="@*|node()"/>
        </xsl:copy>
    </xsl:template>

	<!-- Enable proxy address forwarding -->
    <xsl:template xmlns="urn:jboss:domain:undertow:3.0" xmlns:ut="urn:jboss:domain:undertow:3.0" match="//ut:subsystem/ut:server/ut:http-listener">
		<http-listener proxy-address-forwarding="true">
			<xsl:apply-templates select="@*|node()"/>
		</http-listener>
    </xsl:template>

	<!-- Enable SSL on a Reverse Proxy -->
    <xsl:template xmlns:dm="urn:jboss:domain:4.0" match="//dm:server/dm:socket-binding-group/dm:socket-binding[@name='https']/@port">
		<xsl:attribute name="port">
			<xsl:text>${jboss.https.port:443}</xsl:text>
		</xsl:attribute>
    </xsl:template>

	<!-- Bind Keycloak to the ROOT context -->
    <xsl:template xmlns="urn:jboss:domain:undertow:3.0" xmlns:ut="urn:jboss:domain:undertow:3.0" match="//ut:subsystem/ut:server/ut:host">
		<host default-web-module="keycloak-server.war">
			<xsl:apply-templates select="@*|node()"/>
		</host>
    </xsl:template>
</xsl:stylesheet>