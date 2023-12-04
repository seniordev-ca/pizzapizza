// Angular Core
import { Injectable } from '@angular/core';

// Ng Rx
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import {
	map,
	catchError,
	withLatestFrom,
	exhaustMap,
	filter,
	flatMap
} from 'rxjs/operators';
import { of } from 'rxjs';

// Redux implementation
import { State } from '../reducers';
import { GlobalActionsTypes } from '../../common/actions/global';

// Services
import { CouponService } from '../services/coupon.service';

// Actions
import { AddCouponFromWallet } from '../actions/coupons';
import {
	CouponWalletActionTypes,
	FetchCouponWalletSuccess,
	FetchCouponWalletFailure,
	AddCouponToWalletSuccess,
	AddCouponToWalletFailure,
	DeleteCouponFromWalletSuccess,
	DeleteCouponFromWalletFailure,
	FetchCouponWallet,
	FilterCouponWallet,
	ClearCouponWallet
} from '../actions/coupon-wallet';
import { CartActionsTypes } from '../../checkout/actions/cart';
import { ApplicationHttpClient } from '../../../utils/app-http-client';
import { SignUpActionTypes } from '../../user/actions/sign-up-actions';
import { ReloadJustForYou } from 'app/catalog/actions/just-for-you';

// import { Router } from '../../../../node_modules/@angular/router';

// TODO move that util from here to shared folder among all effects
class EffectsNavigationUtils {

	/**
	 * TODO should check array to all pages where coupons view should be mount
	 */
	static isCouponWalletUrl(url) {
		return url.startsWith('/user/club-eleven-eleven')
	}
}

@Injectable()
export class CouponWalletEffects {

	/**
	 * Fetch save coupons for pages where it is required
	 */
	// @Effect()
	// loadPageWithCouponWallet = this.actions.pipe(
	// 	filter(action =>
	// 		action.type === '@ngrx/router-store/navigated'
	// 		|| action.type === GlobalActionsTypes.AppInitialLoadSuccess
	// 		|| action.type === SignUpActionTypes.UserLoginSuccess
	// 		|| action.type === SignUpActionTypes.GetUserSummarySuccess
	// 	),
	// 	withLatestFrom(this.store),
	// 	filter(([action, state]) => {
	// 		const isAppLaunched = state.common.settings.isFetched && state.common.store.selectedStore;
	// 		const isUserSignedInHasCoupons = state.user.userLogin.loggedInUser ? state.user.userLogin.loggedInUser.userHasCouponsInWallet : false;
	// 		const isClubElevenElevenUrl = EffectsNavigationUtils.isCouponWalletUrl(state.router.state.url);
	// 		const isCouponWalletFetchRequired = isAppLaunched && isClubElevenElevenUrl && isUserSignedInHasCoupons;

	// 		return isCouponWalletFetchRequired;
	// 	}),
	// 	flatMap(() => this.applicationHttpClient.renewAuthTokenIfRequired('isCouponWalletFetchRequired').pipe(
	// 		withLatestFrom(this.store),
	// 		flatMap(action => [
	// 			new ClearCouponWallet(),
	// 			new FetchCouponWallet()
	// 		])
	// 	))
	// )

	/**
	 * Proxy coupon add action
	 */
	@Effect()
	applyWalletCoupon = this.actions.pipe(
		ofType(CouponWalletActionTypes.ApplyWalletCoupon),
		withLatestFrom(this.store),
		filter(([action, state]) => {
			const isClubElevenElevenUrl = EffectsNavigationUtils.isCouponWalletUrl(state.router.state.url);
			return isClubElevenElevenUrl
		}),
		map(([action, state]) => {
			const couponCode = action['couponCode'];
			return new AddCouponFromWallet(couponCode);
		})
	)

	/**
	 * Fetch Users Coupon Wallet
	 */
	@Effect()
	fetchCouponWallet = this.actions.pipe(
		ofType(CouponWalletActionTypes.FetchCouponWallet),
		withLatestFrom(this.store),
		filter(([action, state]) => {
			const isAppLaunched = state.common.settings.isFetched && state.common.store.selectedStore;
			const isUserSignedInHasCoupons = state.user.userLogin.loggedInUser ? state.user.userLogin.loggedInUser.userHasCouponsInWallet : false;
			const isClubElevenElevenUrl = EffectsNavigationUtils.isCouponWalletUrl(state.router.state.url);
			const isCouponWalletFetchRequired = isAppLaunched && isClubElevenElevenUrl && isUserSignedInHasCoupons;
			const isCouponWalletFetched = state.common.couponWallet.isFetched && action['cursor'] === null;
			return isCouponWalletFetchRequired && !isCouponWalletFetched;
		}),
		exhaustMap(([action, store]) => {
			const cursor = action['cursor'] as string;
			const baseUrl = store.common.settings.data.web_links.image_urls.product;
			return this.couponService.fetchUserCouponWallet(cursor).pipe(
				map(response => new FetchCouponWalletSuccess(response, baseUrl)),
				catchError(error => of(new FetchCouponWalletFailure()))
			)
		})
	)

