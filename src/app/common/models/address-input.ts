import { GoogleAddressComponent, ServerAddressObject } from './address-list';

export interface AddressInputInterface {
	address_components?: GoogleAddressComponent[],
	latitude?: number,
	longitude?: number,
	address?: ServerAddressObject
	addressString?: string,
	formatted_address?: string,
	streetNumber?: string,
	streetName?: string,
	city?: string,
	province?: string,
	postalCode?: string,
	/**
	 *  TODO Investigate the inconsistentcy here and why some forms return address.address.address_components
	 * where others address.address_components
	 */
	// address?: {
	// 	address_components: GoogleAddressComponent[]
	// }
}
