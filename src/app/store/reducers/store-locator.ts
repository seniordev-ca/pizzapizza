// Server models
import {
	StoreListServerInterface, StoreItemServerInterface, ServerStoreCitiesListItem,
} from '../../common/models/server-store'
// Actions
import {
	StoreLocatorActions,
	StoreLocatorActionsTypes,
} from '../actions/store-locator';
import { AddressInputInterface } from '../../common/models/address-input';
import { UIStoreCitiesListItem } from 'app/common/models/store-list';

export interface State {
	isLoading: boolean,
	isFetched: boolean,
	storeLocatorResults: StoreListServerInterface,
	userSearch: AddressInputInterface,
	storeDetails: StoreItemServerInterface,
	storeCityList: UIStoreCitiesListItem[],
	province: string,
	city: string,
	otherProvinces: string[],
	otherCities: string[],
}

export const initialState: State = {
	isLoading: false,
	isFetched: false,
	storeLocatorResults: {},
	userSearch: null,
	storeDetails: null,
	storeCityList: null,
	province: null,
	city: null,
	otherProvinces: null,
	otherCities: null,
}

/**
 * Settings reducer
 */
export function reducer(
	state = initialState,
	action: StoreLocatorActions
): State {
	switch (action.type) {
		case StoreLocatorActionsTypes.StoreLocatorSearch: {
			const userSearch = action.payload;
			return {
				...state,
				userSearch
			}
		}
		case StoreLocatorActionsTypes.StoreLocatorSearchSuccess: {
			return {
				...state,
				isLoading: false,
				isFetched: true,
				storeLocatorResults: action.payload
			}
		}

		/**
		 * Handle pick list pagination. Appends new store list to existing array and updates the cursor
		 */
		case StoreLocatorActionsTypes.StoreLocatorSearchFetchNextPageSuccess: {
			const existingStores = state.storeLocatorResults.stores;
			const newPickupList = {
				cursor: action.payload.cursor,
				stores: [...existingStores, ...action.payload.stores]
			}
			return {
				...state,
				isLoading: false,
				isFetched: true,
				storeLocatorResults: newPickupList
			}
		}
		case StoreLocatorActionsTypes.StoreLocatorSearchFailure: {
			return {
				...state,
				isLoading: false,
				isFetched: true,
				storeLocatorResults: {}
			};
		}
		case StoreLocatorActionsTypes.FetchStoreDetails: {
			return {
				...state,
				storeLocatorResults: {},
				userSearch: null
			}
		}
		case StoreLocatorActionsTypes.FetchStoreDetailsSuccess: {
			const response = action.payload;
			const storeDetails = response.stores[0];
			return {
				...state,
				storeDetails
			}
		}
		case StoreLocatorActionsTypes.ClearStoreLocatorList: {
			return {
				...state,
				isLoading: false,
				isFetched: false,
				province: action.province,
				city: action.city,
				storeLocatorResults: {},
				userSearch: null,
				storeDetails: null
			}
		}

		case StoreLocatorActionsTypes.FetchStoreCityListSuccess: {
			const storeCityList = action.payload;
			const mappedCityList = storeCityList.sort((a, b) => b.cities.length - a.cities.length).map(list => {
				const groupedCities = [];
				const columnSize = 16;
				const cityList = list.cities.map(city => {
					return {
						city: city.city,
						citySlug: city.city_slug
					}
				})
				const sortedCities = cityList.slice().sort((a, b) => {
					// sorting alphabetically
					const nameA = a.city.toLowerCase(), nameB = b.city.toLowerCase();
					if (nameA < nameB) { // sort string ascending
						return -1;
					}
					if (nameA > nameB) {
						return 1;
					}
					return 0; // default return value (no sorting)
				});

				for (let i = 0; i < sortedCities.length; i += columnSize) {
					groupedCities.push(sortedCities.slice(i, i + columnSize));
				}

				return {
					province: list.province,
					provinceSlug: list.province_slug,
					columns: groupedCities,
					cityList
				} as UIStoreCitiesListItem
			})
			return {
				...state,
				storeCityList: mappedCityList
			}
		}

		default: {
			return state
		}
	}
}

export const isFetched = (state: State) => {
	return state.isFetched && !state.isLoading
}

export const getStoreLocatorList = (state: State) => {
	let stores = state.storeLocatorResults.stores;
	if (state.storeDetails && stores) {
		stores = stores.filter(store => state.storeDetails.store_id !== store.store_id);
	}
	return stores;
}

export const getStoreLocatorListCursor = (state: State) => {
	return state.storeLocatorResults.cursor
}

export const isStoreListEmpty = (state: State) => {
	return !state.storeLocatorResults.stores || state.storeLocatorResults.stores.length < 1;
}
