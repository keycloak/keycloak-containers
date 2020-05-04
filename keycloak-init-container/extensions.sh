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

    echo "Downloading extension from $EXTENSION_URL"
    local FILENAME="$(curl --verbose --location --remote-name --remote-header-name --write-out '%{filename_effective}' --silent "$EXTENSION_URL" 2> /tmp/headers)"

    # Try to get the filename from the response headers and return
    # a random name if that fails
    if ! grep -q -i '^< content-disposition:.*filename=' /tmp/headers ; then
        local F="$(od -N8 -tx1 -An -v /dev/urandom | tr -d " \n").jar"
        mv "$FILENAME" "$F"
        FILENAME="$F"
    fi

    echo " --> $FILENAME"
}

# Parse the environment variable and download the extensions from the list
IFS=,
for EXT in $KEYCLOAK_EXTENSIONS ; do
    download_extension "$EXT"
done
