// Core
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// Server models
import {
	AddCartServerRequestInterface,
	GetCartServerRequestInterface,
	FutureHoursRequestInterface,
	AddToCartProductServerRequestInterface,
	ValidateStoreInterface,
	AddToCartItemSourceEnum
} from '../models/server-cart-request';

import {
	ServerCartResponseInterface,
	ServerCartValidationInterface,
	ServerCartStoreValidationInterface
} from '../models/server-cart-response';

// Http and local storage clients
import { ApplicationHttpClient } from '../../../utils/app-http-client';
import { ApplicationLocalStorageClient } from '../../../utils/app-localstorage-client'
import { FutureHoursResponse } from '../models/server-process-order-response';

/**
 * Global application service consumer
 */
@Injectable()
export class CartService {
	constructor(
		private appHttp: ApplicationHttpClient,
		private appCookies: ApplicationLocalStorageClient
	) { }

	/**
	 * Get cart for shop id, and delivery type. That call could mutate server cart state
	 */
	getCart(storeId: number, isDelivery, removeInvalid = false): Observable<ServerCartResponseInterface> {
		const requestPayload: GetCartServerRequestInterface = {
			store_id: storeId,
			is_delivery: isDelivery,
			remove_invalid: removeInvalid
		};
		const methodPath = `checkout/api/v1/customer_cart/`;
		return this.appHttp.post<ServerCartResponseInterface>(methodPath, requestPayload).pipe(
			map(response => {
				const isArray = response.products instanceof Array;
				if (isArray) {
					return response;
				} else {
					const errorMsg = 'Cart Product List is not an Array';
					console.warn(errorMsg)
					throw new Error(errorMsg)
				}
			})
		);
	}

	/**
	 * Add product to cart
	 */
	addProductToCart(requestPayload: AddCartServerRequestInterface, itemSource: AddToCartItemSourceEnum)
		: Observable<ServerCartResponseInterface> {
		const methodPath = `checkout/api/v1/customer_cart/item/`;
		const itemSourceHeader = {
			name: 'item-source',
			value: itemSource
		}
		return this.appHttp.post<ServerCartResponseInterface>(methodPath, requestPayload, [itemSourceHeader]).pipe(
			map(response => {
				const isArray = response.products instanceof Array;
				if (isArray) {
					return response;
				} else {
					const errorMsg = 'Cart Product List is not an Array';
					console.warn(errorMsg)
					throw new Error(errorMsg)
				}
			})
		);
	}
	/**
	 * Update product to cart
	 */
	updateProductInCart(requestPayload: AddToCartProductServerRequestInterface)
		: Observable<ServerCartResponseInterface> {
		const methodPath = `checkout/api/v1/customer_cart/item/`;
		return this.appHttp.put<ServerCartResponseInterface>(methodPath, requestPayload).pipe(
			map(response => {
				const isArray = response.products instanceof Array;
				if (isArray) {
					return response;
				} else {
					const errorMsg = 'Cart Product List is not an Array';
					console.warn(errorMsg)
					throw new Error(errorMsg)
				}
			})
		);
	}

	/**
	 * Update product quantity
	 */
	updateProductQuantityInCart(itemId: number, quantity: number): Observable<ServerCartResponseInterface> {
		const methodPath = `checkout/api/v1/customer_cart/item/quantity/`;
		const requestPayload = {
			cart_item_id: itemId,
			quantity
		}
		return this.appHttp.post<ServerCartResponseInterface>(methodPath, requestPayload).pipe(
			map(response => {
				const isArray = response.products instanceof Array;
				if (isArray) {
					return response;
				} else {
					const errorMsg = 'Cart Product List is not an Array';
					console.warn(errorMsg)
					throw new Error(errorMsg)
				}
			})
		);
	}
	/**
	 * Remove product from cart
	 */
	removeProductFromCart(cartItemId: string)
		: Observable<ServerCartResponseInterface> {
		const methodPath = `checkout/api/v1/customer_cart/item/?cart_item_id=${cartItemId}`;
		return this.appHttp.delete<ServerCartResponseInterface>(methodPath).pipe(
			map(response => {
				const isArray = response.products instanceof Array;
				if (isArray) {
					return response;
				} else {
					const errorMsg = 'Cart Product List is not an Array';
					console.warn(errorMsg)
					throw new Error(errorMsg)
				}
			})
		);
	}

	/**
	 * Setting flag in local storage that fetch cart is required on page reload
	 */
	setIsUserHasCart(hasCart: boolean) {
		if (hasCart) {
			this.appCookies.set('userHasCart', true)
		} else {
			this.appCookies.deleteKey('userHasCart');
		}
	}

	/**
	 * Checking has cart saved on server
	 */
	getIsUserHasCart(): boolean {
		return this.appCookies.exists('userHasCart');
	}

	/**
	 * Fetch Future Hours
	 */
	fetchStoreHours(storeHoursRequest: FutureHoursRequestInterface) {
		const methodPath = 'store/api/v1/future_orders/';
		return this.appHttp.post<FutureHoursResponse[]>(methodPath, storeHoursRequest)
	}

	/**
	 * Validate Cart
	 */
	validateCart(validateRequest: ValidateStoreInterface) {
		// If address components are passed to this we need to tell the backend if they are complete.
		// Reason for this is that user can submit incomplete address via header and less validation should take place
		// User should not be able to get to this point via checkout page if address_components are not complete
		const addressComponents = validateRequest.address_components;
		let isAddressComplete = validateRequest.is_delivery;
		if (addressComponents && validateRequest.is_delivery) {
			let placeTypes = [];
			addressComponents.forEach(component => {
				placeTypes = placeTypes.concat(component.types)
			})
			const minimumRequirements = ['street_number'];
			isAddressComplete = minimumRequirements.filter(min => placeTypes.indexOf(min) > -1).length > 0;
		}
		validateRequest.is_address_complete = isAddressComplete;


		const methodPath = 'checkout/api/v1/customer_cart/validate/';
		return this.appHttp.post<ServerCartStoreValidationInterface>(methodPath, validateRequest)
	}

	/**
	 * Update User Cart
	 */
	updateCart(updateCartRequest): Observable<ServerCartResponseInterface> {
		const methodPath = 'checkout/api/v1/customer_cart/';
		return this.appHttp.post<ServerCartResponseInterface>(methodPath, updateCartRequest)
	}
}
