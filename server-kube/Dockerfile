FROM jboss/keycloak:3.4.0.Final@sha256:73f3325c9bf9518cb1a2661ff1d1e365cfeb51b44a323f4cfc23040f3d84e6ef

COPY module.xml keycloak/modules/system/layers/base/org/jgroups/kubernetes/main/

ENV JGROUPS_KUBE_REPO=https://github.com/jgroups-extras/jgroups-kubernetes \
  JGROUPS_KUBE_VERSION=1.0.5.Final \
  JGROUPS_KUBE_SHA256=a024d5c1d86ffa05b529b7e9790384a70f768e263e28284a6a861c131563f077

RUN set -e; \
  set -x; \
  \
  mkdir ./maven; \
  MAVEN_VERSION=3.5.2; \
  MAVEN_SHA256=707b1f6e390a65bde4af4cdaf2a24d45fc19a6ded00fff02e91626e3e42ceaff; \
  curl -o maven.tar.gz -SLs https://archive.apache.org/dist/maven/maven-3/$MAVEN_VERSION/binaries/apache-maven-$MAVEN_VERSION-bin.tar.gz; \
  echo "$MAVEN_SHA256 maven.tar.gz" | sha256sum -c; \
  tar -xzf maven.tar.gz --strip-components=1 -C ./maven; \
  PATH=$PATH:$(pwd)/maven/bin; \
  mvn --version; \
  \
  mkdir ./jgroups-kubernetes; \
  curl -o jgroups-kubernetes.tar.gz -sLS $JGROUPS_KUBE_REPO/archive/jgroups-kubernetes-$JGROUPS_KUBE_VERSION.tar.gz; \
  echo "$JGROUPS_KUBE_SHA256 jgroups-kubernetes.tar.gz" | sha256sum -c; \
  tar -xzf jgroups-kubernetes.tar.gz --strip-components=1 -C ./jgroups-kubernetes; \
  echo jgroups-kubernetes.tar.gz; \
  \
  cd ./jgroups-kubernetes; \
  mvn package; \
  cd ..; \
  \
  echo # cp -v ./jgroups-kubernetes/target/*.jar ./keycloak/modules/system/layers/base/org/jgroups/kubernetes/main/; \
  \
  echo # rm -rf ./maven /root/.m2; \
  echo # rm -rf ./jgroups-kubernetes; \
  \
  echo "todo stuff"

ADD cli /opt/jboss/keycloak/cli/kube

RUN cd /opt/jboss/keycloak && bin/jboss-cli.sh --file=cli/kube/standalone-ha-configuration.cli && rm -rf /opt/jboss/keycloak/standalone-ha/configuration/standalone_xml_history
