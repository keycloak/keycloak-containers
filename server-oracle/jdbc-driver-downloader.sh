#!/bin/bash

DIR=$(dirname $0)

DEFAULT_DRIVER_VERSION=12.2.0.1
DEFAULT_OUTPUT_FILENAME=$(realpath ${DIR})/ojdbc8.jar

usage() {
  local scriptRealPath=$(realpath ${DIR})
  echo "Usage: $0 --username user@example.com [OPTIONS...]"
  echo "  -u, --username	Oracle account username (you will be promted for the password)"
  echo "  -v, --driver-version	The driver version, defaults to ${DEFAULT_DRIVER_VERSION}"
  echo "  -o, --outfile		Destination filename, defaults to '${scriptRealPath}'"
  echo "  -h, --help		This help text"
}

if [ ${#@} == 0 ]; then
    usage >&2; exit 1
fi

while [[ $1 = -?* ]]; do
  case $1 in
    -h|--help) usage; exit 0 ;;
    -v|--driver-version) shift; driverVersion=${1} ;;
    -u|--username) shift; username=${1} ;;
    -o|--outfile) shift; outputFilename=${1} ;;
    *) die "invalid option: '$1'." ;;
  esac
  shift
done

driverVersion=${driverVersion:-${DEFAULT_DRIVER_VERSION}}
outputFilename=${outputFilename:-${DEFAULT_OUTPUT_FILENAME}}

echo "params are valid: driverVersion=${driverVersion}, username=${username}, outputFilename=${outputFilename}"

echo "Downloading ojdbc8-${driverVersion}.jar into ${outputFilename}..."
curl --user ${username} \
  --fail \
  --cookie-jar /tmp/cookie-jar.txt \
  --location-trusted https://www.oracle.com/content/secure/maven/content/com/oracle/jdbc/ojdbc8/${driverVersion}/ojdbc8-${driverVersion}.jar \
  -o "${outputFilename}"