// Angular core
import {
	Component,
	HostListener,
	ViewEncapsulation,
	Inject,
	PLATFORM_ID,
	ViewChild, Input
} from '@angular/core';
import { Router } from '@angular/router';

import { isPlatformServer } from '@angular/common';

// NgRx
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';

// Component interfaces
import { Product } from '../../../catalog/models/product';
import {
	cartItemAction,
	CartItemEmitterInterface
} from '../../components/cart/cart-item/cart-item.component';
import { OrderSummaryInterface } from '../../models/order-checkout';

// Reducers
import * as fromCheckout from '../../reducers';
import * as fromCommon from '../../../common/reducers';

// Actions
import {
	RemoveCartItem, CloseIncompleteOrderPopup
} from '../../actions/cart';
import { ConfirmationModalComponent } from '../../../common/components/modals/confirmation-modal/confirmation-modal.component';
import { CheckoutDataLayer } from '../../../common/actions/tag-manager'
import { CartItemKindEnum } from 'app/checkout/models/server-cart-response';
import { ShowLocationModal } from 'app/common/actions/store';

@Component({
	selector: 'app-global-cart-overlay',
	templateUrl: './global-cart-overlay.component.html',
	styleUrls: ['./global-cart-overlay.component.scss'],
	encapsulation: ViewEncapsulation.None
})

export class GlobalCartOverlayComponent {
	@ViewChild('incompleteCartModal', { static: true }) incompleteCartModal: ConfirmationModalComponent;
	@Input() showCheckoutCart: boolean;
	SCROLL_TOP_CART_VISIBLE = 500;

	isCartOverlayExpanded: boolean;
	isCartOverlayVisible: boolean;

	// Products in carts
	productsInCart$: Observable<Product[]>;
	// Cart summary
	orderSummaryData$: Observable<OrderSummaryInterface>;
	isCartUpdating$: Observable<boolean>;
	calorieText$: Observable<string>;
	isCartHidden$: Observable<boolean>;

	isAddressComplete$: Observable<boolean>;

	private isRenderedOnServer: boolean;

	constructor(
		private confirmModal: ConfirmationModalComponent,
		private store: Store<fromCheckout.CheckoutState>,
		private router: Router,
		@Inject(PLATFORM_ID) platformId
	) {
		this.isRenderedOnServer = isPlatformServer(platformId);

		// TODO change to false after integration
		this.isCartOverlayExpanded = false;
		this.isCartOverlayVisible = true;
		this.isCartUpdating$ = this.store.pipe(select(fromCheckout.getCartUpdating));
		this.calorieText$ = this.store.pipe(select(fromCommon.getGlobalCalorieDisclaimer));
		this.isAddressComplete$ = this.store.pipe(select(fromCommon.getIsAddressComplete))
		this.isCartHidden$ = this.store.pipe(select(fromCheckout.getIsCartHidden));
		this.isCartHidden$.subscribe(isHidden => {
			if (isHidden && !this.confirmModal.isModalOpen) {
				this.confirmModal.onOpen(this.incompleteCartModal);
			}
		})
		this.productsInCart$ = this.store.pipe(select(fromCheckout.getCartProducts));
		this.orderSummaryData$ = this.store.pipe(select(fromCheckout.getCartSummary));
		this._handleCartOverlayVisibility();
	}

	/**
	 * Handler for cart item events
	 */
	cartProductEventHandler(event: CartItemEmitterInterface) {
		const action = event.action;
		switch (action) {
			case cartItemAction.removeItem: {
				const productCartId = event.cartId;
				this.store.dispatch(new RemoveCartItem(productCartId));
				break
			}
			case cartItemAction.editItem: {
				const type = event.cartItem.kind
				const isCombo = event.cartItem.isComboProduct;
				const seoTitle = event.cartItem.seoTitle;
				const cartItd = event.cartItem.cardId
				const isRedemtion = type === CartItemKindEnum.GiftCard || type === CartItemKindEnum.Club11
				if (!isRedemtion) {
					const baseSlug = isCombo ? 'product-combo' : 'config';
					this.router.navigate([`/catalog/${baseSlug}/${cartItd}/${seoTitle}`])
					this.toggleCart();
					return false
				}
				// this._editGiftCard(event.cartItem)

				break
			}
		}
	}

	/**
	 * Close Incomplete Overlay Modal and possibly clear cart
	 */
	closeIncompleteOrder(isClearCart: boolean) {
		this.store.dispatch(new CloseIncompleteOrderPopup(isClearCart))

	}

	/**
	 * Cart needs to be hidden if user on the top of the document
	 */
	_handleCartOverlayVisibility() {
		// const verticalOffset = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
		// this.isCartOverlayVisible = verticalOffset > this.SCROLL_TOP_CART_VISIBLE
	}

	/**
	 * On document scroll listener
	 */
	@HostListener('window:scroll', ['$event']) onScrollEvent($event) {
		this._handleCartOverlayVisibility();
	}

	/**
	 * Expand and minify the cart
	 */
	toggleCart() {
		this.isCartOverlayExpanded = !this.isCartOverlayExpanded;

		if (this.isRenderedOnServer) {
			return false;
		}
		// checkout event for Tag Analytics
		if (!this.isCartOverlayExpanded) {
			this.store.dispatch(new CheckoutDataLayer(1, ''))
		}
		const body = document.getElementsByTagName('body')[0];
		body.classList.toggle('body-cart-modal-is-open');
	}

	/**
	 * Toggle the Location Modal
	 */
	toggleModal() {
		this.toggleCart();
		this.store.dispatch(new ShowLocationModal(false, true))
	}
}
