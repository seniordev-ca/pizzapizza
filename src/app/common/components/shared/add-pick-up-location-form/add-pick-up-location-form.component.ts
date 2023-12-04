import {
	Component,
	Output,
	EventEmitter,
} from '@angular/core';
import { AddressSearchEmitterInterface } from '../address-search-input/address-search.component'

@Component({
	selector: 'app-add-pick-up-location-form',
	templateUrl: './add-pick-up-location-form.component.html',
	styleUrls: ['./add-pick-up-location-form.component.scss'],
})

export class AddPickUpLocationFormComponent {

	@Output() storeSearchEmitter: EventEmitter<AddressSearchEmitterInterface> =
	new EventEmitter<AddressSearchEmitterInterface>();

	constructor() {}

	/**
	 *  Address Passthrough
	 */
	handleAddressSearchEmitter(event) {
		this.storeSearchEmitter.emit(event);
	}
}
