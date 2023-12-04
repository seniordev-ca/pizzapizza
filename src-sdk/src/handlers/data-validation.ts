
// Utils
import { DataUtils } from '../utils/data-utils';

// Models
import { AddCartServerRequestInterface } from '../models/add-to-cart-request';
import {
	LangEnum,
	PlatformEnum,
} from '../models/sdk-interface';
import {
	PriceCaloriesInterface,
	DefaultErrorInterface,
	Kinds
} from '../models/interactor';
import {
	JsDataInterface,
	JsDataConfigOptions,
	JsDataProductInterface,
	JsDataConfigOptionsObj
} from '../models/js-validation-data';

export class DataValidation {


	/**
	 * Validate add to cart request
	 */
	private static _isCommonAddToCartRequestValid(addToCartRequest: AddCartServerRequestInterface): boolean {
		const isAllPropertiesPresent =
			'store_id' in addToCartRequest &&
			'is_delivery' in addToCartRequest &&
			'product_id' in addToCartRequest.products[0] &&
			'product_option_id' in addToCartRequest.products[0] &&
			'quantity' in addToCartRequest.products[0] &&
			'config_options' in addToCartRequest.products[0];

		let isAllTypesAreCorrect = false;

		if (isAllPropertiesPresent) {
			isAllTypesAreCorrect =
				DataUtils.isIntegerNumber(addToCartRequest.store_id) &&
				DataUtils.isBool(addToCartRequest.is_delivery) &&
				DataUtils.isString(addToCartRequest.products[0].product_id) &&
				DataUtils.isIntegerNumber(addToCartRequest.products[0].product_option_id) &&
				DataUtils.isIntegerNumber(addToCartRequest.products[0].quantity) &&
				addToCartRequest.products[0].quantity >= 1 &&
				DataUtils.isArray(addToCartRequest.products[0].config_options)
		}
		const isResponseValid = isAllPropertiesPresent && isAllTypesAreCorrect;

		return isResponseValid;
	}

	/**
	 * Validation config options
	 */
	private static _isConfigOptionValid(configOption) {
		const isAllPropertiesPresent =
			'config_code' in configOption &&
			'direction' in configOption &&
			'quantity' in configOption;

		if (!isAllPropertiesPresent) {
			return false;
		}

		const isTypesCorrect =
			DataUtils.isString(configOption.config_code) &&
			DataUtils.isString(configOption.direction) &&
			DataUtils.isString(configOption.quantity) &&
			DataUtils.isValidHalfHalf(configOption.direction);

		return isTypesCorrect;
	}

	/**
	 * Validate combo add to cart request
	 */
	private static _isComboAddToCartRequestValid(addToCartRequest: AddCartServerRequestInterface, jsData: JsDataInterface): boolean {
		if (!addToCartRequest.products[0].child_items && !DataUtils.isArray(addToCartRequest.products[0].child_items)) {
			return false;
		}
		return true;
	}

	/**
	 * Check data structure for product init
	 */
	static validateInitProductData(notDecoderJsData: string, platform: PlatformEnum, lang: LangEnum) {
		if (!(platform in PlatformEnum)) {
			const error = {
				code: 10,
				message: 'Invalid or missing platform',
				exception: ''
			} as DefaultErrorInterface;
			console.error(error);
			throw (error);
		}

		if (!(lang in LangEnum)) {
			const error = {
				code: 11,
				message: 'Invalid or missing lang',
				exception: ''
			} as DefaultErrorInterface;
			console.error(error);
			throw (error);
		}
	}

