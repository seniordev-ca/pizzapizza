import { Action } from '@ngrx/store';
import { ServerAddressResponse, ServerUpdateAddressResponse } from '../models/server-models/server-account-interfaces';
import { AddressListInterface } from '../../common/models/address-list';
import { StoreListServerInterface, StoreItemServerInterface } from '../../common/models/server-store'
import {
	AddressInputInterface
} from '../../common/models/address-input';
import {
	ServerPaymentResponseInterface,
	ServerPaymentRequestInterface,
	ServerSetDefaultPaymentMethodInterface,
	ServerMealCardRequestInterface,
	ServerPaymentMethodInterface
} from '../models/server-models/server-saved-cards-interfaces';
import { ServerValidationError } from 'app/common/models/server-validation-error';
// tslint:disable-next-line:max-line-length
import { CheckoutPaymentMethodFormActionEnum } from 'app/common/components/shared/checkout-payment-method-form/checkout-payment-method-form.component';

/**
 * Account Actions
 */
export enum AccountActionTypes {
	LoadAccountPage = '[User](Account) Load Page',
	LoadAccountPageFail = '[User](Account) Load Page Failed',

	RequestAccountAddresses = '[User](Account) Request User Addresses',
	RequestAccountAddressesSuccess = '[User](Account) Request User Addresses Success',
	RequestAccountAddressesFailure = '[User](Account) Request User Addresses Failed',
	GetAddressByID = '[User](Account) Get User Address From NGRX Store via ID',

	RequestAccountDefaultAddress = '[User](Account) Request User Default Address',

	UpdateAddressRequest = '[User](Account) Update User Address',
	UpdateAddressRequestSuccess = '[User](Account) Update User Address Success',
	UpdateAddressRequestFailure = '[User](Account) Update User Address Failed',

	SetDefaultAddress = '[User](Account) Set Default Address',
	DeleteAddressRequest = '[User](Account) Delete User Address',
	DeleteAddressRequestSuccess = '[User](Account) Delete User Address Sucess',
	DeleteAddressRequestFailure = '[User](Account) Delete User Address Failed',

	RequestAccountStores = '[User](Account) Request User Stores',
	RequestAccountStoresSuccess = '[User](Account) Request User Stores Success',
	RequestAccountStoresFailure = '[User](Account) Request User Stores Failed',

	SearchForStores = '[User](Account) Search For Stores',
	SearchForStoresSuccess = '[User](Account) Search For Stores Success',
	SearchForStoresFailure = '[User](Account) Search For Stores Failure',
	UpdateStoreRequest = '[User](Account) Update User Store',
	UpdateStoreRequestSuccess = '[User](Account) Update User Store Success',
	UpdateStoreRequestFailure = '[User](Account) Update User Store Failure',

	SyncUserAddresses = '[User](Account) Sync User Addresses after update or delete',
	SyncUserStores = '[User](Account) Sync User Stores after update or delete',

	ClearStoreSearch = '[User](Account) Clear Search List',

	RequestSavedCards = '[User](Account) Request User Cards',
	RequestSavedCardsSuccess = '[User](Account) Request User Cards Success',
	RequestSavedCardsFailure = '[User](Account) Request User Cards Failed',

	AddUserCard = '[User](Account) Add User Card',
	AddUserCardSuccess = '[User](Account) Add User Card Success',
	AddUserCardFailure = '[User](Account) Add User Card Failure',
	ClearCardFailureMessage =  '[User](Account) Add User Card Clearing Failure Message ',

	AddUserCardForCheckout = '[User](Account) Add User Card For Checkout',
	AddUserCardForCheckoutSuccess = '[User](Account) Add User Card For Checkout Success',
	AddUserCardForCheckoutFailure = '[User](Account) Add User Card For Checkout Failure',

	SetUserDefaultPaymentMethod = '[User](Account) Set Default Payment Method For User',
	SetUserDefaultPaymentMethodSuccess = '[User](Account) Set Default Payment Method For User Success',
	SetUserDefaultPaymentMethodFailure = '[User](Account) Set Default Payment Method For User Failure',
	SelectPaymentMethodForCheckout = '[User](Account) Select Payment Method For Checkout',
	DeletePaymentMethod = '[User](Account) Delete User Payment Method',
	EditPaymentMethod = '[User](Account) Edit User Payment Method',

	SaveMealCard = '[User](Account) Save Meal Card To Account',
	SaveMealCardSuccess = '[User](Account) Save Meal Card Success',
	SavelMealCardFailure = '[User](Account) Save Meal Card Failed',

