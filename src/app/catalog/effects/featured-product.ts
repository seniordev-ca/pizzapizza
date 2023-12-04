// Angular Core
import { Injectable } from '@angular/core';
// Ng Rx
import { Store } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';
import { State } from '../../root-reducer/root-reducer';
// Reactive operators
import { exhaustMap, flatMap, catchError, withLatestFrom, filter, map } from 'rxjs/operators';
import { of } from 'rxjs';

// Actions
import {
	FetchFeaturedSlidesSuccess,
	FetchFeaturedSlidesFailure,

	CatalogFeaturedSliderTypes
} from '../actions/featured-products';

import {
	ImportFeatureCategory
} from '../actions/category'

// Services
import { FeaturedProductService } from '../services/featured-products';

@Injectable()
export class FeaturedProductsEffects {
	@Effect()
	fetchFeaturedProduct = this.actions.pipe(
		filter(action =>
			action.type === CatalogFeaturedSliderTypes.FetchFeaturedSlides
		),
		withLatestFrom(this.store),
		filter(([action, state]) => state.common.store.selectedStore !== null),
		exhaustMap(([action, state]) => {
			const storeId = state.common.store.selectedStore.store_id;
			const baseUrl = state.common.settings.data.web_links.image_urls.featured;
			const isDelivery = state.common.store.isDeliveryTabActive;
			return this.featureProductService.getFeaturedProducts(storeId, isDelivery).pipe(
				map((response) => new FetchFeaturedSlidesSuccess(response, baseUrl)),
				catchError(error => of(new FetchFeaturedSlidesFailure()))
			)
		})
	)
	@Effect()
	fetchFeaturedSlides = this.actions.pipe(
		filter(action => action.type === CatalogFeaturedSliderTypes.FetchFeaturedSlidesSuccess
			|| action.type === CatalogFeaturedSliderTypes.FetchFeaturedSlidesFailure),
		map(action => {
			const category = action.type === CatalogFeaturedSliderTypes.FetchFeaturedSlidesSuccess ? [action['payload'].category] : null;
			return new ImportFeatureCategory(category)
		})
	)

	constructor(
		private actions: Actions,
		private featureProductService: FeaturedProductService,
		private store: Store<State>
	) { }
}


