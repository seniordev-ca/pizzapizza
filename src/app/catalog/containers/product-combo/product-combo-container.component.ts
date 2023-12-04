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
import {
	ComboConfigDetails,
	ComboConfigGroup
} from '../../models/combo-config';

import { addToCartBtnEnum } from '../../models/configurator';
/**
 * ngrx
 */
import { Store, select } from '@ngrx/store';
import { Observable, of } from 'rxjs';

import * as fromReducers from '../../reducers';
import * as fromRootReducer from '../../../root-reducer/root-reducer';
import * as fromCommon from '../../../common/reducers';

import {
	ConfigureComboProductInModal,
	ResetComboProductInCartRequestArray,
} from '../../actions/configurator'
import {
	IncreaseComboQuantity,
	DecreaseComboQuantity,
	AddFlatConfigOptionToComboConfigurator,
	UpdateFlatConfigOptionQuantity,
	SetComboConfigToPristine,
	ReFetchComboConfig
} from '../../actions/combo-config';
import { AddComboToCart, UpdateComboToCart } from '../../../checkout/actions/cart';
import { ProductValidationInterface } from '../../models/product';

import { AddValidIncompleteComboToCart } from '../../../catalog/actions/combo-config'
import { Router } from '../../../../../node_modules/@angular/router';
import { ServerCategoriesInterface } from '../../models/server-category';
import { ConfirmationModalComponent } from '../../../common/components/modals/confirmation-modal/confirmation-modal.component';
class GhostGroupGenerator {
	/**
	 * Generate ghost groups with some products
	 */
	static generateGhostGroups() {
		const GROUPS_COUNT = 5;
		const PRODUCTS_COUNT = 2;

		return of(Array.apply(null, Array(GROUPS_COUNT)).map(group => {
			return {
				groupTitle: ' ',
				products: Array.apply(null, Array(PRODUCTS_COUNT)).map(product => {
					return {
						id: null,
						name: ' ',
						image: null,
						description: ' ',
					}
				})
			}
		}));
	}
}

@Component({
	selector: 'app-product-combo-container',
	templateUrl: './product-combo-container.component.html',
	styleUrls: ['./product-combo-container.component.scss'],
	encapsulation: ViewEncapsulation.None
})

export class ProductComboContainerComponent implements OnInit, OnDestroy {
	@ViewChild('verticalModalConfigurator', { static: true }) configuratorVerticalModalRef;
	@ViewChild('guardModalForEdit', { static: true }) guardModalForEdit: ConfirmationModalComponent;
	@ViewChild('guardModalForNormal', { static: true }) guardModalForNormal: ConfirmationModalComponent;
	@ViewChild('comboNotConfigModal', { static: true }) comboNotConfigModal: ConfirmationModalComponent;
	@ViewChild('comboFreeOptionModal', { static: true }) comboFreeOptionModal: ConfirmationModalComponent;
	@ViewChild('looseConfigModal', { static: true }) looseConfigModal: ConfirmationModalComponent;

	comboConfigLoading$: Observable<boolean>;
	comboConfigError$: Observable<boolean>;
	comboDetails$: Observable<ComboConfigDetails>;
	comboGroupedProducts$: Observable<ComboConfigGroup[]>;
	featuredCategorySlug: string

	activeBtnState: addToCartBtnEnum;
	isMaxQtyError: boolean;

	comboSubscriptionRefs;

	isConfiguratorValid: boolean;
	notConfiguredLineIds: number[];

	isNavigationBlockedByLeaveConfirmModal: boolean;

	isComboFreeOptionNotShownModal: boolean;
	isComboNotConfiguredModalShown: boolean;

	// For now has only max quantity which is not used due to UX
	productValidation: ProductValidationInterface;
	isProductEditMode: boolean;
	nextStateUrl: string;
	selectedProductLineId: number;

