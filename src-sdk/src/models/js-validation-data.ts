/**
"js_data": {
		"kind": "combo", // it will always be single or combo until we feel the need for other variations
		"products": [
			{
				"line_id": 1, // To bind with product from config
				"group_id": 1,
				"product_options": { // Base price for single ONLY,
					"<product_option_id_1>": {
						"base_price": 23,
						"calories": 23,
						"selection_rule": "<enum=Exact/ExactPlus/No>"
					},
					"<product_option_id_2>": {
						"base_price": 34,
						"calories": 45,
						"selection_rule": "<enum=Exact/ExactPlus/No>"
					}
				},
				"configuration_options": {
					"DO": { // [0][0]   entry code
						"configuration_id": "veggie",
						"product_options": {
							"<product_option_id>": {
								"included_quantity": 2, // [5][0] quantity that doesn't lower the price if taken off
								"product_code": "LRG-DO", //  [1][0]    product code
								"price": '<price_monetary_value>', // [7][0] price of the item
								"calories": '<calories_monetary_value>' // Calories from config
							}
						}
					}
				},
				"configurations": {
					"toppings": {
						"included_quantity": 1, // [2][i] included quantity "please add 2 more choices"
						"maximum_quantity": 2,  // [3][0] maximum quantity of the product,
						"is_required": true,    // [4][0]  mandatory Indicator : Y or N,
						"name": {
							"english": "TOPPINGS",
							"french": "FRENCH TOPPINGS"
						}
					}
				}
			}
		],
		"combo": [
			{
				"combo_id": 9000, // will be used by backend
				"product_option_ids": [111, 222, 333], // these will be product option ids
				"base_price": 7.99
			},
			{
				"combo_id": 9001,
				"product_option_ids": [444, 555, 666],
				"base_price": 8.99
			},
			{
				"combo_id": 9002,
				"product_option_ids": [777, 888, 999],
				"base_price": 9.99
			}
		]
	}
 */

import {
	Kinds,
	SelectionRules
} from './interactor';

export interface JsDataConfigOptionsObj {
	max_quantity: number
	configuration_id: string
	product_options: {
		[optionId: number]: {
			product_code: string
			included_quantity: number
			is_premium: boolean
			premium_included_price: number
			price: number
			calories: number
			same_topping_max_count: number
		}
	}
}


export interface JsDataConfigOptions {
	[entryCode: string]: JsDataConfigOptionsObj
}

export interface JsDataProductOptions {
	[productOptionId: string]: {
		base_price: number
		calories: number
		calories_label?: string
		calories_range: string
		is_calories_static: boolean
		selected?: boolean
		selection_rule: SelectionRules
		size: number
		size_name: JsDataLanguageInterface
		tax_rule: string,
		grouped_products: {
			line_id: number,
			product_option: number
		}
	}
}

export interface JsDataSubConfigurationInterface {
	[subConfig: string]: {
		included_quantity: number
		maximum_quantity: number
		is_required: boolean
		name: {
			[lang: string]: string
		}
	}
}

export interface JsDataProductInterface {
	allow_customization?: boolean,
	line_id: number
	group_id: number
	is_pizza: boolean
	is_twin: boolean
	product_options: JsDataProductOptions
	configuration_options: JsDataConfigOptions
	configurations: JsDataSubConfigurationInterface
	sequence: number,
	subconfiguration_options: {
		[index: string]: {
			calories: number,
			parent_id: string,
			subconfiguration_id: string
		}
	}
}

export interface JsDataLanguageInterface {
	[lang: string]: string
}
export interface JsDataCombinationsInterface {
	base_price: number
	calories: number
	calories_range: JsDataLanguageInterface,
	calories_label?: {
		[lang: string]: string
	}
	combo_id: number
	is_calories_static: boolean
	name: {
		default: JsDataLanguageInterface,
		web: JsDataLanguageInterface
	}
	product_option_ids: number[]
	tax_rule: string
}

export interface JsDataSizeSelectionsInterface {
	[productOptionId: string]: {
		base_price: number
		calories: number
		calories_label?: {
			[lang: string]: string
		}
		calories_range: JsDataLanguageInterface
		is_calories_static: boolean
		selected?: boolean
	}
}

export interface JsDataComboInterface {
	combinations: JsDataCombinationsInterface[]
	size_selections: JsDataSizeSelectionsInterface
}

export interface JsDataNewComboInterface {
	base_price: number,
	calories_line_id: number,
	calories_range: {
		[lang: string]: string
	}
	groups_selection: {
		[key: number]: number
	},
	name: {
		default: {
			[lang: string]: string
		}
	}
	product_code: string,
	tax_rule: string
}

export interface JsDataInterface {
	kind: Kinds
	product_id: string
	products: JsDataProductInterface[]
	combo: JsDataComboInterface
	new_combo: JsDataNewComboInterface
}
