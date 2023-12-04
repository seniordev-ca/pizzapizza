// Angular Core
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

// Ng Rx
import { Store } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';

// Reactive operators
import {
	map,
	flatMap,
	exhaustMap,
	catchError,
	withLatestFrom,
	filter,
	delay,
	mapTo
} from 'rxjs/operators';
import { of, fromEvent } from 'rxjs';

// App state
import { State } from '../../root-reducer/root-reducer';
import {
	ProcessOrderRequestSuccess,
	ProcessOrderRequestFailure,
	OrderActionsTypes,
	FetchOrderById,
	FetchOrderByIdSuccess,
	FetchOrderByIdFailed,
	FetchAllOrders,
	FetchAllOrdersSuccess,
	FetchAllOrdersFailed,
	AddOrderToCartSuccess,
	AddOrderToCartFailed,
	ClearCartSuccess,
	ClearCartFailure,
	FetchOrderStatusById,
	FetchOrderStatusByIdSuccess,
	FetchOrderStatusByIdFailed,
	RefetchOrderStatus,
	AddOrderToCart,
	ValidateRepeatOrderSuccess,
	ValidateRepeatOrderFailure,
	ClearAddedOrders,
} from '../actions/orders';
import {
	GlobalActionsTypes
} from '../../common/actions/global';
import {
	EncodeCheckoutData, HandleSecurePaymentCheckout
} from '../actions/payment';
import { CartMapper } from '../reducers/mappers/cart-mapper';
import { OrderService } from '../services/orders';
import { ServerProcessOrderRequest } from '../models/server-process-order-request';
import { UpdateStoreRequest } from '../../user/actions/account-actions';
import { SelectDefaultAddress, TooManyItemsInCartFailure } from '../actions/cart';
import { FetchClub11AccountBalance } from '../../user/actions/club1111-actions';
import { SignUpActionTypes } from '../../user/actions/sign-up-actions';
import { ApplicationHttpClient } from '../../../utils/app-http-client';
import { CartService } from '../services/cart';
import { ServerOrderStatusResponse, ServerProcessOrderResponse } from '../models/server-process-order-response';
import { StoreActionsTypes } from 'app/common/actions/store';

const MAX_CART_ITEMS = 25;
@Injectable()
export class OrderEffect {

	/** ORDER CONFIRMATION PAGE */
	@Effect()
	loadOrderId = this.actions.pipe(
		filter(action =>
			action.type === '@ngrx/router-store/navigated'
			|| action.type === GlobalActionsTypes.AppInitialLoadSuccess
		),
		withLatestFrom(this.store),
		filter(([action, store]) => {
			const isSettingsFetched = store.common.settings.isFetched;

			const isConfirmationPage = store.router.state.url.startsWith('/checkout/order-confirmation/');
			const hasOrderId = store.router.state.params.orderId;
			return isConfirmationPage && hasOrderId && isSettingsFetched
		}),
		flatMap(() => this.applicationHttpClient.renewAuthTokenIfRequired('isConfirmationPage').pipe(
			withLatestFrom(this.store),
			flatMap(([action, state]) => {
				const orderId = state.router.state.params.orderId;
				return [
					new FetchOrderById(orderId),
					new FetchOrderStatusById(orderId)
				];
			})
		))
	)

	/**
	 * Call Refetch Order Status
	 */
	@Effect()
	onFetchOrderStatusSuccess = this.actions.pipe(
		ofType(OrderActionsTypes.FetchOrderStatusByIdSuccess),
		filter(action => {
			const response = action['orderRequestResponse'] as ServerOrderStatusResponse
			const isFinalStatus = response.is_final_status;
			return !isFinalStatus
		}),
		exhaustMap(action => {
			const response = action['orderRequestResponse'] as ServerOrderStatusResponse
			const time = response.next_status_avail_in_sec * 1000;
			return of(null).pipe(
				delay(time),
				map(() => new RefetchOrderStatus())
			)
		})
	)

