// Angular Core
import { Injectable, Inject } from '@angular/core';
import { Router } from '@angular/router';

// Ng Rx
import { Store } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
// Reactive operators
import {
	map,
	exhaustMap,
	mergeMap,
	catchError,
	flatMap,
	withLatestFrom,
	filter
} from 'rxjs/operators';
import { of } from 'rxjs';

// App state
import { State } from '../../root-reducer/root-reducer';

// Cart actions
import {
	AddConfigurableProductToCartSuccess,
	AddConfigurableProductToCartFailure,

	AddBasicProductToCartSuccess,
	AddBasicProductToCartFailure,

	FetchUserCart,
	FetchUserCartSuccess,
	FetchUserCartFailure,

	RemoveCartItemSuccess,
	RemoveCartItemFailure,
	SetTwinAddToCartRequestToConfigurator,

	CartActionsTypes,
	AddComboToCartSuccess,
	AddComboToCartFailure,
	UpdateConfigurableProductToCartSuccess,
	UpdateConfigurableProductToCartFailure,
	UpdateComboToCartFailure,
	UpdateComboToCartSuccess,
	FetchDeliveryStoreForCheckoutSuccess,
	FetchDeliveryStoreForCheckoutFailure,
	ValidateCart,
	ValidateCartSuccess,
	ValidateCartFailed,
	FetchStoreHoursForCheckout,
	FetchStoreHoursForCheckoutSuccess,
	FetchStoreHoursForCheckoutFailure,
	UpdateUserCart,
	ValidateCartInvalid,
	UpdateUserCartSuccess,
	UpdateUserCartFailed,
	SelectDeliveryAddressForCheckout,
	AddStoreObjectToCheckout,
	SelectDefaultAddress,
	TooManyItemsInCartFailure,
	AddValidIncompleteProductToCartRequest,
	UserHasNoCart,
	AddAdvancedProductToCartSuccess,
	AddAdvancedProductToCartFailure,
	AddProductArrayToCartSuccess,
	AddProductArrayToCartFailure,
	AddPizzaAssistantProductsToCartSuccess,
	AddPizzaAssistantProductsToCartFailure,
	ShowIncompleteOrderPopup,
} from '../actions/cart';

import { SignUpActionTypes } from '../../user/actions/sign-up-actions';
import {
	AccountActionTypes,
	UpdateAddressRequest,
	LoadAccountPage
} from '../../user/actions/account-actions';
import { ApplicationHttpClient } from '../../../utils/app-http-client';
import {
	CatalogComboConfigListTypes
} from '../../catalog/actions/combo-config';
import {
	ShowValidation,
} from '../../common/actions/cart-validation'

// Service
import { CartService } from '../services/cart';
import { CartMapper } from '../reducers/mappers/cart-mapper';
import { StoreService } from '../../common/services/store.service';
import { ApplicationLocalStorageClient } from '../../../utils/app-localstorage-client';
import { AddressInputInterface } from '../../common/models/address-input';
import { SelectStore, IsDeliveryTabActive, StoreActionsTypes } from '../../common/actions/store';

import {
	CheckoutTypeEnum,
	FutureHoursRequestInterface,
	AddCartServerRequestInterface,
	AddToCartProductServerRequestInterface,
	ValidateStoreInterface,
	AddToCartItemSourceEnum
} from '../models/server-cart-request';
import { ConfiguratorActionsTypes } from '../../catalog/actions/configurator';
import { ClearCoupon } from '../../common/actions/coupons';
import { FetchRecommendations } from '../../common/actions/recommendations';
import { ClearCart, OrderActionsTypes } from '../actions/orders';
import {
	ServerCartResponseInterface,
	ServerCartStoreValidationInterface,
	CartItemKindEnum,
	isValidationOk
} from '../models/server-cart-response';
import { ServerAddressResponse } from '../../user/models/server-models/server-account-interfaces';
import { AddressListInterface } from '../../common/models/address-list';
import { ServerLoginResponseInterface } from 'app/user/models/server-models/server-user-registration-input';
import { ValidateErrorCodeEnum } from '../../common/models/server-validation-error'

import { LOCALE_ID } from '@angular/core';
import { StoreServerInterface } from 'app/common/models/server-store';

// TODO - should this be coming from server?
const MAX_CART_ITEMS = 25;

@Injectable()
export class CartEffect {

	/**
	 * Loading cart on app launch
	 * Checking is user has cart flag is set on local storage
	 */
	@Effect()
	cartLoadOnLaunch = this.actions.pipe(
		filter(action =>
			action.type === StoreActionsTypes.GetDefaultStoreSuccess
			&& !action['isValidateRequired']
		),
		mergeMap(() => {
			if (this.cartService.getIsUserHasCart()) {
				return of(new FetchUserCart());
			} else {
				return of(new UserHasNoCart());
			}
		})
	)

	@Effect()
	cartValidateOnLaunch = this.actions.pipe(
		filter(action =>
			action.type === StoreActionsTypes.GetDefaultStoreSuccess
			&& action['isValidateRequired']
		),
		mergeMap((action) => {
			const store = action['payload'];
			const isDelivery = action['isDelivery'];
			const validationRequest = {
				store_id: store.store_id,
				is_delivery: isDelivery
			} as ValidateStoreInterface
			const isStrictValidation = false;
			if (this.cartService.getIsUserHasCart()) {
				return this.cartService.validateCart(validationRequest).pipe(
					map(response => {
						if (response.error && response.error.error_code) {
							return new ValidateCartInvalid(response, isDelivery, isStrictValidation)
						} else {
							return new ValidateCartSuccess(response, isDelivery, isStrictValidation, false)
						}
					}),
					catchError((error) => of(new ValidateCartFailed(error.error)))
				)
			} else {
				return of(new UserHasNoCart());
			}
		})
	)

	@Effect()
	fetchCartIfEmployeeDiscountApplied = this.actions.pipe(
		filter(action => action.type === SignUpActionTypes.UserLoginSuccess),
		filter(action => {
			const user = action['userDetails'] as ServerLoginResponseInterface
			return user.is_cart_updated;
		}),
		map(action => {
			this.cartService.setIsUserHasCart(true);
			return new FetchUserCart()
		})
	)

	/**
	 * Load cart on app launch
	 */
	@Effect()
	fetchServerCart = this.actions.pipe(
		ofType(CartActionsTypes.FetchUserCart),
		withLatestFrom(this.store),
		mergeMap(([action, store]) => {
			const storeId = store.common.store.selectedStore.store_id;
			const isDelivery = store.common.store.isDeliveryTabActive;
			return this.cartService.getCart(storeId, isDelivery).pipe(
				map((serverCartResponse) => {
					const imageBaseUrl = store.common.settings.data.web_links.image_urls.product;
					return new FetchUserCartSuccess(serverCartResponse, imageBaseUrl);
				}),
				catchError(error => of(new FetchUserCartFailure()))
			)
		})
	)

