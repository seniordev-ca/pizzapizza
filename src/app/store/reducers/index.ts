import {
	createSelector,
	createFeatureSelector,
	ActionReducerMap,
} from '@ngrx/store';
import * as fromStoreLocatorReducer from './store-locator';
import * as fromRootReducer from '../../root-reducer/root-reducer';

// Define combined store model for module
export interface StoreLocatorState {
	storelocator: fromStoreLocatorReducer.State;
}

// Combine store with global store
export interface State extends fromRootReducer.State {
	storelocator: StoreLocatorState;
}

// Combine reducer for not lazy module
export const reducers: ActionReducerMap<StoreLocatorState> = {
	storelocator: fromStoreLocatorReducer.reducer
};

// Define reducer selector
export const selectStoreLocatorState = createFeatureSelector<StoreLocatorState>('storelocator');

/**
 * Selectors for store
 */
export const selectStoreSettingStatus = createSelector(
	selectStoreLocatorState,
	(state: StoreLocatorState) => state.storelocator,
);

export const getStoreLocatorList = createSelector(
	selectStoreSettingStatus,
	fromStoreLocatorReducer.getStoreLocatorList
)
export const getStoreLocatorCursor = createSelector(
	selectStoreSettingStatus,
	fromStoreLocatorReducer.getStoreLocatorListCursor
)
export const isStoreListEmpty = createSelector(
	selectStoreSettingStatus,
	fromStoreLocatorReducer.isStoreListEmpty
)
export const isStoreListFetched = createSelector(
	selectStoreSettingStatus,
	fromStoreLocatorReducer.isFetched
)
export const getUserInputAddress = createSelector(
	selectStoreLocatorState,
	(state: StoreLocatorState) => state.storelocator.userSearch
)
export const getStoreDetails = createSelector(
	selectStoreLocatorState,
	(state: StoreLocatorState) => state.storelocator.storeDetails
)
export const getStoreCityList = createSelector(
	selectStoreLocatorState,
	(state: StoreLocatorState) => state.storelocator.storeCityList
)
export const getSimilarProvinces = createSelector(
	selectStoreLocatorState,
	(state: StoreLocatorState) => {
		if (!state.storelocator.storeCityList) {
			return [];
		}
		return state.storelocator.storeCityList
			.filter(list => list.province !== state.storelocator.province);
	}
)
export const getSimilarCities = createSelector(
	selectStoreLocatorState,
	(state: StoreLocatorState) => {
		let otherProvinces = [];
		const otherCities = [];
		const cityList = state.storelocator.storeCityList;
		const province = state.storelocator.province;
		const city = state.storelocator.city;

		const selectedProvince = cityList.find(list => list.province === province);
		otherProvinces = cityList.filter(list => list.province !== province);
		selectedProvince.cityList
			.filter(column => column.city !== city)
			.forEach(otherCity => {
				if (otherCities.length < 4) {
					otherCities.push({
						...otherCity,
						provinceSlug: selectedProvince.provinceSlug
					})
				}
			})
		return otherCities;
	}
)
