import { Action } from '@ngrx/store';
import { ServerCouponResponseInterface } from '../models/server-coupon';
import { ServerValidationError } from '../models/server-validation-error';

/**
 * Coupon Actions
 */
export enum CouponActionTypes {
	AddCoupon = '[Common](Coupons) Add Coupon',
	AddCouponFromWallet = '[Common](Coupons) Add Coupon From Wallet',
	AddCouponSuccess = '[Common](Coupons) Add Coupon Success',
	AddCouponFailed = '[Common](Coupons) Add Coupon Failed',

	EditCustomizableCouponProduct = '[Common](Coupons) Edit Customizable Coupon Product',
	CouponInvalid = '[Common](Coupons) Coupon Invalid',
	ClearCouponValidation = '[Common](Coupons) Clear Coupon Validation',
	ClearCoupon = '[Common](Coupons) Clear Coupon State',

	CouponProductPageRefresh = '[Common](Coupons) CouponProductPageRefresh'
}

export class AddCoupon implements Action {
	readonly type = CouponActionTypes.AddCoupon
	constructor(public couponCode: string) { }
}
export class AddCouponFromWallet implements Action {
	readonly type = CouponActionTypes.AddCouponFromWallet
	constructor(public couponCode: string) { }
}
export class AddCouponSuccess implements Action {
	readonly type = CouponActionTypes.AddCouponSuccess
	constructor(public response: ServerCouponResponseInterface, public couponCode: string) { }
}
export class AddCouponFailed implements Action {
	readonly type = CouponActionTypes.AddCouponFailed
	constructor(public error: ServerValidationError) { }
}
export class EditCustomizableCouponProduct implements Action {
	readonly type = CouponActionTypes.EditCustomizableCouponProduct;
	constructor(public key: string, public seoTitle: string) {}
}
export class CouponInvalid implements Action {
	readonly type = CouponActionTypes.CouponInvalid
	constructor(public error: ServerValidationError) { }
}

export class ClearCouponValidation implements Action {
	readonly type = CouponActionTypes.ClearCouponValidation
}

export class ClearCoupon implements Action {
	readonly type = CouponActionTypes.ClearCoupon
}

export class CouponProductPageRefresh implements Action {
	readonly type = CouponActionTypes.CouponProductPageRefresh
}

export type CouponActions =
	| AddCoupon
	| AddCouponFromWallet
	| AddCouponSuccess
	| AddCouponFailed
	| EditCustomizableCouponProduct
	| CouponInvalid
	| ClearCouponValidation
	| ClearCoupon
	| CouponProductPageRefresh
