// Ng Rx core
import { Action } from '@ngrx/store';
// Server Models
import {
	ServerCartResponseInterface,
	ServerCartStoreValidationInterface,
	ServerCartValidationInterface
} from '../models/server-cart-response';

// Configurator state interface
import { State as ConfiguratorStateInterface } from '../../catalog/reducers/configurator';
import { State as StoreStateInterface } from '../../common/reducers/store';

import {
	AddressListInterface
} from '../../common/models/address-list';
import { StoreServerInterface } from '../../common/models/server-store';
import { FutureHoursResponse } from '../models/server-process-order-response';
import { UpdateUserCartOptions } from '../models/order-checkout'
import {
	AddCartServerRequestInterface,
	AddCartProductServerRequestInterface,
	AddToCartProductServerRequestInterface,
	ValidateStoreInterface
} from '../models/server-cart-request';
import { StoreListInterface } from '../../common/models/store-list';
import { ServerCartResponseProductListInterface } from '../models/server-cart-response';
import { ServerProductConfig, ServerProductConfigProduct } from '../../catalog/models/server-product-config';
import { ServerValidationError } from '../../common/models/server-validation-error';

/**
 * Cart REDUX action
 */
export enum CartActionsTypes {
	ClearAddToCartRequest = '[Checkout](Cart) Clear Add To Cart Request',

	BuildSingleProductAddToCartRequest = '[Checkout](Cart) Build Single Product Add To Cart Request',
	BuildComboProductAddToCartRequest = '[Checkout](Cart) Build Combo Product Add To Cart Request',

	BuildSingleConfigurableProductAddToCartRequest = '[Checkout](Cart) Build Sigle Configurable Product Add To Cart Request',
	BuildTwinProductAddToCartRequest = '[Checkout](Cart) Build Twin Product Add To Cart Request',
	AddFlatComboProductToCartRequest = '[Checkout](Cart) Add Flat Combo Product To Cart Request',
	RemoveComboProductFromCartRequest = '[Checkout](Cart) Remove Combo Product From Cart Request',

	AddConfigurableProductToCart = '[Checkout](Cart) Add Configurable Product To Cart',
	AddConfigurableProductToCartSuccess = '[Checkout](Cart) Add Configurable Product To Cart Success',
	AddConfigurableProductToCartFailure = '[Checkout](Cart) Add Configurable Product To Cart Failure',

	AddBasicProductToCart = '[Checkout](Cart) Add Basic Product To Cart',
	AddBasicProductToCartSuccess = '[Checkout](Cart) Add Basic Product To Cart Success',
	AddBasicProductToCartFailure = '[Checkout](Cart) Add Basic Product To Cart Failure',

	FetchUserCart = '[Checkout](Cart) Fetch User Cart',
	FetchUserCartSuccess = '[Checkout](Cart) Fetch User Cart Success',
	FetchUserCartFailure = '[Checkout](Cart) Fetch User Cart Failure ',
	FetchUserCartViaCouponSuccess = '[Checkout](Cart) Fetch User Cart Success Via Coupon',
	UserHasNoCart = '[Checkout](Cart) User Has No Cart',

	RemoveCartItem = '[Checkout](Cart) Remove Cart Item',
	RemoveCartItemSuccess = '[Checkout](Cart) Remove Cart Item Success',
	RemoveCartItemFailure = '[Checkout](Cart) Remove Cart Item Failure',

	UpdateConfigurableProductToCart = '[Checkout](Cart) Send Request To Update Cart Item',
	UpdateConfigurableProductToCartSuccess = '[Checkout](Cart) Request To Update Cart Success',
	UpdateConfigurableProductToCartFailure = '[Checkout](Cart) Request To Update Cart Failed',

	AddComboToCart = '[Checkout](Cart) Add Combo To Cart',
	AddComboToCartSuccess = '[Checkout](Cart) Add Combo To Cart Success',
	AddComboToCartFailure = '[Checkout](Cart) Add Combo To Cart Failed',
	AddValidIncompleteProductToCartRequest = '[Checkout](Cart) Add Valid Incomplete Product To Cart Request',
	RemoveUnavailableIngredientsFromTwinInCart = '[Checkout](Cart) Remove Unavailable Ingredients from ATR',

	UpdateComboToCart = '[Checkout](Cart) Update Combo To Cart',
	UpdateComboToCartSuccess = '[Checkout](Cart) Update Combo To Cart Success',
	UpdateComboToCartFailure = '[Checkout](Cart) Update Combo To Cart Failed',

