// Core
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

// Http and local storage clients
import { ApplicationHttpClient } from '../../../utils/app-http-client';
import { ServerProcessOrderRequest } from '../models/server-process-order-request';
import { ServerProcessOrderResponse, ServerOrderStatusResponse } from '../models/server-process-order-response';
import { ServerOrderHistoryInterface } from '../models/server-order-details';
import { ServerCartResponseInterface } from '../models/server-cart-response';
import { AddToCartItemSourceEnum } from '../models/server-cart-request';
/**
 * Global application service consumer
 */
@Injectable()
export class OrderService {
	constructor(
		private appHttp: ApplicationHttpClient
	) { }

	/**
	 * Send Order Request
	 */
	submitOrderForProcessing(orderRequest: ServerProcessOrderRequest) {
		const methodPath = 'checkout/api/v1/order/';
		return this.appHttp.post<ServerProcessOrderResponse>(methodPath, orderRequest)
	}

	/**
	 * Fetch all orders
	 */
	getOrderHistory(storeId: number, isDelivery: boolean, cursor?: string) {
		let methodPath = 'checkout/api/v1/order/';
		// TODO - refactor once backend is ready to accept store id and is delivery
		// methodPath = methodPath + '?store_id=' + storeId + '&is_delivery=' + isDelivery;
		methodPath = cursor ? methodPath + '?cursor=' + cursor : methodPath;
		return this.appHttp.get<ServerOrderHistoryInterface>(methodPath)
	}

	/**
	 * Get Order By ID
	 */
	getOrderById(orderId: string) {
		const methodPath = 'checkout/api/v1/order/' + orderId;
		return this.appHttp.get<ServerProcessOrderResponse>(methodPath)
	}

	/**
	 * Get Order Status
	 */
	getOrderStatus(orderId: string): Observable<ServerOrderStatusResponse> {
		const methodPath = 'checkout/api/v1/order/' + orderId + '/status';
		return this.appHttp.get<ServerOrderStatusResponse>(methodPath);
	}

	/**
	 * Add Order To Cart
	 */
	validateOrderToCart(orderId: number, storeId: number, isDelivery: boolean): Observable<ServerCartResponseInterface> {
		const methodPath = 'checkout/api/v1/repeat_order/validate/';
		const body = {
			order_id: orderId,
			is_delivery: isDelivery,
			store_id: storeId,
		}
		return this.appHttp.post(methodPath, body);
	}
	/**
	 * Add Order To Cart
	 */
	addOrderToCart(orderId: number, storeId: number, isDelivery: boolean): Observable<ServerCartResponseInterface> {
		const methodPath = 'checkout/api/v1/customer_cart/repeat_order/';
		const body = {
			order_id: orderId,
			is_delivery: isDelivery,
			store_id: storeId,
			remove_invalid: true
		}
		const itemSourceHeader = {
			name: 'item-source',
			value: AddToCartItemSourceEnum.repeatOrder
		}
		return this.appHttp.post(methodPath, body, [itemSourceHeader]);
	}

	/**
	 * Clear cart
	 */
	clearCart() {
		const methodPath = 'checkout/api/v1/customer_cart/';
		return this.appHttp.delete(methodPath)
	}
}
