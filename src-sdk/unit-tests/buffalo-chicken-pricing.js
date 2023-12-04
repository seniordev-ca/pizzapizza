


const buffaloChickenPricing = {
	testSuiteName: 'Buffalo chicken',
	productSlug: 'buffalo-chicken-collection_11758',
	testCases: [


		{
			testCaseName: 'Default valid product config. Price should be 17.49',
			addToCartRequest: {
				store_id: 117,
				is_delivery: true,
				products: [{
					product_id: 'collection_11758',
					quantity: 1,
					product_option_id: 10746,
					config_options: [
						{
							config_code: 'BG',
							direction: 'whole',
							quantity: 1
						},
						{
							config_code: 'BU',
							direction: 'whole',
							quantity: 1
						},
						{
							config_code: 'RP',
							direction: 'whole',
							quantity: 1
						},
						{
							config_code: 'RD',
							direction: 'whole',
							quantity: 1
						},
						{
							config_code: 'O',
							direction: 'whole',
							quantity: 1
						},
						{
							config_code: 'MZ',
							direction: 'whole',
							quantity: 1
						}
					],
					line_id: 1
				}]

			},
			expectedJsResults: {
				"errorCode": 0,
				"productPrice": 17.49,
				"productCalories": '260 Cals/slice',
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
			testCaseName: 'Valid product config. One of toppings is not a default topping. Price should be 19.34',
			addToCartRequest: {
				store_id: 117,
				is_delivery: true,
				products: [{
					product_id: 'collection_11758',
					quantity: 1,
					product_option_id: 10746,
					config_options: [
						{
							config_code: 'BG',
							direction: 'whole',
							quantity: 1
						},
						{
							config_code: 'BU',
							direction: 'whole',
							quantity: 1
						},
						{
							config_code: 'GP',
							direction: 'whole',
							quantity: 1
						},
						{
							config_code: 'RD',
							direction: 'whole',
							quantity: 1
						},
						{
							config_code: 'O',
							direction: 'whole',
							quantity: 1
						},
						{
							config_code: 'MZ',
							direction: 'whole',
							quantity: 1
						}
					],
					line_id: 1
				}]

			},
			expectedJsResults: {
				"errorCode": 0,
				"productPrice": 19.34,
				"productCalories": '260 Cals/slice',
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
			testCaseName: 'All Topping are default. 2 Toppings (O -onion and RP - roasted peppers) have quantity of 2. Price should be 21.19',
			addToCartRequest: {
				store_id: 117,
				is_delivery: true,
				products: [{
					product_id: 'collection_11758',
					quantity: 1,
					product_option_id: 10746,
					config_options: [
						{
							config_code: 'BG',
							direction: 'whole',
							quantity: 1
						},
						{
							config_code: 'BU',
							direction: 'whole',
							quantity: 1
						},
						{
							config_code: 'RP',
							direction: 'whole',
							quantity: 2
						},
						{
							config_code: 'RD',
							direction: 'whole',
							quantity: 1
						},
						{
							config_code: 'O',
							direction: 'whole',
							quantity: 2
						},
						{
							config_code: 'MZ',
							direction: 'whole',
							quantity: 1
						}
					],
					line_id: 1
				}]

			},
			expectedJsResults: {
				"errorCode": 0,
				"productPrice": 21.19,
				"productCalories": '270 Cals/slice',
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
			testCaseName: 'Unavailable Ingredients Selected',
			addToCartRequest: {
				store_id: 117,
				is_delivery: true,
				products: [{
					product_id: 'collection_11758',
					quantity: 1,
					product_option_id: 10747,
					config_options: [
						{
							config_code: 'AR',
							direction: 'whole',
							quantity: 1
						},
						{
							config_code: 'BU',
							direction: 'whole',
							quantity: 1
						},
						{
							config_code: 'RP',
							direction: 'whole',
							quantity: 2
						},
						{
							config_code: 'RD',
							direction: 'whole',
							quantity: 1
						},
						{
							config_code: 'O',
							direction: 'whole',
							quantity: 2
						},
						{
							config_code: 'MZ',
							direction: 'whole',
							quantity: 1
						}
					],
					line_id: 1
				}]

			},
			expectedJsResults: {
				errorCode: 0,
				unavailableIngredients: ['BU']
			}
		},
		{
			testCaseName: 'Default valid product config. Price should be 17.49',
			addToCartRequest: {
				store_id: 117,
				is_delivery: true,
				products: [{
					product_id: 'collection_11758',
					quantity: 1,
					product_option_id: 10746,
					config_options: [
						{
							config_code: 'BG',
							direction: 'whole',
							quantity: 1
						},
						{
							config_code: 'BU',
							direction: 'whole',
							quantity: 1,
							sub_config_option: 'YT'
						},
						{
							config_code: 'RP',
							direction: 'whole',
							quantity: 1
						},
						{
							config_code: 'RD',
							direction: 'whole',
							quantity: 1
						},
						{
							config_code: 'O',
							direction: 'whole',
							quantity: 1
						},
						{
							config_code: 'MZ',
							direction: 'whole',
							quantity: 1,
							sub_config_option: 'CB'
						}
					],
					line_id: 1
				}]

			},
			expectedJsResults: {
				"errorCode": 0,
				"productPrice": 17.49,
				"productCalories": '260 Cals/slice',
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
	]
}

describe(`Test suite: ${buffaloChickenPricing.testSuiteName}`, () => {

	let productSlug = buffaloChickenPricing.productSlug;
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
	buffaloChickenPricing.testCases.forEach((testCase) => {
		const addToCartRequest = testCase.addToCartRequest;
		const expectedJsResults = testCase.expectedJsResults;
		it(`Test case: ${testCase.testCaseName}`, () => {
			const sdkResult = ppSdk.getProductInfo(addToCartRequest);

			expect(sdkResult).to.deep.include(expectedJsResults);
		})
	});
})

