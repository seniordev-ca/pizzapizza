import {
	Component,
	ViewEncapsulation,
	OnDestroy,
	ViewChild
} from '@angular/core';

import { OrderSummaryInterface } from '../../models/order-checkout';
// NgRx
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
// Reducers
import * as fromCheckout from '../../reducers';
import { AddOrderToCart, ValidateRepeatOrder, ClearOrdersLoading } from '../../actions/orders';
import { ConfirmationModalComponent } from 'app/common/components/modals/confirmation-modal/confirmation-modal.component';

@Component({
	selector: 'app-repeat-order',
	templateUrl: './repeat-order-container.component.html',
	styleUrls: ['./repeat-order-container.component.scss'],
	encapsulation: ViewEncapsulation.None
})

export class RepeatOrderContainerComponent implements OnDestroy {
	@ViewChild('cartInvalidModal', { static: true }) cartInvalidModal: ConfirmationModalComponent;

	orderInfoData$: Observable<OrderSummaryInterface[]>;
	orderInfoSubscriptionRef;
	isLoading$: Observable<boolean>;
	selectedId: number;

	invalidProducts$: Observable<string[]>;
	invalidOrderSubscriptionRef;
	ordersSubscriptionRef;

	constructor(
		private confirmModal: ConfirmationModalComponent,
		private store: Store<fromCheckout.CheckoutState>,
	) {
		this.orderInfoData$ = this.store.pipe(select(fromCheckout.getOrderHistory));
		this.isLoading$ = this.store.pipe(select(fromCheckout.isOrdersLoading));

		this.invalidProducts$ = this.store.pipe(select(fromCheckout.getInvalidProductsFromRepeatOrder));
		this.invalidOrderSubscriptionRef = this.invalidProducts$.subscribe(order => {
			if (order) {
				this.confirmModal.onOpen(this.cartInvalidModal)
			}
		})

		this.ordersSubscriptionRef = this.orderInfoData$.subscribe(orders => {
			if (orders && orders.length > 0) {
				this.selectedId = orders[0].orderId;
			}
		})
	}
	/**
	 * Destroy
	 */
	ngOnDestroy() {
		this.invalidOrderSubscriptionRef.unsubscribe()
		this.ordersSubscriptionRef.unsubscribe()
	}
	/**
	 * Add Order To Cart
	 */
	addToCart(i: number) {
		this.store.dispatch(new ValidateRepeatOrder(i))
	}
	/**
	 * Add Order To cart
	 */
	onConfirmChangeClickHandler(addToCart: boolean) {
		if (!addToCart) {
			this.store.dispatch(new ClearOrdersLoading());
			return false;
		}
		this.store.dispatch(new AddOrderToCart(this.selectedId))
	}
}
