// Angular Core
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

// Ng Rx
import { Store } from '@ngrx/store';
// Reactive operators
import { Effect, Actions, ofType } from '@ngrx/effects';
import { map, catchError, exhaustMap, filter, withLatestFrom, flatMap } from 'rxjs/operators';
import { of } from 'rxjs';

import { State } from '../../root-reducer/root-reducer';
// Actions
import * as AccountActions from '../actions/account-actions';

// Services
import { AccountService } from '../services/account-services';
import { StoreService } from '../../common/services/store.service';
import { ApplicationHttpClient } from '../../../utils/app-http-client';
import { FetchAllOrders } from '../../checkout/actions/orders';
import { SignUpActionTypes, FetchUserEditProfile } from '../actions/sign-up-actions';
import {
	ServerSetDefaultPaymentMethodInterface,
	ServerDefaultPaymentMethodEnum,
	ServerPaymentMethodInterface
} from '../models/server-models/server-saved-cards-interfaces';
import { FetchUserKidsClub } from '../actions/kids-club-actions';
import { AddressListInterface } from '../../common/models/address-list';
import { FetchCouponWallet } from 'app/common/actions/coupon-wallet';
import { CommonUseUpdateDataLayer } from 'app/common/actions/tag-manager';
import { SelectDeliveryAddressForCheckout } from 'app/checkout/actions/cart';
import { SaveUserInputFromDefaultAddress } from 'app/common/actions/store';
import { AccountMapperHelper } from '../reducers/mappers/account-mapper';
import { ServerAddressResponse } from '../models/server-models/server-account-interfaces';

@Injectable()
export class AccountEffects {
	/**
	  * After app initial load success check to see if user is logged in
	  */
	@Effect()
	accountPageInt = this.actions.pipe(
		filter(action =>
			action.type === '@ngrx/router-store/navigated'
			|| action.type === SignUpActionTypes.GetUserSummarySuccess
			|| action.type === SignUpActionTypes.GetUserSummaryFailure),
		withLatestFrom(this.store),
		filter(([action, state]) => {
			const isUpdate = action['isUpdate'];
			const isUserLoaded = state.user.userLogin.isFetched && !state.user.userLogin.isLoading
			const isAccountPage = state.router.state.url.startsWith('/user/account');
			const isLoyaltyPage = state.router.state.url.startsWith('/user/club-eleven-eleven')
			const isUserLoggedIn = state.user.userLogin.isJwtValid
			return (isAccountPage || isLoyaltyPage) && isUserLoaded && !isUpdate && isUserLoggedIn;
		}),
		exhaustMap(() => this.applicationHttpClient.renewAuthTokenIfRequired('isAccountPage | isLoyaltyPage').pipe(
			map(() => new AccountActions.LoadAccountPage())
		))
	)
	/**
	 * Load Account Page
	 */
	@Effect()
	loadAccountPage = this.actions.pipe(
		ofType(AccountActions.AccountActionTypes.LoadAccountPage),
		flatMap(() => [
			new FetchAllOrders(),
			new FetchUserKidsClub(),
			new AccountActions.RequestSavedCards(),
			new AccountActions.RequestAccountAddresses(true),
			new AccountActions.RequestAccountStores(true),
			// new ClearCouponWallet(),
			new FetchCouponWallet()
		])
	)
	/**
	 * Account Page Failed to Load due to no log in
	 */
	@Effect({ dispatch: false })
	loadAccountPageFail = this.actions.pipe(
		ofType(AccountActions.AccountActionTypes.LoadAccountPageFail),
		map(() => this.router.navigate(['']))
	)

	/**
	 * ADDRESS RELATED
	 */

	/**
	 * Sync Account Addresses -> After User updates or deletes an address we need to refetch them again.
	 * This ensures that our ngrx store will have the latest data
	 */
	@Effect()
	syncAccountAddresses = this.actions.pipe(
		ofType(AccountActions.AccountActionTypes.SyncUserAddresses),
		flatMap(action => [new AccountActions.RequestAccountAddresses(true), new FetchUserEditProfile()])
	)
	/**
	 * Get Account Addresses
	 */
	@Effect()
	fetchAccountAddresses = this.actions.pipe(
		ofType(AccountActions.AccountActionTypes.RequestAccountAddresses),
		withLatestFrom(this.store),
		filter(([action, state]) => {
			const isAddressFetched = state.user.userAccount.accountAddresses;
			const isInitialFetch = action['isInitialFetch'];

			return (!isInitialFetch && !isAddressFetched) || isInitialFetch
		}),
		exhaustMap(([action, state]) => {
			const userInputAddress = state.common.store.userInputAddress;
			const isDelivery = state.common.store.isDeliveryTabActive;

			return this.accountService.fetchUserAddressses().pipe(
				map((addressResponse) => {
					return new AccountActions.RequestAccountAddressesSuccess(addressResponse, userInputAddress, isDelivery)
				}),
				catchError(error => of(new AccountActions.RequestAccountAddressesFailure()))
			)
		})
	)

