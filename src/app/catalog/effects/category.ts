// Angular Core
import { Injectable } from '@angular/core';
// Ng Rx
import { Store } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
// Reactive operators
import { map, exhaustMap, catchError, withLatestFrom, filter } from 'rxjs/operators';
import { of } from 'rxjs';

import { State } from '../../root-reducer/root-reducer';

// Actions
import {
	FetchCategories,
	FetchCategoriesSuccess,
	FetchCategoriesFailure,
	CatalogCategoriesTypes
} from '../actions/category';

import {
	ConfiguratorActionsTypes
} from '../actions/configurator';

// Services
import { CategoryService } from '../services/category';

@Injectable()
export class CategoryEffects {

	/**
	 * Fetch menu categories
	 */
	@Effect()
	fetchFeaturedProduct = this.actions.pipe(
		filter(action =>
			action.type === CatalogCategoriesTypes.FetchCategories
		),
		withLatestFrom(this.store$),
		filter(([action, state]) => state.common.store.selectedStore !== null),
		exhaustMap(([action, state]) =>
			this.categoryService.getCategories(state.common.store.selectedStore.store_id).pipe(
				map((response) => {
					const baseUrl = state.common.settings.data.web_links.image_urls.category;
					return new FetchCategoriesSuccess(response, baseUrl)
				}),
				catchError(error => of(new FetchCategoriesFailure()))
			)
		)
	)

	/**
	 * Fetch categories if not fetched for configurator new item mini modal
	 */
	@Effect()
	fetchIfNotFetched = this.actions.pipe(
		ofType(ConfiguratorActionsTypes.ConfiguratorAddItemGetCategories),
		withLatestFrom(this.store$),
		filter(([action, state]) => {
			return !state.catalog.categories.isFetched;
		}),
		map(() => new FetchCategories())
	)

	constructor(
		private actions: Actions,
		private store$: Store<State>,
		private categoryService: CategoryService,
	) { }
}


