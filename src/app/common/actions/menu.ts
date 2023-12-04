import { Action } from '@ngrx/store';
import { ServerMenuInterface } from '../models/server-menu';

/**
 * Actions to fetch footer menu
 */
export enum FooterMenuActionTypes {
	FetchFooterMenu = '[Common](Menu) Fetch Footer Menu',
	FetchFooterMenuSuccess = '[Common](Menu) Fetch Footer Menu Success',
	FetchFooterMenuFailure = '[Common](Menu) Fetch Footer Menu Failure',
}

export class FetchFooterMenu implements Action {
	readonly type = FooterMenuActionTypes.FetchFooterMenu;
}
export class FetchFooterMenuSuccess implements Action {
	readonly type = FooterMenuActionTypes.FetchFooterMenuSuccess;
	constructor(public menu: ServerMenuInterface) {}
}
export class FetchFooterMenuFailure implements Action {
	readonly type = FooterMenuActionTypes.FetchFooterMenuFailure;
}

/**
 * Footer Menu Actions
 */
export type FooterMenuActions =
	| FetchFooterMenu
	| FetchFooterMenuSuccess
	| FetchFooterMenuFailure
