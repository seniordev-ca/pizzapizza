// Angular and ngrx
import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, exhaustMap, catchError, flatMap, filter, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';
import { imageBaseUrls } from '../../../environments/environment';

// Global actions
import {
	AppInitialLoad,
	AppInitialLoadSuccess,
	AppInitialLoadFailed,

	FetchSettings,
	FetchSettingsSuccess,
	FetchSettingsFailure,

	GlobalActionsTypes
} from '../actions/global';

// State
import { State } from '../reducers';

// Store actions
import {
	GetDefaultStore,
	StoreActionsTypes,
	GetDefaultStoreSuccess,
	GetDefaultStoreFailure,
	FetchDefaultStore,
	ShowLocationModal,
	SaveUserInput,
	SaveUserInputFromCookie
} from '../actions/store';

// Store service
import { StoreService } from '../services/store.service';
// Settings actions
import { SettingsService } from '../services/settings.service';
// Sign in/up actions
import {
	GetUserSummary, GetUserSummaryFailure, SignUpActionTypes
} from '../../user/actions/sign-up-actions';
// Club 11 actions
import {
	ShowBecomeMemberSubHeader
} from '../../user/actions/club1111-actions';

// Service
import { AppSettingService } from '../../../utils/app-settings';
import { SignUpService } from '../../user/services/sign-up-service';
import { InitialSDKLoad, SDKActionTypes, InitialSDKLoadSuccess, InitialSDKLoadFailure } from '../actions/sdk';
import { ApplicationHttpClient } from 'utils/app-http-client';
import { StoreServerInterface } from '../models/server-store';
import { Router } from '@angular/router';
import { KumulosActionTypes, LoadKumulosSDK, LoadKumulosSDKFailed, LoadKumulosSDKSuccess, StoreKumulosUserID } from '../actions/kumulos';

@Injectable()
export class GlobalEffects {

	/**
	 * App initial launch
	 */
	@Effect()
	routerTransition = this.actions.pipe(
		ofType('@ngrx/router-store/navigation'),
		filter(routerNavAction => routerNavAction['payload']['event']['id'] === 1),
		map(routerNavAction => new AppInitialLoad())
	)

	/**
	 * Always fetch settings and check default store exist
	 */
	@Effect()
	appInitialLoad = this.actions.pipe(
		ofType(GlobalActionsTypes.AppInitialLoad),
		flatMap(() => this.applicationHttpClient.renewAuthTokenIfRequired('AppInitialLoad').pipe(
			flatMap(appLoadedAction => [new FetchSettings()])
		)),
	)

	/**
	 * Get user details
	 */
	@Effect()
	getUserDetails = this.actions.pipe(
		ofType(GlobalActionsTypes.FetchSettingsSuccess),
		flatMap(appLoadedAction => {
			const returnActions = [];
			returnActions.push(new InitialSDKLoad())

			returnActions.push(new LoadKumulosSDK())
			// we shouldn't get store until settings are loaded
			returnActions.push(new GetDefaultStore())

			if (this.signUpService.tokensExist()) {
				returnActions.push(new GetUserSummary())
			} else {
				returnActions.push(new GetUserSummaryFailure(null))
			}

			return returnActions;
		})
	)

	/**
	 * Fetch settings
	 */
	@Effect()
	fetchSetting = this.actions.pipe(
		ofType(GlobalActionsTypes.FetchSettings),
		exhaustMap((action) => {
			// Replace image URLs
			const isMockImagesEnabled = null;
			// try {
			// 	isMockImagesEnabled = state['dev']['environment']['isMockImageBaseUrl'];
			// } catch (e) {
			// 	console.log(e)
			// }
			return this.settingsService.getAppSetting().pipe(
				map(settings => {
					this.storeService.setGlobalContactLessDeliveryFromLocalStorage(
						'GlobalContactLessDelivery', settings.global_contactless_delivery);
					this.storeService.setGlobalContactLessPickUpFromLocalStorage(
						'GlobalContactLessPickup', settings.global_contactless_pickup);
					let mockImageUrls = null;
					if (isMockImagesEnabled) {
						mockImageUrls = imageBaseUrls;
					}

					return new FetchSettingsSuccess(settings, mockImageUrls);
				}),
				catchError(error => {
					return of(new FetchSettingsFailure());
				})
			)
		})
	)

