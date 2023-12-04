#!/bin/bash
###########################################################
# This script is meant to be run inside the Bitbucket
###########################################################

DEPLOYMENT_PROJECT=$(cat dist/project-id.txt)

install_google_cli() {
    SDK_VERSION=224.0.0
    SDK_FILENAME=google-cloud-sdk-${SDK_VERSION}-linux-x86_64.tar.gz
    curl -o /tmp/google-cloud-sdk.tar.gz https://dl.google.com/dl/cloudsdk/channels/rapid/downloads/${SDK_FILENAME}
    tar -xvf /tmp/google-cloud-sdk.tar.gz -C /tmp/
    /tmp/google-cloud-sdk/install.sh -q
    source /tmp/google-cloud-sdk/path.bash.inc
    gcloud -v
}

install_google_cli

echo 'GOOGLE CLI instalation complete'

activate_service_account_and_deploy() {
    echo "Activating project: ${DEPLOYMENT_PROJECT}"
    echo $1 | base64 --decode --ignore-garbage > ./gcloud-api-key.json
    gcloud auth activate-service-account --key-file gcloud-api-key.json
    gcloud config set project ${DEPLOYMENT_PROJECT}
}

if [ ${DEPLOYMENT_PROJECT} = "pp-pizzapizza-web-dev" ]; then
    activate_service_account_and_deploy $GCLOUD_API_KEYFILE_DEV_V2
fi

if [ ${DEPLOYMENT_PROJECT} = "pp-pizzapizza-web-qa" ]; then
    activate_service_account_and_deploy $GCLOUD_API_KEYFILE_QA_V2
fi

if [ ${DEPLOYMENT_PROJECT} = "pp-pizzapizza-web-uat" ]; then
    activate_service_account_and_deploy $GCLOUD_API_KEYFILE_UAT_V2
fi

if [ ${DEPLOYMENT_PROJECT} = "pp-pizzapizza-web-preprod" ]; then
    activate_service_account_and_deploy $GCLOUD_API_KEYFILE_PREPROD_V2
fi

if [ ${DEPLOYMENT_PROJECT} = "ppl-dev-fe-phx2" ]; then
    activate_service_account_and_deploy $GCLOUD_API_KEYFILE_PRAFUL_DEV
fi

if [ ${DEPLOYMENT_PROJECT} = "ppl-uat3-fe-phx2" ]; then
    activate_service_account_and_deploy $GCLOUD_API_KEYFILE_PPL_UAT3_FE
fi

if [ ${DEPLOYMENT_PROJECT} = "ppl-tmp-fe-phx2" ]; then
    activate_service_account_and_deploy $GCLOUD_API_KEYFILE_PPL_TMP_FE
fi

if [ ${DEPLOYMENT_PROJECT} = "ppl-stg-fe-phx2" ]; then
    activate_service_account_and_deploy $GCLOUD_API_KEYFILE_PPL_STG_FE
fi

if [ ${DEPLOYMENT_PROJECT} = "ppl-prod--fe-phx2" ]; then
    activate_service_account_and_deploy $GCLOUD_API_KEYFILE_PPL_PROD_FE
fi
if [ ${DEPLOYMENT_PROJECT} = "ppl-stg2-fe-phx2" ]; then
    activate_service_account_and_deploy $GCLOUD_API_KEYFILE_PPL_STG2_FE
fi
# Deploy SDK to bucket
deploy_sdk() {
    # Deploy sdk file to google bucket
    gsutil -h Cache-Control:private cp -a public-read ./dist/build-sdk/pp-sdk-bundle.js gs://${DEPLOYMENT_PROJECT}.appspot.com/js_sdk/pp-sdk-bundle.js

    # Make file publicly available
    gsutil acl ch -u AllUsers:R gs://${DEPLOYMENT_PROJECT}.appspot.com/js_sdk/pp-sdk-bundle.js

    # Get publick link
    printf "\n\nDeployed to\n"
    gsutil ls gs://${DEPLOYMENT_PROJECT}.appspot.com/js_sdk/pp-sdk-bundle.js | sed 's/gs:\//https:\/\/storage.googleapis.com/'
}
deploy_sdk

cd dist
# deploy SSR website
gcloud app deploy app-ssr.yaml --version=$(cat gae-version.txt) --quiet --no-promote

# deploy mw
cd ../src-web-mw
gcloud app deploy app.yaml --version=$(cat gae-version.txt) --quiet --no-promote
cd ../

# deploy dispatch file
gcloud app deploy dispatch.yaml --quiet --no-promote
