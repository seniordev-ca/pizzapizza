// Angular core
import {
	Component,
	Input,
	Output,
	EventEmitter,
	ViewEncapsulation,
	ViewChild,
	ElementRef
} from '@angular/core';
import { couponParentContainerEnum } from '../../../../common/widgets/add-coupon/add-coupon.widget';
import { environment } from '../../../../../environments/environment';

// Checkout interface
import {
	OrderActionsEnum,
	OrderSummaryInterface
} from '../../../models/order-checkout';
// import { CouponEmitterInterface } from '../../../../common/components/shared/add-coupon/add-coupon.component';
import { UserSummaryInterface } from '../../../../user/models/user-personal-details';
/*
/** Order Summary Emitter Interface to emit actions
 */
interface OrderSummaryEmitterInterface {
	action: OrderActionsEnum,
	orderId?: number,
}

export interface OrderSummaryUIInterface {
	isPastOrder: boolean,

	isOrderReadyToPlace?: boolean,
	isPlaceOrderLoading?: boolean,
	isCartUpdating?: boolean,
	isVisaCheckoutSelected?: boolean,
	isMasterPassSelected?: boolean,
	isDelivery?: boolean,
	isOrderHasWarning?: boolean,
	isPayAtDoor?: boolean
}

/**
* Decorators for the Order Summary Component
*/
@Component({
	selector: 'app-order-summary',
	templateUrl: './order-summary.component.html',
	styleUrls: ['./order-summary.component.scss'],
	encapsulation: ViewEncapsulation.None
})

/**
* Order Summary Component
*/
class OrderSummaryComponent {
	couponParentContainerEnum = couponParentContainerEnum
	isDisabledPLaceOrderClicked: boolean;
	@ViewChild('placeOrder', { static: false }) placeOrderBtn: ElementRef;
	@Input() userSummary: UserSummaryInterface;
	@Input() isCouponValid: boolean;
	@Input() couponValidationMsg: string;
	@Input() orderSummaryData: OrderSummaryInterface = {
		total: null,
	} as OrderSummaryInterface;
	@Input() visaBtnUrl: string;

	@Input() orderSummaryUI: OrderSummaryUIInterface

	@Output() orderSummaryDataEventEmitter: EventEmitter<OrderSummaryEmitterInterface>
		= new EventEmitter<OrderSummaryEmitterInterface>();

	@Output() addCouponEventEmitter: EventEmitter<string> = new EventEmitter();

	// @Output() couponOutputEmitter: EventEmitter<CouponEmitterInterface> =
	// new EventEmitter<CouponEmitterInterface>();

	/**
	* Constructor for the Order Summary Component
	*/
	constructor() {
		this.isDisabledPLaceOrderClicked = false;
	}

	/**
	* Method to place order
	*/
	onPlaceOrder(event, orderId) {
		event.stopPropagation();
		if (!this.orderSummaryUI.isOrderReadyToPlace) {
			this.isDisabledPLaceOrderClicked = true;
			return false
		}
		this.orderSummaryDataEventEmitter.emit({
			action: OrderActionsEnum.onPlaceOrder,
			orderId
		} as OrderSummaryEmitterInterface);
	}

	/**
	 * app coupon handler
	 */
	applyCouponHandler(event) {
		this.addCouponEventEmitter.emit('couponOrder');
	}
	/**
	 * User press on MP button
	 */
	onMpButtonClick() {
		this.orderSummaryDataEventEmitter.emit({
			action: OrderActionsEnum.onMpButtonClick
		} as OrderSummaryEmitterInterface);
	}

	/**
	 * When the ghost btn is clicked
	 */
	onGhostBtnClick() {
		console.log('ghost')
		this.orderSummaryDataEventEmitter.emit({
			action: OrderActionsEnum.onWarningClick
		})
	}
}

export {
	OrderSummaryEmitterInterface,
	OrderSummaryComponent
}
