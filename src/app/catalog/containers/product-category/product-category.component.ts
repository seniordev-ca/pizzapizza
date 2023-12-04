// Angular core
import {
	Component,
	ViewEncapsulation,
	OnInit,
	OnDestroy,
} from '@angular/core';
import { Router } from '@angular/router';

// ViewModel interfaces
import { Product } from '../../models/product';
import {
	ProductItemActionsEnum,
	ProductItemEmitterInterface,
} from '../../components/common/product-item/product-item.component';
import { SubCategoryInterface } from '../../components/common/sub-category-selector/sub-category-selector.component';
import { SubHeaderNavigationInterface } from '../../../common/components/shared/sub-header-navigation/sub-header-navigation.component';
import { SizePickerTabInterface } from '../../components/common/product-size-picker/product-size-picker.component'
import {
	QuickAddModalActionEnum,
	QuickAddEventEmitterInterface
} from '../../components/common/quick-add-modal/quick-add-modal.component';

// NG RX core
import { Store, select, ActionsSubject } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { filter } from 'rxjs/operators';

// Reduce, actions
import * as fromReducers from '../../reducers';
import * as fromCommon from '../../../common/reducers';

import { ChangeSelectedCategory } from '../../actions/category';
import { OpenQuickAddSingleProductModal } from '../../actions/configurator';
import {
	ConfiguratorActionsTypes,
	ChangeProductSize,
} from '../../actions/configurator';

import {
	UpdateProductQuantity
} from '../../actions/product-list';

import {
	CartActionsTypes,
	AddConfigurableProductToCart,
	AddBasicProductToCart
} from '../../../checkout/actions/cart';
import { ServerProductConfig, ProductKinds } from '../../models/server-product-config';
import { CommonObjectUpdateData } from 'app/common/actions/tag-manager';


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
	selector: 'app-root',
	templateUrl: './product-category.component.html',
	styleUrls: ['./product-category.component.scss'],
	encapsulation: ViewEncapsulation.None
})

/**
 * TODO implement productListError$
 */
export class ProductsContainerComponent implements OnInit, OnDestroy {

	// Categories header
	topBavContent$: Observable<SubHeaderNavigationInterface>;
	subCategoriesArray$: Observable<SubCategoryInterface[]>;
	selectedSubCategorieChild$: Observable<string>;
	categoryLoading$: Observable<boolean>;

	// Products list
	productList$: Observable<Product[]>
	productListLoading$: Observable<boolean>
	productListError$: Observable<boolean>

	// Product info and sizes for quick add modal
	configuratorProductInfo$: Observable<Product>;
	productSizePickerTabsArray$: Observable<SizePickerTabInterface[]>;

	// Flags for quick modal loading and open states
	quickAddModalLoadingForProductId: string;
	openQuickAddModalForProductId: string;
	isQuickAddLoading: boolean;

	// References for direct subscription
	loadingSubscriptionRef = null;
	productFetchSubscriptionRef = null;
	addToCartSuccessRef = null;

	isAddressComplete$: Observable<boolean>;
	constructor(
		private store: Store<fromReducers.CatalogState>,
		private actions: ActionsSubject,
		private router: Router,
	) {
		this.quickAddModalLoadingForProductId = null;
		this.isAddressComplete$ = this.store.pipe(select(fromCommon.getIsAddressComplete))

	}

	/**
	 * Angular constructor
	 */
	ngOnInit() {
		this._subscribeProductCategoryContent();
		this._subscribeOnProductConfigFetchForQuickAddModal();
		this._subscribeOnAddToCartSuccess();
		this.openQuickAddModalForProductId = null;
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
		// Categories and product list loading and errors
		this.categoryLoading$ = this.store.pipe(select(fromReducers.getCategoriesLoading));
		this.productListLoading$ = this.store.pipe(select(fromReducers.getProductListLoading));
		this.productListError$ = this.store.pipe(select(fromReducers.getProductListError));

		// Product list header
		this.topBavContent$ = this.store.pipe(select(fromReducers.selectParentCategory));
		this.subCategoriesArray$ = this.store.pipe(select(fromReducers.getProductChildren));
		this.selectedSubCategorieChild$ = this.store.pipe(select(fromReducers.getSelectedChild));

		// Quick add modal
		this.configuratorProductInfo$ = this.store.pipe(select(fromReducers.getConfigurableProductInfo));
		this.productSizePickerTabsArray$ = this.store.pipe(select(fromReducers.getConfigurableProductOptions));
		// Generate ghost DOM if data is loading
		this.loadingSubscriptionRef = this.productListLoading$.subscribe(loading => {
			if (loading) {
				this.productList$ = GenerateGhostProductListHelper.generateGhostList(6);
			} else {
				this.productList$ = this.store.pipe(select(fromReducers.getProductList));
			}
		})
	}