	/**
	 * Get Account Default Addresses
	 */
	@Effect()
	fetchAccountDefaultAddress = this.actions.pipe(
		ofType(AccountActions.AccountActionTypes.RequestAccountDefaultAddress),
		withLatestFrom(this.store),
		exhaustMap(([action, state]) => {
			const userInputAddress = state.common.store.userInputAddress;
			const isDelivery = state.common.store.isDeliveryTabActive;

			return this.accountService.fetchUserAddressses().pipe(
				flatMap((responseAddress: ServerAddressResponse[]) => {
					const mappedAddresses = AccountMapperHelper.parseAccountAddresses(responseAddress)
					const defaultAddress = mappedAddresses.find(address => address.isDefault);
					console.log(defaultAddress)
					const returnActions = []
					returnActions.push(
						new AccountActions.RequestAccountAddressesSuccess(responseAddress, userInputAddress, isDelivery)
					);
					if (defaultAddress) {
						returnActions.push(
							new SelectDeliveryAddressForCheckout(defaultAddress.addressId)
						)
						const userInput = defaultAddress;
						returnActions.push(
							new SaveUserInputFromDefaultAddress(userInput)
						)
					}
					return returnActions
				}),
				catchError(error => of(new AccountActions.RequestAccountAddressesFailure()))
			)
		})
	)

	/**
	 * Request Address Update
	 */
	@Effect()
	requestAddressUpdate = this.actions.pipe(
		ofType(AccountActions.AccountActionTypes.UpdateAddressRequest),
		withLatestFrom(this.store),
		exhaustMap(([action, store]) => {
			const addressRequest = action['addressRequest'] as AddressListInterface;
			let isResidential = true;
			if (addressRequest.university) {
				isResidential = false;
			}
			const accountAddress = store.user.userAccount.accountAddresses.find(address => address.addressId === addressRequest.addressId);
			addressRequest.isSaved = accountAddress ? accountAddress.isSaved : addressRequest.isSaved;
			if (!addressRequest.contactInfo) {
				addressRequest.contactInfo = accountAddress.contactInfo;
			}
			return this.accountService.updateUserAddress(addressRequest).pipe(
				flatMap((addressResponse) => [
					new AccountActions.UpdateAddressRequestSuccess(addressResponse, isResidential),
					new AccountActions.SyncUserAddresses()
				]),
				catchError(error => of(new AccountActions.UpdateAddressRequestFailure(error.error)))
			)
		})
	)

	/**
	 * Request Address Delete
	 */
	@Effect()
	requestAddressDelete = this.actions.pipe(
		ofType(AccountActions.AccountActionTypes.DeleteAddressRequest),
		exhaustMap((action) => {
			const addressId = action['addressId'];
			return this.accountService.deleteUserAddress(addressId).pipe(
				flatMap((addressResponse) => [
					new AccountActions.DeleteAddressRequestSuccess(addressResponse),
					new AccountActions.SyncUserAddresses()
				]),
				catchError(error => of(new AccountActions.DeleteAddressRequestFailure))
			)
		})
	)

