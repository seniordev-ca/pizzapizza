import {
		Component,
		Input,
		EventEmitter,
		Output
} from '@angular/core';

import {
	OrderHistoryInterface,
	OrderHistoryEmitterInterface,
	OrderHistoryActionsEnum
} from '../../../../models/order-history';

@Component({
	selector: 'app-order-history-items',
	templateUrl: './order-history.component.html',
	styleUrls: ['./order-history.component.scss'],
})

export class OrderHistoryComponent {
	@Input() orderHistoryItems: Array<OrderHistoryInterface>;
	@Output() orderHistoryEventEmitter: EventEmitter<OrderHistoryEmitterInterface> =
	new EventEmitter<OrderHistoryEmitterInterface>();

	/**
	* Constructor for the order history component
	*/
	constructor() {}

	/**
	* Click event for the order history add to cart button, which emits the event up to parent containers along with the order item id
	*/
	onAddToCartClick(orderId) {
		this.orderHistoryEventEmitter.emit({
			action: OrderHistoryActionsEnum.onAddToCartClick,
			orderId
			} as OrderHistoryEmitterInterface
		);
	}

}
