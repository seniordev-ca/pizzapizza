import { Action } from '@ngrx/store';
import { SdkResponse } from '../../catalog/models/server-sdk';

/**
 * SDK Actons
 */
export enum SDKActionTypes {
	SaveSdkProductInfo = '[Catalog](Configurator) Save SDK Product Info',
	SaveSdkProductInfoFailed = '[Catalog](Configurator) Save SDK Product Info Failed',
	// UpdateComboConfigBasedOnSDK = '[Catalog](Configurator) Update Combo based on SDK',
	// UpdateComboConfigBasedOnSDKFailed = '[Catalog](Configurator) Update Combo based on sdk failed',

	InitialSDKLoad = '[Catalog](Configurator) Initial SDK Load',
	InitialSDKLoadSuccess = '[Catalog](Configurator) Initial SDK Load Success',
	InitialSDKLoadFailure = '[Catalog](Configurator) Initial SDK Load Failure',
	LoadSDKAfterConfigSuccess = '[Catalog](Configurator) Load SDK After Config Success',
	LoadSDKFailed = '[Catalog](Configurator) SDK Failed'
}

export class InitialSDKLoad implements Action {
	readonly type = SDKActionTypes.InitialSDKLoad;
}
export class InitialSDKLoadSuccess implements Action {
	readonly type = SDKActionTypes.InitialSDKLoadSuccess;
}
export class InitialSDKLoadFailure implements Action {
	readonly type = SDKActionTypes.InitialSDKLoadFailure;
}
export class LoadSDKAfterConfigSuccess implements Action {
	readonly type = SDKActionTypes.LoadSDKAfterConfigSuccess;
}
export class LoadSDKFailed implements Action {
	readonly type = SDKActionTypes.LoadSDKFailed;
	constructor(public errorMsg: SdkResponse) { }
}
export class SaveSdkProductInfo implements Action {
	readonly type = SDKActionTypes.SaveSdkProductInfo;
	constructor(
		public sdkResponse: SdkResponse,
		public productSlug: string
	) { }
}
export class SaveSdkProductInfoFailed implements Action {
	readonly type = SDKActionTypes.SaveSdkProductInfoFailed;
	constructor(public errorMsg: SdkResponse) { }
}


export type SDKActions =
	| InitialSDKLoad
	| InitialSDKLoadSuccess
	| InitialSDKLoadFailure
	| LoadSDKAfterConfigSuccess
	| SaveSdkProductInfo
	| LoadSDKFailed
	| SaveSdkProductInfoFailed
// | UpdateComboConfigBasedOnSDK
// | UpdateComboConfigBasedOnSDKFailed
