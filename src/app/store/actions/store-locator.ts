import { Action } from '@ngrx/store';
import {
	StoreListServerInterface, ServerStoreCitiesListItem
} from '../../common/models/server-store';
import {
	AddressInputInterface
} from '../../common/models/address-input';
/**
 * Application entry point
 * App settings fetch actions
 */
export enum StoreLocatorActionsTypes {

	StoreLocatorSearch = '[StoreLocator](Store) Search For Stores via Store Locator',
	StoreLocatorSearchSuccess = '[StoreLocator](Store)Search For Stores via Store Locator Success',
	StoreLocatorSearchFailure = '[StoreLocator](Store) Search For Stores via Store Locator Failure',
	StoreLocatorSearchFetchNextPage = '[StoreLocator](Store) Search For Stores via Store Locator Next Page',
	StoreLocatorSearchFetchNextPageSuccess = '[StoreLocator](Store) Search For Stores via Store Locator Next Page Success',
	ClearStoreLocatorList = '[StoreLocator](Store) Clear Store Locator List',

	FetchStoreDetails = '[StoreLocator](Store) Get Details Of Store Via ID',
	FetchStoreDetailsSuccess = '[StoreLocator](Store) Fetch Store Via ID Success',
	FetchStoreDetailsFailure = '[StoreLocator](Store) Fetch Store Via ID Failed',

	FetchStoreCityList = '[StoreLocator](Store) Fetch Store City List',
	FetchStoreCityListSuccess = '[StoreLocator](Store) Fetch Store City List Success',
	FetchStoreCityListFailure = '[StoreLocator](Store) Fetch Store City List Failure'
}

export class StoreLocatorSearch implements Action {
	readonly type = StoreLocatorActionsTypes.StoreLocatorSearch
	constructor(public payload: AddressInputInterface, public cursor?: string) { }
}
export class StoreLocatorSearchSuccess implements Action {
	readonly type = StoreLocatorActionsTypes.StoreLocatorSearchSuccess
	constructor(public payload: StoreListServerInterface) { }
}
export class StoreLocatorSearchFailure implements Action {
	readonly type = StoreLocatorActionsTypes.StoreLocatorSearchFailure
}
export class StoreLocatorSearchFetchNextPage implements Action {
	readonly type = StoreLocatorActionsTypes.StoreLocatorSearchFetchNextPage
}
export class StoreLocatorSearchFetchNextPageSuccess implements Action {
	readonly type = StoreLocatorActionsTypes.StoreLocatorSearchFetchNextPageSuccess
	constructor(public payload: StoreListServerInterface) { }
}
export class ClearStoreLocatorList implements Action {
	readonly type = StoreLocatorActionsTypes.ClearStoreLocatorList
	constructor(public province: string, public city: string) { }
}
export class FetchStoreDetails implements Action {
	readonly type = StoreLocatorActionsTypes.FetchStoreDetails
	constructor(public id: number) { }
}
export class FetchStoreDetailsSuccess implements Action {
	readonly type = StoreLocatorActionsTypes.FetchStoreDetailsSuccess
	constructor(public payload: StoreListServerInterface) { }
}
export class FetchStoreDetailsFailure implements Action {
	readonly type = StoreLocatorActionsTypes.FetchStoreDetailsFailure
}
export class FetchStoreCityList implements Action {
	readonly type = StoreLocatorActionsTypes.FetchStoreCityList
}
export class FetchStoreCityListSuccess implements Action {
	readonly type = StoreLocatorActionsTypes.FetchStoreCityListSuccess
	constructor(public payload: ServerStoreCitiesListItem[]) { }
}
export class FetchStoreCityListFailure implements Action {
	readonly type = StoreLocatorActionsTypes.FetchStoreCityListFailure
}

/**
 * REDUX Actions for the whole application
 */
export type StoreLocatorActions =
	| StoreLocatorSearch
	| StoreLocatorSearchSuccess
	| StoreLocatorSearchFailure
	| StoreLocatorSearchFetchNextPage
	| StoreLocatorSearchFetchNextPageSuccess
	| ClearStoreLocatorList
	| FetchStoreDetails
	| FetchStoreDetailsFailure
	| FetchStoreDetailsSuccess
	| FetchStoreCityList
	| FetchStoreCityListSuccess
	| FetchStoreCityListFailure
