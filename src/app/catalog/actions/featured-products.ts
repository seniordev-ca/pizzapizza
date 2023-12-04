import { Action } from '@ngrx/store';
import { ServerProductList } from '../models/server-products-list';

/**
 * Home page featured slider
 */
export enum CatalogFeaturedSliderTypes {
	FetchFeaturedSlides = '[Catalog](Featured) Fetch Featured Slides',
	FetchFeaturedSlidesSuccess = '[Catalog](Featured) Fetch Featured Slides Success',
	FetchFeaturedSlidesFailure = '[Catalog](Featured) Fetch Featured slides Failure',

	ReloadFeatureSlides = '[Catalog](Featured) Mark Featured Slides For Reload'
}

export class FetchFeaturedSlides implements Action {
	readonly type = CatalogFeaturedSliderTypes.FetchFeaturedSlides;
}

export class ReloadFeatureSlides implements Action {
	readonly type = CatalogFeaturedSliderTypes.ReloadFeatureSlides;
}

export class FetchFeaturedSlidesSuccess implements Action {
	readonly type = CatalogFeaturedSliderTypes.FetchFeaturedSlidesSuccess;
	constructor(public payload: ServerProductList, public baseUrl: string) { }
}

export class FetchFeaturedSlidesFailure implements Action {
	readonly type = CatalogFeaturedSliderTypes.FetchFeaturedSlidesFailure;
}

/**
 * REDUX actions for featured slider
 */
export type FeaturedSliderActions =
	| FetchFeaturedSlides
	| FetchFeaturedSlidesSuccess
	| FetchFeaturedSlidesFailure
	| ReloadFeatureSlides
