import {
	Component,
	Input,
	Output,
	EventEmitter,
	ViewEncapsulation
} from '@angular/core';

import {
	StoreListInterface,
	UserSavedPickupLocationsEmitterInterface,
	UserSavedPickupLocationsActionsEnum
} from '../../../models/store-list';

/**
 * Used in:
 * - checkout/component/cart/checkout-address-form
 * - user/component/account/activities
 */
@Component({
	selector: 'app-store-list',
	templateUrl: './store-list.component.html',
	styleUrls: ['./store-list.component.scss'],
	encapsulation: ViewEncapsulation.None
})

class StoreListComponent {
	@Input() savedStores: Array<StoreListInterface>;
	@Input() storeSearch: boolean;
	@Input() selectedStoreIdForCheckout: number;

	@Output() savedStoresEventEmitter: EventEmitter<UserSavedPickupLocationsEmitterInterface>
		= new EventEmitter<UserSavedPickupLocationsEmitterInterface>();

	constructor() {
	}

	/**
	* On Delete method which will pass up id to event handler and open up delete modal in parent container
	*/
	onDelete(event, storeId) {
		event.stopPropagation();

		const action = {
			action: UserSavedPickupLocationsActionsEnum.onDelete,
			storeId
		} as UserSavedPickupLocationsEmitterInterface;

		this.savedStoresEventEmitter.emit({
			action: UserSavedPickupLocationsActionsEnum.onDelete,
			storeId
		} as UserSavedPickupLocationsEmitterInterface);
	}


	/**
	* On Select which will apply styling
	*/
	onSelect(event, storeId) {
		event.stopPropagation();

		this.savedStoresEventEmitter.emit({
			action: UserSavedPickupLocationsActionsEnum.onSelect,
			storeId
		} as UserSavedPickupLocationsEmitterInterface
		);
	}

	/**
	* On set default, which will make the component set as the default payment method in the component
	*/
	onSetDefault(event, storeId) {
		event.stopPropagation();

		this.savedStoresEventEmitter.emit({
			action: UserSavedPickupLocationsActionsEnum.onSetDefault,
			storeId
		} as UserSavedPickupLocationsEmitterInterface
		);
	}

}


export { StoreListComponent }
