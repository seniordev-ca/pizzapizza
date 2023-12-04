import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { StoreServerInterface, StoreListServerInterface, ServerStoreCitiesListItem } from '../models/server-store';

import { ApplicationHttpClient } from '../../../utils/app-http-client';
import { ApplicationLocalStorageClient } from '../../../utils/app-localstorage-client';
import { AddressInputInterface } from '../models/address-input';
import { ValidateStoreInterface } from '../../checkout/models/server-cart-request';
import { ServerCartStoreValidationInterface } from '../../checkout/models/server-cart-response';
import { ApplicationCookieClient } from 'utils/app-cookie-client';

/**
 * Location service consumer
 */
@Injectable()
export class StoreService {
	constructor(
		private appHttp: ApplicationHttpClient,
		private appCookies: ApplicationCookieClient
	) { }

	/**
	 * Get Store via location settings
	 */
	searchPickup(action, isStoreLocator: boolean): Observable<StoreListServerInterface> {
		const methodPath = isStoreLocator ? 'store/api/v1/search/store_locator' : 'store/api/v1/search/';
		const payload = action.payload ? action.payload : null;
		const params = {
			latitude: payload ? payload.latitude : null,
			longitude: payload ? payload.longitude : null,
			cursor: action.cursor ? action.cursor : ''
		}
		return this.appHttp.get<StoreListServerInterface>(methodPath, params).pipe(
			map(response => {
				const isArray = response.stores instanceof Array;
				if (isArray) {
					return response;
				} else {
					const errorMsg = 'Pickup List is not an array';
					console.warn(errorMsg)
					throw new Error(errorMsg)
				}
			})
		);
	}
	/**
	 * Get Store via location settings
	 */
	searchDelivery(userSearch: AddressInputInterface): Observable<StoreServerInterface> {
		const body = userSearch;
		const methodPath = 'store/api/v1/search/delivery/';
		return this.appHttp.post<StoreServerInterface>(methodPath, body).pipe(
			map(response => {
				if (response.store_id) {
					return response;
				} else {
					const errorMsg = 'Delivery Store Id is null!';
					console.warn(errorMsg)
					throw new Error(errorMsg)
				}
			})
		);
	}
	/**
	 * Get Store via Lat/Lng
	*/
	getDefaultStore(storeID): Observable<StoreServerInterface> {
		const methodPath = storeID ? 'store/api/v1/store_details/?store_id=' + storeID : 'store/api/v1/default_store/';
		return this.appHttp.get<StoreServerInterface>(methodPath).pipe(
			map(response => {
				if (response.store_id) {
					return response;
				} else {
					const errorMsg = 'Default Store Id is null!';
					console.warn(errorMsg)
					throw new Error(errorMsg)
				}
			})
		);
	}

	/**
	 * Set localStorage -- expires in one year
	 */
	setStoreInLocalStorage(key, payload) {
		const d = new Date();
		d.setTime(d.getTime() + (365 * 24 * 60 * 60 * 1000));
		const expires = d;
		this.appCookies.set(key, payload, { expires })
	}

	/**
	 * Get localStorage
	 */
	getStoreFromLocalStorage(key): StoreServerInterface {
		return this.appCookies.get(key) as StoreServerInterface;
	}

	/**
	 * Get localStorage
	 */
	getUserAddressFromLocalStorage(key): AddressInputInterface {
		return this.appCookies.get(key) as AddressInputInterface;
	}


	/**
	 * Get Delivery Tab from Local Storage
	 */
	getDeliveryTabActiveFromLocalStorage(key): boolean {
		return this.appCookies.get(key) as boolean;
	}

	/**
	 * Get contactLess from Local Storage
	 */
	getContactLessFromLocalStorage(key): boolean {
		return this.appCookies.get(key) as boolean;
	}

	/**
	 * Get Apply tips from Local Storage
	 */
	getApplytipsSuccessFromLocalStorage(key): boolean {
		return this.appCookies.get(key) as boolean;
	}