	/**
	 * SDK Init
	 */
	@Effect()
	initSDK = this.actions.pipe(
		ofType(SDKActionTypes.InitialSDKLoad),
		withLatestFrom(this.store$),
		exhaustMap(([action, state]) => {
			const sdkURL = state.common.settings.data.web_links.sdk;
			return this.settingsService.loadSdk(sdkURL).pipe(
				map(isLoaded => {
					return new InitialSDKLoadSuccess()
				}),
				catchError(error => of(new InitialSDKLoadFailure()))
			)
		})
	)

	/**
	 * Kumulos SDK Init -- dev note: uncommentout the filter if we need to listen to settings config in order to load sdk
	 */
	@Effect()
	initKumulosSDK = this.actions.pipe(
		ofType(KumulosActionTypes.LoadKumulosSDK),
		withLatestFrom(this.store$),
		filter(([action, state]) => {
			const isGlobalPushActive = state.common.settings.data.globalpushactive
			return isGlobalPushActive
		}),
		exhaustMap(([action, state]) => {
			const configKeys = {
				kumulosApiKey: state.common.settings.data.kumulos_api_key,
				kumulosSecretKey: state.common.settings.data.kumulos_secret_key,
				kumulosVapidPublicKey: state.common.settings.data.kumulos_vapid_public_key
			}
			return this.settingsService.loadKumulos(configKeys).pipe(
				map(isLoaded => {
					return new LoadKumulosSDKSuccess()
				}),
				catchError(error => of(new LoadKumulosSDKFailed()))
			)
		})
	)

	/**
	 * Kumulos User ID
	 */
	@Effect()
	initKumulosSDKSuccess = this.actions.pipe(
		ofType(KumulosActionTypes.LoadKumulosSDKSuccess),
		withLatestFrom(this.store$),
		exhaustMap(([action, state]) => {
			return this.settingsService.fetchKumulosId().pipe(
				map(user => {
					this.settingsService.setKumulosIdAsCookie(user)
					return new StoreKumulosUserID(user)
				}),
				catchError(error => of(new LoadKumulosSDKFailed()))
			)
		})
	)

	/**
	 * Check is showing club 11 banner is required.
	 * For logged in user we need to check if use in not already an member
	 */
	@Effect()
	checkIfClubBannerRequired = this.actions.pipe(
		filter(action =>
			action.type === GlobalActionsTypes.FetchSettingsSuccess ||
			action.type === SignUpActionTypes.GetUserSummarySuccess
		),
		withLatestFrom(this.store$),
		filter(([action, state]) => {
			// If local storage has JWT and it is not checked
			const isJwtChecked = !state.user.userLogin.isLoading;
			const isUpdate = action['isUpdate'];

			if (!isUpdate) {
				if (this.signUpService.tokensExist() && !isJwtChecked) {
					return false;
				}
				if (this.userService.isClubBannerShown()) {
					return false;
				} else {
					this.userService.setClubBannerAsShown();
				}
			}

			return !isUpdate;
		}),
		map(() => {
			return new ShowBecomeMemberSubHeader();
		})

	)


	/**
	 * Check local storage if data is there
	 */
	@Effect()
	fetchStoreLocal = this.actions.pipe(
		ofType(StoreActionsTypes.GetDefaultStore),
		withLatestFrom(this.store$),
		flatMap(([action, state]) => {
			const store = this.storeService.getStoreFromLocalStorage('selectedStore');
			const localIsDelivery = this.storeService.getDeliveryTabActiveFromLocalStorage('isDeliveryTabActive');
			const userInputAddress = this.storeService.getUserAddressFromLocalStorage('userAddress')

			const urlStore = state.router.state.params.storeId;
			const urlDeliveryType = state.router.state.params.deliveryType;
			const urlIsDelivery = urlDeliveryType ? urlDeliveryType === 'delivery' : true;
			const isLocalNullOrUndefined = localIsDelivery === undefined || localIsDelivery === null;
			const isDelivery = !isLocalNullOrUndefined ? localIsDelivery : true;

			// if store in local storeage matches url
			const isValidateRequired = urlStore && urlDeliveryType && !(store + '' === urlStore && urlIsDelivery === isDelivery);
			// console.log(isValidateRequired)

			const isLocationModalShown = !(!store || isLocalNullOrUndefined);

			const storeId = !urlStore ? store : urlStore;
			const updateIsDelivery = !urlDeliveryType ? isDelivery : urlIsDelivery;
			const returnActions = []
			returnActions.push(
				new FetchDefaultStore(isLocationModalShown, storeId, updateIsDelivery, isValidateRequired)
			);
			if (urlStore && urlStore !== store + '') {
				returnActions.push(
					new SaveUserInputFromCookie(null)
				)
			} else {
				returnActions.push(
					new SaveUserInputFromCookie(userInputAddress)
				)
			}
			return returnActions;
		})
	)