	/**
	 * Add To cart action
	 */
	@Effect()
	addToCartEffect = this.actions.pipe(
		ofType(CartActionsTypes.AddConfigurableProductToCart),
		withLatestFrom(this.store),
		filter(([action, store]) => {
			const cartCount = store.checkout.cart.ids.length
			return cartCount < MAX_CART_ITEMS
		}),
		exhaustMap(([action, store]) => {
			const addtoCartRequest = this.mapCouponAndMessageToCartRequest(store)
			return this.cartService.addProductToCart(addtoCartRequest, AddToCartItemSourceEnum.menu).pipe(
				map((serverCartResponse) => {
					// Save flag in local storage
					this.cartService.setIsUserHasCart(true);
					const imageBaseUrl = store.common.settings.data.web_links.image_urls.product;
					return new AddConfigurableProductToCartSuccess(serverCartResponse, imageBaseUrl);
				}),
				catchError(error => of(new AddConfigurableProductToCartFailure()))
			)
		})
	)

	/**
	 * Clear Coupon on add to cart request
	 */
	@Effect()
	clearCouponOnSuccess = this.actions.pipe(
		ofType(CartActionsTypes.AddConfigurableProductToCartSuccess),
		withLatestFrom(this.store),
		filter(([action, store]) => {
			const activeSlug = store.catalog.configurableItem.productSeoTitle;
			const activeCoupon = store.common.coupons.activeSlug;
			return activeSlug === activeCoupon
		}),
		map(() => new ClearCoupon())
	)

	/**
	 * Update Item in cart action
	 */
	@Effect()
	updateToCartEffect = this.actions.pipe(
		ofType(CartActionsTypes.UpdateConfigurableProductToCart),
		withLatestFrom(this.store),
		exhaustMap(([action, store]) => {
			const cartItemId = store.catalog.configurableItem.cartItemId;
			const addtoCartRequest = this.mapCouponAndMessageToCartRequest(store, cartItemId) as AddCartServerRequestInterface
			console.log('UPDATE ITEM', addtoCartRequest)
			const singleAddToCartRequest = {
				store_id: addtoCartRequest.store_id,
				is_delivery: addtoCartRequest.is_delivery,
				...addtoCartRequest.products[0]
			} as AddToCartProductServerRequestInterface

			return this.cartService.updateProductInCart(singleAddToCartRequest).pipe(
				map((serverCartResponse) => {
					const imageBaseUrl = store.common.settings.data.web_links.image_urls.product;
					return new UpdateConfigurableProductToCartSuccess(serverCartResponse, imageBaseUrl);
				}),
				catchError(error => of(new UpdateConfigurableProductToCartFailure()))
			)
		})
	)


	/**
	 * Update Item Quantity in cart action
	 */
	@Effect()
	updateCartItemQuantityEffect = this.actions.pipe(
		ofType(CartActionsTypes.UpdateCartItemQuantity),
		withLatestFrom(this.store),
		exhaustMap(([action, store]) => {
			const cartItemId = action['productCartId'];
			const isIncreaseQuantity = action['isIncreaseQuantity'];
			const selectedCartItem = store.checkout.cart.serverCart.products.find(cartItem => cartItem.cart_item_id === cartItemId);

			const quantity = isIncreaseQuantity ? selectedCartItem.quantity + 1 : selectedCartItem.quantity - 1;

			return this.cartService.updateProductQuantityInCart(cartItemId, quantity).pipe(
				map((serverCartResponse) => {
					const imageBaseUrl = store.common.settings.data.web_links.image_urls.product;
					return new UpdateConfigurableProductToCartSuccess(serverCartResponse, imageBaseUrl);
				}),
				catchError(error => of(new UpdateConfigurableProductToCartFailure()))
			)
		})
	)

	/**
	 * Add To cart action - BASIC
	 * Note: Mapping is done here in order to keep the services DRY - only ONE addProductToCart Method required
	 */
	@Effect()
	addToCartDirectEffect = this.actions.pipe(
		ofType(CartActionsTypes.AddBasicProductToCart),
		withLatestFrom(this.store),
		filter(([action, store]) => {
			const cartCount = store.checkout.cart.ids.length
			return cartCount < MAX_CART_ITEMS
		}),
		exhaustMap(([action, store]) => {
			const productList = store.catalog.productList.selectedProductList;
			const recommendations = store.common.recommendations.recommendations;
			const productRequested = action['isRecommendation'] ?
				recommendations.find(product => product.id === action['productId']) :
				productList.find(product => product.id === action['productId'])
			const addToCartRequest = CartMapper.mapProductToCartRequest(productRequested, store.common.store)
			const itemSource = action['isRecommendation'] ? AddToCartItemSourceEnum.recommendations : AddToCartItemSourceEnum.menu
			return this.cartService.addProductToCart(addToCartRequest, itemSource).pipe(
				map((serverCartResponse) => {
					// Save flag in local storage
					this.cartService.setIsUserHasCart(true);
					const imageBaseUrl = store.common.settings.data.web_links.image_urls.product;
					return new AddBasicProductToCartSuccess(serverCartResponse, imageBaseUrl);
				}),
				catchError(error => of(new AddBasicProductToCartFailure()))
			)
		})
	)
	// effect for incomplete but valid add to cart request for combo
	@Effect()
	addValidIncompleteComboToCart = this.actions.pipe(
		filter(action => action.type === CatalogComboConfigListTypes.AddValidIncompleteComboToCart
		),
		withLatestFrom(this.store),
		filter(([action, store]) => {
			const notConfiguredLineIdsLength = store.common.sdk.sdkResponse.validation.notConfiguredLineIds.length;
			return notConfiguredLineIdsLength > 0
		}),
		map(([action, store]) => {
			const currentProductSlug = store.catalog.comboConfig.activeProductSlug;
			const serverResponseComboProductsArray = store.catalog.comboConfig.entities[currentProductSlug].data.products;
			const notConfiguredLineIdsArray = store.common.sdk.sdkResponse.validation.notConfiguredLineIds
			return new AddValidIncompleteProductToCartRequest(serverResponseComboProductsArray, notConfiguredLineIdsArray);
		})
	)

