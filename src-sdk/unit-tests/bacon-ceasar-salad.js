const BaconCaesarSalad = {
	testSuiteName: 'Bacon caesar salad',
	productSlug: 'bacon-caesar-salad-product_11322',
	testCases: [
		{
			testCaseName: "Salad is not configured",
			addToCartRequest: {
				store_id: 117,
				is_delivery: true,
				products: [
					{
						product_id: 'product_11322',
						quantity: 1,
						product_option_id: 11322,
						config_options: [],
						line_id: 1
					}
				]
			},
			expectedJsResults: {
				"errorCode": 0,
				"productPrice": 6.99,
				"productCalories": "350 Cals",
				"validation": {
					"isConfigValid": false,
					"validationMsg": "There is 1 more selection that is required in section Dressing. ",
					"configurations": {
						"toppings": {
							"isSelectionRequired": false,
							"isMaximumAmountReached": false
						},
						"dressing": {
							"isSelectionRequired": true,
							"isMaximumAmountReached": false
						}
					}
				}
			}
		}
	]
}

describe(`Test suite: ${BaconCaesarSalad.testSuiteName}`, () => {

	let productSlug = BaconCaesarSalad.productSlug;
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
	BaconCaesarSalad.testCases.forEach((testCase) => {
		const addToCartRequest = testCase.addToCartRequest;
		const expectedJsResults = testCase.expectedJsResults;
		it(`Test case: ${testCase.testCaseName}`, () => {
			const sdkResult = ppSdk.getProductInfo(addToCartRequest);

			// Ignore message because it needs to be changed
			if (sdkResult && sdkResult.validation && sdkResult.validation.product && sdkResult.validation.product.validationMsg) {
				sdkResult.validation.product.validationMsg = '';
			}

			expect(sdkResult).to.deep.equal(expectedJsResults);
		})
	});
})