	/**
	 * Validate structure of js data
	 */
	static validateDecodedJsData(decodedJsData: JsDataInterface) {
		const isAllPropertiesPresent =
			'kind' in decodedJsData &&
			'products' in decodedJsData &&
			('combo' in decodedJsData || 'new_combo' in decodedJsData) &&
			'product_id' in decodedJsData;

		if (!isAllPropertiesPresent) {
			const error = {
				code: 2,
				message: 'Decoded js data has invalid data structure. king, product, product_id or combo fields are missing',
				exception: JSON.stringify({
					decodedJsData
				})
			} as DefaultErrorInterface;
			console.error(error);
			throw (error);
		}

		const isAllPropertiesHasCorrectTypes =
			DataUtils.isString(decodedJsData.kind) &&
			DataUtils.isString(decodedJsData.product_id) &&
			(DataUtils.isObject(decodedJsData.combo) || DataUtils.isObject(decodedJsData.new_combo)) &&
			DataUtils.isArray(decodedJsData.products);

		if (!isAllPropertiesHasCorrectTypes) {
			const error = {
				code: 6,
				message: 'Decoded js data has invalid data structure types. king, product, product_id or combo fields has wrong type',
				exception: JSON.stringify({
					decodedJsData
				})
			} as DefaultErrorInterface;
			console.error(error);
			throw (error);
		}


		const isValidKing = DataUtils.isValidKind(decodedJsData.kind);

		if (!isValidKing) {
			const error = {
				code: 12,
				message: 'Invalid product kind from js data',
				exception: decodedJsData.kind
			} as DefaultErrorInterface;
			console.error(error);
			throw (error);
		}

		if (decodedJsData.kind === Kinds.combo) {
			decodedJsData.products.forEach(product => {
				const isAllFieldsPresent =
					DataUtils.isObject(product.configuration_options) &&
					DataUtils.isObject(product.product_options) &&
					DataUtils.isObject(product.configurations) &&
					DataUtils.isIntegerNumber(product.line_id);

				if (!isAllFieldsPresent) {
					const error = {
						code: 7,
						message: 'Combo product list has invalid data structure structure',
						exception: JSON.stringify({
							product
						})
					} as DefaultErrorInterface;
					console.error(error);
					throw (error);
				}
			});
		}

	}

	/**
	 * Validate product config
	 */
	static validateGetProductConfig(addToCartRequest: AddCartServerRequestInterface, jsData: JsDataInterface) {
		// TODO Check if set product is same as requested one after server would add product id

		// Check add to cart request for every product
		if (!this._isCommonAddToCartRequestValid(addToCartRequest)) {
			const error = {
				code: 24,
				message: 'Add to cart request format is invalid',
				exception: JSON.stringify({
					addToCartRequest
				})
			} as DefaultErrorInterface;
			console.error(error);
			throw (error);
		}

		// check if there is only 1 object in 'products' array of addToCartRequest
		if (addToCartRequest.products.length > 1) {
			const error = {
				code: 26,
				message: 'Add to cart request has more then 1 product',
				exception: JSON.stringify({
					addToCartRequest
				})
			} as DefaultErrorInterface;
			console.error(error);
			throw (error);
		}

		// Check combo add to cart request
		if (jsData.kind === Kinds.combo) {
			if (!this._isComboAddToCartRequestValid(addToCartRequest, jsData)) {
				const error = {
					code: 25,
					message: 'Missing child items array or wrong array length',
					exception: JSON.stringify({
						child_items: addToCartRequest.child_items,
						child_items_len: addToCartRequest.child_items ? addToCartRequest.child_items.length : null,
						js_data_products_len: jsData.products.length
					})
				} as DefaultErrorInterface;
				console.error(error);
				throw (error);
			}
		}
	}

	/**
	 * Validates part of add to card request
	 */
	static validateQuantityAndHalfHalfValues(ingredientQuantity, ingredientHalfHalf, ingredients) {
		if (!DataUtils.isIntegerNumber(ingredientQuantity) || ingredientQuantity <= 0) {
			const error = {
				code: 22,
				message: 'Add to cart request has invalid quantity',
				exception: JSON.stringify({
					ingredients
				})
			} as DefaultErrorInterface;
			console.error(error);
			throw (error);
		}

		if (!DataUtils.isValidHalfHalf(ingredientHalfHalf)) {
			const error = {
				code: 23,
				message: 'Add to cart request has invalid value for half/half',
				exception: JSON.stringify({
					ingredients
				})
			} as DefaultErrorInterface;
			console.error(error);
			throw (error);
		}
	}

