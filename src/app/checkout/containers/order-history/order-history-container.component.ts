import {
	Component,
	ViewEncapsulation,
	HostListener,
	Inject,
	PLATFORM_ID,
	ViewChild,
	OnDestroy
} from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';

import { OrderSummaryInterface } from '../../models/order-checkout';
// NgRx
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
// Reducers
import * as fromCheckout from '../../reducers';
import { AddOrderToCart, FetchAllOrders, ValidateRepeatOrder, ClearOrdersLoading } from '../../actions/orders';
// import { ServerCartResponseProductListInterface } from 'app/checkout/models/server-cart-response';
import { ConfirmationModalComponent } from 'app/common/components/modals/confirmation-modal/confirmation-modal.component';

@Component({
	selector: 'app-order-history',
	templateUrl: './order-history-container.component.html',
	styleUrls: ['./order-history-container.component.scss'],
	encapsulation: ViewEncapsulation.None
})

export class OrderHistoryContainerComponent implements OnDestroy {
	@ViewChild('cartInvalidModal', { static: true }) cartInvalidModal: ConfirmationModalComponent;

	orderInfoData$: Observable<OrderSummaryInterface[]>;
	orderInfoSubscriptionRef;
	isLoading$: Observable<boolean>;

	invalidProducts$: Observable<string[]>;
	invalidOrderSubscriptionRef;

	selectedId: number;
	private isRenderedOnServer: boolean;

	constructor(
		private confirmModal: ConfirmationModalComponent,
		private store: Store<fromCheckout.CheckoutState>,
		@Inject(PLATFORM_ID) platformId
	) {
		this.orderInfoData$ = this.store.pipe(select(fromCheckout.getOrderHistory));
		this.isLoading$ = this.store.pipe(select(fromCheckout.isOrdersLoading));
		this.isRenderedOnServer = isPlatformServer(platformId);

		this.invalidProducts$ = this.store.pipe(select(fromCheckout.getInvalidProductsFromRepeatOrder))
		this.invalidOrderSubscriptionRef = this.invalidProducts$.subscribe(order => {
			if (order) {
				this.confirmModal.onOpen(this.cartInvalidModal)
			}
		})
	}

	/**
	 * Destroy
	 */
	ngOnDestroy() {
		this.invalidOrderSubscriptionRef.unsubscribe()
	}
	/**
	 * Validate Order To Cart
	 */
	addToCart(id: number) {
		this.selectedId = id;
		this.store.dispatch(new ValidateRepeatOrder(id))
	}

	/**
	 * Add Order To cart
	 */
	onConfirmChangeClickHandler(addToCart: boolean) {
		if (!addToCart) {
			this.selectedId = null;
			this.store.dispatch(new ClearOrdersLoading());
			return false;
		}
		this.store.dispatch(new AddOrderToCart(this.selectedId))
		this.selectedId = null;
	}


	/**
  	* Handle scrolling of window and paginate only if we reach the end and we have cursor
 	*/
	@HostListener('window:scroll', [])
	handleStoreListScroll() {
		if (this.isRenderedOnServer) {
			return false;
		}
		const windowHeight = 'innerHeight' in window ? window.innerHeight : document.documentElement.offsetHeight;
		const body = document.body;
		const html = document.documentElement;
		const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
		const windowBottom = windowHeight + window.pageYOffset;
		if (windowBottom >= docHeight) {
			this.store.dispatch(new FetchAllOrders());
		}
	}
}
