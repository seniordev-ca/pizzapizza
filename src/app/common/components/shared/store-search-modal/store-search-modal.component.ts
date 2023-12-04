import {
	Component,
	Input,
	Output,
	EventEmitter,
	ViewEncapsulation,
} from '@angular/core';

import {
	StoreListInterface, UserSavedPickupLocationsEmitterInterface
} from '../../../models/store-list';

/**
 * Used in:
	-- user/containers/accounts-container
	-- checkout/containers/checout-container
 */
@Component({
	selector: 'app-store-search-modal',
	templateUrl: './store-search-modal.component.html',
	styleUrls: ['./store-search-modal.component.scss'],
	encapsulation: ViewEncapsulation.None
})

class StoreSearchModalComponent {
	@Input() isLocationError: boolean;
	@Input() isLoading: boolean;
	@Input() storeSearchResults: StoreListInterface[];
	@Output() savedStoresEventEmitter: EventEmitter<UserSavedPickupLocationsEmitterInterface>
		= new EventEmitter<UserSavedPickupLocationsEmitterInterface>();
	@Output() retryLocationEventEmitter: EventEmitter<boolean> = new EventEmitter<boolean>()
	constructor() {
	}

	/**
	 * Pass the event up to the parent
	 */
	handleStoreSearchEmitter(event) {
		this.savedStoresEventEmitter.emit(event);
	}

	/**
	 * Handle retry will return back form with search bar
	 */
	handleRetryClick() {
		this.retryLocationEventEmitter.emit(this.isLocationError);
	}

}


export { StoreSearchModalComponent }
