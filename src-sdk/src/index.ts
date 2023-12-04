// SDK interactor
import * as InteractorCreator from './interactor';
const version = require('./../package.json').version;

// Models
import {
	LangEnum,
	PlatformEnum,
	InitProductResult,
	GetProductInfoResult
} from './models/sdk-interface';
import { DefaultErrorInterface } from './models/interactor';
import { AddCartServerRequestInterface } from './models/add-to-cart-request';
import { DataValidation } from './handlers/data-validation';

// Add following code on client to enable logging window['pp-sdk-logging'] = true;
class PpSdk {
	/**
	 * Don't forget to change it every time before deploying
	 */
	version = version;

	// TODO encapsulation for interactor
	_interactor;

	/**
	 * Passing product config and platform toSDK
	 * @param jsData - encoded js data
	 * @param platform - enum (web, ios, android)
	 * @param lang - enum (en, fr)
	 */
	initProduct(jsData: string, platform: PlatformEnum, lang: LangEnum): InitProductResult {
		// Reset interactor state
		this._interactor = InteractorCreator.interactor;

		// Set product config and handle all possible exceptions
		try {
			this._interactor.initProduct(jsData, platform, lang);
		} catch (e) {
			const customException = (<DefaultErrorInterface>e);
			return {
				errorCode: customException.code,
				errorMessage: customException.message,
				debugErrorMessage: customException.exception
			} as InitProductResult;
		}

		// Success
		return {
			errorCode: 0
		}
	}

	/**
	 * On every config change client needs to build and pass add to cart
	 * request to SDK to get product price, calories and validation
	 * @param addToCartRequest - same as request for back-end
	 */
	getProductInfo(addToCartRequest: AddCartServerRequestInterface): GetProductInfoResult {
		let productInfo: GetProductInfoResult = {} as GetProductInfoResult;

		try {
			if (!this._interactor) {
				DataValidation.trowErrorByCode(3);
			}
			productInfo = this._interactor.getProductConfig(addToCartRequest);
		} catch (e) {
			const customException = (<DefaultErrorInterface>e);
			return {
				errorCode: customException.code,
				errorMessage: customException.message,
				debugErrorMessage: customException.exception
			} as InitProductResult;
		}

		// Success
		return productInfo;
	}
}

declare var global;
global.ppSdk = new PpSdk();
