
describe('Error handling', () => {

	before(() => {
		const isServer = typeof window === 'undefined';
		if (isServer) {
			require(`../dist/pp-sdk-bundle`);
			return new Promise((resolve) => {
				const chai = require('chai');
				expect = chai.expect;    // Using Expect style
				resolve();
			})
		} else {
			return new Promise((resolve) => {
				resolve();
			})
		}
	});

	it(`Calling get function before set should give error code 3`, () => {
		const expectedJsResponse = {
			errorCode: 3
		};
		const sdkResult = ppSdk.getProductInfo({});

		expect(sdkResult).to.deep.include(expectedJsResponse);
	});

	it(`Invalid decoded json data should give error code 2`, () => {
		const invalidJsData = 'eJzFk88LgjAUx/+V2LkizYI6pildJFynIqSmxUg2UXeK/e+9TYUkgl2Gp/187/vhvfe9vFFBWZ7S\nDG0nznSCCGcP+hTVraGcpbxUSw1vb5Sc9FKLezr8pGNRVlH2qhGkKCueCdIMgl3PcfWG3Ape0RxS\nCNYozfVCh1CSq9Pc3XxlIDxTtwgfg2QG+lJKeA0TGyBMFMWQZPWPBAA6EjslWZmWJOxL4vtWQDxT\nENBvQeK9FRDHFAT0W5DdYdxpBf2uNWcbIMaNOfejGo1tmqgvCB55VnEHEsVWQJamIKDfggRW3GuK\nEfTexXa8a9wYrL2rSH4QVGYprx9tiiL1\n';
		const expectedJsResponse = {
			errorCode: 2
		};
		const sdkResult = ppSdk.initProduct(invalidJsData, 'web', 'en');

		expect(sdkResult).to.deep.include(expectedJsResponse);
	});

	it('Invalid decoded jsData structure should give error code 4', () => {
		const invalidJsData = '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\nK9WWivv585//Ac2s2+g=\n';
		const expectedJsResponse = {
			errorCode: 4
		};
		ppSdk.initProduct(invalidJsData, 'web', 'en');
		const addToCartRequest = {
			"store_id": 117,
			"is_delivery": true,
			"product_id": "collection_11722",
			"product_option_id": 12587,
			"quantity": 1,
			"config_options": [
			]
		}
		const sdkResult = ppSdk.getProductInfo(addToCartRequest);

		expect(sdkResult).to.deep.include(expectedJsResponse);
	})

	it(`Calling init function without platform should give error code 10`, () => {
		const currentProductConfig = {
			kind: 'single',
			js_data: 'not decodable string',
			data: {},
			product_id: 'product',
			seo_title: 'set title'
		}
		const expectedJsResponse = {
			errorCode: 10
		};
		const sdkResult = ppSdk.initProduct(currentProductConfig);
		expect(sdkResult).to.deep.include(expectedJsResponse);
	});

	it(`Calling init function with invalid platform should give error code 10`, () => {
		const currentProductConfig = {
			kind: 'single',
			js_data: 'not decodable string',
			data: {},
			product_id: 'product',
			seo_title: 'set title'
		}
		const expectedJsResponse = {
			errorCode: 10
		};
		const sdkResult = ppSdk.initProduct(currentProductConfig, 'invalid');
		expect(sdkResult).to.deep.include(expectedJsResponse);
	});


	it(`Calling init function without lang should give error code 11`, () => {
		const currentProductConfig = {
			kind: 'single',
			js_data: 'not decodable string',
			data: {},
			product_id: 'product',
			seo_title: 'set title'
		}
		const expectedJsResponse = {
			errorCode: 11
		};
		const sdkResult = ppSdk.initProduct(currentProductConfig, 'web');
		expect(sdkResult).to.deep.include(expectedJsResponse);
	});


	it(`Calling init function with invalid lang should give error code 11`, () => {
		const currentProductConfig = {
			kind: 'single',
			js_data: 'not decodable string',
			data: {},
			product_id: 'product',
			seo_title: 'set title'
		}
		const expectedJsResponse = {
			errorCode: 11
		};
		const sdkResult = ppSdk.initProduct(currentProductConfig, 'web', 'invalid');
		expect(sdkResult).to.deep.include(expectedJsResponse);
	});

	it(`Passing invalid js_data should give error code 1`, () => {
		const currentProductConfig = {
			kind: 'single',
			js_data: 'not decodable string',
			data: {},
			product_id: 'product',
			seo_title: 'set title'
		}
		const expectedJsResponse = {
			errorCode: 1
		};
		const sdkResult = ppSdk.initProduct(currentProductConfig, 'web', 'en');

		expect(sdkResult).to.deep.include(expectedJsResponse);
	});

	it(`Requesting different product that was inited should give error code 5`, () => {
		const validJsData = 'eJzFlUtrwzAMx79K8Xkba9oOtuP6CLuU0ezUUULqeEXUsVs/oKPku092EpZSxnwxPfkp/X+SJXwm\nexAleRkQDWLHGbkbkIOSpaVG4+7nmXAQLAd3ZYhnVIov2FlVGJAilwc3uItnsvrwg7bb/PKStyWl\nArHXPfcXxsl4mPgJLbhUwNCFFcZpPj16E6DMrR6S554HKku3S7L32eoe9eu6xtPFKgaIsJxfkkz+\nIkGAliROSiahKVl0KZlOo4CMQ0FQvwFZzqOADENBUL8BeX27bbWifvs06xggwQ+z7ko1vXXTpF1C\nshvXataCpMsoIKNQENRvQGZRujcUY9b1bhand4MfJvO9W/8noBln1HMpy731/FRQ48Babf1bmdtC\ns7wTH6G4938VYiPRRuimICi3JSvzoy2EAfPtzNESdK7Y0YJiLidGWYabVXGCylb9u04eY9n0gmmy\n2K18OP6/rbbSfcSb+ge5fHb4\n';

		const addToCartRequest = {
			"store_id": 117,
			"is_delivery": true,
			"products": [{
				"product_id": "collection_11722",
				"product_option_id": 12587,
				"quantity": 1,
				"config_options": [
				]
			}]

		}

		const expectedJsResponse = {
			errorCode: 5
		};

		ppSdk.initProduct(validJsData, 'web', 'en');
		const sdkResult = ppSdk.getProductInfo(addToCartRequest);

		expect(sdkResult).to.deep.include(expectedJsResponse);
	});

	it(`Invalid decoded js data types should give error code 6`, () => {
		const invalidJsData = 'eJzFlclqwzAQhl8l6NyWOkuhPTYbvYRi59QSjCOrZYgsJVogJfjdO5Jt4hBKdRE5aZ35vxmNpBPZ\ngSjJyyC5G5C9kqWlRuPw80Q4CJZDt0al+IJvqwoDUuRy7xq38UQWqW+03eaXm7wtKRWInSZn9xfG\nw3Ey9B1acKmAoQsrDM4Iy7m3AcocwsNw0nNBZelmSfY+S+8RoK5rXF2sY5Akk8dLkOc/QdYtyHQa\nBWQcCoL6DcgsCkgoxqzDeH2Lko+nUBDUbw/m45b5QPW2UJe3vjLLLiHZjSs1a0GWqyggo1AQ1G9A\n0jiPSHCtpt0jsppHAUlCQVC/AcnigATXSOZB6v8ENOOMei5lubeeHwtqHFirrc+XZFtolnfiIxT3\n/q9CbCTaCF0XBOW2ZGV+sIUwYH6cOVqCzhU7WFDM5cQoy3CyKo5Q2aq/18ljLJteME0Wu5EPx/+3\n1Va6j3hT/wLPp3Rj\n';

		const expectedJsResponse = {
			errorCode: 6
		};

		const sdkResult = ppSdk.initProduct(invalidJsData, 'web', 'en');
		expect(sdkResult).to.deep.include(expectedJsResponse);
	});

	it(`Invalid decoded js combo product structure should give error code 7`, () => {
		const invalidJsData = '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\nsjOM7pc//weOBpqW\n';

		const expectedJsResponse = {
			errorCode: 7
		};

		const sdkResult = ppSdk.initProduct(invalidJsData, 'web', 'en');
		expect(sdkResult).to.deep.include(expectedJsResponse);
	});

	it(`Invalid product kind should give error code 2`, () => {
		const invalidJsData = 'eJzFlUtPAyEQx79Kw1mN24eJHu0rXhqz25Om2VBAQ8pCy8PUNPvdHdjduE1j5EJ6gh2Y+f9mdoAT\n2nFJ0dMASWW/sOAU3QzQXivqiDVgfz8hwSUrud+UwRpR8oN/Oo0tV7JUez/4jSe0yMNg3LY83xR8\nEdVc7kwv/JnzcJwNw4RgoTRnEMJJCxbphAg+nDCPcDec9EIQRb0VFa+z/BYA6rqG1cU6BUk2uT8H\nefwTZN2CTKdJQMaxIKDfgMySgMRizDqM55ck9XiIBQH99se8XbMeoN426vLaR2bZFaS4cqcWLchy\nlQRkFAsC+g1InuYSie7VvLtEVvMkIFksCOg3IEUakOgeKQJI/Z+AYYKRwKWdCN7zIybWg7Xa5veQ\nbLFhZSc+AvEQ/yLFRqLN0E+5JMJRRsuDw9Jy++3dwZObUrOD45r5mljtGBgrfOSVq/p7vTzksukl\n01Sx+wrphPe22ir/EG/qHz3nd9c=\n';

		const expectedJsResponse = {
			errorCode: 12
		};

		const sdkResult = ppSdk.initProduct(invalidJsData, 'web', 'en');
		expect(sdkResult).to.deep.include(expectedJsResponse);
	});

	// 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\nK9WWivv585//Ac2s2+g=\n
});
