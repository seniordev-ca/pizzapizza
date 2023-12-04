// Angular and ngrx
import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap, withLatestFrom, exhaustMap, filter } from 'rxjs/operators';


// Banner actions
import {
	FetchBannerSuccess,
	FetchBannerFailure,
	HomeBannerActionTypes
} from '../actions/banner';

// Store actions
import { State } from '../reducers';

import {
	BannerService
} from '../services/banner';

/**
 * TODO think about caching at this level
 */
@Injectable()
export class BannerEffect {
	/**
	 * If banners are in not yet fetched
	 */
	@Effect()
	fetchStore = this.actions.pipe(
		ofType(HomeBannerActionTypes.FetchBanner),
		withLatestFrom(this.store),
		filter(([action, store]) => {
			const isFetched = store.home.banner.isFetched;
			const isLoading = store.home.banner.isLoading;
			const isStoreSelected = store.common.store.selectedStore ? true : false

			return isLoading && !isFetched && isStoreSelected
		}),
		exhaustMap(([action, store]) => {
			const storeId = store.common.store.selectedStore.store_id;
			return this.bannerService.getHomePageBanners(storeId).pipe(
				map(homePageBanners => new FetchBannerSuccess(homePageBanners)),
				catchError(error => of(new FetchBannerFailure()))
			)
		})
	)

	constructor(
		private actions: Actions,
		private store: Store<State>,
		private bannerService: BannerService
	) { }
}