	/**
	 * Subscribe on fetch success for showing quick add modal
	 * TODO check is requested product was fetched by id after server would return real data
	 */
	private _subscribeOnProductConfigFetchForQuickAddModal() {
		this.productFetchSubscriptionRef = this.actions.pipe(
			filter(action =>
				action.type === ConfiguratorActionsTypes.FetchSingleProductSuccess
				|| action.type === ConfiguratorActionsTypes.FetchSingleConfigurableComboSuccess
			)).subscribe((action) => {
				const productId = action['rootId'];
				const serverConfig = action['serverProductConfig'] as ServerProductConfig;
				// TODO: this.quickAddModalLoadingForProductId === productId
				if (productId || !productId) {
					const kind = serverConfig.kind;
					switch (kind) {
						case ProductKinds.single: {
							if (serverConfig.data.products[0].product_options.options.length > 1) {
								this.openQuickAddModalForProductId = this.quickAddModalLoadingForProductId;
								this.quickAddModalLoadingForProductId = null;
							}
							break
						}
						case ProductKinds.single_configurable_combo: {
							if (serverConfig.data.products.find(product => product.allow_customization).product_options.options.length > 1) {
								this.openQuickAddModalForProductId = this.quickAddModalLoadingForProductId;
								this.quickAddModalLoadingForProductId = null;
							}
							break
						}
						default: {
							console.warn('CRITICAL | Somehow the product list quickadd btn fetched an invalid product kind')
						}
					}
				} else {
					console.warn('CRITICAL | fetched product is not matching requested one');
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
				this.quickAddModalLoadingForProductId = null;
				this.openQuickAddModalForProductId = null;
				this.isQuickAddLoading = false;
			})
	}

	/**
	 * Unsubscribe from all direct listenings
	 */
	private _unSubscribeAllDirectListeners() {
		if (this.loadingSubscriptionRef) {
			this.loadingSubscriptionRef.unsubscribe();
			this.productFetchSubscriptionRef.unsubscribe();
			this.addToCartSuccessRef.unsubscribe();
		}
	}

	/**
	 * Handle the selection of a child category
	 */
	subCategoriesClickHandler(categoryId) {
		// Dispatch action to search for products in selected child category
		this.store.dispatch(new ChangeSelectedCategory(categoryId));
	}
	/**
	 * Handle data for tag analytics
	 */
	handleTagAnalytics(event) {
		const data = {
			event: 'productClick',
			ecommerce: {
				click: {
					actionField: {
						list: 'Menu'
					},
					products: [{
						name: event.name,
						id: `${event.productId}`,
						brand: event.isAddableToCartWithoutCustomization ? 'default' : 'customized',
						category: 'undefined',
						position: event.sequence ? event.sequence : 'undefined'
					}]
				}
			}
		}
		if (!event.lineId) {
			this.store.dispatch(new CommonObjectUpdateData(data, 'customizeBtnClick'));
		} else if (event.lineId && event.pizzaAssistantLabel) {
			this.store.dispatch(new CommonObjectUpdateData(data, 'pizzaAssistant'));
		}
	}
	/**
	 * Handler for the product items
	 */
	productItemEventHandler(event: ProductItemEmitterInterface) {
		const action: ProductItemActionsEnum = event.action;

		switch (action) {
			case ProductItemActionsEnum.onAddToCartClick: {
				const productId = event.productId;
				// console.log(`TODO add to cart ${productId}`);
				this.store.dispatch(new AddBasicProductToCart(productId))
				break;
			}

			case ProductItemActionsEnum.onQuickAddButtonClick: {
				// Dispatch fetch action, show loading for quick add button, show mini modal when fetched
				const productId = event.productId;
				const productSlug = event.productSlug;
				this.quickAddModalLoadingForProductId = productId;
				this.handleTagAnalytics(event);
				this.store.dispatch(new OpenQuickAddSingleProductModal(productSlug));
				break;
			}

			case ProductItemActionsEnum.onCustomizeButtonClick: {
				// Navigate to configurator page
				const productId = event.productId;
				const productSlug = event.productSlug;
				this.handleTagAnalytics(event);
				if (event.isCombo) {
					this.router.navigate([`/catalog/product-combo/${productSlug}`]);
				} else {
					this.router.navigate([`/catalog/config/${productSlug}`]);
				}
				break;
			}

			case ProductItemActionsEnum.onProductQuantityChange: {
				const productId = event.productId;
				const quantity = event.quantity;
				this.store.dispatch(new UpdateProductQuantity(productId, quantity))
			}
		}
	}

	/**
	 * Handler for quick add modal
	 */
	quickAddModalHandler(event: QuickAddEventEmitterInterface) {
		const action = event.action;

		switch (action) {
			case QuickAddModalActionEnum.onCloseClick: {
				this.quickAddModalLoadingForProductId = null;
				this.openQuickAddModalForProductId = null;
				break;
			}

			case QuickAddModalActionEnum.onProductSizeChange: {
				const productSizeId = event.sizeId;
				this.store.dispatch(new ChangeProductSize(productSizeId));
				break;
			}

			case QuickAddModalActionEnum.onAddToCartClick: {
				this.store.dispatch(new AddConfigurableProductToCart());
				this.isQuickAddLoading = true;
				// console.log(`TODO add to cart ${productId}`);
				break;
			}

		}

	}
}
