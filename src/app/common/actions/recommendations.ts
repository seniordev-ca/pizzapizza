import { Action } from '@ngrx/store';
import { ServerProductInListInterface } from '../../catalog/models/server-product-in-list';

/**
 * Recommendation Actions
 */
export enum RecommendationActionTypes {
	FetchRecommendations = '[Catalog](Recommendations) Fetch Recommendations',
	FetchRecommendationsSuccess = '[Catalog](Recommendations) Fetch Recommendations Success',
	FetchRecommendationsFailure = '[Catalog](Recommendations) Fetch Recommendations Faliure',
}

export class FetchRecommendations implements Action {
	readonly type = RecommendationActionTypes.FetchRecommendations;
	constructor(public productIDs: string[]) {}
}

export class FetchRecommendationsSuccess implements Action {
	readonly type = RecommendationActionTypes.FetchRecommendationsSuccess;
	constructor(public response: ServerProductInListInterface[], public baseUrl: string) {}
}

export class FetchRecommendationsFailure implements Action {
	readonly type = RecommendationActionTypes.FetchRecommendationsFailure;
}

export type RecommendationActions =
	| FetchRecommendations
	| FetchRecommendationsSuccess
	| FetchRecommendationsFailure