	/**
	 * Refetch Order Status
	 */
	@Effect()
	refetchOrderStatus = this.actions.pipe(
		ofType(OrderActionsTypes.RefetchOrderStatus),
		withLatestFrom(this.store),
		filter(([action, store]) => {
			const isConfirmationPage = store.router.state.url.startsWith('/checkout/order-confirmation/');
			const hasOrderId = store.router.state.params.orderId;
			return isConfirmationPage && hasOrderId
		}),
		map(([action, state]) => {
			const orderId = state.router.state.params.orderId;
			return new FetchOrderStatusById(orderId);
		})
	)

	/**
	 * Get Order By ID
	 */
	@Effect()
	fetchOrderById = this.actions.pipe(
		ofType(OrderActionsTypes.FetchOrderById),
		withLatestFrom(this.store),
		exhaustMap(([action, state]) => {
			const orderId = action['orderId'];
			const baseUrl = state.common.settings.data.web_links.image_urls.product;

			return this.orderService.getOrderById(orderId).pipe(
				map(response => new FetchOrderByIdSuccess(response, baseUrl)),
				catchError(error => of(new FetchOrderByIdFailed()))
			)
		})
	)
	@Effect({ dispatch: false })
	redirectOnOrderFailed = this.actions.pipe(
		ofType(OrderActionsTypes.FetchOrderByIdFailed),
		map(() => {
			this.router.navigate(['/'])
		})
	)

	/** ORDER STATUS */
	@Effect()
	fetchOrderStatus = this.actions.pipe(
		ofType(OrderActionsTypes.FetchOrderStatusById),
		withLatestFrom(this.store),
		exhaustMap(([action, state]) => {
			const orderId = action['orderId'];
			const baseUrl = state.common.settings.data.web_links.image_urls.order;

			return this.orderService.getOrderStatus(orderId).pipe(
				map(response => new FetchOrderStatusByIdSuccess(response, baseUrl)),
				catchError(error => of(new FetchOrderStatusByIdFailed()))
			)
		})
	)

	/** ORDER HISTOR PAGE */
	@Effect()
	loadAllOrders = this.actions.pipe(
		filter(action =>
			action.type === '@ngrx/router-store/navigated'
			|| action.type === GlobalActionsTypes.AppInitialLoadSuccess
		),
		withLatestFrom(this.store),
		filter(([action, store]) => {
			const isSettingsFetched = store.common.settings.isFetched;
			const isStoreFetched = store.common.store.selectedStore;

			const isOrderHistoryPage = store.router.state.url.startsWith('/checkout/order-history');
			const isRepeatLastOrder = store.router.state.url.startsWith('/checkout/repeat-last-order')

			return (isOrderHistoryPage || isRepeatLastOrder) && isSettingsFetched && isStoreFetched !== null
		}),
		withLatestFrom(this.store),
		map(([action, state]) => new FetchAllOrders())
	);

	/**
	 * Get All Orders
	 */
	@Effect()
	getallOrders = this.actions.pipe(
		ofType(OrderActionsTypes.FetchAllOrders),
		withLatestFrom(this.store),
		exhaustMap(([action, state]) => {
			const cursor = state.checkout.orders.orderHistoryCursor;
			const isInitalLoad = state.checkout.orders.isInitalLoad;
			const baseUrl = state.common.settings.data.web_links.image_urls.product;
			const selectedStore = state.common.store.selectedStore;
			const isDelivery = state.common.store.isDeliveryTabActive;

			if ((isInitalLoad || cursor) && selectedStore) {
				return this.orderService.getOrderHistory(selectedStore.store_id, isDelivery, cursor).pipe(
					map(response => new FetchAllOrdersSuccess(response, baseUrl)),
					catchError(error => of(new FetchAllOrdersFailed()))
				)
			} else {
				return of(new FetchAllOrdersFailed())
			}

		})
	)

