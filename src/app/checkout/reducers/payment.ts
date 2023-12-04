// ngrx core
// Actions
import {
	PaymentActions,
	PaymentActionsTypes
} from '../actions/payment';

import {
	OrderActions,
	OrderActionsTypes
} from '../actions/orders';
import { CartActionsTypes, CartActions } from '../actions/cart';

export interface State {
	isMpRedirectUrlLoading: boolean,
	isMpRedirectUrlFetched: boolean,

	isMpEncodingLoading: boolean,
	isMpEncodingFetched: boolean,

	isMpDecodingLoading: boolean,
	isMpDecodingFetched: boolean,

	isCheckoutReRenderingLoading: boolean,

	mpCheckoutRequestToken: string,
	mpCheckoutRedirectUrl: string,

	securePaymentHTML: string,
	isCheckoutReRenderingRequired: boolean
}

const initialState: State = {
	isMpRedirectUrlLoading: false,
	isMpRedirectUrlFetched: false,

	isMpEncodingLoading: false,
	isMpEncodingFetched: false,

	isMpDecodingLoading: false,
	isMpDecodingFetched: false,

	isCheckoutReRenderingLoading: false,

	mpCheckoutRequestToken: null,
	mpCheckoutRedirectUrl: null,

	securePaymentHTML: null,
	isCheckoutReRenderingRequired: false
}

/**
 * Payment reducer
 */
export function reducer(
	state = initialState,
	action: PaymentActions | OrderActions | CartActions
): State {
	switch (action.type) {

		/**
		 * Fetching MP redirect URL
		 */
		case PaymentActionsTypes.FetchMpRedirectUrl: {
			return {
				...state,
				isMpRedirectUrlLoading: true,
				isMpRedirectUrlFetched: false,
			}
		}

		case PaymentActionsTypes.FetchMpRedirectUrlSuccess: {
			const redirectUrl = action['redirectData']['redirect_url'] as string;

			return {
				...state,
				isMpRedirectUrlLoading: false,
				isMpRedirectUrlFetched: true,
				mpCheckoutRedirectUrl: redirectUrl
			}
		}

		case PaymentActionsTypes.FetchMpRedirectUrlFailure: {
			return {
				...state,
				isMpRedirectUrlLoading: false,
				isMpRedirectUrlFetched: false,
			}
		}

		/**
		 * Encoding checkout request for page re-rendering
		 */
		case PaymentActionsTypes.EncodeCheckoutData: {
			return {
				...state,
				isMpEncodingLoading: true,
				isMpEncodingFetched: false,
			}
		}

		case PaymentActionsTypes.EncodeCheckoutDataSuccess: {

			const token = action['encodedCheckoutRequest']['encoded_order_key'] as string;
			return {
				...state,
				mpCheckoutRequestToken: token,
				isMpEncodingLoading: false,
				isMpEncodingFetched: true,
			}
		}

		case PaymentActionsTypes.EncodeCheckoutDataFailure: {
			return {
				...state,
				isMpEncodingLoading: false,
				isMpEncodingFetched: false,
			}
		}

		case PaymentActionsTypes.HandleSuccessMpRedirect:
		case PaymentActionsTypes.DecodeCheckoutData: {
			return {
				...state,
				isCheckoutReRenderingLoading: true
			}
		}

		// Redirect back from MP portal
		case OrderActionsTypes.ProcessOrderRequestSuccess:
		case OrderActionsTypes.ProcessOrderRequestFailure:
		case PaymentActionsTypes.DecodeCheckoutDataFailure:
		case PaymentActionsTypes.HandleSecurePaymentCheckoutFailure:
		case CartActionsTypes.ValidateCartSuccess: {
			return {
				...state,
				isCheckoutReRenderingLoading: false
			}
		}

		case PaymentActionsTypes.CheckoutReRenderingRequired: {
			return {
				...state,
				isCheckoutReRenderingRequired: true
			}
		}

		case PaymentActionsTypes.CheckoutReRendering: {
			return {
				...state,
				isCheckoutReRenderingRequired: false
			}
		}

		default: {
			return state
		}
	}
}


export const isMpRedirectLoading = (state: State) => {
	return state.isMpRedirectUrlLoading || state.isMpEncodingLoading || state.isCheckoutReRenderingLoading;
}
