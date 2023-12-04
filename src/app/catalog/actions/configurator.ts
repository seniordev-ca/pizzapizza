import { Action } from '@ngrx/store';
import { ServerProductConfig } from '../models/server-product-config';
import { HalfHalfOptionsEnum } from '../components/configurator/options-list/options-list.component';
import { AddCartServerRequestInterface } from '../../checkout/models/server-cart-request';
import { ComboConfigGroup } from '../models/combo-config';
import { ServerCartResponseProductListInterface, } from '../../checkout/models/server-cart-response';
import { AppSettingsImageURLInterface } from '../../common/models/server-app-settings';
import { ProductKinds } from '../models/server-product-config';

/**
 * Configurator actions
 */
export enum ConfiguratorActionsTypes {
	FetchProductConfig = '[Catalog](Configurator) Fetch Product Config',
	ReloadProductConfig = '[Catalog](Configurator) Reload Product Config',

	FetchSingleProductSuccess = '[Catalog](Configurator) Fetch Single Product Success',
	FetchSingleConfigurableComboSuccess = '[Catalog](Configurator) Fetch Single Configurable Combo Success',
	FetchTwinProductConfigSuccess = '[Catalog](Configurator) Fetch Twin Product Config Success',

	FetchProductConfigFailure = '[Catalog](Configurator) Fetch Product Config Failure',

	ConfiguratorAddItemGetCategories = '[Catalog](Configurator) Configurator Add Item Get Categories',
	CopyServerCartToConfigurable = '[Catalog](Configurator) Copy Server Cart To Configurable',

	ChangeProductSize = '[Catalog](Configurator) Product Size Change',
	ChangeProductConfiguration = '[Catalog](Configurator) Change Product Configuration',
	ChangeProductSubConfiguration = '[Catalog](Configurator) Change Product Sub Configuration',

	IncreaseConfigurableItemQuantity = '[Catalog](Configurator) Increase Configurable Item Quantity',
	DecreaseConfigurableItemQuantity = '[Catalog](Configurator) Decrease Configurable Item Quantity',

	OptionsSelectUnSelect = '[Catalog](Configurator) Options select unselect',
	OptionsResetSelected = '[Catalog](Configurator) Option reset selected',
	OptionsSetHalfHalf = '[Catalog](Configurator) Options set half half',
	OptionsUpdateQuantity = '[Catalog](Configurator) Options set quantity',
	OptionsUpdateDropDown = '[Catalog](Configurator) Update drop down',

	ConfigureComboProductInModal = '[Catalog](Configurator) Configure Combo Product In Modal',
	CopyComboProductIntoConfigurable = '[Catalog](Configurator) Copy Combo Product Into Configurable',

	OpenQuickAddSingleProductModal = '[Catalog](Configurator) Open Quick Add Modal For Single Product',

	GetComboProductCartRequest = '[Catalog](Configurator) Get Product Cart Request from Config Modal',
	AddComboProductConfigToComboConfigurator = '[Catalog](Configurator) Add Product Cart Request to Combo Array Cart Reuest',
	ResetComboProductInCartRequestArray = '[Catalog](Configurator) Resets Product Group in Combo Array Cart Request',

	TwinProductSliderChange = '[Catalog](Configurator) Twin Product Slider Change',
	TwinProductSetNext = '[Catalog](Configurator) Twin Product Set Next',

	ProductConfigurationChanged = '[Catalog](Configurator) ProductConfigurationChange',
	SetConfiguratorTouchedPristine = '[Catalog](Configurator) SetConfiguratorTouchedPristine',

	FetchPersonalizedTemplateByID = '[Catalog](Configurator) Fetch Personalized Template By ID',
	UpdatePersonalizedTemplates = '[Catalog](Configurator) Update Personalized Template Array',
	UpdatePersonalizedTemplateFailed = '[Catalog](Configurator) Update Personalized Template Array Failure',

	SetUpsizeModalFlag = '[Catalog](Configurator) Set The Upsize Modal Flag',

	RemoveUnavailableToppings = '[Catalog](Configurator) Remove Unavailable Toppings',
	RevertToPreviousSize = '[Catalog](Configurator) Revert To Previous Size',

