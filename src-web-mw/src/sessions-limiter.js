/**
 * DAL and logic for IP based session creation limiter
 * Disabled as per Praful doesn't want to change infrastructure before launch
 * TODO:
 * 1. encode a IP which is used as key in redis
 */
const serverConfig = require('../server-environment');
const sessionIpLimits = serverConfig.sessionIpLimits;

// console.log('sessionIpLimits');
// console.log(sessionIpLimits);

const KeyValuesStorage = (() => {
    var redis = require('redis');

    const port = sessionIpLimits.port;
    const host = sessionIpLimits.host;
    // const client = redis.createClient(port, host);

    // client.on('connect', function (data) {
    //     console.log('Redis client connected');
    // });

    // client.on('error', function (err) {
    //     console.error('Something went wrong ' + err);
    // });

    const _exists = (key, ready) => {
        client.exists(key, (error, result) => {
            if (error) {
                console.error(error);
                ready(null);
                // throw error;
            }
            const exist = result === 1;
            ready(exist);
        })
    }

    const incrSessionCount = (key) => {
        // If key doesn't exist: set expiry time
        _exists(key, (exist) => {
            if (!exist) {
                client.expireat(key, parseInt((+new Date) / 1000) + sessionIpLimits.limitResetTimeSec, (error) => {
                    if (error) {
                        console.error(error);
                        // throw error;
                    }
                });
            }
        });
        client.incr(key);
    }

    const getSessionsCount = (key, ready) => {
        client.get(key, function (error, result) {
            if (error) {
                console.error(error);
                ready(null);
            }
            result = result || 0;
            ready(result);
        });
    }

    return {
        incrSessionCount,
        getSessionsCount
    }
})();


const WebSessionLimiter = (() => {

    // const isNewSessionAllowed = async (requestIp) => {
    //     return new Promise((resole) => {
    //         KeyValuesStorage.getSessionsCount(requestIp, (sessionCount) => {
    //             if (sessionCount === null) {
    //                 // TODO check maybe true
    //                 console.error("Redis is down");
    //                 resole(true);
    //             }

    //             // REMOVEME
    //             console.log(sessionCount);

    //             const isMaxSessions = sessionCount > sessionIpLimits.maxSessionCount;
    //             if(sessionCount > sessionIpLimits.maxSessionCount * 0.8) {
    //                 console.error("Sessions limit reached >80% for client");
    //             }
    //             resole(!isMaxSessions);
    //         })
    //     })
    // }

    // const countStartedSession = (requestIp) => {
    //     KeyValuesStorage.incrSessionCount(requestIp);
    // }

    /**
     * Dummy functions to temporally 
     */
    const isNewSessionAllowed = async () => {
        return new Promise(resolve => resolve(true));
    }

    const countStartedSession = () => {
    }

    return {
        isNewSessionAllowed,
        countStartedSession
    }
})();

module.exports = WebSessionLimiter;