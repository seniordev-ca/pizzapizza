// Core
import { Injectable } from '@angular/core';

// App http client
import { ApplicationHttpClient } from '../../../utils/app-http-client';

// Server Models
import {
	Club11BalanceResponse,
	ClubTransactionsResponse,
	GiftCardBalanceRequest,
	GiftCardBalanceResponse,
	ServerTransferBalanceRequest,
	ServerGiftCardBalance,
	ServerClub1111AddFundsSettings,
	ServerClub111AddFundsRequest,
	ServerClub1111AutoReloadSettings
} from '../models/server-models/server-club11'
import { Observable } from 'rxjs';

@Injectable()
export class Club11Service {
	constructor(
		private appHttp: ApplicationHttpClient,
	) { }

	/**
	 * Fetch account details
	 */
	fetchClub11Balance(cardToken: string) {
		const methodPath = 'user/api/v1/club_11_11/balance';
		const requestPayload = {
			loyalty_card_token: cardToken
		};

		return this.appHttp.get<Club11BalanceResponse>(methodPath, requestPayload);
	}

	/**
	 * Fetch account details
	 */
	fetchClub11Transactions(cardToken: string) {
		const methodPath = 'user/api/v1/club_11_11/transactions';
		const requestPayload = {
			loyalty_card_token: cardToken
		};

		return this.appHttp.get<ClubTransactionsResponse>(methodPath, requestPayload);
	}

	/**
	 * Fetch Balance Via Card and Pin
	 */
	fetchClubBalanceViaNumber(cardNumber: string, cardPin: string, cardToken?: string): Observable<GiftCardBalanceResponse> {
		const methodPath = 'user/api/v1/club_11_11/balance/gift_card';
		let request = {}
		if (cardToken) {
			request = {
				card_balance_token: cardToken
			}
		} else {
			request = {
				number: cardNumber,
				pin: cardPin
			}
		}

		return this.appHttp.post<GiftCardBalanceResponse>(methodPath, request);
	}

	/**
	 * Transfer Balance
	 */
	transferCardBalance(request: ServerTransferBalanceRequest): Observable<ServerGiftCardBalance> {
		const methodPath = 'user/api/v1/club-11-11/balance/transfer'
		return this.appHttp.post<ServerGiftCardBalance>(methodPath, request)
	}

	/**
	 * fetch Transactions via Gift Card
	 */
	fetchGiftCardTransactions(cardNumber: string, cardPin: number, cursor: string) {
		const methodPath = 'user/api/v1/club_11_11/transactions/gift_card';
		const requestPayload = {
			number: cardNumber,
			pin: cardPin,
		} as GiftCardBalanceRequest
		if (cursor) {
			requestPayload.cursor = cursor
		}

		// return this.appHttp.post<ClubTransactionsResponse>(methodPath, requestPayload);
		return null;
	}

	/**
	 * Delete Club Card
	 */
	deleteClubCard() {
		const methodPath = 'user/api/v1/club_11_11/'
		return this.appHttp.delete(methodPath)
	}

	/**
	 * Fetch Add Funds Settings
	 */
	fetchAddFundsSettings(): Observable<ServerClub1111AddFundsSettings> {
		const methodPath = 'user/api/v1/club_11_11/add_funds/settings'
		return this.appHttp.get<ServerClub1111AddFundsSettings>(methodPath)
	}

	/**
	 * Add Funds Request
	 */
	addClubFunds(request: ServerClub111AddFundsRequest): Observable<Club11BalanceResponse> {
		const methodPath = 'user/api/v1/club_11_11/add_funds';
		return this.appHttp.post(methodPath, request)
	}

	/**
	 * Add Funds Request
	 */
	autoReloadClubFunds(request: ServerClub1111AutoReloadSettings): Observable<ServerClub1111AutoReloadSettings> {
		const methodPath = 'user/api/v1/club_11_11/add_funds/auto';
		return this.appHttp.post(methodPath, request)
	}

	/**
	 * Update Add Funds Request
	 */
	autoReloadClubFundsUpdate(request: ServerClub1111AutoReloadSettings): Observable<ServerClub1111AutoReloadSettings> {
		const methodPath = 'user/api/v1/club_11_11/add_funds/auto';
		return this.appHttp.put(methodPath, request)
	}

	/**
	 * Delete Add Funds Request
	 */
	autoReloadClubFundsDelete(): Observable<ServerClub1111AutoReloadSettings> {
		const methodPath = 'user/api/v1/club_11_11/add_funds/auto';
		return this.appHttp.delete(methodPath)
	}


	/**
	 * Fetch Auto Reload Settings
	 */
	fetchAutoReloadSettings(): Observable<ServerClub1111AutoReloadSettings> {
		const methodPath = 'user/api/v1/club_11_11/add_funds/auto'
		return this.appHttp.get<ServerClub1111AutoReloadSettings>(methodPath)
	}

	/**
	 * Send Club Number Email
	 */
	sendClubNumber() {
		const methodPath = 'user/api/v1/club-11-11/send_card_info';
		return this.appHttp.get(methodPath)
	}
}
