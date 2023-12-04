import { Component, Input, Output, EventEmitter } from '@angular/core';

import { StoreItemServerInterface } from '../../../common/models/server-store'

/**
 * Store Select Enum
*/
enum StoreLocationActionEnum {
	onSelect,
	onDeselect
}

export interface StoreLocationEmitterInterface {
	action: StoreLocationActionEnum,
	store: string
}
@Component({
	selector: 'app-location-pick-up-list',
	templateUrl: './location-pick-up-list.component.html',
	styleUrls: ['./location-pick-up-list.component.scss']
})

export class LocationPickUpListComponent {
	@Input() storeList: StoreItemServerInterface[];
	@Input() selectedStore: StoreItemServerInterface;
	@Output() storeListEventEmitter: EventEmitter<StoreLocationEmitterInterface> = new EventEmitter();
	googleUrl: string;

	constructor() {
		this.googleUrl = 'https://www.google.com/maps/search/?api=1&query=pizza+pizza+';
	}

	/**
	* Demo Handler
	*/
	selectActive(store) {
		this.storeListEventEmitter.emit({
			action: StoreLocationActionEnum.onSelect,
			store
		})
	}
	/**
	 * format the address for the google directions link
	 */
	getFullAddress(item: StoreItemServerInterface) {
		return this.googleUrl + item.address + ', ' + item.city + ', ' + item.province + ', ' + item.postal_code
	}
	/**
	 * Check if the store is selected
	 *
	 */
	isStoreSelected(store: StoreItemServerInterface) {
		return (store === this.selectedStore);
	}

	/**
	 * Get Store Features
	 */
	getStoreFeatures(store: StoreItemServerInterface) {
		const features = [];
		if (store.delivery_available) {
			features.push('Delivery');
		}
		if (store.pickup_available) {
			features.push('Pickup')
		}
		if (store.is_online) {
			features.push('Online');
		}
		if (store.is_express) {
			features.push('Express')
		}

		return features.join(' • ');
	}
}