	DeleteMealCard = '[User](Account) Delete Meal Card',
	DeleteMealCardSuccess = '[User](Account) Delete Meal Card Success'
}
export class LoadAccountPage implements Action {
	readonly type = AccountActionTypes.LoadAccountPage;
	constructor() { }
}
export class LoadAccountPageFail implements Action {
	readonly type = AccountActionTypes.LoadAccountPageFail;
	constructor() { }
}
export class RequestAccountAddresses implements Action {
	readonly type = AccountActionTypes.RequestAccountAddresses;
	constructor(public isInitialFetch: boolean) { }
}
export class RequestAccountAddressesSuccess implements Action {
	readonly type = AccountActionTypes.RequestAccountAddressesSuccess;
	constructor(
		public accountAddresses: ServerAddressResponse[],
		public userInputAddress?: AddressInputInterface,
		public isDeliveryTab?: boolean
	) { }
}
export class RequestAccountAddressesFailure implements Action {
	readonly type = AccountActionTypes.RequestAccountAddressesFailure;
	constructor() { }
}
export class RequestAccountDefaultAddress implements Action {
	readonly type = AccountActionTypes.RequestAccountDefaultAddress;
	constructor() { }
}

export class RequestAccountStores implements Action {
	readonly type = AccountActionTypes.RequestAccountStores;
	constructor(public isInitialFetch: boolean) { }
}
export class RequestAccountStoresSuccess implements Action {
	readonly type = AccountActionTypes.RequestAccountStoresSuccess;
	constructor(
		public accountStores: StoreItemServerInterface[],
		public selectedStore?: StoreItemServerInterface,
		public isDeliveryTab?: boolean
	) { }
}
export class RequestAccountStoresFailure implements Action {
	readonly type = AccountActionTypes.RequestAccountStoresFailure;
	constructor() { }
}

export class GetAddressByID implements Action {
	readonly type = AccountActionTypes.GetAddressByID;
	constructor(public addressID: number) { }
}

export class UpdateAddressRequest implements Action {
	readonly type = AccountActionTypes.UpdateAddressRequest;
	constructor(public addressRequest: AddressListInterface) { }
}
export class UpdateAddressRequestSuccess implements Action {
	readonly type = AccountActionTypes.UpdateAddressRequestSuccess;
	constructor(public successPayload: ServerUpdateAddressResponse, public isResidential: boolean) { }
}
export class UpdateAddressRequestFailure implements Action {
	readonly type = AccountActionTypes.UpdateAddressRequestFailure;
	constructor(public error: ServerValidationError) { }
}
export class SetDefaultAddress implements Action {
	readonly type = AccountActionTypes.SetDefaultAddress;
	constructor( public addressId: number ) { }
}


export class DeleteAddressRequest implements Action {
	readonly type = AccountActionTypes.DeleteAddressRequest;
	constructor(public addressId: number) { }
}
export class DeleteAddressRequestSuccess implements Action {
	readonly type = AccountActionTypes.DeleteAddressRequestSuccess;
	constructor(public successPayload: ServerUpdateAddressResponse) { }
}
export class DeleteAddressRequestFailure implements Action {
	readonly type = AccountActionTypes.DeleteAddressRequestFailure;
	constructor() { }
}

export class SearchForStores implements Action {
	readonly type = AccountActionTypes.SearchForStores;
	constructor(public payload: AddressInputInterface, public cursor?: string) { }
}
export class SearchForStoresSuccess implements Action {
	readonly type = AccountActionTypes.SearchForStoresSuccess
	constructor(public payload: StoreListServerInterface, public formattedAddress?: string) { }
}
export class SearchForStoresFailure implements Action {
	readonly type = AccountActionTypes.SearchForStoresFailure
}
export class UpdateStoreRequest implements Action {
	readonly type = AccountActionTypes.UpdateStoreRequest;
	constructor(public storeId: number, public isDelete?: boolean, public isDefault?: boolean, public isNew?: boolean) { }
}
export class UpdateStoreRequestSuccess implements Action {
	readonly type = AccountActionTypes.UpdateStoreRequestSuccess;
	constructor(public successPayload: ServerUpdateAddressResponse, public storeId) { }
}
export class UpdateStoreRequestFailure implements Action {
	readonly type = AccountActionTypes.UpdateStoreRequestFailure;
	constructor() { }
}
export class ClearStoreSearch implements Action {
	readonly type = AccountActionTypes.ClearStoreSearch;
}

export class SyncUserAddresses implements Action {
	readonly type = AccountActionTypes.SyncUserAddresses;
	constructor() { }
}

export class SyncUserStores implements Action {
	readonly type = AccountActionTypes.SyncUserStores;
	constructor() { }
}

export class RequestSavedCards implements Action {
	readonly type = AccountActionTypes.RequestSavedCards
}
export class RequestSavedCardsSuccess implements Action {
	readonly type = AccountActionTypes.RequestSavedCardsSuccess
	constructor(public userCards: ServerPaymentResponseInterface, public userDefaultToken: string) { }
}
export class RequestSavedCardsFailure implements Action {
	readonly type = AccountActionTypes.RequestSavedCardsFailure
}

