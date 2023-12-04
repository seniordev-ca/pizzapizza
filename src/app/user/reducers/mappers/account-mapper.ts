import {
	AddressListInterface,
	AddressTypeEnum
} from '../../../common/models/address-list';
import { ServerAddressResponse } from '../../models/server-models/server-account-interfaces';

import { StoreItemServerInterface } from '../../../common/models/server-store';
import { StoreListInterface } from '../../../common/models/store-list';
import { ServerPaymentResponseInterface, ServerPaymentMethodInterface } from '../../models/server-models/server-saved-cards-interfaces';
import { UISavedCardsInterface } from '../../models/user-saved-cards';

export class AccountMapperHelper {
	/**
	 * Map server response to UI view models
	 */
	static parseAccountAddresses(serverResponse: ServerAddressResponse[]): AddressListInterface[] {
		return serverResponse.sort(function (leftProduct, rightProduct) {
			const left = leftProduct.default_address ? 1 : -1;
			const right = rightProduct.default_address ? 1 : -1;
			return right - left;
			})
			.map(address => {
				const mappedAddress = address.address ? {
					streetNumber: address.address.street_number,
					streetName: address.address.street_address,
					city: address.address.city,
					province: address.address.province,
					postalCode: address.address.postal_code,
				} : {
					streetNumber: address.street_number,
					streetName: address.street_address,
					city: address.city,
					province: address.province,
					postalCode: address.postal_code,
				}
			return {
				addressId: address.id,
				title: address.address_name,
				address: {
					...mappedAddress,
					address_components: address.address_components
				},
				unitNumber: address.apartment_number ? address.apartment_number : '',
				unitunitBuzzer: address.security_code,
				entrance: address.address_type === AddressTypeEnum.Home ? address.entrance_specs : null,
				contactInfo: {
					phoneNumber: address.phone_number.phone_number,
					extension: address.phone_number.extension
				},
				type: address.address_type,
				isDefault: address.default_address,
				unitBuzzer: address.security_code,
				building: address.building_key,
				university: address.university_code,
				isSaved: address.saved,

				buildingEntrance: address.entrance_specs
			}
		})
	}
	/**
	 * Map UI View Model to Server Request
	 */
	static parseUIAccountAddressesToServer(uiAddress: AddressListInterface): ServerAddressResponse {

		const serverAddress = {
			address_name: uiAddress.title,
			apartment_number: uiAddress.unitNumber,
			security_code: uiAddress.unitBuzzer,
			street_number_ext: '',
			entrance_specs: uiAddress.entrance,
			phone_number: {
				phone_number: uiAddress.contactInfo.phoneNumber.replace(/[^0-9.]/g, ''), // only send numbers
				extension: uiAddress.contactInfo.extension ? uiAddress.contactInfo.extension : '',
				type: uiAddress.contactInfo.type
			},
			address_type: uiAddress.type,
			saved: uiAddress.isSaved
		} as ServerAddressResponse
		if (uiAddress.address) {
			const addressComponents = uiAddress.address.address
			? uiAddress.address.address.address_components : uiAddress.address.address_components
			serverAddress.address_components = addressComponents ? addressComponents : null
			if (!addressComponents) {
				delete serverAddress.address_components
				const addressObj = {
					province: uiAddress.address.province,
					city: uiAddress.address.city,
					postal_code: uiAddress.address.postalCode,
					street_address: uiAddress.address.streetName,
					street_number: uiAddress.address.streetNumber
				}
				serverAddress.address = addressObj
			}
			if (uiAddress.addressString) {
				serverAddress.formatted_address = uiAddress.addressString
			}
		}
		if (uiAddress.university) {
			delete(serverAddress.address);
			serverAddress.university_code = uiAddress.university;
			serverAddress.building_key = uiAddress.building;
			serverAddress.entrance_specs = uiAddress.buildingEntrance
		}
		return serverAddress;
	}

	/**
	 * Parse Sever response to UI
	 */
	static parseServerStoresToUI(serverResponse: StoreItemServerInterface[]): StoreListInterface[] {
		return serverResponse.sort(function (leftProduct, rightProduct) {
			const left = leftProduct.default_store ? 1 : -1;
			const right = rightProduct.default_store ? 1 : -1;
			return right - left;
		}).map(store => {
			return {
				storeId: store.store_id,
				storeAddress: store.address,
				postalCode: store.postal_code,
				marketPhoneNumber: store.market_phone_number,
				province: store.province,
				city: store.city,
				isDefault: store.default_store,
				distance: store.distance
			}
		})
	}

	/**
	 * Parse Saved Cards
	 */
	static parseServerCardsToUI(serverResponse: ServerPaymentResponseInterface, defaultToken: string): UISavedCardsInterface[] {
		return serverResponse.cards.map(card => {
			return this.parseSingleServerCardToUI(card, defaultToken)
		})
	}

	/**
	 * Parse a single card to UI
	 */
	static parseSingleServerCardToUI(card: ServerPaymentMethodInterface, defaultToken: string): UISavedCardsInterface {
		// console.log(card);
		const uiCard = {
			name: card.name,
			cardType: card.card_type,
			token: card.token,
			number: card.number,
			isDefault: card.token === defaultToken,
			status: card.status
		} as UISavedCardsInterface
		// console.log(uiCard);

		return uiCard
	}
}
