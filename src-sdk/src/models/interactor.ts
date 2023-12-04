import {
	AddCartServerRequestInterface
} from './add-to-cart-request';
import {
	ProductValidation
} from '../models/sdk-interface';

/**
 * Product config
 */
export enum Kinds {
	single = 'single',
	combo = 'combo',
	twin = 'twin'
}

/**
 * Js data validation selection rules
 */
export enum SelectionRules {
	Exact = 'Exact',
	ExactPlus = 'ExactPlus',
	Inform = 'Inform',
	No = 'No'
}

export interface PriceCaloriesInterface {
	price: number,
	calories?: string, // breaking change number -> string // October 18,2018
	logicalToppingsIncluded?: number,
	calories_label?: string,
	commonConfigTwinsQtyLeft?,
	commonTwinsHalfToggle?: boolean,
	twinCalories?
}

export interface DefaultErrorInterface {
	code: number,
	message: string,
	exception: Error | string
}

export interface BaseComboInterface {
	/**
	 * Combo validation
	 */
	getComboWithIngredientsPrice(addToCartRequest: AddCartServerRequestInterface): PriceCaloriesInterface,
	/**
	 * Twin validation
	 */
	getComboTwinValidation(): ProductValidation
}
