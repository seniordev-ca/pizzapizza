const GardenSaladPlatter = {
		testSuiteName: 'Garden Salad-platter',
		productSlug: 'garden-salad-platter-combo_6048',
		testCases: [

				{
						testCaseName: "Default configuration",
						addToCartRequest: {
								store_id: 117,
								is_delivery: true,
								products: [
									{
										product_id: 'combo_6048',
										quantity: 1,
										product_option_id: 0,
										config_options: [],
										child_items: [
											{
												product_id: '6048',
												product_option_id: 6048,
												quantity: 1,
												config_options: [],
												line_id: 1
											},
											{
												product_id: '6039',
												product_option_id: 6039,
												config_options: [],
												quantity: 1,
												line_id: 2
											}
										]
									}
								]
							},
						expectedJsResults: {
								"errorCode": 0,
								"productPrice": 19.99,
								"productCalories": "25 Cals/serving, serves 5",
								"validation": {
									"isConfigValid": false,
									"children": {
										"1": {
											"isConfigValid": false,
											"validationMsg": "Choose 10 Dressing",
											"configurations": {
												"toppings": {
													"isSelectionRequired": false,
													"isMaximumAmountReached": false
												},
												"dressing": {
													"isSelectionRequired": true,
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
									"notConfiguredLineIds": [],
									"validationMsg": "There are one or more items requiring configuration."
								}
							}
				},

				
		]
}

describe(`Test suite: ${GardenSaladPlatter.testSuiteName}`, () => {

		let productSlug = GardenSaladPlatter.productSlug;
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
		GardenSaladPlatter.testCases.forEach((testCase) => {
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

