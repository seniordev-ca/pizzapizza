import { Action } from '@ngrx/store';
import {
	StoreServerInterface,
	StoreListServerInterface,
	StoreListError
} from '../models/server-store';
import {
	AddressInputInterface
} from '../models/address-input';
import { AddressListInterface } from '../models/address-list';
/**
 * Application entry point
 * App settings fetch actions
 */
export enum StoreActionsTypes {
	GetDefaultStore = '[Common](Store) Get Store',
	GetDefaultStoreSuccess = '[Common](Store) Get Store Success',
	GetDefaultStoreFailure = '[Common](Store) Get Store Failure',
	FetchDefaultStore = '[Common](Store) Fetch Store From API',

	SearchStoreForDelivery = '[Common](Store) Search For Delivery Stores',
	SearchStoreForDeliverySuccess = '[Common](Store) Search For Delivery Success',
	SearchStoreForDeliveryFailure = '[Common](Store) Search For Delivery Failure',

	SearchStoreForPickup = '[Common](Store) Store Search For Pickup',
	SearchStoreForPickupSuccess = '[Common](Store) Store Search For Pickup Success',
	SearchStoreForPickupFailure = '[Common](Store) Store Search For Pickup Failure',
	SearchStoreFetchNextPage = '[Common](Store) Store Search For Pickup Next Page',
	SearchStoreFetchNextPageSuccess = '[Common](Store) Store Search For Pickup Next Page Success',
	SearchStoreFetchNextPageFailure = '[Common](Store) Store Search For Pickup Next Page Failure',

	SelectStore = '[Common](Store) Select Store',
	IsDeliveryTabActive = '[Common](Store) Delivery/Pickup Tab Toggle',
	ShowLocationModal = '[Common](Store) Show Location Modal',
	ClearLocationModalStates = '[Common](Store) Clear Location Modal States',
	ClearStoreList = '[Common](Store) Clear Store List',
	SaveUserInput = '[Common](Store) Save User Input',
	SaveUserInputFromCookie = '[Common](Store) Save User Input From Cookie',
	SaveUserInputFromDefaultAddress = '[Common](Store) Save User Input From Default Address',

	GetPreviousCartStore = '[Common](Store) Get Previous Cart Store'
}

export class GetDefaultStore implements Action {
	readonly type = StoreActionsTypes.GetDefaultStore;
}

export class GetDefaultStoreSuccess implements Action {
	readonly type = StoreActionsTypes.GetDefaultStoreSuccess;
	constructor(
		public payload: StoreServerInterface,
		public isDelivery: boolean,
		public isValidateRequired: boolean,
		public userInput?: AddressInputInterface,
	) { }
}

export class GetDefaultStoreFailure implements Action {
	readonly type = StoreActionsTypes.GetDefaultStoreFailure;
}

export class GetPreviousCartStore implements Action {
	readonly type = StoreActionsTypes.GetPreviousCartStore
}
export class SearchStoreForDelivery implements Action {
	readonly type = StoreActionsTypes.SearchStoreForDelivery
	constructor(public payload: AddressInputInterface) { }
}

export class SearchStoreForDeliverySuccess implements Action {
	readonly type = StoreActionsTypes.SearchStoreForDeliverySuccess
	constructor(public payload: StoreServerInterface) { }
}

export class SearchStoreForDeliveryFailure implements Action {
	readonly type = StoreActionsTypes.SearchStoreForDeliveryFailure
	constructor(public error: StoreListError, public formattedAddress?: string) { }
}

export class SearchStoreForPickup implements Action {
	readonly type = StoreActionsTypes.SearchStoreForPickup
	constructor(public payload: AddressInputInterface, public cursor?: string) { }
}
export class SearchStoreForPickupSuccess implements Action {
	readonly type = StoreActionsTypes.SearchStoreForPickupSuccess
	constructor(public payload: StoreListServerInterface, public formattedAddress?: string) { }
}
export class SearchStoreForPickupFailure implements Action {
	readonly type = StoreActionsTypes.SearchStoreForPickupFailure
}
export class SearchStoreFetchNextPage implements Action {
	readonly type = StoreActionsTypes.SearchStoreFetchNextPage
	constructor(public payload: AddressInputInterface, public cursor?: string) { }
}
export class SearchStoreFetchNextPageSuccess implements Action {
	readonly type = StoreActionsTypes.SearchStoreFetchNextPageSuccess
	constructor(public payload: StoreListServerInterface) { }
}
export class SearchStoreFetchNextPageFailure implements Action {
	readonly type = StoreActionsTypes.SearchStoreFetchNextPageFailure
}
export class SelectStore implements Action {
	readonly type = StoreActionsTypes.SelectStore
	constructor(public payload: StoreServerInterface, public userInputAddress?: AddressInputInterface) { }
}

export class FetchDefaultStore implements Action {
	readonly type = StoreActionsTypes.FetchDefaultStore;
	constructor(
		public isLocationModalShown: boolean,
		public storeId: string,
		public isDelivery: boolean,
		public isValidateRequired: boolean
	) { }
}

export class IsDeliveryTabActive implements Action {
	readonly type = StoreActionsTypes.IsDeliveryTabActive
	constructor(public payload: boolean) { }
}

export class ShowLocationModal implements Action {
	readonly type = StoreActionsTypes.ShowLocationModal
	constructor(public isFindMe?: boolean, public isFromCheckout?: boolean) {}
}

export class ClearLocationModalStates implements Action {
	readonly type = StoreActionsTypes.ClearLocationModalStates
}

export class ClearStoreList implements Action {
	readonly type = StoreActionsTypes.ClearStoreList
}

export class SaveUserInput implements Action {
	readonly type = StoreActionsTypes.SaveUserInput
	constructor(
		public addressInput: AddressListInterface,
		public isDelivery: boolean,
		public isContactLessSelected: boolean,
		public isStrictValidation: boolean,
		public store?: StoreServerInterface,
		public isFutureOrder?: boolean,
		public isMPRedirect?: boolean
	) { }
}

export class SaveUserInputFromCookie implements Action {
	readonly type = StoreActionsTypes.SaveUserInputFromCookie
	constructor(
		public addressInput: AddressInputInterface,
	) { }
}

export class SaveUserInputFromDefaultAddress implements Action {
	readonly type = StoreActionsTypes.SaveUserInputFromDefaultAddress
	constructor(
		public addressInput: AddressListInterface,
	) { }
}
/**
 * REDUX Actions for the whole application
 */
export type StoreActions =
	| GetDefaultStore
	| GetDefaultStoreSuccess
	| GetDefaultStoreFailure
	| SearchStoreForDelivery
	| SearchStoreForDeliverySuccess
	| SearchStoreForDeliveryFailure
	| SearchStoreForPickup
	| SearchStoreForPickupSuccess
	| SearchStoreForPickupFailure
	| SearchStoreFetchNextPage
	| SearchStoreFetchNextPageSuccess
	| SearchStoreFetchNextPageFailure
	| SelectStore
	| FetchDefaultStore
	| IsDeliveryTabActive
	| ShowLocationModal
	| ClearStoreList
	| SaveUserInput
	| GetPreviousCartStore
	| SaveUserInputFromCookie
	| ClearLocationModalStates
	| SaveUserInputFromDefaultAddress
