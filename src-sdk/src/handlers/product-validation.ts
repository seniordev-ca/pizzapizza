// Utils
import { DataValidation } from '../handlers/data-validation';

// Handlers
import { UserMessagesHandler } from '../handlers/user-messages';

// Models
import {
	JsDataProductInterface,
	JsDataInterface
} from '../models/js-validation-data';
import {
	AddCartProductServerRequestInterface,
	HalfHalfOptionsEnum
} from '../models/add-to-cart-request';
import {
	SelectionRules,
	Kinds
} from '../models/interactor';
import {
	ProductValidation,
	LangEnum
} from '../models/sdk-interface';
import { convertCompilerOptionsFromJson } from 'typescript';

export class ProductValidationHandler {

	_productKind: Kinds;
	_lang: LangEnum;
	_validationMessage: UserMessagesHandler;


	constructor(productKind: Kinds, lang: LangEnum) {
		this._productKind = productKind;
		this._lang = lang;

		this._validationMessage = new UserMessagesHandler(this._productKind, this._lang);
	}

	/**
	 * Validates single product
	 */
	public validateProducts(
		jsData: JsDataInterface,
		jsDataForProduct: JsDataProductInterface,
		addToCartRequestProduct: AddCartProductServerRequestInterface,
		twinsCountProduct?: number
	): ProductValidation {

		let isConfigValid = true;
		// grab default product Option id (selected:true) if cart is empty. at least one should have selected:true
		let defaultProductOptionId;
		for (const key in jsDataForProduct.product_options) {
			if (jsDataForProduct.product_options[key]) {
				const value = jsDataForProduct.product_options[key].selected
				if (value) {
					defaultProductOptionId = key;
				}
			}
		}

		// check if we have default product option
		if (defaultProductOptionId === null) {
			console.error('We do not have any default option id chosen, since there is no selected:true')
		}

		let validationMsg = '';
		const singleProductSubConfigs = jsDataForProduct.configurations || [];

		// addToCartConfigOptions will stay undefined if product is not configured and not adedd to addToCartRequest
		const addToCartConfigOptions = addToCartRequestProduct.config_options || [];
		// if item wasn't configured cartProductOptionId will stay undefined
		let cartProductOptionId = addToCartRequestProduct.product_option_id;

		// for empty addToCartRequest we assigning default size -> default productOptionId
		if (cartProductOptionId === undefined || cartProductOptionId === null) {
			cartProductOptionId = defaultProductOptionId
		}
		let jsDataProductOption = jsDataForProduct.product_options[cartProductOptionId];

		let onlyExistedKey;
		// TODO check if that save assumption
		if (!jsDataProductOption) {
			if (Object.keys(jsDataForProduct.product_options).length === 1) {
				onlyExistedKey = Object.keys(jsDataForProduct.product_options)[0];
				jsDataProductOption = jsDataForProduct.product_options[defaultProductOptionId];
			}
		}


		// Count config categories for all ingredients(config options) added to cart
		const cardSubConfigCount = {};
		addToCartConfigOptions.forEach(addToCartConfigOption => {
			const configCode = addToCartConfigOption.config_code;
			const configObj = DataValidation.getProductConfigurationByCode(jsDataForProduct.configuration_options, configCode);
			const subConfigId = configObj.configuration_id;

			if (!cardSubConfigCount[subConfigId] || !cardSubConfigCount[subConfigId].count) {
				cardSubConfigCount[subConfigId] = {};
				if (addToCartConfigOption.direction !== HalfHalfOptionsEnum.whole) {
					cardSubConfigCount[subConfigId].count = addToCartConfigOption.quantity * 0.5;
				} else {
					cardSubConfigCount[subConfigId].count = addToCartConfigOption.quantity;
				}
			} else {
				if (addToCartConfigOption.direction !== HalfHalfOptionsEnum.whole) {
					cardSubConfigCount[subConfigId].count += addToCartConfigOption.quantity * 0.5;
				} else {
					cardSubConfigCount[subConfigId].count += addToCartConfigOption.quantity;
				}
			}
		});

		const resultValidation = {};

		this._validationMessage.resetValidationObject();
		// Go through js data validation data per each product of combo
		for (const subConfigKey of Object.keys(singleProductSubConfigs)) {
			const subConfigValidationObj = singleProductSubConfigs[subConfigKey];
			const maxQuantity = subConfigValidationObj.maximum_quantity;
			// const onlyExistedKeyProductOption = Object.keys(jsDataForProduct.product_options)[0]

			const includedQuantity = subConfigValidationObj.included_quantity[cartProductOptionId];

			//  includedQuantity = subConfigValidationObj.included_quantity[onlyExistedKey];
			const isRequired = subConfigValidationObj.is_required[cartProductOptionId];

			let selectionRule = SelectionRules.No;
			if (jsDataProductOption) {
				selectionRule = jsDataProductOption.selection_rule;
			}

			let selectedQuantity = 0;
			if (subConfigKey in cardSubConfigCount) {
				selectedQuantity = cardSubConfigCount[subConfigKey].count;
			}
			const validationResult = this._getValidationResult(maxQuantity, includedQuantity, selectionRule, isRequired, selectedQuantity);
			resultValidation[subConfigKey] = validationResult;

			// If invalid build validation message
			if (validationResult.isSelectionRequired) {
				this._validationMessage.addValidationObject(cartProductOptionId, subConfigValidationObj, selectedQuantity);
				isConfigValid = false;
			}

			if (validationResult.hasIncludedOptions) {
				const hasIncludedOptions = true;
				this._validationMessage.addValidationObject(defaultProductOptionId, subConfigValidationObj, selectedQuantity, hasIncludedOptions);
			}
		}

		/* Rule:
		*  If there are more than 1 non customizable product in jsDAta, return for them: configValid: false
		*  Only 1 non custom product should be chosen (for old models)
		*/
		// make dict for groups with amount of non customizable products
		const dictNonCustomProductPerGroup = {}
		jsData.products.forEach(jsProduct => {
			// saying explicitly here because some products wouldn't have this key at all
			if (jsProduct.allow_customization === false) {
				if (jsProduct.group_id in dictNonCustomProductPerGroup) {
					dictNonCustomProductPerGroup[jsProduct.group_id] = dictNonCustomProductPerGroup[jsProduct.group_id] + 1
				} else {
					dictNonCustomProductPerGroup[jsProduct.group_id] = 1
				}
			}
		})

		// this code affects only non customizable products in groups with amount over 1
		if (jsDataForProduct.group_id in dictNonCustomProductPerGroup && dictNonCustomProductPerGroup[jsDataForProduct.group_id] > 1) {
			// check if product in Cart
			if (addToCartRequestProduct && addToCartRequestProduct.line_id === jsDataForProduct.line_id) {
				isConfigValid = true
			} else {
				isConfigValid = false
			}
		}

		// need to pass selected quantity from previous twin and first iteration its going to be null
		validationMsg = this._validationMessage.getProductValidationMessage(twinsCountProduct);

		// Build final validation object
		let validation: ProductValidation = {} as ProductValidation;
		validation = {
			isConfigValid,
			validationMsg: validationMsg,
			configurations: resultValidation
		};

		return validation;
	}


