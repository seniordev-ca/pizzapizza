
import { DataUtils } from '../utils/data-utils';
import { DataValidation } from './data-validation';

// Models
import {
	Kinds,
	PriceCaloriesInterface
} from '../models/interactor';
import {
	JsDataInterface,
	JsDataProductInterface
} from '../models/js-validation-data';
import {
	AddCartServerRequestInterface,
	AddCartProductServerConfigOption,
	HalfHalfOptionsEnum
} from '../models/add-to-cart-request';

export class IngredientsHandler {

	_jsData: JsDataInterface;
	_addToCartRequest: AddCartServerRequestInterface;

	constructor(jsData: JsDataInterface, addToCartRequest: AddCartServerRequestInterface) {
		this._jsData = jsData;
		this._addToCartRequest = addToCartRequest;
	}

	/**
	 * Calculate price and calories for add to cart request and js data dict.
	 */
	public getIngredientsPriceAndCalories(
		productOptionId: number,
		addToCartIngredients: AddCartProductServerConfigOption[],
		jsDataProduct: JsDataProductInterface,
		commonConfigTwinsQtyLeft?,
		commonTwinsHalfToggle?: boolean

	): PriceCaloriesInterface {

		// let commonIncludedQuantity = 0;
		let ingredientsPrice = 0;
		let ingredientsCalories = 0;
		const singleProductValidationDict = jsDataProduct.configuration_options;


		// 1. Create dictionary :SUM of configuration_options.productOptionData.included_quantity per Configuration;
		const includedQuantityPerProductOptionDict = {};
		addToCartIngredients.forEach((ingredients) => {
			const ingredientCode = ingredients.config_code;
			const productOptionData = DataValidation.getProductOptionByIngredientCodeAndOptionId(
				singleProductValidationDict,
				ingredientCode,
				productOptionId
			);
			const configValidationObject = DataValidation.getProductConfigurationByCode(jsDataProduct.configuration_options, ingredientCode);
			if (!(configValidationObject.configuration_id in includedQuantityPerProductOptionDict)) {
				includedQuantityPerProductOptionDict[configValidationObject.configuration_id] = {
					includedQuantity: 0
				}
			}

			let includedQuantityPerProductOption = 0;
			if (productOptionData && productOptionData.included_quantity) {
				includedQuantityPerProductOption = productOptionData.included_quantity;
			}

			includedQuantityPerProductOptionDict[configValidationObject.configuration_id].includedQuantity += includedQuantityPerProductOption;

		});

		// Cloning to avoid inited data mutation
		const includedQuantityPerConfigurationsDict = {};
		for (const configOption of Object.keys(jsDataProduct.configurations)) {
			includedQuantityPerConfigurationsDict[configOption] = {
				includedQuantity: jsDataProduct.configurations[configOption].included_quantity[productOptionId]
			}

			if (configOption in includedQuantityPerProductOptionDict) {
				includedQuantityPerConfigurationsDict[configOption].includedQuantity -=
					includedQuantityPerProductOptionDict[configOption].includedQuantity;
			}
			includedQuantityPerConfigurationsDict[configOption].includedQuantity =
				includedQuantityPerConfigurationsDict[configOption].includedQuantity < 0 ?
					0 : includedQuantityPerConfigurationsDict[configOption].includedQuantity;

			// fix for twin pizza: creating shared dictionary for subconfigurations included quantity
			if (jsDataProduct.is_twin) {
				if (commonConfigTwinsQtyLeft === null || typeof commonConfigTwinsQtyLeft === 'undefined') {

					includedQuantityPerConfigurationsDict[configOption].includedQuantity =
						includedQuantityPerConfigurationsDict[configOption].includedQuantity * 2
				} else {
					includedQuantityPerConfigurationsDict[configOption] = commonConfigTwinsQtyLeft[configOption]
				}

			}
		}

		let halfToggle = false;

		if (jsDataProduct.is_twin) {
			halfToggle = commonTwinsHalfToggle
		}
		// Get price and calories for every ingredient in add to cart request
		// iterating to get topping name and summarize calories for all toppings in ingredientsCalories
		/* tslint:disable:cyclomatic-complexity */
		addToCartIngredients.forEach((ingredient) => {

			const ingredientCode = ingredient.config_code;
			const ingredientQuantity = ingredient.quantity;
			// const ingredientQuantity = ingredients.direction != 'whole'? 0.5*ingredients.quantity : ingredients.quantity
			const ingredientHalfHalf = ingredient.direction;
			DataValidation.validateQuantityAndHalfHalfValues(ingredientQuantity, ingredientHalfHalf, ingredient);

			const isIngredientExtraCharge = DataValidation.getExtraChargeValue(singleProductValidationDict, ingredientCode, productOptionId);
			const productOptionData = DataValidation.getProductOptionByIngredientCodeAndOptionId(
				singleProductValidationDict, ingredientCode, productOptionId);

			let subconfigCalories = 0;
			if (ingredient.sub_config_option && this._jsData.kind !== Kinds.combo) {
				const productSubConfigOptionsDict = jsDataProduct.subconfiguration_options;
				subconfigCalories = productSubConfigOptionsDict[ingredient.sub_config_option].calories;
			}
			const configValidationObject = DataValidation.getProductConfigurationByCode(jsDataProduct.configuration_options, ingredientCode);
			// const includedQuantityByDefault = jsDataProduct.configurations[configValidationObject.configuration_id].included_quantity;

			let includedQuantityPerConfigOption = 0;

			if (productOptionData && productOptionData.included_quantity) {
				includedQuantityPerConfigOption = productOptionData.included_quantity;
			}


			// Pricing logic for half/half option
			const isHalfOption = DataUtils.isHalfOption(ingredientHalfHalf);
			let logicalQuantity = ingredientQuantity;
			let premiumQuantity = ingredientQuantity;

			if (isHalfOption) {
				if (halfToggle === false && ingredientQuantity % 2 !== 0) {
					halfToggle = true;
					logicalQuantity = Math.round(ingredientQuantity / 2);
				} else if (halfToggle === true && ingredientQuantity % 2 !== 0) {
					halfToggle = false;
					logicalQuantity = Math.round(ingredientQuantity / 2) - 1;
				} else {
					logicalQuantity = Math.round(ingredientQuantity / 2);
				}
				premiumQuantity = ingredientQuantity / 2;
			}

			// Check included quantity per config option
			let includedQuantityLeftPerConfiguration =
				includedQuantityPerConfigurationsDict[configValidationObject.configuration_id].includedQuantity;

			// exclude all included quantity(combo included quantity) from DICT per each config from addToCartRequest
			if (includedQuantityPerConfigurationsDict[configValidationObject.configuration_id].includedQuantity > 0) {
				let ingredientQuantityTotal = logicalQuantity - includedQuantityPerConfigOption
				ingredientQuantityTotal = ingredientQuantityTotal < 0 ? 0 : ingredientQuantityTotal;
				includedQuantityPerConfigurationsDict[configValidationObject.configuration_id].includedQuantity -= ingredientQuantityTotal;
			} else {
				includedQuantityPerConfigurationsDict[configValidationObject.configuration_id].includedQuantity = 0;
				includedQuantityLeftPerConfiguration = 0;
			}

			// User for twin pizza price calculation
			// const isIngredientTopping = DataUtils.isIngredientTopping(jsDataProduct.configuration_options, ingredientCode);
			logicalQuantity = logicalQuantity - includedQuantityLeftPerConfiguration - includedQuantityPerConfigOption;
			logicalQuantity = logicalQuantity < 0 ? 0 : logicalQuantity;

			premiumQuantity = premiumQuantity - includedQuantityPerConfigOption;
			premiumQuantity = premiumQuantity < 0 ? 0 : premiumQuantity;

			if (jsDataProduct.is_twin) {
				if (includedQuantityPerConfigurationsDict[configValidationObject.configuration_id].includedQuantity === 0) {
					includedQuantityPerConfigurationsDict[configValidationObject.configuration_id].includedQuantity = (logicalQuantity % 2)
				}
				commonConfigTwinsQtyLeft = includedQuantityPerConfigurationsDict;
				logicalQuantity = Math.round(logicalQuantity / 2);
				premiumQuantity = premiumQuantity / 2;
			}

			let productOptionPrice = productOptionData ? productOptionData.price : 0;
			if (isIngredientExtraCharge) {
				productOptionPrice -= productOptionData.premium_included_price;
				ingredientsPrice += productOptionData.premium_included_price * premiumQuantity;
			}

			ingredientsPrice += productOptionPrice * logicalQuantity;
			// might need to check half calories here and return new calories
			let ingredientAmountForHalf = 0;
			if (ingredient.direction !== HalfHalfOptionsEnum.whole) {
				ingredientAmountForHalf = 0.5;
			}
			let finalAmountPerIngredient = ingredientAmountForHalf === 0 ? ingredientQuantity : ingredientAmountForHalf * ingredient.quantity;
			const twentyFivePercent = finalAmountPerIngredient * 0.25;
			finalAmountPerIngredient = subconfigCalories < 0 ? finalAmountPerIngredient - twentyFivePercent : finalAmountPerIngredient;
			finalAmountPerIngredient = subconfigCalories > 0 ? finalAmountPerIngredient + twentyFivePercent : finalAmountPerIngredient;
			ingredientsCalories += productOptionData ? productOptionData.calories * finalAmountPerIngredient : 0;
		})

		if (jsDataProduct.is_twin) {
			commonTwinsHalfToggle = halfToggle
		}
		// round calories up if has extra number after .
		if (ingredientsCalories % 1 > 0) {
			ingredientsCalories = Math.round(ingredientsCalories);
		}

		return {
			price: ingredientsPrice,
			calories: ingredientsCalories.toString(),
			commonConfigTwinsQtyLeft,
			commonTwinsHalfToggle

		}
	} // end of getIngredientsPriceAndCalories



