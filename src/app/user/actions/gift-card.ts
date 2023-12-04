// NGRX
import { Action } from '@ngrx/store';

// View Models
import {
	GiftCardBalanceResponse, ClubTransactionsResponse
} from '../models/server-models/server-club11';

/**
 * Gift card actions
 */
export enum GiftCardActionTypes {
	FetchGiftCardBalance = '[User](Gift card) FetchGiftCardBalance',
	FetchGiftCardBalanceSuccess = '[User](Gift card) FetchGiftCardBalanceSuccess',
	FetchGiftCardBalanceFailure = '[User](Gift card) FetchGiftCardBalanceFailure',

	FetchGiftCardTransactions = '[User](Gift card) Fetch Gift Card Transaction History',
	FetchGiftCardTransactionsSuccess = '[User](Gift card) Fetch Gift Card Transaction History Success',
	FetchGiftCardTransactionsFailure = '[User](Gift card) Fetch Gift Card Transaction History Failure',
	ClearGiftCardTransactions = '[User](Gift card) Fetch Gift Card Transaction History Clear'
}

export class FetchGiftCardBalance implements Action {
	readonly type = GiftCardActionTypes.FetchGiftCardBalance;
	constructor(public cardNumber: string, public cardPin?: number, public cardToken?: string) { }
}

export class FetchGiftCardBalanceSuccess implements Action {
	readonly type = GiftCardActionTypes.FetchGiftCardBalanceSuccess;
	constructor(public giftCardBalanceResponse: GiftCardBalanceResponse) { }
}

export class FetchGiftCardBalanceFailure implements Action {
	readonly type = GiftCardActionTypes.FetchGiftCardBalanceFailure;
}

export class FetchGiftCardTransactions implements Action {
	readonly type = GiftCardActionTypes.FetchGiftCardTransactions;
	constructor(public cardNumber: string, public cardPin: number) { }
}
export class FetchGiftCardTransactionsSuccess implements Action {
	readonly type = GiftCardActionTypes.FetchGiftCardTransactionsSuccess;
	constructor(public giftCardTransactionsResponse: ClubTransactionsResponse) { }
}
export class FetchGiftCardTransactionsFailure implements Action {
	readonly type = GiftCardActionTypes.FetchGiftCardTransactionsFailure;
}

export class ClearGiftCardTransactions implements Action {
	readonly type = GiftCardActionTypes.ClearGiftCardTransactions;
}
export type GiftCardActions =
	FetchGiftCardBalance
	| FetchGiftCardBalanceSuccess
	| FetchGiftCardBalanceFailure
	| FetchGiftCardTransactions
	| FetchGiftCardTransactionsSuccess
	| FetchGiftCardTransactionsFailure
	| ClearGiftCardTransactions
