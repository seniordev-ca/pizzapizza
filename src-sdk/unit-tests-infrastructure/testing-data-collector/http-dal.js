const config = require('./../config');


const httpDal = (() => {
    const request = require('request');
    const baseUrl = config.baseUrl;
    const fetchProductConfig = (storeId, productSlug, success) => {

        const requestUrl = `${baseUrl}/ajax/catalog/api/v1/product/config/${storeId}?product_slug=${productSlug}`;

        console.log('Requesting URL:');
        console.log(requestUrl);

        /**
         * In case if you need to grab a config from specific environment
         * Same approach as for FE environment picker
         */
        const options = {
            url: requestUrl,
            // headers: {
            //     'base-api-url': 'https://andrew-dot-pizzapizza-mw.appspot.com'
            // }
            headers: {
                'base-api-url': 'https://pp-pizzapizza-services-uat.appspot.com',
                'X-REQUEST-ID': Math.random(100000).toString()
            }
        };

        request(options, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                // console.log(body) // Print the google web page.
                success(body, requestUrl);
            } else {
                if (response) {
                    console.log(`Http code: ${response.statusCode}`);
                }
                console.log(error);
            }
        })

    }

    return {
        fetchProductConfig
    }

})()

module.exports = httpDal;
