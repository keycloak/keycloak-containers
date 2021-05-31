#!/bin/bash -e

EXTENSIONS_VOLUME="${EXTENSIONS_VOLUME:-/opt/extensions}"

mkdir -p "$EXTENSIONS_VOLUME"
cd "$EXTENSIONS_VOLUME"
echo "Target directory: $EXTENSIONS_VOLUME"

# Download a single extension
download_extension() {
    local EXTENSION_URL="$1"

    if [[ -z "$EXTENSION_URL" ]]; then
        return
    fi
    echo 
    echo "Downloading extension from $EXTENSION_URL"
    local CURL_COMMAND="$(curl --verbose --location  --remote-name --remote-header-name --write-out "%{http_code} %{filename_effective}"  --silent "$EXTENSION_URL" 2> /tmp/headers)"
  
    local STATUS_CODE=${CURL_COMMAND:0:3}

    if [ $STATUS_CODE -eq "200" ]; then
        local FILENAME=${CURL_COMMAND:4}
        echo "Extension downloaded successfully"

        # Try to get the filename from the response headers and return
        # a random name if that fails
        if ! grep -q -i '^< content-disposition:.*filename=' /tmp/headers ; then
            local F="$(od -N8 -tx1 -An -v /dev/urandom | tr -d "").jar"
            mv "$FILENAME" "$F"
            FILENAME="$F"
        fi
        echo " --> $FILENAME"
    else
        echo -e "Can not download the extension: $EXTENSION_URL\nError code: $STATUS_CODE"
        ((STATUS+=1))
    fi

}

# Parse the environment variable and download the extensions from the list
IFS=,
STATUS=0
for EXT in ${KEYCLOAK_EXTENSIONS[@]} ; do
    download_extension "$EXT"
done
if [ "$STATUS" -ne 0 ]; then
    echo
    echo -e "Extensions.sh script failed at downloading all required extensions, number of failed downloads: $STATUS \n"
    exit 1
else
    echo
    echo -e "All extensions downloaded successfully \n"
fi
