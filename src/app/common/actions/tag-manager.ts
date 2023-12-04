import { Action } from '@ngrx/store';
import { DataLayerEventEnum, DataLayerRegistrationEventEnum, DataLayerNotificationActionsEnum } from '../models/datalayer-object';
import { SdkUpsizingResponse } from 'app/catalog/models/server-sdk';
/**
 * Tag Manager Actions
 */
export enum TagManagerActionsTypes {
	UpdateDataLayer = '[Common](Tag Manager) Update Data Layer Object',
	RegistrationDataLayer = '[Common](Tag Manager) Registration Data Layer Object',
	UpdateDataLayerClub11111 = '[Common](Tag Manager) Club 11 11 Data Layer Object',
	CouponsDataLayer = '[Common](Tag Manager) Update Coupons  Data Layer Object',
	LocationsDataLayer = '[Common](Tag Manager) Update Locations  Data Layer Object',
	NotificationsDataLayer = '[Common](Tag Manager) Update Notifications  Data Layer Object',
	CommonUseUpdateDataLayer = 'Common](Tag Manager) Update Data Layer Object For Specific Actions',
	CheckoutDataLayer = 'Common](Tag Manager) Update Data Layer on clicking checkout button',
	CommonObjectUpdateData = 'Common](Tag Manager) Update Data Layer based on given object'
}

export class UpdateDataLayer implements Action {
	readonly type = TagManagerActionsTypes.UpdateDataLayer;
	constructor(public event: string, public eventLabel?: string) { }
}

export class UpdateDataLayerClub11111 implements Action {
	readonly type = TagManagerActionsTypes.UpdateDataLayerClub11111;
	constructor(public event: DataLayerEventEnum) { }
}
export class RegistrationDataLayer implements Action {
	readonly type = TagManagerActionsTypes.RegistrationDataLayer;
	constructor(public event: DataLayerRegistrationEventEnum, public eventLabel?: string) { }
}

export class CouponsDataLayer implements Action {
	readonly type = TagManagerActionsTypes.CouponsDataLayer;
	constructor(public eventLabel: string) { }
}

export class LocationsDataLayer implements Action {
	readonly type = TagManagerActionsTypes.LocationsDataLayer;
	constructor(public eventType: string, public eventAction: string, public eventLabel: string) { }
}

export class NotificationsDataLayer implements Action {
	readonly type = TagManagerActionsTypes.NotificationsDataLayer;
	constructor(public eventAction: DataLayerNotificationActionsEnum, public upSizing?: SdkUpsizingResponse) { }
}
export class CommonUseUpdateDataLayer implements Action {
	readonly type = TagManagerActionsTypes.CommonUseUpdateDataLayer;
	constructor(public event: string, public eventCategory?: string, public eventAction?: string, public eventLabel?: string) { }
}
export class CheckoutDataLayer implements Action {
	readonly type = TagManagerActionsTypes.CheckoutDataLayer;
	constructor(public stepNumber: number, public proceedToForm?: string) { }
}
export class CommonObjectUpdateData implements Action {
	readonly type = TagManagerActionsTypes.CommonObjectUpdateData;
	constructor(public data: object, public eventType?: string) { }
}
