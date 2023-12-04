import {
	Component,
	Input,
	Output,
	EventEmitter,
	ViewEncapsulation
} from '@angular/core';

import { OrderSummaryInterface } from '../../../models/order-checkout';
import { ProcessStepStatusEnum } from '../process-steps/process-steps.component';
import { OrderStatusTrackerKindEnum } from '../../../models/server-process-order-response';

/**
 * Defines actions that can be taken on order info
 */
enum OrderInfoActionsEnum {
	onViewOrderClick
}

/*
/** Order Summary Emitter Interface to emit actions
 */
interface OrderInfoEmitterInterface {
	action: OrderInfoActionsEnum,
	orderId: number
}

/*
/** Order Summary Interface - this interface also includes an array of products for their cart
 */
interface OrderInformationInterface extends OrderSummaryInterface {
	// isUserLoggedIn: boolean,
	orderId?: number,
	name?: string,
	phone?: string,
	phoneExtension?: string,
	address?: string,
	deliveryTime?: string,
	timeGuarantee?: string,
	selected?: boolean,
	tracker?: OrderStatusTrackerInterface[],
	earnedText?: string,
	currentOrderStatusLabel?: string,
}
/**
 * Interface for tracker
 */
interface OrderStatusTrackerInterface {
	status: ProcessStepStatusEnum,
	orderId: number,
	title: string,
	subtitle: string,
	image: string,
	kind: OrderStatusTrackerKindEnum
}

/**
* Decorators for the Order Summary Component
*/
@Component({
	selector: 'app-order-info',
	templateUrl: './order-info.component.html',
	styleUrls: ['./order-info.component.scss'],
	encapsulation: ViewEncapsulation.None
})

/**
* Order Summary Component
*/
class OrderInfoComponent {

	@Input() orderInfoData: OrderInformationInterface;
	@Output() orderInfoDataEventEmitter: EventEmitter<OrderInfoEmitterInterface>
		= new EventEmitter<OrderInfoEmitterInterface>();

	constructor() {}

	/**
	 * Handler for view order button
	*/
	onViewOrderClick(orderId, event) {
		this.orderInfoDataEventEmitter.emit({
			action: OrderInfoActionsEnum.onViewOrderClick,
			orderId
		} as OrderInfoEmitterInterface)
	}
}

export {
	OrderInformationInterface,
	OrderInfoEmitterInterface,
	OrderInfoActionsEnum,
	OrderInfoComponent
}
