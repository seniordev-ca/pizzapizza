const cheezePanzerotti = {
	testSuiteName: 'Cheese Panzerotti',
	productSlug: 'cheese-panzerotti-fried-product_8780',
	testCases: [
		{
			testCaseName: 'Not edited product, validation still should pass',
			addToCartRequest: {
				store_id: 117,
				is_delivery: true,
				products: [
					{
						product_id: 'product_8780',
						quantity: 1,
						product_option_id: 8780,
						config_options: [
							{
								config_code: 'RD',
								direction: 'whole',
								quantity: 1
							},
							{
								config_code: 'SH',
								direction: 'whole',
								quantity: 1
							},
							{
								config_code: 'MZ',
								direction: 'whole',
								quantity: 1
							}
						],
						line_id: 1
					}
				]
			},
			expectedJsResults: {
				"errorCode": 0,
				"productPrice": 6.79,
				"productCalories": "1340 Cals",
				"validation": {
					"isConfigValid": true,
					"validationMsg": "There is 1 more selection that is available in section TOPPINGS. ",
					"configurations": {
						"specialinstructions": {
							"isSelectionRequired": false,
							"isMaximumAmountReached": false
						},
						"freetoppings": {
							"isSelectionRequired": false,
							"isMaximumAmountReached": false
						},
						"toppings": {
							"hasIncludedOptions": true,
							"isSelectionRequired": false,
							"isMaximumAmountReached": false
						},
						"doughsaucecheese": {
							"isSelectionRequired": false,
							"isMaximumAmountReached": false
						}
					}
				}
			}
		}


	]
}

describe(`Test suite: ${cheezePanzerotti.testSuiteName}`, () => {

	let productSlug = cheezePanzerotti.productSlug;
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
	cheezePanzerotti.testCases.forEach((testCase) => {
		const addToCartRequest = testCase.addToCartRequest;
		const expectedJsResults = testCase.expectedJsResults;
		it(`Test case: ${testCase.testCaseName}`, () => {
			const sdkResult = ppSdk.getProductInfo(addToCartRequest);

			expect(sdkResult).to.deep.include(expectedJsResults);
		})
	});
})

