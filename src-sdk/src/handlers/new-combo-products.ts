// Utils
import { DataUtils } from '../utils/data-utils';

// Handlers
import { IngredientsHandler } from './ingredients';
import { DataValidation } from '../handlers/data-validation';
import { ProductValidationHandler } from '../handlers/product-validation';

// Models
import {
	JsDataInterface
} from '../models/js-validation-data';
import {
	AddCartServerRequestInterface
} from '../models/add-to-cart-request';
import {
	PriceCaloriesInterface,
	BaseComboInterface
} from '../models/interactor';
import {
	LangEnum,
	ProductValidation
} from '../models/sdk-interface';

import {
	ComboProductHandler
} from '../handlers/combo-product';

export class NewComboProductHandler extends ComboProductHandler implements BaseComboInterface {
	// Product input data
	_jsData: JsDataInterface;
	_addToCartRequest: AddCartServerRequestInterface;
	_lang: LangEnum;

	// Handlers
	_ingredientsHandler: IngredientsHandler;
	_productValidationHandler: ProductValidationHandler;

	constructor(
		jsData: JsDataInterface,
		addToCartRequest: AddCartServerRequestInterface,
		ingredientsHandler: IngredientsHandler,
		productValidationHandler: ProductValidationHandler,
		lang: LangEnum
	) {
		super(jsData, addToCartRequest, ingredientsHandler, productValidationHandler, lang)

		this._jsData = jsData;
		this._addToCartRequest = addToCartRequest;
		this._lang = lang;

		this._ingredientsHandler = ingredientsHandler;
		this._productValidationHandler = productValidationHandler;
	}

	/**
	 * Base class method overwrite
	 * Getting price and calories for combo product new model
	 */
	public getComboWithIngredientsPrice(addToCartRequest: AddCartServerRequestInterface): PriceCaloriesInterface {
		const comboQuantity = addToCartRequest.products[0].quantity;
		let fullComboPrice = this._getBaseComboPrice();

		// 2 optional parameters for twin pizza check
		let commonConfigTwinsQtyLeft = null;
		let commonTwinsHalfToggle = false;

		addToCartRequest.products[0].child_items.forEach(childItem => {
			const productOptionId = childItem.product_option_id;
			const addToCartIngredients = childItem.config_options;
			const lineId = childItem.line_id;
			const currentProductJsData = DataValidation.getJsDataLineByLineId(this._jsData, lineId);
			const comboProductPriceAndCalories = this._ingredientsHandler.getIngredientsPriceAndCalories(
				productOptionId,
				addToCartIngredients,
				currentProductJsData,
				commonConfigTwinsQtyLeft,
				commonTwinsHalfToggle
			);
			commonConfigTwinsQtyLeft = comboProductPriceAndCalories.commonConfigTwinsQtyLeft;
			commonTwinsHalfToggle = comboProductPriceAndCalories.commonTwinsHalfToggle;
			const staticCalories = fullComboPrice.calories;
			fullComboPrice = DataUtils.sumPriceAndCalories(fullComboPrice, comboProductPriceAndCalories, staticCalories);
		});

		fullComboPrice = DataUtils.multiplyPriceAndCalories(fullComboPrice, comboQuantity);
		return fullComboPrice;
	}

	/**
	 * Getting base price for product base on product option id for add to card request
	 * or from js data default selection
	 */
	private _getBaseComboPrice(): PriceCaloriesInterface {

		// if pizza not in cart
		let basePrice = this._jsData.new_combo.base_price;

		// TODO: IS IT SAFE assumption: Combo base price only changed based on size of pizza in it
		// if pizza in cart check for size and add + base price from pizza[product option id]
		this._addToCartRequest.products[0].child_items.forEach(productInCart => {
			const currentProductData = this._jsData.products.filter(jsProduct => productInCart.line_id === jsProduct.line_id)[0]
			// PLease note: second twin base price = 0 should stay as is.
			basePrice = basePrice + currentProductData.product_options[productInCart.product_option_id].base_price;
			// if current product is twin we need to find the base price of the grouped product option id
			if (currentProductData.is_twin) {
				const twinLineID = currentProductData.product_options[productInCart.product_option_id].grouped_products.line_id;
				const twinProductOption = currentProductData.product_options[productInCart.product_option_id].grouped_products.product_option;
				const currentProductTwinData = this._jsData.products.filter(jsProduct => twinLineID === jsProduct.line_id)[0]
				const twinProductOptionBasePrice = currentProductTwinData.product_options[twinProductOption].base_price;
				basePrice = basePrice + twinProductOptionBasePrice;
			}
		})


		// Find product with base calories
		const jsDataBaseProductLineId = this._jsData.new_combo.calories_line_id;
		let jsDataBaseProduct;
		let caloriesLabel = '';

		if (jsDataBaseProductLineId === 0) {
			if (this._jsData.new_combo.calories_range && this._lang in this._jsData.new_combo.calories_range) {
				caloriesLabel = this._jsData.new_combo.calories_range[this._lang];
			} else {
				console.warn('CRITICAl | new_combo.calories_range is not valid dict');
			}
		} else {
			jsDataBaseProduct = this._jsData.products
				.filter(product => product.line_id === jsDataBaseProductLineId)[0];
			// Check if product is in the card
			const addToCardBaseProduct = this._addToCartRequest.products[0].child_items
				.filter(childItem => childItem.line_id === jsDataBaseProductLineId);
			if (addToCardBaseProduct[0]) {
				// Product is the card, take product option id from there
				const productOptionId = addToCardBaseProduct[0].product_option_id;
				caloriesLabel = jsDataBaseProduct.product_options[productOptionId].calories_range[this._lang];
			} else {
				// Product is not the card, take default product option id from js data
				for (const productOptionId in jsDataBaseProduct.product_options) {
					if (jsDataBaseProduct.product_options[productOptionId]) {
						const productOptions = jsDataBaseProduct.product_options[productOptionId];
						if (productOptions.selected) {
							caloriesLabel = productOptions.calories_range[this._lang];
							break;
						}
					}
				}
			}
		}
		const fullComboPrice = {
			price: basePrice,
			calories: caloriesLabel,
		} as PriceCaloriesInterface;

		return fullComboPrice
	}

