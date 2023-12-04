// Angular and ngrx
import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, catchError, mergeMap, flatMap, withLatestFrom, filter } from 'rxjs/operators';
import { of } from 'rxjs';

import { State } from '../../root-reducer/root-reducer';

// Store actions
import {
	SearchStoreForDeliveryFailure,
	SearchStoreForDeliverySuccess,
	SearchStoreForPickupSuccess,
	SearchStoreForPickupFailure,
	StoreActionsTypes,
	IsDeliveryTabActive,
	SearchStoreFetchNextPageSuccess,
	SearchStoreFetchNextPageFailure,
	SaveUserInputFromCookie
} from '../actions/store';

// Services
import {
	StoreService
} from '../services/store.service';
import { ApplicationHttpClient } from '../../../utils/app-http-client';

// Actions
import { ReloadCategories } from '../../catalog/actions/category';
import { ReloadFeatureSlides } from '../../catalog/actions/featured-products';
import { ReloadProductList } from '../../catalog/actions/product-list';
import { ReloadComboConfig } from '../../catalog/actions/combo-config';
import { ReloadProductConfig } from '../../catalog/actions/configurator';
import { ReloadJustForYou } from '../../catalog/actions/just-for-you';
import { ReloadBanner } from '../../home/actions/banner';
import { ReloadMyPizzaList } from 'app/catalog/actions/my-pizzas';
import { SignUpActionTypes } from 'app/user/actions/sign-up-actions';
import { RequestAccountDefaultAddress } from 'app/user/actions/account-actions';
import { CartActionsTypes, ValidateCart } from 'app/checkout/actions/cart';
import { GlobalActionsTypes } from '../actions/global';
import { CartMapper } from 'app/checkout/reducers/mappers/cart-mapper';
import { AddressListInterface } from '../models/address-list';


/**
 * TODO add comment to every effect
 */
@Injectable()
export class StoreEffects {
	/**
	 * Fire this Action/Effect when user does an address search
	 */
	@Effect()
	searchStoreForPickup = this.actions.pipe(
		ofType(StoreActionsTypes.SearchStoreForPickup),
		mergeMap((action) => {
			const formattedAddress = action['payload']['formatted_address']
			return this.storeService.searchPickup(action, false).pipe(
				map(store => new SearchStoreForPickupSuccess(store, formattedAddress)),
				catchError(error => of(new SearchStoreForPickupFailure()))
			)
		})
	)

	@Effect()
	searchStoreForFetchNextPage = this.actions.pipe(
		ofType(StoreActionsTypes.SearchStoreFetchNextPage),
		mergeMap((action) =>
			this.storeService.searchPickup(action, false).pipe(
				map(store => new SearchStoreFetchNextPageSuccess(store)),
				catchError(error => of(new SearchStoreFetchNextPageFailure()))
			)
		)
	)
	@Effect()
	searchStoreForDelivery = this.actions.pipe(
		ofType(StoreActionsTypes.SearchStoreForDelivery),
		mergeMap((action) =>
			this.storeService.searchDelivery(action['payload']).pipe(
				map(store => new SearchStoreForDeliverySuccess(store)),
				catchError(error => of(new SearchStoreForDeliveryFailure(error.error, action['payload']['formatted_address'])))
			)
		)
	)
	/**
	 * Get local storage setting for isDelivery and only reset it if it doesn't exist
	 */
	@Effect()
	getDeliveryTabActive = this.actions.pipe(
		ofType(StoreActionsTypes.GetDefaultStoreSuccess),
		map((action) => {
			const isDelivery = action['isDelivery'];
			return new IsDeliveryTabActive(isDelivery);
		})
	)

	// @Effect({ dispatch: false })
	// setIsDeliveryTabActive = this.actions.pipe(
	// 	ofType(StoreActionsTypes.IsDeliveryTabActive),
	// 	mergeMap((action) => {
	// 		const isActive = action['payload'];
	// 		this.storeService.setDeliveryTabActiveFromLocalStorage('isDeliveryTabActive', isActive);
	// 		return of();
	// 	})
	// )


	/**
	 * TODO thing is this is right place for that effect
	 * Maybe every module which depend on store id needs to listed to that
	 * TODO Fetch ONLY if it is fetched
	 */
	@Effect()
	selectStore = this.actions.pipe(
		ofType(StoreActionsTypes.SelectStore),
		// map((action) => {
		// 	const selectedStore = action['payload'] as StoreServerInterface
		// 	const mappedStore = {
		// 		province: selectedStore.province,
		// 		city: selectedStore.city,
		// 		store_id: selectedStore.store_id,
		// 		postal_code: selectedStore.postal_code,
		// 		address: selectedStore.address,
		// 		market_phone_number: selectedStore.market_phone_number,
		// 		lat: selectedStore.lat,
		// 		lng: selectedStore.lng,
		// 		is_address_deliverable: selectedStore.is_address_deliverable,
		// 		delivery_city: selectedStore.delivery_city
		// 	}
		// 	this.storeService.setStoreInLocalStorage('selectedStore', mappedStore);
		// 	return of();
		// }),
		flatMap(() => this.applicationHttpClient.renewAuthTokenIfRequired('SelectStore').pipe(
			flatMap(() => [
				new ReloadFeatureSlides(),
				new ReloadJustForYou(),
				new ReloadBanner(),
				new ReloadCategories(),
				new ReloadProductList(),
				new ReloadComboConfig(),
				new ReloadProductConfig(),
				new ReloadMyPizzaList()
			])
		)),
	)

