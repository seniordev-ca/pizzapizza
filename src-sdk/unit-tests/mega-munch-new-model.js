
const megaMuchNewModelTestSuite = {
	testSuiteName: 'New Mega Munch Combo',
	productSlug: 'mega-munch-combo_13826',
	testCases: [
		{
			testCaseName: 'Empty cart',
			addToCartRequest: {
				store_id: 117,
				is_delivery: true,
				products: [{
					product_id: 'combo_13826',
					quantity: 1,
					product_option_id: 2921,
					config_options: [],
					line_id: 3,
					child_items: [
					]
				}]

			},
			expectedJsResults: {
				"errorCode": 0,
				"productPrice": 24.99,
				"productCalories": "630 to 1240 Cals/Serving, Serves 3",
				"validation": {
					"isConfigValid": false,
					"children": {
						"1": {
							"isConfigValid": false,
							"validationMsg": "Choose 1 DIPPING SAUCE",
							"configurations": {
								"dippingsauce": {
									"isSelectionRequired": true,
									"isMaximumAmountReached": false
								},
								"classicbreaded": {
									"isSelectionRequired": false,
									"isMaximumAmountReached": false
								}
							},
							"isNotApplicable": false
						},
						"2": {
							"isConfigValid": false,
							"validationMsg": "Choose 1 DIPPING SAUCE",
							"configurations": {
								"dippingsauce": {
									"isSelectionRequired": true,
									"isMaximumAmountReached": false
								}
							},
							"isNotApplicable": false
						},
						"3": {
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
						"4": {
							"isConfigValid": false,
							"validationMsg": "Choose 1 DIPPING SAUCE",
							"configurations": {
								"dippingsauce": {
									"isSelectionRequired": true,
									"isMaximumAmountReached": false
								}
							},
							"isNotApplicable": false
						},
						"5": {
							"isConfigValid": false,
							"validationMsg": "Choose 4 DRINKS",
							"configurations": {
								"drinks": {
									"isSelectionRequired": true,
									"isMaximumAmountReached": false
								}
							},
							"isNotApplicable": false
						}
					},
					"notConfiguredLineIds": [
						1,
						2,
						3,
						4,
						5
					],
					"validationMsg": "There are one or more items requiring configuration."
				}
			}
		},
		{
			testCaseName: 'Pizza Configure, 10 Wings Configured',
			addToCartRequest: {
				store_id: 117,
				is_delivery: false,
				products: [
					{
						product_id: 'combo_13826',
						quantity: 1,
						product_option_id: 0,
						config_options: [],
						child_items: [
							{
								product_id: '13827',
								quantity: 1,
								config_options: [
									{
										config_code: 'MZ',
										direction: 'whole',
										quantity: 1
									},
									{
										config_code: 'SH',
										direction: 'whole',
										quantity: 1
									},
									{
										config_code: 'RD',
										direction: 'whole',
										quantity: 1
									}
								],
								product_option_id: 13107,
								line_id: 3
							},
							{
								product_id: '4440',
								quantity: 1,
								config_options: [
									{
										config_code: 'WC',
										direction: 'whole',
										quantity: 1
									},
									{
										config_code: 'CD',
										direction: 'whole',
										quantity: 1
									}
								],
								product_option_id: 4440,
								line_id: 1
							}
						]
					}
				]
			},
			expectedJsResults: {
				"errorCode": 0,
				"productPrice": 27.99,
				"productCalories": "680 to 1440 Cals/Serving, Serves 5",
				"validation": {
					"isConfigValid": false,
					"children": {
						"1": {
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
							},
							"isNotApplicable": false
						},
						"2": {
							"isConfigValid": false,
							"validationMsg": "Choose 1 DIPPING SAUCE",
							"configurations": {
								"dippingsauce": {
									"isSelectionRequired": true,
									"isMaximumAmountReached": false
								}
							},
							"isNotApplicable": false
						},
						"3": {
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
						"4": {
							"isConfigValid": true,
							"validationMsg": "",
							"configurations": {
								"dippingsauce": {
									"isSelectionRequired": true,
									"isMaximumAmountReached": false
								}
							},
							"isNotApplicable": true
						},
						"5": {
							"isConfigValid": false,
							"validationMsg": "Choose 4 DRINKS",
							"configurations": {
								"drinks": {
									"isSelectionRequired": true,
									"isMaximumAmountReached": false
								}
							},
							"isNotApplicable": false
						}
					},
					"notConfiguredLineIds": [
						2,
						5
					],
					"validationMsg": "There are one or more items requiring configuration."
				}
			}
		},
		{
			testCaseName: 'Only Xl pizza configured ',
			addToCartRequest: {
				store_id: 117,
				is_delivery: false,
				products: [
					{
						product_id: 'combo_13826',
						quantity: 1,
						product_option_id: 0,
						config_options: [],
						child_items: [
							{
								product_id: '13827',
								quantity: 1,
								config_options: [
									{
										config_code: 'MZ',
										direction: 'whole',
										quantity: 1
									},
									{
										config_code: 'SH',
										direction: 'whole',
										quantity: 1
									},
									{
										config_code: 'RD',
										direction: 'whole',
										quantity: 1
									}
								],
								product_option_id: 13109,
								line_id: 3
							}
						]
					}
				]
			},
			expectedJsResults: {
				"errorCode": 0,
				"productPrice": 27.99,
				"productCalories": "690 to 1540 Cals/Serving, Serves 6",
				"validation": {
				  "isConfigValid": false,
				  "children": {
					"1": {
					  "isConfigValid": false,
					  "validationMsg": "Choose 1 DIPPING SAUCE",
					  "configurations": {
						"dippingsauce": {
						  "isSelectionRequired": true,
						  "isMaximumAmountReached": false
						},
						"classicbreaded": {
						  "isSelectionRequired": false,
						  "isMaximumAmountReached": false
						}
					  },
					  "isNotApplicable": false
					},
					"2": {
					  "isConfigValid": false,
					  "validationMsg": "Choose 1 DIPPING SAUCE",
					  "configurations": {
						"dippingsauce": {
						  "isSelectionRequired": true,
						  "isMaximumAmountReached": false
						}
					  },
					  "isNotApplicable": false
					},
					"3": {
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
					"4": {
					  "isConfigValid": false,
					  "validationMsg": "Choose 1 DIPPING SAUCE",
					  "configurations": {
						"dippingsauce": {
						  "isSelectionRequired": true,
						  "isMaximumAmountReached": false
						}
					  },
					  "isNotApplicable": false
					},
					"5": {
					  "isConfigValid": false,
					  "validationMsg": "Choose 4 DRINKS",
					  "configurations": {
						"drinks": {
						  "isSelectionRequired": true,
						  "isMaximumAmountReached": false
						}
					  },
					  "isNotApplicable": false
					}
				  },
				  "notConfiguredLineIds": [
					1,
					2,
					4,
					5
				  ],
				  "validationMsg": "There are one or more items requiring configuration."
				}
			  }
		}


	]
}

describe(`Test suite: ${megaMuchNewModelTestSuite.testSuiteName}`, () => {

	let productSlug = megaMuchNewModelTestSuite.productSlug;
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
	megaMuchNewModelTestSuite.testCases.forEach((testCase) => {
		const addToCartRequest = testCase.addToCartRequest;
		const expectedJsResults = testCase.expectedJsResults;
		it(`Test case: ${testCase.testCaseName}`, () => {
			const sdkResult = ppSdk.getProductInfo(addToCartRequest);

			expect(sdkResult).to.deep.equal(expectedJsResults);
		})
	});
})

