const TenWingsTestSuite = {
	testSuiteName: '10 wings pricing',
	productSlug: '10-wings-collection_41202',
	testCases: [
		{
			testCaseName: "Two different sauces added. The price should increase",
			addToCartRequest: {
				"store_id": 117,
				"is_delivery": true,
				"products":[{
					"product_id": "collection_41202",
					"quantity": 1,
					"product_option_id": 1877,
					"config_options": [
						{
							"config_code": "WC",
							"direction": "whole",
							"quantity": 1
						},
						{
							"config_code": "BC",
							"direction": "whole",
							"quantity": 1
						},
						{
							"config_code": "BL",
							"direction": "whole",
							"quantity": 1
						}
					],
					"line_id": 1
				}]

			},

			expectedJsResults: {
				"errorCode": 0,
				"productPrice": 10.88,
				"productCalories": '510 to 650 Cals/5 pcs, serves 2',
				"validation": {
					"isConfigValid": true,
					"validationMsg": "",
					"configurations": {
						"dippingsauce": {
							"isSelectionRequired": false,
							"isMaximumAmountReached": false
						},
						"classicbreaded": {
							"isSelectionRequired": false,
							"isMaximumAmountReached": true
						}
					}
				}
			}
		},

		{
			testCaseName: "Two same sauces added. The price should increase",
			addToCartRequest: {
				"store_id": 117,
				"is_delivery": true,
				"products":[{
					"product_id": "collection_41202",
					"quantity": 1,
					"product_option_id": 1877,
					"config_options": [
						{
							"config_code": "WC",
							"direction": "whole",
							"quantity": 1
						},
						{
							"config_code": "BC",
							"direction": "whole",
							"quantity": 2
						}
					],
					"line_id": 1
				}]
			   
			},

			expectedJsResults: {
				"errorCode": 0,
				"productPrice": 10.88,
				"productCalories": '510 to 650 Cals/5 pcs, serves 2',
				"validation": {
					"isConfigValid": true,
					"validationMsg": "",
					"configurations": {
						"dippingsauce": {
							"isSelectionRequired": false,
							"isMaximumAmountReached": false
						},
						"classicbreaded": {
							"isSelectionRequired": false,
							"isMaximumAmountReached": true
						}
					}
				}
			}
		},


	]
}



describe(`Test suite: ${TenWingsTestSuite.testSuiteName}`, () => {

	let productSlug = TenWingsTestSuite.productSlug;
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
	TenWingsTestSuite.testCases.forEach((testCase) => {
		const addToCartRequest = testCase.addToCartRequest;
		const expectedJsResults = testCase.expectedJsResults;
		it(`Test case: ${testCase.testCaseName}`, () => {
			const sdkResult = ppSdk.getProductInfo(addToCartRequest);

			// Ignore message because it needs to be changed
			if (sdkResult && sdkResult.validation.product && sdkResult.validation.product.validationMsg) {
				sdkResult.validation.product.validationMsg = '';
			}

			expect(sdkResult).to.deep.equal(expectedJsResults);
		})
	});
})

