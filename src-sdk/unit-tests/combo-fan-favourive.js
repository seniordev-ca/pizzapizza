const comboFanFavourite = {
	testSuiteName: 'Combo fan favourite',
	productSlug: 'fan-favourite-combo_14316',
	testCases: [
		{
			testCaseName: "Initial add to cart request",
			addToCartRequest: {
				store_id: 117,
				is_delivery: false,
				products: [{
					child_items: [],
					config_options: [],
					product_id: "combo_14316",
					product_option_id: 0,
					quantity: 1,
				}]
			},
			expectedJsResults: { "errorCode": 0, "productPrice": 13.99, "productCalories": "440 to 720 Cals/Serving, Serves 5", "validation": { "isConfigValid": false, "children": { "1": { "isConfigValid": true, "validationMsg": "Choose 3 TOPPINGS", "configurations": { "specialinstructions": { "isSelectionRequired": false, "isMaximumAmountReached": false }, "freetoppings": { "isSelectionRequired": false, "isMaximumAmountReached": false }, "toppings": { "hasIncludedOptions": true, "isSelectionRequired": false, "isMaximumAmountReached": false }, "doughsaucecheese": { "isSelectionRequired": false, "isMaximumAmountReached": false } }, "isNotApplicable": false }, "2": { "isConfigValid": false, "validationMsg": "Choose 3 DRINKS", "configurations": { "drinks": { "isSelectionRequired": true, "isMaximumAmountReached": false } }, "isNotApplicable": false } }, "notConfiguredLineIds": [1, 2], "validationMsg": "There are one or more items requiring configuration." } }
		}
	]
}

describe(`Test suite: ${comboFanFavourite.testSuiteName}`, () => {

	let productSlug = comboFanFavourite.productSlug;
	let currentProductConfig = null;
	/**
	 * Fetch product config from local data fetched by nodeJs script before testing
	 */
	before(() => {
		const isServer = typeof window === 'undefined';
		if (isServer) {
			require(`../dist/pp-sdk-bundle`);
			return new Promise((resolve) => {
				currentProductConfig = require(`../unit-tests-infrastructure/server-data/${productSlug}.json`);
				const chai = require('chai');
				expect = chai.expect;    // Using Expect style
				resolve();
			})
		} else {
			return new Promise((resolve) => {
				$.get(`unit-tests-infrastructure/server-data/${productSlug}.json`, (data) => {
					currentProductConfig = data;
					resolve();
				});
			})
		}
	});

	/**
	 * Passing product config to SDK
	 * SDK should return success message
	 */
	it(`Initiating SDK for product`, () => {
		const sdkResult = ppSdk.initProduct(currentProductConfig.js_data, 'web', 'en');
		const expectedJsResponse = {
			errorCode: 0
		};
		expect(expectedJsResponse).to.deep.equal(sdkResult);
	});

	/**
	 * Test every addToCart <-> expected results pairs for current product
	 */
	comboFanFavourite.testCases.forEach((testCase) => {
		const addToCartRequest = testCase.addToCartRequest;
		const expectedJsResults = testCase.expectedJsResults;
		it(`Test case: ${testCase.testCaseName}`, () => {
			const sdkResult = ppSdk.getProductInfo(addToCartRequest);

			expect(sdkResult).to.deep.equal(expectedJsResults);
		})
	});
})

