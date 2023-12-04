const env = 'local';
const availableEnv = ['local' ,'dev', 'sit']

const config = {

    // Run web MW to get menu data
    'local': {
        baseUrl: 'http://localhost:3000'
    },
}

const currentConfig = config[env];

module.exports = currentConfig;
