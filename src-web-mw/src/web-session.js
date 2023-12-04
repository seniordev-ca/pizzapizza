/**
 * This functionality is shared between web middleware and
 * angular server side rendering. 
 * Client build should NOT have access to server key
 * Module @pp-universal is defined in tsconfig.server.json
 */

// Libs
const CryptoJS = require("crypto-js");
const uuidv4 = require('uuid/v4');
const btoa = require('btoa');
const atob = require('atob');

// Env config
const envConfig = require('../server-environment');

// https://cloud.google.com/appengine/docs/standard/nodejs/runtime
const gaeAppId = process.env.GOOGLE_CLOUD_PROJECT;
const isRunningLocally = !gaeAppId;

const WebSession = (() => {
    /**
     * Wrapper to handle session is shared with Angular SSR implementation.
     * Device id is encoded into session token using symmetric encryption
     */
    const sessionSecretKey = envConfig.session_secret_key;
    const isSecureCookie = !isRunningLocally;

    /**
     *  Use unix time and UUID v4 to create a device id 
     *  and encode it to the token using symetric encription
     */
    const _createSessionToken = () => {
        const unixTime = parseInt((new Date) / 1000);
        const newDeviceId = `web_${unixTime}_${uuidv4()}`;

        // btoa encodes token to base64 to remove special chars
        const sessionToken = btoa(CryptoJS.AES.encrypt(newDeviceId, sessionSecretKey).toString());

        // console.log('createSessionToken');
        // console.log(sessionToken);

        return {
            sessionToken,
            newDeviceId
        };
    }

    /**
     * Decode token to get device id
     */
    const _getDeviceIdByToken = (sessionToken) => {
        // Decode session token to get a device ID for the request.
        const bytes = CryptoJS.AES.decrypt(atob(sessionToken), sessionSecretKey);
        const originalText = bytes.toString(CryptoJS.enc.Utf8);
        return originalText;
    }

    /**
     * Utility to get cookie value by key from raw request header
     */
    const _getCookieFromRawString = (cookieRawString) => {
        var cookies = {};
        cookieRawString && cookieRawString.split(';').forEach(function (cookie) {
            var parts = cookie.match(/(.*?)=(.*)$/)
            cookies[parts[1].trim()] = (parts[2] || '').trim();
        });
        return cookies;
    }

    /**
     * Checking/creating cookies session using express request/response to set/get cookies
     * Used in web middleware and Angular SSR
     */
    const getOrCreateSessionDeviceId = (req, res) => {
        let deviceId = '';
        let isNewSession = false;
        const requestCookie = req.headers.cookie;
        const sessionToken = _getCookieFromRawString(requestCookie)['pp-mw-session'];

        const createAndSetNewSession = () => {
            const newSession = _createSessionToken();
            let options = {
                expires: 0, // Cookie expires on session
                secure: isSecureCookie,
                httpOnly: true, // The cookie only accessible by the web server
            }

            res.cookie('pp-mw-session', newSession['sessionToken'], options);
            deviceId = newSession['newDeviceId'];
        }

        // console.log('\n sessionToken');
        // console.log(sessionToken);

        if (sessionToken) {
            // User has session cookie token, decode it to get device id
            deviceId = _getDeviceIdByToken(sessionToken);
            if (!deviceId) {
                console.error(`type:monitoring operation_name:session_invalid_token success:False reason:Invalid session token`);
                createAndSetNewSession();
                isNewSession = true;
            }
        } else {
            // User does not have token issue a new one
            createAndSetNewSession();
            isNewSession = true;
        }
        return {
            deviceId,
            isNewSession
        };

    }

    return {
        getOrCreateSessionDeviceId
    }
})()

module.exports = WebSession