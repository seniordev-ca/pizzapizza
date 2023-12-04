import {
	GoogleAddressComponent, AddressTypeEnum, PhoneTypeEnum, ServerAddressObject
} from '../../common/models/address-list';
import { ServerPaymentRequestInterface } from '../../user/models/server-models/server-saved-cards-interfaces';

export interface ServerOrderPaymentInterface {
	payment_type: ServerOrderPaymentTypeEnum
	offline_payment_type?: ServerOrderOfflinePaymentType,
	payment_data?: ServerPaymentRequestInterface,
}
export interface ServerProcessOrderRequest extends ServerOrderPaymentInterface {
	store_id: number,
	phone_number: {
		phone_number: string,
		type: PhoneTypeEnum,
		extension: string
	},

	is_pickup_order?: boolean,
	delivery_instructions?: string,
	guest_user?: {
		first_name: string,
		last_name: string,
		email: string
	},
	address_id?: number | string,
	address?: {
		entrance_specs?: string,
		address_type: AddressTypeEnum,
		address_components?: GoogleAddressComponent[],
		saved: boolean,
		phone_number?: {
			phone_number: string,
			type: PhoneTypeEnum,
			extension: string
		},
		address_name?: string,
		apartment_number?: string,
		legacy_address_id?: number,
		street_number_ext?: string,
		security_code?: string,
		id?: number,
		address?: ServerAddressObject
		building_key?: string,
		university_code?: string
	},
	split_order?: true,
	future_order_time?: {
		date: string,
		time: string
	}
}

/**
 * Offline Payment Type Enum
 */
export enum ServerOrderOfflinePaymentType {
	Cash = 'Cash',
	Credit = 'Credit',
	Debit = 'Debit',
	Club = 'Club-11-11'
}

/**
 * Order Payment Type
 */
export enum ServerOrderPaymentTypeEnum {
	MealCard = 'MealCard',
	Offline = 'Offline',
	VisaCheckout = 'VisaCheckout',
	Credit = 'Credit',
	MasterCard = 'MasterCard'
}