	UpdateCartItemQuantity = '[Checkout](Cart) Update Cart Item Quantity From Directly In Cart',
	SetTwinAddToCartRequestToConfigurator = '[Checkout](Cart) Set Twin Add To Cart Request To Configurator',

	SelectDefaultAddress = '[Checkout](Cart) Select Default Address For Checkout',
	SelectPickupStoreForCheckout = '[Checkout](Cart) Select Pickup Store For Checkout',
	SelectDeliveryAddressForCheckout = '[Checkout](Cart) Select Delivery Address For Checkout',
	AddStoreObjectToCheckout = '[Checkout](Cart) Add Store Object To Checkout',

	FetchDeliveryStoreForCheckout = '[Checkout](Cart) Fetch Delivery Store For Checkout',
	FetchDeliveryStoreForCheckoutSuccess = '[Checkout](Cart) Fetch Delivery Store For Checkout Success',
	FetchDeliveryStoreForCheckoutFailure = '[Checkout](Cart) Fetch Delivery Store For Checkout Failure',

	ValidateCheckoutStore = '[Checkout](Cart) Validate Checkout Store',
	ProcessCheckoutStoreValidation = '[Checkout](Cart) Process Checkout Store Validaion',

	ValidateCheckoutStoreInvalid = '[Checkout](Cart) Checkout Store Invalid',
	ValidateCheckoutStoreSuccess = '[Checkout](Cart) Checkout Store Valid',
	ValidateCheckoutStoreFailed = '[Checkout](Cart) Checkout Store Validation Call Failed',

	ValidateCart = '[Checkout](Cart) Validate Cart With New Store',
	ValidateCartSuccess = '[Checkout](Cart) Cart Is Valid',
	ValidateCartInvalid = '[Checkout](Cart) Cart Is inValid',
	ValidateCartFailed = '[Checkout](Cart) Validate Cart Call Failed',

	FetchStoreHoursForCheckout = '[Checkout](Cart) Fetch Store Hours For Checkout',
	FetchStoreHoursForCheckoutSuccess = '[Checkout](Cart) Fetch Store Hours For Checkout Success',
	FetchStoreHoursForCheckoutFailure = '[Checkout](Cart) Fetch Store Hours For Checkout Failure',

	UpdateUserCart = '[Checkout](Cart) Update User Cart With New Store ID',
	UpdateUserCartSuccess = '[Checkout](Cart) Update User Cart With New Store ID Success',
	UpdateUserCartFailed = '[Checkout](Cart) Update User Cart With New Store ID Failed',

	TooManyItemsInCartFailure = '[Checkout](Cart) Too Many Items In Cart',

	RevertAddToCartRequest = '[Checkout](Cart) Revert Add To Cart Request',

	AddAdvancedProductToCart = '[Checkout](Cart) Add Advanced Product To Cart',
	AddAdvancedProductToCartSuccess = '[Checkout](Cart) Add Advanced Product To Cart Success',
	AddAdvancedProductToCartFailure = '[Checkout](Cart) Add Advanced Product To Cart Failure',

	AddProductArrayToCart = '[Checkout](Cart) Add Product Array From Just For You To Cart',
	AddProductArrayToCartSuccess = '[Checkout](Cart) Add Product Array From Just For You To Cart Success',
	AddProductArrayToCartFailure = '[Checkout](Cart) Add Product Array From Just For You To Cart Failure',

	AddPizzaAssistantProductsToCart = '[Checkout](Cart) Add Products From Pizza Assistant To Cart',
	AddPizzaAssistantProductsToCartSuccess = '[Checkout](Cart) Add Products From Pizza Assistant To Cart Success',
	AddPizzaAssistantProductsToCartFailure = '[Checkout](Cart) Add Products From Pizza Assistant To Cart Failure',

	ShowIncompleteOrderPopup = '[Checkout](Cart) Show Incomplete Order Pop up',
	CloseIncompleteOrderPopup = '[Checkout](Cart) Close Incomplete Order Pop up',
}

export class ClearAddToCartRequest implements Action {
	readonly type = CartActionsTypes.ClearAddToCartRequest
}
export class BuildSingleProductAddToCartRequest implements Action {
	readonly type = CartActionsTypes.BuildSingleProductAddToCartRequest;
	constructor(
		public configuratorState: ConfiguratorStateInterface,
		public storeState: StoreStateInterface,
		public currentAddToCartRequest: AddCartServerRequestInterface,
		public cardProduct?: ServerCartResponseProductListInterface
	) { }
}

