// Angular Core
import { Injectable } from '@angular/core';

// Ng Rx
import { Store } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { ApplicationLocalStorageClient } from '../../../utils/app-localstorage-client';

// Reactive operators
import {
	map,
	exhaustMap,
	catchError,
	withLatestFrom,
	filter,
	flatMap
} from 'rxjs/operators';
import { of } from 'rxjs';

// App state
import { State } from '../../root-reducer/root-reducer';
import {
	GlobalActionsTypes
} from '../../common/actions/global';

// Actions
import {
	PaymentActionsTypes,

	FetchMpRedirectUrlSuccess,
	FetchMpRedirectUrlFailure,

	EncodeCheckoutDataSuccess,
	EncodeCheckoutDataFailure,

	OpenMpPayment,
	OpenMpPaymentSuccess,

	DecodeCheckoutData,
	DecodeCheckoutDataSuccess,
	DecodeCheckoutDataFailure,

	HandleSuccessMpRedirect,
	HandleCancelMpRedirect,
	HandleErrorMpRedirect,

	CheckoutReRenderingRequired,
	CheckoutReRendering,

	HandleSecurePaymentCheckoutFailure
} from '../actions/payment';

// Actions
import * as AccountActions from '../../user/actions/account-actions';

// Services
import {
	PaymentService
} from '../services/payment';
import { SignUpService } from '../../user/services/sign-up-service';
import {
	ProcessOrderRequestSuccess,
	ProcessOrderRequestFailure,
} from '../actions/orders';
import { CartActionsTypes } from '../actions/cart';
import { ServerProcessOrderRequest, ServerOrderPaymentTypeEnum } from '../models/server-process-order-request';
import { SaveUserInput } from 'app/common/actions/store';


/**
 * TODO
 * - Removing token after redirect
 */
@Injectable()
export class PaymentEffect {

	/**
	 * If page is initially loaded with defined GET params app need to wait
	 * until all http call are done, decode checkout payload and render a payment view
	 */
	@Effect()
	checkGetParamsForReRendering = this.actions.pipe(
		filter(action => action.type === GlobalActionsTypes.AppInitialLoadSuccess),
		withLatestFrom(this.store),
		filter(([action, state]) => {
			const isCheckoutPage = state.router.state.url.startsWith('/checkout');
			if (!isCheckoutPage) {
				return false;
			}
			const mpStatus = state.router.state.queryParams['mpstatus'];
			const isMpStatus = ['success', 'cancel', 'failure'].indexOf(mpStatus) !== -1;
			const isSecurePaymentStatus = state.router.state.queryParams['3dsecure'] === 'true';

			return isMpStatus || isSecurePaymentStatus;
		}),
		map(() => new CheckoutReRenderingRequired())
	)


	/**
	 * If checkout re-rendering required
	 */
	@Effect()
	waitForCallsBeforeReRendering = this.actions.pipe(
		filter(action => action.type === PaymentActionsTypes.CheckoutReRenderingRequired ||
			action.type === AccountActions.AccountActionTypes.RequestAccountAddressesSuccess ||
			action.type === AccountActions.AccountActionTypes.RequestAccountStoresSuccess ||
			action.type === CartActionsTypes.FetchUserCartSuccess),
		withLatestFrom(this.store),
		filter(([action, state]) => state.checkout.payment.isCheckoutReRenderingRequired),
		filter(([action, state]) => {

			let isPageLoaded = false;
			if (this.signUpService.tokensExist() || state.user.userLogin.loggedInUser) {
				console.log('user signed in')
				// User is signed id. Wait for all checkout specific data
				isPageLoaded = state.user.userLogin.isFetched &&
					state.user.userAccount.isAccountAddressesFetched &&
					state.user.userAccount.isAccountStoresFetched &&
					state.checkout.cart.isFetched;

			} else {
				console.log('user NOT signed in')
				// User is not signed id just wait for card
				isPageLoaded = state.checkout.cart.isFetched;
			}

			return isPageLoaded;
		}),
		map(() => new CheckoutReRendering())
	)

