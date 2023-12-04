const scoreSavingsNewModelTestSuite = {
	testSuiteName: 'Score Savings Combo New Model',
	productSlug: 'score-savings-combo_14265',
	testCases: [
		{
			testCaseName: 'One twin is edited.',
			addToCartRequest: { "store_id": 1, "is_delivery": false, "products": [{ "product_id": "combo_14265", "quantity": 1, "product_option_id": 0, "config_options": [], "child_items": [{ "product_id": "14266", "quantity": 1, "config_options": [{ "config_code": "RD", "direction": "whole", "quantity": 1 }, { "config_code": "MZ", "direction": "whole", "quantity": 1 }, { "config_code": "SH", "direction": "whole", "quantity": 1 }], "product_option_id": 14274, "line_id": 2 }] }] },
			expectedJsResults: { "errorCode": 0, "productPrice": 25.49, "productCalories": "400 to 760 Cals/serving, serves 10", "validation": { "isConfigValid": false, "children": { "1": { "isConfigValid": false, "validationMsg": "Choose 2 DIPPING SAUCE", "configurations": { "dippingsauce": { "isSelectionRequired": true, "isMaximumAmountReached": false } }, "isNotApplicable": false }, "2": { "isConfigValid": true, "validationMsg": "", "configurations": { "specialinstructions": { "isSelectionRequired": false, "isMaximumAmountReached": false }, "freetoppings": { "isSelectionRequired": false, "isMaximumAmountReached": false }, "toppings": { "hasIncludedOptions": true, "isSelectionRequired": false, "isMaximumAmountReached": false }, "doughsaucecheese": { "isSelectionRequired": false, "isMaximumAmountReached": false } }, "isNotApplicable": false }, "3": { "isConfigValid": false, "validationMsg": "", "configurations": { "drinks": { "isSelectionRequired": true, "isMaximumAmountReached": false } }, "isNotApplicable": false }, "4": { "isConfigValid": true, "validationMsg": "", "configurations": { "specialinstructions": { "isSelectionRequired": false, "isMaximumAmountReached": false }, "freetoppings": { "isSelectionRequired": false, "isMaximumAmountReached": false }, "toppings": { "hasIncludedOptions": true, "isSelectionRequired": false, "isMaximumAmountReached": false }, "doughsaucecheese": { "isSelectionRequired": false, "isMaximumAmountReached": false } }, "isNotApplicable": false } }, "notConfiguredLineIds": [1, 3, 4], "validationMsg": "There are one or more items requiring configuration." } }
		}
	]
}

describe(`Test suite: ${scoreSavingsNewModelTestSuite.testSuiteName}`, () => {

	let productSlug = scoreSavingsNewModelTestSuite.productSlug;
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
	scoreSavingsNewModelTestSuite.testCases.forEach((testCase) => {
		const addToCartRequest = testCase.addToCartRequest;
		const expectedJsResults = testCase.expectedJsResults;
		it(`Test case: ${testCase.testCaseName}`, () => {
			const sdkResult = ppSdk.getProductInfo(addToCartRequest);

			expect(sdkResult).to.deep.equal(expectedJsResults);
		})
	});
})

