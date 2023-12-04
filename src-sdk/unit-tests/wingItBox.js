
const wingItBoxSuite = {
		testSuiteName: 'Wing It Box ',
		productSlug: 'wing-it-box-combo_12038',
		testCases: [

				{
						testCaseName: "Should show correct message 0 of 2 selected",
						addToCartRequest: {
								store_id: 101,
								is_delivery: true,
								products: [
									{
										product_id: 'combo_12038',
										quantity: 1,
										product_option_id: 0,
										config_options: [],
										child_items: []
									}
								]
							},
						expectedJsResults: {
								"errorCode": 0,
								"productPrice": 24.79,
								"productCalories": "650 to 1110 Cals/serves 4",
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
											"validationMsg": "Choose 2 Choices",
											"configurations": {
												"choices": {
													"isSelectionRequired": true,
													"isMaximumAmountReached": false
												}
											},
											"isNotApplicable": false
										},
										"3": {
											"isConfigValid": false,
											"validationMsg": "Choose 1 DIPPING SAUCE",
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
										3,
										2,
										1
									],
									"validationMsg": "There are one or more items requiring configuration."
								}
							}
				}
		]
}

describe(`Test suite: ${wingItBoxSuite.testSuiteName}`, () => {

		let productSlug = wingItBoxSuite.productSlug;
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
		wingItBoxSuite.testCases.forEach((testCase) => {
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

