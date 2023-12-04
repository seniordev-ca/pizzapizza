


const fiveWingsValidation = {
	testSuiteName: '5 wings validation',
	productSlug: '5-wings-collection_41201',
	testCases: [
		{
			testCaseName: '1 sauce added. Price should remain the same',
			addToCartRequest: {
				store_id: 117,
				is_delivery: true,
				products: [
					{
						product_id: 'collection_41201',
						quantity: 1,
						product_option_id: 12240,
						config_options: [
							{
								config_code: 'WC',
								direction: 'whole',
								quantity: 1
							},
							{
								config_code: 'BL',
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
				"productPrice": 6.29,
				"productCalories": "510 to 650 Cals",
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
			testCaseName: '2 sauces added. Price should change on 6.78 CAD',
			addToCartRequest: {
				store_id: 117,
				is_delivery: true,
				products: [
					{
						product_id: 'collection_41201',
						quantity: 1,
						product_option_id: 12240,
						config_options: [
							{
								config_code: 'WC',
								direction: 'whole',
								quantity: 1
							},
							{
								config_code: 'BL',
								direction: 'whole',
								quantity: 1
							},
							{
								config_code: 'CG',
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
				"productPrice": 7.18,
				"productCalories": "510 to 650 Cals",
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
			testCaseName: 'NOT Valid product config for 5 wings. Dipping sauce is not chosen',
			addToCartRequest: {
				store_id: 117,
				is_delivery: true,
				products: [{
					product_id: 'collection_41201',
					quantity: 1,
					product_option_id: 12240,
					config_options: [
					  {
						config_code: 'WC',
						direction: 'whole',
						quantity: 1
					  }
					],
					line_id: 1
				}]

			  },
			expectedJsResults: {
				"errorCode": 0,
				"productPrice": 6.29,
				"productCalories": "510 to 650 Cals",
				"validation": {
					"isConfigValid": false,
					"validationMsg": "There is 1 more selection that is required in section DIPPING SAUCE. ",
					"configurations": {
						"dippingsauce": {
							"isSelectionRequired": true,
							"isMaximumAmountReached": false
						},
						"classicbreaded": {
							"isSelectionRequired": false,
							"isMaximumAmountReached": true
						}
					}
				}
			}
		}
	]
}

describe(`Test suite: ${fiveWingsValidation.testSuiteName}`, () => {

	let productSlug = fiveWingsValidation.productSlug;
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
	fiveWingsValidation.testCases.forEach((testCase) => {
		const addToCartRequest = testCase.addToCartRequest;
		const expectedJsResults = testCase.expectedJsResults;
		it(`Test case: ${testCase.testCaseName}`, () => {
			const sdkResult = ppSdk.getProductInfo(addToCartRequest);

			expect(sdkResult).to.deep.include(expectedJsResults);
		})
	});
})

