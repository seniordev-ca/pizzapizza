const scoreSavingsTestSuite = {
	testSuiteName: 'Score Savings Combo',
	productSlug: 'score-savings-combo_11854',
	testCases: [
		{
			testCaseName: 'Empty cart. Default size large. Not valid add to cart request. No messages should be shown',
			addToCartRequest: {
				store_id: 117,
				is_delivery: true,
				products: [
					{
						product_id: 'combo_11854',
						quantity: 1,
						product_option_id: 0,
						config_options: [],
						child_items: []
					}
				]
			},
			expectedJsResults: {
				"errorCode": 0,
				"productPrice": 25.49,
				"productCalories": "400 to 760 Cals/serving, serves 10",
				"validation": {
					"isConfigValid": false,
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
									"hasIncludedOptions": true,
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
							},
							"isNotApplicable": false
						},
						"3": {
							"isConfigValid": false,
							"validationMsg": "",
							"configurations": {
								"drinks": {
									"isSelectionRequired": true,
									"isMaximumAmountReached": false
								}
							},
							"isNotApplicable": false
						},
						"4": {
							"isConfigValid": false,
							"validationMsg": "",
							"configurations": {
								"dippingsauce": {
									"isSelectionRequired": true,
									"isMaximumAmountReached": false
								}
							},
							"isNotApplicable": false
						},
						"5": {
							"isConfigValid": true,
							"validationMsg": "",
							"configurations": {},
							"isNotApplicable": false
						}
					},
					"notConfiguredLineIds": [ 1, 2, 5, 4, 3 ],
					"validationMsg": "There are one or more items requiring configuration."
				}
			}
		},
		{
			testCaseName: 'Not Valid AddToCartRequest. Only one pizze and dipping sauce configured',
			addToCartRequest: {
				store_id: 117,
				is_delivery: true,
				products: [
					{
						product_id: 'combo_11854',
						quantity: 1,
						product_option_id: 0,
						config_options: [],
						child_items: [
							{
								product_id: 'twin',
								line_id: 2,
								product_option_id: 4766,
								quantity: 1,
								config_options: []
							},
							{
								product_id: 'template',
								quantity: 1,
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
									},
									{
										config_code: 'BR',
										direction: 'whole',
										quantity: 1
									}
								],
								product_option_id: 1710,
								line_id: 1
							},
							{
								product_id: '1933',
								quantity: 1,
								config_options: [
									{
										config_code: 'GI',
										direction: 'whole',
										quantity: 1
									},
									{
										config_code: 'BL',
										direction: 'whole',
										quantity: 1
									}
								],
								product_option_id: 1933,
								line_id: 4
							}
						]
					}
				]
			},
			expectedJsResults: {
				"errorCode": 0,
				"productPrice": 25.49,
				"productCalories": "400 to 760 Cals/serving, serves 10",
				"validation": {
					"isConfigValid": false,
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
									"hasIncludedOptions": true,
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
							},
							"isNotApplicable": false
						},
						"3": {
							"isConfigValid": false,
							"validationMsg": "",
							"configurations": {
								"drinks": {
									"isSelectionRequired": true,
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
									"isSelectionRequired": false,
									"isMaximumAmountReached": false
								}
							},
							"isNotApplicable": false
						},
						"5": {
							"isConfigValid": true,
							"validationMsg": "",
							"configurations": {},
							"isNotApplicable": false
						}
					},
					"notConfiguredLineIds": [
						3,
						5
					],
					"validationMsg": "There are one or more items requiring configuration."
				}
			}
		},
		{
			testCaseName: 'Valid add to cart request for Score Savings. 2 toppings on 1st pizza. 0 toppings on second pizza. Price should be 24.50',
			addToCartRequest: {
				store_id: 117,
				is_delivery: true,
				products: [
					{
						product_id: 'combo_11854',
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
										config_code: 'BR',
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
								product_option_id: 1710,
								line_id: 1
							},
							{
								product_id: 'twin',
								line_id: 2,
								product_option_id: 4766,
								quantity: 1,
								config_options: []
							},
							{
								product_id: '5761',
								quantity: 1,
								config_options: [
									{
										config_code: 'BI',
										direction: 'whole',
										quantity: 1
									},
									{
										config_code: 'CC',
										direction: 'whole',
										quantity: 1
									},
									{
										config_code: 'CS',
										direction: 'whole',
										quantity: 1
									},
									{
										config_code: 'CZ',
										direction: 'whole',
										quantity: 1
									},
									{
										config_code: 'DC',
										direction: 'whole',
										quantity: 1
									},
									{
										config_code: 'FT',
										direction: 'whole',
										quantity: 1
									}
								],
								product_option_id: 5761,
								line_id: 3
							},
							{
								product_id: '1933',
								quantity: 1,
								config_options: [
									{
										config_code: 'BC',
										direction: 'whole',
										quantity: 1
									},
									{
										config_code: 'BL',
										direction: 'whole',
										quantity: 1
									}
								],
								product_option_id: 1933,
								line_id: 4
							}
						]
					}
				]
			},

			expectedJsResults: {
				"errorCode": 0,
				"productPrice": 25.49,
				"productCalories": "400 to 760 Cals/serving, serves 10",
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
							},
							"isNotApplicable": false
						},
						"3": {
							"isConfigValid": true,
							"validationMsg": "",
							"configurations": {
								"drinks": {
									"isSelectionRequired": false,
									"isMaximumAmountReached": true
								}
							},
							"isNotApplicable": false
						},
						"4": {
							"isConfigValid": true,
							"validationMsg": "",
							"configurations": {
								"dippingsauce": {
									"isSelectionRequired": false,
									"isMaximumAmountReached": false
								}
							},
							"isNotApplicable": false
						},
						"5": {
							"isConfigValid": true,
							"validationMsg": "",
							"configurations": {},
							"isNotApplicable": false
						}
					},
					"notConfiguredLineIds": [
						5
					]
				}
			}
		},
		{
			testCaseName: 'Valid add to cart request for Score Savings. 4 Topppings are free and on 1st pizza. 5th topping +3.70. Price should be 29.19',
			addToCartRequest: {
				store_id: 117,
				is_delivery: true,
				products: [
					{
						product_id: 'combo_11854',
						quantity: 1,
						product_option_id: 0,
						config_options: [],
						child_items: [
							{
								product_id: 'template',
								quantity: 1,
								config_options: [
									{
										config_code: 'AR',
										direction: 'whole',
										quantity: 1
									},
									{
										config_code: 'BO',
										direction: 'whole',
										quantity: 1
									},
									{
										config_code: 'BR',
										direction: 'whole',
										quantity: 1
									},
									{
										config_code: 'CI',
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
								product_option_id: 1710,
								line_id: 1
							},
							{
								product_id: 'twin',
								quantity: 1,
								config_options: [
									{
										config_code: 'BR',
										direction: 'whole',
										quantity: 1
									}
								],
								product_option_id: 4766,
								line_id: 2
							},
							{
								product_id: '5761',
								quantity: 1,
								config_options: [
									{
										config_code: 'BI',
										direction: 'whole',
										quantity: 1
									},
									{
										config_code: 'CC',
										direction: 'whole',
										quantity: 1
									},
									{
										config_code: 'CS',
										direction: 'whole',
										quantity: 1
									},
									{
										config_code: 'CZ',
										direction: 'whole',
										quantity: 1
									},
									{
										config_code: 'DC',
										direction: 'whole',
										quantity: 1
									},
									{
										config_code: 'FT',
										direction: 'whole',
										quantity: 1
									}
								],
								product_option_id: 5761,
								line_id: 3
							},
							{
								product_id: '1933',
								quantity: 1,
								config_options: [
									{
										config_code: 'BC',
										direction: 'whole',
										quantity: 1
									},
									{
										config_code: 'BL',
										direction: 'whole',
										quantity: 1
									}
								],
								product_option_id: 1933,
								line_id: 4
							}
						]
					}
				]
			},

			expectedJsResults: {
				"errorCode": 0,
				"productPrice": 29.19,
				"productCalories": "400 to 760 Cals/serving, serves 10",
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
							},
							"isNotApplicable": false
						},
						"3": {
							"isConfigValid": true,
							"validationMsg": "",
							"configurations": {
								"drinks": {
									"isSelectionRequired": false,
									"isMaximumAmountReached": true
								}
							},
							"isNotApplicable": false
						},
						"4": {
							"isConfigValid": true,
							"validationMsg": "",
							"configurations": {
								"dippingsauce": {
									"isSelectionRequired": false,
									"isMaximumAmountReached": false
								}
							},
							"isNotApplicable": false
						},
						"5": {
							"isConfigValid": true,
							"validationMsg": "",
							"configurations": {},
							"isNotApplicable": false
						}
					},
					"notConfiguredLineIds": [
						5
					]
				}
			}
		},
		{
			testCaseName: 'Not Valid add to cart request for Score Savings. 3 Topppings are free and on 1st pizza. 4th topping on second topping. Second pizza should not have validation message',
			addToCartRequest: {
				store_id: 117,
				is_delivery: true,
				products: [
					{
						product_id: 'combo_11854',
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
										config_code: 'BR',
										direction: 'whole',
										quantity: 1
									},
									{
										config_code: 'CI',
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
								product_option_id: 1710,
								line_id: 1
							},
							{
								product_id: 'twin',
								quantity: 1,
								config_options: [
									{
										config_code: 'BR',
										direction: 'whole',
										quantity: 1
									}
								],
								product_option_id: 4766,
								line_id: 2
							}
						]
					}
				]
			},

			expectedJsResults: {
				"errorCode": 0,
				"productPrice": 25.49,
				"productCalories": "400 to 760 Cals/serving, serves 10",
				"validation": {
					"isConfigValid": false,
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
							},
							"isNotApplicable": false
						},
						"3": {
							"isConfigValid": false,
							"validationMsg": "",
							"configurations": {
								"drinks": {
									"isSelectionRequired": true,
									"isMaximumAmountReached": false
								}
							},
							"isNotApplicable": false
						},
						"4": {
							"isConfigValid": false,
							"validationMsg": "",
							"configurations": {
								"dippingsauce": {
									"isSelectionRequired": true,
									"isMaximumAmountReached": false
								}
							},
							"isNotApplicable": false
						},
						"5": {
							"isConfigValid": true,
							"validationMsg": "",
							"configurations": {},
							"isNotApplicable": false
						}
					},
					"notConfiguredLineIds": [
						3,
						4,
						5
					],
					"validationMsg": "There are one or more items requiring configuration."
				}
			}
		},
		{
			testCaseName: 'Not Valid add to cart request for Score Savings. 2 Topppings on 1st pizza. 3rd topping on second topping. Second pizza should have validation message to add 1 topping',
			addToCartRequest: {
				store_id: 117,
				is_delivery: true,
				products: [
					{
						product_id: 'combo_11854',
						quantity: 1,
						product_option_id: 0,
						config_options: [],
						child_items: [
							{
								product_id: 'template',
								quantity: 1,
								config_options: [
									{
										config_code: 'BR',
										direction: 'whole',
										quantity: 1
									},
									{
										config_code: 'CI',
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
								product_option_id: 1710,
								line_id: 1
							},
							{
								product_id: 'twin',
								quantity: 1,
								config_options: [
									{
										config_code: 'BR',
										direction: 'whole',
										quantity: 1
									}
								],
								product_option_id: 4766,
								line_id: 2
							}
						]
					}
				]
			},

			expectedJsResults: {
				"errorCode": 0,
				"productPrice": 25.49,
				"productCalories": "400 to 760 Cals/serving, serves 10",
				"validation": {
					"isConfigValid": false,
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
							},
							"isNotApplicable": false
						},
						"3": {
							"isConfigValid": false,
							"validationMsg": "",
							"configurations": {
								"drinks": {
									"isSelectionRequired": true,
									"isMaximumAmountReached": false
								}
							},
							"isNotApplicable": false
						},
						"4": {
							"isConfigValid": false,
							"validationMsg": "",
							"configurations": {
								"dippingsauce": {
									"isSelectionRequired": true,
									"isMaximumAmountReached": false
								}
							},
							"isNotApplicable": false
						},
						"5": {
							"isConfigValid": true,
							"validationMsg": "",
							"configurations": {},
							"isNotApplicable": false
						}
					},
					"notConfiguredLineIds": [3, 4, 5],
					"validationMsg": "There are one or more items requiring configuration."
				}
			}
		}
	]
}

describe(`Test suite: ${scoreSavingsTestSuite.testSuiteName}`, () => {

	let productSlug = scoreSavingsTestSuite.productSlug;
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
	scoreSavingsTestSuite.testCases.forEach((testCase) => {
		const addToCartRequest = testCase.addToCartRequest;
		const expectedJsResults = testCase.expectedJsResults;
		it(`Test case: ${testCase.testCaseName}`, () => {
			const sdkResult = ppSdk.getProductInfo(addToCartRequest);

			expect(sdkResult).to.deep.equal(expectedJsResults);
		})
	});
})