	@Effect()
	addAdvancedItemToCart = this.actions.pipe(
		ofType(CartActionsTypes.AddAdvancedProductToCart),
		withLatestFrom(this.store),
		filter(([action, store]) => {
			const selectedProduct = action['productId'];
			const cartCount = store.checkout.cart.ids.length

			return cartCount < MAX_CART_ITEMS && (store.catalog.myPizzas.entities[selectedProduct] ? true : false)
		}),
		exhaustMap(([action, store]) => {
			const imageBaseUrl = store.common.settings.data.web_links.image_urls.product;
			const selectedProduct = store.catalog.myPizzas.entities[action['productId']];
			const selectedStore = store.common.store.selectedStore.store_id;
			const isDelivery = store.common.store.isDeliveryTabActive;
			const selectedProductCartRequest = selectedProduct.cart_request;
			const addToCartRequest = {
				store_id: selectedStore,
				is_delivery: isDelivery,
				products: [{
					child_items: selectedProductCartRequest.child_items,
					config_options: selectedProductCartRequest.config_options,

					product_id: selectedProduct.product_id,
					quantity: 1,
					product_option_id: selectedProductCartRequest.product_option_id,
					line_id: selectedProductCartRequest.line_id,
				}]
			} as AddCartServerRequestInterface
			return this.cartService.addProductToCart(addToCartRequest, AddToCartItemSourceEnum.myPizzas).pipe(
				map((serverCartResponse) => {
					// Save flag in local storage
					this.cartService.setIsUserHasCart(true);
					return new AddAdvancedProductToCartSuccess(serverCartResponse, imageBaseUrl);
				}),
				catchError(error => of(new AddAdvancedProductToCartFailure()))
			)
		})
	)

	/**
	 * Add To cart action - COMBO
	 */
	@Effect()
	addComboToCartEffect = this.actions.pipe(
		ofType(CartActionsTypes.AddComboToCart),
		withLatestFrom(this.store),
		filter(([action, store]) => {
			const cartCount = store.checkout.cart.ids.length
			return cartCount < MAX_CART_ITEMS
		}),
		exhaustMap(([action, store]) => {
			const addToCartRequest = store.checkout.cart.addToCartRequest;

			return this.cartService.addProductToCart(addToCartRequest, AddToCartItemSourceEnum.menu).pipe(
				map((serverCartResponse) => {
					// Save flag in local storage
					this.cartService.setIsUserHasCart(true);
					const imageBaseUrl = store.common.settings.data.web_links.image_urls.product;
					return new AddComboToCartSuccess(serverCartResponse, imageBaseUrl);
				}),
				catchError(error => of(new AddComboToCartFailure()))
			)
		})
	)

	/**
	 * Show Too Many Items Failure
	 */
	@Effect()
	tooManyItemsInCart = this.actions.pipe(
		filter(action => action.type === CartActionsTypes.AddComboToCart
			|| action.type === CartActionsTypes.AddBasicProductToCart
			|| action.type === CartActionsTypes.AddConfigurableProductToCart
			|| action.type === CartActionsTypes.AddAdvancedProductToCart
		),
		withLatestFrom(this.store),
		filter(([action, store]) => {
			const cartCount = store.checkout.cart.ids.length;
			return cartCount === MAX_CART_ITEMS
		}),
		map(() => new TooManyItemsInCartFailure())
	)
	/**
	 * If Adding array of products the cart must be less than 25 after all of the products
	 */
	@Effect()
	tooManyItemsInCartForArray = this.actions.pipe(
		filter(action =>
			action.type === CartActionsTypes.AddProductArrayToCart
			|| action.type === CartActionsTypes.AddPizzaAssistantProductsToCart
		),
		withLatestFrom(this.store),
		filter(([action, store]) => {
			const cartCount = store.checkout.cart.ids.length;
			const productArrayCount = action.type === CartActionsTypes.AddProductArrayToCart ?
				store.catalog.justForYou.selectedProductsCartRequest.length :
				store.catalog.pizzaAssistant.ids.length

			return (productArrayCount + cartCount) > MAX_CART_ITEMS
		}),
		map(() => new TooManyItemsInCartFailure())
	)

	/**
	 * Update Combo Item in Cart
	 */
	@Effect()
	updateComboToCartEffect = this.actions.pipe(
		ofType(CartActionsTypes.UpdateComboToCart),
		withLatestFrom(this.store),
		exhaustMap(([action, store]) => {
			const cartItemId = store.catalog.comboConfig.cartItemId;
			const addToCartRequest = this.mapCouponAndMessageToCartRequest(store, cartItemId, true)
			const singleAddToCartRequest = {
				store_id: addToCartRequest.store_id,
				is_delivery: addToCartRequest.is_delivery,
				...addToCartRequest.products[0]
			} as AddToCartProductServerRequestInterface
			return this.cartService.updateProductInCart(singleAddToCartRequest).pipe(
				map((serverCartResponse) => {
					const imageBaseUrl = store.common.settings.data.web_links.image_urls.product;
					return new UpdateComboToCartSuccess(serverCartResponse, imageBaseUrl);
				}),
				catchError(error => of(new UpdateComboToCartFailure()))
			)
		})
	)

	/**
	 * Remove from cart action
	 * TODO what if RemoveCartItemFailure?
	 */
	@Effect()
	removeFromCartEffect = this.actions.pipe(
		ofType(CartActionsTypes.RemoveCartItem),
		withLatestFrom(this.store),
		exhaustMap(([action, store]) => {
			const productCartId = action['productCartId'];
			const serverCart = { ...store.checkout.cart.serverCart };
			return this.cartService.removeProductFromCart(productCartId).pipe(
				map((serverCartResponse) => {
					if (serverCartResponse.products.length <= 0) {
						this.cartService.setIsUserHasCart(false);
					}
					const imageBaseUrl = store.common.settings.data.web_links.image_urls.product;
					return new RemoveCartItemSuccess(serverCartResponse, imageBaseUrl, productCartId, serverCart);
				}),
				catchError(error => of(new RemoveCartItemFailure()))
			)
		})
	)

	/**
	 * Clear Cart Success
	 */
	@Effect({dispatch: false})
	onClearCartSuccess = this.actions.pipe(
		ofType(OrderActionsTypes.ClearCartSuccess),
		map(action => {
			this.cartService.setIsUserHasCart(false);
		})
	)

	/**
	 * Setting add to cart request to product configuration
	 */
	@Effect()
	setTwinAddToCartRequestToConfigurator = this.actions.pipe(
		ofType(ConfiguratorActionsTypes.TwinProductSliderChange),
		withLatestFrom(this.store),
		map(([action, store]) => {
			const activeID = store.catalog.configurableItem.cartItemId;
			const activeCartProduct = store.checkout.cart.addToCartRequest.products[0];
			const lineTwinId = action['newSelectionProductLineId'] as number;
			const twinProduct = activeCartProduct.child_items
				.find(addToCartRequest => addToCartRequest.line_id === lineTwinId);

			return new SetTwinAddToCartRequestToConfigurator(lineTwinId, twinProduct);
		})
	)

