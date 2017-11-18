FROM maven:3.5.2-jdk-8-slim as kube-build

# This version must match that in module.xml
ENV JGROUPS_KUBE_VERSION=1.0.5.Final \
  JGROUPS_KUBE_SHA256=a024d5c1d86ffa05b529b7e9790384a70f768e263e28284a6a861c131563f077 \
  JGROUPS_KUBE_REPO=https://github.com/jgroups-extras/jgroups-kubernetes

WORKDIR /usr/src/jgroups-kubernetes

RUN curl -o jgroups-kubernetes.tar.gz -sLS $JGROUPS_KUBE_REPO/archive/jgroups-kubernetes-$JGROUPS_KUBE_VERSION.tar.gz \
  && sha256sum jgroups-kubernetes.tar.gz && echo "$JGROUPS_KUBE_SHA256 jgroups-kubernetes.tar.gz" | sha256sum -c \
  && tar -xzf jgroups-kubernetes.tar.gz --strip-components=1 -C ./
RUN mvn package \
  && mvn dependency:copy-dependencies -DincludeScope=runtime -DoutputDirectory='${project.build.directory}' \
  && find target/ -type f -name 'jgroups-[0-9]*.jar' -delete \
  && sha256sum target/*.jar

FROM jboss/keycloak:3.4.0.Final@sha256:73f3325c9bf9518cb1a2661ff1d1e365cfeb51b44a323f4cfc23040f3d84e6ef

COPY module.xml keycloak/modules/org/jgroups/kubernetes/main/
COPY --from=kube-build /usr/src/jgroups-kubernetes/target/*.jar keycloak/modules/org/jgroups/kubernetes/main/

RUN sed -i.bak 's|<module name="org.jgroups.azure"/>|<module name="org.jgroups.azure"/>\n        <module name="org.jgroups.kubernetes"/>|' \
  keycloak/modules/system/layers/base/org/jgroups/main/module.xml \
  && diff -u keycloak/modules/system/layers/base/org/jgroups/main/module.xml.bak keycloak/modules/system/layers/base/org/jgroups/main/module.xml \
  && echo "Failed to update jgroups dependencies" && exit 1 || :

COPY cli /opt/jboss/keycloak/cli/kube

RUN cd /opt/jboss/keycloak && bin/jboss-cli.sh --file=cli/kube/standalone-ha-configuration.cli && rm -rf /opt/jboss/keycloak/standalone-ha/configuration/standalone_xml_history

CMD ["--server-config=standalone-ha.xml"]