export class BuildComboProductAddToCartRequest implements Action {
	readonly type = CartActionsTypes.BuildComboProductAddToCartRequest;
	constructor(
		public serverComboConfig: ServerProductConfig,
		public configuratorState: ConfiguratorStateInterface,
		public storeState: StoreStateInterface,
		public currentAddToCartRequest: AddCartServerRequestInterface,
		public cardProduct?: ServerCartResponseProductListInterface
	) { }
}

export class AddFlatComboProductToCartRequest implements Action {
	readonly type = CartActionsTypes.AddFlatComboProductToCartRequest;
	constructor(
		public cartChildRequest: AddToCartProductServerRequestInterface,
		public cardProduct?: ServerCartResponseProductListInterface,
	) { }
}

export class RemoveComboProductFromCartRequest implements Action {
	readonly type = CartActionsTypes.RemoveComboProductFromCartRequest;
	constructor(public lineId: number) { }
}
export class BuildSingleConfigurableProductAddToCartRequest implements Action {
	readonly type = CartActionsTypes.BuildSingleConfigurableProductAddToCartRequest;
	constructor(
		public configuratorState: ConfiguratorStateInterface,
		public storeState: StoreStateInterface,
		public currentAddToCartRequest: AddCartServerRequestInterface,
		public cardProduct?: ServerCartResponseProductListInterface
	) { }
}

export class BuildTwinProductAddToCartRequest implements Action {
	readonly type = CartActionsTypes.BuildTwinProductAddToCartRequest;
	constructor(
		public configuratorState: ConfiguratorStateInterface,
		public storeState: StoreStateInterface,
		public currentAddToCartRequest: AddCartServerRequestInterface,
		public cardProduct?: ServerCartResponseProductListInterface
	) { }
}

// Add to cart actions
export class AddConfigurableProductToCart implements Action {
	readonly type = CartActionsTypes.AddConfigurableProductToCart;
	constructor(public isUpsizeAsked?: boolean) { }
}

export class AddConfigurableProductToCartSuccess implements Action {
	readonly type = CartActionsTypes.AddConfigurableProductToCartSuccess;
	constructor(
		public serverResponse: ServerCartResponseInterface,
		public imageBaseUrl: string
	) { }
}

export class AddConfigurableProductToCartFailure implements Action {
	readonly type = CartActionsTypes.AddConfigurableProductToCartFailure;
}

export class AddBasicProductToCart implements Action {
	readonly type = CartActionsTypes.AddBasicProductToCart;
	constructor(public productId: string, public isRecommendation?: boolean) { }
}

export class AddBasicProductToCartSuccess implements Action {
	readonly type = CartActionsTypes.AddBasicProductToCartSuccess;
	constructor(
		public serverResponse: ServerCartResponseInterface,
		public imageBaseUrl: string
	) { }
}

export class AddBasicProductToCartFailure implements Action {
	readonly type = CartActionsTypes.AddBasicProductToCartFailure;
}

// To Many Items In Cart
export class TooManyItemsInCartFailure implements Action {
	readonly type = CartActionsTypes.TooManyItemsInCartFailure
}

// Remove from cart
export class RemoveCartItem implements Action {
	readonly type = CartActionsTypes.RemoveCartItem;
	constructor(
		public productCartId: number
	) { }
}

export class RemoveCartItemSuccess implements Action {
	readonly type = CartActionsTypes.RemoveCartItemSuccess;
	constructor(
		public serverResponse: ServerCartResponseInterface,
		public imageBaseUrl: string,
		public removedProductId?: string,
		public serverCart?: ServerCartResponseInterface
	) { }
}

export class RemoveCartItemFailure implements Action {
	readonly type = CartActionsTypes.RemoveCartItemFailure;
}


// Fetch cart on load
export class FetchUserCart implements Action {
	readonly type = CartActionsTypes.FetchUserCart;
	constructor(public removeInvalid?: boolean) { }
}

export class FetchUserCartSuccess implements Action {
	readonly type = CartActionsTypes.FetchUserCartSuccess;
	constructor(
		public serverResponse: ServerCartResponseInterface,
		public imageBaseUrl: string,
		public isLoyalityRedemtion?: boolean,
		public isKeepValidationState?: boolean,
	) { }
}

