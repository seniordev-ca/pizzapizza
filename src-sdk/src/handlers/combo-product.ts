// Utils
import { DataUtils } from '../utils/data-utils';

// Handlers
import { IngredientsHandler } from './ingredients';
import { DataValidation } from '../handlers/data-validation';
import { ProductValidationHandler } from '../handlers/product-validation';
import { UserMessagesHandler } from '../handlers/user-messages';

// Models
import {
	JsDataInterface,
	JsDataCombinationsInterface,
	JsDataProductInterface,
} from '../models/js-validation-data';
import {
	AddCartServerRequestInterface,
	AddCartProductServerRequestInterface
} from '../models/add-to-cart-request';
import {
	PriceCaloriesInterface,
	Kinds,
	BaseComboInterface
} from '../models/interactor';
import {
	LangEnum,
	ProductValidation,
	UpSizingInterface
} from '../models/sdk-interface';

export class ComboProductHandler implements BaseComboInterface {
	// Product input data
	_jsData: JsDataInterface;
	_addToCartRequest: AddCartServerRequestInterface;
	_lang: LangEnum;

	// Handlers
	_ingredientsHandler: IngredientsHandler;
	_productValidationHandler: ProductValidationHandler;

	_notConfiguredComboItemsLineIds = []

	constructor(
		jsData: JsDataInterface,
		addToCartRequest: AddCartServerRequestInterface,
		ingredientsHandler: IngredientsHandler,
		productValidationHandler: ProductValidationHandler,
		lang: LangEnum
	) {
		this._jsData = jsData;
		this._addToCartRequest = addToCartRequest;
		this._lang = lang;

		this._ingredientsHandler = ingredientsHandler;
		this._productValidationHandler = productValidationHandler;
	}


