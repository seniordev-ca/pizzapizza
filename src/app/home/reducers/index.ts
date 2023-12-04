import {
	createSelector,
	createFeatureSelector,
	ActionReducerMap,
} from '@ngrx/store';

import * as fromRootReducer from '../../root-reducer/root-reducer';
import * as fromBanner from './banner';
import * as fromHomeCategories from './home-categories';

// Define combined store model for module
export interface HomeState {
	banner: fromBanner.State,
	homeCategories: fromHomeCategories.State
}

// Combine store with global store
export interface State extends fromRootReducer.State {
	home: HomeState;
}

// Combined reducer
export const reducers: ActionReducerMap<HomeState> = {
	banner: fromBanner.reducer,
	homeCategories: fromHomeCategories.reducer
};

// Define reducer selector
export const selectCommonState = createFeatureSelector<HomeState>('home');

/**
 * Banner selectors
 */
export const selectBanner = createSelector(
	selectCommonState,
	(state: HomeState) => state.banner
)

export const getBannerLoading = createSelector(
	selectBanner,
	fromBanner.getIsBannerLoading
)

export const getBannerError = createSelector(
	selectBanner,
	fromBanner.getIsBannerError
)

export const selectBannerEntities = createSelector(
	selectBanner,
	(banners) => banners.entities
)

export const getBannerIds = createSelector(
	selectBanner,
	fromBanner.getIds
)

export const getBannerList = createSelector(
	selectBanner,
	(banners) => banners.uiBanners
)


/* Category Selectors */
export const selectHomeCategoriesState = createSelector(
	selectCommonState,
	(state: HomeState) => state.homeCategories
)
export const getAllCategories = createSelector(
	selectHomeCategoriesState,
	// fromHomeCategorie.getAllCategories
	(state) => state.viewHomeCat
)
