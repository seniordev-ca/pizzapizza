import { Component, Input, Output, EventEmitter, ViewChild, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { NgbModal, NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { StoreServerInterface } from '../../../common/models/server-store'

import { LocationModalComponent } from '../../containers/location-modal/location-modal.component';

// services
import { LocationsDataLayer } from '../../../common/actions/tag-manager';
import { Store } from '@ngrx/store';
// Reducers
import * as fromUser from '../../../user/reducers';
import { isPlatformBrowser } from '@angular/common';
@Component({
	selector: 'app-store-selector',
	templateUrl: './store-selector.component.html',
	styleUrls: ['./store-selector.component.scss'],
})

export class StoreSelectorComponent {
	@ViewChild('popover', {static: false}) public popover: NgbPopover;
	@Input() set isActiveDelivery(isActiveDelivery: boolean) {
		this.isDelivery = isActiveDelivery;
	}
	@Input() isAddressComplete: boolean;
	@Input() userInputAddress: string;

	selectStore: StoreServerInterface
	@Input() set selectedStore(selectStore: StoreServerInterface) {
		this.selectStore = selectStore;
		if (this.popover && this.isAddressComplete && selectStore && this.isPlatformBrowser) {
			this.popover.open()
		}
	}
	isDelivery: boolean;
	isPlatformBrowser: boolean;

	@Output() menuItemClickEmitter: EventEmitter<boolean> = new EventEmitter();

	constructor(
		private modalService: NgbModal,
		private store: Store<fromUser.UserState>,
		@Inject(PLATFORM_ID) private platformId: Object,
	) {
		this.isPlatformBrowser = isPlatformBrowser(platformId);
	}

	/**
	 * Open navigation menu modal for locations
	 */
	openLocationModal() {
		const modalRef = this.modalService.open(LocationModalComponent, {
			windowClass: 'location-modal-container',
		}).componentInstance;
		this.menuItemClickEmitter.emit(true);
		this.store.dispatch(new LocationsDataLayer('locationclick', 'Clicks to update location', ''))
	}

}
