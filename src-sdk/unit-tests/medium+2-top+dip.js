
const comboTestSuiteMedium = {
	testSuiteName: 'Medium + 2 top + dip Combo',
	productSlug: 'medium-2-top-dip-combo_13083',
	testCases: [
		// {
		//   testCaseName: "Not valid empty cart",
		//   addToCartRequest: {
		//     store_id: 117,
		//     is_delivery: true,
		//     products: [
		//       {
		//         product_id: 'combo_13083',
		//         quantity: 1,
		//         product_option_id: 0,
		//         config_options: [],
		//         child_items: []
		//       }
		//     ]
		//   },
		//   expectedJsResults: {
		//     "errorCode": 0,
		//     "productPrice": 8.99,
		//     "productCalories": "220 Cals/slice",
		//     "validation": {
		//       "isConfigValid": false,
		//       "children": {
		//         "1": {
		//           "isConfigValid": true,
		//           "validationMsg": "Choose 2 TOPPINGS",
		//           "configurations": {
		//             "specialinstructions": {
		//               "isSelectionRequired": false,
		//               "isMaximumAmountReached": false
		//             },
		//             "freetoppings": {
		//               "isSelectionRequired": false,
		//               "isMaximumAmountReached": false
		//             },
		//             "toppings": {
		//               "hasIncludedOptions": true,
		//               "isSelectionRequired": false,
		//               "isMaximumAmountReached": false
		//             },
		//             "doughsaucecheese": {
		//               "isSelectionRequired": false,
		//               "isMaximumAmountReached": false
		//             }
		//           },
		//           "isNotApplicable": false
		//         },
		//         "2": {
		//           "isConfigValid": false,
		//           "validationMsg": "Choose DIPPING SAUCE",
		//           "configurations": {
		//             "dippingsauce": {
		//               "isSelectionRequired": true,
		//               "isMaximumAmountReached": false
		//             }
		//           },
		//           "isNotApplicable": false
		//         }
		//       },
		//       "notConfiguredLineIds": [
		//         2,
		//         1
		//       ],
		//       "validationMsg": "There are one or more items requiring configuration."
		//     }
		//   }
		// },

		// {
		//   testCaseName: "Not valid add to cart request. But pizza is in with default toppings",
		//   addToCartRequest: {
		//     store_id: 117,
		//     is_delivery: true,
		//     products: [
		//       {
		//         product_id: 'combo_13083',
		//         quantity: 1,
		//         product_option_id: 0,
		//         config_options: [],
		//         child_items: [
		//           {
		//             product_id: 'template',
		//             quantity: 1,
		//             config_options: [
		//               {
		//                 config_code: 'RD',
		//                 direction: 'whole',
		//                 quantity: 1
		//               },
		//               {
		//                 config_code: 'SH',
		//                 direction: 'whole',
		//                 quantity: 1
		//               },
		//               {
		//                 config_code: 'MZ',
		//                 direction: 'whole',
		//                 quantity: 1
		//               }
		//             ],
		//             product_option_id: 2932,
		//             line_id: 1
		//           }
		//         ]
		//       }
		//     ]
		//   },
		//   expectedJsResults: {
		//     "errorCode": 0,
		//     "productPrice": 8.99,
		//     "productCalories": "220 Cals/slice",
		//     "validation": {
		//       "isConfigValid": false,
		//       "children": {
		//         "1": {
		//           "isConfigValid": true,
		//           "validationMsg": "Choose 2 TOPPINGS",
		//           "configurations": {
		//             "specialinstructions": {
		//               "isSelectionRequired": false,
		//               "isMaximumAmountReached": false
		//             },
		//             "freetoppings": {
		//               "isSelectionRequired": false,
		//               "isMaximumAmountReached": false
		//             },
		//             "toppings": {
		//               "hasIncludedOptions": true,
		//               "isSelectionRequired": false,
		//               "isMaximumAmountReached": false
		//             },
		//             "doughsaucecheese": {
		//               "isSelectionRequired": false,
		//               "isMaximumAmountReached": false
		//             }
		//           },
		//           "isNotApplicable": false
		//         },
		//         "2": {
		//           "isConfigValid": false,
		//           "validationMsg": "Choose DIPPING SAUCE",
		//           "configurations": {
		//             "dippingsauce": {
		//               "isSelectionRequired": true,
		//               "isMaximumAmountReached": false
		//             }
		//           },
		//           "isNotApplicable": false
		//         }
		//       },
		//       "notConfiguredLineIds": [
		//         2
		//       ],
		//       "validationMsg": "There are one or more items requiring configuration."
		//     }
		//   }
		// },

//     {
//       testCaseName: 'Valid Cart Request. 1 topping is premium(extra charge). Price should be 9.99',
//       addToCartRequest: {
//         store_id: 117,
//         is_delivery: true,
//         products: [{
//           product_id: 'combo_13083',
//           quantity: 1,
//           product_option_id: 0,
//           config_options: [],
//           child_items: [
//             {
//               product_id: 'template',
//               quantity: 1,
//               config_options: [
//                 {
//                   config_code: 'BG',
//                   direction: 'whole',
//                   quantity: 1
//                 },
//                 {
//                   config_code: 'BO',
//                   direction: 'whole',
//                   quantity: 1
//                 },
//                 {
//                   config_code: 'MZ',
//                   direction: 'whole',
//                   quantity: 1
//                 },
//                 {
//                   config_code: 'RD',
//                   direction: 'whole',
//                   quantity: 1
//                 },
//                 {
//                   config_code: 'SH',
//                   direction: 'whole',
//                   quantity: 1
//                 }
//               ],
//               product_option_id: 2932,
//               line_id: 1
//             },
//             {
//               product_id: '1961',
//               quantity: 1,
//               config_options: [
//                 {
//                   config_code: 'BC',
//                   direction: 'whole',
//                   quantity: 1
//                 }
//               ],
//               product_option_id: 1961,
//               line_id: 2
//             }
//           ]
				
//         }]
// },
//       expectedJsResults:{
//         "errorCode": 0,
//         "productPrice": 9.99,
//         "productCalories": "220 Cals/slice",
//         "validation": {
//           "isConfigValid": true,
//           "children": {
//             "1": {
//               "isConfigValid": true,
//               "validationMsg": "",
//               "configurations": {
//                 "specialinstructions": {
//                   "isSelectionRequired": false,
//                   "isMaximumAmountReached": false
//                 },
//                 "freetoppings": {
//                   "isSelectionRequired": false,
//                   "isMaximumAmountReached": false
//                 },
//                 "toppings": {
//                   "isSelectionRequired": false,
//                   "isMaximumAmountReached": false
//                 },
//                 "doughsaucecheese": {
//                   "isSelectionRequired": false,
//                   "isMaximumAmountReached": false
//                 }
//               },
//               "isNotApplicable": false
//             },
//             "2": {
//               "isConfigValid": true,
//               "validationMsg": "",
//               "configurations": {
//                 "dippingsauce": {
//                   "isSelectionRequired": false,
//                   "isMaximumAmountReached": false
//                 }
//               },
//               "isNotApplicable": false
//             }
//           },
//           "notConfiguredLineIds": []
//         }
//       }
//     },
		{
			testCaseName: 'Valid Cart Request. 1 topping is premium(extra charge) but in included quantity(price of 1 CAD). and the same toping is extra (price 2.6 CAD) Price should be 12.59',
			addToCartRequest: {
				store_id: 117,
				is_delivery: true,
				products: [{
					product_id: 'combo_13083',
					quantity: 1,
					product_option_id: 0,
					config_options: [],
					child_items: [
						{
							product_id: 'template',
							quantity: 1,
							config_options: [
	
								{
									config_code: 'BO',
									direction: 'whole',
									quantity: 1
								},
								{
									config_code: 'BG',
									direction: 'whole',
									quantity: 2
								},
								{
									config_code: 'MZ',
									direction: 'whole',
									quantity: 1
								},
								{
									config_code: 'RD',
									direction: 'whole',
									quantity: 1
								},
								{
									config_code: 'SH',
									direction: 'whole',
									quantity: 1
								}
							],
							product_option_id: 2932,
							line_id: 1
						},
						{
							product_id: '1961',
							quantity: 1,
							config_options: [
								{
									config_code: 'BC',
									direction: 'whole',
									quantity: 1
								}
							],
							product_option_id: 1961,
							line_id: 2
						}
					]
				
				}]
},
			expectedJsResults: {
				"errorCode": 0,
				"productPrice": 12.59,
				"productCalories": "220 Cals/slice",
				"validation": {
					"isConfigValid": true,
					"children": {
						"1": {
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
							},
							"isNotApplicable": false
						},
						"2": {
							"isConfigValid": true,
							"validationMsg": "",
							"configurations": {
								"dippingsauce": {
									"isSelectionRequired": false,
									"isMaximumAmountReached": false
								}
							},
							"isNotApplicable": false
						}
					},
					"notConfiguredLineIds": []
				}
			}
		},
		{
			testCaseName: 'Valid Cart Request. 2 toppings are premium(extra charge) and are included qunatity(price of 1 CAD). and regular topping is not in included quantity (price 1.6 CAD) Price should be 15.59',
			addToCartRequest: {
				store_id: 117,
				is_delivery: true,
				products: [{
					product_id: 'combo_13083',
					quantity: 1,
					product_option_id: 0,
					config_options: [],
					child_items: [
						{
							product_id: 'template',
							quantity: 1,
							config_options: [
								{
									config_code: 'BG',
									direction: 'whole',
									quantity: 2
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
								},
								{
									config_code: 'RD',
									direction: 'whole',
									quantity: 1
								},
								{
									config_code: 'SH',
									direction: 'whole',
									quantity: 1
								}
							],
							product_option_id: 2932,
							line_id: 1
						},
						{
							product_id: '1961',
							quantity: 1,
							config_options: [
								{
									config_code: 'BC',
									direction: 'whole',
									quantity: 1
								}
							],
							product_option_id: 1961,
							line_id: 2
						}
					]
				
				}]
},
			expectedJsResults: {
				"errorCode": 0,
				"productPrice": 12.59,
				"productCalories": "220 Cals/slice",
				"validation": {
					"isConfigValid": true,
					"children": {
						"1": {
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
							},
							"isNotApplicable": false
						},
						"2": {
							"isConfigValid": true,
							"validationMsg": "",
							"configurations": {
								"dippingsauce": {
									"isSelectionRequired": false,
									"isMaximumAmountReached": false
								}
							},
							"isNotApplicable": false
						}
					},
					"notConfiguredLineIds": []
				}
			}
		},
		{
			testCaseName: 'Valid Cart Request. 1 Reg topping (0 cad) 1 premium(1 CAD). 2 different premium (5.20 since its over allowed amount of included toppings)',
			addToCartRequest: {
				store_id: 117,
				is_delivery: true,
				products: [{
					product_id: 'combo_13083',
					quantity: 1,
					product_option_id: 0,
					config_options: [],
					child_items: [
						{
							product_id: 'template',
							quantity: 1,
							config_options: [
	
								{
									config_code: 'BO',
									direction: 'whole',
									quantity: 1
								},
								{
									config_code: 'BG',
									direction: 'whole',
									quantity: 2
								},
								{
									config_code: 'CH',
									direction: 'whole',
									quantity: 1
								},
								{
									config_code: 'MZ',
									direction: 'whole',
									quantity: 1
								},
								{
									config_code: 'RD',
									direction: 'whole',
									quantity: 1
								},
								{
									config_code: 'SH',
									direction: 'whole',
									quantity: 1
								}
							],
							product_option_id: 2932,
							line_id: 1
						},
						{
							product_id: '1961',
							quantity: 1,
							config_options: [
								{
									config_code: 'BC',
									direction: 'whole',
									quantity: 1
								}
							],
							product_option_id: 1961,
							line_id: 2
						}
					]
				
				}]
},
			expectedJsResults: {
				"errorCode": 0,
				"productPrice": 15.19,
				"productCalories": "220 Cals/slice",
				"validation": {
					"isConfigValid": true,
					"children": {
						"1": {
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
							},
							"isNotApplicable": false
						},
						"2": {
							"isConfigValid": true,
							"validationMsg": "",
							"configurations": {
								"dippingsauce": {
									"isSelectionRequired": false,
									"isMaximumAmountReached": false
								}
							},
							"isNotApplicable": false
						}
					},
					"notConfiguredLineIds": []
				}
			}
		},
	]
}

describe(`Test suite: ${comboTestSuiteMedium.testSuiteName}`, () => {

	let productSlug = comboTestSuiteMedium.productSlug;
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
	comboTestSuiteMedium.testCases.forEach((testCase) => {
		const addToCartRequest = testCase.addToCartRequest;
		const expectedJsResults = testCase.expectedJsResults;
		it(`Test case: ${testCase.testCaseName}`, () => {
			const sdkResult = ppSdk.getProductInfo(addToCartRequest);

			expect(sdkResult).to.deep.equal(expectedJsResults);
		})
	});
})

