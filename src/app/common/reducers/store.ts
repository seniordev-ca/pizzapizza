// Server models
import {
	StoreServerInterface,
	StoreListServerInterface
} from '../models/server-store';

// Actions
import {
	StoreActions,
	StoreActionsTypes,
} from '../actions/store';
import { AddressInputInterface } from '../models/address-input';

export interface State {
	isLoading: boolean,
	isFetched: boolean,
	serverDelivery: StoreServerInterface,
	serverPickupList: StoreListServerInterface,
	selectedStore: StoreServerInterface,
	isDeliveryTabActive: boolean;
	userInputAddress: AddressInputInterface;
}

export const initialState: State = {
	isLoading: false,
	isFetched: false,
	serverDelivery: null,
	serverPickupList: {},
	selectedStore: null,
	isDeliveryTabActive: true,
	userInputAddress: null
}

/**
 * Store reducer
 */
export function reducer(
	state = initialState,
	action: StoreActions
): State {
	switch (action.type) {
		case StoreActionsTypes.GetDefaultStore: {
			return {
				...state,
				isLoading: true,
				isFetched: false
			};
		}
		case StoreActionsTypes.FetchDefaultStore: {
			return {
				...state,
				isLoading: true,
				isFetched: false
			};
		}
		case StoreActionsTypes.GetDefaultStoreSuccess: {
			return {
				...state,
				isLoading: false,
				isFetched: true,
				selectedStore: action.payload,
				isDeliveryTabActive: action.isDelivery
			}
		}

		case StoreActionsTypes.GetDefaultStoreFailure: {
			return {
				...state,
				isLoading: false,
				isFetched: false
			};
		}

		case StoreActionsTypes.SearchStoreForDelivery: {
			return {
				...state,
				isLoading: true,
				isFetched: false,
			}
		}

		case StoreActionsTypes.SearchStoreForDeliverySuccess: {
			return {
				...state,
				isLoading: false,
				isFetched: true,
				serverDelivery: action.payload,
			}
		}

		case StoreActionsTypes.SearchStoreForDeliveryFailure: {
			return {
				...state,
				isLoading: false,
				isFetched: false
			};
		}
		case StoreActionsTypes.SearchStoreForPickup:
		case StoreActionsTypes.SearchStoreFetchNextPage: {
			return {
				...state,
				isLoading: true,
				isFetched: false,
			}
		}

		case StoreActionsTypes.SearchStoreForPickupSuccess: {
			return {
				...state,
				isLoading: false,
				isFetched: true,
				serverPickupList: action.payload
			}
		}

		/**
		 * Handle pick list pagination. Appends new store list to existing array and updates the cursor
		 */
		case StoreActionsTypes.SearchStoreFetchNextPageSuccess: {
			const existingStores = state.serverPickupList.stores;
			const newPickupList = {
				cursor: action.payload.cursor,
				stores: [...existingStores, ...action.payload.stores]
			}
			return {
				...state,
				isLoading: false,
				isFetched: true,
				serverPickupList: newPickupList
			}
		}
		case StoreActionsTypes.SearchStoreForPickupFailure: {
			return {
				...state,
				isLoading: false,
				isFetched: false,
				serverPickupList: {}
			};
		}

		case StoreActionsTypes.SelectStore: {
			return {
				...state,
				isLoading: false,
				isFetched: true,
				selectedStore: action.payload,
			}
		}

		case StoreActionsTypes.IsDeliveryTabActive: {
			return {
				...state,
				isDeliveryTabActive: action.payload
			}
		}

		case StoreActionsTypes.ClearStoreList: {
			return {
				...state,
				serverPickupList: {},
				serverDelivery: null,
			}
		}

		case StoreActionsTypes.SaveUserInput: {
			const address = action.addressInput.address;
			if (address && !address.formatted_address && address.city) {
				address.formatted_address = address.streetNumber + ' ' + address.streetName + ', ' + address.city + ', ' + address.province;
			}
			return {
				...state,
				userInputAddress: address
			}
		}

		case StoreActionsTypes.SaveUserInputFromCookie: {
			const address = action.addressInput;
			return {
				...state,
				userInputAddress: address
			}
		}

		default: {
			return state
		}
	}
}

export const getIsStoreLoading = (state: State) => {
	return state.isLoading && !state.isFetched;
}

export const getIsStoreError = (state: State) => {
	return !state.isLoading && !state.isFetched;
}

export const getStoreList = (state: State) => {
	if (!state.serverPickupList.stores) {
		return null;
	}
	return state.serverPickupList.stores;
}

export const getStoreListCursor = (state: State) => {
	return state.serverPickupList.cursor
}

export const getSelectedStore = (state: State) => {
	return state.selectedStore;
}

export const getDeliveryStore = (state: State) => {
	return state.serverDelivery;
}

export const getIsDeliveryTabActive = (state: State) => {
	return state.isDeliveryTabActive;
}
