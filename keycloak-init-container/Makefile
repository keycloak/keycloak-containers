ORG=keycloak
PROJECT=keycloak-init-container
REG=quay.io
TAG=2.0.0
ENGINE?=docker

.PHONY: image/build
image/build:
	${ENGINE} build -t ${REG}/${ORG}/${PROJECT}:${TAG} .

.PHONY: image/push
image/push:
	${ENGINE} push ${REG}/${ORG}/${PROJECT}:${TAG}
