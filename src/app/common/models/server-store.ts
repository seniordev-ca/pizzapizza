import { ServerAddressObject } from './address-list';

export interface StoreServerInterface {
	province: string,
	city: string,
	store_id: number,
	postal_code: string,
	address: string,
	market_phone_number: string,
	lat: number,
	lng: number,
	is_address_deliverable: boolean,
	delivery_city: string,
	payments: SeverStorePaymentInterface,
	store_message: string,
	store_age_verification: string
}

export interface SeverStorePaymentInterface {
	debit_charge_applied: true
	atdoor_credit: null
	atdoor_debit: true
	atdoor_pizzacard: null
	delivery_cashless: true
	pickup_cashless: true
	online_credit: true
	online_debit: true
	online_max_payment: 0
	online_payments: false
	online_pizzacard: true
}
export interface ServerSimilarAddressInterface {
	city: string;
	province: string;
	street_name: string;
}
export interface StoreServerInputInterface {
	latitude: number,
	address_components: [
		{
			long_name: string,
			types: [
				string
			],
			short_name: string
		}
	],
	longitude: number,
	address: ServerAddressObject
}

export interface StoreListServerInterface {
	cursor?: string,
	stores?: Array<StoreItemServerInterface>,
	sub_label_text?: string,
	store_id_for_menu?: number
}

export interface StoreItemServerInterface extends StoreServerInterface {
	operating_hours?: [
		{
			start_time: string,
			day_name: string,
			end_time: string,
			label: string
		}
	],
	is_online?: boolean,
	pickup_available?: boolean,
	image_name?: string,
	longitude?: number,
	latitude?: number,
	is_open?: boolean,
	distance?: number,
	delivery_available?: boolean,
	is_express?: boolean,
	name?: string,
	default_store?: boolean,
	province_slug?: string,
	city_slug?: string
}

export interface StoreListError {
	message: string,
	errors: {
		location_not_deliverable: string,
		similar_address?: ServerSimilarAddressInterface[]
	},
	request_id: string
}

export interface ServerStoreCitiesListItem {
	cities: [
		{
			city: string,
			city_slug: string
		}
	],
	province: string,
	province_slug: string
}
