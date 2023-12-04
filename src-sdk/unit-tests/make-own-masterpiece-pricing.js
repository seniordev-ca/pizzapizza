const singlePizzaHalfPricing = {
	testSuiteName: 'Half Toppings Single pizza - pricing',
	productSlug: 'single-pizzas-collection_16100',
	testCases: [
		{
			testCaseName: '3 BR(broccoli) whole toppings added to pizza. Calories should be 235',
			addToCartRequest: {
				store_id: 117,
				is_delivery: true,
				products: [
				  {
					product_id: 'collection_16100',
					quantity: 1,
					product_option_id: 1862,
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
					  },
					  {
						config_code: 'BR',
						direction: 'whole',
						quantity: 3
					  }
					],
					line_id: 1
				  }
				]
			  },
			  expectedJsResults: {
				"errorCode": 0,
				"productPrice": 16.84,
				"productCalories": "235 Cals/slice",
				"validation": {
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
					  "isMaximumAmountReached": false
					},
					"doughsaucecheese": {
					  "isSelectionRequired": false,
					  "isMaximumAmountReached": false
					}
				  }
				},
				"upSizing": {
				  "toProductOption": 1846,
				  "message": "Do you want to upsize to X-Large (245 Cals/slice) for only an extra $3.80?"
				}
			  }
			},
		{
			testCaseName: '2 half toppings added, should be calculated as 1 regular topping. Price should be 12.80 Calories should be 228',
			addToCartRequest: {
				store_id: 117,
				is_delivery: true,
				products: [{
					product_id: 'collection_16100',
					quantity: 1,
					product_option_id: 1862,
					config_options: [
						{
							config_code: 'BR',
							direction: 'left',
							quantity: 1
						},
						{
							config_code: 'BO',
							direction: 'right',
							quantity: 1
						},
						{
							config_code: 'MZ',
							direction: 'whole',
							quantity: 1
						},
						{
							config_code: 'RD',
							direction: 'whole',
							quantity: 1
						},
						{
							config_code: 'SH',
							direction: 'whole',
							quantity: 1
						}
					],
					line_id: 1
				}]

			},
			expectedJsResults: {
				"errorCode": 0,
				"productPrice": 13.14,
				"productCalories": '228 Cals/slice',
				"validation": {
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
		{
			testCaseName: ' 2 half toppings are added, but one half topping is in amount of 3. Price should be 14.65',
			addToCartRequest: {
				store_id: 117,
				is_delivery: true,
				products: [{
					product_id: 'collection_16100',
					quantity: 1,
					product_option_id: 1862,
					config_options: [
						{
							config_code: 'BR',
							direction: 'left',
							quantity: 3
						},
						{
							config_code: 'BO',
							direction: 'right',
							quantity: 1
						},
						{
							config_code: 'MZ',
							direction: 'whole',
							quantity: 1
						},
						{
							config_code: 'RD',
							direction: 'whole',
							quantity: 1
						},
						{
							config_code: 'SH',
							direction: 'whole',
							quantity: 1
						}
					],
					line_id: 1
				}]

			},
			expectedJsResults: {
				"errorCode": 0,
				"productPrice": 14.99,
				"productCalories": '233 Cals/slice',
				"validation": {
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
		{
			testCaseName: ' 2 half toppings are added,both are premium. Price should be 13.80',
			addToCartRequest: {
				store_id: 117,
				is_delivery: true,
				products: [{
					product_id: 'collection_16100',
					quantity: 1,
					product_option_id: 1862,
					config_options: [
						{
							config_code: 'SK',
							direction: 'left',
							quantity: 1
						},
						{
							config_code: 'BG',
							direction: 'right',
							quantity: 1
						},
						{
							config_code: 'MZ',
							direction: 'whole',
							quantity: 1
						},
						{
							config_code: 'RD',
							direction: 'whole',
							quantity: 1
						},
						{
							config_code: 'SH',
							direction: 'whole',
							quantity: 1
						}
					],
					line_id: 1
				}]

			},
			expectedJsResults: {
				"errorCode": 0,
				"productPrice": 14.14,
				"productCalories": '238 Cals/slice',
				"validation": {
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
		{
			testCaseName: ' 2 half toppings are added,both are premium and one of the toppings in amount of 2. Price should be 16.15',
			addToCartRequest: {
				store_id: 117,
				is_delivery: true,
				products: [{
					product_id: 'collection_16100',
					quantity: 1,
					product_option_id: 1862,
					config_options: [
						{
							config_code: 'SK',
							direction: 'left',
							quantity: 1
						},
						{
							config_code: 'BG',
							direction: 'right',
							quantity: 2
						},
						{
							config_code: 'MZ',
							direction: 'whole',
							quantity: 1
						},
						{
							config_code: 'RD',
							direction: 'whole',
							quantity: 1
						},
						{
							config_code: 'SH',
							direction: 'whole',
							quantity: 1
						}
					],
					line_id: 1
				}]

			},
			expectedJsResults: {
				"errorCode": 0,
				"productPrice": 16.49,
				"productCalories": '248 Cals/slice',
				"validation": {
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
		{
			testCaseName: ' 2 half toppings are added,one is regular (+1.85 price for 2 halfs but paid ahead), one is premium (0.50 CAD since its second topping), . Price should be 13.30',
			addToCartRequest: {
				store_id: 117,
				is_delivery: true,
				products: [{
					product_id: 'collection_16100',
					quantity: 1,
					product_option_id: 1862,
					config_options: [
						{
							config_code: 'BR',
							direction: 'left',
							quantity: 1
						},
						{
							config_code: 'BG',
							direction: 'right',
							quantity: 1
						},
						{
							config_code: 'MZ',
							direction: 'whole',
							quantity: 1
						},
						{
							config_code: 'RD',
							direction: 'whole',
							quantity: 1
						},
						{
							config_code: 'SH',
							direction: 'whole',
							quantity: 1
						}
					],
					line_id: 1
				}]

			},
			expectedJsResults: {
				"errorCode": 0,
				"productPrice": 13.64,
				"productCalories": '233 Cals/slice',
				"validation": {
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
							"isMaximumAmountReached": false
						},
						"doughsaucecheese": {
							"isSelectionRequired": false,
							"isMaximumAmountReached": false
						}
					}
				}
			}
		}
	]
}

describe(`Test suite: ${singlePizzaHalfPricing.testSuiteName}`, () => {

	let productSlug = singlePizzaHalfPricing.productSlug;
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
	singlePizzaHalfPricing.testCases.forEach((testCase) => {
		const addToCartRequest = testCase.addToCartRequest;
		const expectedJsResults = testCase.expectedJsResults;
		it(`Test case: ${testCase.testCaseName}`, () => {
			const sdkResult = ppSdk.getProductInfo(addToCartRequest);

			expect(sdkResult).to.deep.include(expectedJsResults);
		})
	});
})

