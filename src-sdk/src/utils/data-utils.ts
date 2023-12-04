
import {
	AddCartServerRequestInterface,
	HalfHalfOptionsEnum
} from '../models/add-to-cart-request';

import {
	PriceCaloriesInterface,
	Kinds
} from '../models/interactor';

import {
	JsDataConfigOptions
} from '../models/js-validation-data';

/* tslint:disable:completed-docs */

export class DataUtils {
	static isIntegerNumber(value: string | number): boolean {
		return !isNaN(Number(value.toString()));
	}

	static isBool(value): boolean {
		return typeof value === 'boolean';
	}

	static isString(value): boolean {
		return typeof value === 'string';
	}

	static isObject(value): boolean {
		return typeof value === 'object';
	}

	static isArray(value): boolean {
		return Array.isArray(value);
	}

	static isEmptyObject(obj): boolean {
		return Object.keys(obj).length === 0 && obj.constructor === Object;
	}

	static areArraysEqual(firstArray, secondArray) {
		if (firstArray === secondArray) {
			return true;
		}
		if (firstArray == null || secondArray == null) {
			return false;
		}
		// PLEASE NOTE: we can't compare array lengths due to fact that mega munch would always have 4
		// options out OF 5 since 2 of them under "select one" option(either chicken bites or wings)

		// Sort arrays because order is not important
		firstArray = firstArray.sort((leftEl, rightEl) => leftEl - rightEl);
		secondArray = secondArray.sort((leftEl, rightEl) => leftEl - rightEl);

		for (let i = 0; i < firstArray.length; ++i) {
			if (firstArray[i] !== secondArray[i]) {
				return false;
			}
		}
		return true;
	}

	static isSubArray(array, subArray) {
		if (array.length !== subArray.length) {
			if (array.length === 0) {
				return false
			} else {
				let val;
				array.forEach(item => {
					if (subArray.indexOf(item) > -1) {
						val = true;
					} else {
						val = false;
					}
				});
				return val;
			}

		}
	}


	/**
	 * Sum calories and price
	 */
	static sumPriceAndCalories(firstObj, secondObj, caloriesRange?, isCombo?): PriceCaloriesInterface {

		if (parseInt(firstObj.calories, 10) === firstObj.calories) {
			// Calories are integer
			const firstObjCaloriesToNum = parseInt(firstObj.calories, 10);
			const secondObjCaloriesToNum = parseInt(secondObj.calories, 10);

			// check if base calories 0 and added calories 0
			if (firstObjCaloriesToNum === 0 && secondObjCaloriesToNum === 0) {
				firstObj.calories_label = '';
			} else {
				// for future consideration: we can add calories labels back
				firstObj.calories_label = ' ' + firstObj.calories_label;
			}

			return {
				price: DataUtils.round(firstObj.price + secondObj.price),
				calories: (firstObjCaloriesToNum + secondObjCaloriesToNum).toString() + firstObj.calories_label
			}
		} else {
			// Calories are range as string
			return {
				price: DataUtils.round(firstObj.price + secondObj.price),
				calories: caloriesRange
			}
		}
	}


	static multiplyPriceAndCalories(priceAdnCalories: PriceCaloriesInterface, quantity: number): PriceCaloriesInterface {
		if (typeof (priceAdnCalories.calories) === 'number') {
			return {
				price: priceAdnCalories.price * quantity,
				calories: (priceAdnCalories.calories * quantity).toString()
			}
		} else {
			return {
				price: priceAdnCalories.price * quantity,
				calories: priceAdnCalories.calories
			}
		}
	}


	static isValidKind(king: Kinds): boolean {
		return king in Kinds;
	}


	static isValidHalfHalf(ingredientHalfHalf: string): boolean {
		return ingredientHalfHalf in HalfHalfOptionsEnum;
	}


	static isHalfOption(ingredientHalfHalf: string): boolean {
		return ingredientHalfHalf === HalfHalfOptionsEnum.left || ingredientHalfHalf === HalfHalfOptionsEnum.right;
	}


	static isIngredientTopping(configOptions: JsDataConfigOptions, ingredientCode: string): boolean {
		const selectedConfigOption = configOptions[ingredientCode];
		if (!selectedConfigOption) {
			return false;
		}

		return selectedConfigOption.configuration_id === 'toppings';
	}

	static round(input: number) {
		return Math.round(input * 100) / 100;
	}

	static deepEqual(x, y) {
		return (x && y && typeof x === 'object' && typeof y === 'object') ?
			(Object.keys(x).length === Object.keys(y).length) &&
			Object.keys(x).reduce(function (isEqual, key) {
				return isEqual && DataUtils.deepEqual(x[key], y[key]);
			}, true) : (x === y);
	}
	static sizeOfObject(obj) {
		let size = 0, key;
		for (key in obj) {
			if (obj.hasOwnProperty(key)) {size++}
		}
		return size;
	};
}
