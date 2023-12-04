import {
	createSelector,
	createFeatureSelector,
	ActionReducerMap,
} from '@ngrx/store';
import * as fromSettingsReducer from './settings';
import * as fromStoreReducer from './store';
import * as fromRootReducer from '../../root-reducer/root-reducer';
import * as fromUniversity from './university';
import * as fromSDK from './sdk';
import * as fromCoupons from './coupons';
import * as fromCouponWallet from './coupon-wallet';
import * as fromRecommendations from './recommendations';

import { UniversityListInterface } from '../models/university-list';

// Define combined store model for module
export interface CommonState {
	settings: fromSettingsReducer.State;
	store: fromStoreReducer.State;
	university: fromUniversity.State;
	sdk: fromSDK.State;
	coupons: fromCoupons.State
	couponWallet: fromCouponWallet.State
	recommendations: fromRecommendations.State
}

// Combine store with global store
export interface State extends fromRootReducer.State {
	common: CommonState;
}

// Combine reducer for not lazy module
export const reducers: ActionReducerMap<CommonState> = {
	settings: fromSettingsReducer.reducer,
	store: fromStoreReducer.reducer,
	university: fromUniversity.reducer,
	sdk: fromSDK.reducer,
	coupons: fromCoupons.reducer,
	couponWallet: fromCouponWallet.reducer,
	recommendations: fromRecommendations.reducer

};

// Define reducer selector
export const selectCommonState = createFeatureSelector<CommonState>('common');


/**
 * Selectors for settings
 */
export const selectAppSetting = createSelector(
	selectCommonState,
	(state: CommonState) => state.settings,
);

export const getSettingLoadState = createSelector(
	selectAppSetting,
	fromSettingsReducer.getIsSettingLoading
);

export const getSettingError = createSelector(
	selectAppSetting,
	fromSettingsReducer.getIsSettingError
);

export const selectEnvironments = createSelector(
	selectCommonState,
	(state) => state.settings.data.base_urls
);

export const selectMockHeaders = createSelector(
	selectCommonState,
	(state) => state.settings.data.mock_headers
);

export const selectIsVisaClickToPay = createSelector(
	selectCommonState,
	(state) => state.settings.data && state.settings.data.global_visa_clicktopay
)

export const getGlobalCalorieDisclaimer = createSelector(
	selectCommonState,
	(state) => {
		if (state.store.selectedStore && state.store.selectedStore.province !== 'ON') {
			return null;
		}
		return state.settings.data ? state.settings.data.static_text.calorie_global_disclaimer : null
	}
)

export const getConfigCalorieDisclaimer = createSelector(
	selectCommonState,
	(state) => {
		if (state.store.selectedStore && state.store.selectedStore.province !== 'ON') {
			return null;
		}
		return state.settings.data ? state.settings.data.static_text.calorie_config_disclaimer : null
	}
)

export const getAppLinks = createSelector(
	selectAppSetting,
	(settings) => {
		const iTunes = settings.data ? settings.data.app_upgrade.i_tunes_url : null;
		const googlePlay = settings.data ? settings.data.app_upgrade.google_play_url : null;
		const links = {
			iTunes,
			googlePlay
		};
		return links;
	}
)

export const getLearnMoreLink = createSelector(
	selectAppSetting,
	(settings) => {
		const learnMore = settings.data ? settings.data.web_links.club_11_11 : null;

		return learnMore;
	}
)

/**
 * Selectors for store
 */
export const selectStoreSettingStatus = createSelector(
	selectCommonState,
	(state: CommonState) => state.store,
);

export const getStoreList = createSelector(
	selectStoreSettingStatus,
	fromStoreReducer.getStoreList
);

export const getSelectedStore = createSelector(
	selectStoreSettingStatus,
	fromStoreReducer.getSelectedStore
)

export const getSelectedTab = createSelector(
	selectStoreSettingStatus,
	fromStoreReducer.getIsDeliveryTabActive
)

export const getStoreLoadState = createSelector(
	selectStoreSettingStatus,
	fromStoreReducer.getIsStoreLoading
)

export const getDeliveryStore = createSelector(
	selectStoreSettingStatus,
	fromStoreReducer.getDeliveryStore
)

export const getPickUpStoreCursor = createSelector(
	selectStoreSettingStatus,
	fromStoreReducer.getStoreListCursor
)

export const getUserInputAddress = createSelector(
	selectCommonState,
	(state) => {
		const isFindMe = state.settings.isLocationModalFindMe;
		const storeState = state.store;
		let addressString = null
		if (storeState.userInputAddress && storeState.userInputAddress.addressString) {
			addressString = storeState.userInputAddress.addressString
		} else if (storeState.userInputAddress && storeState.userInputAddress.formatted_address) {
			addressString = storeState.userInputAddress.formatted_address;
		} else if (storeState.userInputAddress && (storeState.userInputAddress.address && storeState.userInputAddress.address.street_number)) {
			addressString = storeState.userInputAddress.address.street_number + ' ' + storeState.userInputAddress.address.street_address
				+ ', ' + storeState.userInputAddress.address.city + ', ' + storeState.userInputAddress.address.province
		}

		return isFindMe ? null : addressString;
	}
)

