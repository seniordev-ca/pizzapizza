// import { UserCreditCardsInterface } from '../../user/models/user-credit-cards';


/**
 * Defines actions that can be taken on saved pick up locations
 */
enum UserSavedPickupLocationsActionsEnum {
	onSelect,
	onSetDefault,
	onDelete,
	onCloseModal
}

/*
/** Interface that defines action that can be made on saved pick up locations
 */
interface UserSavedPickupLocationsEmitterInterface {
	action: UserSavedPickupLocationsActionsEnum,
	storeId: number
}

/*
/** Interface that defines data in each store list
 */
interface StoreListInterface {
	storeId: number,
	storeAddress: string,
	postalCode: string,
	city: string,
	province: string,
	marketPhoneNumber: string,
	distance?: number,
	imageName?: string,
	intersection?: string,
	operationHours?: {
		weekend: string,
		weekday: string
	}
	isDefault?: boolean,
	deleteDisplay?: boolean,
	setDefaultDisplay?: boolean,
	isTemp?: boolean
}

interface UIStoreCitiesListItem {
	province: string,
	provinceSlug: string,
	columns: [{
		city: string,
		citySlug: string
	}][],
	cityList: [{
		city: string,
		citySlug: string
	}]
}

export {
	StoreListInterface,
	UserSavedPickupLocationsEmitterInterface,
	UserSavedPickupLocationsActionsEnum,
	UIStoreCitiesListItem
}