	/**
	 * Same method implementation as in base class
	 */
	public getComboTwinValidation(): ProductValidation {
		const validation = super.getComboTwinValidation();
		const dictAmountOfProductsDefaultByGroupId = this._jsData.new_combo.groups_selection;
		const dictAmountProdConfiguredByGroupId = {};
		const dictJsGroupAndLineId = {};
		const lineIdsByGroupsNotConfigured = {}
		// make dict for line and group ids
		this._jsData.products.forEach(jsComboChildProduct => {
			dictJsGroupAndLineId[jsComboChildProduct.line_id] = jsComboChildProduct.group_id;
			if (lineIdsByGroupsNotConfigured[jsComboChildProduct.group_id]) {
				lineIdsByGroupsNotConfigured[jsComboChildProduct.group_id].push(jsComboChildProduct.line_id)
			} else {
				lineIdsByGroupsNotConfigured[jsComboChildProduct.group_id] = [jsComboChildProduct.line_id]
			}
		});


		// find given line id in add to cart request
		// if found then ++ for dictAmountProdConfiguredByGroupId
		// removed configured line id from dict lineIdsByGroupsNotConfigured
		for (const lineIdKey in dictJsGroupAndLineId) {
			if (dictJsGroupAndLineId[lineIdKey]) {
				const groupId = dictJsGroupAndLineId[lineIdKey]
				const isChildInAddToCart = this._addToCartRequest.products[0].child_items
					.filter(child => child.line_id === parseInt(lineIdKey, 10))[0] ? true : false
				if (!dictAmountProdConfiguredByGroupId[groupId]) {
					dictAmountProdConfiguredByGroupId[groupId] = 0;
				}
				if (isChildInAddToCart) {
					const lineIdToRemove = lineIdsByGroupsNotConfigured[groupId]
						.find(confgiuredIdToRemove => confgiuredIdToRemove === parseInt(lineIdKey, 10))
					const indexLineIdToRemove = lineIdsByGroupsNotConfigured[groupId].indexOf(lineIdToRemove)
					lineIdsByGroupsNotConfigured[groupId].splice(indexLineIdToRemove, 1)
					dictAmountProdConfiguredByGroupId[groupId] = dictAmountProdConfiguredByGroupId[groupId] + 1;
				}
			}
		}


		/* tslint:disable:forin */

		// check if we have consistent amount configured/selected per group from addToCart and whats required from data
		const isGroupSelectionFulfilled = DataUtils.deepEqual(dictAmountProdConfiguredByGroupId, dictAmountOfProductsDefaultByGroupId);
		if (isGroupSelectionFulfilled) {
			/*
				since all required combo products configured/selected
				put isNotApplicable true for the rest items not in cart and from the same group
			*/
			for (const groupId in lineIdsByGroupsNotConfigured) {
				for (const validationLineId in validation.children) {
					if (lineIdsByGroupsNotConfigured[groupId].find(product => product === parseInt(validationLineId, 10))) {
						validation.children[validationLineId].isNotApplicable = true;
					} else {
						// means product is configured so flag assigned should be false
						validation.children[validationLineId].isNotApplicable = false;
					}
				}
			}
			validation.isConfigValid = true;

		} else {
			/*  since not all required combo products configured/selected
				put flag notApplicable false for all items which are from the same group but not in cart request
			*/
			for (const groupId in lineIdsByGroupsNotConfigured) {
				for (const validationLineId in validation.children) {
					lineIdsByGroupsNotConfigured[groupId].forEach(childLineId => {
						if (lineIdsByGroupsNotConfigured[groupId].find(product => product === parseInt(validationLineId, 10))) {
							// check if amount per group reached its needed maximum if yes then isNotApplicable = true, else false
							if (dictAmountOfProductsDefaultByGroupId[groupId] === dictAmountProdConfiguredByGroupId[groupId]) {
								validation.children[childLineId].isNotApplicable = true;
							} else {
								validation.children[childLineId].isNotApplicable = false;
							}
						}
					})
				}
			}

			validation.isConfigValid = false;

			// Get the size of an object
			const amountOfValidationChildren = DataUtils.sizeOfObject(validation.children)
			let childValidationPassed = 0;
			for (const lineID in validation.children) {
				// if all children validation true then main validation should be true
				if (validation.children[lineID].isConfigValid) {
					childValidationPassed++;
				}
			}
			if (amountOfValidationChildren === childValidationPassed) {
				validation.isConfigValid = true;
			}
		}
		return validation;
	}
}
