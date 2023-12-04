
const config = require('./../config');
const filesDal = require('./files-dal');
const httpDal = require('./http-dal');

const productsToFetch = require('../test-products');

const grabProductsConfig = (() => {
    /**
     * Removing and creating all folders with product configs
     */
    const cleanServerDataFolder = (ready) => {
        filesDal.cleanServerDataFolder(() => {
            ready(ready);
        });
    }


    saveAllProductConfigs = (ready) => {
        if (productsToFetch.length === 0) {
            return false;
        }
        const record = productsToFetch.pop();
        const storeId = record.storeId;
        const productSlug = record.productSlug;

        httpDal.fetchProductConfig(storeId, productSlug, (data, requestUrl) => {
            const jsonProductConfig = JSON.parse(data);
            const kind = jsonProductConfig.kind;
            console.log(`Successfully fetched. \nKind: ${kind}`);
            filesDal.saveJsonToFile(jsonProductConfig, productSlug, (message) => {
                console.log(message);
                // _addTestCaseToDict(kind, requestUrl, currentProduct, productSlug, storeId, testCaseName);
                saveAllProductConfigs(ready);
            });
        });

    }

    return {
        cleanServerDataFolder,
        saveAllProductConfigs
    }
})()


// grabProductsConfig.cleanServerDataFolder(() => {
    grabProductsConfig.saveAllProductConfigs(() => {
        console.log('All product configs are saved');
    })
// });


