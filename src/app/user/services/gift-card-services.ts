// Angular core
import { Injectable } from '@angular/core';
// NGRX
import { Observable } from 'rxjs';
import { ApplicationHttpClient } from '../../../utils/app-http-client';

// View Models
import {
	GiftCardBalanceRequest,
	GiftCardBalanceResponse
} from '../models/server-models/server-club11';

@Injectable()
export class GiftCardService {

	constructor(
		private appHttp: ApplicationHttpClient,
	) { }

	/**
	 * Fetch Gift Card Balance
	 */
	fetchGiftCardBalanceAndHistory(cardNumber: string, cardPin: number) {
		const methodPath = 'user/api/v1/club_11_11/transactions/gift_card';
		const requestPayload = {
			'number': cardNumber,
			'pin': cardPin
		};
		// return this.appHttp.post<GiftCardBalanceResponse>(methodPath, requestPayload);
		return null;

	}

}
