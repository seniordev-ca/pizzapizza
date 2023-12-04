const tossedAndSaucedWings20 = {
	testSuiteName: '20 tossed and sauced chicken wings',
	productSlug: '20-tossed-and-sauced-wings-product_9730',
	testCases: [
		{
			testCaseName: 'Not valid add to cart request.',
			addToCartRequest: {
				store_id: 117,
				is_delivery: true,
				products: [
					{
						product_id: 'product_9730',
						quantity: 1,
						product_option_id: 9730,
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
				"productCalories": "540 to 730 Cals/5 pcs, serves 4",
				"validation": {
					"isConfigValid": false,
					"validationMsg": "There is 1 more selection that is required in section Sauce on Wings. ",
					"configurations": {
						"sauceonwings": {
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
			testCaseName: 'Valid addToCartRequest',
			addToCartRequest: {
				store_id: 117,
				is_delivery: true,
				products: [
					{
						product_id: 'product_9730',
						quantity: 1,
						product_option_id: 9730,
						config_options: [
							{
								config_code: 'WC',
								direction: 'whole',
								quantity: 1
							},
							{
								config_code: 'BF',
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
				"productCalories": "540 to 730 Cals/5 pcs, serves 4",
				"validation": {
					"isConfigValid": true,
					"validationMsg": "",
					"configurations": {
						"sauceonwings": {
							"isSelectionRequired": false,
							"isMaximumAmountReached": true
						},
						"classicbreaded": {
							"isSelectionRequired": false,
							"isMaximumAmountReached": true
						}
					}
				}
			}
		}
	]
}

describe(`Test suite: ${tossedAndSaucedWings20.testSuiteName}`, () => {

	let productSlug = tossedAndSaucedWings20.productSlug;
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
	tossedAndSaucedWings20.testCases.forEach((testCase) => {
		const addToCartRequest = testCase.addToCartRequest;
		const expectedJsResults = testCase.expectedJsResults;
		it(`Test case: ${testCase.testCaseName}`, () => {
			const sdkResult = ppSdk.getProductInfo(addToCartRequest);

			expect(sdkResult).to.deep.include(expectedJsResults);
		})
	});
})

