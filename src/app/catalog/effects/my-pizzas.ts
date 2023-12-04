// Angular Core
import { Injectable } from '@angular/core';
// Ng Rx
import { Store } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
// Reactive operators
import { map, mergeMap, catchError, withLatestFrom, filter } from 'rxjs/operators';
import { of } from 'rxjs';
import { State } from '../../root-reducer/root-reducer';

// Actions
import {
	FetchMyPizzaList,
	FetchMyPizzaListSuccess,
	FetchMyPizzaListFailure,
	CatalogMyPizzaTypes
} from '../actions/my-pizzas';

// Services
import { ProductListService } from '../services/product-list';
import { SignUpActionTypes } from '../../user/actions/sign-up-actions';
import { Router } from '@angular/router';
import { ApplicationHttpClient } from '../../../utils/app-http-client';
@Injectable()
export class MyPizzaEffects {

	/**
	 * We should likely refetch the pizza list everytime user goes to the page
	 */
	@Effect()
	loadProductPageRequirements = this.actions.pipe(
		filter(action =>
			action.type === '@ngrx/router-store/navigated'
			|| action.type === SignUpActionTypes.GetUserSummarySuccess
			|| action.type === CatalogMyPizzaTypes.ReloadMyPizzaList),
		withLatestFrom(this.store),
		filter(([action, state]) => {
			const isSettingsFetched = state.common.settings.isFetched;
			const isPizzaRoute = state.router.state.url.endsWith('/catalog/my-pizzas');
			const isUserLoggedIn = state.user.userLogin.loggedInUser ? true : false;
			return isPizzaRoute && isSettingsFetched && isUserLoggedIn
		}),
		map(() => new FetchMyPizzaList())
	)

	/**
	 * We should likely refetch the pizza list everytime user goes to the page
	 */
	@Effect()
	loadMyPizzasOnConfig = this.actions.pipe(
		filter(action =>
			action.type === '@ngrx/router-store/navigated'
			|| action.type === SignUpActionTypes.GetUserSummarySuccess
			|| action.type === CatalogMyPizzaTypes.ReloadMyPizzaList),
		withLatestFrom(this.store),
		filter(([action, state]) => {
			const isPizzaRoute = state.router.state.url.startsWith('/catalog/my-pizzas');
			const isPizzaListFetched = state.catalog.myPizzas.isFetched;
			const isConfig = state.router.state.params.singleProductId
			const isUserLoggedIn = state.user.userLogin.loggedInUser ? true : false

			return isPizzaRoute && !isPizzaListFetched && isUserLoggedIn && isConfig;
		}),
		map(() => new FetchMyPizzaList())
	)

	/**
	 * If User is logged out and ends up on my pizza url we should redirect correctly
	 */
	@Effect({ dispatch: false })
	failMyPizzasOnSignedOut = this.actions.pipe(
		ofType(SignUpActionTypes.GetUserSummaryFailure),
		withLatestFrom(this.store),
		filter(([action, state]) => {
			const isPizzaRoute = state.router.state.url.startsWith('/catalog/my-pizzas');
			const isPizzaListFetched = state.catalog.myPizzas.isFetched;
			const isUserLoggedIn = state.user.userLogin.loggedInUser ? true : false
			return isPizzaRoute && !isPizzaListFetched && !isUserLoggedIn
		}),
		map(([action, state]) => {
			const configID = state.router.state.params.singleProductId
			if (configID) {
				this.router.navigate(['/catalog/config', configID])
			} else {
				this.router.navigate(['/user/sign-in'])
			}
		})
	)

	/**
	 * Handle redirect of pizza to default if it doesn't exist in list
	 */
	@Effect({ dispatch: false })
	redirectToDefaultConfig = this.actions.pipe(
		filter(action =>
			action.type === CatalogMyPizzaTypes.FetchMyPizzaListSuccess
			|| action.type === CatalogMyPizzaTypes.FetchMyPizzaListFailure
		),
		withLatestFrom(this.store),
		filter(([action, state]) => {
			const isPizzaRoute = state.router.state.url.startsWith('/catalog/my-pizzas');
			const configID = state.router.state.params.singleProductId
			const pizzaID = state.router.state.params.myPizzaId;
			return isPizzaRoute && configID && pizzaID;
		}),
		map(([action, state]) => {
			const configID = state.router.state.params.singleProductId
			const pizzaID = state.router.state.params.myPizzaId;
			const pizzaList = state.catalog.myPizzas.entities[pizzaID]
			if (!pizzaList) {
				this.router.navigate(['/catalog/config', configID])
			}
		})
	)

	/**
	 * Fetch users 'My Pizzzas' via store id and isDelivery
	 */
	@Effect()
	fetchProductList = this.actions.pipe(
		filter(action =>
			action.type === CatalogMyPizzaTypes.FetchMyPizzaList
		),
		withLatestFrom(this.store),
		mergeMap(() => this.applicationHttpClient.renewAuthTokenIfRequired('FetchMyPizzaList').pipe(
			withLatestFrom(this.store),
			mergeMap(([action, state]) => {
				const storeId = state.common.store.selectedStore.store_id;
				const isDelivery = state.common.store.isDeliveryTabActive;
				return this.productListService.getMyPizzaList(storeId, isDelivery).pipe(
					map((response) => {
						const baseUrl = state.common.settings.data.web_links.image_urls.product;
						const categoryBase = state.common.settings.data.web_links.image_urls.category;
						return new FetchMyPizzaListSuccess(response, baseUrl, categoryBase);
					}),
					catchError(error => of(new FetchMyPizzaListFailure()))
				)
			})
		))
	)

	constructor(
		private actions: Actions,
		private store: Store<State>,
		private productListService: ProductListService,
		private router: Router,
		private applicationHttpClient: ApplicationHttpClient
	) { }
}


