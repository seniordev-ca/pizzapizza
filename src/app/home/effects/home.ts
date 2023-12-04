// Angular Core
import { Injectable } from '@angular/core';
// Ng Rx
import { Store } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
// Reactive operators
import { map, filter, withLatestFrom } from 'rxjs/operators';

import { State } from '../../root-reducer/root-reducer';

// Home actions
import {
	HomeActionsTypes,
	RenderHomePage
} from '../actions/home';
// Global actions
import {
	GlobalActionsTypes
} from '../../common/actions/global';
// Catalog actions
import { FetchFeaturedSlides } from '../../catalog/actions/featured-products';
import { FetchCategories, CatalogCategoriesTypes } from '../../catalog/actions/category';
import { FetchJustForYou } from '../../catalog/actions/just-for-you';
// Home actions
import { FetchBanner } from '../actions/banner';

@Injectable()
export class HomeEffects {

	/**
	 * Listen to app launch success and check route
	 */
	@Effect()
	homePage = this.actions.pipe(
		filter(action =>
			action.type === '@ngrx/router-store/navigated' ||
			action.type === GlobalActionsTypes.AppInitialLoadSuccess
			|| action.type === CatalogCategoriesTypes.ReloadCategories
		),
		withLatestFrom(this.store),
		filter(([action, state]) => {
			const params = state.router.state.params;
			const storeId = params ? state.router.state.params.storeId : false;
			const deliveryType = params ? state.router.state.params.deliveryType : false;
			const isAppLaunched = state.common.settings.isFetched && state.common.store.selectedStore;
			let currentPath = state.router.state.url;
			if (currentPath.indexOf('?') !== -1) {
				currentPath = currentPath.split('?')[0];
			}
			const isIndexRoute = params && (deliveryType && storeId) ? currentPath === '/store/' + storeId + '/' + deliveryType : false;

			return isAppLaunched && isIndexRoute
		}),
		map(() => new RenderHomePage())
	)

	/**
	 * Fetch featured slider data if not fetched
	 */
	@Effect()
	fetchFeaturedSlider = this.actions.pipe(
		ofType(HomeActionsTypes.RenderHomePage),
		withLatestFrom(this.store),
		filter(([action, store]) => {
			return !store.catalog.featuredProducts.isFetched;
		}),
		map(() => new FetchFeaturedSlides())
	)

	/**
	 * Fetch categories if not fetched
	 */
	@Effect()
	fetchCategories = this.actions.pipe(
		ofType(HomeActionsTypes.RenderHomePage),
		withLatestFrom(this.store),
		filter(([action, store]) => {
			return !store['home']['homeCategories']['isFetched'];
		}),
		map(() => new FetchCategories())
	)

	/**
	 * Fetch just for you data if not fetched
	 */
	@Effect()
	fetchJustForYou = this.actions.pipe(
		ofType(HomeActionsTypes.RenderHomePage),
		withLatestFrom(this.store),
		filter(([action, store]) => {
			const isJFYEmpty = store.catalog.justForYou.justForYouProducts ? store.catalog.justForYou.justForYouProducts.length < 1 : true;
			return !store.catalog.justForYou.isFetched || isJFYEmpty
		}),
		map(() => new FetchJustForYou())
	)

	/**
	 * Fetch banner data if not fetched
	 */
	@Effect()
	fetchHomePageBanner = this.actions.pipe(
		ofType(HomeActionsTypes.RenderHomePage),
		withLatestFrom(this.store),
		filter(([action, store]) => {
			return !store['home']['banner']['isFetched'];
		}),
		map(() => new FetchBanner())
	)

	constructor(
		private actions: Actions,
		private store: Store<State>
	) { }
}
