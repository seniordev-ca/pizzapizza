import { Action } from '@ngrx/store';
import { ServerCouponWalletResponse } from '../models/server-coupon';
import { ServerValidationError } from '../models/server-validation-error';

/**
 * Coupon Actions
 */
export enum CouponWalletActionTypes {
	CouponWalletInvalid = '[Common](Coupons) Coupon From Wallet Invalid',
	ClearCouponWalletValidation = '[Common](Coupons) Clear Coupon Validation',

	FetchCouponWallet = '[User](Account) Fetch User Coupon Wallet',
	FetchCouponWalletSuccess = '[User](Account) Fetch User Coupon Wallet Success',
	FetchCouponWalletFailure = '[User](Account) Fetch User Coupon Wallet Failure',

	AddCouponToWallet = '[User](Account) Add Coupon To Wallet',
	AddCouponToWalletSuccess = '[User](Account) Add Coupon To Wallet Success',
	AddCouponToWalletFailure = '[User](Account) Add Coupon To Wallet Failure',

	ApplyWalletCoupon = '[User](Account) ApplyWallet Coupon',
	ApplyWalletCouponSuccess = '[User](Account) ApplyWallet Coupon Success',
	ApplyWalletCouponFailure = '[User](Account) ApplyWallet Coupon Failure',

	DeleteCouponFromWallet = '[User](Account) Delete Coupon From Wallet',
	DeleteCouponFromWalletSuccess = '[User](Account) Delete Coupon From Wallet Success',
	DeleteCouponFromWalletFailure = '[User](Account) Delete Coupon From Wallet Failure',

	FilterCouponWallet = '[User](Account) Filter Coupons Wallet Base on Cart',
	ClearCouponWallet = '[User](Account) Clear Coupon Wallet',

	AddDeeplinkCoupon = '[User](Account) Add Deeplink Coupon To State'
}

export class CouponWalletInvalid implements Action {
	readonly type = CouponWalletActionTypes.CouponWalletInvalid
	constructor(public error: ServerValidationError) { }
}

export class ClearCouponWalletValidation implements Action {
	readonly type = CouponWalletActionTypes.ClearCouponWalletValidation
}

export class FetchCouponWallet implements Action {
	readonly type = CouponWalletActionTypes.FetchCouponWallet;
	constructor(public cursor?: string) { }
}
export class FetchCouponWalletSuccess implements Action {
	readonly type = CouponWalletActionTypes.FetchCouponWalletSuccess
	constructor(public response: ServerCouponWalletResponse, public baseUrl: string) { }
}

export class ApplyWalletCoupon implements Action {
	readonly type = CouponWalletActionTypes.ApplyWalletCoupon
	constructor(public couponCode: string) { }
}

export class ApplyWalletCouponSuccess implements Action {
	readonly type = CouponWalletActionTypes.ApplyWalletCouponSuccess
	constructor() { }
}

export class ApplyWalletCouponFailure implements Action {
	readonly type = CouponWalletActionTypes.ApplyWalletCouponFailure
	constructor() { }
}

export class FetchCouponWalletFailure implements Action {
	readonly type = CouponWalletActionTypes.FetchCouponWalletFailure
}
export class AddCouponToWallet implements Action {
	readonly type = CouponWalletActionTypes.AddCouponToWallet
	constructor(public code: string) { }
}
export class AddCouponToWalletSuccess implements Action {
	readonly type = CouponWalletActionTypes.AddCouponToWalletSuccess;
	constructor(public couponCode: string) { }
}
export class AddCouponToWalletFailure implements Action {
	readonly type = CouponWalletActionTypes.AddCouponToWalletFailure;
	constructor(public errorMessage: string) { }
}

export class DeleteCouponFromWallet implements Action {
	readonly type = CouponWalletActionTypes.DeleteCouponFromWallet
	constructor(public couponId: string) { }
}
export class DeleteCouponFromWalletSuccess implements Action {
	readonly type = CouponWalletActionTypes.DeleteCouponFromWalletSuccess
	constructor(public couponId: string, public userCouponCount: number) { }
}
export class DeleteCouponFromWalletFailure implements Action {
	readonly type = CouponWalletActionTypes.DeleteCouponFromWalletFailure
	constructor(public couponId: string) { }
}

export class FilterCouponWallet implements Action {
	readonly type = CouponWalletActionTypes.FilterCouponWallet
	constructor(public couponIds: string[]) {}
}

export class ClearCouponWallet implements Action {
	readonly type = CouponWalletActionTypes.ClearCouponWallet
}

export class AddDeeplinkCoupon implements Action {
	readonly type = CouponWalletActionTypes.AddDeeplinkCoupon
	constructor(public couponCode: string) { }
}

export type CouponWalletActions =
	| CouponWalletInvalid
	| ClearCouponWalletValidation
	| FetchCouponWallet
	| FetchCouponWalletSuccess
	| FetchCouponWalletFailure

	| ApplyWalletCoupon
	| ApplyWalletCouponSuccess
	| ApplyWalletCouponFailure

	| AddCouponToWallet
	| AddCouponToWalletSuccess
	| AddCouponToWalletFailure

	| DeleteCouponFromWallet
	| DeleteCouponFromWalletSuccess
	| DeleteCouponFromWalletFailure
	| FilterCouponWallet
	| ClearCouponWallet

	| AddDeeplinkCoupon

