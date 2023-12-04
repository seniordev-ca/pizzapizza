const ChipotleChicken = {
	testSuiteName: 'Chipotle Chicken pizza',
	productSlug: 'chipotle-chicken-collection_11750',
	testCases: [
		{
			testCaseName: "Valid default add to cart Request. Should offer Upsize message",
			addToCartRequest: {
				store_id: 117,
				is_delivery: true,
				products: [
					{
						product_id: 'collection_11750',
						quantity: 1,
						product_option_id: 5380,
						config_options: [
							{
								config_code: 'RD',
								direction: 'whole',
								quantity: 1
							},
							{
								config_code: 'QC',
								direction: 'whole',
								quantity: 1
							},
							{
								config_code: 'MZ',
								direction: 'whole',
								quantity: 1
							},
							{
								config_code: 'MC',
								direction: 'whole',
								quantity: 1
							},
							{
								config_code: 'O',
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
				"productPrice": 15.49,
				"productCalories": "240 Cals/slice",
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
					"toProductOption": 9958,
					"message": "Do you want to upsize to X-Large (260 Cals/slice) for only an extra $3.50?"
				}
			}
		},
		// {
		// 	testCaseName: "Medium pizza with ZG dough not available on Large size. Should not offer Upsize message",
		// 	addToCartRequest: {
		// 		store_id: 117,
		// 		is_delivery: true,
		// 		products: [
		// 			{
		// 				product_id: 'collection_11750',
		// 				quantity: 1,
		// 				product_option_id: 9970,
		// 				config_options: [
		// 					{
		// 						config_code: 'ZG',
		// 						direction: 'whole',
		// 						quantity: 1
		// 					},
		// 					{
		// 						config_code: 'QC',
		// 						direction: 'whole',
		// 						quantity: 1
		// 					},
		// 					{
		// 						config_code: 'MZ',
		// 						direction: 'whole',
		// 						quantity: 1
		// 					},
		// 					{
		// 						config_code: 'MC',
		// 						direction: 'whole',
		// 						quantity: 1
		// 					},
		// 					{
		// 						config_code: 'O',
		// 						direction: 'whole',
		// 						quantity: 1
		// 					}
		// 				],
		// 				line_id: 1
		// 			}
		// 		]
		// 	},
		// 	expectedJsResults: {
		// 		"errorCode": 0,
		// 		"productPrice": 13.49,
		// 		"productCalories": "200 Cals/slice",
		// 		"validation": {
		// 			"isConfigValid": true,
		// 			"validationMsg": "",
		// 			"configurations": {
		// 				"specialinstructions": {
		// 					"isSelectionRequired": false,
		// 					"isMaximumAmountReached": false
		// 				},
		// 				"freetoppings": {
		// 					"isSelectionRequired": false,
		// 					"isMaximumAmountReached": false
		// 				},
		// 				"toppings": {
		// 					"isSelectionRequired": false,
		// 					"isMaximumAmountReached": false
		// 				},
		// 				"doughsaucecheese": {
		// 					"isSelectionRequired": false,
		// 					"isMaximumAmountReached": false
		// 				}
		// 			}
		// 		}
		// 	}
		// }
	]
}

describe(`Test suite: ${ChipotleChicken.testSuiteName}`, () => {

	let productSlug = ChipotleChicken.productSlug;
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
	ChipotleChicken.testCases.forEach((testCase) => {
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

