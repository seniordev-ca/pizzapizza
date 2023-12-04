import { Action } from '@ngrx/store';

/**
 * Application entry point
 * App settings fetch actions
 */
export enum KumulosActionTypes {
	LoadKumulosSDK = '[Common](Kumulos) Kumulos SDK Initial Load',
	LoadKumulosSDKSuccess = '[Common](Kumulos) Kumulos SDK Initial Load Success',
	LoadKumulosSDKFailed = '[Common](Kumulos) Kumulos SDK Initial Load Failure',
	StoreKumulosUserID = '[Common](Kumulos) Kumulos User ID',
}

export class LoadKumulosSDK implements Action {
	readonly type = KumulosActionTypes.LoadKumulosSDK;
}

export class LoadKumulosSDKSuccess implements Action {
	readonly type = KumulosActionTypes.LoadKumulosSDKSuccess;
}

export class LoadKumulosSDKFailed implements Action {
	readonly type = KumulosActionTypes.LoadKumulosSDKFailed;
}

export class StoreKumulosUserID implements Action {
	readonly type = KumulosActionTypes.StoreKumulosUserID;
	constructor(public user: string) {}
}

/**
 * Global app Actions
 */
export type KumulosActions =
	| LoadKumulosSDK
	| LoadKumulosSDKSuccess
	| LoadKumulosSDKFailed
	| StoreKumulosUserID
