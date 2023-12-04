if [ $# -eq 0 ]
  then
    echo "No build command. Use: init"
fi

PROJECT_ID=$(cat dist/project-id.txt)
BUILD_TASK=$1

build_sdk() {
     # Clear distribution folders
    rm -rf dist/build-sdk
    mkdir dist/build-sdk

    # Install packages and build
    cd src-sdk
    npm i
    npm run build

    # Copy build to distribution folder
    cp ./dist/pp-sdk-bundle.js ./../dist/build-sdk/pp-sdk-bundle.js
    cd ../
}

# dev dev-fr

# Should have same keys as angular.json

ANGULAR_CONFIG='dev'
#
# Project ID to Anular environment map
#
if [ $PROJECT_ID = "ppl-uat3-fe-phx2" ]; then
    ANGULAR_CONFIG='ppl-uat3-fe-phx2'
fi

if [ $PROJECT_ID = "ppl-tmp-fe-phx2" ]; then
    ANGULAR_CONFIG='ppl-tmp-fe-phx2'
fi

if [ $PROJECT_ID = "ppl-dev-fe-phx2" ]; then
    ANGULAR_CONFIG='praful-dev'
fi
if [ $PROJECT_ID = "ppl-stg-fe-phx2" ]; then
    ANGULAR_CONFIG='ppl-stg-fe-phx2'
fi
if [ $PROJECT_ID = "ppl-prod--fe-phx2" ]; then
    ANGULAR_CONFIG='ppl-prod-fe'
fi

# 
# Tasks
#
if [ $BUILD_TASK = "sdk" ]; then
    build_sdk
fi

if [ $BUILD_TASK = "web-en" ]; then
    node_modules/.bin/ng build --aot --configuration=$ANGULAR_CONFIG
fi

if [ $BUILD_TASK = "web-fr" ]; then
    node_modules/.bin/ng build --aot --configuration=$ANGULAR_CONFIG-fr
fi

if [ $BUILD_TASK = "server-en" ]; then
    node_modules/.bin/ng run pp-v2:server --configuration=$ANGULAR_CONFIG
fi

if [ $BUILD_TASK = "server-fr" ]; then
    node_modules/.bin/ng run pp-v2:server-fr --configuration=$ANGULAR_CONFIG
fi

if [ $BUILD_TASK = "ssr-server" ]; then
    ./node_modules/webpack/bin/webpack.js --config webpack.server.config.js --progress --colors
fi