	/**
	 * Only on checkout page
	 * If cart alcohol status changes and future order times fetched
	 * than re-fetch future order times
	 */
	@Effect()
	refetchFutureOrder = this.actions.pipe(
		ofType(
			CartActionsTypes.FetchUserCartSuccess,
			CartActionsTypes.AddConfigurableProductToCartSuccess,
			CartActionsTypes.AddBasicProductToCartSuccess,
			CartActionsTypes.AddAdvancedProductToCartSuccess,
			CartActionsTypes.AddComboToCartSuccess,
			CartActionsTypes.AddProductArrayToCartSuccess,
			CartActionsTypes.AddPizzaAssistantProductsToCartSuccess,
			CartActionsTypes.UpdateUserCartSuccess,
			CartActionsTypes.RemoveCartItemSuccess
		),
		withLatestFrom(this.store),
		filter(([action, state]) => {
			const isCheckoutRoute = state.router.state.url.startsWith('/checkout');
			if (!isCheckoutRoute) {
				return false;
			}

			const newCartHasAlcohol = action['serverResponse']['has_alcohol']
			const hasFutureTime = state.checkout.orderDetails.selectedStoreHours !== null
			const previousCartHasAlcohol = state.checkout.cart.previousCartHasAlcohol;
			return hasFutureTime && newCartHasAlcohol !== previousCartHasAlcohol
		}),
		map(([action, store]) => {
			const isDelivery = store.common.store.isDeliveryTabActive;
			const selectedStore = store.common.store.selectedStore;

			return new FetchStoreHoursForCheckout(isDelivery, selectedStore.store_id)
		})
	)

	/**
	 * If we are on /checkout page and serverResponse products is empty redirect to homepage
	 */
	@Effect({ dispatch: false })
	redirectHomeWhenCartEmpty = this.actions.pipe(
		filter(action =>
			action.type === CartActionsTypes.RemoveCartItemSuccess ||
			action.type === '@ngrx/router-store/navigated' ||
			action.type === CartActionsTypes.FetchUserCartSuccess ||
			action.type === CartActionsTypes.UpdateUserCartSuccess ||
			action.type === OrderActionsTypes.ClearCartSuccess
		),
		withLatestFrom(this.store),
		filter(([action, state]) => {
			const userHasCart = this.cartService.getIsUserHasCart();
			const cartIsLoaded = !userHasCart || state.checkout.cart.isFetched;
			const isCheckoutRoute = state.router.state.url.startsWith('/checkout');
			const isOnlyCheckoutPage = !state.router.state.url.startsWith('/checkout/');

			return isCheckoutRoute && isOnlyCheckoutPage && cartIsLoaded;
		}),
		map(([action, store]) => {
			const serverResponse = store.checkout.cart.serverCart;
			if (action.type === OrderActionsTypes.ClearCartSuccess || !serverResponse || serverResponse.products.length < 1) {
				this.router.navigate(['/'])
			}
		})
	)

	@Effect()
	fetchCartSuccessShowPopup = this.actions.pipe(
		ofType(CartActionsTypes.FetchUserCartSuccess),
		withLatestFrom(this.store),
		filter(([action, store]) => {
			const isUserLoggedin = store.user.userLogin.isJwtValid && store.user.userLogin.loggedInUser;
			const isEmployeeDiscount = isUserLoggedin ? store.user.userLogin.loggedInUser.isCartUpdated : false;
			const isLoyaltyRedemtion = action['isLoyalityRedemtion'];
			const cartResponse = action['serverResponse'] as ServerCartResponseInterface
			const isUserCartEmpty = cartResponse.products.length < 1;
			const mpStatus = store.router.state.queryParams['mpstatus'];
			const isMpStatusInUrl = typeof mpStatus === 'string';
			const is3dSecureRedirect = store.router.state.queryParams['error'] === 'secure_payment_fail';


			return (isUserLoggedin && !isEmployeeDiscount) && !isLoyaltyRedemtion && !isUserCartEmpty && !(isMpStatusInUrl || is3dSecureRedirect)
		}),
		map(() => new ShowIncompleteOrderPopup())
	)

	@Effect()
	clearIncompleteOrder = this.actions.pipe(
		ofType(CartActionsTypes.CloseIncompleteOrderPopup),
		filter(action => action['isClearCart']),
		map(() => new ClearCart())
	)

