
const mediumPoutineFries = {
		testSuiteName: 'Medium pizza + poutine or fries',
		productSlug: 'medium-2-topping-poutine-or-fries-combo_11804',
		testCases: [

				{
						testCaseName: "Empty Cart. Validation should fail",
						addToCartRequest:  {
							store_id: 301,
							is_delivery: true,
							products: [
								{
									product_id: 'combo_11804',
									quantity: 1,
									product_option_id: 0,
									config_options: [],
									child_items: []
								}
							]
						},
						expectedJsResults: {
							"errorCode": 0,
							"productPrice": 13.99,
							"productCalories": "190 to 290 Cals/slice",
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
										"isConfigValid": false,
										"validationMsg": "",
										"configurations": {},
										"isNotApplicable": false
									},
									"3": {
										"isConfigValid": false,
										"validationMsg": "",
										"configurations": {},
										"isNotApplicable": false
									}
								},
								"notConfiguredLineIds": [
									2,
									3,
									1
								],
								validationMsg: "There are one or more items requiring configuration."
							}
						}
				},
				{
					testCaseName: 'Poutine Chosen. Validation should pass.',
					addToCartRequest:{
						store_id: 301,
						is_delivery: true,
						products: [
							{
								product_id: 'combo_11804',
								quantity: 1,
								product_option_id: 0,
								config_options: [],
								child_items: [
									{
										line_id: 2,
										product_id: '11114',
										product_option_id: 11114,
										quantity: 1,
										config_options: []
									}
								]
							}
						]
					},
					expectedJsResults: {
						"errorCode": 0,
						"productPrice": 13.99,
						"productCalories": "190 to 290 Cals/slice",
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
									"configurations": {},
									"isNotApplicable": true
								}
							},
							"notConfiguredLineIds": [
								1
							]
						}
					}
				}

		]
}

describe(`Test suite: ${mediumPoutineFries.testSuiteName}`, () => {

		let productSlug = mediumPoutineFries.productSlug;
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
		mediumPoutineFries.testCases.forEach((testCase) => {
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

