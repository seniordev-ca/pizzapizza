const SingleValidationTestSuite = {
	testSuiteName: 'Basic Validation for sriracha-chicken',
	productSlug: 'sriracha-chicken-collection_11722',
	testCases: [
		// {
		//     testCaseName: 'Invalid config option id in add to cart request should give error code 21',
		//     addToCartRequest: {
		//         "store_id": 117,
		//         "is_delivery": false,
		//         "product_id": "collection_11722",
		//         "product_option_id": 1868,
		//         "quantity": 1,
		//         "config_options": [
		//             {
		//                 "config_code": "RD",
		//                 "direction": "whole",
		//                 "quantity": 1
		//             }
		//         ]
		//     },
		//     expectedJsResults: {
		//         errorCode: 21,
		//         errorMessage: "Invalid product option for config",
		//         debugErrorMessage: "{\"ingredientCode\":\"RD\",\"productOptionId\":1868}"
		//     }
		// },
		{
			testCaseName: "Passing invalid quantity should return error code 22",
			addToCartRequest: {
				"store_id": 117,
				"is_delivery": false,
				"products": [{
					"product_id": "collection_11722",
					"product_option_id": 12587,
					"quantity": 1,
					"config_options": [
						{
							"config_code": "HI",
							"direction": "whole",
							"quantity": 0
						}
					]
				}]

			},
			expectedJsResults: {
				errorCode: 22,
				errorMessage: 'Add to cart request has invalid quantity',
				debugErrorMessage: '{"ingredients":{"config_code":"HI","direction":"whole","quantity":0}}'
			}
		},
		{
			testCaseName: "Passing invalid value for half/half should return error code 23",
			addToCartRequest: {
				"store_id": 117,
				"is_delivery": false,
				"products": [{
					"product_id": "collection_11722",
					"product_option_id": 12587,
					"quantity": 1,
					"config_options": [
						{
							"config_code": "HI",
							"direction": "",
							"quantity": 1
						}
					]
				}]

			},
			expectedJsResults: {
				errorCode: 23,
				errorMessage: 'Add to cart request has invalid value for half/half',
				debugErrorMessage: '{"ingredients":{"config_code":"HI","direction":"","quantity":1}}'
			}
		},
		{
			testCaseName: 'Passing invalid add to cart request format should give error code 24',
			addToCartRequest: {
				"store_id": 117,
				"is_delivery": true,
				"products": [{
					"product_id": "collection_11722",
					"product_option_id": 12587,
					"quantity": 0,
					"config_options": []
				}]
			},
			expectedJsResults: {
				errorCode: 24,
				errorMessage: 'Add to cart request format is invalid',
				debugErrorMessage: '{"addToCartRequest":{"store_id":117,"is_delivery":true,"products":[{"product_id":"collection_11722","product_option_id":12587,"quantity":0,"config_options":[]}]}}'
			}
		},
	]
}

describe(`Test suite: ${SingleValidationTestSuite.testSuiteName}`, () => {

	let productSlug = SingleValidationTestSuite.productSlug;
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
	SingleValidationTestSuite.testCases.forEach((testCase) => {
		const addToCartRequest = testCase.addToCartRequest;
		const expectedJsResults = testCase.expectedJsResults;
		it(`Test case: ${testCase.testCaseName}`, () => {
			const sdkResult = ppSdk.getProductInfo(addToCartRequest);

			expect(sdkResult).to.deep.equal(expectedJsResults);
		})
	});
})

