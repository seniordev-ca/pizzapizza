import {
	createEntityAdapter,
	EntityAdapter,
	EntityState
} from '@ngrx/entity';
import {
	CouponWalletActions,
	CouponWalletActionTypes
} from '../actions/coupon-wallet';
import { CouponItemUIInterface } from '../models/coupon-ui-interface';
import { CouponMapperHelper } from './mappers/coupon-mapper';
import { CouponActions } from '../actions/coupons';

export interface State extends EntityState<CouponItemUIInterface> {
	ids: string[],
	isCouponValid: boolean,
	couponErrorMsg: string,
	couponKey: string,
	activeSlug: string,
	couponWalletCursor: string,
	isLoading: boolean,
	isFetched: boolean,
	deeplinkCoupon: string
}
export const adapter: EntityAdapter<CouponItemUIInterface> =
	createEntityAdapter<CouponItemUIInterface>({
		selectId: (coupon: CouponItemUIInterface) => coupon.id,
		sortComparer: false
	})
export const initialState: State = adapter.getInitialState({
	isCouponValid: null,
	couponErrorMsg: null,
	couponKey: null,
	activeSlug: null,
	ids: [],
	couponWalletCursor: null,
	isLoading: true,
	isFetched: false,
	deeplinkCoupon: null
})

/**
 * Coupon reducer
 */
export function reducer(
	state = initialState,
	action: CouponWalletActions | CouponActions
): State {

	switch (action.type) {

		case CouponWalletActionTypes.CouponWalletInvalid: {
			const errorMsg = action.error.errors.coupon_code
			const walletIds = state.ids;
			const updatedCoupons = walletIds.map(id => {
				return {
					...state.entities[id],
					isLoading: false
				}
			})
			return adapter.upsertMany(updatedCoupons, {
				...state,
				isCouponValid: false,
				couponErrorMsg: errorMsg
			})
		}

		case CouponWalletActionTypes.AddCouponToWalletFailure: {
			const errorMsg = action.errorMessage;
			return {
				...state,
				isCouponValid: false,
				couponErrorMsg: errorMsg,
				isFetched: true,
				isLoading: false
			}
		}
		case CouponWalletActionTypes.ClearCouponWallet: {
			return adapter.removeAll({
				...state,
				isLoading: true,
				isFetched: false,
				couponWalletCursor: null,
				isCouponValid: true,
				couponErrorMsg: null,
				deeplinkCoupon: null
			})
		}
		case CouponWalletActionTypes.ClearCouponWalletValidation: {
			return {
				...state,
				isCouponValid: null,
				couponErrorMsg: null
			}
		}

		case CouponWalletActionTypes.FetchCouponWallet: {
			return {
				...state,
				isLoading: true,
				isFetched: false
			}
		}

		case CouponWalletActionTypes.FetchCouponWalletSuccess: {
			const couponWalletCursor = action.response.cursor;
			const baseUrl = action.baseUrl;
			const coupons = CouponMapperHelper.mapServerCouponToUI(action.response.coupons, baseUrl);
			return adapter.upsertMany(coupons, {
				...state,
				couponWalletCursor,
				isLoading: false,
				isFetched: true,
				deeplinkCoupon: null
			})
		}

		case CouponWalletActionTypes.FetchCouponWalletFailure: {
			return {
				...state,
				isLoading: false,
				isFetched: false
			}
		}

		case CouponWalletActionTypes.DeleteCouponFromWalletSuccess: {
			const couponId = action.couponId;
			return adapter.removeOne(couponId, {
				...state
			})
		}

		case CouponWalletActionTypes.FilterCouponWallet: {
			const addCouponIds = action.couponIds;
			const walletIds = state.ids;
			const updatedCoupons = walletIds.map(id => {
				return {
					...state.entities[id],
					isAdded: addCouponIds.indexOf(id) > -1,
					isLoading: false
				}
			})
			return adapter.upsertMany(updatedCoupons, {
				...state
			})
		}

		case CouponWalletActionTypes.ApplyWalletCoupon: {
			const couponId = action.couponCode;
			const walletIds = state.ids;
			const updatedCoupons = walletIds.map(id => {
				return {
					...state.entities[id],
					isLoading: couponId === id
				}
			})
			return adapter.upsertMany(updatedCoupons, {
				...state,
				isCouponValid: true,
				couponErrorMsg: null
			})
		}

		case CouponWalletActionTypes.AddDeeplinkCoupon: {
			const couponCode = action.couponCode;
			return {
				...state,
				deeplinkCoupon: couponCode
			}
		}

		default: {
			return state
		}
	}
}

export const getIsCouponWalletLoading = (state: State) => {
	return state.isLoading && !state.isFetched;
}
