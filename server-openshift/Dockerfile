FROM jboss/keycloak:4.5.0.Final

USER root

ADD openshift-entrypoint.sh /usr/bin/
ADD start-keycloak.sh /usr/bin/

USER 1000

ENTRYPOINT [ "openshift-entrypoint.sh" ]

CMD ["start-keycloak.sh", "-b", "0.0.0.0"]
