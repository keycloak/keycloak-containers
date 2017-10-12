FROM jboss/keycloak:latest

USER root

ADD openshift-entrypoint.sh /usr/bin/
ADD start-keycloak.sh /usr/bin/

#Give correct permissions when used in an OpenShift environment.
RUN chown -R jboss:0 $JBOSS_HOME/standalone && \
    chmod -R g+rw $JBOSS_HOME/standalone && \
    chown -R jboss:0 $JBOSS_HOME/modules/system/layers/base && \
    chmod -R g+rw $JBOSS_HOME/modules/system/layers/base && \
    chown -R jboss:0 /tmp && \
    chmod -R g+rw /tmp

USER 1000

ENTRYPOINT [ "openshift-entrypoint.sh" ]

CMD ["start-keycloak.sh", "-b", "0.0.0.0"]
