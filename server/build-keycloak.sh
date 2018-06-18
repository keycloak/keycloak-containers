#!/bin/bash -e

echo KEYCLOAK_BRANCH = $SOURCE_BRANCH

if [ "$SOURCE_BRANCH" == master ] || [[ "$SOURCE_BRANCH" == build-* ]]; then
    if [[ "$SOURCE_BRANCH" == build-* ]]; then
        SOURCE_BRANCH=`echo $SOURCE_BRANCH | sed 's/build-//'`
    fi

    echo "Build Keycloak from branch $SOURCE_BRANCH"

    # Install Maven
    cd /opt/jboss 
    curl -s http://apache.uib.no/maven/maven-3/3.5.3/binaries/apache-maven-3.5.3-bin.tar.gz | tar xz
    mv apache-maven-3.5.3 /opt/jboss/maven
    export M2_HOME=/opt/jboss/maven

    # Clone repository
    git clone --depth 1 https://github.com/keycloak/keycloak.git -b $SOURCE_BRANCH /opt/jboss/keycloak-source

    # Build
    cd /opt/jboss/keycloak-source
    $M2_HOME/bin/mvn -Pdistribution -pl distribution/server-dist -am -Dmaven.test.skip clean install
    
    cd /opt/jboss
    tar xfz /opt/jboss/keycloak-source/distribution/server-dist/target/keycloak-*.tar.gz
    
    mv /opt/jboss/keycloak-?.?.?.Final-SNAPSHOT /opt/jboss/keycloak

    # Remove temporary files
    rm -rf /opt/jboss/maven
    rm -rf /opt/jboss/keycloak-source
    rm -rf $HOME/.m2/repository
else
    cd /opt/jboss/
    curl -L https://downloads.jboss.org/keycloak/$KEYCLOAK_VERSION/keycloak-$KEYCLOAK_VERSION.tar.gz | tar zx
    mv /opt/jboss/keycloak-$KEYCLOAK_VERSION /opt/jboss/keycloak
fi
