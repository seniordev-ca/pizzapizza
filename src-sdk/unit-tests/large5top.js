const large5top = {
		testSuiteName: 'Combo fan favourite',
		productSlug: 'large-pizza-5-top-combo_12097',
		testCases: [

				{
						testCaseName: "Not Valid add to cart request",
						addToCartRequest: {
								store_id: 532,
								is_delivery: false,
								products: [
									{
										product_id: 'combo_12097',
										quantity: 1,
										product_option_id: 0,
										config_options: [],
										child_items: []
									}
								]
							},
						expectedJsResults: {
								"errorCode": 0,
								"productPrice": 14.99,
								"productCalories": "",
								"validation": {
									"isConfigValid": false,
									"children": {
										"1": {
											"isConfigValid": true,
											"validationMsg": "Choose 5 TOPPINGS",
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
											"validationMsg": "Choose DIPPING SAUCE",
											"configurations": {
												"dippingsauce": {
													"isSelectionRequired": true,
													"isMaximumAmountReached": false
												}
											},
											"isNotApplicable": false
										}
									},
									"notConfiguredLineIds": [
										2,
										1
									],
									"validationMsg": "There are one or more items requiring configuration."
								}
							}
				}
		]
}

describe(`Test suite: ${large5top.testSuiteName}`, () => {

		let productSlug = large5top.productSlug;
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
		large5top.testCases.forEach((testCase) => {
				const addToCartRequest = testCase.addToCartRequest;
				const expectedJsResults = testCase.expectedJsResults;
				it(`Test case: ${testCase.testCaseName}`, () => {
						const sdkResult = ppSdk.getProductInfo(addToCartRequest);

						expect(sdkResult).to.deep.equal(expectedJsResults);
				})
		});
})