	/**
	 * Logic migrate from SDK v1
	 */
	private _getValidationResult(maxQuantity, includedQuantity, selectionRule, isRequired, selectedQuantity) {

		if ((selectionRule === SelectionRules.Exact ||
			selectionRule === SelectionRules.ExactPlus ||
			selectionRule === SelectionRules.Inform) &&
			includedQuantity > 0) {
			if (selectedQuantity < includedQuantity) {
				return {
					isSelectionRequired: true,
					isMaximumAmountReached: false
				}
			} else {
				if (selectionRule === SelectionRules.Exact) {
					if (selectedQuantity === includedQuantity) {
						return {
							isSelectionRequired: false,
							isMaximumAmountReached: true
						}
					} else {
						return {
							isSelectionRequired: true,
							isMaximumAmountReached: false
						}
					}
				}

				return {
					isSelectionRequired: false,
					isMaximumAmountReached: false
				}
			}
		} else {
			if (isRequired && maxQuantity > 0) {
				if (selectedQuantity === maxQuantity) {
					return {
						isSelectionRequired: false,
						isMaximumAmountReached: true
					}
				}

				return {
					isSelectionRequired: false,
					isMaximumAmountReached: false
				}
			} else {
				if (includedQuantity > selectedQuantity) {
					return {
						hasIncludedOptions: true,
						isSelectionRequired: false,
						isMaximumAmountReached: false
					}
				}

				return {
					isSelectionRequired: false,
					isMaximumAmountReached: false
				}
			}
		}
	}

}