	/**
	 * Set ApplyTip in Local Storage -- expires in one year
	 */
	setApplytipsSuccessFromLocalStorage(key, isActive: boolean) {
		const d = new Date();
		d.setTime(d.getTime() + (365 * 24 * 60 * 60 * 1000));
		const expires = d;
		this.appCookies.set(key, isActive, { expires });
	}

	/**
	 * Get Global ContactLess Delivery from Local Storage
	 */
	getGlobalContactLessDeliveryFromLocalStorage(key): boolean {
		return this.appCookies.get(key) as boolean;
	}

	/**
	 * Set Global ContactLess Delivery in Local Storage -- expires in one year
	 */
	setGlobalContactLessDeliveryFromLocalStorage(key, isActive: boolean) {
		const d = new Date();
		d.setTime(d.getTime() + (365 * 24 * 60 * 60 * 1000));
		const expires = d;
		this.appCookies.set(key, isActive, { expires });
	}

	/**
	 * Get Global ContactLess PickUP from Local Storage
	 */
	getGlobalContactLessPickUpFromLocalStorage(key): boolean {
		return this.appCookies.get(key) as boolean;
	}

	/**
	 * Set Global ContactLess PickUp in Local Storage -- expires in one year
	 */
	setGlobalContactLessPickUpFromLocalStorage(key, isActive: boolean) {
		const d = new Date();
		d.setTime(d.getTime() + (365 * 24 * 60 * 60 * 1000));
		const expires = d;
		this.appCookies.set(key, isActive, { expires });
	}
	/**
	 * Set Delivery Tab in Local Storage -- expires in one year
	 */
	setDeliveryTabActiveFromLocalStorage(key, isActive: boolean) {
		const d = new Date();
		d.setTime(d.getTime() + (365 * 24 * 60 * 60 * 1000));
		const expires = d;
		this.appCookies.set(key, isActive, { expires });
	}

	/**
	 * Set Delivery Tab in Local Storage -- expires in one year
	 */
	setUserInputAddressInCookie(key, userInputAddress: AddressInputInterface) {
		const d = new Date();
		d.setTime(d.getTime() + (365 * 24 * 60 * 60 * 1000));
		const expires = d;
		this.appCookies.set(key, userInputAddress, { expires });
	}

	/**
	 * Set contact less in Local Storage -- expires in one year
	 */
	setContactLessFromLocalStorage(key, isActive: boolean) {
		const d = new Date();
		d.setTime(d.getTime() + (365 * 24 * 60 * 60 * 1000));
		const expires = d;
		this.appCookies.set(key, isActive, { expires });
	}

	/**
	 * Validate Store For Checkout
	 */
	validateStore(validateRequest: ValidateStoreInterface) {
		const methodPath = 'checkout/api/v1/customer_cart/validate/'
		return this.appHttp.post<ServerCartStoreValidationInterface>(methodPath, validateRequest)
	}

	/**
	 * Get Store Details
	 */
	getStoreDetails(id: string): Observable<StoreListServerInterface> {
		const methodPath = 'store/api/v1/search/store_locator?store_slug=store-' + id;
		return this.appHttp.get<StoreListServerInterface>(methodPath)
	}

	/**
	 * Province Store Search
	 */
	getProvinceSearch(province: string, city: string, cursor: string): Observable<StoreListServerInterface> {
		let methodPath = 'store/api/v1/search/store_locator?province=' + province;
		methodPath = city ? methodPath + '&city=' + city : methodPath;
		methodPath = cursor ? methodPath + '&cursor=' + cursor : methodPath;
		return this.appHttp.get<StoreListServerInterface>(methodPath)
	}


	/**
	 * Get Store City List
	 */
	getStoreCities(): Observable<ServerStoreCitiesListItem[]> {
		const methodPath = 'store/api/v1/province_cities';
		return this.appHttp.get<ServerStoreCitiesListItem[]>(methodPath)
	}
}

