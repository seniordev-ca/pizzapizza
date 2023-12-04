/**
 * Product kinds
 */
export enum ProductKinds {
	single = 'single',
	combo = 'combo',
	single_configurable_combo = 'single_configurable_combo',
	twin = 'twin'
}

/**
 * Product Option Size Codes
 */
export enum ProductOptionSizeCodes {
	small = 'SML',
	medium = 'MED',
	large = 'LRG',
	xlarge = 'EX'
}
export interface ServerProductConfig {
	product_id: string,
	seo_title: string,
	kind: ProductKinds,
	js_data: string,
	is_coupon_item: boolean,
	data: {
		combo: {
			image: string,
			combo_item_info: string,
			name: string,
			groups: ServerComboGroup[],
			description: string
		},
		products: ServerProductConfigProduct[]
	}
}
export interface ServerComboGroup {
	group_image: string,
	child_items: [
		number
	],
	group_title: string,
	sequence: number,
	allow_multiple_items: boolean,
	max_selection: number
}
export interface ServerProductConfigProduct {
	product_id: string,
	image: string,
	name: string,
	description: string,
	is_flat: boolean,
	sequence: number,
	allow_customization: boolean,
	configuration_options: ServerConfigOptions[],
	configurations: [
		{
			id: string,
			title: string,
			font_key: string,
			not_available: [number],
			selected: boolean,
			allow_none: { // TODO check this structure
				title: object
			},
			sequence: number,
			sub_configurations: [
				{
					id: string,
					title: string,
					not_available: [number],
					allow_half_and_half: boolean,
					allow_multiple_options: boolean,
					sequence: number,
					personalized_message: {
						display_personalized_message: boolean
						personalized_template_id: number
					}
				}
			]
		}
	],
	product_options: {
		options: [
			{
				id: number,
				selected: boolean,
				size_code: ProductOptionSizeCodes,
				size_label: string,
				size_name: string,
				sub_title: string,
				title: string,
				base_price: number,
				cal_count: number,
				cal_scale: string,
				font_key: string,
				grouped_products: {
					line_id: number,
					product_option: number
				},
				sequence: number,
				image: string,
				same_topping_limit: number
			}
		],
		label: string
	},
	sub_configuration_options: [
		{
			id: number,
			config_options_ids: [string],
			sub_configuration_id: string,
			not_available: [number],
			sequence: number,
			options: [
				{
					font_key: string,
					product_code: string,
					selected: boolean,
					title: string
				}
			]
		}
	],
	is_quantity_selector_allowed: boolean,
	is_pizza?: boolean,
	seo_title?: string,
	root_id?: string,
	kind?: string,
	extra_products?: ServerProductConfigProduct[],
	line_id?: number,
	validation_msg?: string,
	isNotApplicable?: boolean,
	isMaxReached?: boolean
}

export interface ServerConfigOptions {
	id: string,
	cal_scale: string,
	description: string,
	image: string,
	not_available: [number],
	parent_id: string,
	quantity: number,
	tag: string, // TODO
	title: string,
	product_options_data: [
		{
			cal_count: number,
			product_option_id: number,
			selected: true,
			sequence: number
		}
	],
	sequence: number,
	is_premium: boolean,
	is_dip_on_wings: boolean,
	// TODO -- once backend is ready to support this it should no longer be optional
	is_gluten?: boolean,
	overlay_sequence: number
}

export interface ServerPersonalizedTemplateResponse {
	id: number,
	header_text: string,
	custom_message: {
		allow_custom_message: boolean,
		custom_message_limit: number,
		label: string
	},
	messages: ServerPersonalizedTemplateMessageInterface[]
}

export interface ServerPersonalizedTemplateMessageInterface {
	message: string,
	default: boolean
}