	/**
	 * Build Order Request for processing
	 * TODO Refactor this DRY!
	 */
	@Effect()
	buildOrderRequest = this.actions.pipe(
		ofType(OrderActionsTypes.BuildOrderRequest),
		withLatestFrom(this.store),
		exhaustMap(([action, state]) => {
			const submittedAddressDetails = action['orderDetails'];
			const submittedPaymentDetails = action['paymentDetails'];
			const serverCartData = state.checkout.cart.serverCart;

			return this.applicationHttpClient.renewAuthTokenIfRequired('BuildOrderRequest').pipe(
				withLatestFrom(this.store),
				exhaustMap(() => {
					const userStores = state.user.userAccount.accountStores;
					const isLoggedIn = state.user.userLogin.loggedInUser;
					const baseUrl = state.common.settings.data.web_links.image_urls.product;

					const selectedStore = state.common.store.selectedStore;
					const isDelivery = state.common.store.isDeliveryTabActive;
					const selectedAddress = state.checkout.orderDetails.selectedAddressID;

					let orderRequest = {} as ServerProcessOrderRequest;

					if (isDelivery) {
						orderRequest = CartMapper.mapDeliveryOrderRequest(
							submittedAddressDetails,
							submittedPaymentDetails,
							selectedAddress,
							selectedStore.store_id
						)
					} else {
						orderRequest = CartMapper.mapPickupOrderRequest(
							submittedAddressDetails,
							submittedPaymentDetails,
							selectedStore.store_id
						)
					}

					return this.orderService.submitOrderForProcessing(orderRequest).pipe(
						flatMap(response => {
							const actionArray = []
							actionArray.push(new ProcessOrderRequestSuccess(response, baseUrl, serverCartData, orderRequest.payment_type))
							// TODO Adam it is a right spot for that check?
							// If Order is pickup and User has no stores we add the store to the user's list
							if (isLoggedIn && (!isDelivery && !userStores) || (!isDelivery && (userStores && userStores.length < 1))) {
								actionArray.push(new UpdateStoreRequest(selectedStore.store_id, null, null, true))
							}
							return actionArray
						}),
						catchError(error => {
							if (error.error.errors.encoded_order) {
								const html = error.error.errors.html_response
								const encoded = error.error.errors.encoded_order
								const url = error.error.errors.redirect_url
								return of(new HandleSecurePaymentCheckout(html, encoded, url))
							}
							return of(new ProcessOrderRequestFailure(error.error))
						})
					)
				})
			)
		})
	)

	/**
	 * Build add to request and encode it for MP re-rendering
	 */
	@Effect()
	saveCheckoutAddress = this.actions.pipe(
		ofType(OrderActionsTypes.EncodeOrderRequest),
		withLatestFrom(this.store),
		map(([action, state]) => {
			const selectedStore = state.common.store.selectedStore;
			const isDelivery = state.common.store.isDeliveryTabActive;
			const selectedAddress = state.checkout.orderDetails.selectedAddressID;
			const submittedAddressDetails = action['orderDetails'];
			const submittedPaymentDetails = action['paymentDetails'];
			let orderRequest = {} as ServerProcessOrderRequest;

			if (isDelivery) {
				orderRequest = CartMapper.mapDeliveryOrderRequest(
					submittedAddressDetails,
					submittedPaymentDetails,
					selectedAddress,
					selectedStore.store_id
				)
			} else {
				orderRequest = CartMapper.mapPickupOrderRequest(
					submittedAddressDetails,
					submittedPaymentDetails,
					selectedStore.store_id
				)
			}

			// Send to server
			return new EncodeCheckoutData(orderRequest);
		})
	)



	/**
	 * When process order is successful
	 */
	@Effect()
	onSuccessfulOrder = this.actions.pipe(
		ofType(OrderActionsTypes.ProcessOrderRequestSuccess),
		withLatestFrom(this.store),
		flatMap(([action, store]) => {
			const response = action['orderRequestResponse'] as ServerProcessOrderResponse;
			const orderId = response.order_id;

			return this.applicationHttpClient.renewAuthTokenIfRequired('ProcessOrderRequestSuccess').pipe(
				flatMap(() => {
					const user = store.user.userLogin.loggedInUser;
					const afterOrderActions = [];
					afterOrderActions.push(new SelectDefaultAddress())
					if (user && user.isClubElevenElevenMember) {
						const token = store.user.userClub1111.clubCardToken
						afterOrderActions.push(new FetchClub11AccountBalance(token))
					}
					this.router.navigate(['/checkout/order-confirmation/' + orderId]);
					// using a flatMap here temperarily just in case there are more actions that should be dispatched
					return afterOrderActions
				})
			)
		})
	)

