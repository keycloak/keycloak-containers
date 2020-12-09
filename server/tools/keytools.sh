#!/bin/bash

function decrypt_keys() {
    # read X509_KEY_PASS environment variable if set or use default value: none
    local X509_KEY_PASSWORD=${X509_KEY_PASS:=""}
    # Keystore infix notation as used in templates to keystore name mapping
    declare -A KEYSTORES=( ["https"]="HTTPS" )
    # Auto-generate the HTTPS keystore if volumes for OpenShift's
    # serving x509 certificate secrets service were properly mounted
    for KEYSTORE_TYPE in "${!KEYSTORES[@]}"; do

      local X509_KEYSTORE_DIR="/etc/x509/${KEYSTORE_TYPE}"
      local X509_CRT="tls.crt"
      local X509_KEY="tls.key"
      # read X509_KEY_PASS environment variable if set or use default value: none
      local X509_KEY_PASSWORD=${X509_KEY_PASS:=""}
      local NAME="keycloak-${KEYSTORE_TYPE}-key"
      local PASSWORD=$(openssl rand -base64 32 2>/dev/null)
      local JKS_KEYSTORE_FILE="${KEYSTORE_TYPE}-keystore.jks"
      local PKCS12_KEYSTORE_FILE="${KEYSTORE_TYPE}-keystore.pk12"

      if [ -f "${X509_KEYSTORE_DIR}/${X509_KEY}" ] && [ -f "${X509_KEYSTORE_DIR}/${X509_CRT}" ]; then

          echo "Creating ${KEYSTORES[$KEYSTORE_TYPE]} keystore via OpenShift's service serving x509 certificate secrets.."
          if [ ! -z "$X509_KEY_PASSWORD" ]; then
              echo "Decrypting ${X509_KEYSTORE_DIR}/${X509_KEY} since X509_KEY_PASS is provided.."
              openssl pkcs12 -export \
                 -name "${NAME}" \
                 -inkey "${X509_KEYSTORE_DIR}/${X509_KEY}" \
                 -passin pass:"${X509_KEY_PASSWORD}" \
                 -in "${X509_KEYSTORE_DIR}/${X509_CRT}" \
                 -out "${KEYSTORES_STORAGE}/${PKCS12_KEYSTORE_FILE}" \
                 -password pass:"${PASSWORD}" >& /dev/null
          else
              openssl pkcs12 -export \
                  -name "${NAME}" \
                   -inkey "${X509_KEYSTORE_DIR}/${X509_KEY}" \
                   -in "${X509_KEYSTORE_DIR}/${X509_CRT}" \
                   -out "${KEYSTORES_STORAGE}/${PKCS12_KEYSTORE_FILE}" \
                   -password pass:"${PASSWORD}" >& /dev/null
          fi



}