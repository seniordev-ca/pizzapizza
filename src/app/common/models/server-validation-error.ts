import { ServerAddressObject } from './address-list';

/**
 * Possible error codes
 */
export enum ValidateErrorCodeEnum {
	store_not_available = 'store_not_available',
	store_closed = 'store_closed',
	invalid_items = 'invalid_items',
	food_required = 'food_required',
	alcohol_age_verification = 'alcohol_age_verification',
	price_changed = 'price_changed',
	delivery_charges = 'delivery_charges',
	beer_store_closed = 'beer_store_closed'
}


/**
 * Cart GET, POST and cart validate validation model
 */
export interface ServerValidationDetails {
	error_code: ValidateErrorCodeEnum,
	error_msg: string,
	error_title: string,
}

export interface ServerValidationError {
	message: string,
	errors?: {
		delivery_store?: string,
		coupon_code?: string,
		location_not_deliverable?: string,
		profile_pic?: string,
		last_name?: string,
		gift_card?: string,
		club11?: {
			optin?: string,
			is_new_card?: string,
			loyalty_card?: {
				number: string,
				pin: string
			},
			address?: ServerAddressObject,
			address_components?: string,
		},
		contact_number?: {
			phone_number: string,
			type: string,
			extension: string
		},
		lang_preference?: string,
		optin_pp_promotions?: string,
		first_name?: string,
		optin_club11_promotions?: string,
		date_of_birth?: string,
		password?: string,
		email?: string,
		address_required?: string,
		loyalty_token?: string,
		card_error: string,
		store_closed?: boolean,
		not_available?: boolean,
		address?: string,
		transfer_balance?: string,
		bambora_profile_payment?: string,
	},
request_id: string
}
