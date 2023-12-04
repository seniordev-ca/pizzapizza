// Core
import { Injectable } from '@angular/core';

// Server models
import {
	RedeemClubCardRequest,
	RedeemClubCardResponse
} from '../models/server-loyalty';

// App HTTP clients
import { ApplicationHttpClient } from '../../../utils/app-http-client';

@Injectable()
export class LoyaltyService {

	constructor(
		private appHttp: ApplicationHttpClient
	) { }

	/**
	 * Redeem club points
	 */
	redeemLoyaltyCart(redeemRequest: RedeemClubCardRequest) {
		const methodPath = 'checkout/api/v1/club_11_11/redeem/';
		return this.appHttp.post<RedeemClubCardResponse>(methodPath, redeemRequest);
	}

}
