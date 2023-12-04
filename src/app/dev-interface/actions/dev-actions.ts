import { Action } from '@ngrx/store';

/**
 * Dev interface actions
 */
export enum DevActionsTypes {
	SetBaseApiUrl = '[Dev interface] set API base URL',
	SetMockHeader = '[Dev interface] set mock header',
	SetDevSettingsFromLocalStorage = '[Dev interface] set dev settings from local storage',
	ToggleMockImageBaseUrl = '[Dev interface] ToggleMockImageBaseUrl'
}

export class SetBaseApiUrl implements Action {
	readonly type = DevActionsTypes.SetBaseApiUrl;
	constructor(public baseUrl: string) { };
}

export class SetMockHeader implements Action {
	readonly type = DevActionsTypes.SetMockHeader;
	constructor(public mockUrl: string | null) { };
}

export class SetDevSettingsFromLocalStorage implements Action {
	readonly type = DevActionsTypes.SetDevSettingsFromLocalStorage;
	constructor(public devSettings) { };
}

export class ToggleMockImageBaseUrl implements Action {
	readonly type = DevActionsTypes.ToggleMockImageBaseUrl;
}

export type DevActions =
	| SetBaseApiUrl
	| SetMockHeader
	| SetDevSettingsFromLocalStorage
	| ToggleMockImageBaseUrl
