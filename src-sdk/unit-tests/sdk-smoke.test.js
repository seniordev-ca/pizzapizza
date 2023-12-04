
const PUBLIC_OBJECTS = 0;
const PUBLIC_STRINGS = 1;
const PUBLIC_SDK_FUNCTION = 2;

const TOTAL_MEMBERS_COUNT = PUBLIC_STRINGS + PUBLIC_SDK_FUNCTION + PUBLIC_OBJECTS;

describe('PP SDK smoke test', () => {

	before(() => {
		const isServer = typeof window === 'undefined';
		if (isServer) {
			require(`../dist/pp-sdk-bundle`);
			return new Promise((resolve) => {
				const chai = require('chai');
				expect = chai.expect;    // Using Expect style
				assert = chai.assert;
				resolve();
			})
		} else {
			return new Promise((resolve) => {
				resolve();
			})
		}
	});


	it(`SDK has only ${TOTAL_MEMBERS_COUNT} public properties`, () => {
		let publicMembersCount = 0;
		for (let key in ppSdk) {
			console.log(key);
			publicMembersCount++;
		}
		assert.equal(publicMembersCount, TOTAL_MEMBERS_COUNT);
	});

	it(`SDK has ${PUBLIC_OBJECTS} public objects`, () => {
		let objectsCount = 0;
		for (let key in ppSdk) {
			if (typeof ppSdk[key] === 'object') {
				objectsCount++;
			}
		}
		assert.equal(objectsCount, PUBLIC_OBJECTS);
	});

	it(`SDK has ${PUBLIC_SDK_FUNCTION} public functions`, () => {
		let functionsCount = 0;
		for (let key in ppSdk) {
			if (typeof ppSdk[key] === 'function') {
				functionsCount++;
			}
		}
		assert.equal(functionsCount, PUBLIC_SDK_FUNCTION);
	});

	it(`SDK has ${PUBLIC_STRINGS} public strings`, () => {
		let stringsCount = 0;
		for (let key in ppSdk) {
			if (typeof ppSdk[key] === 'string') {
				stringsCount++;
			}
		}
		assert.equal(stringsCount, PUBLIC_STRINGS);
	});

});

