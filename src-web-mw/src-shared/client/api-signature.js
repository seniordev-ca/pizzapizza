/**
 * DUMMY version of web session for client build import
 * Should have same interface as actual implementation
 */

const ApiSignature = (() => {

    const generateSignature = (timeStamp) => null;
    const getApiBaseUrl = () => null;
    const getPublicKey = () => null;
    const isBaseUrlAllowedForEnvironment = (baseUrl) => null;
    const setSsrRequestHeader = (req, res, ssrRemoteHeader, lang) => null;

    return {
        generateSignature,
        getApiBaseUrl,
        getPublicKey,
        isBaseUrlAllowedForEnvironment,
        setSsrRequestHeader
    }
})()

module.exports = ApiSignature;
