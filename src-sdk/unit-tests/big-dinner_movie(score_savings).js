
const bigDinnerMovieOldModel = {
		testSuiteName: 'Big Dinner + Movie (score savings) old model',
		productSlug: 'big-dinner-movie-combo_11854',
		testCases: [
			{
				testCaseName: 'One twin is in add To cart REquest and customized, other one is not. Drinks customized.',
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
									product_id: '12721',
									quantity: 1,
									config_options: [],
									product_option_id: 12721,
									line_id: 3
								},
								{
									product_id: 'template_16_2',
									quantity: 1,
									config_options: [
										{
											config_code: 'MZ',
											direction: 'whole',
											quantity: 1
										},
										{
											config_code: 'SH',
											direction: 'whole',
											quantity: 1
										},
										{
											config_code: 'RD',
											direction: 'whole',
											quantity: 1
										}
									],
									product_option_id: 1709,
									line_id: 1
								},
								{
									product_id: '5761',
									quantity: 1,
									config_options: [
										{
											config_code: 'RT',
											direction: 'whole',
											quantity: 5
										},
										{
											config_code: 'SE',
											direction: 'whole',
											quantity: 1
										}
									],
									product_option_id: 5761,
									line_id: 2
								}
							]
						}
					]
				},
				expectedJsResults: {
					"errorCode": 0,
					"productPrice": 19.49,
					"productCalories": "370 to 690 Cals/serving, serves 8",
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
									"drinks": {
										"isSelectionRequired": false,
										"isMaximumAmountReached": true
									}
								},
								"isNotApplicable": false
							},
							"3": {
								"isConfigValid": true,
								"validationMsg": "",
								"configurations": {},
								"isNotApplicable": false
							},
							"4": {
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
							"5": {
								"isConfigValid": false,
								"validationMsg": "",
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
							4,
							5
						],
						"validationMsg": "There are one or more items requiring configuration."
					}
				}
			},
			{
				testCaseName: 'First Twin was medium with pan crust. Second twin got RESET and removed from ATR. Atr Has First Twin as large with not available config option',
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
									product_id: '12721',
									quantity: 1,
									config_options: [],
									product_option_id: 12721,
									line_id: 3
								},
								{
									product_id: 'template_16_2',
									quantity: 1,
									config_options: [
										{
											config_code: 'MZ',
											direction: 'whole',
											quantity: 1
										},
										{
											config_code: 'SH',
											direction: 'whole',
											quantity: 1
										},
										{
											config_code: 'ZG',
											direction: 'whole',
											quantity: 1
										}
									],
									product_option_id: 1710,
									line_id: 1
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
							"3": {
								"isConfigValid": true,
								"validationMsg": "",
								"configurations": {},
								"isNotApplicable": false
							},
							"4": {
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
							"5": {
								"isConfigValid": false,
								"validationMsg": "",
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
							4,
							5
						],
						"validationMsg": "There are one or more items requiring configuration."
					},
					"unavailableIngredients": [
						"ZG"
					]
				}
			}
		]
}

describe(`Test suite: ${bigDinnerMovieOldModel.testSuiteName}`, () => {

		let productSlug = bigDinnerMovieOldModel.productSlug;
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
		bigDinnerMovieOldModel.testCases.forEach((testCase) => {
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

