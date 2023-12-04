# PizzaPizza SDk
This is SDK used on web and mobile.
SDK gives ability to get product price and validation for product add to card request.

## Used technologies 
	TypeScript
	Webpack
	Mocha with chai

## Prerequisites
	NodeJs ^v10.6.0 with npm

## Getting Started
	npm i
	npm run start

## Deployment
	SDK is environment agnostic
	npm run build
	npm run deploy:dev

## Development and Integration
	Add following code on client to enable logging window['pp-sdk-logging'] = true;
	Sdk validation/pricing logic is covered by unit tests for multiple products.
	Input data for tests is product config fetched from the web middleware and add to card request defined for specific test.
	Make sure that new changes are not breaking existing test.
	For new issue fix or feature it is recommended to add a test first.

## Fetching new/updated product config
	unit-tests-infrastructure folder has recent products.
	To fetch recent product run
	node ./unit-tests-infrastructure/testing-data-collector/build-mocha-test-cases.js"
