import { Action } from '@ngrx/store';

/**
 * Actions for home page
 */
export enum HomeActionsTypes {
	RenderHomePage = '[Home](Home) Render Home Page'
}

export class RenderHomePage implements Action {
	readonly type = HomeActionsTypes.RenderHomePage;
}

export type HomeActions =
	| RenderHomePage
