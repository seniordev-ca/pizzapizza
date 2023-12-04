


const singleValidTestSuite = {
	testSuiteName: 'Sriracha-chicken pricing',
	productSlug: 'sriracha-chicken-collection_11722',
	testCases: [
		{
			testCaseName: 'Sriracha-chicken Default product config',
			addToCartRequest: {
				store_id: 117,
				is_delivery: true,
				products: [{
					product_id: 'collection_11722',
					quantity: 1,
					product_option_id: 12587,
					config_options: [
					  {
						config_code: 'HI',
						direction: 'whole',
						quantity: 1
					  },
					  {
						config_code: 'RD',
						direction: 'whole',
						quantity: 1
					  },
					  {
						config_code: 'PI',
						direction: 'whole',
						quantity: 1
					  },
					  {
						config_code: 'GP',
						direction: 'whole',
						quantity: 1
					  },
					  {
						config_code: 'SK',
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
				}]

			  },
			expectedJsResults: {
				"errorCode": 0,
				"productPrice": 17.49,
				"productCalories": '240 Cals/slice',
				"validation": {
					"isConfigValid": true,
					"validationMsg": "",
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
		},

		// {
		//     testCaseName: 'Removing included topping should not effect price',
		//     addToCartRequest: {
		//         "store_id": 117,
		//         "is_delivery": true,
		//         "product_id": "collection_11722",
		//         "product_option_id": 12587,
		//         "quantity": 1,
		//         "config_options": [
		//             {
		//                 "config_code": "RD",
		//                 "direction": "whole",
		//                 "quantity": 1
		//             },
		//             {
		//                 "config_code": "PI",
		//                 "direction": "whole",
		//                 "quantity": 1
		//             },
		//             {
		//                 "config_code": "MZ",
		//                 "direction": "whole",
		//                 "quantity": 1
		//             },
		//             {
		//                 "config_code": "SH",
		//                 "direction": "whole",
		//                 "quantity": 1
		//             }
		//         ]
		//     },
		//     expectedJsResults: {
		//         errorCode: 0,
		//         productCalories: 465,
		//         productPrice: 17.1,
		//         validation: validSrirachaValidation
		//     }
		// },

		// {
		//     testCaseName: 'Adding not included topping should change the price',
		//     addToCartRequest: {
		//         "store_id": 117,
		//         "is_delivery": true,
		//         "product_id": "collection_11722",
		//         "product_option_id": 12587,
		//         "quantity": 1,
		//         "config_options": [
		//             {
		//                 "config_code": "RD",
		//                 "direction": "whole",
		//                 "quantity": 1
		//             },
		//             {
		//                 "config_code": "PI",
		//                 "direction": "whole",
		//                 "quantity": 1
		//             },
		//             {
		//                 "config_code": "MZ",
		//                 "direction": "whole",
		//                 "quantity": 1
		//             },
		//             {
		//                 "config_code": "SH",
		//                 "direction": "whole",
		//                 "quantity": 1
		//             },

		//             {
		//                 "config_code": "BO",
		//                 "direction": "whole",
		//                 "quantity": 1
		//             },
		//         ]
		//     },
		//     expectedJsResults: {
		//         errorCode: 0,
		//         productCalories: 475,
		//         productPrice: 18.95,
		//         validation: validSrirachaValidation
		//     }
		// },

		// {
		//     testCaseName: 'Default product config with 2 toppings removed',
		//     addToCartRequest: {
		//         "store_id": 117,
		//         "is_delivery": true,
		//         "product_id": "collection_11722",
		//         "product_option_id": 12587,
		//         "quantity": 1,
		//         "config_options": [
		//             {
		//                 "config_code": "HI",
		//                 "direction": "whole",
		//                 "quantity": 1
		//             },
		//             {
		//                 "config_code": "PI",
		//                 "direction": "whole",
		//                 "quantity": 1
		//             }
		//         ]
		//     },
		//     expectedJsResults: {
		//         errorCode: 0,
		//         productCalories: 255,
		//         productPrice: 17.1,
		//         validation: validSrirachaValidation
		//     }
		// },

		// {
		//     testCaseName: 'Product quantity change to 2 should double the price',
		//     addToCartRequest: {
		//         "store_id": 117,
		//         "is_delivery": true,
		//         "product_id": "collection_11722",
		//         "product_option_id": 12587,
		//         "quantity": 2,
		//         "config_options": [
		//             {
		//                 "config_code": "HI",
		//                 "direction": "whole",
		//                 "quantity": 1
		//             },
		//             {
		//                 "config_code": "PI",
		//                 "direction": "whole",
		//                 "quantity": 1
		//             }
		//         ]
		//     },
		//     expectedJsResults: {
		//         errorCode: 0,
		//         productCalories: 510,
		//         productPrice: 34.20,
		//         validation: {}
		//     }
		// },


		// {
		//     testCaseName: '2X quantity should change the price',
		//     addToCartRequest: {
		//         "store_id": 117,
		//         "is_delivery": true,
		//         "product_id": "collection_11722",
		//         "product_option_id": 12587,
		//         "quantity": 1,
		//         "config_options": [
		//             {
		//                 "config_code": "HI",
		//                 "direction": "whole",
		//                 "quantity": 1
		//             },
		//             {
		//                 "config_code": "SK",
		//                 "direction": "whole",
		//                 "quantity": 1
		//             },
		//             {
		//                 "config_code": "GP",
		//                 "direction": "whole",
		//                 "quantity": 2
		//             },
		//             {
		//                 "config_code": "PI",
		//                 "direction": "whole",
		//                 "quantity": 1
		//             }
		//         ]
		//     },
		//     expectedJsResults: {
		//         errorCode: 0,
		//         productCalories: 275,
		//         productPrice: 18.95,
		//         validation: {}
		//     }
		// },

		// {
		//     testCaseName: '3X quantity should change the price',
		//     addToCartRequest: {
		//         "store_id": 117,
		//         "is_delivery": true,
		//         "product_id": "collection_11722",
		//         "product_option_id": 12587,
		//         "quantity": 1,
		//         "config_options": [
		//             {
		//                 "config_code": "HI",
		//                 "direction": "whole",
		//                 "quantity": 1
		//             },
		//             {
		//                 "config_code": "PI",
		//                 "direction": "whole",
		//                 "quantity": 3
		//             }
		//         ]
		//     },
		//     expectedJsResults: {
		//         errorCode: 0,
		//         productCalories: 255,
		//         productPrice: 22.65,
		//         validation: {}
		//     }
		// },

		// {
		//     testCaseName: '1X topping half should have same price as one full',
		//     addToCartRequest: {
		//         "store_id": 117,
		//         "is_delivery": true,
		//         "product_id": "collection_11722",
		//         "product_option_id": 12587,
		//         "quantity": 1,
		//         "config_options": [
		//             {
		//                 "config_code": "HI",
		//                 "direction": "whole",
		//                 "quantity": 1
		//             },
		//             {
		//                 "config_code": "PI",
		//                 "direction": "left",
		//                 "quantity": 1
		//             }
		//         ]
		//     },
		//     expectedJsResults: {
		//         errorCode: 0,
		//         productCalories: 255,
		//         productPrice: 18.95,
		//         validation: {}
		//     }
		// },


		// {
		//     testCaseName: '2X topping half should have same price as one full',
		//     addToCartRequest: {
		//         "store_id": 117,
		//         "is_delivery": true,
		//         "product_id": "collection_11722",
		//         "product_option_id": 12587,
		//         "quantity": 1,
		//         "config_options": [
		//             {
		//                 "config_code": "HI",
		//                 "direction": "whole",
		//                 "quantity": 1
		//             },
		//             {
		//                 "config_code": "PI",
		//                 "direction": "right",
		//                 "quantity": 2
		//             }
		//         ]
		//     },
		//     expectedJsResults: {
		//         errorCode: 0,
		//         productCalories: 255,
		//         productPrice: 18.95,
		//         validation: {}
		//     }
		// },


		// {
		//     testCaseName: '3X topping half should have same price as 2x full',
		//     addToCartRequest: {
		//         "store_id": 117,
		//         "is_delivery": true,
		//         "product_id": "collection_11722",
		//         "product_option_id": 12587,
		//         "quantity": 1,
		//         "config_options": [
		//             {
		//                 "config_code": "HI",
		//                 "direction": "whole",
		//                 "quantity": 1
		//             },
		//             {
		//                 "config_code": "PI",
		//                 "direction": "right",
		//                 "quantity": 3
		//             }
		//         ]
		//     },
		//     expectedJsResults: {
		//         errorCode: 0,
		//         productCalories: 255,
		//         productPrice: 20.8,
		//         validation: {}
		//     }
		// },
	]
}

describe(`Test suite: ${singleValidTestSuite.testSuiteName}`, () => {

	let productSlug = singleValidTestSuite.productSlug;
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
	singleValidTestSuite.testCases.forEach((testCase) => {
		const addToCartRequest = testCase.addToCartRequest;
		const expectedJsResults = testCase.expectedJsResults;
		it(`Test case: ${testCase.testCaseName}`, () => {
			const sdkResult = ppSdk.getProductInfo(addToCartRequest);

			expect(sdkResult).to.deep.include(expectedJsResults);
		})
	});
})

