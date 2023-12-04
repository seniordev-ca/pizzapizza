# set targer environment by project id
# grabs FE and FE mw versions 

if [ $# -eq 0 ]
  then
    echo "No project supplied. Use pp-pizzapizza-web-dev, pp-pizzapizza-web-qa, pp-pizzapizza-web-uat ..."
fi

DEPLOYMENT_PROJECT=$1

echo $DEPLOYMENT_PROJECT > ./dist/project-id.txt

PV_ANGULAR=$(node -p -e "require('./package.json').version" | tr . -)
PV_WEB_MW=$(node -p -e "require('./src-web-mw/package.json').version" | tr . -)
PV_SDK=$(node -p -e "require('./src-sdk/package.json').version" | tr . -)
DATE_STR=$(date)

# Build TS revision file for footer component
echo "export const buildRevision = '$DATE_STR, Angular: $PV_ANGULAR, MW: $PV_WEB_MW, SDK: $PV_SDK Build: $BITBUCKET_BUILD_NUMBER'; export const buildNumber = '$BITBUCKET_BUILD_NUMBER';" > ./src/revision.ts

# The file is used by CI script 
# Deploy to GAE service version defined in package.json
echo $PV_ANGULAR > ./dist/gae-version.txt
echo $PV_WEB_MW > ./src-web-mw/gae-version.txt

echo TARGET ENVIRONMENT:
cat ./dist/project-id.txt
cat ./dist/gae-version.txt
cat ./src-web-mw/gae-version.txt
cat ./src/revision.ts