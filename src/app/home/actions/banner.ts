import { Action } from '@ngrx/store';
import { ServerBannerInterface, ServerSingleBannerInterface } from '../models/server-banner';
/**
 * Home banner actions
 */
export enum HomeBannerActionTypes {
	FetchBanner = '[Home](Banner) Fetch Home Banner',
	FetchBannerSuccess = '[Home](Banner) Fetch Home Banner Success',
	FetchBannerFailure = '[Home](Banner) Fetch Home Banner Failure',

	ReloadBanner = '[Home](Banner) Mark Home Banner For Reload'
}

export class ReloadBanner implements Action {
	readonly type = HomeBannerActionTypes.ReloadBanner;
}
export class FetchBanner implements Action {
	readonly type = HomeBannerActionTypes.FetchBanner;
}

export class FetchBannerSuccess implements Action {
	readonly type = HomeBannerActionTypes.FetchBannerSuccess;
	constructor(public payload: ServerSingleBannerInterface[]) { }
}

export class FetchBannerFailure implements Action {
	readonly type = HomeBannerActionTypes.FetchBannerFailure;
}

/**
 * REDUX actions for banner
 */
export type BannerActions =
	| FetchBanner
	| FetchBannerSuccess
	| FetchBannerFailure
	| ReloadBanner