	SetPersonalMessageModalFlag = '[Catalog](Configurator) Set The Personal Message Modal Flag',
	UpdateCartRequestFromPizzaAssistant = '[Catalog](Configurator) We Need To Trigger A Refresh Of Cart Request',
	PersonalMessageHasChanged = '[Catalog](Configurator) Personal Message Has Changed'
}

// Product fetch and selection flow
export class FetchProductConfig implements Action {
	readonly type = ConfiguratorActionsTypes.FetchProductConfig;
	constructor(public storeId: number, public productId: string) { };
}
export class ReloadProductConfig implements Action {
	readonly type = ConfiguratorActionsTypes.ReloadProductConfig;
}

export class FetchSingleProductSuccess implements Action {
	readonly type = ConfiguratorActionsTypes.FetchSingleProductSuccess;
	constructor(
		public serverProductConfig: ServerProductConfig,
		public productImageBaseUrl: AppSettingsImageURLInterface
	) { };
}

export class FetchSingleConfigurableComboSuccess implements Action {
	readonly type = ConfiguratorActionsTypes.FetchSingleConfigurableComboSuccess;
	constructor(
		public serverProductConfig: ServerProductConfig,
		public productImageBaseUrl: AppSettingsImageURLInterface
	) { };
}

export class FetchTwinProductConfigSuccess implements Action {
	readonly type = ConfiguratorActionsTypes.FetchTwinProductConfigSuccess;
	constructor(
		public serverProductConfig: ServerProductConfig,
		public productImageBaseUrl: AppSettingsImageURLInterface
	) { };
}

export class FetchProductConfigFailure implements Action {
	readonly type = ConfiguratorActionsTypes.FetchProductConfigFailure;
}

export class ConfiguratorAddItemGetCategories implements Action {
	readonly type = ConfiguratorActionsTypes.ConfiguratorAddItemGetCategories;
}

export class CopyServerCartToConfigurable implements Action {
	readonly type = ConfiguratorActionsTypes.CopyServerCartToConfigurable;
	constructor(
		public productKind: ProductKinds,
		public cardProduct: ServerCartResponseProductListInterface
	) { }
}

// Product config change
export class ChangeProductSize implements Action {
	readonly type = ConfiguratorActionsTypes.ChangeProductSize;
	constructor(public productSizeId: number) { }
}

export class ChangeProductConfiguration implements Action {
	readonly type = ConfiguratorActionsTypes.ChangeProductConfiguration;
	constructor(public configurationId: string) { }
}

export class ChangeProductSubConfiguration implements Action {
	readonly type = ConfiguratorActionsTypes.ChangeProductSubConfiguration;
	constructor(public subConfigurationId: string) { }
}

export class IncreaseConfigurableItemQuantity implements Action {
	readonly type = ConfiguratorActionsTypes.IncreaseConfigurableItemQuantity;
}

export class DecreaseConfigurableItemQuantity implements Action {
	readonly type = ConfiguratorActionsTypes.DecreaseConfigurableItemQuantity;
}


// Options list actions
export class OptionsSelectUnSelect implements Action {
	readonly type = ConfiguratorActionsTypes.OptionsSelectUnSelect;
	constructor(public optionId: string) { };
}

export class OptionsResetSelected implements Action {
	readonly type = ConfiguratorActionsTypes.OptionsResetSelected;
}

export class TwinProductSliderChange implements Action {
	readonly type = ConfiguratorActionsTypes.TwinProductSliderChange;
	constructor(
		public newSelectionProductLineId: number,
		public sliderIndex: number
	) { };
}

export class TwinProductSetNext implements Action {
	readonly type = ConfiguratorActionsTypes.TwinProductSetNext;
	constructor() { };
}


export class OptionsSetHalfHalf implements Action {
	readonly type = ConfiguratorActionsTypes.OptionsSetHalfHalf;
	constructor(public optionId: string, public direction: HalfHalfOptionsEnum) { };
}

export class OptionsUpdateQuantity implements Action {
	readonly type = ConfiguratorActionsTypes.OptionsUpdateQuantity;
	constructor(public optionId: string, public quantityChange: number) { };
}

export class OptionsUpdateDropDown implements Action {
	readonly type = ConfiguratorActionsTypes.OptionsUpdateDropDown;
	constructor(public optionId: string, public selectedValue: string) { };
}