	/**
	 * If the user is logged in and on the checkout page we need to fetch their stores/addresses
	 */
	@Effect()
	fetchUserDetailsOnCheckout = this.actions.pipe(
		filter(action =>
			action.type === '@ngrx/router-store/navigated'
			|| action.type === CartActionsTypes.FetchUserCartSuccess
			|| action.type === SignUpActionTypes.UserLoginSuccess
			|| action.type === SignUpActionTypes.GetUserSummarySuccess),
		withLatestFrom(this.store),
		filter(([action, store]) => {
			const isCheckoutPage = store.router.state.url.startsWith('/checkout');
			const isOnlyCheckoutPage = !store.router.state.url.startsWith('/checkout/');
			const isUserHasCart = store.checkout.cart.isFetched;
			const isLoyaltyRedemtion = action['isLoyalityRedemtion'] ? action['isLoyalityRedemtion'] : false;
			return isCheckoutPage && isOnlyCheckoutPage && isUserHasCart && !isLoyaltyRedemtion
		}),
		flatMap(() => this.applicationHttpClient.renewAuthTokenIfRequired('isCheckoutPage').pipe(
			withLatestFrom(this.store),
			flatMap(([action, store]) => {
				const selectedStore = store.common.store.selectedStore;
				const isDelivery = store.common.store.isDeliveryTabActive;
				const isLoggedIn = store.user.userLogin.loggedInUser;
				const productIds = store.checkout.cart.serverCart.products
					.filter(item => {
						const isCoupon = item.kind === CartItemKindEnum.Coupon;
						const isClub11 = item.kind === CartItemKindEnum.Club11;
						const isGiftCard = item.kind === CartItemKindEnum.GiftCard;
						return !(isCoupon || isClub11 || isGiftCard)
					}).map(item => item.product_id);
				const returnActions = []
				returnActions.push(new FetchStoreHoursForCheckout(isDelivery, selectedStore.store_id))
				returnActions.push(new FetchRecommendations(productIds));
				// only fetch what we need
				if (isLoggedIn) {
					returnActions.push(new LoadAccountPage())
					// returnActions.push(new RequestSavedCards())
					// returnActions.push(new RequestAccountAddresses(true))
					// returnActions.push(new RequestAccountStores(true))
				}
				return returnActions
			})
		))
	)
	// find delivery store for default address
	@Effect()
	getDefaultAddressToFetchStore = this.actions.pipe(
		ofType(AccountActionTypes.RequestAccountAddressesSuccess),
		withLatestFrom(this.store),
		filter(([action, store]) => {
			const isCheckoutPage = store.router.state.url.startsWith('/checkout');
			const isOnlyCheckoutPage = !store.router.state.url.startsWith('/checkout/');
			const userAddresses = action['accountAddresses'] as ServerAddressResponse[];
			const defaultAddress = userAddresses.find(address => address.default_address);
			const selectedAddressId = store.checkout.orderDetails.selectedAddressID;
			const userAddressInput = store.checkout.orderDetails.userDeliveryAddressInput;
			const isMasterPassDecoded = store.checkout.orderDetails.isMpDecodingFetched;

			return isCheckoutPage && isOnlyCheckoutPage && defaultAddress && !selectedAddressId && !isMasterPassDecoded && !userAddressInput
		}),
		map(([action, state]) => {
			const userAddresses = action['accountAddresses'] as ServerAddressResponse[];
			const defaultAddress = userAddresses.find(address => address.default_address);
			return new SelectDeliveryAddressForCheckout(defaultAddress.id)
		})
	)
	// find delivery store for default address
	@Effect()
	getDefaultAddressStore = this.actions.pipe(
		ofType(AccountActionTypes.RequestAccountAddresses),
		withLatestFrom(this.store),
		filter(([action, store]) => {
			const isCheckoutPage = store.router.state.url.startsWith('/checkout');
			const isOnlyCheckoutPage = !store.router.state.url.startsWith('/checkout/');
			const userAddresses = store.user.userAccount.accountAddresses;
			const defaultAddress = userAddresses ? userAddresses.find(address => address.isDefault) : null;
			const selectedAddressId = store.checkout.orderDetails.selectedAddressID;
			const isMasterPassDecoded = store.checkout.orderDetails.isMpDecodingFetched;
			const userAddressInput = store.checkout.orderDetails.userDeliveryAddressInput;

			return isCheckoutPage && isOnlyCheckoutPage && defaultAddress && !selectedAddressId && !isMasterPassDecoded && !userAddressInput
		}),
		map(([action, state]) => {
			const userAddresses = state.user.userAccount.accountAddresses;
			const defaultAddress = userAddresses.find(address => address.isDefault);
			return new SelectDeliveryAddressForCheckout(defaultAddress.addressId)
		})
	)
	/**
	 * Select Default Address For Checkout
	 */
	@Effect()
	selectDefaultAddress = this.actions.pipe(
		ofType(CartActionsTypes.SelectDefaultAddress),
		withLatestFrom(this.store),
		filter(([action, store]) => {
			const isLoggedIn = store.user.userLogin.loggedInUser;
			return isLoggedIn ? true : false
		}),
		map(([action, store]) => {
			const userAddresses = store.user.userAccount.accountAddresses;
			const defaultAddress = userAddresses.find(address => address.isDefault);
			const defaultId = defaultAddress ? defaultAddress.addressId : null;
			return new SelectDeliveryAddressForCheckout(defaultId)

		})
	)
	@Effect()
	fetchDeliveryStore = this.actions.pipe(
		ofType(CartActionsTypes.FetchDeliveryStoreForCheckout),
		withLatestFrom(this.store),
		exhaustMap(([action, state]) => {
			const addressQuery = action['addressQuery'] as AddressListInterface;
			const selectedAddressID = state.checkout.orderDetails.selectedAddressID;
			let addressSearchObject;

			if (selectedAddressID) {
				const userAddresses = state.user.userAccount.accountAddresses;
				const selectedAddress = userAddresses.find(address => address.addressId === selectedAddressID);
				addressSearchObject = {
					address: {
						province: selectedAddress.address.province,
						city: selectedAddress.address.city,
						postal_code: selectedAddress.address.postalCode,
						street_address: selectedAddress.address.streetName,
						street_number: selectedAddress.address.streetNumber
					}
				} as AddressListInterface
			} else {
				addressSearchObject = {
					address_components: addressQuery.address.address_components
				}
			}

			return this.storeService.searchDelivery(addressSearchObject).pipe(
				map(store => new FetchDeliveryStoreForCheckoutSuccess(store, selectedAddressID, addressQuery)),
				catchError(error => of(new FetchDeliveryStoreForCheckoutFailure))
			)
		})
	)
	/**
	 * Validate Store For Checkout
	 */
	// If user is editing an address
	@Effect()
	validateCheckoutWithEditAddress = this.actions.pipe(
		ofType(StoreActionsTypes.SaveUserInput),
		withLatestFrom(this.store),
		filter(([action, store]) => {
			const isDelivery = action['isDelivery'];
			const userAddressInput = action['addressInput'] as AddressListInterface;
			const isMPRedirect = action['isMPRedirect'];
			return isDelivery && userAddressInput.addressId && userAddressInput.addressId !== '' && !isMPRedirect;
		}),
		flatMap(([action, store]) => {
			const userAddressInput = action['addressInput'] as AddressListInterface;

			return this.applicationHttpClient.renewAuthTokenIfRequired('SaveUserInput').pipe(
				withLatestFrom(this.store),
				flatMap(() => {
					console.log('UPDATE USER ADDRESS --->', userAddressInput)

					return [
						new SelectDeliveryAddressForCheckout(userAddressInput.addressId),
						new UpdateAddressRequest(userAddressInput)
					]
				})
			)
		})
	)

	// Update Address Failed
	@Effect()
	validateCheckoutForDeliveryOnUpdateAccountFailed = this.actions.pipe(
		ofType(AccountActionTypes.UpdateAddressRequestFailure),
		withLatestFrom(this.store),
		filter(([action, store]) => {
			const isCheckoutPage = store.router.state.url.startsWith('/checkout');
			const isOnlyCheckoutPage = !store.router.state.url.startsWith('/checkout/');
			const isDelivery = store.checkout.orderDetails.isDelivery;
			return isDelivery && isCheckoutPage && isOnlyCheckoutPage
		}),
		flatMap(action => [
			new SelectDefaultAddress(),
			new ValidateCartFailed(null)
		])
	)
	// Update Address Success -- continue checkout validation flow
	@Effect()
	validateCheckoutForDeliveryOnUpdateAccount = this.actions.pipe(
		ofType(AccountActionTypes.UpdateAddressRequestSuccess),
		withLatestFrom(this.store),
		filter(([action, store]) => {
			const isCheckoutPage = store.router.state.url.startsWith('/checkout');
			// const isOnlyCheckoutPage = !store.router.state.url.startsWith('/checkout/');
			const isDelivery = store.checkout.orderDetails.isDelivery;
			return isDelivery && isCheckoutPage // && isOnlyCheckoutPage
		}),
		map(([action, store]) => {
			const userInputAddress = store.checkout.orderDetails.userDeliveryAddressInput;
			const selectedAddressID = !userInputAddress.address.address_components ? userInputAddress.addressId : null;
			const validateRequest = CartMapper.mapDeliveryStoreValidationRequest(
				selectedAddressID,
				userInputAddress,
				userInputAddress,
			)
			return new ValidateCart(validateRequest, true)
		})
	)

