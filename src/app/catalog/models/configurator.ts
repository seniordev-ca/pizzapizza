/**
 * States for add to cart button
 */
export enum addToCartBtnEnum {
	active = 'active',
	notActive = 'notActive',
	loading = 'loading',
	added = 'added',

	update = 'update',
	updateSuccess = 'updateSuccess',

	nextComboProduct = 'next',
	nextTwin = 'nextTwin'
}

/**
 * States for Product Config
 */
export enum comboProductComponentStateEnum {
	notConfigured,
	configured
}
/**
 * Defines a selection mode for product tab
 */
export enum OptionTabModeEnum {
	notConfigurable,
	empty,
	dropDown,
	incrementor
}

/**
 * Value for half half selector
 */
export enum HalfHalfOptionsEnum {
	left = 'left',
	right = 'right',
	center = 'whole'
}

export interface OptionSummary {
	text: string,
	direction: HalfHalfOptionsEnum,
	quantity: number,
	additionalInfo?: string
}

export interface OptionsDropDown {
	id: string,
	options: [
		{
			fontKey: string,
			title: string,
			isSelected: boolean,
			id: string,
			sequence: number
		}
	]
}

export interface OptionTabsInterface {
	id: string,
	parentId: string,
	name: string,
	productImage: string,
	ingredientsOverlayImage: string,
	calText: string,
	quantity: number,
	tag: string,
	// Indicates if option has half/half selector
	allowHalfAndHalf?: boolean,
	halfHalfOption: HalfHalfOptionsEnum,
	// Defines presentation of option
	optionMode: OptionTabModeEnum,
	selected: boolean,
	// Indicates in option is currently visible based on filters
	isVisible: boolean,
	// Indicates is option is available for that product size
	isAvailableForProduct: boolean,
	allowMultiSelect: boolean,
	// Drop down sub options
	optionDropDown?: OptionsDropDown,

	// Used for more optimized updating when configurator selection changes
	serverCopy: {
		not_available: [number],
		product_options_data: [{
			cal_count: number,
			product_option_id: number,
			selected: boolean
		}]
	},
	sequence?: number,
	isMaxQuantityReached?: boolean,
	isPremium: boolean,
	isDipOnWings: boolean,
	isSmallOnly: boolean,
	isMediumOnly: boolean,
	isGluten?: boolean,
	zIndex: number
}