	/**
	 * Clear User Cart
	 */
	@Effect()
	clearCart = this.actions.pipe(
		filter(action => action.type === OrderActionsTypes.ClearCart || action.type === SignUpActionTypes.UserLogsOut),
		exhaustMap(action => this.orderService.clearCart().pipe(
			map(repsonse => new ClearCartSuccess()),
			catchError(error => of(new ClearCartFailure()))
		))
	)

	/**
	 * Validate Order To Cart By Id
	 */
	@Effect()
	validateOrderToCart = this.actions.pipe(
		ofType(OrderActionsTypes.ValidateRepeatOrder),
		withLatestFrom(this.store),
		filter(([action, store]) => {
			const selectedOrderId = action['orderId'];
			const orderFromState = store.checkout.orders.entities[selectedOrderId];
			const orderItemCount = orderFromState ? orderFromState.cartItems.length : 0;
			const currentCartCount = store.checkout.cart.ids.length

			return (orderItemCount + currentCartCount) <= MAX_CART_ITEMS;
		}),
		exhaustMap(([action, state]) => {
			const storeId = state.common.store.selectedStore.store_id;
			const isDelivery = state.common.store.isDeliveryTabActive;
			const orderId = action['orderId'];
			return this.orderService.validateOrderToCart(orderId, storeId, isDelivery).pipe(
				map(response => {
					// if order is valid add it directly to cart, otherwise send data to reducer so user can see what products are invalid
					if (response.is_valid) {
						return new AddOrderToCart(orderId)
					} else {
						return new ValidateRepeatOrderSuccess(response)
					}
				}),
				catchError(() => of(new ValidateRepeatOrderFailure()))
			)
		})
	)

	/**
	 * Add Order To Cart By Id
	 */
	@Effect()
	addOrderToCart = this.actions.pipe(
		ofType(OrderActionsTypes.AddOrderToCart),
		withLatestFrom(this.store),
		filter(([action, store]) => {
			const selectedOrderId = action['orderId'];
			const orderFromState = store.checkout.orders.entities[selectedOrderId];
			const orderItemCount = orderFromState ? orderFromState.cartItems.length : 0;
			const currentCartCount = store.checkout.cart.ids.length

			return (orderItemCount + currentCartCount) <= MAX_CART_ITEMS;
		}),
		exhaustMap(([action, state]) => {
			const storeId = state.common.store.selectedStore.store_id;
			const isDelivery = state.common.store.isDeliveryTabActive;
			const orderId = action['orderId'];
			const imageBaseUrl = state.common.settings.data.web_links.image_urls.product;
			return this.orderService.addOrderToCart(orderId, storeId, isDelivery).pipe(
				map(response => {
					this.cartService.setIsUserHasCart(true);
					return new AddOrderToCartSuccess(response, imageBaseUrl, orderId)
				}),
				catchError(() => of(new AddOrderToCartFailed()))
			)
		})
	)

	@Effect()
	clearAddedOrders = this.actions.pipe(
		ofType(OrderActionsTypes.AddOrderToCartSuccess),
		mapTo(new ClearAddedOrders),
		delay(2000)
	)
	/**
	 * Add Order To Cart By Id --- Too Many Items in cart
	 */
	@Effect()
	addOrderToCartMaxItems = this.actions.pipe(
		filter(action => action.type === OrderActionsTypes.AddOrderToCart || action.type === OrderActionsTypes.ValidateRepeatOrder),
		withLatestFrom(this.store),
		filter(([action, store]) => {
			const selectedOrderId = action['orderId'];
			const orderFromState = store.checkout.orders.entities[selectedOrderId];
			const orderItemCount = orderFromState ? orderFromState.cartItems.length : 0;
			const currentCartCount = store.checkout.cart.ids.length

			return (orderItemCount + currentCartCount) > MAX_CART_ITEMS;
		}),
		map(() => new TooManyItemsInCartFailure())
	)


	constructor(
		private actions: Actions,
		private store: Store<State>,
		private orderService: OrderService,
		private cartService: CartService,
		private router: Router,
		private applicationHttpClient: ApplicationHttpClient
	) { }
}