	constructor(
		private confirmModal: ConfirmationModalComponent,
		private store: Store<fromRootReducer.State>,
		private router: Router
	) {
		this.comboSubscriptionRefs = {};
		this.comboSubscriptionRefs.editModeSubscriptionRef = this.store.pipe(select(fromReducers.getIsComboEditMode)).subscribe(isEdit => {
			this.isProductEditMode = isEdit;
		})
		this.comboSubscriptionRefs.featuredCatRef = this.store.pipe(select(fromReducers.getFeaturedProductsCategory)).subscribe(category => {
			this.featuredCategorySlug = category ? '/catalog/products/' + category.seo_title : null;
			console.log(this.featuredCategorySlug)
		})

		// Max quantity
		this.productValidation = {
			maxProductQuantity: 1000
		}

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
		for (const key in this.comboSubscriptionRefs) {
			if (this.comboSubscriptionRefs[key]) {
				this.comboSubscriptionRefs[key].unsubscribe();
			}
		}
	}

	/**
	 * Subscribe to store
	 * TODO error state handling in UI
	 */
	private _subscribeComboConfig() {
		this.comboConfigLoading$ = this.store.pipe(
			select(fromReducers.getComboConfigLoading)
		);
		this.comboConfigError$ = this.store.pipe(
			select(fromReducers.getComboConfigError)
		);

		// Subscribe combo details
		this.comboDetails$ = this.store.pipe(
			select(fromRootReducer.getComboProductDetails)
		);

		this.comboSubscriptionRefs.comboDetailsSubscriptionRef = this.comboDetails$.subscribe(details => {
			this.activeBtnState = details.btnState;
		})

		// Generate ghost DOM is data is loading
		this.comboGroupedProducts$ = GhostGroupGenerator.generateGhostGroups();
		this.comboSubscriptionRefs.comboLoadingSubscriptionRef = this.comboConfigLoading$.subscribe(loading => {
			if (!loading) {
				// Subscribe grouped products
				this.comboGroupedProducts$ = this.store.pipe(
					select(fromRootReducer.getComboProductConfiguration)
				);
			}
		})

		this.comboSubscriptionRefs.notConfigureLineIdsRef = this.store.pipe(select(fromCommon.selectCommonState)).subscribe(sdkData => {
			if (sdkData.sdk.sdkResponse != null) {
				this.isConfiguratorValid = sdkData.sdk.sdkResponse.validation ? sdkData.sdk.sdkResponse.validation.isConfigValid : true;
				this.notConfiguredLineIds = sdkData.sdk.sdkResponse.validation ? sdkData.sdk.sdkResponse.validation.notConfiguredLineIds : null;
			}
		});

		this.comboSubscriptionRefs.configPristineRef = this.store.pipe(select(fromReducers.getIsComboPristine))
			.subscribe(isConfigPristine => {
				this.isNavigationBlockedByLeaveConfirmModal = !isConfigPristine;
			})

	}

	/**
	 * Method to reset combo group
	 */
	onResetCombo(group: ComboConfigGroup) {
		this.store.dispatch(new ResetComboProductInCartRequestArray(group));
	}

	/**
	 * Determines if combo group needs reset
	 */
	productComboNeedsReset(group: ComboConfigGroup) {
		if (!group.isResetAllowed) {
			return false;
		}
		return group.products.filter(product => product.isSelected).length > 0
	}

	/**
	 * Handle case when user decided to go with default configuration for product and not configure it
	 */
	addDefaultConfigHandler() {
		this.isComboFreeOptionNotShownModal = false;
		this.store.dispatch(new AddValidIncompleteComboToCart());
		this.store.dispatch(new AddComboToCart());
	}

	/**
	 * Handle Cancel Button being clicked
	 */
	onCancelClickHandler() {
		this.isComboFreeOptionNotShownModal = false;
	}

	/**
	 * Handle Add To Cart Event
	 */
	addBtnEventHandler(event) {
		switch (this.activeBtnState) {
			case (addToCartBtnEnum.active): {

				if (!this.isConfiguratorValid) {
					// User selection is not full
					this.isComboNotConfiguredModalShown = true;
					this.confirmModal.onOpen(this.comboNotConfigModal)
				} else if (this.notConfiguredLineIds.length > 0) {
					// User not selected free options
					this.isComboFreeOptionNotShownModal = true;
					this.confirmModal.onOpen(this.comboFreeOptionModal)
				} else {
					// Combo fully configured
					this.store.dispatch(new AddComboToCart())
				}

				break
			}
			case (addToCartBtnEnum.update): {
				this.store.dispatch(new UpdateComboToCart());
				break
			}
			default: {
				console.warn(this.activeBtnState, 'Btn State Incorrect')
			}
		}
	}

