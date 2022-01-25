#!/bin/bash -ex

LABELS=$(cat <<-END
LABEL com.redhat.component="redhat-sso-7-rhel8-init-container" \
 description="Red Hat Single Sign-On 7.5 Init container image" \
 summary="Red Hat Single Sign-On 7.5 Init container image" \
 version="7.5" \
 io.k8s.description="Init Container for Red Hat SSO" \
 io.k8s.display-name="Red Hat SSO 7.5 Init Container" \
 io.openshift.tags="sso,sso75,keycloak,operator" \
 name="rh-sso-7\/sso7-rhel8-init-container" \
 maintainer="Red Hat Single Sign-On Team"
END
)

sed -i \
    -e 's/FROM registry.access.redhat.com\/ubi8-minimal/FROM registry.redhat.io\/ubi8\/ubi-minimal/' \
    -e "s/##LABELS/$LABELS/g" \
    Dockerfile
