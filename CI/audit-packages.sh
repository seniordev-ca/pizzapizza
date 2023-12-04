# https://github.com/IBM/audit-ci

# Angular
echo "./package.json"
npm audit fix --audit-level=moderate
audit-ci --moderate
# --report-type full

# Platforms SDK
echo "./src-sdk/package.json"
cd ./src-sdk/
npm audit fix --audit-level=moderate
cd ..
audit-ci --moderate --directory ./src-sdk/

# Web Midlleware
echo "./src-web-mw/package.json"
cd ./src-web-mw/
npm audit fix --audit-level=moderate
cd ..
audit-ci --moderate --directory ./src-web-mw/
