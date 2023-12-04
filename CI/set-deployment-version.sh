#date > ./dist/revision.txt
#echo ' Revision: ' >> ./dist/revision.txt

PACKAGE_VERSION=$(node -p -e "require('./package.json').version" | tr . -)
DATE_STR=$(date)

# Build TS revision file for footer component
echo "export const buildRevision = '$DATE_STR, Version: $PACKAGE_VERSION, Build: $BITBUCKET_BUILD_NUMBER';" > ./src/revision.ts

# The file is used by CI script 
# Deploy to GAE service version defined in package.json

echo $PACKAGE_VERSION > ./dist/gae-version.txt
echo $PACKAGE_VERSION > ./src-web-mw/gae-version.txt

cat ./src/revision.ts
cat ./dist/gae-version.txt