import { ServerProductConfig } from '../../catalog/models/server-product-config';
import { ServerCartResponseInterface } from '../../checkout/models/server-cart-response'

/**
 * Different types of coupon responses
 */
export enum ServerCouponResponseTypeEnum {
	Config = 'Config',
	Cart = 'Cart'
}
export interface ServerCouponRequestInterface {
	coupon_code: string,
	is_delivery: boolean,
	store_id: number
}
export interface ServerCouponResponseInterface {
	coupon_key: string,
	read: string,
	config?: ServerProductConfig,
	cart?: ServerCartResponseInterface
}

export interface ServerCouponWalletResponse {
	cursor: string,
	coupons: ServerCouponItem[]
}

/**
 * Coupon Status Enum
 */
export enum ServerCouponStatusEnum {
	Expiring = 'expiring soon',
	Expired = 'expired',
	Active = 'active'
}
export interface ServerCouponItem {
	coupon_id: string,
	coupon_code: string,
	expiry_date: string,
	name: string,
	image: string,
	description: string,
	status: ServerCouponStatusEnum,
	tag: string
}
