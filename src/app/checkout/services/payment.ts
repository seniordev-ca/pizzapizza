// Core
import { Injectable } from '@angular/core';

// Server Models
import {
	MpRedirectUrl,
	MpEncodeCheckout,
	MpDecodeCheckoutSuccess
} from '../models/server-payment-response';

// Checkout Service
import {
	ServerProcessOrderResponse
} from '../models/server-process-order-response';
import {
	ServerProcessOrderRequest
} from '../models/server-process-order-request';

// Utils
import { ApplicationHttpClient } from '../../../utils/app-http-client';
import { ApplicationLocalStorageClient } from '../../../utils/app-localstorage-client';


/**
 * Service for MP integration
 */
@Injectable()
export class PaymentService {

	constructor(
		private appHttp: ApplicationHttpClient,
		private appCookies: ApplicationLocalStorageClient
	) { }

	/**
	 * Get redirect URL for MP payment portal
	 */
	getMpToken() {
		const methodPath = `checkout/api/v1/payment/masterpass/?source=web`;
		return this.appHttp.get<MpRedirectUrl>(methodPath)
	}

	/**
	 * Checkout using tokenized checkout data and MP token
	 */
	mpCheckout(encodedCheckoutData, token) {
		const methodPath = 'checkout/api/v1/order/masterpass';
		const payload = {
			encoded_order_key: encodedCheckoutData,
			token: token
		};
		return this.appHttp.post<ServerProcessOrderResponse>(methodPath, payload);
	}

	/**
	 * Encode checkout data for checkout and page re-rendering
	 */
	mpEncodePayload(checkoutPayload: ServerProcessOrderRequest) {
		const methodPath = 'checkout/api/v1/order/encode';
		return this.appHttp.post<MpEncodeCheckout>(methodPath, checkoutPayload);
	}

	/**
	 * Decode checkout in case of need of re-rendering
	 */
	mpDecodePayload(encodedOrderKey) {
		const methodPath = 'checkout/api/v1/order/decode';

		const payload = {
			encoded_order_key: encodedOrderKey
		};

		return this.appHttp.post<MpDecodeCheckoutSuccess>(methodPath, payload);
	}

	/**
	 * Redirect to credit card verification URL by injecting
	 */
	renderHtmlToDocument(html: string) {
		// write the html which will open Bambora URL
		document.write(html)
	}

	/**
	 * Handle Secure Checkout Flow
	 */
	saveEncodedOrderToken(encodedOrder: string) {
		// Store Encoded Token in local storage just in case it fails and we need to rerender the checkout page
		this.appCookies.set('secureOrderToken', encodedOrder)
	}

	/**
	 * In case if 3d secure payment fails we need to get a key and re-render checkout page
	 */
	getEncodedOrderToken(): string | null {
		const secureOrderToken = this.appCookies.get('secureOrderToken');
		return secureOrderToken ? secureOrderToken.toString() : null;
	}

	/**
	 * Clear secure checkout object if payment success or if it failed but re-rendered
	 */
	deleteEncodedOrderToken() {
		this.appCookies.deleteKey('secureOrderToken');
	}

}
