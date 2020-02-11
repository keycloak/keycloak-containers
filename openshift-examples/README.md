# Keycloak OpenShift examples

This directory contains a set of predefined OpenShift templates for running Keycloak, including:

* `keycloak-https.json` - A standard template for most of the use cases. It uses both HTTP and HTTPS routes.
* `keycloak-https-mutual-tls.json` - A similar template to the one above but uses OpenShift generated certificates to setup Mutual TLS.

## Using Keycloak vault with Openshift secrets

Keycloak supports obtaining secrets from a vault, details of usage are described in [documentation](https://www.keycloak.org/docs/latest/server_admin/index.html#kubernetes-openshift-files-plaintext-vault-provider). 

To use keycloak vault support with kubernetes/openshift secrets, follow steps below:
1. Create a secret in you openshift cluster. An example using oc (you can use any other way of creating secrets):\
```oc create secret generic keycloak-vault-secrets --from-literal=realm-name_smtp__password=mySMTPPsswd```
2. Mount a volume to your keycloak deployment config.\
For already running keycloak:\
```oc set volume dc/keycloak --add --mount-path=/opt/jboss/keycloak/secrets --secret-name=keycloak-vault-secrets```\
or you can change it directly within your template, for example you need following changes when using [keycloak-https.json](keycloak-https.json):
    1. Add following volume to DeploymentConfig - `spec.template.spec.volumes[]`:
        ```json
           {
               "name": "keycloak-vault-secret-volume",
               "secret": {
                   "secretName": "keycloak-vault-secrets"
               }
           }
        ``` 
    2. Now mount the volume to path `/opt/jboss/keycloak/secrets` (on this path, docker image expects all secrets in structure specified in keycloak documentation). Add following volumeMount to `spec.template.spec.containers[].volumeMounts[]`:
        ```json
           {
               "name": "keycloak-vault-secret-volume",
               "mountPath": "/opt/jboss/keycloak/secrets",
               "readOnly": true
           }
        ```
3. Now after a pod is created you can use specially crafted string within your keycloak configuration. For example for using **mySMTPPsswd** created in this tutorial, you can use `${vault.smtp_password}` within `realm-name` realm as your smtp password and it will be replaced (only when password is needed, not when you write it to admin console) by **mySMTPPsswd**. 