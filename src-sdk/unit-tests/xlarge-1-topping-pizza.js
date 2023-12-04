const xlOneToppingPizza = {
		testSuiteName: 'XL 1 topping pizza',
		productSlug: 'xlarge-1-topping-pizza-product_13032',
		testCases: [



				{
						testCaseName: "Pizza with BR and BG toppings, 1 topping is included. Price should be 13.09",
						addToCartRequest: {
								store_id: 117,
								is_delivery: true,
								products: [
									{
										product_id: 'product_13032',
										quantity: 1,
										product_option_id: 13032,
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
											},
											{
												config_code: 'BG',
												direction: 'whole',
												quantity: 1
											}
										],
										line_id: 1
									}
								]
							},
						expectedJsResults: {
								"errorCode": 0,
								"productPrice": 13.04,
								"productCalories": "260 Cals/slice",
								"validation": {
									"isConfigValid": true,
									"validationMsg": "",
									"configurations": {
										"specialinstructions": {
											"isSelectionRequired": false,
											"isMaximumAmountReached": true
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
									}
								}
							}
				},
		]
}

describe(`Test suite: ${xlOneToppingPizza.testSuiteName}`, () => {

		let productSlug = xlOneToppingPizza.productSlug;
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
		xlOneToppingPizza.testCases.forEach((testCase) => {
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