	/**
	 * Calculate price and calories for combo product
	 */
	public getComboWithIngredientsPrice(addToCartRequest: AddCartServerRequestInterface): PriceCaloriesInterface {
		const comboBasePrice = this._getComboBasePriceAndCalories(addToCartRequest);
		const comboQuantity = addToCartRequest.products[0].quantity;
		const twinCalories = {};
		let productsUnderComboPrice = {
			price: 0,
			calories: '0',
			calories_label: ''
		} as PriceCaloriesInterface;

		// 2 optional parameters for twin pizza check
		let commonConfigTwinsQtyLeft = null;
		let commonTwinsHalfToggle = false;

		// TODO validation if count is not matching
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
			// for twins we calculate dynamic calories per twin/line_id
			if (this._jsData.kind === Kinds.twin) {
				// find calories labels by line id from product options and then grab it
				let caloriesLabelForTwin = '';
				this._jsData.products.forEach(product => {
					if (product.line_id === lineId) {
						caloriesLabelForTwin = product.product_options[productOptionId].calories_label[this._lang]
					}
				})

				twinCalories[lineId] = comboProductPriceAndCalories.calories + ' ' + caloriesLabelForTwin;
			}

			commonConfigTwinsQtyLeft = comboProductPriceAndCalories.commonConfigTwinsQtyLeft;
			commonTwinsHalfToggle = comboProductPriceAndCalories.commonTwinsHalfToggle;
			productsUnderComboPrice = DataUtils.sumPriceAndCalories(productsUnderComboPrice, comboProductPriceAndCalories);
		});

		let fullComboPrice = DataUtils.sumPriceAndCalories(comboBasePrice, productsUnderComboPrice);
		fullComboPrice = DataUtils.multiplyPriceAndCalories(fullComboPrice, comboQuantity);

		// check if pizza in combo was configured: if no then go to pick default size
		let pizzaInCart = false;
		// create array of product options id from jsData
		const productOptionIdArray = [];
		for (const productOptionId in this._jsData.combo.size_selections) {
			if (this._jsData.combo.size_selections[productOptionId]) {
				productOptionIdArray.push(productOptionId)
			}
		}

		// check if any of product option ids in the AddToCartRequest
		let productOptionIdInCart
		const childItemsArray = addToCartRequest.products[0].child_items;
		const childItemsArrayOfIds = [];
		// check if any product option id from addToCartRequest is in jsData
		childItemsArray.forEach(item => {
			childItemsArrayOfIds.push(item.product_option_id);
			if (productOptionIdArray.indexOf(item.product_option_id.toString()) > -1) {
				pizzaInCart = true;
				productOptionIdInCart = item.product_option_id;
			}

		})


		// check if cart is empty or pizza is not configured(means we don't have option id to define size) and if it is true then take
		// default size (selected:true) and grab calories within that size
		if (!pizzaInCart) {
			for (const productOptionId in this._jsData.combo.size_selections) {
				if (this._jsData.combo.size_selections[productOptionId]) {
					// check if calories range is null and if it is -> return empty string
					const isCaloriesStatic = this._jsData.combo.size_selections[productOptionId].is_calories_static;
					const defaultProductData = this._jsData.combo.size_selections[productOptionId]
					//
					if (this._jsData.combo.size_selections[productOptionId].selected === true) {
						if (!isCaloriesStatic) {
							fullComboPrice.calories = defaultProductData.calories.toString() + ' ' + defaultProductData.calories_label[this._lang]
						} else {
							if (defaultProductData.calories_range === null) {
								defaultProductData.calories_range = {
									'en': '',
									'fr': ''
								}
							}
							fullComboPrice.calories = defaultProductData.calories_range[this._lang]
						}
					}
				}
			}
		}
		if (pizzaInCart) {
			// for not complete addToCartRequest, use productOptionIdInCart as default for calories
			const isCaloriesStaticInCart = this._jsData.combo.size_selections[productOptionIdInCart].is_calories_static;
			const productInCartData = this._jsData.combo.size_selections[productOptionIdInCart]
			// not complete addToCartRequest
			if (this._notConfiguredComboItemsLineIds.length > 0) {
				if (!isCaloriesStaticInCart) {
					fullComboPrice.calories = productInCartData.calories.toString() + ' ' + productInCartData.calories_label[this._lang]
				} else {
					fullComboPrice.calories = productInCartData.calories_range[this._lang]
				}
			} else {
				// complete addToCartRequest check all the combinations and pick calories from there
				this._jsData.combo.combinations.forEach(combination => {
					const comparedArrays = DataUtils.areArraysEqual(childItemsArrayOfIds, combination.product_option_ids);
					// when combination is found
					if (comparedArrays) {
						// check if calories are static or dynamic
						if (combination.is_calories_static === false) {
							const finalDynamicCalories = combination.calories.toString() + ' ' + combination.calories_label[this._lang];
							fullComboPrice.calories = finalDynamicCalories;
						} else {
							const finalCalories = combination.calories_range === null ? '' : combination.calories_range[this._lang];
							fullComboPrice.calories = finalCalories;
						}
					} else {
						console.warn('combination was not found. Possibly product Ids changed');
					}
				})
			}
		}
		if (this._jsData.kind === Kinds.twin) {
			fullComboPrice.twinCalories = twinCalories;
		}
		return fullComboPrice;
	}

	/**
	 * Combo upsize handler
	 */
	public _get_combo_upsize(productJsData: JsDataProductInterface, childAddToCard: AddCartProductServerRequestInterface): UpSizingInterface {
		// Only for Pizza
		if (!productJsData.is_pizza) {
			return null;
		}
		// In the card
		const selectedProductOptionId = childAddToCard.product_option_id;
		if (!selectedProductOptionId) {
			return null;
		}
		const currentProduct = productJsData.product_options[selectedProductOptionId];

		const productOptionsArr = [];
		// Find first next size for upsize
		// Needs ordered dict by size to find first bigger size
		let toProductOption = null;
		for (const productOptionsId in productJsData.product_options) {
			if (productJsData.product_options[productOptionsId]) {
				productOptionsArr.push(
					{
						...productJsData.product_options[productOptionsId],
						productOptionsId
					}
				);
			}
		}

		productOptionsArr.sort((a, b) => a.size - b.size);
		for (const productOption of productOptionsArr) {
			if (productOption.size > currentProduct.size) {
				toProductOption = parseInt(productOption.productOptionsId, 10);
				break;
			}
		}

		for (const selectedConfigOptions of childAddToCard.config_options) {
			const configOptions = productJsData.configuration_options[selectedConfigOptions.config_code];
			if (!(toProductOption in configOptions.product_options)) {
				return null;
			}
		}

		if (!toProductOption) {
			return null;
		}
		const usizeToProduct = productJsData.product_options[toProductOption];

		// No upsize if the price is same
		if (currentProduct.base_price === usizeToProduct.base_price) {
			return null;
		}

		// Get ing. price for up sized product
		const sizeName = usizeToProduct.size_name[this._lang];
		const callDiff = usizeToProduct.calories_range[this._lang];
		const currentProductPrice = this._ingredientsHandler.getIngredientsPriceAndCalories(
			selectedProductOptionId,
			childAddToCard.config_options,
			productJsData
		);
		const upsizeProductPrice = this._ingredientsHandler.getIngredientsPriceAndCalories(
			toProductOption,
			childAddToCard.config_options,
			productJsData
		)

		const basePriceDiff = Math.abs(usizeToProduct.base_price - currentProduct.base_price);
		const ingDiff = Math.abs(currentProductPrice.price - upsizeProductPrice.price);
		const priceDiff = basePriceDiff + ingDiff;

		const message = UserMessagesHandler.getUpSizeMessage(sizeName, callDiff, priceDiff);
		return {
			message,
			toProductOption
		};
	}

	/**
	 * Special handling for combo twin
	 */
	public getComboTwinValidation(): ProductValidation {
		const jsDataForProducts = this._jsData.products;
		const comboChildrenProduct = this._addToCartRequest.products[0].child_items;
		const comboProductNotAvailableDict = {};
		const comboConfigDict = {};
		let fullComboConfigValid = true;
		const dict = {};
		this._jsData.products.map(
			item => {
				this._notConfiguredComboItemsLineIds.push(item.line_id);
			}
		);

		const lineIdsLeft = [];

		// creating dictionary for all configured products in combo
		jsDataForProducts.forEach(productJs => {
			const jsDataLineId = productJs.line_id;

			let currentComboChildrenProduct = comboChildrenProduct
				.filter((product) => product.line_id === jsDataLineId)[0];
			currentComboChildrenProduct = currentComboChildrenProduct || {} as AddCartProductServerRequestInterface;

			if (!DataUtils.isEmptyObject(currentComboChildrenProduct)) {
				dict[productJs.group_id] = false;

				// check if any other products have same group id as configured product
				const groupIdConfiguredProduct = productJs.group_id;
				this._getLineIdsToRemoveWhenProductsConfigured(groupIdConfiguredProduct, lineIdsLeft);
			}
		})
		// sort data by line id -> just for clear view of data
		jsDataForProducts.sort((left, right) => left.line_id - right.line_id);
		let twinsCount = 0;
		jsDataForProducts.forEach((productJsData) => {
			const jsDataLineId = productJsData.line_id;
			if (productJsData.is_twin) {
				twinsCount++;
			}
			let currentComboChildrenProduct = comboChildrenProduct
				.filter((product) => product.line_id === jsDataLineId)[0];
			// If product is still not in the add to cart request
			currentComboChildrenProduct = currentComboChildrenProduct || {} as AddCartProductServerRequestInterface;
			const productValidation = this._productValidationHandler.validateProducts(
				this._jsData,
				productJsData,
				currentComboChildrenProduct,
				twinsCount
			);
			const comboGroupId = productJsData.group_id;

			/**
			 Please note:
			 Old model doesn't check the amount of items in the same group which should be configured/selected,
			 all it does: if there is one item from group is configured
			 then all items from same group automatically will become not applicable and validation will pass
			 */
			if (dict[productJsData.group_id] !== undefined && DataUtils.isEmptyObject(currentComboChildrenProduct)) {
				productValidation.isNotApplicable = true;
			} else {
				productValidation.isNotApplicable = comboProductNotAvailableDict[comboGroupId] ? true : false;
			}

			if (productValidation.isNotApplicable) {
				productValidation.isConfigValid = true;
				productValidation.validationMsg = '';
			}
			// if currentComboChildrenProduct is not empty (means it configured by user) then assign true
			if (!DataUtils.isEmptyObject(currentComboChildrenProduct)) {
				comboProductNotAvailableDict[comboGroupId] = true;
			}

			// If one product is not valid than whole combo is not valid
			if (!productValidation.isConfigValid) {
				fullComboConfigValid = false;
			}

			// Check if combo product could have up sizing
			// Only for combo. Twin pizza upsize model is like single.
			if (this._jsData.kind === Kinds.combo) {
				const upSizing = this._get_combo_upsize(productJsData, currentComboChildrenProduct);
				if (upSizing) {
					productValidation.upSizing = upSizing;
				}
			}
			comboConfigDict[jsDataLineId] = productValidation;
		});

		const comboValidationObj = {} as ProductValidation;
		comboValidationObj.isConfigValid = fullComboConfigValid;
		comboValidationObj.children = comboConfigDict;
		comboValidationObj.notConfiguredLineIds = this._notConfiguredComboItemsLineIds;

		if (!fullComboConfigValid) {
			comboValidationObj.validationMsg = UserMessagesHandler.getComboValidationMessage();
		}

		return comboValidationObj;
	}


	/**
	 * Get base price for combo
	 * TODO:
	 * 1. Calculation for calories after fixing back-end data
	 */
	private _getComboBasePriceAndCalories(addToCartRequest): PriceCaloriesInterface {
		// Allow empty array for combos and twins
		addToCartRequest.products[0].child_items = addToCartRequest.products[0].child_items || [];
		const selectedProductOptions = addToCartRequest.products[0].child_items.map(childItem => childItem.product_option_id);
		const combosArr = this._jsData.combo.combinations;

		// Find base price based on user selection
		let currentCombo = {} as JsDataCombinationsInterface

		// Find default price for combo
		let defaultPrice;
		if (this._jsData.kind === Kinds.combo) {
			const sizeSelectionsComboJsData = this._jsData.combo.size_selections;
			for (const prodId in sizeSelectionsComboJsData) {
				if (sizeSelectionsComboJsData[prodId].selected) {
					defaultPrice = sizeSelectionsComboJsData[prodId].base_price;
				}
			}
		}

		// finding correct combination for base price
		combosArr.forEach(comboObj => {
			const isEqual = DataUtils.areArraysEqual(selectedProductOptions, comboObj.product_option_ids);
			const price = this._getBaseOnSizePrice(selectedProductOptions)

			// pick default price from size_selections if no productId found(in case addToCartRequest is empty)
			// in size_selections, take default price (selected:true)
			const finalBasePrice = price === 0 ? defaultPrice : price;

			if (isEqual) {
				currentCombo = comboObj;
			}
			currentCombo.base_price = finalBasePrice;
		});


		// If combo is not under selected options take one with lowest price
		if (DataUtils.isEmptyObject(currentCombo)) {
			const orderedByPriceCombos = combosArr
				.sort((leftCombo, rightCombo) => leftCombo.base_price - rightCombo.base_price)
			currentCombo = orderedByPriceCombos[0];
		}
		let caloriesResult = 0;
		let caloriesLabel = '';

		// find calories label and calories amount if
		if (currentCombo.is_calories_static === false) {
			caloriesResult = currentCombo.calories === null ? 0 : currentCombo.calories;
			caloriesLabel = currentCombo.calories_label === null ? '' : currentCombo.calories_label[this._lang]
		}
		return {
			price: currentCombo.base_price,
			calories: caloriesResult.toString(),
			calories_label: caloriesLabel
		} as PriceCaloriesInterface;
	}

	/**
	 * Helper to get line ids
	 */
	private _getLineIdsToRemoveWhenProductsConfigured(groupIdConfiguredProduct, lineIdsLeft) {
		const jsDataForProducts = this._jsData.products;
		let productsInSameGroupAsConfiguredProduct = [];
		productsInSameGroupAsConfiguredProduct = jsDataForProducts.filter(item => item.group_id === groupIdConfiguredProduct);

		const arrayOfLineIdsToRemove = productsInSameGroupAsConfiguredProduct.map(product => product.line_id);

		lineIdsLeft = this._notConfiguredComboItemsLineIds.filter(el => {
			return arrayOfLineIdsToRemove.indexOf(el) < 0;
		});
		this._notConfiguredComboItemsLineIds = lineIdsLeft;
	}


	/**
	 *  function to check if any of product id from AddToCartRequest exists in sizeselections
	*/
	private _getBaseOnSizePrice(selectedProductOptions) {
		// create array of product options id from jsData
		const productOptionIdArray = [];
		for (const productOptionId in this._jsData.combo.size_selections) {
			if (this._jsData.combo.size_selections[productOptionId]) {
				productOptionIdArray.push(parseInt(productOptionId, 10))
			}
		}
		// check if selectedProductOptions has anything in size selections

		let basePriceChosenOnSize = 0;
		selectedProductOptions.forEach(selectedId => {
			if (productOptionIdArray.indexOf(selectedId) > -1) {
				basePriceChosenOnSize = this._jsData.combo.size_selections[selectedId].base_price;
			}
		})
		return basePriceChosenOnSize;
	}

}