	/**
	 * At this point all data should be fetched so we just handle checkout page re-rendering
	 */
	@Effect()
	handerRedirect = this.actions.pipe(
		filter(action => action.type === PaymentActionsTypes.CheckoutReRendering),
		withLatestFrom(this.store),
		flatMap(([action, state]) => {
			const mpStatus = state.router.state.queryParams['mpstatus'];
			if (mpStatus) {
				if (mpStatus === 'success') {
					return [new HandleSuccessMpRedirect()];
				} else if (mpStatus === 'cancel') {
					return [new HandleCancelMpRedirect()];
				} else {
					return [new HandleErrorMpRedirect()];
				}
			}

			const secureCheckoutRequestToken = this.paymentService.getEncodedOrderToken();
			const secureCheckoutEvents = [];
			secureCheckoutEvents.push(new DecodeCheckoutData(secureCheckoutRequestToken));

			const is3dSecureSuccess = state.router.state.queryParams['status'] === 'success';
			if (!is3dSecureSuccess) {
				secureCheckoutEvents.push(new HandleSecurePaymentCheckoutFailure());
			}

			return secureCheckoutEvents;
		})
	)

	/**
	 * MP token fetch success so do checkout attempt
	 */
	@Effect()
	mpPaymentSuccess = this.actions.pipe(
		ofType(PaymentActionsTypes.HandleSuccessMpRedirect),
		withLatestFrom(this.store),
		exhaustMap(([action, state]) => {
			const baseUrl = state.common.settings.data.web_links.image_urls.product;
			const encodedCheckoutData = this.appCookies.get('mpCheckoutRequestToken');
			const serverCartData = state.checkout.cart.serverCart;

			// For MP call token should have all GET params from redirect

			// TODO think about server side handling after MP redirect
			if (typeof window !== 'object') {
				return of();
			}

			const token = window.location.href.split('?')[1];
			return this.paymentService.mpCheckout(encodedCheckoutData, token).pipe(
				map(response => {
					return new ProcessOrderRequestSuccess(response, baseUrl, serverCartData, ServerOrderPaymentTypeEnum.MasterCard);
				}),
				catchError(error => of(new ProcessOrderRequestFailure(error.error)))
			)

		})
	)

	/**
	 * If MP cancel or error we need to re-render the page with user selection
	 */
	@Effect()
	mpFailureRerendering = this.actions.pipe(
		filter(action =>
			action.type === PaymentActionsTypes.HandleSuccessMpRedirect
			|| action.type === PaymentActionsTypes.HandleCancelMpRedirect
			|| action.type === PaymentActionsTypes.HandleErrorMpRedirect
		),
		map(() => {
			const mpCheckoutRequestToken = this.appCookies.get('mpCheckoutRequestToken') as string;
			return new DecodeCheckoutData(mpCheckoutRequestToken);
		})
	)

	/**
	 * Decode checkout data
	 */
	@Effect()
	fetchUseCheckoutData = this.actions.pipe(
		ofType(PaymentActionsTypes.DecodeCheckoutData),
		exhaustMap(action => {
			const encodedCheckoutData = action['encodedCheckoutRequest'] as string;
			return this.paymentService.mpDecodePayload(encodedCheckoutData).pipe(
				map(response => new DecodeCheckoutDataSuccess(response)),
				catchError(error => of(new DecodeCheckoutDataFailure()))
			)
		})
	)

	@Effect()
	validateCheckoutOnSuccess = this.actions.pipe(
		ofType(PaymentActionsTypes.DecodeCheckoutDataSuccess),
		withLatestFrom(this.store),
		map(([action, store]) => {
			const isDelivery = store.checkout.orderDetails.isDelivery;
			const mappedInput = store.checkout.orderDetails.mpDecodedData.mappedAddress;
			const isFuture = mappedInput.time ? true : false;
			const storeId = store.checkout.orderDetails.selectedStore;
			// If delivery and saved address than find address by address id
			if (isDelivery && 'addressId' in mappedInput && mappedInput.addressId) {
				const userAddresses = store.user.userAccount.accountAddresses;
				const addressId = mappedInput.addressId;
				const selectedAddress = userAddresses.find(address => address.addressId === addressId);
				if (isFuture) {
					selectedAddress.date = mappedInput.date;
					selectedAddress.time = mappedInput.time;
				}
				return new SaveUserInput(selectedAddress, isDelivery, false, true, storeId, isFuture, true)
			}

			return new SaveUserInput(mappedInput, isDelivery, false, true, storeId, isFuture, true)
		})
	)

