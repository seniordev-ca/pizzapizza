/**
 * DAL for API
 */

// Libs for remote request and signature generation
const axios = require('axios');

// Signature generator util
const ApiSignature = require('../src-shared/server/api-signature.js');

// Import MW package to get version
const package = require('../package.json');

const LOG_REQUEST = false;
const DEFAULT_REQ_LANG = 'en';

const remoteDal = (() => {
    let baseApiHost = ApiSignature.getApiBaseUrl();

    const checkHeaderValid = (clientHeaders) => {
        const hasRequestId = 'x-request-id' in clientHeaders;
        const hasSessionId = 'session-token' in clientHeaders;

        const isValid = hasRequestId && hasSessionId;
        return isValid;
    }

    const _getRequestHeaders = (clientHeaders, deviceId) => {

        // Request ID from client
        const apiHeaders = {
            'x-request-id': clientHeaders['x-request-id'],
        }

        // JWT for authentication
        if (clientHeaders['x-access-token']) {
            apiHeaders['x-access-token'] = clientHeaders['x-access-token']
        }

        // Proxy header added by google
        if (clientHeaders['x-appengine-city']) {
            apiHeaders['x-city'] = clientHeaders['x-appengine-city']
        }
        // Dev base API and mock state header
        if (clientHeaders['x-appengine-region']) {
            apiHeaders['x-region'] = clientHeaders['x-appengine-region']
        }

        if (clientHeaders['api-mock-header']) {
            apiHeaders['x-mock-state'] = clientHeaders['api-mock-header']
        }

        if(clientHeaders['fortertoken']) {
          apiHeaders['fortertoken'] = clientHeaders['fortertoken']
        }

        if(clientHeaders['x-real-ip']) {
          apiHeaders['x-real-ip'] = clientHeaders['x-real-ip']
        }

        if(clientHeaders['kumulos-install-id']) {
            apiHeaders['kumulos-install-id'] = clientHeaders['kumulos-install-id']
        }

        if(clientHeaders['session-token']) {
            apiHeaders['session-token'] = clientHeaders['session-token']
        }

        if(clientHeaders['app-web-version']) {
            apiHeaders['app-web-version'] = clientHeaders['app-web-version']
        }

        if(clientHeaders['user-agent']) {
            apiHeaders['user-agent'] = clientHeaders['user-agent']
        }

        if(clientHeaders['timezone']) {
            apiHeaders['timezone'] = clientHeaders['timezone']
        }

        if(clientHeaders['timestamp']) {
            apiHeaders['timestamp'] = clientHeaders['timestamp']
        }

        const timeStamp = Date.now() / 1000;
        return {
            ...apiHeaders,
            'content-type': 'application/json',
            'x-source': 'web',
            'x-lang': clientHeaders['lang'] || DEFAULT_REQ_LANG,
            'x-device-id': deviceId,
            'x-app-version': package.version,
            'x-consumer-key': ApiSignature.getPublicKey(),
            'x-signature': ApiSignature.generateSignature(timeStamp),
            'x-timestamp': timeStamp.toString(),
        }
    }

    const call = (request, clientHeaders, deviceId) => {
        const {
            method,
            path,
            params
        } = request;

        // For debugging client can send target environment in header
        // Environment config dictates if host is allowed or no
        baseApiHost = ApiSignature.getApiBaseUrl();
        const baseApiUrlFromClientHeader = clientHeaders['base-api-url'];
        if (baseApiUrlFromClientHeader && ApiSignature.isBaseUrlAllowedForEnvironment(baseApiUrlFromClientHeader)) {
            baseApiHost = baseApiUrlFromClientHeader;
        }

        return new Promise((resolve) => {
            const absUrl = `${baseApiHost}/${path}`;
            const headers = _getRequestHeaders(clientHeaders, deviceId);

            // Don't consider auth failure or validation as failure
            const validateStatus = (status) => {
                return status < 500;
            }

            let request = null;
            switch (method) {
                case 'GET':
                    request = axios.get(absUrl, {
                        validateStatus,
                        headers,
                        params
                    })
                    break;
                case 'DELETE':
                    request = axios.delete(absUrl, {
                        validateStatus,
                        headers,
                        params
                    })
                    break;
                case 'POST':
                    request = axios.post(absUrl, params, {
                        validateStatus,
                        headers
                    })
                    break;
                case 'PUT':
                    request = axios.put(absUrl, params, {
                        validateStatus,
                        headers
                    })
                    break;
            }

            if (LOG_REQUEST) {
                console.log(`${method} | ${absUrl}`);
                console.log(headers);
                console.log(params);
            }

            request.then(response => {
                resolve({
                    httpCode: response.status,
                    body: response.data
                });
            }).catch(error => {
                // Error
                if (error.response) {
                    /*
                    * The request was made and the server responded with a
                    * status code that falls out of the range of 2xx
                    */
                   console.error(`type:monitoring operation_name:api_invalid_response_code success:False reason:${error.response.status}`);
                   console.error(error.response.data);
                   console.error(error.response.headers);
                } else if (error.request) {
                    /*
                    * The request was made but no response was received, `error.request`
                    * is an instance of XMLHttpRequest in the browser and an instance
                    * of http.ClientRequest in Node.js
                    */
                   console.error(`type:monitoring operation_name:api_no_response success:False reason:${error.request}`);
                   console.error(error.request);
                } else {
                    // Something happened in setting up the request and triggered an Error
                    console.error(`type:monitoring operation_name:api_unknown_error success:False reason:${error.config}`);
                    console.error(error.config);
                }

                const httpCode = error.response && error.response.status || 500;
                const body = error.response && error.response.data || null;

                resolve({
                    httpCode,
                    body
                });
            })
        })
    }

    return {
        checkHeaderValid,
        call
    }

})()

module.exports = remoteDal;