	/**
	 * Returning an array of products which are not available for selected size
	 */
	public getUnavailableIngredients(): string[] {

		const productKind = this._jsData.kind;
		const unavailableIngredients: string[] = [] as string[];

		const saveUnavailableIngredients = (configOptionsArr, jsDataConfigOptionsDict, productOptionId) => {
			configOptionsArr.forEach(configOption => {
				const ingredientCode = configOption.config_code;
				if (!jsDataConfigOptionsDict[ingredientCode].product_options[productOptionId]) {
					unavailableIngredients.push(ingredientCode);
				}
			});
		}

		if (productKind === Kinds.single) {

			// Check top level add to cart request for unavailable ingredients
			const configOptionsArr = this._addToCartRequest.products[0].config_options;
			const jsDataIngredients = this._jsData.products[0].configuration_options;
			const productOptionId = this._addToCartRequest.products[0].product_option_id;
			saveUnavailableIngredients(configOptionsArr, jsDataIngredients, productOptionId);
		} else {

			// If product is combo check if child_items exist
			if (!this._addToCartRequest.products[0].child_items) {
				const errorDetails = JSON.stringify({
					child_items: this._addToCartRequest.products[0].child_items,
					child_items_len: this._addToCartRequest.products[0].child_items ? this._addToCartRequest.products[0].child_items.length : null,
					js_data_products_len: this._jsData.products.length
				})
				DataValidation.trowErrorByCode(25, errorDetails);
			}

			// Check every product under combo for unavailable ingredients
			this._addToCartRequest.products[0].child_items.forEach(childItems => {
				const requestedProductJsData = this._jsData.products
					.filter(product => product.line_id === childItems.line_id)[0];
				const configOptionsArr = childItems.config_options;
				const productOptionId = childItems.product_option_id;

				saveUnavailableIngredients(configOptionsArr, requestedProductJsData.configuration_options, productOptionId);
			});
		}

		return unavailableIngredients;
	}

}
