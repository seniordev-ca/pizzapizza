import { Action } from '@ngrx/store';
import { ServerProductConfig } from '../models/server-product-config';
import { AppSettingsImageURLInterface } from '../../common/models/server-app-settings';

/**
 * Categories
 */
export enum CatalogComboConfigListTypes {
	FetchComboConfig = '[Catalog](Combo Config) Fetch Combo Config',
	FetchComboConfigSuccess = '[Catalog](Combo Config) Fetch Combo Config Success',
	FetchComboConfigFailure = '[Catalog](Combo Config) Fetch Combo Config Failure',

	IncreaseComboQuantity = '[Catalog](Combo Config) Increase Combo Quantity',
	DecreaseComboQuantity = '[Catalog](Combo Config) Decrease Combo Quantity',

	ReloadComboConfig = '[Catelog](Combo Config) Reload Combo Config',

	AddFlatConfigOptionToComboConfigurator = '[Catelog](Combo Config) Add config option to combo product in cart request',
	UpdateFlatConfigOptionQuantity = '[Catalog](Combo Config) Update The Quantity of config option for is_flat combo product',

	AddValidIncompleteComboToCart = '[Catalog](Combo Config) Add valid incomplete combo product',

	SetComboConfigToPristine = '[Catalog](Combo Config) Set Combo To Pristine',
	ReFetchComboConfig = '[Catalog](Combo Config) Refetch Combo Config',
	RemoveUnavailableToppingsFromAnotherTwin = '[Catalog](Combo Config) Removing unavailale toppings for another twin pizza',

	ComboProductNextClick = '[Catalog](Combo Config) Combo Product Next Click'

}
export class FetchComboConfig implements Action {
	readonly type = CatalogComboConfigListTypes.FetchComboConfig;
	constructor(public storeId: number, public comboId: number) { }
}
export class ReloadComboConfig implements Action {
	readonly type = CatalogComboConfigListTypes.ReloadComboConfig;
}
export class FetchComboConfigSuccess implements Action {
	readonly type = CatalogComboConfigListTypes.FetchComboConfigSuccess;
	constructor(
		public productComboServerConfig: ServerProductConfig,
		public imageBaseUrls: AppSettingsImageURLInterface
	) { }
}


export class AddValidIncompleteComboToCart implements Action {
	readonly type = CatalogComboConfigListTypes.AddValidIncompleteComboToCart;
}
export class FetchComboConfigFailure implements Action {
	readonly type = CatalogComboConfigListTypes.FetchComboConfigFailure;
}

export class IncreaseComboQuantity implements Action {
	readonly type = CatalogComboConfigListTypes.IncreaseComboQuantity;
}

export class DecreaseComboQuantity implements Action {
	readonly type = CatalogComboConfigListTypes.DecreaseComboQuantity;
}
export class AddFlatConfigOptionToComboConfigurator implements Action {
	readonly type = CatalogComboConfigListTypes.AddFlatConfigOptionToComboConfigurator;
	constructor(
		public itemId: string,
		public selectedProduct: string,
		public quantity: number,
		public isConfigOption: boolean,
		public isDelete: boolean,
		public lineId: number
	) { }
}
export class UpdateFlatConfigOptionQuantity implements Action {
	readonly type = CatalogComboConfigListTypes.UpdateFlatConfigOptionQuantity;
	constructor(public itemId: string, public selectedProduct: string, public quantity: number) { }
}

export class SetComboConfigToPristine implements Action {
	readonly type = CatalogComboConfigListTypes.SetComboConfigToPristine;
}

export class ReFetchComboConfig implements Action {
	readonly type = CatalogComboConfigListTypes.ReFetchComboConfig
}

export class RemoveUnavailableToppingsFromAnotherTwin implements Action {
	readonly type = CatalogComboConfigListTypes.RemoveUnavailableToppingsFromAnotherTwin
}

export class ComboProductNextClick implements Action {
	readonly type = CatalogComboConfigListTypes.ComboProductNextClick
	constructor(public isUpsizeAsked: boolean) { }
}
/**
 * REDUX actions for categorie
 */
export type ComboConfigActions =
	| FetchComboConfig
	| FetchComboConfigSuccess
	| FetchComboConfigFailure

	| AddValidIncompleteComboToCart

	| IncreaseComboQuantity
	| DecreaseComboQuantity

	| ReloadComboConfig

	| AddFlatConfigOptionToComboConfigurator
	| UpdateFlatConfigOptionQuantity

	| SetComboConfigToPristine
	| ReFetchComboConfig

	| RemoveUnavailableToppingsFromAnotherTwin
	| ComboProductNextClick
