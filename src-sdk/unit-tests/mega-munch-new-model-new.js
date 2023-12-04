
const megaMuchNewModelNEWUat = {
	testSuiteName: 'New Mega Munch NEW',
	productSlug: 'mega-munch-combo_14258',
	testCases: [
		{
			testCaseName: 'Only pizza, medium, should be no upsize',
			addToCartRequest: {"store_id":117,"is_delivery":false,"products":[{"product_id":"combo_14258","quantity":1,"product_option_id":0,"config_options":[],"child_items":[{"product_id":"14259","quantity":1,"config_options":[{"config_code":"RD","direction":"whole","quantity":1},{"config_code":"MZ","direction":"whole","quantity":1},{"config_code":"SH","direction":"whole","quantity":1}],"product_option_id":14262,"line_id":5}]}]},
			expectedJsResults: {"errorCode":0,"productPrice":24.99,"productCalories":"670 to 1340 Cals/Serving, Serves 4","validation":{"isConfigValid":false,"children":{"1":{"isConfigValid":false,"validationMsg":"Choose 1 DIPPING SAUCE","configurations":{"dippingsauce":{"isSelectionRequired":true,"isMaximumAmountReached":false},"classicbreaded":{"isSelectionRequired":false,"isMaximumAmountReached":false}},"isNotApplicable":false},"2":{"isConfigValid":false,"validationMsg":"Choose 1 DIPPING SAUCE","configurations":{"dippingsauce":{"isSelectionRequired":true,"isMaximumAmountReached":false}},"isNotApplicable":false},"3":{"isConfigValid":false,"validationMsg":"Choose 1 DIPPING SAUCE","configurations":{"dippingsauce":{"isSelectionRequired":true,"isMaximumAmountReached":false}},"isNotApplicable":false},"4":{"isConfigValid":false,"validationMsg":"Choose 4 DRINKS","configurations":{"drinks":{"isSelectionRequired":true,"isMaximumAmountReached":false}},"isNotApplicable":false},"5":{"isConfigValid":true,"validationMsg":"Choose 3 TOPPINGS","configurations":{"specialinstructions":{"isSelectionRequired":false,"isMaximumAmountReached":false},"freetoppings":{"isSelectionRequired":false,"isMaximumAmountReached":false},"toppings":{"hasIncludedOptions":true,"isSelectionRequired":false,"isMaximumAmountReached":false},"doughsaucecheese":{"isSelectionRequired":false,"isMaximumAmountReached":false}},"isNotApplicable":false}},"notConfiguredLineIds":[1,2,3,4],"validationMsg":"There are one or more items requiring configuration."}}
		},
		{
			testCaseName: 'Only pizza, Large, upsize message should be shown',
			addToCartRequest: { "store_id": 117, "is_delivery": true, "products": [{ "product_id": "combo_14258", "quantity": 1, "product_option_id": 0, "config_options": [], "child_items": [{ "product_id": "14259", "quantity": 1, "config_options": [{ "config_code": "NS", "direction": "whole", "quantity": 1 }, { "config_code": "RD", "direction": "whole", "quantity": 1 }, { "config_code": "MZ", "direction": "whole", "quantity": 1 }], "product_option_id": 14264, "line_id": 5 }] }] },
			expectedJsResults: {"errorCode":0,"productPrice":24.99,"productCalories":"690 to 1540 Cals/Serving, Serves 6","validation":{"isConfigValid":false,"children":{"1":{"isConfigValid":false,"validationMsg":"Choose 1 DIPPING SAUCE","configurations":{"dippingsauce":{"isSelectionRequired":true,"isMaximumAmountReached":false},"classicbreaded":{"isSelectionRequired":false,"isMaximumAmountReached":false}},"isNotApplicable":false},"2":{"isConfigValid":false,"validationMsg":"Choose 1 DIPPING SAUCE","configurations":{"dippingsauce":{"isSelectionRequired":true,"isMaximumAmountReached":false}},"isNotApplicable":false},"3":{"isConfigValid":false,"validationMsg":"Choose 1 DIPPING SAUCE","configurations":{"dippingsauce":{"isSelectionRequired":true,"isMaximumAmountReached":false}},"isNotApplicable":false},"4":{"isConfigValid":false,"validationMsg":"Choose 4 DRINKS","configurations":{"drinks":{"isSelectionRequired":true,"isMaximumAmountReached":false}},"isNotApplicable":false},"5":{"isConfigValid":true,"validationMsg":"Choose 3 TOPPINGS","configurations":{"specialinstructions":{"isSelectionRequired":false,"isMaximumAmountReached":false},"freetoppings":{"isSelectionRequired":false,"isMaximumAmountReached":false},"toppings":{"hasIncludedOptions":true,"isSelectionRequired":false,"isMaximumAmountReached":false},"doughsaucecheese":{"isSelectionRequired":false,"isMaximumAmountReached":false}},"isNotApplicable":false,"upSizing":{"message":"Do you want to upsize to X-Large (680 to 1440 Cals/Serving, Serves 5) for only an extra $3.50?","toProductOption":14263}}},"notConfiguredLineIds":[1,2,3,4],"validationMsg":"There are one or more items requiring configuration."}}
		},
		{
			testCaseName: 'Everything configured except pizza. Validation should pass',
			addToCartRequest: {
				store_id: 1,
				is_delivery: true,
				products: [
					{
						product_id: 'combo_14258',
						quantity: 1,
						product_option_id: 0,
						config_options: [],
						child_items: [
							{
								product_id: '1961',
								quantity: 1,
								config_options: [
									{
										config_code: 'BC',
										direction: 'whole',
										quantity: 1
									}
								],
								product_option_id: 1961,
								line_id: 3
							},
							{
								product_id: '5359',
								quantity: 1,
								config_options: [
									{
										config_code: 'CC',
										direction: 'whole',
										quantity: 4
									}
								],
								product_option_id: 5359,
								line_id: 4
							},
							{
								product_id: '8694',
								quantity: 1,
								config_options: [
									{
										config_code: 'BC',
										direction: 'whole',
										quantity: 1
									}
								],
								product_option_id: 8694,
								line_id: 2
							}
						]
					}
				]
			},
			expectedJsResults: {
				"errorCode": 0,
				"productPrice": 24.99,
				"productCalories": "690 to 1540 Cals/Serving, Serves 6",
				"validation": {
					"isConfigValid": true,
					"children": {
						"1": {
							"isConfigValid": true,
							"validationMsg": "",
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
							"isNotApplicable": true
						},
						"2": {
							"isConfigValid": true,
							"validationMsg": "",
							"configurations": {
								"dippingsauce": {
									"isSelectionRequired": false,
									"isMaximumAmountReached": false
								}
							},
							"isNotApplicable": false
						},
						"3": {
							"isConfigValid": true,
							"validationMsg": "",
							"configurations": {
								"dippingsauce": {
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
								"drinks": {
									"isSelectionRequired": false,
									"isMaximumAmountReached": true
								}
							},
							"isNotApplicable": false
						},
						"5": {
							"isConfigValid": true,
							"validationMsg": "Choose 3 TOPPINGS",
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
						}
					},
					"notConfiguredLineIds": [
						5
					]
				}
			}
		}
	]
}

describe(`Test suite: ${megaMuchNewModelNEWUat.testSuiteName}`, () => {

	let productSlug = megaMuchNewModelNEWUat.productSlug;
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
	megaMuchNewModelNEWUat.testCases.forEach((testCase) => {
		const addToCartRequest = testCase.addToCartRequest;
		const expectedJsResults = testCase.expectedJsResults;
		it(`Test case: ${testCase.testCaseName}`, () => {
			const sdkResult = ppSdk.getProductInfo(addToCartRequest);

			expect(sdkResult).to.deep.equal(expectedJsResults);
		})
	});
})

