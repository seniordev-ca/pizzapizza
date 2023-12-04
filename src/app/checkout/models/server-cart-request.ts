import { HalfHalfOptionsEnum } from '../../catalog/models/configurator';
import { GoogleAddressComponent, ServerAddressObject } from '../../common/models/address-list';
/**
 * Enum for cart checkout type
 */
enum CheckoutTypeEnum {
	delivery = 'delivery',
	pickup = 'pickup'
}

/**
 * Enum for Add To Cart Item Source
 */
enum AddToCartItemSourceEnum {
	menu = 'menu',
	repeatOrder = 'repeat-order',
	justForYou = 'just-for-you',
	pizzaAssistant = 'pizza-assistant',
	myPizzas = 'my-pizzas',
	recommendations = 'recommendation',
}

interface AddCartProductServerConfigOption {
	config_code: string,
	quantity: number
	direction?: HalfHalfOptionsEnum,
	sub_config_option?: string
}

interface AddCartProductServerRequestInterface {
	product_id?: string,
	quantity?: number,
	config_options: AddCartProductServerConfigOption[],
	product_option_id?: number,
	cart_item_id?: number,
	line_id?: number,
	personalized_message?: {
		message_to: string,
		message: string,
		message_from: string
	}
	store_id?: number,
	is_delivery?: boolean,
}

interface AddToCartProductServerRequestInterface extends AddCartProductServerRequestInterface {
	coupon_key?: string,
	child_items?: AddCartProductServerRequestInterface[]
}
interface AddCartServerRequestInterface {
	store_id?: number,
	is_delivery?: boolean,
	products: AddToCartProductServerRequestInterface[]
}

interface UpdateQunatityCartServerRequestInterface {
	cart_item_id: number,
	quantity: number
}

interface GetCartServerRequestInterface {
	is_delivery: boolean,
	store_id: number,
	remove_invalid: boolean
}

interface FutureHoursRequestInterface {
	type?: CheckoutTypeEnum
	store_id?: number,
	address?: ServerAddressObject,
	address_components?: GoogleAddressComponent[],
	cart_has_alcohol: boolean
}
interface ValidateStoreInterface extends FutureHoursRequestInterface {
	building_key?: string,
	order_time?: {
		date: string, // yyyy-mm-dd
		time: string
	},
	is_delivery: boolean,
	contactless?: boolean,
	is_address_complete?: boolean,

}

export {
	AddCartProductServerConfigOption,
	AddCartProductServerRequestInterface,
	AddToCartProductServerRequestInterface,
	AddCartServerRequestInterface,
	UpdateQunatityCartServerRequestInterface,
	GetCartServerRequestInterface,
	FutureHoursRequestInterface,
	ValidateStoreInterface,
	CheckoutTypeEnum,
	AddToCartItemSourceEnum
}
