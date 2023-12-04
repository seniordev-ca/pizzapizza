// Angular core
import {
	Component,
	OnInit,
	ViewEncapsulation,
	ViewChild,
	OnDestroy
} from '@angular/core';

// ViewModel interfaces
import {
	QuantitySelectorActionsEnum,
} from '../../../common/components/products/quantity-selector/quantity-selector.component'
import {
	ProductItemActionsEnum,
	ProductItemEmitterInterface,
} from '../../components/common/product-item/product-item.component';

import { addToCartBtnEnum } from '../../models/configurator';
/**
 * ngrx
 */
import { Store, select } from '@ngrx/store';
import { Observable, of } from 'rxjs';

import * as fromReducers from '../../reducers';

import { Product } from '../../models/product';

import { UpdateJFYProductQuantity, SelectJFYProduct, UpdateJFYGroupQuantity } from '../../actions/just-for-you';
import { ComboConfigDetails } from '../../models/combo-config';
import { AddProductArrayToCart } from '../../../checkout/actions/cart';
class GhostGroupGenerator {
	/**
	 * Generate ghost groups with some products
	 */
	static generateGhostGroups() {
		const PRODUCTS_COUNT = 6;

		return of(Array.apply(null, Array(PRODUCTS_COUNT)).map(product => {
			return {
				id: null,
				name: ' ',
				image: null,
				description: ' ',
			}
		}));
	}
}

@Component({
	selector: 'app-just-for-you-products-container',
	templateUrl: './just-for-you-products-container.component.html',
	styleUrls: ['./just-for-you-products-container.component.scss'],
	encapsulation: ViewEncapsulation.None
})

export class JustForYouProductContainerComponent implements OnInit, OnDestroy {
	@ViewChild('verticalModalConfigurator', { static: false }) configuratorVerticalModalRef;

	comboConfigLoading$: Observable<boolean>;
	comboConfigError$: Observable<boolean>;
	comboDetails$: Observable<ComboConfigDetails>;
	comboProducts$: Observable<Product[]>;

	subscriptionsRef;

	activeBtnState: addToCartBtnEnum;

	constructor(
		private store: Store<fromReducers.CatalogState>
	) {
		this.subscriptionsRef = {}
	}

	/**
	 * Component constructor
	 */
	ngOnInit() {
		this._subscribeComboConfig();
	}


	/**
	 * Component Destroy and unsubscribe
	 */
	ngOnDestroy() {
		for (const key in this.subscriptionsRef) {
			if (this.subscriptionsRef[key]) {
				this.subscriptionsRef[key].unsubscribe();
			}
		}
	}

	/**
	 * Subscribe to store
	 */
	private _subscribeComboConfig() {
		this.comboConfigLoading$ = this.store.pipe(
			select(fromReducers.getJustForYouLoading)
		);
		this.comboConfigError$ = this.store.pipe(
			select(fromReducers.getJustForYouError)
		);

		// // Subscribe combo details
		this.comboDetails$ = this.store.pipe(
			select(fromReducers.justForYouProductCategory)
		);

		this.subscriptionsRef.comboDetailsSubscriptionRef = this.store.pipe(
			select(fromReducers.justForYouProductCategory)
		).subscribe(details => {
			this.activeBtnState = details.isSelected ? addToCartBtnEnum.loading : details.btnState;
		})

		// // Generate ghost DOM is data is loading
		this.comboProducts$ = GhostGroupGenerator.generateGhostGroups();
		this.subscriptionsRef.comboLoadingSubscriptionRef = this.comboConfigLoading$.subscribe(loading => {
			if (!loading) {
				this.comboProducts$ = this.store.pipe(
					select(fromReducers.justForYouProductList)
				);
			}
		})
	}

	/**
	 * Handle Add To Cart Event
	 */
	addBtnEventHandler(event) {
		switch (this.activeBtnState) {
			case (addToCartBtnEnum.active): {
				this.store.dispatch(new AddProductArrayToCart())
				break
			}
			default: {
				console.warn(this.activeBtnState, 'Btn State Incorrect')
			}
		}
	}

	/**
	 * User press on quantity selector
	 */
	quantitySelectorEventHandler(event) {
		const isIncrease = event.action === QuantitySelectorActionsEnum.onPlusClick
		this.store.dispatch(new UpdateJFYGroupQuantity(isIncrease))
	}

	/**
	 * Handler for the product items
	 */
	productComboEventHandler(productItemEvent: ProductItemEmitterInterface) {
		const action: ProductItemActionsEnum = productItemEvent.action;
		switch (action) {
			/**
			 * Add Product To Cart
			 */
			case ProductItemActionsEnum.onAddToCartClick: {
				this.store.dispatch(new SelectJFYProduct(productItemEvent.productId))
				break;
			}
			case ProductItemActionsEnum.onProductQuantityChange: {
				this.store.dispatch(new UpdateJFYProductQuantity(productItemEvent.productId, productItemEvent.quantity))
				break;
			}

			default: {
				console.log('default', action);
				break;
			}
		}
	}

}
