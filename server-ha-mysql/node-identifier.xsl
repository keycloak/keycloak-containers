<?xml version="1.0" encoding="UTF-8"?>

<xsl:stylesheet version="2.0"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:tx="urn:jboss:domain:transactions:3.0"
                exclude-result-prefixes="">

    <xsl:output method="xml" indent="yes"/>

    <xsl:template match="//tx:subsystem/tx:core-environment">
        <xsl:copy>
            <xsl:attribute name="node-identifier">${jboss.node.name}</xsl:attribute>
            <xsl:apply-templates select="node()|@*"/>
        </xsl:copy>
    </xsl:template>

    <xsl:template match="@*|node()">
        <xsl:copy>
            <xsl:apply-templates select="@*|node()"/>
        </xsl:copy>
    </xsl:template>

</xsl:stylesheet>
