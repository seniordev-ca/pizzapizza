


const twentyWingsValidation = {
		testSuiteName: '20 wings validation',
		productSlug: '20-wings-collection_41203',
		testCases: [
				{
						testCaseName: '20 wings. Not valid add to cart request. No sauce added, 2 sauces needed to add',
						addToCartRequest: {
								store_id: 117,
								is_delivery: true,
								products: [
									{
										product_id: 'collection_41203',
										quantity: 1,
										product_option_id: 1793,
										config_options: [
											{
												config_code: 'WC',
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
								"productPrice": 19.49,
								"productCalories": "510 to 650 Cals/5 pcs, serves 4",
								"validation": {
									"isConfigValid": false,
									"validationMsg": "There are 2 more selections that are required in section DIPPING SAUCE. ",
									"configurations": {
										"dippingsauce": {
											"isSelectionRequired": true,
											"isMaximumAmountReached": false
										},
										"classicbreaded": {
											"isSelectionRequired": false,
											"isMaximumAmountReached": true
										}
									}
								}
							}
				},
				{
						testCaseName: '20 wings. Not valid add to cart request. One sauce added, 1 sauces needed to add',
						addToCartRequest: {
								store_id: 117,
								is_delivery: true,
								products: [
									{
										product_id: 'collection_41203',
										quantity: 1,
										product_option_id: 1793,
										config_options: [
											{
												config_code: 'WC',
												direction: 'whole',
												quantity: 1
											},
											{
												config_code: 'BC',
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
								"productPrice": 19.49,
								"productCalories": "510 to 650 Cals/5 pcs, serves 4",
								"validation": {
									"isConfigValid": false,
									"validationMsg": "There is 1 more selection that is required in section DIPPING SAUCE. ",
									"configurations": {
										"dippingsauce": {
											"isSelectionRequired": true,
											"isMaximumAmountReached": false
										},
										"classicbreaded": {
											"isSelectionRequired": false,
											"isMaximumAmountReached": true
										}
									}
								}
							}
				},
				{
						testCaseName: '20 wings. Valid add to cart request. One sauce added in amount of 2',
						addToCartRequest: {
								store_id: 117,
								is_delivery: true,
								products: [
									{
										product_id: 'collection_41203',
										quantity: 1,
										product_option_id: 1793,
										config_options: [
											{
												config_code: 'WC',
												direction: 'whole',
												quantity: 1
											},
											{
												config_code: 'BC',
												direction: 'whole',
												quantity: 2
											}
										],
										line_id: 1
									}
								]
							},
						expectedJsResults: {
								"errorCode": 0,
								"productPrice": 19.49,
								"productCalories": "510 to 650 Cals/5 pcs, serves 4",
								"validation": {
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
									}
								}
							}
				},

		]
}

describe(`Test suite: ${twentyWingsValidation.testSuiteName}`, () => {

		let productSlug = twentyWingsValidation.productSlug;
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
		twentyWingsValidation.testCases.forEach((testCase) => {
				const addToCartRequest = testCase.addToCartRequest;
				const expectedJsResults = testCase.expectedJsResults;
				it(`Test case: ${testCase.testCaseName}`, () => {
						const sdkResult = ppSdk.getProductInfo(addToCartRequest);

						expect(sdkResult).to.deep.include(expectedJsResults);
				})
		});
})

