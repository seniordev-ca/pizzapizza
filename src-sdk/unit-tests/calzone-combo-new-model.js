
const calzoneComboNewModel = {
		testSuiteName: 'New Wing It Box Combo',
		productSlug: 'wing-it-box-combo_13845',
		testCases: [
				{
						testCaseName: 'Empty Cart',
						addToCartRequest: {
								store_id: 117,
								is_delivery: false,
								products: [
									{
										product_id: 'combo_13845',
										quantity: 1,
										product_option_id: 0,
										config_options: [],
										child_items: []
									}
								]
							},
							expectedJsResults: {
								"errorCode": 0,
								"productPrice": 0,
								"productCalories": "1340 to 1600 Cals/serving, serves 2",
								"validation": {
									"isConfigValid": false,
									"children": {
										"1": {
											"isConfigValid": true,
											"validationMsg": "",
											"configurations": {
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
											"isConfigValid": false,
											"validationMsg": "Choose 2 DRINKS",
											"configurations": {
												"drinks": {
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
										"5": {
											"isConfigValid": true,
											"validationMsg": "",
											"configurations": {
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
				}
			 
		]
}

describe(`Test suite: ${calzoneComboNewModel.testSuiteName}`, () => {

		let productSlug = calzoneComboNewModel.productSlug;
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
		calzoneComboNewModel.testCases.forEach((testCase) => {
				const addToCartRequest = testCase.addToCartRequest;
				const expectedJsResults = testCase.expectedJsResults;
				it(`Test case: ${testCase.testCaseName}`, () => {
						const sdkResult = ppSdk.getProductInfo(addToCartRequest);

						expect(sdkResult).to.deep.equal(expectedJsResults);
				})
		});
})

