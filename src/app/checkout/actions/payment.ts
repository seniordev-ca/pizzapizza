// NG RX
import { Action } from '@ngrx/store';
// Server modules
import {
	MpRedirectUrl,
	MpDecodeCheckoutSuccess
} from '../models/server-payment-response';

/**
 * Checkout payment methods
 */
export enum PaymentActionsTypes {
	FetchMpRedirectUrl = '[Checkout](Payment) FetchMpRedirectUrl',
	FetchMpRedirectUrlSuccess = '[Checkout](Payment) FetchMpRedirectUrlSuccess',
	FetchMpRedirectUrlFailure = '[Checkout](Payment) FetchMpRedirectUrlFailure',

	OpenMpPayment = '[Checkout](Payment) OpenMpPayment',
	OpenMpPaymentSuccess = '[Checkout](Payment) OpenMpPaymentSuccess',
	OpenMpPaymentFailure = '[Checkout](Payment) OpenMpPaymentFailure',

	EncodeCheckoutData = '[Checkout](Payment) EncodeCheckoutData',
	EncodeCheckoutDataSuccess = '[Checkout](Payment) EncodeCheckoutDataSuccess',
	EncodeCheckoutDataFailure = '[Checkout](Payment) EncodeCheckoutDataFailure',

	DecodeCheckoutData = '[Checkout](Payment) DecodeCheckoutData',
	DecodeCheckoutDataSuccess = '[Checkout](Payment) DecodeCheckoutDataSuccess',
	DecodeCheckoutDataFailure = '[Checkout](Payment) DecodeCheckoutDataFailure',

	MpCheckout = '[Checkout](Payment) MpCheckout',

	HandleSuccessMpRedirect = '[Checkout](Payment) HandleSuccessMpRedirect',
	HandleCancelMpRedirect = '[Checkout](Payment) HandleCancelMpRedirect',
	HandleErrorMpRedirect = '[Checkout](Payment) HandleCancelMpRedirect',

	HandleSecurePaymentCheckout = '[Checkout](Payment) Handle Secure Payment Checkout',
	HandleSecurePaymentCheckoutFailure = '[Checkout](Payment) HandleSecurePaymentCheckoutFailure',

	CheckoutReRenderingRequired = '[Checkout](Payment) CheckoutReRenderingRequired',
	CheckoutReRendering = '[Checkout](Payment) CheckoutReRendering'
}

export class FetchMpRedirectUrl implements Action {
	readonly type = PaymentActionsTypes.FetchMpRedirectUrl;
}
export class FetchMpRedirectUrlSuccess implements Action {
	readonly type = PaymentActionsTypes.FetchMpRedirectUrlSuccess;
	constructor(public redirectData: MpRedirectUrl) { }
}
export class FetchMpRedirectUrlFailure implements Action {
	readonly type = PaymentActionsTypes.FetchMpRedirectUrlFailure;
}


export class OpenMpPayment implements Action {
	readonly type = PaymentActionsTypes.OpenMpPayment;
}
export class OpenMpPaymentSuccess implements Action {
	readonly type = PaymentActionsTypes.OpenMpPaymentSuccess;
}
export class OpenMpPaymentFailure implements Action {
	readonly type = PaymentActionsTypes.OpenMpPaymentFailure;
}


export class EncodeCheckoutData implements Action {
	readonly type = PaymentActionsTypes.EncodeCheckoutData;
	constructor(public checkoutServerPayload) { }
}
export class EncodeCheckoutDataSuccess implements Action {
	readonly type = PaymentActionsTypes.EncodeCheckoutDataSuccess;
	constructor(public encodedCheckoutRequest) { }
}
export class EncodeCheckoutDataFailure implements Action {
	readonly type = PaymentActionsTypes.EncodeCheckoutDataFailure;
}


export class DecodeCheckoutData implements Action {
	readonly type = PaymentActionsTypes.DecodeCheckoutData;
	constructor(public encodedCheckoutRequest: string) {}
}
export class DecodeCheckoutDataSuccess implements Action {
	readonly type = PaymentActionsTypes.DecodeCheckoutDataSuccess;
	constructor(public decodedCheckoutData: MpDecodeCheckoutSuccess) {}
}
export class DecodeCheckoutDataFailure implements Action {
	readonly type = PaymentActionsTypes.DecodeCheckoutDataFailure;
}


export class MpCheckout implements Action {
	readonly type = PaymentActionsTypes.MpCheckout;
}

export class HandleSuccessMpRedirect implements Action {
	readonly type = PaymentActionsTypes.HandleSuccessMpRedirect;
}

export class HandleCancelMpRedirect implements Action {
	readonly type = PaymentActionsTypes.HandleCancelMpRedirect;
}
export class HandleErrorMpRedirect implements Action {
	readonly type = PaymentActionsTypes.HandleErrorMpRedirect;
}

export class HandleSecurePaymentCheckout implements Action {
	readonly type = PaymentActionsTypes.HandleSecurePaymentCheckout
	constructor(public html: string, public encodedString: string, public url: string) {}
}

export class HandleSecurePaymentCheckoutFailure implements Action {
	readonly type = PaymentActionsTypes.HandleSecurePaymentCheckoutFailure
	constructor() {}
}

export class CheckoutReRenderingRequired implements Action {
	readonly type = PaymentActionsTypes.CheckoutReRenderingRequired
	constructor() {}
}

export class CheckoutReRendering implements Action {
	readonly type = PaymentActionsTypes.CheckoutReRendering
	constructor() {}
}

// export class RenderCheckoutData implements Action {
// 	readonly type = PaymentActionsTypes.RenderCheckoutData;
// }

export type PaymentActions =
	| FetchMpRedirectUrl
	| FetchMpRedirectUrlSuccess
	| FetchMpRedirectUrlFailure

	| EncodeCheckoutData
	| EncodeCheckoutDataSuccess
	| EncodeCheckoutDataFailure

	| OpenMpPayment
	| OpenMpPaymentFailure

	| DecodeCheckoutData
	| DecodeCheckoutDataSuccess
	| DecodeCheckoutDataFailure

	| MpCheckout

	| HandleSuccessMpRedirect
	| HandleCancelMpRedirect
	| HandleErrorMpRedirect

	| HandleSecurePaymentCheckout
	| HandleSecurePaymentCheckoutFailure

	| CheckoutReRenderingRequired
	| CheckoutReRendering