	/**
	 * Fetch MP redirect URL
	 */
	@Effect()
	fetchMpRedirectUrl = this.actions.pipe(
		ofType(PaymentActionsTypes.FetchMpRedirectUrl),
		withLatestFrom(this.store),
		exhaustMap(([action, state]) =>
			this.paymentService.getMpToken().pipe(
				map(response => {
					return new FetchMpRedirectUrlSuccess(response);
				}),
				catchError(error => of(new FetchMpRedirectUrlFailure()))
			)
		)
	)


	/**
	 * Save checkout data request to the server
	 */
	@Effect()
	encodeOrderRequest = this.actions.pipe(
		ofType(PaymentActionsTypes.EncodeCheckoutData),
		withLatestFrom(this.store),
		exhaustMap(([action, state]) => {
			const checkoutServerPayload = action['checkoutServerPayload'] as ServerProcessOrderRequest;
			// TODO we need to build request in one place
			delete checkoutServerPayload.payment_data;
			checkoutServerPayload.payment_type = ServerOrderPaymentTypeEnum.MasterCard;

			return this.paymentService.mpEncodePayload(checkoutServerPayload).pipe(
				map(response => {
					return new EncodeCheckoutDataSuccess(response);
				}),
				catchError(error => of(new EncodeCheckoutDataFailure()))
			)
		})
	)


	/**
	 * Checks if MP redirect URL fetched and checkout payload is encoded
	 */
	@Effect()
	checkIfMpParallelActions = this.actions.pipe(
		filter(action =>
			action.type === PaymentActionsTypes.FetchMpRedirectUrlSuccess
			|| action.type === PaymentActionsTypes.EncodeCheckoutDataSuccess
		),
		withLatestFrom(this.store),
		filter(([action, state]) => {
			const isMpRedirectSaved = state.checkout.payment.isMpRedirectUrlFetched;
			const isCheckoutDataSaved = state.checkout.payment.isMpEncodingFetched;

			return isMpRedirectSaved && isCheckoutDataSaved;
		}),
		map(([action, state]) => {
			return new OpenMpPayment();
		})
	)


	/**
	 * Save checkout token to cookies
	 * Redirect to MP portal
	 */
	@Effect()
	redirectToMpPortal = this.actions.pipe(
		ofType(PaymentActionsTypes.OpenMpPayment),
		withLatestFrom(this.store),
		map(([action, state]) => {
			const mpCheckoutRedirectUrl = state.checkout.payment.mpCheckoutRedirectUrl;
			const mpCheckoutRequestToken = state.checkout.payment.mpCheckoutRequestToken;

			// Save to local storage
			this.appCookies.set('mpCheckoutRequestToken', mpCheckoutRequestToken);
			// Redirect to MP portal
			window.location.href = mpCheckoutRedirectUrl;

			return new OpenMpPaymentSuccess();
		})
	)

	@Effect({ dispatch: false })
	redirectToSecureCheckout = this.actions.pipe(
		ofType(PaymentActionsTypes.HandleSecurePaymentCheckout),
		map(action => {
			const html = action['html'];
			const encodedOrder = action['encodedString'];
			this.paymentService.saveEncodedOrderToken(encodedOrder);
			this.paymentService.renderHtmlToDocument(html);
		})
	)

	constructor(
		private actions: Actions,
		private store: Store<State>,
		private paymentService: PaymentService,
		private signUpService: SignUpService,
		private appCookies: ApplicationLocalStorageClient
	) { }
}