export class ShowIncompleteOrderPopup implements Action {
	readonly type = CartActionsTypes.ShowIncompleteOrderPopup
}
export class CloseIncompleteOrderPopup implements Action {
	readonly type = CartActionsTypes.CloseIncompleteOrderPopup
	constructor(public isClearCart: boolean) { }
}
export class FetchUserCartViaCouponSuccess implements Action {
	readonly type = CartActionsTypes.FetchUserCartViaCouponSuccess;
	constructor(
		public serverResponse: ServerCartResponseInterface,
		public imageBaseUrl: string
	) { }
}
export class FetchUserCartFailure implements Action {
	readonly type = CartActionsTypes.FetchUserCartFailure;
}

export class UserHasNoCart implements Action {
	readonly type = CartActionsTypes.UserHasNoCart
}

// Update Cart Items
export class UpdateConfigurableProductToCart implements Action {
	readonly type = CartActionsTypes.UpdateConfigurableProductToCart;
	constructor(public isUpsizeAsked?: boolean) { }
}

export class UpdateConfigurableProductToCartSuccess implements Action {
	readonly type = CartActionsTypes.UpdateConfigurableProductToCartSuccess;
	constructor(
		public serverResponse: ServerCartResponseInterface,
		public imageBaseUrl: string
	) { }
}

export class UpdateConfigurableProductToCartFailure implements Action {
	readonly type = CartActionsTypes.UpdateConfigurableProductToCartFailure;
}


// Combo Cart Actions
export class AddComboToCart implements Action {
	readonly type = CartActionsTypes.AddComboToCart;
}
export class AddComboToCartSuccess implements Action {
	readonly type = CartActionsTypes.AddComboToCartSuccess;
	constructor(
		public serverResponse: ServerCartResponseInterface,
		public imageBaseUrl: string
	) { }
}
export class AddComboToCartFailure implements Action {
	readonly type = CartActionsTypes.AddComboToCartFailure;
}

export class AddValidIncompleteProductToCartRequest implements Action {
	readonly type = CartActionsTypes.AddValidIncompleteProductToCartRequest
	constructor(
		public serverResponseComboProductsArray: ServerProductConfigProduct[],
		public notConfiguredLineIdsArray: number[]
	) { }
}
export class RemoveUnavailableIngredientsFromTwinInCart implements Action {
	readonly type = CartActionsTypes.RemoveUnavailableIngredientsFromTwinInCart
	constructor(
		public comboConfigServer: ServerProductConfig,
		public unavailableIngredients: string[],
		public productLineId: number
	) { }
}

export class UpdateComboToCart implements Action {
	readonly type = CartActionsTypes.UpdateComboToCart;
}
export class UpdateComboToCartSuccess implements Action {
	readonly type = CartActionsTypes.UpdateComboToCartSuccess;
	constructor(
		public serverResponse: ServerCartResponseInterface,
		public imageBaseUrl: string
	) { }
}
export class UpdateComboToCartFailure implements Action {
	readonly type = CartActionsTypes.UpdateComboToCartFailure;
}

export class UpdateCartItemQuantity implements Action {
	readonly type = CartActionsTypes.UpdateCartItemQuantity;
	constructor(public productCartId: number, public isIncreaseQuantity: boolean) { }
}

export class SetTwinAddToCartRequestToConfigurator implements Action {
	readonly type = CartActionsTypes.SetTwinAddToCartRequestToConfigurator;
	constructor(
		public twinLineId: number,
		public productAddToCartRequest: AddCartProductServerRequestInterface
	) { }
}

export class SelectDefaultAddress implements Action {
	readonly type = CartActionsTypes.SelectDefaultAddress;
}
export class FetchDeliveryStoreForCheckout implements Action {
	readonly type = CartActionsTypes.FetchDeliveryStoreForCheckout;
	constructor(public addressQuery: AddressListInterface) { }
}
export class FetchDeliveryStoreForCheckoutSuccess implements Action {
	readonly type = CartActionsTypes.FetchDeliveryStoreForCheckoutSuccess;
	constructor(public store: StoreServerInterface, public addressId: number | string, public addressQuery: AddressListInterface) { }
}
export class FetchDeliveryStoreForCheckoutFailure implements Action {
	readonly type = CartActionsTypes.FetchDeliveryStoreForCheckoutFailure;
}

