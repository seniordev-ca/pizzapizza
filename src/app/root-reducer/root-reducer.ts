import {
	ActionReducerMap,
	ActionReducer,
	MetaReducer,
	createSelector,
	createFeatureSelector
} from '@ngrx/store';
import * as fromRouter from '@ngrx/router-store';

import { RouterStateUrl } from '../../utils/app-redux-router';

// Global reducers
// Common (auth and selected store)
import { CommonState } from '../common/reducers';
// Catalog
import {
	CatalogState,
	catalogCombinedReducers
} from '../catalog/reducers';
// User
import {
	UserState,
	userCombinedReducers
} from '../user/reducers';
// Checkout and cart
import {
	CheckoutState,
	cartCombinedReducer
} from '../checkout/reducers';

import {
	ComboRootMapper
} from './mapper/combo-root.mapper';


import {
	ComboConfigGroup,
	ComboConfigDetails
} from '../catalog/models/combo-config';

/**
 * Every reducer module's default export is the reducer function itself. In
 * addition, each module should export a type or interface that describes
 * the state of the reducer plus any selector functions. The `* as`
 * notation packages up all of the exports into a single object.
 */

/**
 * Our state is composed of a map of action reducer functions.
 * These reducer functions are called with each dispatched action
 * and the current or initial state and return a new immutable state.
 */

export const reducers: ActionReducerMap<State> = {
	router: fromRouter.routerReducer,
	common: null,
	catalog: catalogCombinedReducers,
	user: userCombinedReducers,
	checkout: cartCombinedReducer
};
export interface State {
	router: fromRouter.RouterReducerState<RouterStateUrl>,
	common: CommonState,
	catalog: CatalogState,
	user: UserState,
	checkout: CheckoutState
}

/**
 * REDUX logger
 */
export function logger(reducer: ActionReducer<State>): ActionReducer<State> {
	return function (state: State, action): State {

		// console.log('\n ----------->')
		// console.log('state', state);
		// console.log('action', action);

		return reducer(state, action);
	};
}

export const selectRouterState = createFeatureSelector<fromRouter.RouterReducerState<RouterStateUrl>>('router');

export const getRouterHistory = createSelector(
	selectRouterState,
	(state: fromRouter.RouterReducerState<RouterStateUrl>) => {
		return state.state.history
	}
)

/**
 * By default, @ngrx/store uses combineReducers with the reducer map to compose
 * the root meta-reducer. To add more meta-reducers, provide an array of meta-reducers
 * that will be composed to form the root meta-reducer.
 */

// TODO use real env picker
const isProduction = false;

export const metaReducers: MetaReducer<State>[] = !isProduction
	? [logger]
	: [];

/**
 * Selector below is mutating this array for virtual DOM
 */
let currentComboId = null;
let comboProductGroups: ComboConfigGroup[] = [] as ComboConfigGroup[];

/**
 * Get combo product details and add to cart button state
 */
export const getComboProductDetails = (state: State): ComboConfigDetails => {

	// Check if all slices required for mapper are loaded
	const isComboPageLoaded =
		state.common.settings.isFetched &&
		state.catalog.comboConfig.isFetched &&
		state.common.sdk.isFetched &&
		state.checkout.cart.addToCartRequest

	const isSdkProductSameAsActive =
		state.common.sdk.activeSlug === state.catalog.comboConfig.activeProductSlug;

	if (!isComboPageLoaded || !isSdkProductSameAsActive) {
		currentComboId = null;
		comboProductGroups = [] as ComboConfigGroup[];
		return ComboRootMapper.getEmptyComboDetails();
	}

	const isComboEditMode = state.catalog.comboConfig.isEditMode;

	const currentComboSlug = state.catalog.comboConfig.activeProductSlug;
	const comboServerConfig = state.catalog.comboConfig.entities[currentComboSlug];
	const comboAddToCartRequest = state.checkout.cart.addToCartRequest;
	const sdkValidation = state.common.sdk.sdkResponse;
	const baseUrls = state.common.settings.data.web_links.image_urls;
	const isComboAddingToCart = state.checkout.cart.isLoading;
	const isComboPristine = state.catalog.comboConfig.isComboPristine;

	const comboDetail = ComboRootMapper.parseComboDetails(
		comboServerConfig,
		comboAddToCartRequest,
		sdkValidation,
		baseUrls,
		isComboEditMode,
		isComboAddingToCart,
		isComboPristine
	);

	// Logic for flushing virtual DOM mutating array
	if (currentComboId !== comboDetail.id) {
		comboProductGroups = [] as ComboConfigGroup[];
		currentComboId = comboDetail.id;
	}
	return comboDetail;
}

/**
 * Following selector is taking raw combo response, add to cart
 * request and SDK validation state to build a combo product list
 */
export const getComboProductConfiguration = (state: State) => {

	// Check if all slices required for mapper are loaded
	const isComboPageLoaded =
		state.common.settings.isFetched &&
		state.catalog.comboConfig.isFetched;
	if (!isComboPageLoaded) {
		return ComboRootMapper.getEmptyComboGroupedProduct();
	}

	const currentComboSlug = state.catalog.comboConfig.activeProductSlug;
	const comboServerConfig = state.catalog.comboConfig.entities[currentComboSlug];
	const comboAddToCartRequest = state.checkout.cart.addToCartRequest;
	const sdkValidation = state.common.sdk.sdkResponse;
	const baseUrls = state.common.settings.data.web_links.image_urls;

	const updatedComboGroupedProduct = ComboRootMapper.parseComboGroupedProduct(
		comboServerConfig,
		comboAddToCartRequest,
		sdkValidation,
		baseUrls
	);

	if (comboProductGroups.length === 0) {
		// Assign
		comboProductGroups = updatedComboGroupedProduct;
	} else {
		// Or mutate only field which could changes
		comboProductGroups.forEach((comboGroup, groupIndex) => {
			const newProduct = updatedComboGroupedProduct[groupIndex];
			// console.log(comboProductGroups[groupIndex])
			comboProductGroups[groupIndex].validationMsg = newProduct.validationMsg;
			comboProductGroups[groupIndex].products.forEach((productUnderGroup, productIndex) => {
				const newProductData = newProduct.products[productIndex];
				// Mutate ONLY following fields
				productUnderGroup.isSelected = newProductData.isSelected;
				productUnderGroup.subText = newProductData.subText;
				productUnderGroup.description = newProductData.description;
				productUnderGroup.isQuantitySelectionAllowed = newProductData.isQuantitySelectionAllowed;
				productUnderGroup.quantity = newProductData.quantity;
				productUnderGroup.isMaxReached = newProductData.isMaxReached;
				productUnderGroup.name = newProductData.name;

			})
		});
	}

	return comboProductGroups
}
