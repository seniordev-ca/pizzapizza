/**
 * For server side rendering node server needs to access API data
 */

// Web session generator
const WebSession = require('../../src/web-session');

// Libs for symmetric encryption 
const CryptoJS = require('crypto-js');
const btoa = require('btoa');

// Env config
const envConfig = require('../../server-environment');
const package = require('../../package.json')

const ApiSignature = (() => {
    /**
     * Generates signature for api
     * Used in web middleware and angular SSR
     */

    const privateKey = envConfig.auth.private;

    const generateSignature = (timeStamp) => {
        const message = privateKey.concat(timeStamp);
        const cryptoString = CryptoJS.HmacSHA1(message, privateKey);
        // console.log(btoa(cryptoString))
        return btoa(cryptoString);
    }

    const getApiBaseUrl = () => {
        return envConfig.base_api_host;
    }

    const getPublicKey = () => {
        return envConfig.auth.public;
    }

    const isBaseUrlAllowedForEnvironment = (baseUrl) => {
        return envConfig.allowed_api_hosts.indexOf(baseUrl) != -1;
    }

    /**
     * Helper for server side rendering
     *
     * @param {*} ssrRequest - Express request context
     * @param {*} ssrResponse - Express response context
     * @param {*} ssrRemoteHeader - Header that SSR would sent to API
     * @param {*} lang - Client language
     */
    const setSsrRequestHeader = (ssrRequest, ssrResponse, ssrRemoteHeader, lang) => {

        /**
         * One request from client might need few server request.
         * Device ID should be same for all. So we can store device id in request context object.
         */
        let deviceId = '';
        if (ssrRequest['contextDeviceId']) {
            deviceId = ssrRequest['contextDeviceId'];
        } else {
            deviceId = WebSession.getOrCreateSessionDeviceId(ssrRequest, ssrResponse);
            ssrRequest['contextDeviceId'] = deviceId;
        }

        /**
         * Default store id logic work on header auto added by GCP
         * For SSR we need to proxy header under custom name to avoid overwriting
         */
        const reqCity = ssrRequest.header('x-appengine-city');
        const reqRegion = ssrRequest.header('x-appengine-region');
        if(reqCity) {
            ssrRemoteHeader = ssrRemoteHeader.set('x-city', reqCity);
        }
        if(reqRegion) {
            ssrRemoteHeader = ssrRemoteHeader.set('x-region', reqRegion);
        }

        const timeStamp = Date.now() / 1000;
        ssrRemoteHeader = ssrRemoteHeader.set('x-lang', lang); 
        ssrRemoteHeader = ssrRemoteHeader.set('x-app-version', package.version);
        ssrRemoteHeader = ssrRemoteHeader.set('x-source', 'web');
        ssrRemoteHeader = ssrRemoteHeader.set('x-timestamp', timeStamp.toString());
        ssrRemoteHeader = ssrRemoteHeader.set('x-device-id', deviceId);
        ssrRemoteHeader = ssrRemoteHeader.set('x-consumer-key', ApiSignature.getPublicKey());
        ssrRemoteHeader = ssrRemoteHeader.set('x-signature', ApiSignature.generateSignature(timeStamp));

        return ssrRemoteHeader;
    }

    return {
        generateSignature,
        getApiBaseUrl,
        getPublicKey,
        isBaseUrlAllowedForEnvironment,
        setSsrRequestHeader
    }
})()

module.exports = ApiSignature;
