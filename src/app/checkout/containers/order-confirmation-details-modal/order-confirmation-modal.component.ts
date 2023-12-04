import {
	Component,
	Input,
	ViewEncapsulation,
	ViewChild
} from '@angular/core';

import { OrderInformationInterface } from '../../components/order-confirmation/order-info/order-info.component';

import {
	ModalSimpleHeaderInterface
} from '../../../common/components/modals/vertical-modal/vertical-modal-headers/modal-simple-header/modal-simple-header.component'
import { OrderSummaryInterface } from '../../models/order-checkout';

/**
* Product configuration page component
*/
@Component({
	selector: 'app-order-confirmation-details-modal',
	templateUrl: './order-confirmation-modal.component.html',
	styleUrls: ['./order-confirmation-modal.component.scss'],
	encapsulation: ViewEncapsulation.None
})

/**
* Subscribe on store events and dispatch users event
*/
export class OrderConfirmationModalComponent {
	@ViewChild('orderConfirmationVerticalModal', { static: true }) orderConfirmationVerticalModalRef;
	@Input() orderDetails: OrderInformationInterface;
	@Input() activeOrder: OrderSummaryInterface;

	constructor() {}

	/**
	 * Proxy event to vertical modal to open it
	*/
	open() {
		this.orderConfirmationVerticalModalRef.openModal()
	}

	/**
	 * Proxy event to vertical modal to close it
	*/
	close() {
		this.orderConfirmationVerticalModalRef.closeModal()
	}


}