	// // Update Address Success -- continue checkout validation flow
	// @Effect()
	// validateCheckoutForDeliveryOnDefault = this.actions.pipe(
	// 	ofType(StoreActionsTypes.SaveUserInputFromDefaultAddress),
	// 	withLatestFrom(this.store),
	// 	filter(([action, state]) => {
	// 		const isDelivery = state.checkout.orderDetails.isDelivery;
	// 		const isUserHasCart = state.checkout.cart.isFetched;
	// 		const isUserCartEmpty = state.checkout.cart.serverCart
	// 			&& state.checkout.cart.serverCart.products ? state.checkout.cart.serverCart.products.length < 1 : true;

	// 		return isUserHasCart && !isUserCartEmpty && isDelivery
	// 	}),
	// 	map(([action, store]) => {
	// 		const userInputAddress = action['addressInput'];
	// 		const selectedAddressID = store.checkout.orderDetails.selectedAddressID;
	// 		const validateRequest = CartMapper.mapDeliveryStoreValidationRequest(
	// 			selectedAddressID,
	// 			userInputAddress,
	// 			userInputAddress,
	// 		)
	// 		return new ValidateCart(validateRequest, false)
	// 	})
	// )


	// If checkout method is Delivery and NEW address or MasterPass/SecureCheckout Redirect
	@Effect()
	validateCheckoutForDelivery = this.actions.pipe(
		ofType(StoreActionsTypes.SaveUserInput),
		withLatestFrom(this.store),
		filter(([action, store]) => {
			const isDelivery = action['isDelivery'];
			const userAddressInput = action['addressInput'] as AddressListInterface
			const isMPRedirect = action['isMPRedirect'];

			return isDelivery && (!userAddressInput.addressId || userAddressInput.addressId === '' || isMPRedirect)
		}),
		map(([action, store]) => {
			const isDelivery = action['isDelivery'];
			const userInputAddress = action['addressInput'];
			const storeId = action['storeId'];
			const isMPRedirect = action['isMPRedirect'];
			const isStrictValidation = action['isStrictValidation'];

			const selectedAddressID = store.checkout.orderDetails.selectedAddressID;
			const addressObjectFromAccount = store.user.userAccount.accountAddresses ?
				store.user.userAccount.accountAddresses.find(address => address.addressId === selectedAddressID) :
				userInputAddress
			const selectedAddressObject = selectedAddressID ? addressObjectFromAccount : null;
			const validateRequest = CartMapper.mapDeliveryStoreValidationRequest(
				selectedAddressID,
				selectedAddressObject,
				userInputAddress,
			)
			if (storeId && !isMPRedirect) {
				delete (validateRequest.address);
				delete (validateRequest.address_components);
				delete (validateRequest.building_key)
				validateRequest.store_id = storeId;
			}
			return new ValidateCart(validateRequest, isStrictValidation, action['store'], isDelivery, action['isContactLessSelected'])
		})
	);

	// Validate cart after selection from Modal
	// @Effect()
	// validateFromLocationModal = this.actions.pipe(
	// 	ofType(StoreActionsTypes.SaveUserInput),
	// 	map(action => {
	// 		const userInputAddress = action['payload'] as AddressInputInterface
	// 		const selectedStore = action['store'] as StoreServerInterface
	// 		const isDelivery = action['isDelivery']
	// 		const validateRequest = {
	// 			is_delivery: isDelivery
	// 		} as ValidateStoreInterface

	// 		if (isDelivery && userInputAddress.address) {
	// 			validateRequest.address = userInputAddress.address
	// 		} else if (isDelivery && userInputAddress.address_components) {
	// 			validateRequest.address_components = userInputAddress.address_components
	// 		} else {
	// 			validateRequest.store_id = selectedStore.store_id
	// 		}
	// 		return new ValidateCart(validateRequest, false, selectedStore, isDelivery)
	// 	})
	// )

	// Validate checkout for pickup
	@Effect()
	validateCheckoutForPickup = this.actions.pipe(
		ofType(StoreActionsTypes.SaveUserInput),
		withLatestFrom(this.store),
		filter(([action, store]) => {
			const isDelivery = action['isDelivery'];
			return !isDelivery
		}),
		map(([action, store]) => {
			const isDelivery = action['isDelivery'];

			const userInputAddress = action['addressInput'];
			const selectedStore = store.checkout.orderDetails.selectedStoreID;
			const isStrictValidation = action['isStrictValidation'];
			const isContactLessSelected = action['isContactLessSelected']
			const validateRequest = CartMapper.mapPickupStoreValidation(
				selectedStore,
				userInputAddress
			) as ValidateStoreInterface
			return new ValidateCart(validateRequest, isStrictValidation, action['store'], isDelivery, isContactLessSelected)
		})
	)

	/**
	 * Validate user cart (only if the user has one)
	 */
	@Effect()
	validateUserCart = this.actions.pipe(
		ofType(CartActionsTypes.ValidateCart),
		withLatestFrom(this.store),
		filter(([action, state]) => {
			const isUserHasCart = state.checkout.cart.isFetched;
			const isUserCartEmpty = state.checkout.cart.serverCart
				&& state.checkout.cart.serverCart.products ? state.checkout.cart.serverCart.products.length < 1 : true;

			return isUserHasCart && !isUserCartEmpty
		}),
		exhaustMap(([action, state]) => {
			const isStrictValidation = action['isStrictValidation'];
			const validationRequest = action['validateRequest'] as ValidateStoreInterface;
			const isDelivery = validationRequest.is_delivery;
			validationRequest.contactless = action['contactless'];
			this.storeService.setContactLessFromLocalStorage('isContactLess', validationRequest.contactless);
			return this.cartService.validateCart(validationRequest).pipe(
				map(response => {
					const hasValidationError = response.error && response.error.error_code;
					if (hasValidationError && !this.isCardUpdatable(hasValidationError)) {
						return new ShowValidation(response.error, response.store)
					} else if (!hasValidationError) {
						return new ValidateCartSuccess(response, isDelivery, validationRequest.contactless, isStrictValidation)
					} else {
						return new ValidateCartInvalid(response, isDelivery, isStrictValidation)
					}
				}),
				catchError((error) => of(new ValidateCartFailed(error.error)))
			)
		})
	)