	/**
	 * Closes config modal
	 */
	onComboNotConfiguredOkClick() {
		this.isComboNotConfiguredModalShown = false;
	}

	/**
	 * User press on quantity selector
	 */
	quantitySelectorEventHandler(event) {
		if (event.action === QuantitySelectorActionsEnum.onPlusClick) {
			this.store.dispatch(new IncreaseComboQuantity());
		}

		if (event.action === QuantitySelectorActionsEnum.onMinusClick) {
			this.store.dispatch(new DecreaseComboQuantity());
		}
	}

	/**
	 * Close Max Qty Pop up
	 */
	onCloseMaxQtyHandler() {
		this.isMaxQtyError = false;
	}

	/**
	 * Handler for the product items
	 */
	productComboEventHandler(productItemEvent: ProductItemEmitterInterface, group: ComboConfigGroup) {
		const action: ProductItemActionsEnum = productItemEvent.action;
		const groupId = group.groupId;
		switch (action) {
			/**
			 * Add Flat Product To Cart
			 */
			case ProductItemActionsEnum.onAddToCartClick: {
				if (productItemEvent.isValid) {
					const isDelete = productItemEvent.isSelected
					// // Add Item directly to combo without Config
					const quantity = productItemEvent.quantity > 0 ? productItemEvent.quantity : 1;
					this.store.dispatch(new AddFlatConfigOptionToComboConfigurator(
						productItemEvent.productId,
						groupId,
						quantity,
						productItemEvent.isConfigOption,
						isDelete,
						productItemEvent.lineId
					))
				} else {
					console.log('invalid message');
					// this.isMaxQtyError = true;
				}

				break;
			}

			/**
			 * Configure product in single configurator in vertical modal
			 */
			case ProductItemActionsEnum.onCustomizeButtonClick: {
				const productLineId = productItemEvent.lineId;
				const isGroupAllowMultiple = group.isAllowMultiple;
				const invalidSiblings = group.products.filter(product => product.isSelected && product.lineId !== productLineId)
				// Determine if there are siblings that will loose config if this product is selected
				if (!isGroupAllowMultiple && invalidSiblings.length > 0) {
					this.selectedProductLineId = productLineId;
					this.confirmModal.onOpen(this.looseConfigModal);
					return false
				}
				this.store.dispatch(new ConfigureComboProductInModal(productLineId));
				this.configuratorVerticalModalRef.open();
				break;
			}

			/**
			 * Update Flat Product Qty
			 */
			case ProductItemActionsEnum.onProductQuantityChange: {
				this.store.dispatch(new UpdateFlatConfigOptionQuantity(productItemEvent.productId, groupId, productItemEvent.quantity))

				break
			}

			default: {
				console.log('default', action);
				break;
			}
		}
	}

	/**
	 * User Confirms they will loose invalid sibling config and open selected product
	 */
	confirmOpenConfig() {
		this.store.dispatch(new ConfigureComboProductInModal(this.selectedProductLineId));
		this.configuratorVerticalModalRef.open();
	}

	/**
	 * Method is used by can-leave-configurator guard
	 */
	isNavChangeConfirmationModalRequired() {
		return this.isNavigationBlockedByLeaveConfirmModal;
	}

	/**
	 * On user agreed to loose not saved configuration from can-leave-configurator guard
	 */
	onLeaveModalConfirmed() {
		// This action will update isNavigationBlockedByLeaveConfirmModal to activate navigation
		this.store.dispatch(new SetComboConfigToPristine());
	}
	/**
	 * Confirm Leave Attempt
	 */
	confirmLeaveAttempt() {
		this.onLeaveModalConfirmed();
		this.router.navigate([this.nextStateUrl]);
	}
	/**
	 * Cancel Leave Attempt
	 */
	cancelLeaveAttempt() {
		// this.store.dispatch(new RevertAddToCartRequest())
		// this.store.dispatch(new ReFetchComboConfig())
	}
	/**
	 * On Leave Leave Attempt
	 */
	onLeaveAttempt(nextStateUrl: string) {
		this.nextStateUrl = nextStateUrl;
		if (this.isProductEditMode) {
			this.confirmModal.onOpen(this.guardModalForEdit);
		} else {
			this.confirmModal.onOpen(this.guardModalForNormal);
		}
	}
}