export class SelectDeliveryAddressForCheckout implements Action {
	readonly type = CartActionsTypes.SelectDeliveryAddressForCheckout;
	constructor(public addressId: number | string) { }
}
export class SelectPickupStoreForCheckout implements Action {
	readonly type = CartActionsTypes.SelectPickupStoreForCheckout;
	constructor(public storeId: number) { }
}
export class AddStoreObjectToCheckout implements Action {
	readonly type = CartActionsTypes.AddStoreObjectToCheckout;
	constructor(public store: StoreListInterface) { }
}

export class FetchStoreHoursForCheckout implements Action {
	readonly type = CartActionsTypes.FetchStoreHoursForCheckout;
	constructor(public isDelivery: boolean, public storeId?: number, public addressInput?: AddressListInterface) { }
}
export class FetchStoreHoursForCheckoutSuccess implements Action {
	readonly type = CartActionsTypes.FetchStoreHoursForCheckoutSuccess;
	constructor(public storeHours: FutureHoursResponse[], public locale: string) { }
}
export class FetchStoreHoursForCheckoutFailure implements Action {
	readonly type = CartActionsTypes.FetchStoreHoursForCheckoutFailure;
}

export class ValidateCheckoutStore implements Action {
	readonly type = CartActionsTypes.ValidateCheckoutStore;
	constructor(
		public isDelivery: boolean,
		public addressInput: AddressListInterface,
		public isFutureOrder: boolean,
		public storeId?: number,
		public isMPRedirect?: boolean
	) { }
}
export class ValidateCheckoutStoreInvalid implements Action {
	readonly type = CartActionsTypes.ValidateCheckoutStoreInvalid;
	constructor(public validationResponse: ServerCartStoreValidationInterface) { }
}

export class ProcessCheckoutStoreValidation implements Action {
	readonly type = CartActionsTypes.ProcessCheckoutStoreValidation;
	constructor(public validationResponse: ServerCartStoreValidationInterface, public isDelivery: boolean) { }
}
export class ValidateCheckoutStoreSuccess implements Action {
	readonly type = CartActionsTypes.ValidateCheckoutStoreSuccess
}
export class ValidateCheckoutStoreFailed implements Action {
	readonly type = CartActionsTypes.ValidateCheckoutStoreFailed
	constructor(public validationError: ServerValidationError) { }
}
export class ValidateCart implements Action {
	readonly type = CartActionsTypes.ValidateCart;
	constructor(
		public validateRequest: ValidateStoreInterface,
		public isStrictValidation: boolean,
		public store?: StoreServerInterface,
		public isDelivery?: boolean,
		public contactless?: boolean,
	) { }

}
export class ValidateCartSuccess implements Action {
	readonly type = CartActionsTypes.ValidateCartSuccess;
	constructor(
		public validationResponse: ServerCartStoreValidationInterface,
		public isDelivery: boolean,
		public isStrictValidation: boolean,
		public contactless?: boolean
	) { }
}
export class ValidateCartInvalid implements Action {
	readonly type = CartActionsTypes.ValidateCartInvalid;
	constructor(
		public validationResponse: ServerCartStoreValidationInterface,
		public isDelivery: boolean,
		public isStrictValidation: boolean,
	) { }
}

export class ValidateCartFailed implements Action {
	readonly type = CartActionsTypes.ValidateCartFailed;
	constructor(public validationError: ServerValidationError) { }
}

export class UpdateUserCart implements Action {
	readonly type = CartActionsTypes.UpdateUserCart;
	constructor(public options: UpdateUserCartOptions) { }
}
export class UpdateUserCartSuccess implements Action {
	readonly type = CartActionsTypes.UpdateUserCartSuccess;
	constructor(
		public serverResponse: ServerCartResponseInterface,
		public imageBaseUrl: string,
		public store: StoreServerInterface,
		public skipStoreUpdate: boolean = false,
		public isKeepValidationState: boolean = false
	) { }
}
export class UpdateUserCartFailed implements Action {
	readonly type = CartActionsTypes.UpdateUserCartFailed;
}

export class RevertAddToCartRequest implements Action {
	readonly type = CartActionsTypes.RevertAddToCartRequest
}

export class AddAdvancedProductToCart implements Action {
	readonly type = CartActionsTypes.AddAdvancedProductToCart;
	constructor(public productId: string, public isRecommendation?: boolean) { }
}

