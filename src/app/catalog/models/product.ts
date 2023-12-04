
import { OptionSummary } from './configurator';
import {
	CartItemKindEnum,
	ServerCartResponseConfigOptions,
	ServerCartResponseProductListInterface
} from '../../checkout/models/server-cart-response';
import { SdkUpsizingResponse } from './server-sdk';
export interface Product {
	id: string,
	name: string,
	image: string,
	description: string,
	cardId?: number,
	hasFullWidthImage?: boolean,
	sequence?: number,
	quantity?: number,
	isSelected?: boolean,
	priceText?: {
		labels: string,
		priceValue: number
	};
	calText?: {
		calValue: string,
		calScale: string
	},
	marketingBadge?: {
		text: string,
		color: string,
		fontKey: string,
	};
	hasAllergens?: boolean,
	isCustomizationAllowed?: boolean,
	isQuantitySelectionAllowed?: boolean,
	isQuantityIncrementerDisplayed?: boolean,
	isAddableToCartWithoutCustomization?: boolean,
	isQuickAddAllowed?: boolean,
	isComboProduct?: boolean,
	seoTitle?: string,
	subText?: OptionSummary[] | string,
	isPizza?: boolean,
	isTwinProduct?: boolean,
	isCoupon?: boolean,
	lineId?: number,
	isValid?: boolean,
	isLoading?: boolean,
	isCartEditingProduct?: boolean,
	isNotApplicable?: boolean,
	validationMsg?: string,
	isMaxReached?: boolean,
	isConfigOption?: boolean,
	isForceSelected?: boolean,
	kind?: CartItemKindEnum,
	upSizing?: SdkUpsizingResponse,
	isPersonalMessageApplied?: boolean,
	pizzaId?: string,
	pizzaAssistantLabel?: string,
	pizzaAssistantDescription?: string,
	productTag?: string,
	defaultSiblingProductOption?: {
		line_id: number,
		product_option: number
	},
	cartConfig?: ServerCartResponseConfigOptions[],
	cartItemChildren?: ServerCartResponseProductListInterface[],
	cartIncludes?: string
}

export interface ProductValidationInterface {
	maxProductQuantity: number
}
