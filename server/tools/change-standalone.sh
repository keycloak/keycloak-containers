#!/bin/bash

pwd

while [ $# -gt 0 ]
do
        key="$1"
        echo "key=$key"
        case $key in
        -c)
                CONFIG=$2
                echo "config set to: $CONFIG"
                shift
                shift
                ;;
        *)      shift # past argument
                ;;
        esac
done

if ! [ $CONFIG ];then
    echo "No -c provided. Setting to $JBOSS_CONFIG_FOLDER/standalone-ha.xml"
    CONFIG="$JBOSS_CONFIG_FOLDER/standalone-ha.xml"
else
    echo "Parameter: -c $CONFIG"
fi

if [ -f $CONFIG ];then
    echo "File exists: $CONFIG"
elif ! [ $CONFIG == "$JBOSS_CONFIG_FOLDER*" ];then
    CONFIG="$JBOSS_CONFIG_FOLDER/$CONFIG"
fi

if ! [ -f $CONFIG ];then
    echo "unable to locate file: $CONFIG"
    exit 42
fi

# *** modification ***
echo "Modifying file: $CONFIG"

NAMESPACE="urn:jboss:domain:keycloak-server:1.1"

xmlstarlet ed -L -N x="$NAMESPACE" -u '//x:subsystem/x:spi[@name="x509cert-lookup"]/x:default-provider' -v "apache" $CONFIG
xmlstarlet ed -L -N x="$NAMESPACE" -u '//x:subsystem/x:spi[@name="x509cert-lookup"]/x:provider[@name="default"]/@name' -v "apache" $CONFIG
# delete old value
xmlstarlet ed -L -N x="$NAMESPACE" -d './/x:spi[@name="x509cert-lookup"]/x:provider[@name="apache"]/x:properties' $CONFIG
xmlstarlet ed -L -N x="$NAMESPACE" -s './/x:spi[@name="x509cert-lookup"]/x:provider[@name="apache"]' -t elem -n "properties" $CONFIG
xmlstarlet ed -L -N x="$NAMESPACE" -s './/x:spi[@name="x509cert-lookup"]/x:provider[@name="apache"]/x:properties' -t elem -n "property" $CONFIG
xmlstarlet ed -L -N x="$NAMESPACE" -i '(.//x:spi[@name="x509cert-lookup"]/x:provider[@name="apache"]/x:properties/x:property)[last()]' -t attr -n "name" -v "sslClientCert" $CONFIG
xmlstarlet ed -L -N x="$NAMESPACE" -i '(.//x:spi[@name="x509cert-lookup"]/x:provider[@name="apache"]/x:properties/x:property)[last()]' -t attr -n "value" -v "ssl-client-cert" $CONFIG
xmlstarlet ed -L -N x="$NAMESPACE" -s './/x:spi[@name="x509cert-lookup"]/x:provider[@name="apache"]/x:properties' -t elem -n "property" $CONFIG
xmlstarlet ed -L -N x="$NAMESPACE" -i '(.//x:spi[@name="x509cert-lookup"]/x:provider[@name="apache"]/x:properties/x:property)[last()]' -t attr -n "name" -v "sslCertChainPrefix" $CONFIG
xmlstarlet ed -L -N x="$NAMESPACE" -i '(.//x:spi[@name="x509cert-lookup"]/x:provider[@name="apache"]/x:properties/x:property)[last()]' -t attr -n "value" -v "USELESS" $CONFIG
xmlstarlet ed -L -N x="$NAMESPACE" -s './/x:spi[@name="x509cert-lookup"]/x:provider[@name="apache"]/x:properties' -t elem -n "property" $CONFIG
xmlstarlet ed -L -N x="$NAMESPACE" -i '(.//x:spi[@name="x509cert-lookup"]/x:provider[@name="apache"]/x:properties/x:property)[last()]' -t attr -n "name" -v "certificateChainLength" $CONFIG
xmlstarlet ed -L -N x="$NAMESPACE" -i '(.//x:spi[@name="x509cert-lookup"]/x:provider[@name="apache"]/x:properties/x:property)[last()]' -t attr -n "value" -v "1" $CONFIG

# *** display result ***
echo "Result as below:"
xmlstarlet sel -N x="urn:jboss:domain:keycloak-server:1.1" -t -c './/x:spi[@name="x509cert-lookup"]' -n $CONFIG
