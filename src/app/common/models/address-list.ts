import { AddressInputInterface } from './address-input';

/**
 * Defines actions that can be taken on saved addresses
 */
enum UserSavedAddressesActionsEnum {
	onSelect,
	onSetDefault,
	onEdit,
	onDelete
}

/*
/** Interface that defines actions that can be made on saved addresses
 */
interface UserSavedAddressesEmitterInterface {
	action: UserSavedAddressesActionsEnum,
	addressId: number
}

/**
 * Enum for address type
 */
enum AddressTypeEnum {
	Home = 'Home',
	University = 'University'
}

/**
 * Enum for phone types
 */
enum PhoneTypeEnum {
	Home = 'Home',
	Mobile = 'Mobile'
}

interface AddressListInterface {
	addressId?: number | string,
	title?: string,
	address: AddressInputInterface,
	addressString?: string,
	type?: AddressTypeEnum,
	unitNumber?: string,
	unitBuzzer?: string,
	entrance?: string,
	contactInfo?: {
		phoneNumber?: string,
		type?: PhoneTypeEnum,
		extension?: string
	},
	university?: string,
	building?: string,
	buildingEntrance?: string,
	isDefault?: boolean,
	date?: string,
	time?: string,
	deliveryIntructions?: string,
	isSaved?: boolean,
	firstName?: string,
	lastName?: string,
	email?: string
}

interface GoogleAddressComponent {
	long_name: string,
	short_name: string,
	types: string[]
}

interface ServerAddressObject {
	province: string,
	city: string,
	street_address: string,
	street_number: string
	postal_code?: string,
	address_components?: GoogleAddressComponent[]
}

export {
	AddressListInterface,
	UserSavedAddressesActionsEnum,
	UserSavedAddressesEmitterInterface,
	AddressTypeEnum,
	PhoneTypeEnum,
	GoogleAddressComponent,
	ServerAddressObject
}
