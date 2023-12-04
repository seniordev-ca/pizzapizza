/**
 * Config and evn picker for MW
 * !!!!
 * Make Sure That Config Is NOT EXPOSED to client build
 * Only For Web Middleware and Server Side Rendering
 * !!!!
 */

// https://cloud.google.com/appengine/docs/standard/nodejs/runtime
const gaeAppId = process.env.GOOGLE_CLOUD_PROJECT;
const isRunningLocally = !gaeAppId;
let currentEnv = 'ppl-uat3-fe-phx2';

// IP ADDRESS of redis server
// https://console.cloud.google.com/memorystore/redis/instances

// Sessions IP limiter is not used in current version
const devSessionIpLimits = {
    isEnabled: false,
    host: isRunningLocally ? 'localhost' : '10.0.0.3',
    port: '6379',
    maxSessionCount: 30,
    limitResetTimeSec: 60*5 // 5 minutes
}

const prodSessionIpLimits = {
    isEnabled: true,
    host: '10.0.0.3',
    port: '6379',
    maxSessionCount: 30,
    limitResetTimeSec: 60*5 // 5 minutes
}

// Maps project id to enviroment
const appsEnv = {
    'ppl-dev-fe-phx2': 'praful_dev',
    'ppl-prod--fe-phx2': 'ppl-prod-fe',
    'ppl-uat3-fe-phx2' : 'ppl-uat3-fe-phx2',
    'ppl-tmp-fe-phx2' : 'ppl-tmp-fe-phx2',
    'ppl-stg-fe-phx2' : 'ppl-stg-fe-phx2',
    'ppl-stg2-fe-phx2' : 'ppl-stg2-fe-phx2'
}

const envConfig = {
    dev: {
        sessionIpLimits: devSessionIpLimits,
        session_secret_key: 'CDRsJ0tLZTFJfqQVSacZ',
        base_api_host: 'https://pp-pizzapizza-mw-dev.appspot.com',
        recaptcha_key: '6LdbxLMUAAAAAM4_SFPvctk4n8FFLLCRGzmJfq6w',
        allowed_api_hosts: [
        ],
        auth: {
            private: 'rs7YpJUvJZaFJYw9t68yMu3rAEW6xWkTaKq8Mxg7wXZswXYZ',
            public: 'abceNz4Bv9VV3GF4YQBL6q4wHK'
        }
    },

    praful_dev: {
        sessionIpLimits: prodSessionIpLimits,
        session_secret_key: '2dlaYIEv4a8Ovs9CnZm8',
        base_api_host: 'https://ppl-dev-phx2.appspot.com',
        recaptcha_key: '6LdbxLMUAAAAAM4_SFPvctk4n8FFLLCRGzmJfq6w',
        allowed_api_hosts: [
        ],
        auth: {
            private: 'rs7YpJUvJZaFJYw9t68yMu3rAEW6xWkTaKq8Mxg7wXZswXYZ',
            public: 'abceNz4Bv9VV3GF4YQBL6q4wHK'
        }
    },

    'ppl-uat3-fe-phx2': {
        sessionIpLimits: prodSessionIpLimits,
        session_secret_key: 'asd234234234234asdasd',
        base_api_host: 'https://ppl-uat3-be-phx2.appspot.com',
        recaptcha_key: '6LdbxLMUAAAAAM4_SFPvctk4n8FFLLCRGzmJfq6w',
        allowed_api_hosts: [

        ],
        auth: {
            private: 'rs7YpJUvJZaFJYw9t68yMu3rAEW6xWkTaKq8Mxg7wXZswXYZ',
            public: 'abceNz4Bv9VV3GF4YQBL6q4wHK'
        }
    },
    'ppl-tmp-fe-phx2': {
        sessionIpLimits: prodSessionIpLimits,
        session_secret_key: 'asd234234234234asdasd',
        base_api_host: 'https://ppl-uat3-be-phx2.appspot.com',
        recaptcha_key: '6LdbxLMUAAAAAM4_SFPvctk4n8FFLLCRGzmJfq6w',
        allowed_api_hosts: [

        ],
        auth: {
            private: 'rs7YpJUvJZaFJYw9t68yMu3rAEW6xWkTaKq8Mxg7wXZswXYZ',
            public: 'abceNz4Bv9VV3GF4YQBL6q4wHK'
        }
    },
    'ppl-stg-fe-phx2': {
        sessionIpLimits: prodSessionIpLimits,
        session_secret_key: 'asd234234234234asdasd',
        base_api_host: 'https://ppl-stg-be-phx2.appspot.com',
        recaptcha_key: '6LdbxLMUAAAAAM4_SFPvctk4n8FFLLCRGzmJfq6w',
        allowed_api_hosts: [

        ],
        auth: {
            private: 'rs7YpJUvJZaFJYw9t68yMu3rAEW6xWkTaKq8Mxg7wXZswXYZ',
            public: 'abceNz4Bv9VV3GF4YQBL6q4wHK'
        }
    },
    'ppl-stg2-fe-phx2': {
        sessionIpLimits: prodSessionIpLimits,
        session_secret_key: 'asd234234234234asdasd',
        base_api_host: 'https://ppl-uat3-be-phx2.appspot.com',
        recaptcha_key: '6LdbxLMUAAAAAM4_SFPvctk4n8FFLLCRGzmJfq6w',
        allowed_api_hosts: [

        ],
        auth: {
            private: 'rs7YpJUvJZaFJYw9t68yMu3rAEW6xWkTaKq8Mxg7wXZswXYZ',
            public: 'abceNz4Bv9VV3GF4YQBL6q4wHK'
        }
    },
    'ppl-prod-fe': {
        sessionIpLimits: devSessionIpLimits,
        session_secret_key: 'CDRsJ0tLZTFJfqQVSacZ',
        base_api_host: 'https://ppl-prod--be--phx2.appspot.com',
        recaptcha_key: '6LdbxLMUAAAAAM4_SFPvctk4n8FFLLCRGzmJfq6w',
        allowed_api_hosts: [
        ],
        auth: {
            private: 'rs7YpJUvJZaFJYw9t68yMu3rAEW6xWkTaKq8Mxg7wXZswXYZ',
            public: 'abceNz4Bv9VV3GF4YQBL6q4wHK'
        }
    }
}

console.log(`Using config for product id: ${gaeAppId}`);

if (appsEnv[gaeAppId]) {
    currentEnv = appsEnv[gaeAppId]
} else {
    console.log(`CRITICAL | Environment is not defined for project id: ${gaeAppId}. Using default configuration: ${currentEnv}`);
    if (!isRunningLocally) {
        console.log(`Current proccess env:`);
        console.log(process.env);
    }
}

module.exports = {
    isRunningLocally,
    ...envConfig[currentEnv]
}