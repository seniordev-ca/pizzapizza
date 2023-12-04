import { HalfHalfOptionsEnum } from '../../catalog/components/configurator/options-list/options-list.component'
import { StoreServerInterface } from '../../common/models/server-store';
import { ServerValidationDetails, ValidateErrorCodeEnum } from '../../common/models/server-validation-error';
// import { FutureHoursResponse } from './server-process-order-response';


interface ServerSubConfigOption {
	config_code: string,
	is_valid: boolean,
	name: string
}
interface ServerCartResponseConfigOptions {
	config_code: string,
	direction: HalfHalfOptionsEnum,
	is_valid: true,
	is_gluten: boolean,
	is_premium: boolean,
	name: string,
	quantity: number,
	subconfig_option?: ServerSubConfigOption
}

interface ServerCartResponseProductInterface {
	product_id: string,
	product_option_id: number,
	base_price: number,
	name: string,
	is_valid: boolean,
	quantity: number,
	seo_title?: string,
	allow_customization?: boolean
}

interface ServerCartResponseProductListInterface extends ServerCartResponseProductInterface {
	cart_item_id: number,
	price: number,
	image: string,
	line_id: number,
	child_items: ServerCartResponseProductListInterface[],
	config_options: [
		ServerCartResponseConfigOptions
	],
	kind: CartItemKindEnum,
	coupon_key?: string,
	allow_qty_selection?: boolean,
	personalized_message: {
		message_to: string,
		message_from: string,
		message: string
	},
	is_alcohol: boolean,
	is_food: boolean,
	product_code: string,
	invalid_reason: boolean,
	description: string
}

interface ServerCartResponseInterface {
	store_id: number,
	is_delivery: boolean,
	contactless: boolean,
	updated_on: string,
	order_summary: {
		discounted_subtotal: number,
		total: number,
		order_components: [{
			label: string,
			sort_id: number,
			value: number,
			code?: string
		}],
		redemption_components: [{
			label: string,
			sort_id: number,
			value: number
		}],
		loyalty: {
			amount: number,
			is_redeemed: boolean
		}
	},
	products: [
		ServerCartResponseProductListInterface
	],
	coupon: {
		coupons: ServerCartCouponItemInterface[],
		is_valid: boolean
	}
	surcharge_val: number,
	is_surcharge_added: boolean,
	is_valid: boolean,
	club_11_11_earnings?: {
		club1111_nonregistered: string,
		club1111_registered: string
	},
	last_item_id?: number,
	error?: ServerValidationDetails,
	is_age_verified: boolean,
	has_alcohol: boolean,
	tips?: ServerCartTipsInterface
}
interface ServerCartTipsInterface {
	tip_type: TipTypeEnum,
	tip_value: number
}
interface ServerCartCouponItemInterface {
	state: string,
	message: string,
	coupon_code: string
}
interface ServerCartValidationInterface {
	products?: [
		ServerCartResponseProductListInterface
	],
}
interface ServerCartStoreValidationInterface extends ServerCartValidationInterface {
	store: StoreServerInterface,
	error?: ServerValidationDetails,
	contactless_error: boolean,
	previous_is_delivery: boolean,
	previous_store_id: number
}

/**
 * Cart Item Kind Enum
 */
enum CartItemKindEnum {
	Combo = 'combo',
	Single = 'single',
	Twin = 'twin',
	SingleConfigurable = 'single_configurable_combo',
	Coupon = 'coupon',
	Club11 = 'club_11_11',
	GiftCard = 'gift_card'
}

/**
 * Tip Type Enum
 */
enum TipTypeEnum {
	Amount = 'amount',
	Percentage = 'percentage'
}

/**
 * Used for partial cart validation
 */
function isValidationOk(errorCode?: ValidateErrorCodeEnum) {
	if (!errorCode) {
		return true
	}
	return errorCode !== ValidateErrorCodeEnum.store_not_available
		&& errorCode !== ValidateErrorCodeEnum.store_closed
}

/**
 * Checks if a store is closed
 */
function isValidationStoreClosed(errorCode?: ValidateErrorCodeEnum) {
	if (!errorCode) {
		return false
	}
	return errorCode === ValidateErrorCodeEnum.store_closed
}

export {
	ServerCartResponseProductInterface,
	ServerCartResponseProductListInterface,
	ServerCartResponseConfigOptions,
	ServerCartResponseInterface,
	ServerCartStoreValidationInterface,
	ServerCartValidationInterface,
	CartItemKindEnum,
	ServerCartTipsInterface,
	TipTypeEnum,
	isValidationOk,
	isValidationStoreClosed,
}
