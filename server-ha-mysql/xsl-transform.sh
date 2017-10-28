#!/bin/bash
set -e

target="$1"
xsl="$2"

cp "$target" /tmp/xsl-transform-target.org
java -jar /usr/share/java/saxon.jar -s:"$target" -xsl:"$xsl" -o:"$target"
diff -u /tmp/xsl-transform-target.org "$target" | tee /tmp/xsl-transform-target.diff
echo "Lines removed: $(cat /tmp/xsl-transform-target.diff | grep '^\-\s' | wc -l)"
echo "Lines added: $(cat /tmp/xsl-transform-target.diff | grep '^\+\s' | wc -l)"
rm /tmp/xsl-transform-target.*