	@Effect()
	fetchPreviousCartStore = this.actions.pipe(
		ofType(StoreActionsTypes.GetPreviousCartStore),
		withLatestFrom(this.store$),
		map(([action, state]) => {
			const storeId = state.checkout.cart.previousStoreId + '';
			const isDelivery = state.checkout.cart.previousIsDelivery;
			return new FetchDefaultStore(true, storeId, isDelivery, false)
		})
	)

	/**
	 * No default store in local storage,
	 * Fetch it from remote service,
	 * Show Location Modal
	 */
	@Effect()
	fetchStoreRemote = this.actions.pipe(
		ofType(StoreActionsTypes.FetchDefaultStore),
		withLatestFrom(this.store$),
		exhaustMap(([action, state]) => {
			const isDelivery = action['isDelivery'];
			const storeId = action['storeId'];
			const isValidateRequired = action['isValidateRequired'];
			return this.storeService.getDefaultStore(storeId).pipe(
				flatMap(defaultStore => {
					if (!defaultStore.store_id) {
						console.warn('Invalid default store id');
						throw new Error();
					}
					const returnActions = [];
					returnActions.push(new GetDefaultStoreSuccess(defaultStore, isDelivery, isValidateRequired));
					if (!action['isLocationModalShown']) {
						returnActions.push(new ShowLocationModal())
					}
					return returnActions
				}),
				catchError(error => of(new GetDefaultStoreFailure()))
			)
		}
		)
	)

	@Effect({ dispatch: false })
	getStoreRedirect = this.actions.pipe(
		filter(action =>
			action.type === '@ngrx/router-store/navigation' ||
			action.type === StoreActionsTypes.GetDefaultStoreSuccess ||
			action.type === StoreActionsTypes.SelectStore
		),
		withLatestFrom(this.store$),
		filter(([action, state]) => {
			const isInitialLoad = action.type === '@ngrx/router-store/navigation' && !state.common.store.selectedStore
			const params = state.router.state.params;
			const storeId = params ? state.router.state.params.storeId : false;
			const deliveryType = params ? state.router.state.params.deliveryType : false;

			let currentPath = state.router.state.url;
			if (currentPath.indexOf('?') !== -1) {
				currentPath = currentPath.split('?')[0];
			}

			const isConfiguratorRoute = currentPath.startsWith('/catalog/config');
			const isProductListRoute = currentPath.startsWith('/catalog/products');
			const isComboConfigRoute = currentPath.startsWith('/catalog/product-combo');
			const isHomeRoute = currentPath === '/' || currentPath === '/store/' + storeId + '/' + deliveryType;
			const isCachedRoutre = isConfiguratorRoute || isProductListRoute || isComboConfigRoute || isHomeRoute;

			const isStoreIdChanged = !(storeId || deliveryType)
				|| action.type === StoreActionsTypes.SelectStore
				|| action.type === StoreActionsTypes.GetDefaultStoreSuccess;

			return isCachedRoutre && !isInitialLoad && isStoreIdChanged
		}),
		map(([action, state]) => {
			const store = state.common.store.selectedStore;
			const isDelivery = state.common.store.isDeliveryTabActive;
			const userInputAddress = state.common.store.userInputAddress;
			const deliveryString = isDelivery ? 'delivery' : 'pickup';
			const routerParams = state.router.state.params;
			const isConfiguratorRoute = state.router.state.url.startsWith('/catalog/config');
			const isProductListRoute = state.router.state.url.startsWith('/catalog/products');
			const isComboConfigRoute = state.router.state.url.startsWith('/catalog/product-combo');

			let routeBase = '/';
			if (isConfiguratorRoute) {
				routeBase = '/catalog/config';
				const productId = routerParams.singleProductId;
				const cartItemId = routerParams.cartItemId;
				routeBase = cartItemId ? routeBase + '/' + cartItemId + '/' + productId : routeBase + '/' + productId;
			} else if (isProductListRoute) {
				const productSlug = routerParams.productSlug;
				routeBase = '/catalog/products' + '/' + productSlug;
			} else if (isComboConfigRoute) {
				routeBase = '/catalog/product-combo';
				const comboId = routerParams.comboId;
				const cartItemId = routerParams.cartItemId;
				routeBase = cartItemId ? routeBase + '/' + cartItemId + '/' + comboId : routeBase + '/' + comboId;
			}
			this.storeService.setDeliveryTabActiveFromLocalStorage('isDeliveryTabActive', isDelivery)
			this.storeService.setStoreInLocalStorage('selectedStore', store.store_id)
			this.storeService.setUserInputAddressInCookie('userAddress', userInputAddress)



			const queryParams = state.router.state.queryParams || {};
			this.router.navigate([routeBase + '/store', store.store_id, deliveryString], { queryParams })
		})
	)

