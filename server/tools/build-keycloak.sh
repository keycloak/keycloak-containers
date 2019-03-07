#!/bin/bash -e

###########################
# Build/download Keycloak #
###########################

if [ "$GIT_REPO" != "" ]; then
    if [ "$GIT_BRANCH" == "" ]; then
        GIT_BRANCH="master"
    fi

    # Install Maven
    cd /opt/jboss 
    curl -s http://apache.uib.no/maven/maven-3/3.5.4/binaries/apache-maven-3.5.4-bin.tar.gz | tar xz
    mv apache-maven-3.5.4 /opt/jboss/maven
    export M2_HOME=/opt/jboss/maven

    # Clone repository
    git clone --depth 1 https://github.com/$GIT_REPO.git -b $GIT_BRANCH /opt/jboss/keycloak-source

    # Build
    cd /opt/jboss/keycloak-source

    MASTER_HEAD=`git log -n1 --format="%H"`
    echo "Keycloak from [build]: $GIT_REPO/$GIT_BRANCH/commit/$MASTER_HEAD"

    $M2_HOME/bin/mvn -Pdistribution -pl distribution/server-dist -am -Dmaven.test.skip clean install
    
    cd /opt/jboss

    tar xfz /opt/jboss/keycloak-source/distribution/server-dist/target/keycloak-*.tar.gz
    
    mv /opt/jboss/keycloak-?.?.?* /opt/jboss/keycloak

    # Remove temporary files
    rm -rf /opt/jboss/maven
    rm -rf /opt/jboss/keycloak-source
    rm -rf $HOME/.m2/repository
else
    echo "Keycloak from [download]: $KEYCLOAK_DIST"

    cd /opt/jboss/
    curl -L $KEYCLOAK_DIST | tar zx
    mv /opt/jboss/keycloak-?.?.?* /opt/jboss/keycloak
fi

#####################
# Create DB modules #
#####################

mkdir -p /opt/jboss/keycloak/modules/system/layers/base/com/mysql/jdbc/main
cd /opt/jboss/keycloak/modules/system/layers/base/com/mysql/jdbc/main
curl -O http://central.maven.org/maven2/mysql/mysql-connector-java/$JDBC_MYSQL_VERSION/mysql-connector-java-$JDBC_MYSQL_VERSION.jar
cp /opt/jboss/tools/databases/mysql/module.xml .

mkdir -p /opt/jboss/keycloak/modules/system/layers/base/org/postgresql/jdbc/main
cd /opt/jboss/keycloak/modules/system/layers/base/org/postgresql/jdbc/main
curl -L http://central.maven.org/maven2/org/postgresql/postgresql/$JDBC_POSTGRES_VERSION/postgresql-$JDBC_POSTGRES_VERSION.jar > postgres-jdbc.jar
cp /opt/jboss/tools/databases/postgres/module.xml .

mkdir -p /opt/jboss/keycloak/modules/system/layers/base/org/mariadb/jdbc/main
cd /opt/jboss/keycloak/modules/system/layers/base/org/mariadb/jdbc/main
curl -L http://central.maven.org/maven2/org/mariadb/jdbc/mariadb-java-client/$JDBC_MARIADB_VERSION/mariadb-java-client-$JDBC_MARIADB_VERSION.jar > mariadb-jdbc.jar
cp /opt/jboss/tools/databases/mariadb/module.xml .

######################
# Configure Keycloak #
######################

cd /opt/jboss/keycloak

bin/jboss-cli.sh --file=/opt/jboss/tools/cli/standalone-configuration.cli
rm -rf /opt/jboss/keycloak/standalone/configuration/standalone_xml_history

bin/jboss-cli.sh --file=/opt/jboss/tools/cli/standalone-ha-configuration.cli
rm -rf /opt/jboss/keycloak/standalone/configuration/standalone_xml_history

###################
# Set permissions #
###################

chown -R jboss:0 /opt/jboss/keycloak
chmod -R g+rw /opt/jboss/keycloak
