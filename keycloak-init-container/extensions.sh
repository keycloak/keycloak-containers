#!/bin/bash

set -o pipefail -o errexit -o nounset

## External variables used by this script
declare -rx KEYCLOAK_EXTENSIONS
declare -rx EXTENSIONS_VOLUME="${EXTENSIONS_VOLUME:-/opt/extensions}"

# Download a single extension
download_extension() {
    local extension_url="$1"

    if [[ -z "$extension_url" ]]; then
        return
    fi
    echo
    echo "Downloading extension from $extension_url"
    local curl_command
    curl_command="$(curl --verbose --location --remote-name --remote-header-name --write-out "%{http_code} %{filename_effective}" --silent "$extension_url" 2> /tmp/headers)"

    local status_code=${curl_command:0:3}

    if [[ "$status_code" -eq "200" ]]; then
        local filename=${curl_command:4}
        echo "Extension downloaded successfully"

        # Try to get the filename from the response headers and return
        # a random name if that fails
        if ! grep -q -i '^< content-disposition:.*filename=' /tmp/headers; then
            local F
            F="$(od -N8 -tx1 -An -v /dev/urandom | tr -d "").jar"
            mv "$filename" "$F"
            filename="$F"
        fi
        echo " --> $filename"
    else
        echo -e "Can not download the extension: ${extension_url}\nError code: ${status_code}"
        ((FAILED_DOWNLOADS+=1))
        return 1
    fi
}

mkdir -p "$EXTENSIONS_VOLUME"
if ! cd "$EXTENSIONS_VOLUME"; then
    echo "Failed to change directory to ${EXTENSIONS_VOLUME}"
    exit 1
fi
echo "Target directory: ${EXTENSIONS_VOLUME}"

# Parse the environment variable and download the extensions from the list
IFS=,
FAILED_DOWNLOADS=0

for EXT in ${KEYCLOAK_EXTENSIONS[*]}; do
    # The true guard allows us to continue attempting to download extensions if
    # one fails. This will help surface all failed extension downloads at once,
    # rather than needing to iterate through them one at a time.
    download_extension "$EXT" || true
done

if [[ "$FAILED_DOWNLOADS" -ne 0 ]]; then
    echo
    echo -e "Extensions.sh script failed to download all required extensions, number of failed downloads: ${FAILED_DOWNLOADS} \n"
    exit 1
else
    echo
    echo -e "All extensions downloaded successfully \n"
fi