// Product combo configuration
export class ConfigureComboProductInModal implements Action {
	readonly type = ConfiguratorActionsTypes.ConfigureComboProductInModal;
	constructor(public productLineId: number) { }
}

export class CopyComboProductIntoConfigurable implements Action {
	readonly type = ConfiguratorActionsTypes.CopyComboProductIntoConfigurable;
	constructor(
		public comboServerConfig: ServerProductConfig,
		public productImageBaseUrl: AppSettingsImageURLInterface,
		public comboSubProductLineId: number,
		public currentAddToCartRequest?: AddCartServerRequestInterface,
		public invalidProductSiblings?: string[],
		public quantity?: number
	) { }
}

export class OpenQuickAddSingleProductModal implements Action {
	readonly type = ConfiguratorActionsTypes.OpenQuickAddSingleProductModal;
	constructor(public productId: string) { }
}

export class GetComboProductCartRequest implements Action {
	readonly type = ConfiguratorActionsTypes.GetComboProductCartRequest;
}
export class AddComboProductConfigToComboConfigurator implements Action {
	readonly type = ConfiguratorActionsTypes.AddComboProductConfigToComboConfigurator;
	constructor(public cartRequest: AddCartServerRequestInterface) { }
}
export class ResetComboProductInCartRequestArray implements Action {
	readonly type = ConfiguratorActionsTypes.ResetComboProductInCartRequestArray;
	constructor(public comboGroup: ComboConfigGroup) { }
}

export class ProductConfigurationChanged implements Action {
	readonly type = ConfiguratorActionsTypes.ProductConfigurationChanged;
}

export class SetConfiguratorTouchedPristine implements Action {
	readonly type = ConfiguratorActionsTypes.SetConfiguratorTouchedPristine;
}

export class SetUpsizeModalFlag implements Action {
	readonly type = ConfiguratorActionsTypes.SetUpsizeModalFlag;
	constructor(public isUpsizeFlagDefined: boolean) {}
}

export class SetPersonalMessageModalFlag implements Action {
	readonly type = ConfiguratorActionsTypes.SetPersonalMessageModalFlag;
	constructor(public isPersonalMessageDefined: boolean, public saveToLocalStorage: boolean) {}
}

export class RemoveUnavailableToppings implements Action {
	readonly type = ConfiguratorActionsTypes.RemoveUnavailableToppings
}
export class RevertToPreviousSize implements Action {
	readonly type = ConfiguratorActionsTypes.RevertToPreviousSize
}

export class UpdateCartRequestFromPizzaAssistant implements Action {
	readonly type = ConfiguratorActionsTypes.UpdateCartRequestFromPizzaAssistant
}
export class PersonalMessageHasChanged implements Action {
	readonly type = ConfiguratorActionsTypes.PersonalMessageHasChanged;
}

/**
 * REDUX action for configurator
 */
export type ConfiguratorActions =
	| FetchProductConfig
	| ReloadProductConfig
	| OpenQuickAddSingleProductModal


	| FetchSingleProductSuccess
	| FetchSingleConfigurableComboSuccess
	| FetchTwinProductConfigSuccess

	| FetchProductConfigFailure

	| ConfiguratorAddItemGetCategories
	| CopyServerCartToConfigurable

	| ChangeProductSize
	| ChangeProductConfiguration
	| ChangeProductSubConfiguration

	| IncreaseConfigurableItemQuantity
	| DecreaseConfigurableItemQuantity

	| OptionsSelectUnSelect
	| OptionsResetSelected
	| OptionsSetHalfHalf
	| OptionsUpdateQuantity
	| OptionsUpdateDropDown

	| ConfigureComboProductInModal
	| CopyComboProductIntoConfigurable
	| GetComboProductCartRequest
	| AddComboProductConfigToComboConfigurator
	| ResetComboProductInCartRequestArray

	| TwinProductSliderChange
	| TwinProductSetNext

	| ProductConfigurationChanged
	| SetConfiguratorTouchedPristine

	| SetUpsizeModalFlag
	| SetPersonalMessageModalFlag

	| RemoveUnavailableToppings
	| RevertToPreviousSize

	| UpdateCartRequestFromPizzaAssistant
	| PersonalMessageHasChanged
