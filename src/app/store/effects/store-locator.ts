// Angular and ngrx
import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { map, catchError, withLatestFrom, exhaustMap, filter } from 'rxjs/operators';
import { of } from 'rxjs';


// Store actions
import {
	StoreLocatorSearchSuccess,
	StoreLocatorSearchFailure,
	StoreLocatorSearchFetchNextPageSuccess,
	StoreLocatorActionsTypes,
	FetchStoreDetails,
	FetchStoreDetailsSuccess,
	FetchStoreDetailsFailure,
	FetchStoreCityList,
	FetchStoreCityListSuccess,
	FetchStoreCityListFailure
} from '../actions/store-locator';
import { State } from '../reducers';

import {
	StoreService
} from '../../common/services/store.service';
import { GlobalActionsTypes } from 'app/common/actions/global';
/**
 * Store Locator Effects
 */
@Injectable()
export class StoreLocatorEffects {

	/**
	 * Store Locator Search
	 */
	@Effect()
	storeLocatorSearch = this.actions.pipe(
		ofType(StoreLocatorActionsTypes.StoreLocatorSearch),
		exhaustMap((action) =>
			this.storeService.searchPickup(action, true).pipe(
				map(store => new StoreLocatorSearchSuccess(store)),
				catchError(error => of(new StoreLocatorSearchFailure()))
			)
		)
	)

	/**
	 * Province Search
	 */
	@Effect()
	storeLocatorSearchProvince = this.actions.pipe(
		filter(action => action.type === '@ngrx/router-store/navigated' || action.type === GlobalActionsTypes.AppInitialLoadSuccess),
		withLatestFrom(this.store),
		filter(([action, store]) => {
			const isStoreLocator = store.router.state.url.startsWith('/restaurant-locator');
			const routerParams = store.router.state.params;
			const isProvincePage = routerParams.province;
			const isQuery = store.router.state.queryParams.query;


			return isStoreLocator && isProvincePage && !isQuery
		}),
		exhaustMap(([action, state]) => {
			const routerParams = state.router.state.params;
			const provincePage = routerParams.province;
			const cityParam = routerParams.city;

			return this.storeService.getProvinceSearch(provincePage, cityParam, null).pipe(
				map(response => new StoreLocatorSearchSuccess(response)),
				catchError(() => of(new StoreLocatorSearchFailure()))
			)
		})
	)
	/**
	 * Store Locator Cursor
	 */
	@Effect()
	storeLocatorPagination = this.actions.pipe(
		ofType(StoreLocatorActionsTypes.StoreLocatorSearchFetchNextPage),
		withLatestFrom(this.store),
		filter(([action, store]) => {
			const isStoreLocator = store.router.state.url.startsWith('/restaurant-locator');
			const routerParams = store.router.state.params;
			const isStoreDetails = routerParams.storeId;

			return isStoreLocator && !isStoreDetails
		}),
		exhaustMap(([action, store]) => {
			const cursor = store.storelocator.storelocator.storeLocatorResults.cursor;
			const payload = store.storelocator.storelocator.userSearch;
			const routerParams = store.router.state.params;
			const isProvincePage = routerParams.province;
			const isCityInParams = routerParams.city;
			const isQuery = store.router.state.queryParams.query;

			if (isProvincePage && !isQuery) {
				return this.storeService.getProvinceSearch(isProvincePage, isCityInParams, cursor).pipe(
					map(results => new StoreLocatorSearchFetchNextPageSuccess(results)),
					catchError(error => of(new StoreLocatorSearchFailure()))
				)
			} else {
				return this.storeService.searchPickup({payload, cursor}, true).pipe(
					map(results => new StoreLocatorSearchFetchNextPageSuccess(results)),
					catchError(error => of(new StoreLocatorSearchFailure()))
				)
			}
		})
	)
	/**
	 * Fetch Store Details
	 */
	@Effect()
	getStoreDetails = this.actions.pipe(
		filter(action => action.type === '@ngrx/router-store/navigated' || action.type === GlobalActionsTypes.AppInitialLoadSuccess),
		withLatestFrom(this.store),
		filter(([action, store]) => {
			const isStoreLocator = store.router.state.url.startsWith('/restaurant-locator');
			const routerParams = store.router.state.params;
			const isStoreDetails = routerParams.storeId;

			return isStoreLocator && isStoreDetails
		}),
		map(([action, store]) => {
			const routerParams = store.router.state.params;
			const storeId = routerParams.storeId;
			return new FetchStoreDetails(storeId)
		})
	)
	@Effect()
	fetchStoreDetails = this.actions.pipe(
		ofType(StoreLocatorActionsTypes.FetchStoreDetails),
		exhaustMap(action => this.storeService.getStoreDetails(action['id']).pipe(
			map(response => new FetchStoreDetailsSuccess(response)),
			catchError(() => of(new FetchStoreDetailsFailure()))
		))
	)

	/**
	 * Get Store City List
	 */
	@Effect()
	getStoreCityList = this.actions.pipe(
		filter(action => action.type === '@ngrx/router-store/navigated' || action.type === GlobalActionsTypes.AppInitialLoadSuccess),
		withLatestFrom(this.store),
		filter(([action, store]) => {
			const isStoreLocator = store.router.state.url.startsWith('/restaurant-locator');
			const storeCities = store.storelocator.storelocator.storeCityList
			return isStoreLocator && !storeCities
		}),
		map(() => new FetchStoreCityList())
	)
	@Effect()
	fetchStoreCityList = this.actions.pipe(
		ofType(StoreLocatorActionsTypes.FetchStoreCityList),
		exhaustMap(() => this.storeService.getStoreCities().pipe(
			map(response => new FetchStoreCityListSuccess(response)),
			catchError(() => of(new FetchStoreCityListFailure()))
		))
	)


	constructor(
		private actions: Actions,
		private store: Store<State>,
		private storeService: StoreService,
		private router: Router
	) { }
}