export const getIsAddressComplete = createSelector(
	selectStoreSettingStatus,
	(state) => {
		const isDelivery = state.isDeliveryTabActive;
		if (!isDelivery) {
			return true;
		}
		let addressComponents = null
		if (state.userInputAddress && state.userInputAddress.address) {
			addressComponents = state.userInputAddress.address.address_components
		} else if (state.userInputAddress && state.userInputAddress.address_components) {
			addressComponents = state.userInputAddress.address_components
		}
		let placeTypes = [];
		if (addressComponents) {
			addressComponents.forEach(component => {
				placeTypes = placeTypes.concat(component.types)
			})
			const minimumRequirements = ['street_number'];
			return minimumRequirements.filter(min => placeTypes.indexOf(min) > -1).length > 0;
		} else if (state.userInputAddress && (state.userInputAddress.streetNumber || state.userInputAddress.address.street_number)) {
			return true;
		} else {
			return false;
		}
	}
)

export const getIsLocationModalFromCheckout = createSelector(
	selectCommonState,
	(state) => state.settings.isLocationModalFromCheckout
)

export const getIsLocationModalFindMe = createSelector(
	selectCommonState,
	(state) => state.settings.isLocationModalFindMe
)

export const getFooterMenu = createSelector(
	selectCommonState,
	(state) => state.settings.footerMenu
)

export const getLegalMenu = createSelector(
	selectCommonState,
	(state) => state.settings.legalMenu
)

export const getSocialLinks = createSelector(
	selectCommonState,
	(state) => state.settings.data ? state.settings.data.web_links.social : null
)

/**
 * Selectors For Univeristies
 */
export const getUniversities = createSelector(
	selectCommonState,
	(state) => state.university.universityList
)
export const getUniversitiesWithMealCard = createSelector(
	selectCommonState,
	(state) => {
		const universities: UniversityListInterface[] = state.university.universityList;

		if (universities) {
			const filteredList = universities.filter(university => university.value === null);
			return filteredList.concat(universities
				.filter(university => university.mealCard && university.mealCard.isEnabled)
				.map(universityValid => {
					return {
						mealCard: universityValid.mealCard,
						label: universityValid.label,
						value: universityValid.value,
						mealKey: universityValid.mealKey,
						code: universityValid.value,
					} as UniversityListInterface
				}))
		}
		return null;
	}
)
export const getBuildingList = createSelector(
	selectCommonState,
	(state) => state.university.buildingList
)

/**
 * Selectors For Coupons
 */
export const getIsCouponValid = createSelector(
	selectCommonState,
	(state) => {
		if (state.coupons.isCouponValid !== null) {
			return state.coupons.isCouponValid;
		}
	}
)

export const getIsCouponAdded = createSelector(
	selectCommonState,
	(state) => {
		if (state.coupons.isCouponAdded !== null) {
			return state.coupons.isCouponAdded;
		}
	}
)
export const getCouponValidationMsg = createSelector(
	selectCommonState,
	(state) => {
		if (state.coupons.couponErrorMsg !== null) {
			return state.coupons.couponErrorMsg
		}
	}
)
export const selectCouponEntities = createSelector(
	selectCommonState,
	(state) => state.couponWallet.entities
)

export const getCouponIds = createSelector(
	selectCommonState,
	(state) => state.couponWallet.ids
)

export const selectCouponWallet = createSelector(
	selectCommonState,
	(state: CommonState) => state.couponWallet,
);

export const getCouponWallet = createSelector(
	selectCouponEntities,
	getCouponIds,
	(entities, ids) => {
		return ids.map(id => entities[id]);
	}
)

export const getIsCouponWalletLoading = createSelector(
	selectCouponWallet,
	fromCouponWallet.getIsCouponWalletLoading
)

export const getCouponWalletCursor = createSelector(
	selectCommonState,
	(state) => state.couponWallet.couponWalletCursor
)

export const getCouponWalletToCartError = createSelector(
	selectCommonState,
	(state) => {
		return state.couponWallet.isCouponValid && state.couponWallet.isCouponValid !== null ? null : state.couponWallet.couponErrorMsg
	}
)

export const getRecommendations = createSelector(
	selectCommonState,
	(state: CommonState) => state.recommendations.recommendations
)
export const getRecommendationsLoadingState = createSelector(
	selectCommonState,
	(state: CommonState) => {
		const isLoading = state.recommendations.isLoading;
		const isFetched = state.recommendations.isFetched;
		const productRecommendations = state.recommendations.recommendations
		return isLoading && !isFetched && !productRecommendations
	}
)

export const getDeepLinkCoupon = createSelector(
	selectCommonState,
	(state: CommonState) => state.couponWallet.deeplinkCoupon
)

export const getKumulosId = createSelector(
	selectCommonState,
	(state: CommonState) => state.settings.kumulosUserId
)

export const getZendDeskEnable = createSelector(
	selectCommonState,
	(state: CommonState) => state.settings.data ? state.settings.data.ZendDeskEnable : false
)