	/**
	 * Resync addresses when user sets one as default
	 */
	@Effect()
	setDefaultAddress = this.actions.pipe(
		ofType(AccountActions.AccountActionTypes.SetDefaultAddress),
		exhaustMap((action) =>
			this.accountService.setDefaultAddress(action['addressId']).pipe(
				map(reponse => new AccountActions.SyncUserAddresses()),
				catchError(error => of())
			)
		)
	)
	/**
	 * STORE RELATED
	 */
	/**
	 * Fire this Action/Effect when user does an address search
	 */
	@Effect()
	searchStoreForPickup = this.actions.pipe(
		ofType(AccountActions.AccountActionTypes.SearchForStores),
		exhaustMap((action) => {
			if (action) {
				const formattedAddress = action['payload']['formatted_address']
				return this.storeService.searchPickup(action, false).pipe(
					map(store => new AccountActions.SearchForStoresSuccess(store, formattedAddress)),
					catchError(error => of(new AccountActions.SearchForStoresFailure()))
				)
			} else {
				return of(new AccountActions.SearchForStoresFailure())
			}
		})
	)
	/**
	 * Sync Account Stores -> After User updates or deletes a store we need to refetch them again.
	 * This ensures that our ngrx store will have the latest data
	 */
	@Effect()
	syncAccountStores = this.actions.pipe(
		ofType(AccountActions.AccountActionTypes.SyncUserStores),
		map(action => new AccountActions.RequestAccountStores(true))
	)
	/**
	 * Get Account Stores
	 */
	@Effect()
	fetchAccountStores = this.actions.pipe(
		ofType(AccountActions.AccountActionTypes.RequestAccountStores),
		withLatestFrom(this.store),
		filter(([action, state]) => {
			const isStoresFetched = state.user.userAccount.accountStores;
			const isInitialFetch = action['isInitialFetch'];
			return (!isInitialFetch && !isStoresFetched) || isInitialFetch
		}),
		exhaustMap(([action, state]) => {
			const selectedStore = state.common.store.selectedStore;
			const isDelivery = state.common.store.isDeliveryTabActive;
			return this.accountService.fetchUserStores().pipe(
				map((response) => {
					return new AccountActions.RequestAccountStoresSuccess(response, selectedStore, isDelivery)
				}),
				catchError(error => of(new AccountActions.RequestAccountStoresFailure()))
			)
		})
	)
	/**
	 * Delete Store
	 */
	@Effect()
	requestStoreDelete = this.actions.pipe(
		ofType(AccountActions.AccountActionTypes.UpdateStoreRequest),
		filter(action => action['isDelete']),
		exhaustMap((action) => {
			const storeId = action['storeId'];
			return this.accountService.deleteUserStore(storeId).pipe(
				flatMap((addressResponse) => [
					new AccountActions.UpdateStoreRequestSuccess(addressResponse, storeId),
					new AccountActions.SyncUserStores()
				]),
				catchError(error => of(new AccountActions.UpdateStoreRequestFailure))
			)
		})
	)

	/**
	 * Add store to user account
	 */
	@Effect()
	requestAddStore = this.actions.pipe(
		ofType(AccountActions.AccountActionTypes.UpdateStoreRequest),
		filter(action => !action['isDelete'] && !action['isDefault']),
		exhaustMap((action) => {
			const storeId = action['storeId'];
			const isNew = action['isNew'];
			return this.accountService.addUserStore(storeId, isNew).pipe(
				flatMap((addressResponse) => [
					new AccountActions.UpdateStoreRequestSuccess(addressResponse, storeId),
					new AccountActions.SyncUserStores(),
					new CommonUseUpdateDataLayer('savedpickup', 'Account', 'Saved pickup locations', storeId)
				]),
				catchError(error => of(new AccountActions.UpdateStoreRequestFailure))
			)
		})
	)

	/**
	 * Set store as default
	 */
	@Effect()
	requestSetDefault = this.actions.pipe(
		ofType(AccountActions.AccountActionTypes.UpdateStoreRequest),
		filter(action => action['isDefault']),
		exhaustMap((action) => {
			const storeId = action['storeId'];
			return this.accountService.setDefaultStore(storeId).pipe(
				flatMap((addressResponse) => [
					new AccountActions.UpdateStoreRequestSuccess(addressResponse, storeId),
					new AccountActions.SyncUserStores()
				]),
				catchError(error => of(new AccountActions.UpdateStoreRequestFailure))
			)
		})
	)

	/**
	 * Payment Method Related
	 */

	/**
	 * Only Fetch Cards If User Has A Wallet
	 */
	@Effect()
	fetchUserCards = this.actions.pipe(
		ofType(AccountActions.AccountActionTypes.RequestSavedCards),
		withLatestFrom(this.store),
		filter(([action, store]) => {
			const isWalletAvaliable = store.user.userLogin.loggedInUser ? store.user.userLogin.loggedInUser.isUserHasWallet : false;
			const isUserHasMealCard = store.user.userLogin.loggedInUser ? store.user.userLogin.loggedInUser.isUserHasMealCard : false;
			const savedCards = store.user.userAccount.accountCards
			return isWalletAvaliable // && (savedCards.length < 1 || (isUserHasMealCard && savedCards.length >= 1));
		}),
		exhaustMap(([action, store]) => {
			const defaultToken = store.user.userLogin.loggedInUser.defaultPayment.token

			return this.accountService.fetchUserPaymentMethodss().pipe(
				map(response => new AccountActions.RequestSavedCardsSuccess(response, defaultToken)),
				catchError(() => of(new AccountActions.RequestSavedCardsFailure()))
			)
		})
	);

