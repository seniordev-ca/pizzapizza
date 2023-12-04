import { Action } from '@ngrx/store';
import { AppSettingsInterface } from '../models/server-app-settings';

/**
 * Application entry point
 * App settings fetch actions
 */
export enum GlobalActionsTypes {
	AppInitialLoad = '[Common](Global) App Initial Load',
	AppInitialLoadSuccess = '[Common](Global) App Initial Load Success',
	AppInitialLoadFailed = '[Common](Global) App Initial Load Failure',

	FetchSettings = '[Common](Global) Fetch Setting',
	FetchSettingsSuccess = '[Common](Global) Fetch Setting Success',
	FetchSettingsFailure = '[Common](Global) Fetch Setting Failure',

	RateLimitReached = '[Common Global] Rate Limit Reached'
}

export class AppInitialLoad implements Action {
	readonly type = GlobalActionsTypes.AppInitialLoad;
}

export class FetchSettings implements Action {
	readonly type = GlobalActionsTypes.FetchSettings;
}

export class FetchSettingsSuccess implements Action {
	readonly type = GlobalActionsTypes.FetchSettingsSuccess;
	constructor(public payload: AppSettingsInterface, public mockImageUrls?) { }
}

export class FetchSettingsFailure implements Action {
	readonly type = GlobalActionsTypes.FetchSettingsFailure;
}

export class AppInitialLoadSuccess implements Action {
	readonly type = GlobalActionsTypes.AppInitialLoadSuccess;
}

export class AppInitialLoadFailed implements Action {
	readonly type = GlobalActionsTypes.AppInitialLoadFailed;
}

export class RateLimitReached implements Action {
	readonly type = GlobalActionsTypes.RateLimitReached;
}

/**
 * Global app Actions
 */
export type GlobalActions =
	| AppInitialLoad
	| AppInitialLoadSuccess
	| AppInitialLoadFailed
	| FetchSettings
	| FetchSettingsSuccess
	| FetchSettingsFailure
	| RateLimitReached
