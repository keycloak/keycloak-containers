#!/bin/bash -ex

LABELS=$(cat <<-END
LABEL \
com.redhat.component="redhat-sso-7-sso74-init-container-rhel8-container"  \
description="Red Hat Single Sign-On 7.4 Init container image" \
summary="Red Hat Single Sign-On 7.4 Init container image" \
version="7.4" \
io.k8s.description="Init Container for Red Hat SSO" \
io.k8s.display-name="Red Hat SSO 7.4 Init Container" \
io.openshift.tags="sso,sso74,keycloak,operator" \
name="rh-sso-7\/sso74-init-container-rhel8-container" \
maintainer="Red Hat Single Sign-On Team"
END
)

sed -i 's/registry.access.redhat.com\/ubi8-minimal/ubi8-minimal:8-released/' Dockerfile
sed -i -e 's/FROM registry.access.redhat.com\/ubi8\/ubi-minimal:[0-9.]*/FROM ubi8-minimal:8-released/' \
    -e "s/##LABELS/$LABELS/g" \
    Dockerfile
