
const partyPackCombo = {
	testSuiteName: 'Party pack combo',
	productSlug: 'party-pack-combo_11701',
	testCases: [
		{
			testCaseName: 'Empty cart. Fries preselected and always valid  and in cart',
			addToCartRequest: {
				store_id: 117,
				is_delivery: true,
				products: [
					{
						product_id: 'combo_11701',
						quantity: 1,
						product_option_id: 0,
						config_options: [],
						child_items: [
							{
								product_id: '11696',
								quantity: 1,
								config_options: [],
								product_option_id: 11696,
								line_id: 2
							}
						]
					}
				]
			},
			expectedJsResults: {
				"errorCode": 0,
				"productPrice": 25.99,
				"productCalories": "1040 to 1340 Cals/serving, serves 5",
				"validation": {
					"isConfigValid": false,
					"children": {
						"1": {
							"isConfigValid": true,
							"validationMsg": "Choose 2 TOPPINGS",
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
							"configurations": {},
							"isNotApplicable": false
						},
						"3": {
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
						"4": {
							"isConfigValid": true,
							"validationMsg": "Choose 1 DIPPING SAUCE",
							"configurations": {
								"dippingsauce": {
									"hasIncludedOptions": true,
									"isSelectionRequired": false,
									"isMaximumAmountReached": false
								}
							},
							"isNotApplicable": false
						}
					},
					"notConfiguredLineIds": [
						4,
						3,
						1
					],
					"validationMsg": "There are one or more items requiring configuration."
				}
			}
		},
		{
			testCaseName: 'Everything configured except garlic stix. Validation should fail',
			addToCartRequest: {
				store_id: 117,
				is_delivery: true,
				products: [
					{
						product_id: 'combo_11701',
						quantity: 1,
						product_option_id: 0,
						config_options: [],
						child_items: [
							{
								product_id: '11696',
								quantity: 1,
								config_options: [],
								product_option_id: 11696,
								line_id: 2
							},
							{
								product_id: '11701',
								quantity: 1,
								config_options: [
									{
										config_code: 'RD',
										direction: 'whole',
										quantity: 1
									},
									{
										config_code: 'MZ',
										direction: 'whole',
										quantity: 1
									},
									{
										config_code: 'SH',
										direction: 'whole',
										quantity: 1
									}
								],
								product_option_id: 11610,
								line_id: 1
							},
							{
								product_id: '11637',
								quantity: 1,
								config_options: [
									{
										config_code: 'WC',
										direction: 'whole',
										quantity: 1
									},
									{
										config_code: 'GI',
										direction: 'whole',
										quantity: 1
									}
								],
								product_option_id: 11637,
								line_id: 3
							}
						]
					}
				]
			},
			expectedJsResults: {
				"errorCode": 0,
				"productPrice": 25.99,
				"productCalories": "1040 to 1340 Cals/serving, serves 5",
				"validation": {
					"isConfigValid": true,
					"children": {
						"1": {
							"isConfigValid": true,
							"validationMsg": "Choose 2 TOPPINGS",
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
							"configurations": {},
							"isNotApplicable": false
						},
						"3": {
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
						"4": {
							"isConfigValid": true,
							"validationMsg": "Choose 1 DIPPING SAUCE",
							"configurations": {
								"dippingsauce": {
									"hasIncludedOptions": true,
									"isSelectionRequired": false,
									"isMaximumAmountReached": false
								}
							},
							"isNotApplicable": false
						}
					},
					"notConfiguredLineIds": [
						4
					]
				}
			}
		}
	]
}

describe(`Test suite: ${partyPackCombo.testSuiteName}`, () => {

	let productSlug = partyPackCombo.productSlug;
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
	partyPackCombo.testCases.forEach((testCase) => {
		const addToCartRequest = testCase.addToCartRequest;
		const expectedJsResults = testCase.expectedJsResults;
		it(`Test case: ${testCase.testCaseName}`, () => {
			const sdkResult = ppSdk.getProductInfo(addToCartRequest);

			expect(sdkResult).to.deep.equal(expectedJsResults);
		})
	});
})