	/**
	 * Fetch Users Coupon Wallet
	 */
	@Effect()
	fetchCouponWalletNotRequired = this.actions.pipe(
		ofType(CouponWalletActionTypes.FetchCouponWallet),
		withLatestFrom(this.store),
		filter(([action, state]) => {
			const isAppLaunched = state.common.settings.isFetched && state.common.store.selectedStore;
			const isUserSignedInHasCoupons = state.user.userLogin.loggedInUser ? state.user.userLogin.loggedInUser.userHasCouponsInWallet : false;
			const isClubElevenElevenUrl = EffectsNavigationUtils.isCouponWalletUrl(state.router.state.url);
			const isCouponWalletFetchRequired = isAppLaunched && isClubElevenElevenUrl && isUserSignedInHasCoupons;
			return !isCouponWalletFetchRequired;
		}),
		map(([action, store]) => {
			return new FetchCouponWalletFailure()
		})
	)

	/**
	 * Add Coupon to wallet - TODO: how do we add coupon on the front end when data returned is simply boolean?
	 */
	@Effect()
	addCouponToWallet = this.actions.pipe(
		ofType(CouponWalletActionTypes.AddCouponToWallet),
		exhaustMap((action) => {
			const code = action['code'] as string;
			return this.couponService.addCouponToWallet(code).pipe(
				map(response => new AddCouponToWalletSuccess(code)),
				catchError(responseError => {
					let errorMessage = '';
					try {
						errorMessage = responseError['error']['errors']['coupon_code'];
					} catch (e) {
						console.error(`CRITICAL | Server didn't return add coupon to wallet error message`);
						console.log(e);
					}
					return of(new AddCouponToWalletFailure(errorMessage));
				})
			)
		})
	)

	/**
	 * TEMP - TODO how do we handle pagination when we add a new coupon to the wallet?
	 */
	@Effect()
	syncCouponWallet = this.actions.pipe(
		ofType(CouponWalletActionTypes.AddCouponToWalletSuccess),
		map(action => new FetchCouponWallet())
	)

	/**
	 * Delete Coupon From Wallet
	 */
	@Effect()
	deleteCouponFromWallet = this.actions.pipe(
		ofType(CouponWalletActionTypes.DeleteCouponFromWallet),
		withLatestFrom(this.store),
		exhaustMap(([action, store]) => {
			const couponId = action['couponId'] as string;
			const couponCount = store.common.couponWallet.ids.length

			return this.couponService.deleteCouponFromWallet(couponId).pipe(
				map(response => new DeleteCouponFromWalletSuccess(couponId, couponCount)),
				catchError(error => of(new DeleteCouponFromWalletFailure(couponId)))
			)
		})
	)

	/**
	 * Reload JFY if coupon added or removed
	 */
	@Effect()
	reloadJustForYou = this.actions.pipe(
		filter(action => action.type === CouponWalletActionTypes.AddCouponToWalletSuccess ||
			action.type === CouponWalletActionTypes.DeleteCouponFromWalletSuccess),
		map(() => new ReloadJustForYou())
	)

	/**
	 * Filter Coupons In Wallet Based on Cart
	 */
	@Effect()
	filterCouponWallet = this.actions.pipe(
		filter(action => action.type === CouponWalletActionTypes.FetchCouponWalletSuccess ||
			action.type === CartActionsTypes.FetchUserCartSuccess ||
			action.type === CartActionsTypes.FetchUserCartViaCouponSuccess ||
			action.type === CartActionsTypes.RemoveCartItemSuccess),
		withLatestFrom(this.store),
		filter(([action, store]) => {
			return store.checkout.cart.serverCart && store.checkout.cart.serverCart.coupon ? true : false
		}),
		map(([action, store]) => {
			const wallet = store.common.couponWallet.ids;
			const cartCoupons = store.checkout.cart.serverCart.coupon.coupons
				.filter(coupon => wallet.indexOf(coupon.coupon_code) > -1)
				.map(couponItem => {
					return couponItem.coupon_code
				})

			return new FilterCouponWallet(cartCoupons)
		})
	)

	constructor(
		private actions: Actions,
		private store: Store<State>,
		private couponService: CouponService,
		private applicationHttpClient: ApplicationHttpClient
		// private router: Router
	) { }
}
