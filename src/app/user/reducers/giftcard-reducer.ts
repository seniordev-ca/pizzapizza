// Models
import { GiftCardBalanceResponse, ClubTransactionsResponse } from '../models/server-models/server-club11';


// Actions
import { GiftCardActions, GiftCardActionTypes } from '../actions/gift-card';



export interface State {
	isGiftCardLoading: boolean
	isGiftCardFetched: boolean
	giftCardDetails: GiftCardBalanceResponse,
	transactionCursor: string,
	transactionHistory: ClubTransactionsResponse
}

export const initialState: State = {
	giftCardDetails: null,
	isGiftCardLoading: false,
	isGiftCardFetched: false,
	transactionCursor: null,
	transactionHistory: null
}

/**
 * Sign Up Reducer
 */
export function reducer(
	state = initialState,
	action: GiftCardActions
): State {

	switch (action.type) {

		case GiftCardActionTypes.FetchGiftCardBalance: {
			return {
				...state,
				isGiftCardLoading: true,
				isGiftCardFetched: false,
				giftCardDetails: null
			}
		}
		case GiftCardActionTypes.FetchGiftCardBalanceSuccess: {
			const cardDetails = action.giftCardBalanceResponse
			return {
				...state,
				isGiftCardFetched: true,
				isGiftCardLoading: false,
				giftCardDetails: cardDetails
			}
		}

		case GiftCardActionTypes.FetchGiftCardTransactions:
		case GiftCardActionTypes.FetchGiftCardTransactionsFailure:
		case GiftCardActionTypes.ClearGiftCardTransactions: {
			return {
				...state,
				transactionCursor: null,
				transactionHistory: null
			}
		}

		case GiftCardActionTypes.FetchGiftCardTransactionsSuccess: {
			const transactionHistory = action.giftCardTransactionsResponse;
			const cursor = transactionHistory.cursor
			return {
				...state,
				transactionCursor: cursor,
				transactionHistory
			}
		}

		case GiftCardActionTypes.FetchGiftCardBalanceFailure: {
			return {
				...state,
				isGiftCardFetched: false,
				isGiftCardLoading: false,
				giftCardDetails: {
					balance: 0,
					card_balance_token: null
				}
			}
		}
		default: {
			return state;
		}
	}
}
