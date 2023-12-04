// Utils
import { DataUtils } from '../utils/data-utils';

// Handlers
import { IngredientsHandler } from './ingredients';

// Models
import {
	JsDataInterface
} from '../models/js-validation-data';
import {
	AddCartServerRequestInterface,
} from '../models/add-to-cart-request';
import {
	PriceCaloriesInterface,
} from '../models/interactor';
import {
	LangEnum
} from '../models/sdk-interface';


export class SingleProductHandler {

	_jsData: JsDataInterface;
	_addToCartRequest: AddCartServerRequestInterface;
	_ingredientsHandler: IngredientsHandler;
	_lang: LangEnum;

	constructor(
		jsData: JsDataInterface,
		addToCartRequest: AddCartServerRequestInterface,
		ingredientsHandler: IngredientsHandler,
		lang: LangEnum
	) {
		this._jsData = jsData;
		this._addToCartRequest = addToCartRequest;
		this._ingredientsHandler = ingredientsHandler;
		this._lang = lang;
	}

	/**
  * TODO error handler if product option is not set
  */
	public getSingleWithIngredientPrice(forProductOptionId?: number): PriceCaloriesInterface {
		const productOptionId = forProductOptionId ? forProductOptionId : this._addToCartRequest.products[0].product_option_id;
		const addToCartIngredients = this._addToCartRequest.products[0].config_options;
		const productQuantity = this._addToCartRequest.products[0].quantity;
		const singleConfigJsData = this._jsData.products[0];
		const singleProductOptions = singleConfigJsData.product_options[productOptionId];
		const ingredientsPriceAndCalories = this._ingredientsHandler.getIngredientsPriceAndCalories(
			productOptionId,
			addToCartIngredients,
			singleConfigJsData
		);

		let caloriesRange = '';
		let typedSingleBasePrice = {}
		let totalSinglePrice;
		if (singleProductOptions.is_calories_static === true) {
			caloriesRange = singleProductOptions.calories_range === null ? '' : singleProductOptions.calories_range[this._lang];
			typedSingleBasePrice = {
				price: singleProductOptions.base_price,
			} as PriceCaloriesInterface;
			// Base price + ingredients price
			totalSinglePrice = DataUtils.sumPriceAndCalories(typedSingleBasePrice, ingredientsPriceAndCalories, caloriesRange);
			// Multiple the price for quantity
			totalSinglePrice = DataUtils.multiplyPriceAndCalories(totalSinglePrice, productQuantity);
		} else {
			if (singleProductOptions.calories_label === null) {
				singleProductOptions.calories_label = '';
			}
			const caloriesLabel = singleProductOptions.calories_label === '' ? '' : singleProductOptions.calories_label[this._lang];
			typedSingleBasePrice = {
				price: singleProductOptions.base_price,
				calories: singleProductOptions.calories,
				calories_label: caloriesLabel
			}
			totalSinglePrice = DataUtils.sumPriceAndCalories(typedSingleBasePrice, ingredientsPriceAndCalories);
			totalSinglePrice = DataUtils.multiplyPriceAndCalories(totalSinglePrice, productQuantity);
		}

		return totalSinglePrice;
	}
}
