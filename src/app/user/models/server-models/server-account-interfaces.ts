import {
	AddressTypeEnum,
	PhoneTypeEnum,
	GoogleAddressComponent,
	ServerAddressObject
} from '../../../common/models/address-list';

export interface ServerAddressResponse {
	id?: number,
	phone_number: {
		phone_number: string,
		type?: PhoneTypeEnum,
		extension?: string
	},
	apartment_number: string,
	entrance_specs: string,
	address_type: AddressTypeEnum,
	province?: string,
	city?: string,
	street_address?: string,
	street_number?: string,
	postal_code?: string,
	street_number_ext: string,
	address_name: string,
	security_code: string
	legacy_address_id?: number,
	saved: boolean,
	default_address?: boolean,
	address_components: GoogleAddressComponent[],
	building_key?: string,
	university_code?: string
	address?: ServerAddressObject,
	formatted_address?: string
}

export interface ServerUpdateAddressResponse {
	Success: boolean,
}