	/**
	 * Check get cart and add to card response if it has validation error
	 */
	@Effect()
	handleValidationError = this.actions.pipe(
		ofType(
			CartActionsTypes.FetchUserCartSuccess,
			CartActionsTypes.AddConfigurableProductToCartSuccess,
			CartActionsTypes.AddBasicProductToCartSuccess,
			CartActionsTypes.AddAdvancedProductToCartSuccess,
			CartActionsTypes.AddComboToCartSuccess,
			CartActionsTypes.AddProductArrayToCartSuccess,
			CartActionsTypes.AddPizzaAssistantProductsToCartSuccess,
			OrderActionsTypes.AddOrderToCartSuccess,
			OrderActionsTypes.ValidateRepeatOrderSuccess
		),
		withLatestFrom(this.store),
		filter(([action, state]) =>
			action['serverResponse']
			&& action['serverResponse']['error'] !== null
		),
		map(([action, state]) => new ShowValidation(action['serverResponse']['error'], action['store']))
	)

	/**
	 * If the user does not have a cart, skip validation and simply update the store
	 */
	@Effect()
	validateNoCart = this.actions.pipe(
		ofType(CartActionsTypes.ValidateCart),
		withLatestFrom(this.store),
		filter(([action, state]) => {
			const isUserHasCart = state.checkout.cart.isFetched;
			const isUserCartEmpty = state.checkout.cart.serverCart
				&& state.checkout.cart.serverCart.products ? state.checkout.cart.serverCart.products.length < 1 : true;

			return !isUserHasCart || isUserCartEmpty
		}),
		flatMap(([action, state]) => {
			const store = action['store'];
			const isDelivery = action['isDelivery'];

			return [
				new IsDeliveryTabActive(isDelivery),
				new SelectStore(store)
			]
		})
	)
	/**
	 * If cart validation passes update the user cart (by default there should be no need to remove invalid items)
	 */
	@Effect()
	checkoutIsValidUpdateStore = this.actions.pipe(
		ofType(CartActionsTypes.ValidateCartSuccess),
		filter(action => {
			const storeStatus = action['validationResponse'] as ServerCartStoreValidationInterface;
			const isStrictValidation = action['isStrictValidation']
			const errorCode = storeStatus.error && storeStatus.error.error_code
			const isCartCompletelyValid = isValidationOk(errorCode) || !isStrictValidation

			return isCartCompletelyValid
		}),
		withLatestFrom(this.store),
		flatMap(([action, store]) => {
			const selectedStore = store.common.store.selectedStore;
			let selectedStoreID;
			selectedStoreID = action['validationResponse'] ? action['validationResponse']['store']['store_id'] : selectedStore.store_id;
			const isDelivery = store.common.store.isDeliveryTabActive;
			const cartOptions = {
				removeInvalid: false
			}

			return [
				new UpdateUserCart(cartOptions),
				new FetchStoreHoursForCheckout(isDelivery, selectedStoreID)
			]
		})
	)
	/**
	 * Update user cart
	 */
	@Effect()
	updateUserCart = this.actions.pipe(
		ofType(CartActionsTypes.UpdateUserCart),
		withLatestFrom(this.store),
		exhaustMap(([action, state]) => {
			const imageBaseUrl = state.common.settings.data.web_links.image_urls.product;
			const selectedCheckoutStore = state.checkout.orderDetails.selectedStore;
			const selectedGlobalStore = state.common.store.selectedStore;
			let selectedStore = selectedCheckoutStore || selectedGlobalStore

			const isDeliveryViaCheckout = state.checkout.orderDetails.isDelivery;
			const isDeliveryViaModal = state.common.store.isDeliveryTabActive;
			const isAgeVerified = state.checkout.cart.isAgeVerified
			const skipStoreUpdate = Boolean(action['options']['skipStoreUpdate'])
			const overwriteStore = action['options']['store'] as StoreServerInterface;
			const isKeepValidationState = action['options']['isKeepValidationState'] as boolean;
			selectedStore = overwriteStore ? overwriteStore : selectedStore;

			const updateCartResponse = {
				is_delivery: isDeliveryViaCheckout !== null ? isDeliveryViaCheckout : isDeliveryViaModal,
				store_id: overwriteStore ? overwriteStore.store_id : selectedStore.store_id,
				accept_changes: Boolean(action['options']['removeInvalid']),
				is_age_verified: isAgeVerified || Boolean(action['options']['confirmAge'])
			}
			return this.cartService.updateCart(updateCartResponse).pipe(
				map(response => new UpdateUserCartSuccess(response, imageBaseUrl, selectedStore, skipStoreUpdate, isKeepValidationState)),
				catchError(error => of(new UpdateUserCartFailed()))
			)
		})
	)
	/**
	 * Change the selected store and delivery/pickup tab if update cart successful
	 */
	@Effect()
	updateUserCartSuccess = this.actions.pipe(
		ofType(CartActionsTypes.UpdateUserCartSuccess),
		withLatestFrom(this.store),
		flatMap(([action, state]) => {
			if (action['skipStoreUpdate']) {
				return []
			}
			const response = action['serverResponse'] as ServerCartResponseInterface;
			const store = action['store'];
			const isDelivery = response.is_delivery;
			const contactless = response.contactless;
			if (this.storeService.getContactLessFromLocalStorage('isContactLess') === true) {
				this.storeService.setContactLessFromLocalStorage('isContactLess', contactless)
			}
			return [
				new IsDeliveryTabActive(isDelivery),
				new SelectStore(store)
			]
		})
	)
	/**
	 * When User picks a new store in checkout
	 */
	@Effect()
	selectNewStoreInCheckout = this.actions.pipe(
		ofType(CartActionsTypes.SelectPickupStoreForCheckout),
		withLatestFrom(this.store),
		filter(([action, store]) => {
			const searchList = store.user.userAccount.storeSearchResults;
			return searchList && searchList.length > -1;
		}),
		map(([action, state]) => {
			const selectedId = action['storeId'];
			const searchList = state.user.userAccount.storeSearchResults;
			const selectedStore = searchList.find(store => store.storeId === selectedId);
			return new AddStoreObjectToCheckout(selectedStore);
		})
	)
	/**
	 * Fetch store hours
	 */
	@Effect()
	fetchStoreHoursForCheckout = this.actions.pipe(
		ofType(CartActionsTypes.FetchStoreHoursForCheckout),
		withLatestFrom(this.store),
		exhaustMap(([action, state]) => {
			const storeId = action['storeId'];
			const isDelivery = action['isDelivery'];
			const addressInput = action['addressInput'] as AddressInputInterface;

			const hasAlcohol = Boolean(state.checkout.cart.hasAlcohol)
			let requestPayload = {
				type: isDelivery ? CheckoutTypeEnum.delivery : CheckoutTypeEnum.pickup,
				cart_has_alcohol: hasAlcohol
			} as FutureHoursRequestInterface
			if (storeId) {
				requestPayload = {
					...requestPayload,
					store_id: storeId
				}
			}
			if (addressInput) {
				requestPayload = {
					...requestPayload,
					address_components: addressInput.address_components
				}
			}

			return this.cartService.fetchStoreHours(requestPayload).pipe(
				map(response => new FetchStoreHoursForCheckoutSuccess(response, this.locale)),
				catchError(error => of(new FetchStoreHoursForCheckoutFailure()))
			)
		})
	)

