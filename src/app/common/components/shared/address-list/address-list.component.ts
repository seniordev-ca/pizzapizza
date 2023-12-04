import {
	Component,
	Input,
	Output,
	EventEmitter
} from '@angular/core';

import {
	AddressListInterface,
	UserSavedAddressesActionsEnum,
	UserSavedAddressesEmitterInterface
} from '../../../models/address-list';


/**
 * This component is used in:
 * - checkout/components/order-confirmation/order-summary
 * - user/components/account/activities
 * - user/containers/account
 */
@Component({
	selector: 'app-address-list',
	templateUrl: './address-list.component.html',
	styleUrls: ['./address-list.component.scss']
})

class AddressListComponent {
	@Input() savedAddresses: Array<AddressListInterface>;
	@Input() selectedAddressIDForCheckout: number;
	@Input() isCheckout: boolean;
	@Output() savedAddressesEventEmitter: EventEmitter<UserSavedAddressesEmitterInterface>
	= new EventEmitter<UserSavedAddressesEmitterInterface>();
	// selectActive: boolean;

	constructor() {
		// this.selectActive = false;
	}

	/**
	* On Delete method which will pass up id to event handler and open up delete modal in parent container
	*/
	onDelete(event, addressId) {
		event.stopPropagation();

		this.savedAddressesEventEmitter.emit({
			action: UserSavedAddressesActionsEnum.onDelete, addressId
			} as UserSavedAddressesEmitterInterface
		);
	}

	/**
	* On Edit method which will pass up id to event handler and open up edit functionality from container
	*/
	onEdit(event, addressId) {
		event.stopPropagation();


		this.savedAddressesEventEmitter.emit({
			action: UserSavedAddressesActionsEnum.onEdit, addressId
		} as UserSavedAddressesEmitterInterface);
	}

	/**
	* On Select which will apply styling
	*/
	onSelect(event, addressId) {
		event.stopPropagation();


		this.savedAddressesEventEmitter.emit({
			action: UserSavedAddressesActionsEnum.onSelect, addressId
		} as UserSavedAddressesEmitterInterface);
	}

	/**
	* On set default, which will make the component set as the default payment method in the component
	*/
	onSetDefault(event, addressId) {
		event.stopPropagation();


		this.savedAddressesEventEmitter.emit({
			action: UserSavedAddressesActionsEnum.onSetDefault, addressId
		} as UserSavedAddressesEmitterInterface);
	}
}

export { AddressListComponent }
