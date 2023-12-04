const feed6Under6Test = {
	testSuiteName: 'Feed 6 Under 6 Combo New Model',
	productSlug: 'feed-6-for-under-6-each-combo_14300',
	testCases: [
		{
			testCaseName: 'Both twins configured. 5th toppings combined should change the price',
			addToCartRequest: {
				store_id: 117,
				is_delivery: true,
				products: [
				  {
					product_id: 'combo_14300',
					quantity: 1,
					product_option_id: 0,
					config_options: [],
					child_items: [
					  {
						product_id: '14304',
						quantity: 1,
						config_options: [],
						product_option_id: 14304,
						line_id: 6
					  },
					  {
						product_id: '14302',
						quantity: 1,
						config_options: [],
						product_option_id: 14302,
						line_id: 5
					  },
					  {
						product_id: '14306',
						quantity: 1,
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
							config_code: 'BR',
							direction: 'whole',
							quantity: 3
						  },
						  {
							config_code: 'SH',
							direction: 'whole',
							quantity: 1
						  },
						  {
							config_code: 'O',
							direction: 'whole',
							quantity: 1
						  }
						],
						product_option_id: 14306,
						line_id: 2
					  },
					  {
						product_id: '14307',
						quantity: 1,
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
							config_code: 'BR',
							direction: 'whole',
							quantity: 1
						  },
						  {
							config_code: 'SH',
							direction: 'whole',
							quantity: 1
						  }
						],
						product_option_id: 14307,
						line_id: 4
					  }
					]
				  }
				]
			  },
			expectedJsResults:{
				"errorCode": 0,
				"productPrice": 38.69,
				"productCalories": "800 to 900 Cals/serving, serves 6",
				"validation": {
				  "isConfigValid": false,
				  "children": {
					"1": {
					  "isConfigValid": false,
					  "validationMsg": "",
					  "configurations": {},
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
					},
					"3": {
					  "isConfigValid": false,
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
					  "isConfigValid": true,
					  "validationMsg": "",
					  "configurations": {},
					  "isNotApplicable": false
					},
					"6": {
					  "isConfigValid": true,
					  "validationMsg": "",
					  "configurations": {},
					  "isNotApplicable": false
					}
				  },
				  "notConfiguredLineIds": [
					1,
					3
				  ],
				  "validationMsg": "There are one or more items requiring configuration."
				}
			  },
		}

	]
}

describe(`Test suite: ${feed6Under6Test.testSuiteName}`, () => {

	let productSlug = feed6Under6Test.productSlug;
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
	feed6Under6Test.testCases.forEach((testCase) => {
		const addToCartRequest = testCase.addToCartRequest;
		const expectedJsResults = testCase.expectedJsResults;
		it(`Test case: ${testCase.testCaseName}`, () => {
			const sdkResult = ppSdk.getProductInfo(addToCartRequest);

			expect(sdkResult).to.deep.equal(expectedJsResults);
		})
	});
})

