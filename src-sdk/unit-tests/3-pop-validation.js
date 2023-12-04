const TreePopsTestSuite = {
	testSuiteName: '3 pop validation',
	productSlug: 'variety-3-pack-product_2412',
	testCases: [

		{
			testCaseName: "Empty configuration",
			addToCartRequest: {
				"store_id": 117,
				"is_delivery": true,
				"products":[{
					"product_id": "product_2412",
					"quantity": 1,
					"product_option_id": 2412,
					"config_options": []
				 }]
			   
			},
			expectedJsResults: {
				"errorCode": 0,
				"productPrice": 3.49,
				"productCalories": "0 to 160 Cals/can",
				"validation": {
					"isConfigValid": false,
					"validationMsg": "There are 3 more selections that are required in section DRINKS. ",
					"configurations": {
						"drinks": {
							"isSelectionRequired": true,
							"isMaximumAmountReached": false
						}
					}
				}
			}
		},

		// {
		//     testCaseName: "Not full configuration should give validation message and same price",
		//     addToCartRequest: {
		//         "store_id": 117,
		//         "is_delivery": true,
		//         "product_id": "product_2412",
		//         "quantity": 1,
		//         "product_option_id": 2412,
		//         "config_options": [
		//             {
		//                 "config_code": "FT",
		//                 "direction": "whole",
		//                 "quantity": 1
		//             }
		//         ]
		//     },
		//     expectedJsResults: {
		//         "errorCode": 0,
		//         "productPrice": 3.29,
		//         "productCalories": 160,
		//         "validation": {
		//             "isConfigValid": false,
		//             "validationMsg": "There is 2 more selection that is required in section DRINKS. ",
		//             "configurations": {
		//                 "drinks": {
		//                     "isSelectionRequired": true,
		//                     "isMaximumAmountReached": false
		//                 }
		//             }
		//         }
		//     }
		// },

		{
			testCaseName: "Full configuration of 3 drinks",
			addToCartRequest: {
				"store_id": 117,
				"is_delivery": true,
				"products": [{
					"product_id": "product_2412",
					"quantity": 1,
					"product_option_id": 2412,
					"config_options": [
						{
							"config_code": "RT",
							"direction": "whole",
							"quantity": 1
						},
						{
							"config_code": "CC",
							"direction": "whole",
							"quantity": 1
						},
						{
							"config_code": "FT",
							"direction": "whole",
							"quantity": 1
						}
					]
				}]

			},
			expectedJsResults: {
				"errorCode": 0,
				"productPrice": 3.49,
				"productCalories": "0 to 160 Cals/can",
				"validation": {
					"isConfigValid": true,
					"validationMsg": "",
					"configurations": {
						"drinks": {
							"isSelectionRequired": false,
							"isMaximumAmountReached": true
						}
					}
				}
			}
		},


		// {
		//     testCaseName: "Selection over Valid configuration",
		//     addToCartRequest: {
		//         "store_id": 117,
		//         "is_delivery": true,
		//         "product_id": "product_2412",
		//         "quantity": 1,
		//         "product_option_id": 2412,
		//         "config_options": [
		//             {
		//                 "config_code": "RT",
		//                 "direction": "whole",
		//                 "quantity": 1
		//             },
		//             {
		//                 "config_code": "FR",
		//                 "direction": "whole",
		//                 "quantity": 1
		//             },
		//             {
		//                 "config_code": "FT",
		//                 "direction": "whole",
		//                 "quantity": 1
		//             },
		//             {
		//                 "config_code": "CC",
		//                 "direction": "whole",
		//                 "quantity": 1
		//             }
		//         ]
		//     },
		//     expectedJsResults: {
		//         errorCode: 0,
		//         productPrice: 8.41,
		//         productCalories: 450,
		//         validation: {}
		//     }
		// }
	]
}

describe(`Test suite: ${TreePopsTestSuite.testSuiteName}`, () => {

	let productSlug = TreePopsTestSuite.productSlug;
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
	TreePopsTestSuite.testCases.forEach((testCase) => {
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