	/**
	 * Add User Card - Either From Checkout or Account Page
	 */
	@Effect()
	addUserCard = this.actions.pipe(
		filter(action =>
			action.type === AccountActions.AccountActionTypes.AddUserCard
			|| action.type === AccountActions.AccountActionTypes.AddUserCardForCheckout
		),
		withLatestFrom(this.store),
		exhaustMap(([action, store]) => {
			const defaultToken = store.user.userLogin.loggedInUser.defaultPayment.token
			const editToken = action['existingToken'];
			return this.accountService.saveUserPaymentMethod(action['request'], editToken).pipe(
				map(addressResponse => {
					if (action.type === AccountActions.AccountActionTypes.AddUserCard) {
						return new AccountActions.AddUserCardSuccess(addressResponse, defaultToken)
					} else {
						return new AccountActions.AddUserCardForCheckoutSuccess(addressResponse, defaultToken)
					}
				}),
				catchError((error) => {
					if (action.type === AccountActions.AccountActionTypes.AddUserCard) {
						return of(new AccountActions.AddUserCardFailure(error.error))
					} else {
						return of(new AccountActions.AddUserCardForCheckoutFailure(error.error))
					}
				})
			)
		})
	)

	/**
	 * Set Default Payment Method
	 */
	@Effect()
	setDefaultPayment = this.actions.pipe(
		ofType(AccountActions.AccountActionTypes.SetUserDefaultPaymentMethod),
		filter(action => {
			const paymentRequest = action['defaultPayment'] as ServerSetDefaultPaymentMethodInterface
			const paymentType = paymentRequest ? paymentRequest.default_payment.payment_method : null;
			return (paymentType === ServerDefaultPaymentMethodEnum.WALLET && paymentRequest.default_payment.token)
				|| paymentType !== ServerDefaultPaymentMethodEnum.WALLET ? true : false
		}),
		exhaustMap((action) => {
			const defaultPayment = action['defaultPayment'] as ServerSetDefaultPaymentMethodInterface;
			return this.accountService.setDefaultPaymentMethod(defaultPayment).pipe(
				map(addressResponse => new AccountActions.SetUserDefaultPaymentMethodSuccess(defaultPayment)),
				catchError(() => of(new AccountActions.SetUserDefaultPaymentMethodFailure()))
			)
		})
	)

	/**
	 * Delete Payment Method
	 */
	@Effect()
	deletePaymentMethod = this.actions.pipe(
		ofType(AccountActions.AccountActionTypes.DeletePaymentMethod),
		withLatestFrom(this.store),
		exhaustMap(([action, store]) => {
			const token = action['token'] as string;
			const defaultToken = store.user.userLogin.loggedInUser.defaultPayment.token

			return this.accountService.deleteUserPaymentMethod(token).pipe(
				map(addressResponse => new AccountActions.RequestSavedCardsSuccess(addressResponse, defaultToken)),
				catchError(() => of(new AccountActions.SetUserDefaultPaymentMethodFailure()))
			)
		})
	)
	/**
	 * Delete Meal Card
	 */
	@Effect()
	deleteMealCard = this.actions.pipe(
		ofType(AccountActions.AccountActionTypes.DeleteMealCard),
		withLatestFrom(this.store),
		exhaustMap(([action, store]) => {
			return this.accountService.deleteUserMealCard().pipe(
				map(addressResponse => new AccountActions.DeleteMealCardSuccess())
			)
		})
	)
	/**
	 * Save Meal Card
	 */
	@Effect()
	saveMealCard = this.actions.pipe(
		ofType(AccountActions.AccountActionTypes.SaveMealCard),
		exhaustMap(action => {
			const request = action['requestData']
			return this.accountService.saveMealCard(request).pipe(
				map(addressResponse => new AccountActions.SaveMealCardSuccess(addressResponse)),
				catchError(error => of(new AccountActions.SavelMealCardFailure()))
			)
		})
	)

	/**
	 * Set New Meal Card As Default If Needed
	 */
	@Effect()
	updateDefaultMealCard = this.actions.pipe(
		ofType(AccountActions.AccountActionTypes.SaveMealCardSuccess),
		withLatestFrom(this.store),
		filter(([action, store]) => {
			const isMealCardDefault = store.user.userLogin.loggedInUser.defaultPayment.paymentMethod === ServerDefaultPaymentMethodEnum.MEAL_CARD
			return isMealCardDefault
		}),
		map(([action, store]) => {
			const newCard = action['savedCardData'] as ServerPaymentMethodInterface
			const defaultPayment = {
				default_payment: {
					payment_method: ServerDefaultPaymentMethodEnum.MEAL_CARD,
					token: newCard.token
				}
			}
			return new AccountActions.SetUserDefaultPaymentMethodSuccess(defaultPayment)
		})
	)

	constructor(
		private actions: Actions,
		private accountService: AccountService,
		private storeService: StoreService,
		private applicationHttpClient: ApplicationHttpClient,
		private store: Store<State>,
		private router: Router,
	) { }
}
