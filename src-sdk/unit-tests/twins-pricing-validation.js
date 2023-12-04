const twinTestSuite = {
	testSuiteName: 'Twins Combo',
	productSlug: 'twin-pizzas-combo_16200',
	testCases: [

		/**
		 * Test case
		 */
		{
			testCaseName: "2 Topping selected on one pizza",
			addToCartRequest: { "store_id": 1, "is_delivery": false, "products": [{ "product_id": "combo_16200", "quantity": 1, "product_option_id": 0, "config_options": [], "child_items": [{ "product_id": "template", "quantity": 1, "config_options": [{ "config_code": "RD", "direction": "whole", "quantity": 1 }, { "config_code": "AR", "direction": "whole", "quantity": 1 }, { "config_code": "MZ", "direction": "whole", "quantity": 1 }, { "config_code": "BR", "direction": "whole", "quantity": 2 }, { "config_code": "SH", "direction": "whole", "quantity": 1 }], "product_option_id": 1710, "line_id": 1 }, { "product_id": "twin", "quantity": 1, "config_options": [{ "config_code": "RD", "quantity": 1, "direction": "whole" }, { "config_code": "SH", "quantity": 1, "direction": "whole" }, { "config_code": "MZ", "quantity": 1, "direction": "whole" }], "product_option_id": 2086, "line_id": 2 }] }] },
			expectedJsResults: { "errorCode": 0, "productPrice": 28.19, "productCalories": "220 Cals/slice", "validation": { "isConfigValid": true, "children": { "1": { "isConfigValid": true, "validationMsg": "", "configurations": { "specialinstructions": { "isSelectionRequired": false, "isMaximumAmountReached": false }, "freetoppings": { "isSelectionRequired": false, "isMaximumAmountReached": false }, "toppings": { "isSelectionRequired": false, "isMaximumAmountReached": false }, "doughsaucecheese": { "isSelectionRequired": false, "isMaximumAmountReached": false } }, "isNotApplicable": false }, "2": { "isConfigValid": true, "validationMsg": "", "configurations": { "specialinstructions": { "isSelectionRequired": false, "isMaximumAmountReached": false }, "freetoppings": { "isSelectionRequired": false, "isMaximumAmountReached": false }, "toppings": { "isSelectionRequired": false, "isMaximumAmountReached": false }, "doughsaucecheese": { "isSelectionRequired": false, "isMaximumAmountReached": false } }, "isNotApplicable": false } }, "notConfiguredLineIds": [] }, "twinProductCalories": { "1": "230 Cals/slice", "2": "220 Cals/slice" }, "upSizing": { "toProductOption": 2084, "message": "Do you want to upsize to X-Large (240 Cals/slice and 230 Cals/slice) for only an extra $4.80?" } }
		},

		// TODO check why this rule is not working anymore
		// {
		// 	testCaseName: 'Second topping selected on right pizza should NOT change the price',
		// 	addToCartRequest: {
		// 		"store_id": 117,
		// 		"is_delivery": true,
		// 		"products": [{
		// 			"product_id": "combo_16200",
		// 			"quantity": 1,
		// 			"product_option_id": 0,
		// 			"config_options": [

		// 			],
		// 			"child_items": [
		// 				{
		// 					"product_id": "template_15_2",
		// 					"quantity": 1,
		// 					"config_options": [
		// 						{
		// 							"config_code": "BR",
		// 							"direction": "whole",
		// 							"quantity": 1
		// 						},
		// 						{
		// 							"config_code": "MZ",
		// 							"direction": "whole",
		// 							"quantity": 1
		// 						},
		// 						{
		// 							"config_code": "RD",
		// 							"direction": "whole",
		// 							"quantity": 1
		// 						},
		// 						{
		// 							"config_code": "SH",
		// 							"direction": "whole",
		// 							"quantity": 1
		// 						}
		// 					],
		// 					"product_option_id": 1710,
		// 					"line_id": 1
		// 				},
		// 				{
		// 					"product_id": "template_15_1",
		// 					"quantity": 1,
		// 					"config_options": [
		// 						{
		// 							"config_code": "BO",
		// 							"direction": "whole",
		// 							"quantity": 1
		// 						},
		// 						{
		// 							"config_code": "MZ",
		// 							"direction": "whole",
		// 							"quantity": 1
		// 						},
		// 						{
		// 							"config_code": "RD",
		// 							"direction": "whole",
		// 							"quantity": 1
		// 						},
		// 						{
		// 							"config_code": "SH",
		// 							"direction": "whole",
		// 							"quantity": 1
		// 						}
		// 					],
		// 					"product_option_id": 2086,
		// 					"line_id": 2
		// 				}
		// 			]
		// 		}]

		// 	},

		// 	expectedJsResults: {
		// 		"errorCode": 0,
		// 		"upSizing":
		// 		{
		// 			"toProductOption": 2084,
		// 			"message": "Do you want to upsize to X-Large (235 Cals/slice and 240 Cals/slice) for only an extra $4.40?"
		// 		},
		// 		"productPrice": 24.49,
		// 		"productCalories": '220 Cals/slice',
		// 		"twinProductCalories": { '1': '225 Cals/slice', '2': '230 Cals/slice' },
		// 		"validation": {
		// 			"isConfigValid": true,
		// 			"children": {
		// 				"1": {
		// 					"isConfigValid": true,
		// 					"validationMsg": "",
		// 					"configurations": {
		// 						"specialinstructions": {
		// 							"isSelectionRequired": false,
		// 							"isMaximumAmountReached": false
		// 						},
		// 						"freetoppings": {
		// 							"isSelectionRequired": false,
		// 							"isMaximumAmountReached": false
		// 						},
		// 						"toppings": {
		// 							"isSelectionRequired": false,
		// 							"isMaximumAmountReached": false
		// 						},
		// 						"doughsaucecheese": {
		// 							"isSelectionRequired": false,
		// 							"isMaximumAmountReached": false
		// 						}
		// 					},
		// 					"isNotApplicable": false
		// 				},
		// 				"2": {
		// 					"isConfigValid": true,
		// 					"validationMsg": "",
		// 					"configurations": {
		// 						"specialinstructions": {
		// 							"isSelectionRequired": false,
		// 							"isMaximumAmountReached": false
		// 						},
		// 						"freetoppings": {
		// 							"isSelectionRequired": false,
		// 							"isMaximumAmountReached": false
		// 						},
		// 						"toppings": {
		// 							"isSelectionRequired": false,
		// 							"isMaximumAmountReached": false
		// 						},
		// 						"doughsaucecheese": {
		// 							"isSelectionRequired": false,
		// 							"isMaximumAmountReached": false
		// 						}
		// 					},
		// 					"isNotApplicable": false
		// 				}
		// 			},
		// 			"notConfiguredLineIds": [

		// 			]
		// 		}
		// 	}
		// },


		// TODO check why that rule is not working
		// {
		// 	testCaseName: '1Half topping added on first pizza and 1 half topping added on second pizza.',
		// 	addToCartRequest: {
		// 		store_id: 67,
		// 		is_delivery: true,
		// 		products: [
		// 			{
		// 				product_id: 'combo_16200',
		// 				quantity: 1,
		// 				product_option_id: 0,
		// 				config_options: [],
		// 				child_items: [
		// 					{
		// 						product_id: 'template_15_2',
		// 						quantity: 1,
		// 						config_options: [
		// 							{
		// 								config_code: 'RD',
		// 								direction: 'whole',
		// 								quantity: 1
		// 							},
		// 							{
		// 								config_code: 'SH',
		// 								direction: 'whole',
		// 								quantity: 1
		// 							},
		// 							{
		// 								config_code: 'MZ',
		// 								direction: 'whole',
		// 								quantity: 1
		// 							},
		// 							{
		// 								config_code: 'BR',
		// 								direction: 'left',
		// 								quantity: 1
		// 							}
		// 						],
		// 						product_option_id: 1710,
		// 						line_id: 1
		// 					},
		// 					{
		// 						product_id: 'template_15_1',
		// 						quantity: 1,
		// 						config_options: [
		// 							{
		// 								config_code: 'RD',
		// 								direction: 'whole',
		// 								quantity: 1
		// 							},
		// 							{
		// 								config_code: 'SH',
		// 								direction: 'whole',
		// 								quantity: 1
		// 							},
		// 							{
		// 								config_code: 'MZ',
		// 								direction: 'whole',
		// 								quantity: 1
		// 							},
		// 							{
		// 								config_code: 'CH',
		// 								direction: 'left',
		// 								quantity: 1
		// 							}
		// 						],
		// 						product_option_id: 2086,
		// 						line_id: 2
		// 					}
		// 				]
		// 			}
		// 		]
		// 	},
		// 	expectedJsResults: {
		// 		"errorCode": 0,
		// 		"productPrice": 24.99,
		// 		"productCalories": "220 Cals/slice",
		// 		"twinProductCalories": { "1": "223 Cals/slice", "2": "228 Cals/slice" },
		// 		"upSizing": {
		// 			"toProductOption": 2084,
		// 			"message": "Do you want to upsize to X-Large (233 Cals/slice and 238 Cals/slice) for only an extra $4.40?"
		// 		},
		// 		"validation": {
		// 			"isConfigValid": true,
		// 			"children": {
		// 				"1": {
		// 					"isConfigValid": true,
		// 					"validationMsg": "",
		// 					"configurations": {
		// 						"specialinstructions": {
		// 							"isSelectionRequired": false,
		// 							"isMaximumAmountReached": false
		// 						},
		// 						"freetoppings": {
		// 							"isSelectionRequired": false,
		// 							"isMaximumAmountReached": false
		// 						},
		// 						"toppings": {
		// 							"isSelectionRequired": false,
		// 							"isMaximumAmountReached": false
		// 						},
		// 						"doughsaucecheese": {
		// 							"isSelectionRequired": false,
		// 							"isMaximumAmountReached": false
		// 						}
		// 					},
		// 					"isNotApplicable": false
		// 				},
		// 				"2": {
		// 					"isConfigValid": true,
		// 					"validationMsg": "",
		// 					"configurations": {
		// 						"specialinstructions": {
		// 							"isSelectionRequired": false,
		// 							"isMaximumAmountReached": false
		// 						},
		// 						"freetoppings": {
		// 							"isSelectionRequired": false,
		// 							"isMaximumAmountReached": false
		// 						},
		// 						"toppings": {
		// 							"isSelectionRequired": false,
		// 							"isMaximumAmountReached": false
		// 						},
		// 						"doughsaucecheese": {
		// 							"isSelectionRequired": false,
		// 							"isMaximumAmountReached": false
		// 						}
		// 					},
		// 					"isNotApplicable": false
		// 				}
		// 			},
		// 			"notConfiguredLineIds": []
		// 		}
		// 	}
		// },


		{
			testCaseName: "2 Topping selected on one pizza. Size medium. Dough ZG Pan Crust only exists on medium. Upsize message should not be prompted",
			addToCartRequest: {
				store_id: 117,
				is_delivery: false,
				products: [
					{
						product_id: 'combo_16200',
						quantity: 1,
						product_option_id: 0,
						config_options: [],
						child_items: [
							{
								product_id: 'template_15_2',
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
								product_option_id: 1709,
								line_id: 1
							},
							{
								product_id: 'template_15_1',
								quantity: 1,
								config_options: [
									{
										config_code: 'MZ',
										quantity: 1,
										direction: 'whole'
									},
									{
										config_code: 'RD',
										quantity: 1,
										direction: 'whole'
									},
									{
										config_code: 'SH',
										quantity: 1,
										direction: 'whole'
									}
								],
								product_option_id: 4083,
								line_id: 2
							}
						]
					}
				]
			},
			expectedJsResults: {
				"errorCode": 0,
				"productPrice": 16.49,
				"productCalories": "180 Cals/slice",
				"twinProductCalories": { 1: "170 Cals/slice", 2: "180 Cals/slice" },
				"validation": {
					"isConfigValid": true,
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
							},
							"isNotApplicable": false
						}
					},
					"notConfiguredLineIds": []
				},
				"twinProductCalories": {
					"1": "170 Cals/slice",
					"2": "180 Cals/slice"
				}
			}
		}
	]
};

describe(`Test suite: ${twinTestSuite.testSuiteName}`, () => {

	let productSlug = twinTestSuite.productSlug;
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
	twinTestSuite.testCases.forEach((testCase) => {
		const addToCartRequest = testCase.addToCartRequest;
		const expectedJsResults = testCase.expectedJsResults;
		it(`Test case: ${testCase.testCaseName}`, () => {
			const sdkResult = ppSdk.getProductInfo(addToCartRequest);

			expect(sdkResult).to.deep.equal(expectedJsResults);
		})
	});
})