	/**
	 * Add Products As Array To Cart
	 */
	@Effect()
	addProductArrayToCart = this.actions.pipe(
		ofType(CartActionsTypes.AddProductArrayToCart),
		withLatestFrom(this.store),
		filter(([action, store]) => {
			const cartCount = store.checkout.cart.ids.length
			const productArrayCount = store.catalog.justForYou.selectedProductsCartRequest.length
			return (cartCount + productArrayCount) <= MAX_CART_ITEMS
		}),
		exhaustMap(([action, store]) => {
			const storeId = store.common.store.selectedStore.store_id;
			const isDelivery = store.common.store.isDeliveryTabActive;
			const cartProducts = store.catalog.justForYou.selectedProductsCartRequest;
			const addToCartRequest = {
				store_id: storeId,
				is_delivery: isDelivery,
				products: cartProducts
			}
			return this.cartService.addProductToCart(addToCartRequest, AddToCartItemSourceEnum.justForYou).pipe(
				map((serverCartResponse) => {
					this.cartService.setIsUserHasCart(true);
					const imageBaseUrl = store.common.settings.data.web_links.image_urls.product;
					return new AddProductArrayToCartSuccess(serverCartResponse, imageBaseUrl);
				}),
				catchError(error => of(new AddProductArrayToCartFailure()))
			)
		})
	)

	/**
	 * Add Pizza Assisant Products To Cart
	 */
	@Effect()
	addPizzaAssisantToCart = this.actions.pipe(
		ofType(CartActionsTypes.AddPizzaAssistantProductsToCart),
		withLatestFrom(this.store),
		filter(([action, store]) => {
			const cartCount = store.checkout.cart.ids.length
			const productArrayCount = store.catalog.pizzaAssistant.ids.length
			return (cartCount + productArrayCount) <= MAX_CART_ITEMS
		}),
		exhaustMap(([action, store]) => {
			const storeId = store.common.store.selectedStore.store_id;
			const isDelivery = store.common.store.isDeliveryTabActive;
			const pizzaIds = store.catalog.pizzaAssistant.ids;
			const cartProducts = [];
			pizzaIds.forEach(id => {
				const cartProduct = store.catalog.pizzaAssistant.entities[id].cart_request;
				cartProduct.line_id = 1; // line id should always be 1
				cartProducts.push(cartProduct)
			})
			const addToCartRequest = {
				store_id: storeId,
				is_delivery: isDelivery,
				products: cartProducts
			}
			return this.cartService.addProductToCart(addToCartRequest, AddToCartItemSourceEnum.pizzaAssistant).pipe(
				map((serverCartResponse) => {
					this.cartService.setIsUserHasCart(true);
					const imageBaseUrl = store.common.settings.data.web_links.image_urls.product;
					return new AddPizzaAssistantProductsToCartSuccess(serverCartResponse, imageBaseUrl);
				}),
				catchError(error => of(new AddPizzaAssistantProductsToCartFailure()))
			)
		})
	)

	/**
	 * Add Pizza Assistant Success - Navigate To Checkout
	 */
	@Effect({ dispatch: false })
	addPizzaAssistantSuccess = this.actions.pipe(
		ofType(CartActionsTypes.AddPizzaAssistantProductsToCartSuccess),
		map(() => {
			this.router.navigate(['/checkout'])
		})
	)

	/**
	 * Checks is cart update is possible
	 */
	isCardUpdatable(errorCode: ValidateErrorCodeEnum) {
		return errorCode === ValidateErrorCodeEnum.invalid_items
		|| errorCode === ValidateErrorCodeEnum.price_changed
		|| errorCode === ValidateErrorCodeEnum.delivery_charges
	}

	/**
	 * Map extra details to add to cart request
	 */
	mapCouponAndMessageToCartRequest(store, cartItemId?: number, isCombo?: boolean) {
		const addtoCartRequest = store.checkout.cart.addToCartRequest;
		const personalizedMessage = store.catalog.personalTemplates.activePersonalizedForm;
		const activeSlug = isCombo ? store.catalog.comboConfig.activeProductSlug : store.catalog.configurableItem.productSeoTitle;
		const activeID = isCombo ?
			store.catalog.comboConfig.entities[activeSlug].product_id :
			store.catalog.configurableItem.entities[activeSlug].product_id;
		const activeCoupon = store.common.coupons.activeSlug;
		const activeCartProduct = addtoCartRequest.products.find(product => product.product_id === activeID);
		this.appCookie.set('ActiveProductId', activeCartProduct.product_id);
		this.appCookie.set('ActiveSlug', activeSlug);
		const isPersonalizedMessageEmpty = Object.values(personalizedMessage).every(x => (x === null || x === ''));
		if (activeSlug === activeCoupon) {
			activeCartProduct.coupon_key = store.common.coupons.couponKey;
		}
		if (!isPersonalizedMessageEmpty) {
			activeCartProduct.personalized_message = personalizedMessage;
		}
		if (cartItemId) {
			activeCartProduct.cart_item_id = Number(cartItemId)
		}
		addtoCartRequest.products = addtoCartRequest.products.map(product => {
			if (product.product_id === activeID) {
				// TODO - Clean this up
				if (product.child_items && product.child_items.length > 0) {
					product.child_items = product.child_items.map(child => {
						return {
							...child,
							personalized_message: personalizedMessage
						}
					})
				}
				return activeCartProduct
			}
			return product
		})

		return addtoCartRequest
	}

	constructor(
		private actions: Actions,
		private store: Store<State>,
		private applicationHttpClient: ApplicationHttpClient,
		private cartService: CartService,
		private router: Router,
		private storeService: StoreService,
		private appCookie: ApplicationLocalStorageClient,
		@Inject(LOCALE_ID) public locale: string
	) { }
	// tslint:disable-next-line:max-file-line-count
}