export class AddAdvancedProductToCartSuccess implements Action {
	readonly type = CartActionsTypes.AddAdvancedProductToCartSuccess;
	constructor(
		public serverResponse: ServerCartResponseInterface,
		public imageBaseUrl: string
	) { }
}

export class AddAdvancedProductToCartFailure implements Action {
	readonly type = CartActionsTypes.AddAdvancedProductToCartFailure;
}

export class AddProductArrayToCart implements Action {
	readonly type = CartActionsTypes.AddProductArrayToCart
}
export class AddProductArrayToCartSuccess implements Action {
	readonly type = CartActionsTypes.AddProductArrayToCartSuccess
	constructor(
		public serverResponse: ServerCartResponseInterface,
		public imageBaseUrl: string
	) { }
}
export class AddProductArrayToCartFailure implements Action {
	readonly type = CartActionsTypes.AddProductArrayToCartFailure
}

export class AddPizzaAssistantProductsToCart implements Action {
	readonly type = CartActionsTypes.AddPizzaAssistantProductsToCart
}
export class AddPizzaAssistantProductsToCartSuccess implements Action {
	readonly type = CartActionsTypes.AddPizzaAssistantProductsToCartSuccess
	constructor(
		public serverResponse: ServerCartResponseInterface,
		public imageBaseUrl: string
	) { }
}
export class AddPizzaAssistantProductsToCartFailure implements Action {
	readonly type = CartActionsTypes.AddPizzaAssistantProductsToCartFailure
}

export type CartActions =
	| ClearAddToCartRequest
	| BuildSingleProductAddToCartRequest
	| BuildComboProductAddToCartRequest
	| BuildSingleConfigurableProductAddToCartRequest
	| BuildTwinProductAddToCartRequest
	| AddFlatComboProductToCartRequest
	| RemoveComboProductFromCartRequest

	| AddConfigurableProductToCart
	| AddConfigurableProductToCartSuccess
	| AddConfigurableProductToCartFailure

	| AddBasicProductToCart
	| AddBasicProductToCartSuccess
	| AddBasicProductToCartFailure

	| RemoveCartItem
	| RemoveCartItemSuccess
	| RemoveCartItemFailure

	| FetchUserCart
	| FetchUserCartSuccess
	| FetchUserCartFailure
	| FetchUserCartViaCouponSuccess

	| UpdateConfigurableProductToCart
	| UpdateConfigurableProductToCartSuccess
	| UpdateConfigurableProductToCartFailure

	| AddComboToCart
	| AddComboToCartSuccess
	| AddComboToCartFailure
	| UpdateComboToCart
	| UpdateComboToCartSuccess
	| UpdateComboToCartFailure
	| RemoveUnavailableIngredientsFromTwinInCart

	| UpdateCartItemQuantity
	| SetTwinAddToCartRequestToConfigurator

	| SelectPickupStoreForCheckout
	| SelectDeliveryAddressForCheckout
	| AddStoreObjectToCheckout
	| SelectDefaultAddress

	| FetchDeliveryStoreForCheckout
	| FetchDeliveryStoreForCheckoutSuccess
	| FetchDeliveryStoreForCheckoutFailure

	| ValidateCheckoutStore
	| ProcessCheckoutStoreValidation
	| ValidateCheckoutStoreInvalid
	| ValidateCheckoutStoreSuccess
	| ValidateCheckoutStoreFailed
	| ValidateCart
	| ValidateCartSuccess
	| ValidateCartFailed
	| ValidateCartInvalid

	| FetchStoreHoursForCheckout
	| FetchStoreHoursForCheckoutSuccess
	| FetchStoreHoursForCheckoutFailure

	| UpdateUserCartSuccess
	| UpdateUserCartFailed
	| UpdateUserCart

	| TooManyItemsInCartFailure

	| RevertAddToCartRequest

	| AddValidIncompleteProductToCartRequest
	| UserHasNoCart

	| AddAdvancedProductToCart
	| AddAdvancedProductToCartSuccess
	| AddAdvancedProductToCartFailure

	| AddProductArrayToCart
	| AddProductArrayToCartSuccess
	| AddProductArrayToCartFailure

	| AddPizzaAssistantProductsToCart
	| AddPizzaAssistantProductsToCartSuccess
	| AddPizzaAssistantProductsToCartFailure

	| ShowIncompleteOrderPopup
	| CloseIncompleteOrderPopup