	@Effect()
	saveToLocal = this.actions.pipe(
		ofType(StoreActionsTypes.SelectStore),
		withLatestFrom(this.store),
		filter(([action, store]) => {
			const addressId = store.checkout.orderDetails.selectedAddressID;
			return addressId !== null
		}),
		map(([action, store]) => {
			const addressId = store.checkout.orderDetails.selectedAddressID;

			const selectedAddress = store.user.userAccount.accountAddresses.find(address => address.addressId === addressId);
			const userInputAddress = selectedAddress.address;
			userInputAddress.formatted_address = selectedAddress.address.streetNumber + ' ' + selectedAddress.address.streetName + ', '
				+ selectedAddress.address.city + ', ' + selectedAddress.address.province;
			return new SaveUserInputFromCookie(userInputAddress)
		})
	)

	@Effect()
	useDefaultAddress = this.actions.pipe(
		filter(action =>
			action.type === SignUpActionTypes.UserLoginSuccess
			|| action.type === CartActionsTypes.CloseIncompleteOrderPopup
		),
		withLatestFrom(this.store),
		filter(([action, store]) => {
			const userInputAddress = store.common.store.userInputAddress
			return !this.isAddressComplete(userInputAddress)
		}),
		map(([action, store]) => {
			return new RequestAccountDefaultAddress()
		})
	)

	@Effect()
	useDefaultAddressIfNoCart = this.actions.pipe(
		filter(action =>
			action.type === GlobalActionsTypes.AppInitialLoadSuccess
			|| action.type === SignUpActionTypes.UserLoginSuccess
		),
		withLatestFrom(this.store),
		filter(([action, store]) => {
			const isCartLoaded = store.checkout.cart.isLoading;
			const isCartFetched = store.checkout.cart.isFetched;
			const isUserLoggedIn = !store.user.userLogin.isLoading && store.user.userLogin.isFetched && store.user.userLogin.isJwtValid
			const userInputAddress = store.common.store.userInputAddress
			return !this.isAddressComplete(userInputAddress) && !isCartLoaded && !isCartFetched && isUserLoggedIn
		}),
		map(([action, store]) => {
			console.log('USER HAS NO CART BUT NEEDS DEFAULT ADDRESS')
			return new RequestAccountDefaultAddress()
		})
	)

	// Fetch Default Address Success -- continue validation flow
	@Effect()
	findDefaultAddressStore = this.actions.pipe(
		ofType(StoreActionsTypes.SaveUserInputFromDefaultAddress),
		withLatestFrom(this.store),
		filter(([action, store]) => {
			const isDelivery = store.checkout.orderDetails.isDelivery;
			return isDelivery
		}),
		mergeMap(([action, store]) => {
			const userInputAddress = action['addressInput'] as AddressListInterface
			const selectedAddressID = store.checkout.orderDetails.selectedAddressID;
			const serverAddressRequest = {
				address: {
					province: userInputAddress.address.province,
					city: userInputAddress.address.city,
					street_address: userInputAddress.address.streetName,
					street_number: userInputAddress.address.streetNumber,
					postal_code: userInputAddress.address.postalCode
				}
			}
			const validateRequest = CartMapper.mapDeliveryStoreValidationRequest(
				selectedAddressID,
				userInputAddress,
				userInputAddress,
			)
			return this.storeService.searchDelivery(serverAddressRequest).pipe(
				map(selectedStore => {
					return new ValidateCart(validateRequest, false, selectedStore, true)
				})
			)
		})
	)

	/**
	 * Determine if address is complete
	 */
	isAddressComplete(userInputAddress) {
		let addressComponents = null
		if (userInputAddress && userInputAddress.address) {
			addressComponents = userInputAddress.address.address_components
		} else if (userInputAddress && userInputAddress.address_components) {
			addressComponents = userInputAddress.address_components
		}
		let placeTypes = [];
		if (addressComponents) {
			addressComponents.forEach(component => {
				placeTypes = placeTypes.concat(component.types)
			})
			const minimumRequirements = ['street_number'];
			return minimumRequirements.filter(min => placeTypes.indexOf(min) > -1).length > 0;
		} else if (userInputAddress && userInputAddress.streetNumber) {
			return true;
		} else {
			return false;
		}
	}

	constructor(
		private actions: Actions,
		private storeService: StoreService,
		private store: Store<State>,
		private applicationHttpClient: ApplicationHttpClient,
	) { }
}