export class AddUserCard implements Action {
	readonly type = AccountActionTypes.AddUserCard
	constructor(public request: ServerPaymentRequestInterface, public existingToken: string) { }
}
export class AddUserCardSuccess implements Action {
	readonly type = AccountActionTypes.AddUserCardSuccess
	constructor(public response: ServerPaymentResponseInterface, public userDefaultToken: string) { }
}
export class AddUserCardFailure implements Action {
	readonly type = AccountActionTypes.AddUserCardFailure
	constructor(public error: ServerValidationError) {}
}

export class ClearCardFailureMessage implements Action {
	readonly type = AccountActionTypes.ClearCardFailureMessage
}

export class AddUserCardForCheckout implements Action {
	readonly type = AccountActionTypes.AddUserCardForCheckout
	constructor(public request: ServerPaymentRequestInterface, public existingToken: string) { }
}
export class AddUserCardForCheckoutSuccess implements Action {
	readonly type = AccountActionTypes.AddUserCardForCheckoutSuccess
	constructor(public response: ServerPaymentResponseInterface, public userDefaultToken: string) { }
}
export class AddUserCardForCheckoutFailure implements Action {
	readonly type = AccountActionTypes.AddUserCardForCheckoutFailure
	constructor(public error: ServerValidationError) { }
}
export class SetUserDefaultPaymentMethod implements Action {
	readonly type = AccountActionTypes.SetUserDefaultPaymentMethod
	constructor(public defaultPayment: ServerSetDefaultPaymentMethodInterface) { }
}
export class SetUserDefaultPaymentMethodSuccess implements Action {
	readonly type = AccountActionTypes.SetUserDefaultPaymentMethodSuccess
	constructor(public defaultPayment: ServerSetDefaultPaymentMethodInterface) {}
}
export class SetUserDefaultPaymentMethodFailure implements Action {
	readonly type = AccountActionTypes.SetUserDefaultPaymentMethodFailure
}
export class SelectPaymentMethodForCheckout implements Action {
	readonly type = AccountActionTypes.SelectPaymentMethodForCheckout
	constructor(public token: string, public checkoutPaymentMethodAction?: CheckoutPaymentMethodFormActionEnum) { }
}
export class DeletePaymentMethod implements Action {
	readonly type = AccountActionTypes.DeletePaymentMethod;
	constructor(public token: string) { }
}

export class EditPaymentMethod implements Action {
	readonly type = AccountActionTypes.EditPaymentMethod;
	constructor(public token: string) { }
}

export class SaveMealCard implements Action {
	readonly type = AccountActionTypes.SaveMealCard;
	constructor(public requestData: ServerMealCardRequestInterface) { }
}
export class SaveMealCardSuccess implements Action {
	readonly type = AccountActionTypes.SaveMealCardSuccess;
	constructor(public savedCardData: ServerPaymentMethodInterface) { }
}

export class SavelMealCardFailure implements Action {
	readonly type = AccountActionTypes.SavelMealCardFailure;
}

export class DeleteMealCard implements Action {
	readonly type = AccountActionTypes.DeleteMealCard;
}
export class DeleteMealCardSuccess implements Action {
	readonly type = AccountActionTypes.DeleteMealCardSuccess
}

export type AccountActions =
	| LoadAccountPage
	| LoadAccountPageFail

	| RequestAccountAddresses
	| RequestAccountAddressesSuccess
	| RequestAccountAddressesFailure
	| GetAddressByID
	| SetDefaultAddress
	| UpdateAddressRequest
	| UpdateAddressRequestSuccess
	| UpdateAddressRequestFailure
	| DeleteAddressRequest
	| DeleteAddressRequestSuccess
	| DeleteAddressRequestFailure
	| SyncUserAddresses
	| RequestAccountDefaultAddress

	| RequestAccountStores
	| RequestAccountStoresSuccess
	| RequestAccountStoresFailure
	| UpdateStoreRequest
	| UpdateStoreRequestSuccess
	| UpdateStoreRequestFailure
	| SyncUserStores

	| SearchForStores
	| SearchForStoresSuccess
	| SearchForStoresFailure
	| ClearStoreSearch

	| RequestSavedCards
	| RequestSavedCardsSuccess
	| RequestSavedCardsFailure
	| AddUserCard
	| AddUserCardSuccess
	| AddUserCardFailure
	| AddUserCardForCheckout
	| AddUserCardForCheckoutSuccess
	| AddUserCardForCheckoutFailure
	| ClearCardFailureMessage
	| SetUserDefaultPaymentMethod
	| SetUserDefaultPaymentMethodSuccess
	| SetUserDefaultPaymentMethodFailure
	| SelectPaymentMethodForCheckout
	| DeletePaymentMethod
	| EditPaymentMethod

	| SaveMealCard
	| SaveMealCardSuccess
	| SavelMealCardFailure

	| DeleteMealCard
	| DeleteMealCardSuccess