	/**
	 * TODO:
	 * 1. Consider moving get<*> function to different file
	 */
	static getJsDataLineByLineId(jsData: JsDataInterface, lineId: number): JsDataProductInterface {
		const jsDataProducts = jsData.products;
		const selectedJsData = jsDataProducts.filter(jsDataObj => jsDataObj.line_id === lineId)[0];

		if (!selectedJsData) {
			const error = {
				code: 30,
				message: 'Not matching line ids in add to card request and js_data',
				exception: JSON.stringify({
					jsDataProducts,
					lineId
				})
			} as DefaultErrorInterface;
			console.error(error);
			throw (error);
		}

		return selectedJsData;
	}

	/**
	 * Helper to get configuration by code
	 */
	static getProductConfigurationByCode(
		singleProductValidationDict: JsDataConfigOptions,
		ingredientCode: string
	): JsDataConfigOptionsObj {

		return singleProductValidationDict[ingredientCode];
	}

	/**
	 * Helper to get product ingredient
	 */
	static getProductOptionByIngredientCodeAndOptionId(
		singleProductValidationDict: JsDataConfigOptions,
		ingredientCode: string,
		productOptionId: number
	) {
		const validationObj = singleProductValidationDict[ingredientCode];
		if (!validationObj) {
			const error = {
				code: 20,
				message: 'Invalid config option in add to cart request',
				exception: JSON.stringify({
					ingredientCode,
					productOptionId
				})
			} as DefaultErrorInterface;
			console.error(error);
			throw (error);
		}
		const productOptionData = validationObj.product_options[productOptionId];
		if (!productOptionData) {
			const error = {
				code: 21,
				message: 'Invalid product option for config',
				exception: JSON.stringify({
					ingredientCode,
					productOptionId
				})
			} as DefaultErrorInterface;
			console.error(error);
			// throw (error);
		}

		return productOptionData;
	}

	/**
	 * Validates add to card request
	 */
	static validateTwinAddToRequest(addToCartRequest: AddCartServerRequestInterface) {
		if (addToCartRequest.products[0].child_items.length !== 2) {
			const error = {
				code: 26,
				message: 'Add to cart request for twin should have two child products ',
				exception: JSON.stringify({ addToCartRequest })
			} as DefaultErrorInterface;
			console.error(error);
			throw (error);
		}
	}

	/**
	 * Helper for extra charger value
	 */
	static getExtraChargeValue(
		singleProductValidationDict: JsDataConfigOptions,
		ingredientCode: string,
		productOptionId: number
	) {
		let isExtraChargeVal = false;
		const validationObj = singleProductValidationDict[ingredientCode];
		const productOptionExtraChargeValue =
			validationObj.product_options[productOptionId] ? validationObj.product_options[productOptionId].is_premium : isExtraChargeVal;
		if (productOptionExtraChargeValue) {
			isExtraChargeVal = true;
		}
		return isExtraChargeVal;
	}

	/**
	 * Helper to raise error by error code
	 */
	static trowErrorByCode(errorCode: number, details: Error | string = '') {
		switch (errorCode) {
			case 1: {
				const error = {
					code: 1,
					message: 'Can’t decode js_data',
					exception: details
				} as DefaultErrorInterface;
				console.error(error);
				throw (error);
			}

			case 3: {
				const error = {
					code: 3,
					message: 'Product config is not set',
					exception: ''
				} as DefaultErrorInterface;
				console.error(error);
				throw (error);
			}

			case 4: {
				const error = {
					code: 4,
					message: 'Product jsData had invalid structure when initiated',
					exception: ''
				} as DefaultErrorInterface;
				console.error(error);
				throw (error);
			}

			case 5: {
				const error = {
					code: 5,
					message: 'Request product has different product id than initiated one',
					exception: ''
				} as DefaultErrorInterface;
				console.error(error);
				throw (error);
			}

			case 25: {
				const error = {
					code: 25,
					message: 'Missing child items array or wrong array length',
					exception: details
				} as DefaultErrorInterface;
				console.error(error);
				throw (error);
			}
		}

	}
}