	/**
	 * We need to update the cookie whenever we set store and are not on a cached related page (unlike the effect above)
	 */
	@Effect({ dispatch: false })
	setStoreCookie = this.actions.pipe(
		filter(action =>
			action.type === StoreActionsTypes.GetDefaultStoreSuccess ||
			action.type === StoreActionsTypes.SelectStore
		),
		withLatestFrom(this.store$),
		filter(([action, state]) => {
			const isInitialLoad = action.type === '@ngrx/router-store/navigation' && !state.common.store.selectedStore
			const params = state.router.state.params;
			const storeId = params ? state.router.state.params.storeId : false;
			const deliveryType = params ? state.router.state.params.deliveryType : false;
			let currentPath = state.router.state.url;
			if (currentPath.indexOf('?') !== -1) {
				currentPath = currentPath.split('?')[0];
			}
			const isConfiguratorRoute = currentPath.startsWith('/catalog/config');
			const isProductListRoute = currentPath.startsWith('/catalog/products');
			const isComboConfigRoute = currentPath.startsWith('/catalog/product-combo');
			const isHomeRoute = currentPath === '/' || currentPath === '/store/' + storeId + '/' + deliveryType;
			const isCachedRoutre = isConfiguratorRoute || isProductListRoute || isComboConfigRoute || isHomeRoute;

			const isStoreIdChanged = !(storeId || deliveryType)
				|| action.type === StoreActionsTypes.SelectStore
				|| action.type === StoreActionsTypes.GetDefaultStoreSuccess;

			return !isCachedRoutre && !isInitialLoad && isStoreIdChanged
		}),
		map(([action, state]) => {
			const store = state.common.store.selectedStore;
			const isDelivery = state.common.store.isDeliveryTabActive;
			const userInputAddress = state.common.store.userInputAddress;

			this.storeService.setDeliveryTabActiveFromLocalStorage('isDeliveryTabActive', isDelivery)
			this.storeService.setStoreInLocalStorage('selectedStore', store.store_id)
			this.storeService.setUserInputAddressInCookie('userAddress', userInputAddress)
		})
	)

	@Effect({ dispatch: false })
	saveUserAddressInCookie = this.actions.pipe(
		ofType(StoreActionsTypes.SaveUserInputFromCookie),
		map(action => {
			this.storeService.setUserInputAddressInCookie('userAddress', action['addressInput'])
		})
	);

	/**
	 * Setting are fetched and default store is present
	 */
	@Effect()
	appInitialLaunchSuccess = this.actions.pipe(
		filter(action =>
			action.type === StoreActionsTypes.GetDefaultStoreSuccess
			|| action.type === GlobalActionsTypes.FetchSettingsSuccess
			|| action.type === SignUpActionTypes.GetUserSummarySuccess
		),
		withLatestFrom(this.store$),
		filter(
			([action, state]) =>
				state.common.settings.isFetched
				&& state.common.store.isFetched
				&& (
					!this.userService.tokensExist()
					|| (this.userService.tokensExist() && state.user.userLogin.isJwtValid)
				)
				&& !action['isUpdate']
		),
		map(action => {
			this.appSettingsService.getServerFontIcons()
			return new AppInitialLoadSuccess()
		})
	)


	/**
	 * Settings or default store failed dispatch error
	 */
	@Effect()
	appInitialLaunchError = this.actions.pipe(
		filter(action =>
			action.type === GlobalActionsTypes.FetchSettingsFailure
			|| action.type === StoreActionsTypes.GetDefaultStoreFailure
		),
		map(action => new AppInitialLoadFailed())
	)

	constructor(
		private actions: Actions,
		private store$: Store<State>,
		private settingsService: SettingsService,
		private signUpService: SignUpService,
		private storeService: StoreService,
		private appSettingsService: AppSettingService,
		private userService: SignUpService,
		private applicationHttpClient: ApplicationHttpClient,
		private router: Router
	) { }
}
