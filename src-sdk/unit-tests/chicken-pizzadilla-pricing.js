const ChickenPizzaDillaTestSuite = {
	testSuiteName: 'chicken-pquesadilla',
	productSlug: 'chicken-quesadilla-combo_11723',
	testCases: [
		{
			testCaseName: "Every included topping has qunatity of 1. 5th topping was added. Price should change to 7.50 CAD",
			addToCartRequest: {
				store_id: 117,
				is_delivery: true,
				products: [{
					product_id: 'combo_11723',
					quantity: 1,
					product_option_id: 0,
					config_options: [],
					child_items: [
						{
							product_id: 'template',
							product_option_id: 11730,
							quantity: 1,
							config_options: [
								{
									config_code: 'CH',
									direction: 'whole',
									quantity: 1
								},
								{
									config_code: 'RP',
									direction: 'whole',
									quantity: 1
								},
								{
									config_code: 'GP',
									direction: 'whole',
									quantity: 1
								},
								{
									config_code: 'BO',
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
						},
						{
							product_id: '9782',
							product_option_id: 9782,
							config_options: [],
							quantity: 1,
							line_id: 2
						}
					]
				}]

			},
			expectedJsResults:
				{
					"errorCode": 0,
					"productPrice": 7.74,
					"productCalories": '760 Cals',
					"validation": {
						"isConfigValid": true,
						"children": {
							"1": {
								"isConfigValid": true,
								"validationMsg": "",
								"configurations": {
									"toppings": {
										"isSelectionRequired": false,
										"isMaximumAmountReached": false
									}
								},
								"isNotApplicable": false
							},
							"2": {
								"isConfigValid": true,
								"validationMsg": "",
								"configurations": {},
								"isNotApplicable": false
							}
						},
						"notConfiguredLineIds": []
					}
				}
		},

		{
			testCaseName: "One of included toppings amount was increased to 3. Price should change to 8.75 CAD",
			addToCartRequest: {
				store_id: 117,
				is_delivery: true,
				products: [{
					product_id: 'combo_11723',
					quantity: 1,
					product_option_id: 0,
					config_options: [],
					child_items: [
						{
							product_id: 'template',
							product_option_id: 11730,
							quantity: 1,
							config_options: [
								{
									config_code: 'CH',
									direction: 'whole',
									quantity: 1
								},
								{
									config_code: 'RP',
									direction: 'whole',
									quantity: 3
								},
								{
									config_code: 'GP',
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
						},
						{
							product_id: '9782',
							product_option_id: 9782,
							config_options: [],
							quantity: 1,
							line_id: 2
						}
					]
				}]

			},
			expectedJsResults:
				{
					"errorCode": 0,
					"productPrice": 8.99,
					"productCalories": '760 Cals',
					"validation": {
						"isConfigValid": true,
						"children": {
							"1": {
								"isConfigValid": true,
								"validationMsg": "",
								"configurations": {
									"toppings": {
										"isSelectionRequired": false,
										"isMaximumAmountReached": false
									}
								},
								"isNotApplicable": false
							},
							"2": {
								"isConfigValid": true,
								"validationMsg": "",
								"configurations": {},
								"isNotApplicable": false
							}
						},
						"notConfiguredLineIds": []
					}
				}
		},
		{
			testCaseName: "5th topping was added. One of toppings has amount of 3. Price should change to 10.24 CAD",
			addToCartRequest: {
				store_id: 117,
				is_delivery: true,
				products: [{
					product_id: 'combo_11723',
					quantity: 1,
					product_option_id: 0,
					config_options: [],
					child_items: [
						{
							product_id: 'template',
							product_option_id: 11730,
							quantity: 1,
							config_options: [
								{
									config_code: 'CH',
									direction: 'whole',
									quantity: 1
								},
								{
									config_code: 'RP',
									direction: 'whole',
									quantity: 3
								},
								{
									config_code: 'GP',
									direction: 'whole',
									quantity: 1
								},
								{
									config_code: 'BO',
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
						},
						{
							product_id: '9782',
							product_option_id: 9782,
							config_options: [],
							quantity: 1,
							line_id: 2
						}
					]
				}]

			},
			expectedJsResults:
				{
					"errorCode": 0,
					"productPrice": 10.24,
					"productCalories": '760 Cals',
					"validation": {
						"isConfigValid": true,
						"children": {
							"1": {
								"isConfigValid": true,
								"validationMsg": "",
								"configurations": {
									"toppings": {
										"isSelectionRequired": false,
										"isMaximumAmountReached": false
									}
								},
								"isNotApplicable": false
							},
							"2": {
								"isConfigValid": true,
								"validationMsg": "",
								"configurations": {},
								"isNotApplicable": false
							}
						},
						"notConfiguredLineIds": []
					}
				}
		},
		// {
		//     testCaseName: '4 toppings are free for this combo. 3 toppings are selected but one of them has quantity 2. Price should remain the same 6.25',
		//     addToCartRequest: {
		//         store_id: 117,
		//         is_delivery: true,
		//         product_id: 'combo_11723',
		//         quantity: 1,
		//         product_option_id: 0,
		//         config_options: [],
		//         child_items: [
		//             {
		//                 product_id: 'template',
		//                 product_option_id: 11730,
		//                 quantity: 1,
		//                 config_options: [
		//                     {
		//                         config_code: 'CH',
		//                         direction: 'whole',
		//                         quantity: 1
		//                     },
		//                     {
		//                         config_code: 'RP',
		//                         direction: 'whole',
		//                         quantity: 2
		//                     },
		//                     {
		//                         config_code: 'MZ',
		//                         direction: 'whole',
		//                         quantity: 1
		//                     }
		//                 ],
		//                 line_id: 1
		//             },
		//             {
		//                 product_id: '9782',
		//                 product_option_id: 9782,
		//                 config_options: [],
		//                 quantity: 1,
		//                 line_id: 2
		//             }
		//         ]
		//     },
		//     expectedJsResults: {
		//         "errorCode": 0,
		//         "productPrice": 6.25,
		//         "productCalories": 0,
		//         "validation": {
		//             "isConfigValid": true,
		//             "children": {
		//                 "1": {
		//                     "isConfigValid": true,
		//                     "validationMsg": "",
		//                     "configurations": {
		//                         "toppings": {
		//                             "isSelectionRequired": false,
		//                             "isMaximumAmountReached": false
		//                         }
		//                     },
		//                     "isNotApplicable": false
		//                 },
		//                 "2": {
		//                     "isConfigValid": true,
		//                     "validationMsg": "",
		//                     "configurations": {},
		//                     "isNotApplicable": false
		//                 }
		//             }
		//         }
		//     }
		// },
		// {
		//     testCaseName: '4 toppings are free for this combo. 3 toppings are selected. last topping has amount of 2. Price should remain the same 6.25',
		//     addToCartRequest: {
		//         store_id: 117,
		//         is_delivery: true,
		//         product_id: 'combo_11723',
		//         quantity: 1,
		//         product_option_id: 0,
		//         config_options: [],
		//         child_items: [
		//             {
		//                 product_id: 'template',
		//                 product_option_id: 11730,
		//                 quantity: 1,
		//                 config_options: [
		//                     {
		//                         config_code: 'CH',
		//                         direction: 'whole',
		//                         quantity: 1
		//                     },
		//                     {
		//                         config_code: 'RP',
		//                         direction: 'whole',
		//                         quantity: 1
		//                     },
		//                     {
		//                         config_code: 'GP',
		//                         direction: 'whole',
		//                         quantity: 2
		//                     }
		//                 ],
		//                 line_id: 1
		//             },
		//             {
		//                 product_id: '9782',
		//                 product_option_id: 9782,
		//                 config_options: [],
		//                 quantity: 1,
		//                 line_id: 2
		//             }
		//         ]
		//     },
		//     expectedJsResults: {
		//         "errorCode": 0,
		//         "productPrice": 6.25,
		//         "productCalories": 0,
		//         "validation": {
		//             "isConfigValid": true,
		//             "children": {
		//                 "1": {
		//                     "isConfigValid": true,
		//                     "validationMsg": "",
		//                     "configurations": {
		//                         "toppings": {
		//                             "isSelectionRequired": false,
		//                             "isMaximumAmountReached": false
		//                         }
		//                     },
		//                     "isNotApplicable": false
		//                 },
		//                 "2": {
		//                     "isConfigValid": true,
		//                     "validationMsg": "",
		//                     "configurations": {},
		//                     "isNotApplicable": false
		//                 }
		//             }
		//         }
		//     }
		// },
		// {
		//     testCaseName: '3 toppings are selected. Two of the have quantity - 2. Third topping has amount of 1. Price should be 7.50 cad',
		//     addToCartRequest: {
		//         store_id: 117,
		//         is_delivery: true,
		//         product_id: 'combo_11723',
		//         quantity: 1,
		//         product_option_id: 0,
		//         config_options: [],
		//         child_items: [
		//             {
		//                 product_id: 'template',
		//                 product_option_id: 11730,
		//                 quantity: 1,
		//                 config_options: [
		//                     {
		//                         config_code: 'CH',
		//                         direction: 'whole',
		//                         quantity: 2
		//                     },
		//                     {
		//                         config_code: 'RP',
		//                         direction: 'whole',
		//                         quantity: 1
		//                     },
		//                     {
		//                         config_code: 'GP',
		//                         direction: 'whole',
		//                         quantity: 2
		//                     }
		//                 ],
		//                 line_id: 1
		//             },
		//             {
		//                 product_id: '9782',
		//                 product_option_id: 9782,
		//                 config_options: [],
		//                 quantity: 1,
		//                 line_id: 2
		//             }
		//         ]
		//     },
		//     expectedJsResults: {
		//         "errorCode": 0,
		//         "productPrice": 7.50,
		//         "productCalories": 0,
		//         "validation": {
		//             "isConfigValid": true,
		//             "children": {
		//                 "1": {
		//                     "isConfigValid": true,
		//                     "validationMsg": "",
		//                     "configurations": {
		//                         "toppings": {
		//                             "isSelectionRequired": false,
		//                             "isMaximumAmountReached": false
		//                         }
		//                     },
		//                     "isNotApplicable": false
		//                 },
		//                 "2": {
		//                     "isConfigValid": true,
		//                     "validationMsg": "",
		//                     "configurations": {},
		//                     "isNotApplicable": false
		//                 }
		//             }
		//         }
		//     }
		// }
	]
}

describe(`Test suite: ${ChickenPizzaDillaTestSuite.testSuiteName}`, () => {

	let productSlug = ChickenPizzaDillaTestSuite.productSlug;
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
	ChickenPizzaDillaTestSuite.testCases.forEach((testCase) => {
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

