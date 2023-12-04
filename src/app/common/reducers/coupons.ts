import {
	CouponActions,
	CouponActionTypes
} from '../actions/coupons';
import { ServerCouponResponseTypeEnum } from '../models/server-coupon';
export interface State {
	isCouponValid: boolean,
	couponErrorMsg: string,
	couponKey: string,
	activeSlug: string,
	couponWalletCursor: string,
	isCouponAdded: boolean;
}

export const initialState: State = {
	isCouponValid: null,
	couponErrorMsg: null,
	couponKey: null,
	activeSlug: null,
	couponWalletCursor: null,
	isCouponAdded: null,
}

/**
 * Coupon reducer
 */
export function reducer(
	state = initialState,
	action: CouponActions
): State {

	switch (action.type) {
		case CouponActionTypes.AddCoupon: {
			return {
				...state,
				isCouponValid: null,
				couponErrorMsg: null,
				isCouponAdded: null,
			}
		}

		case CouponActionTypes.AddCouponSuccess: {
			const couponResponse = action.response;
			return {
				...state,
				isCouponValid: true,
				isCouponAdded: true,
				couponKey: couponResponse.coupon_key,
				activeSlug: couponResponse.read === ServerCouponResponseTypeEnum.Config ? couponResponse.config.seo_title : null
			}
		}
		case CouponActionTypes.EditCustomizableCouponProduct: {
			const couponKey = action.key;
			const activeSlug = action.seoTitle;
			return {
				...state,
				isCouponValid: true,
				couponKey,
				activeSlug
			}
		}

		case CouponActionTypes.AddCouponFailed: {
			return {
				...state
			}
		}

		case CouponActionTypes.CouponInvalid: {
			const errorMsg = action.error.errors.coupon_code
			return {
				...state,
				isCouponValid: false,
				isCouponAdded: false,
				couponErrorMsg: errorMsg
			}
		}

		case CouponActionTypes.ClearCouponValidation: {
			return {
				...state,
				isCouponValid: null,
				couponErrorMsg: null
			}
		}

		case CouponActionTypes.ClearCoupon: {
			return initialState
		}

		default: {
			return state
		}
	}
}
