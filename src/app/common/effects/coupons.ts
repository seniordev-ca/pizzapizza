// Angular and ngrx
import { Injectable } from '@angular/core';
import { Router } from '../../../../node_modules/@angular/router';

import { Effect, Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { State } from '../reducers';

import { map, catchError, withLatestFrom, exhaustMap, filter, flatMap } from 'rxjs/operators';
import { of } from 'rxjs';
import {
	CouponActionTypes,
	AddCouponSuccess,
	AddCouponFailed,
	CouponInvalid,
	CouponProductPageRefresh
} from '../actions/coupons';

import {
	ConfiguratorActionsTypes
} from '../../catalog/actions/configurator';

import { ServerCouponResponseTypeEnum } from '../models/server-coupon';
import { FetchUserCartViaCouponSuccess } from '../../checkout/actions/cart';
import { ProductKinds } from '../../catalog/models/server-product-config';
import { CouponWalletInvalid, ApplyWalletCouponFailure, ApplyWalletCouponSuccess } from '../actions/coupon-wallet';
import { CouponService } from '../services/coupon.service';

@Injectable()
export class CouponEffects {

	/**
	 * Add Coupon To Cart
	 */
	@Effect()
	requestReserveCoupon = this.actions.pipe(
		filter(action => action.type === CouponActionTypes.AddCoupon || action.type === CouponActionTypes.AddCouponFromWallet),
		withLatestFrom(this.store),
		filter(([action, store]) =>
			store.common.store.selectedStore !== null
			&& action['couponCode'] !== null
		),
		exhaustMap(([action, state]) => {
			const isDelivery = state.common.store.isDeliveryTabActive;
			const selectedStore = state.common.store.selectedStore.store_id;
			const couponCode = action['couponCode'] as string;
			const request = {
				coupon_code: couponCode,
				is_delivery: isDelivery,
				store_id: selectedStore
			}
			return this.couponService.reserveCoupon(request).pipe(
				flatMap(response => {
					const successActions = [];
					successActions.push(new AddCouponSuccess(response, request.coupon_code))

					if (action.type === CouponActionTypes.AddCouponFromWallet) {
						successActions.push(new ApplyWalletCouponSuccess())
					}
					const fetchServerCard = () => {
						const baseUrl = state.common.settings.data.web_links.image_urls.product;
						const cart = response.cart;
						successActions.push(new FetchUserCartViaCouponSuccess(cart, baseUrl))
					}

					const navigateToConfigurator = () => {
						const type = response.config.kind;
						const seoTitle = response.config.seo_title;
						if (type === ProductKinds.combo) {
							this.router.navigate([`/catalog/product-combo/${seoTitle}`])
						} else {
							this.router.navigate([`/catalog/config/${seoTitle}`])
						}
					}

					if (response.read === ServerCouponResponseTypeEnum.Cart) {
						// if coupon successfully add item to cart we need to display the updated cart
						fetchServerCard();
					} else if (response.read === ServerCouponResponseTypeEnum.Config) {
						// if coupon is config item we need to redirect to correct config page
						navigateToConfigurator();
					} else {
						console.error('CRITICAL | Not valid coupon read value');
					}

					// TODO - new action that will bring up the config if the coupon is a free configurable item
					return successActions
				}),
				catchError((response) => {
					if (action.type === CouponActionTypes.AddCouponFromWallet) {
						if (response.error.errors) {
							return of(new CouponWalletInvalid(response.error))
						}
						return of(new ApplyWalletCouponFailure())
					} else {
						if (response.error.errors) {
							return of(new CouponInvalid(response.error))
						}
						return of(new AddCouponFailed(response.error))
					}
				})
			)
		})
	)

	/**
	 * Handle coupon product load without saved coupon key
	 * Happens when user refreshes page on coupon product
	 */
	@Effect()
	handleCouponItemPageRefresh = this.actions.pipe(
		filter(action =>
			// action.type === ConfiguratorActionsTypes.FetchSingleProductSuccess
			// || action.type === ConfiguratorActionsTypes.FetchTwinProductConfigSuccess
			// || action.type === ConfiguratorActionsTypes.FetchSingleConfigurableComboSuccess
			// || action.type === CatalogComboConfigListTypes.FetchComboConfigSuccess
			action.type === ConfiguratorActionsTypes.CopyServerCartToConfigurable
		),
		withLatestFrom(this.store),
		map(([action, state]) => {
			const isCouponKeySaved = state.common.coupons.couponKey;
			const isLoadedProductCoupon = state.catalog.configurableItem.viewProductInfo.isCoupon;

			if (isLoadedProductCoupon && !isCouponKeySaved) {
				console.warn('Coupon product page refresh');
				this.router.navigate(['/']);
			}
			return new CouponProductPageRefresh();
		})
	)

	constructor(
		private actions: Actions,
		private store: Store<State>,
		private couponService: CouponService,
		private router: Router
	) { }
}
