import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApplicationHttpClient } from '../../../utils/app-http-client';

import { ServerCouponRequestInterface, ServerCouponResponseInterface, ServerCouponWalletResponse } from '../models/server-coupon';

@Injectable()
export class CouponService {
	constructor(
		private appHttp: ApplicationHttpClient
	) { }

	/**
	 * Reserve Coupon
	 */
	reserveCoupon(requestPayload: ServerCouponRequestInterface): Observable<ServerCouponResponseInterface> {
		const methodPath = 'checkout/api/v1/coupons/reserve_coupon/';
		return this.appHttp.post<ServerCouponResponseInterface>(methodPath, requestPayload)
	}

	/**
	 * Get User Coupon Wallet
	 */
	fetchUserCouponWallet(cursor: string): Observable<ServerCouponWalletResponse> {
		const apiPath = cursor ? 'user/api/v1/coupons/?cursor=' + cursor : 'user/api/v1/coupons/';
		return this.appHttp.get<ServerCouponWalletResponse>(apiPath);
	}

	/**
	 * Add Coupon To Wallet
	 */
	addCouponToWallet(code: string): Observable<{success: boolean}> {
		const apiPath =  'user/api/v1/coupons/';
		const requestBody = {
			coupon_code: code
		}
		return this.appHttp.post<{success: boolean}>(apiPath, requestBody);
	}

	/**
	 * Delete Coupon From Wallet
	 */
	deleteCouponFromWallet(id: string): Observable<{success: boolean}> {
		const apiPath =  'user/api/v1/coupons/' + id;
		return this.appHttp.delete<{success: boolean}>(apiPath);
	}
}
