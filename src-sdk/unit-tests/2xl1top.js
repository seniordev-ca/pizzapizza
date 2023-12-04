
const twoxl1topSuite = {
	testSuiteName: '2 XLarge + 1 top ',
	productSlug: '2-xlarge-1-top-combo_11943',
	testCases: [

		{
			testCaseName: "Only one chosen Half topping should not be valid",
			addToCartRequest: {
				store_id: 101,
				is_delivery: true,
				products: [
					{
						product_id: 'combo_11943',
						quantity: 1,
						product_option_id: 0,
						config_options: [],
						child_items: [
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
										config_code: 'PN',
										direction: 'right',
										quantity: 1
									}
								],
								product_option_id: 11458,
								line_id: 1
							}
						]
					}
				]
			},
			expectedJsResults: {
				"errorCode": 0,
				"productPrice": 20.99,
				"productCalories": "230 to 260 Cals/slice",
				"validation": {
					"isConfigValid": false,
					"children": {
						"1": {
							"isConfigValid": false,
							"validationMsg": "Choose 0.5 TOPPINGS",
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
									"isSelectionRequired": true,
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
							"isConfigValid": false,
							"validationMsg": "Choose 1 TOPPINGS",
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
									"isSelectionRequired": true,
									"isMaximumAmountReached": false
								},
								"doughsaucecheese": {
									"isSelectionRequired": false,
									"isMaximumAmountReached": false
								}
							},
							"isNotApplicable": false
						}
					},
					"notConfiguredLineIds": [
						2
					],
					"validationMsg": "There are one or more items requiring configuration."
				}
			}
		},
		{
			testCaseName: "2 chosen Half toppinga should be valid",
			addToCartRequest: {
				store_id: 101,
				is_delivery: true,
				products: [
					{
						product_id: 'combo_11943',
						quantity: 1,
						product_option_id: 0,
						config_options: [],
						child_items: [
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
										config_code: 'PN',
										direction: 'right',
										quantity: 1
									},
									{
										config_code: 'GP',
										direction: 'left',
										quantity: 1
									}
								],
								product_option_id: 11458,
								line_id: 1
							}
						]
					}
				]
			},
			expectedJsResults: {
				"errorCode": 0,
				"productPrice": 20.99,
				"productCalories": "230 to 260 Cals/slice",
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
									"isMaximumAmountReached": true
								},
								"doughsaucecheese": {
									"isSelectionRequired": false,
									"isMaximumAmountReached": false
								}
							},
							"isNotApplicable": false
						},
						"2": {
							"isConfigValid": false,
							"validationMsg": "Choose 1 TOPPINGS",
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
									"isSelectionRequired": true,
									"isMaximumAmountReached": false
								},
								"doughsaucecheese": {
									"isSelectionRequired": false,
									"isMaximumAmountReached": false
								}
							},
							"isNotApplicable": false
						}
					},
					"notConfiguredLineIds": [
						2
					],
					"validationMsg": "There are one or more items requiring configuration."
				}
			},
		},
		{
			testCaseName: " 1,5 chosen  toppings should have message to remove half",
			addToCartRequest: {
				store_id: 101,
				is_delivery: true,
				products: [
					{
						product_id: 'combo_11943',
						quantity: 1,
						product_option_id: 0,
						config_options: [],
						child_items: [
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
										config_code: 'PN',
										direction: 'right',
										quantity: 1
									},
									{
										config_code: 'GP',
										direction: 'whole',
										quantity: 1
									}
								],
								product_option_id: 11458,
								line_id: 1
							}
						]
					}
				]
			},
			expectedJsResults: {
				"errorCode": 0,
				"productPrice": 23.04,
				"productCalories": "230 to 260 Cals/slice",
				"validation": {
					"isConfigValid": false,
					"children": {
						"1": {
							"isConfigValid": false,
							"validationMsg": "Please, remove 0.5 TOPPINGS",
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
									"isSelectionRequired": true,
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
							"isConfigValid": false,
							"validationMsg": "Choose 1 TOPPINGS",
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
									"isSelectionRequired": true,
									"isMaximumAmountReached": false
								},
								"doughsaucecheese": {
									"isSelectionRequired": false,
									"isMaximumAmountReached": false
								}
							},
							"isNotApplicable": false
						}
					},
					"notConfiguredLineIds": [
						2
					],
					"validationMsg": "There are one or more items requiring configuration."
				}
			}
		}
	]
}

describe(`Test suite: ${twoxl1topSuite.testSuiteName}`, () => {

	let productSlug = twoxl1topSuite.productSlug;
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
	twoxl1topSuite.testCases.forEach((testCase) => {
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

