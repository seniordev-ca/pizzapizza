// Angular Core
import { Injectable } from '@angular/core';
// Ng Rx
import { Store } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';

import { State } from '../../root-reducer/root-reducer';

// Reactive operators
import { map, exhaustMap, withLatestFrom, catchError, filter, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';

// Actions
import {
	FetchJustForYouSuccess,
	FetchJustForYouFailure,

	JustForYouTypes,
	GetJustForYouProductList,
	FetchJustForYou,
	FetchJustForYouProductList,
	FetchJustForYouProductListSuccess,
	FetchJustForYouProductListFailure
} from '../actions/just-for-you';

// Services
import { JustForYouService } from '../services/just-for-you';
import { GlobalActionsTypes } from '../../common/actions/global';
import { ApplicationHttpClient } from '../../../utils/app-http-client';

@Injectable()
export class JustForYouEffects {
	@Effect()
	fetchFeaturedProduct = this.actions.pipe(
		ofType(JustForYouTypes.FetchJustForYou),
		withLatestFrom(this.store),
		filter(([action, state]) => state.common.store.selectedStore !== null),
		exhaustMap(() => this.applicationHttpClient.renewAuthTokenIfRequired('FetchJustForYou').pipe(
			withLatestFrom(this.store),
			exhaustMap(([action, state]) => {
				const baseUrl = state.common.settings.data.web_links.image_urls.just_for_you;
				const categoryBase = state.common.settings.data.web_links.image_urls.category;

				const storeId = state.common.store.selectedStore.store_id;
				return this.justForYouService.getJustForYouSlides(storeId).pipe(
					map((response) => new FetchJustForYouSuccess(response, baseUrl, categoryBase)),
					catchError(error => of(new FetchJustForYouFailure()))
				)
			})
		))
	)

	@Effect()
	loadJustForYouList = this.actions.pipe(
		filter(action =>
			action.type === '@ngrx/router-store/navigated'
			|| action.type === GlobalActionsTypes.AppInitialLoadSuccess
			|| action.type === JustForYouTypes.ReloadJustForYou),
		withLatestFrom(this.store),
		filter(([action, state]) => {
			const isSettingsFetched = state.common.settings.isFetched;
			const isProductListRoute = state.router.state.url.endsWith('/catalog/just-for-you');
			return isProductListRoute && isSettingsFetched
		}),
		map(([action, state]) => new FetchJustForYou())
	)

	/**
	 * After app initial load success check to see if we have categories in the store if so we need to do some logic to find the id
	 */
	@Effect()
	loadProductPage = this.actions.pipe(
		filter(action =>
			action.type === '@ngrx/router-store/navigated'
			|| action.type === GlobalActionsTypes.AppInitialLoadSuccess
			|| action.type === JustForYouTypes.ReloadJustForYou),
		withLatestFrom(this.store),
		filter(([action, state]) => {
			const isSettingsFetched = state.common.settings.isFetched;
			const isProductListRoute = state.router.state.url.startsWith('/catalog/just-for-you');
			const routerParams = state.router.state.params;

			return isProductListRoute && isSettingsFetched && routerParams.productSlug
		}),
		map(([action, state]) => {
			return new GetJustForYouProductList(state.router.state.params.productSlug)
		})
	)

	/**
	 * Look in the store to find the product category and sub categories
	 */
	@Effect()
	getJustForYouProductList = this.actions.pipe(
		ofType(JustForYouTypes.GetJustForYouProductList),
		withLatestFrom(this.store),
		map(([action, state]) => {
			const selectedId = action['productId'];
			const baseUrl = state.common.settings.data.web_links.image_urls.product;
			const categoryBase = state.common.settings.data.web_links.image_urls.category;

			if (state.catalog.justForYou.entities[selectedId]) {
				return new FetchJustForYouProductListSuccess(state.catalog.productList.entities[selectedId], baseUrl, categoryBase)
			} else {
				return new FetchJustForYouProductList(selectedId);
			}
		})
	)

	/**
	 * Fetch the Product Category via store id and product id
	 */
	@Effect()
	fetchProductList = this.actions.pipe(
		ofType(JustForYouTypes.FetchJustForYouProductList),
		withLatestFrom(this.store),
		filter(([action, store]) => {
			const isJFY = store.router.state.url.startsWith('/catalog/just-for-you');
			const isProductList = store.router.state.params.productSlug;
			return isJFY && isProductList
		}),
		exhaustMap(() => this.applicationHttpClient.renewAuthTokenIfRequired('FetchJustForYouProductList').pipe(
			withLatestFrom(this.store),
			exhaustMap(([action, state]) => {
				const storeId = state.common.store.selectedStore.store_id;
				const isDelivery = state.common.store.isDeliveryTabActive;
				const productList = state.router.state.params.productSlug;
				return this.justForYouService.getProductList(storeId, productList, isDelivery).pipe(
					map((response) => {
						const baseUrl = state.common.settings.data.web_links.image_urls.product;
						const categoryBase = state.common.settings.data.web_links.image_urls.category;

						return new FetchJustForYouProductListSuccess(response, baseUrl, categoryBase);
					}),
					catchError(error => of(new FetchJustForYouProductListFailure()))
				)
			})
		))
	)

	constructor(
		private actions: Actions,
		private justForYouService: JustForYouService,
		private store: Store<State>,
		private applicationHttpClient: ApplicationHttpClient
	) { }
}


