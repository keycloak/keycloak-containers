#!/bin/bash -e

if [ "$GIT_REPO" != "" ]; then
    if [ "$GIT_BRANCH" == "" ]; then
        GIT_BRANCH="master"
    fi

    echo "Build from https://github.com/$GIT_REPO (branch $GIT_BRANCH)"

    # Install Maven
    cd /opt/jboss 
    curl -s http://apache.uib.no/maven/maven-3/3.5.4/binaries/apache-maven-3.5.4-bin.tar.gz | tar xz
    mv apache-maven-3.5.4 /opt/jboss/maven
    export M2_HOME=/opt/jboss/maven

    # Clone repository
    git clone --depth 1 https://github.com/$GIT_REPO.git -b $GIT_BRANCH /opt/jboss/keycloak-source

    MASTER_HEAD=`git log -n1 --format="%H" upstream/master`
    echo "Keycloak build: $GIT_REPO/$GIT_BRANCH/commit/$MASTER_HEAD"

    # Build
    cd /opt/jboss/keycloak-source
    $M2_HOME/bin/mvn -Pdistribution -pl distribution/server-dist -am -Dmaven.test.skip clean install
    
    cd /opt/jboss

    tar xfz /opt/jboss/keycloak-source/distribution/server-dist/target/keycloak-*.tar.gz
    
    mv /opt/jboss/keycloak-?.?.?.* /opt/jboss/keycloak

    # Remove temporary files
    rm -rf /opt/jboss/maven
    rm -rf /opt/jboss/keycloak-source
    rm -rf $HOME/.m2/repository
else
    echo "Keycloak download: $KEYCLOAK_DIST"

    cd /opt/jboss/
    curl -L $KEYCLOAK_DIST | tar zx
    mv /opt/jboss/keycloak-?.?.?.* /opt/jboss/keycloak
fi
