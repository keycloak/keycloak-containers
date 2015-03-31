<?xml version="1.0" encoding="UTF-8"?>

<xsl:stylesheet version="2.0"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:ds="urn:jboss:domain:datasources:2.0"
                xmlns:ispn="urn:jboss:domain:infinispan:2.0">

    <xsl:output method="xml" indent="yes"/>

    <xsl:template match="//ds:subsystem/ds:datasources/ds:datasource[@jndi-name='java:jboss/datasources/KeycloakDS']">
        <datasource jndi-name="java:jboss/datasources/KeycloakDS" enabled="true" use-java-context="true" pool-name="KeycloakDS" use-ccm="true">
            <connection-url>jdbc:postgresql://${env.POSTGRES_PORT_5432_TCP_ADDR}:${env.POSTGRES_PORT_5432_TCP_PORT:5432}/${env.POSTGRES_DATABASE:keycloak}</connection-url>
            <driver>postgresql</driver>
            <security>
                <user-name>${env.POSTGRES_USERNAME:keycloak}</user-name>
                <password>${env.POSTGRES_PASSWORD:password}</password>
            </security>
            <validation>
                <check-valid-connection-sql>SELECT 1</check-valid-connection-sql>
                <background-validation>true</background-validation>
                <background-validation-millis>60000</background-validation-millis>
            </validation>
            <pool>
                <flush-strategy>IdleConnections</flush-strategy>
            </pool>
        </datasource>
    </xsl:template>

    <xsl:template match="//ds:subsystem/ds:datasources/ds:drivers">
        <xsl:copy>
            <xsl:apply-templates select="node()|@*"/>
                <driver name="postgresql" module="org.postgresql.jdbc">
                    <xa-datasource-class>org.postgresql.xa.PGXADataSource</xa-datasource-class>
                </driver>
        </xsl:copy>
    </xsl:template>

    <xsl:template match="//ispn:subsystem">
        <xsl:copy>
            <xsl:apply-templates select="node()|@*"/>
                <cache-container name="keycloak" jndi-name="infinispan/Keycloak" start="EAGER">
                    <transport lock-timeout="60000"/>
                    <invalidation-cache name="realms" mode="SYNC"/>
                    <invalidation-cache name="users" mode="SYNC"/>
                    <distributed-cache name="sessions" mode="SYNC" owners="1" />
                    <distributed-cache name="loginFailures" mode="SYNC" owners="1" />
                </cache-container>
        </xsl:copy>
  </xsl:template>

    <xsl:template match="@*|node()">
        <xsl:copy>
            <xsl:apply-templates select="@*|node()"/>
        </xsl:copy>
    </xsl:template>

</xsl:stylesheet>

