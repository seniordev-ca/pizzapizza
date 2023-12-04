// Angular core
import {
	Component,
	ViewEncapsulation,
	OnInit,
	OnDestroy,
} from '@angular/core';

// ViewModel interfaces
import { Product } from '../../models/product';
import {
	ProductItemActionsEnum,
	ProductItemEmitterInterface,
} from '../../components/common/product-item/product-item.component';

// NG RX core
import { Store, select, ActionsSubject } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { filter } from 'rxjs/operators';

// Reduce, actions
import * as fromReducers from '../../reducers';
import { ChangeSelectedCategory } from '../../actions/category';

import {
	CartActionsTypes,
	AddAdvancedProductToCart
} from '../../../checkout/actions/cart';
import { Router } from '@angular/router';
import { SubHeaderNavigationInterface } from '../../../common/components/shared/sub-header-navigation/sub-header-navigation.component';


class GenerateGhostProductListHelper {
	/**
	 * Generate an observable ghost product list
	 */
	static generateGhostList(count) {
		const ghostProduct = {
			id: '',
			name: '',
			image: '',
			description: '',
		}
		const ghostProductList = Array.apply(null, Array(count)).map(function () {
			return ghostProduct;
		})
		return of(ghostProductList)
	}
}

@Component({
	selector: 'app-my-pizzas',
	templateUrl: './my-pizzas.component.html',
	styleUrls: ['./my-pizzas.component.scss'],
	encapsulation: ViewEncapsulation.None
})

/**
 * My Pizzas product list
 */
export class MyPizzasContainerComponent implements OnInit, OnDestroy {

	// Products list
	productList$: Observable<Product[]>
	productListLoading$: Observable<boolean>
	productListError$: Observable<boolean>

	// References for direct subscription
	loadingSubscriptionRef = null;
	productFetchSubscriptionRef = null;
	addToCartSuccessRef = null;

	myPizzasMeta$: Observable<SubHeaderNavigationInterface>

	constructor(
		private store: Store<fromReducers.CatalogState>,
		private actions: ActionsSubject,
		private router: Router
	) {}

	/**
	 * Angular constructor
	 */
	ngOnInit() {
		this._subscribeProductCategoryContent();
		this._subscribeOnAddToCartSuccess();
	}

	/**
	 * Angular destructor
	 */
	ngOnDestroy() {
		this._unSubscribeAllDirectListeners();
	}

	/**
	 * Subscribe to store, define server -> view mapper
	 * TODO error state handling in UI
	 */
	private _subscribeProductCategoryContent() {
		this.myPizzasMeta$ = this.store.pipe(select(fromReducers.getMyPizzaCategory))
		// Categories and product list loading and errors
		this.productListLoading$ = this.store.pipe(select(fromReducers.getMyPizzasLoading));
		this.productListError$ = this.store.pipe(select(fromReducers.getMyPizzasError));

		// Generate ghost DOM if data is loading
		this.loadingSubscriptionRef = this.productListLoading$.subscribe(loading => {
			if (loading) {
				this.productList$ = GenerateGhostProductListHelper.generateGhostList(6);
			} else {
				this.productList$ = this.store.pipe(select(fromReducers.getMyPizzasList));
			}
		})
	}



	/**
	 * Subscribe to Add to Cart Success
	 */
	private _subscribeOnAddToCartSuccess() {
		this.addToCartSuccessRef = this.actions.pipe(
			filter(action =>
				action.type === CartActionsTypes.AddConfigurableProductToCartSuccess
				|| action.type === CartActionsTypes.AddBasicProductToCartSuccess
				|| action.type === CartActionsTypes.TooManyItemsInCartFailure
			))
			.subscribe((action) => {

			})
	}

	/**
	 * Unsubscribe from all direct listenings
	 */
	private _unSubscribeAllDirectListeners() {
			this.loadingSubscriptionRef.unsubscribe();
			this.addToCartSuccessRef.unsubscribe();
	}

	/**
	 * Handle the selection of a child category
	 */
	subCategoriesClickHandler(categoryId) {
		// Dispatch action to search for products in selected child category
		this.store.dispatch(new ChangeSelectedCategory(categoryId));
	}

	/**
	 * Handler for the product items
	 */
	productItemEventHandler(event: ProductItemEmitterInterface) {
		const action: ProductItemActionsEnum = event.action;
		const productSlug = event.productSlug;
		const productId = event.pizzaID
		console.log(event)

		switch (action) {
			case ProductItemActionsEnum.onAddToCartClick: {
				console.log('add to cart')
				this.store.dispatch(new AddAdvancedProductToCart(productId))
				break;
			}
			case ProductItemActionsEnum.onCustomizeButtonClick: {

				this.router.navigate(['/catalog/my-pizzas', productSlug, productId])
				break
			}
		}
	}


}
