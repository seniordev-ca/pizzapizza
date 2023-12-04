import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApplicationHttpClient } from '../../../utils/app-http-client';
import { AccountMapperHelper } from '../reducers/mappers/account-mapper';

import {
	ServerAddressResponse,
	ServerUpdateAddressResponse
} from '../models/server-models/server-account-interfaces';

import {
	StoreItemServerInterface
} from '../../common/models/server-store'
import { AddressListInterface } from '../../common/models/address-list';
import {
	ServerPaymentResponseInterface,
	ServerPaymentRequestInterface,
	ServerSetDefaultPaymentMethodInterface,
	ServerMealCardRequestInterface,
	ServerPaymentMethodInterface
} from '../models/server-models/server-saved-cards-interfaces';


/**
 * SignUpService - Fetching the Data for user Registration
 */
@Injectable()
export class AccountService {
	constructor(
		private appHttp: ApplicationHttpClient,
	) { }

	/**
	 * Get User Addresses
	 */
	fetchUserAddressses(): Observable<[ServerAddressResponse]> {
		const apiPath = 'user/api/v1/addresses/';
		return this.appHttp.get<[ServerAddressResponse]>(apiPath);
	}

	/**
	 * Add/Update User Address
	 */
	updateUserAddress(address: AddressListInterface): Observable<ServerUpdateAddressResponse> {
		let apiPath = 'user/api/v1/addresses/';
		const body = AccountMapperHelper.parseUIAccountAddressesToServer(address);
		console.log(body)
		if (address.addressId) {
			apiPath += address.addressId
			return this.appHttp.put<ServerUpdateAddressResponse>(apiPath, body);
		} else {
			return this.appHttp.post<ServerUpdateAddressResponse>(apiPath, body)
		}
	}

	/**
	 * Delete User Address
	 */
	deleteUserAddress(addressId: number): Observable<ServerUpdateAddressResponse> {
		const apiPath = 'user/api/v1/addresses/' + addressId;
		return this.appHttp.delete<ServerUpdateAddressResponse>(apiPath);
	}

	/**
	 * Set Default Address
	 */
	setDefaultAddress(addressId: number): Observable<ServerUpdateAddressResponse> {
		const apiPath = 'user/api/v1/addresses/default';
		const body = { default_address_id: addressId }
		return this.appHttp.post<ServerUpdateAddressResponse>(apiPath, body);
	}
	/**
	 * Get User Stores
	 */
	fetchUserStores(): Observable<[StoreItemServerInterface]> {
		const apiPath = 'user/api/v1/stores/';
		return this.appHttp.get<[StoreItemServerInterface]>(apiPath);
	}
	/**
	 * Delete User Store
	 */
	deleteUserStore(storeId: number): Observable<ServerUpdateAddressResponse> {
		const apiPath = 'user/api/v1/stores/' + storeId;
		return this.appHttp.delete<ServerUpdateAddressResponse>(apiPath);
	}
	/**
	 * Add User Store
	 */
	addUserStore(storeId: number, isDefault: boolean): Observable<ServerUpdateAddressResponse> {
		const apiPath = 'user/api/v1/stores/';
		const body = {
			store_id: storeId,
			is_default: isDefault
		}
		return this.appHttp.post<ServerUpdateAddressResponse>(apiPath, body);
	}
	/**
	 * Set Default Store
	 */
	setDefaultStore(storeId: number): Observable<ServerUpdateAddressResponse> {
		const apiPath = 'user/api/v1/stores/default';
		const body = {
			default_store_id: storeId
		}
		return this.appHttp.post<ServerUpdateAddressResponse>(apiPath, body);
	}

	/**
	 * Get User Payments
	 */
	fetchUserPaymentMethodss(): Observable<ServerPaymentResponseInterface> {
		const apiPath = 'user/api/v1/cards/';
		return this.appHttp.get<ServerPaymentResponseInterface>(apiPath);
	}

	/**
	 * Save User Payment Method
	 */
	saveUserPaymentMethod(request: ServerPaymentRequestInterface, editToken: string): Observable<ServerPaymentResponseInterface> {
		const apiPath = 'user/api/v1/cards/';
		if (editToken) {
			request.existing_card_token = editToken;
			return this.appHttp.put<ServerPaymentResponseInterface>(apiPath, request)
		}
		return this.appHttp.post<ServerPaymentResponseInterface>(apiPath, request)
	}

	/**
	 * Remove Payment Method
	 */
	deleteUserPaymentMethod(token: string): Observable<ServerPaymentResponseInterface> {
		const apiPath = 'user/api/v1/cards/?existing_card_token=' + token
		return this.appHttp.delete<ServerPaymentResponseInterface>(apiPath);
	}

	/**
	 * Set Default Payment Method
	 */
	setDefaultPaymentMethod(request: ServerSetDefaultPaymentMethodInterface): Observable<{ success: boolean }> {
		const apiPath = 'user/api/v1/cards/default';
		if (!request) {
			return this.appHttp.delete<{ success: boolean }>(apiPath)
		}
		return this.appHttp.post<{ success: boolean }>(apiPath, request)
	}

	/**
	 * Save Meal Card To Account
	 */
	saveMealCard(request: ServerMealCardRequestInterface): Observable<ServerPaymentMethodInterface> {
		const apiPath = 'user/api/v1/meal_card/';
		return this.appHttp.post<ServerPaymentMethodInterface>(apiPath, request)
	}

	/**
	 * Remove Meal Card
	 */
	deleteUserMealCard(): Observable<{ success: boolean }> {
		const apiPath = 'user/api/v1/meal_card/'
		return this.appHttp.delete<{ success: boolean }>(apiPath);
	}
}
