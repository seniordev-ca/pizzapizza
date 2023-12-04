import { ServerAddressResponse } from '../../user/models/server-models/server-account-interfaces';
import { ServerPhoneNumberInterface } from '../../user/models/server-models/server-user-registration-input';

export interface MpRedirectUrl {
	html_response: string,
	redirect_url: string
}

export interface MpEncodeCheckout {
	encoded_order_key: string
}

// TODO import checkout payload
export interface MpDecodeCheckoutSuccess {
	address: ServerAddressResponse,
	phone_number: ServerPhoneNumberInterface,
	address_id: number,
	delivery_instructions: string,
	future_order_time: {
		date: string, // yyyy-mm-dd
		time: string
	},
	guest_user: {
		email: string
		first_name: string
		last_name: string
	},
	is_pickup_order: boolean,
	offline_payment_type: string, // use enum,
	payment_data: {},
	payment_type: string, // use enum,
	split_order: string,
	store_id: number,
	address_str?: string
}

