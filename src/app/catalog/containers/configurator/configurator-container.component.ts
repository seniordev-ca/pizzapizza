// Angular core
import {
	Component,
	OnInit,
	OnDestroy,
	ViewEncapsulation,
	Input,
	ViewChild,
	EventEmitter,
	Output
} from '@angular/core';
import { Router } from '@angular/router';
// NgRx
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Store, select, ActionsSubject } from '@ngrx/store';

// Custom modal component
import {
	ConfirmationModalComponent
} from '../../../common/components/modals/confirmation-modal/confirmation-modal.component';

// Components interfaces
import { SubCategoryInterface } from '../../components/common/sub-category-selector/sub-category-selector.component'
import { SizePickerTabInterface } from '../../components/common/product-size-picker/product-size-picker.component'
import { ConfigurationTabInterface } from '../../components/configurator/product-configuration-tabs/product-configuration-tabs.component'

import {
	OptionTabsInterface,
	OptionListActionsEnum,
} from '../../components/configurator/options-list/options-list.component'

import {
	QuantitySelectorActionsEnum
} from '../../../common/components/products/quantity-selector/quantity-selector.component'

import {
	ConfigurableProductsSliderInterface,
	headerActionsEnum
} from '../../components/configurator/header/header.component';

import {
	NewItemModalActionsEnum,
	NewItemCategorieInterface
} from '../../components/configurator/add-item-modal/add-item-modal.component'

import {
	Product, ProductValidationInterface
} from '../../models/product';
import { ServerCategoriesInterface } from '../../../catalog/models/server-category';

import {
	addToCartBtnEnum, HalfHalfOptionsEnum, OptionSummary
} from '../../models/configurator';

// Reducers
import * as fromCatalog from '../../reducers';
import * as fromCommon from '../../../common/reducers';

// Actions
import {
	ConfiguratorActionsTypes,

	ChangeProductSize,
	ChangeProductConfiguration,
	ChangeProductSubConfiguration,
	IncreaseConfigurableItemQuantity,
	DecreaseConfigurableItemQuantity,

	OptionsSelectUnSelect,
	OptionsResetSelected,
	OptionsSetHalfHalf,
	OptionsUpdateQuantity,
	OptionsUpdateDropDown,

	ConfiguratorAddItemGetCategories,
	TwinProductSliderChange,
	SetConfiguratorTouchedPristine,
	RemoveUnavailableToppings,
	RevertToPreviousSize,
	SetPersonalMessageModalFlag,

	PersonalMessageHasChanged
} from '../../actions/configurator';

import {
	CartActionsTypes,

	AddConfigurableProductToCart,
	UpdateConfigurableProductToCart,
	RevertAddToCartRequest,
} from '../../../checkout/actions/cart';
import { SDKActionTypes } from '../../../common/actions/sdk';
import { SdkResponse, SdkUpsizingResponse } from '../../models/server-sdk';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { UpdateUserPersonalizedForm } from '../../actions/personalized-templates';
import { PersonalizedTemplateUI } from '../../models/personalized-templates';
import { UpdatePizzaAssistantProductViaCartRequest } from '../../actions/pizza-assistant';
import { NotificationsDataLayer } from 'app/common/actions/tag-manager';
import { DataLayerNotificationActionsEnum } from 'app/common/models/datalayer-object';
import { RemoveUnavailableToppingsFromAnotherTwin, ComboProductNextClick } from 'app/catalog/actions/combo-config';
import { ApplicationLocalStorageClient } from '../../../../utils/app-localstorage-client';

// UI states for configurator
interface ConfigurationUiInterface {
	isScrollTopCollapsed: boolean,
	isQuickAddModalOpen: boolean,
	isQuickAddModalLoading: boolean,
	addToCartBtnState: addToCartBtnEnum
}
interface VerticalModalOutputEmitterInterface {
	isClose: boolean
}

/**
* Product configuration page component
*/
@Component({
	selector: 'app-product-configurator',
	templateUrl: './configurator-container.component.html',
	styleUrls: ['./configurator-container.component.scss'],
	encapsulation: ViewEncapsulation.None,
})

/**
* Subscribe on store events and dispatch users event
*/
export class ConfiguratorContainerComponent implements OnInit, OnDestroy {
	addToCartBtnEnum = addToCartBtnEnum;
	HalfHalfOptionsEnum = HalfHalfOptionsEnum;
	@Output() verticalModalOutputEmitter: EventEmitter<VerticalModalOutputEmitterInterface>
	= new EventEmitter<VerticalModalOutputEmitterInterface>();

	@ViewChild('confirmationModalDataForAdd', { static: true }) confirmationModalDataForAdd: ConfirmationModalComponent;
	@ViewChild('confirmationModalDataForUpdate', { static: true }) confirmationModalDataForUpdate: ConfirmationModalComponent;

	@ViewChild('guardModalForEdit', { static: true }) guardModalForEdit: ConfirmationModalComponent;
	@ViewChild('guardModalForNormal', { static: true }) guardModalForNormal: ConfirmationModalComponent;
	@ViewChild('globalErrorModal', { static: true }) globalErrorModal: ConfirmationModalComponent;
	@ViewChild('maxQtyErrorModal', { static: true }) maxQtyErrorModal: ConfirmationModalComponent;
	@ViewChild('upsizingModal', { static: true }) upsizingModal: ConfirmationModalComponent;
	@ViewChild('personalMessageModal', { static: true }) personalMessageModal: ConfirmationModalComponent;
	@ViewChild('noToppingsModal', { static: true }) noToppingsModal: ConfirmationModalComponent;
	@ViewChild('addOneMorePizza', { static: true }) addOneMorePizza: ConfirmationModalComponent;
	@ViewChild('popUpForPromoPizzaMoreThanTwo', { static: true }) popUpForPromoPizzaMoreThanTwo: ConfirmationModalComponent;

	@ViewChild('configuratorVerticalModal', { static: false }) configuratorVerticalModalRef;
	@ViewChild('headerSlider', { static: false }) headerSliderRef;

	@Input() editingComboId = null;
	isVerticalModal = false;
	@Input() set isVerticalModalContainer(value: boolean) {
		this.isVerticalModal = value;
	}

	@Input() isPizzaAssistant: boolean;
	featuredCategory$: Observable<ServerCategoriesInterface>
	// Global error state for app initial launch failure
	isGlobalError = false;
	isMaxQtyError = false;
	isNewItemModalInactive = false;
	isProductEditMode: boolean;
	isShowAddOneMorePopUp = false;
	isShowAddPizza = false;
	promoProductId: string;
	// tslint:disable-next-line: no-any
	activeSlug: any;
	specialsSeoTitle: string;
	// Triggers showing ghost loaded
	isConfiguratorGhost$: Observable<boolean>;
	configurationUi: ConfigurationUiInterface;

	// Max Qty For Same Topping --- Loaded from Config
	maxQtyForTopping$: Observable<number>;

	// Product validation rules TODO grab it from SDK
	productValidation: ProductValidationInterface;

	// Product info. Server data: data.products[<index>]
	configuratorProductInfo$: Observable<Product>;
	configuratorProductsSlider$: Observable<ConfigurableProductsSliderInterface[]>;

	// Size picker. Server data: data.products[<index>].product_options
	productSizePickerTabsArray$: Observable<SizePickerTabInterface[]>;
	// Product configuration level 0, Server date: data.products[<index>].configurations
	productConfigurationTabsArray$: Observable<ConfigurationTabInterface[]>;
	// Sub product config, server data: data.products[<index>].configurations[<index>].sub_configuration
	subCategoriesArray$: Observable<SubCategoryInterface[]>;
	// Product options, server data: data.products[<index>].configurations[<index>].configuration_options
	productOptionListArray$: Observable<OptionTabsInterface[]>;
	// Product categories
	addItemCategories$: Observable<NewItemCategorieInterface[]>;

	getExtraProducts$: Observable<Product[]>;
	// Container state
	selectedConfigurationTabId$: Observable<string>;
	selectedSubCategory$: Observable<string | number>;

	// sdk response
	sdkValidation: SdkResponse;

	isNavigationBlockedByLeaveConfirmModal: boolean;

	// Reference for direct unsubscription
	configuratorSubscriptionsRef;

	validationMsg: string;
	isValid: boolean;
	upSizing: SdkUpsizingResponse;
	isUpSizingModal: boolean;

	activePersonalizationTemplate$: Observable<PersonalizedTemplateUI>
	availableConfigWithPersonalMessage: {
		configId: string,
		subConfigId: string
	};
	availablePersonalMessageRef;
	isPersonalMessageModal: boolean;
	activeTemplatSubscriptioneRef;
	personalizationForm = this.fb.group({
		'message_from': new FormControl(''),
		'message_to': new FormControl(''),
		'message': new FormControl(''),
		'customMessage': new FormControl(null, Validators.maxLength(50))
	})

	recommendations$: Observable<Product[]>;
	availableTemplate$: Observable<string[]>;
	upsellRecommendationRef;
	isUpsellModalOpen: boolean;

	unavailableToppings$: Observable<string[]>;
	toppingsModalRef;
	invalidToppingsModalOpen: boolean;
	calorieText$: Observable<string>;

	legendFlags$: Observable<{}>
	nextStateUrl: string;

	constructor(
		private confirmModal: ConfirmationModalComponent,
		private store: Store<fromCatalog.CatalogState>,
		private router: Router,
		private actions: ActionsSubject,
		private commonStore: Store<fromCommon.CommonState>,
		private fb: FormBuilder,
		private appCookie: ApplicationLocalStorageClient
	) {

		this.productValidation = {
			maxProductQuantity: 1000
		}

		this.configurationUi = {} as ConfigurationUiInterface;
		this.configuratorSubscriptionsRef = {};
	}

	/**
	 * Angular constructor
	 */
	ngOnInit() {
		this.configurationUi = {
			isScrollTopCollapsed: false,
			isQuickAddModalOpen: false,
			isQuickAddModalLoading: false,
			addToCartBtnState: addToCartBtnEnum.notActive
		}

		this.configuratorSubscriptionsRef.configEditModeRef = this.store.pipe(select(fromCatalog.getIsEditMode)).subscribe(isEdit => {
			this.isProductEditMode = isEdit;
		})

		this.isConfiguratorGhost$ = this.store.pipe(select(fromCatalog.getConfigurableLoading));
		this.legendFlags$ = this.store.select(fromCatalog.getConfigLegend);

		this.configuratorSubscriptionsRef.configuratorBtnRef = this.store.pipe(select(fromCatalog.getConfigBtnState)).subscribe(btnState => {
			this.configurationUi.addToCartBtnState = btnState;
		})

		const onUserOnFirstTween = () => {
			this.isNewItemModalInactive = true;
		}

		const onUserOnUserSecondTween = () => {
			this.isNewItemModalInactive = false;
		}
		this.featuredCategory$ = this.store.pipe(select(fromCatalog.getFeaturedProductsCategory));
		this.configuratorSubscriptionsRef.featuredProductsCategory = this.featuredCategory$.subscribe( data => {
			if (data) {
				this.specialsSeoTitle = data.seo_title;

			}
		})
		this.configuratorProductInfo$ = this.store.pipe(select(fromCatalog.getConfigurableProductInfo));
		this.configuratorSubscriptionsRef.configuratorLoadingRef = this.configuratorProductInfo$.subscribe(data => {
			// if ( data.id === 'product_11692') {
			// 	data.image = 'https://storage.pizzapizza.ca/phx2/ppl_images//topping_overlay/2x/hbase.png';
			// }
			this.configuratorSubscriptionsRef.configuratorSliderRef =
				this.store.pipe(select(fromCatalog.getTwinSliderChange)).subscribe(sliderIndex => {
					if (data.isTwinProduct) {
						if (sliderIndex === 0) {
							onUserOnFirstTween();
						} else {
							onUserOnUserSecondTween();
						}
					}
				})
		})

		this.configuratorProductsSlider$ = this.store.pipe(select(fromCatalog.getConfigurableProductProductSlider));
		this.productSizePickerTabsArray$ = this.store.pipe(select(fromCatalog.getConfigurableProductOptions));

		this.productConfigurationTabsArray$ = this.store.pipe(select(fromCatalog.getConfigurableProductConfigurationTabs));
		this.selectedConfigurationTabId$ = this.store.pipe(select(fromCatalog.getSelectedConfigurationId));

		this.subCategoriesArray$ = this.store.pipe(select(fromCatalog.getConfigurableProductSubConfigurationTabs));
		this.selectedSubCategory$ = this.store.pipe(select(fromCatalog.getSelectedSubConfigurationId));
		this.productOptionListArray$ = this.store.pipe(select(fromCatalog.getConfigurableProductConfigurationOptions));

		this.addItemCategories$ = this.store.pipe(select(fromCatalog.getNewItemCategories));

		this.getExtraProducts$ = this.store.pipe(select(fromCatalog.getExtraProducts));

		this.configuratorSubscriptionsRef.validationMsgRef
			= this.store.pipe(select(fromCatalog.getValidationForSingleProduct)).subscribe(validation => {
				// console.log(validation)
				this.isValid = validation.isValid
				this.validationMsg = validation.msg;
				this.upSizing = validation.upSizing;
			});

		this.maxQtyForTopping$ = this.commonStore.pipe(select(fromCatalog.getMaxQtyForSameTopping));

		this._subscribeOnNewItemModalEvents();
		this._subscribeOnCartOperations();
		this._subscribeOnUpdateCartOperation();

		this.configuratorSubscriptionsRef.configPristineRef = this.store.pipe(select(fromCatalog.getIsConfigurationPristine))
			.subscribe(isConfigPristine => {
				// If any product config changed by the user
				this.isNavigationBlockedByLeaveConfirmModal = !isConfigPristine;
				this.isNewItemModalInactive = !isConfigPristine;
			})

		this.activePersonalizationTemplate$ = this.store.pipe(select(fromCatalog.getActivePersonalizationTemplate));
		this.configuratorSubscriptionsRef.activeTemplatSubscriptioneRef = this.store.pipe(select(fromCatalog.getPersonalMessage))
			.subscribe(message => {
				if (message && this.personalizationForm.untouched) {
					this.personalizationForm.patchValue(message)
				}
			})

		this.configuratorSubscriptionsRef.upsellRecommendationRef = this.store.pipe(select(fromCommon.getRecommendationsLoadingState))
			.subscribe(loading => {
				this.isUpsellModalOpen = false;
				if (!loading) {
					this.isUpsellModalOpen = this.configurationUi.addToCartBtnState === addToCartBtnEnum.added
				}
			})

		this.recommendations$ = this.store.pipe(select(fromCommon.getRecommendations));

		this.configuratorSubscriptionsRef.availablePersonalMessageRef = this.store.pipe(select(fromCatalog.getPersonalTemplateAvailable))
			.subscribe(template => {
				this.availableConfigWithPersonalMessage = template;
			})

		this.unavailableToppings$ = this.store.pipe(select(fromCatalog.getUnavailableToppings))
		this.configuratorSubscriptionsRef.toppingsModalRef = this.unavailableToppings$.subscribe(toppings => {
			if (toppings && !this.invalidToppingsModalOpen) {
				this.invalidToppingsModalOpen = true;
				this.confirmModal.onOpen(this.noToppingsModal);
			}
		})
		this.calorieText$ = this.store.pipe(select(fromCommon.getConfigCalorieDisclaimer))

		this.configuratorSubscriptionsRef.personalizationForm = this.personalizationForm.valueChanges
			.subscribe(personalizationForm => {
				if (this.personalizationForm.touched) {
					this.store.dispatch(new PersonalMessageHasChanged());
				}
			})
	}

	/**
	 * Method is used by can-leave-configurator guard
	 */
	isNavChangeConfirmationModalRequired() {
		return this.isNavigationBlockedByLeaveConfirmModal;
	}

	/**
	 * Angular destructor
	 */
	ngOnDestroy() {
		this.configurationUi.addToCartBtnState = addToCartBtnEnum.notActive;
		this._unsubscribeAllDirectListeners();
	}

	/**
	 * Subscribe on categories loading and on categories updates
	 */
	_subscribeOnNewItemModalEvents() {
		const categoriesLoading$ = this.store.pipe(select(fromCatalog.getCategoriesLoading));
		this.configuratorSubscriptionsRef.categoriesLoadingRef =
			categoriesLoading$.subscribe(isLoading => this.configurationUi.isQuickAddModalLoading = isLoading);
	}

	/**
	 * Subscribe on multiple possible errors.
	 */
	_subscribeOnCartOperations() {
		this.configuratorSubscriptionsRef.addToCartSuccessRef = this.actions.pipe(
			filter(
				action => action.type === CartActionsTypes.AddConfigurableProductToCartFailure
					|| action.type === CartActionsTypes.AddConfigurableProductToCartSuccess
					|| action.type === CartActionsTypes.UpdateConfigurableProductToCartFailure
					|| action.type === SDKActionTypes.LoadSDKFailed
					|| action.type === SDKActionTypes.SaveSdkProductInfoFailed
					|| action.type === ConfiguratorActionsTypes.TwinProductSetNext
			)).subscribe((action) => {
				const serverCartProducts = action['serverResponse'].products;
				let quantity = 0;
				this.promoProductId = 'product_14698';
				serverCartProducts.forEach(element => {
					if ( element.product_id === 'product_14698') {
						quantity += element.quantity;
					}
				});
				if (quantity === 1) {
					this.isShowAddOneMorePopUp = true;
				}
				if (quantity >= 2 && quantity <= 9) {
					this.isShowAddPizza = true;
				}
				const isSuccess = action.type === CartActionsTypes.AddConfigurableProductToCartSuccess;

				const isFailure = action.type === CartActionsTypes.AddConfigurableProductToCartFailure
					|| action.type === CartActionsTypes.UpdateConfigurableProductToCartFailure
					|| action.type === SDKActionTypes.LoadSDKFailed
				this.isGlobalError = isFailure;
				if (this.isGlobalError) {
					this.confirmModal.onOpen(this.globalErrorModal)
				}
				if ((this.appCookie.get('ActiveProductId')) === 'product_14698') {
					this.activeSlug = this.appCookie.get('ActiveSlug');
					if (this.isShowAddOneMorePopUp ) {
						this.confirmModal.onOpen(this.addOneMorePizza);
					}
				}
				if ((this.appCookie.get('ActiveProductId')) === 'product_14698') {
					this.activeSlug = this.appCookie.get('ActiveSlug');
					if (this.isShowAddPizza) {
						this.confirmModal.onOpen(this.popUpForPromoPizzaMoreThanTwo);
					}
				}
			})
	}

	/**
	 * Subscribe on update cart action.
	 */
	_subscribeOnUpdateCartOperation() {
		this.configuratorSubscriptionsRef.updateCartToReq = this.actions.pipe(
			filter(
				action => action.type === CartActionsTypes.UpdateConfigurableProductToCartSuccess
			)).subscribe((action) => {
				const serverCartProducts = action['serverResponse'].products;
				let quantity = 0;
				serverCartProducts.forEach(element => {
					if ( element.product_id === 'product_14698') {
						quantity += element.quantity;
					}
				});
				if (quantity === 1) {
					this.isShowAddOneMorePopUp = true;
				}
				if (quantity >= 2 && quantity <= 9) {
					this.isShowAddPizza = true;
				}
				if ((this.appCookie.get('ActiveProductId')) === 'product_14698') {
					this.activeSlug = this.appCookie.get('ActiveSlug');
					if (this.isShowAddOneMorePopUp) {
						this.confirmModal.onOpen(this.addOneMorePizza);
					}
				}
				if ((this.appCookie.get('ActiveProductId')) === 'product_14698') {
					this.activeSlug = this.appCookie.get('ActiveSlug');
					if (this.isShowAddPizza) {
						this.confirmModal.onOpen(this.popUpForPromoPizzaMoreThanTwo);
					}
				}
			})
	}

	/**
	 * Unsubscribe all
	 */
	_unsubscribeAllDirectListeners() {
		for (const key in this.configuratorSubscriptionsRef) {
			if (this.configuratorSubscriptionsRef[key]) {
				this.configuratorSubscriptionsRef[key].unsubscribe();
			}
		}
	}

	/**
	 * Public method for opening configuration modal
	 * It is required to dispatch appropriate REDUX action before opening modal
	*/
	open() {
		this.configuratorVerticalModalRef.openModal()
	}

	/**
	 * Public method for closing configuration modal
	 */
	close() {
		this.configuratorVerticalModalRef.closeModal()
	}

	/**
	 * Handler for retry button
	 */
	onRetryClickHandler() {
		this.isGlobalError = false;
	}
	/**
	 * Handler for Max Qty Error popup close
	 */
	onCloseMaxQtyHandler() {
		this.isMaxQtyError = false;
	}

	/**
	 * Handler for product option
	 * (Small, Medium, Large)
	 */
	productSizePickerTabClickHandler(productId) {
		this.invalidToppingsModalOpen = false;
		this.store.dispatch(new ChangeProductSize(productId));
	}

	/**
	 * Handler for product configuration tab
	 * (Choose your base, Choose your Toppings)
	 */
	productConfigurationClickHandler(configurationId) {
		this.store.dispatch(new ChangeProductConfiguration(configurationId));
	}

	/**
	 * Sub category picker
	 * (Veggie, Cheese, Meat)
	 */
	subCategoriesClickHandler(subCategoryId) {
		this.store.dispatch(new ChangeProductSubConfiguration(subCategoryId));
	}

	/**
	 * Handler for option list events
	 */
	productListEventHandler(event) {
		const action = event.action;
		switch (action) {
			// Select/unselect option
			case OptionListActionsEnum.optionClick: {
				if (event.isValid) {
					const optionId = event.optionId;
					this.store.dispatch(new OptionsSelectUnSelect(optionId));
				} else {
					this.isMaxQtyError = true;
					this.confirmModal.onOpen(this.maxQtyErrorModal)
				}
				break
			}
			// Reset all options
			case OptionListActionsEnum.resetOptionClick: {
				this.store.dispatch(new OptionsResetSelected());
				break
			}
			// Option quantity change handler
			case OptionListActionsEnum.optionQuantityClick: {
				if (event.isValid) {
					const optionId = event.optionId;
					const quantityChange = event.quantity;
					this.store.dispatch(new OptionsUpdateQuantity(optionId, quantityChange));
				} else {
					this.isMaxQtyError = true;
					this.confirmModal.onOpen(this.maxQtyErrorModal)
				}
				break
			}
			// Option half half change handler
			case OptionListActionsEnum.optionHalfHalfClick: {
				const optionId = event.optionId;
				const direction = event.halfHalfMode;
				this.store.dispatch(new OptionsSetHalfHalf(optionId, direction));
				break
			}
			// Option drop down change
			case OptionListActionsEnum.optionDropDownChange: {
				const optionId = event.optionId;
				const dropDownValue = event.dropDownValue;
				this.store.dispatch(new OptionsUpdateDropDown(optionId, dropDownValue));
				break
			}
			default: {
				console.log('invalid action')
			}
		}
	}

	/**
	 * When Vertical Modal is closed via 'X'
	 */
	handleCloseModalClick(event) {
		if (event.isClose && this.editingComboId) {
			this.store.dispatch(new RevertAddToCartRequest());
		}
		this.verticalModalOutputEmitter.emit({
			isClose: event.isClose
		})
	}

		/**
	 * When Vertical Modal is closed via 'X'
	 */
	handleCloseSimpleModalClick(event) {
		this.verticalModalOutputEmitter.emit({
			isClose: event.isClose
		})
	}

	/**
	 * Handle Btn Click
	 */
	private _handleAddBtnClick(isUpsizedAsked?: boolean) {
		switch (this.configurationUi.addToCartBtnState) {
			case addToCartBtnEnum.active:
			case addToCartBtnEnum.nextComboProduct:
			case addToCartBtnEnum.update: {
				if (this.personalizationForm.touched) {
					const value = this.personalizationForm.value;
					const personalizedForm = value;
					personalizedForm.message = value.customMessage ? value.customMessage : value.message;

					delete (personalizedForm.customMessage);
					this.store.dispatch(new UpdateUserPersonalizedForm(personalizedForm))
				}
				if (this.upSizing && !this.isProductEditMode && !isUpsizedAsked) {
					this.isUpSizingModal = true;
					this.confirmModal.onOpen(this.upsizingModal);
					this.store.dispatch(new NotificationsDataLayer(DataLayerNotificationActionsEnum.UPSIZING, this.upSizing))
					return false
				}
				if (this.availableConfigWithPersonalMessage && !isUpsizedAsked && !this.isProductEditMode) {
					this.isPersonalMessageModal = true;
					this.confirmModal.onOpen(this.personalMessageModal)
					return false
				}

				if (this.isVerticalModal && !this.isPizzaAssistant && this.isValid) {
					console.log('ADDED TO CART VIA CONFIG MODAL');
					this.store.dispatch(new ComboProductNextClick(isUpsizedAsked))
					this.close();
					break
				}

				if (this.isVerticalModal && this.isPizzaAssistant) {
					console.log('UPDATE PIZZA ASSISTANT VIA CONFIG MODAL');
					this.store.dispatch(new UpdatePizzaAssistantProductViaCartRequest())
					this.close();
					break
				}

				if (this.isValid && this.personalizationForm.valid) {
					const action = this.configurationUi.addToCartBtnState === addToCartBtnEnum.active ?
						new AddConfigurableProductToCart(isUpsizedAsked) : new UpdateConfigurableProductToCart(isUpsizedAsked);
					this.store.dispatch(action);
				} else {
					console.log('TODO: when is invalid', this.validationMsg, this.configurationUi.addToCartBtnState)
				}

				break
			}

			case addToCartBtnEnum.nextTwin: {
				window.scroll(0, 0);
				this.headerSliderRef.onCustomPageClick(1);
				break
			}

			default: {
				console.log('TODO --- btn is not set')
			}
		}
	}

	/**
	 * Open New Item Modal
	 */
	openItemModal(isNewItemModalInactive) {

			this.isUpsellModalOpen = false;
			let confirmationModal = null;
			if (this.isProductEditMode) {
				confirmationModal = this.confirmationModalDataForUpdate;
			} else {
				confirmationModal = this.confirmationModalDataForAdd;
			}

			if (this.isNavigationBlockedByLeaveConfirmModal) {
				this.confirmModal.onOpen(confirmationModal);
				return false;
			}

			if (!isNewItemModalInactive) {
				this.dispatchAddItemGetCategories();
			}

	}



	/**
	 * Action is checking if categories are fetched and fetching if not
	 */
	dispatchAddItemGetCategories() {
		this.configurationUi.isQuickAddModalOpen = true;
		this.store.dispatch(new ConfiguratorAddItemGetCategories());
	}

	/**
	 * Handler for product header events
	 */
	configuratorHeaderEventHandler(event) {
		// On add to cart click
		// TODO
		// - Handling for upsize upsale as per UX 4.21
		// - Handling for drinks upsale as
		switch (event.action) {

			case ('addToCartClick'): {
				this._handleAddBtnClick();
				break;
			}

			case (headerActionsEnum.sliderProductChange): {
				const newSelectionLineId = event.lineId;
				const sliderIndex = event.slideIndex;

				this.store.dispatch(new TwinProductSliderChange(newSelectionLineId, sliderIndex));
				break;
			}

		}
		this.verticalModalOutputEmitter.emit({
			isClose: true
		})
	}

	/**
	 * Event handler for new item modal
	 */
	addItemEventHandler(event) {
		// Add item close modal handler
		if (event.action === NewItemModalActionsEnum.onCloseClick) {
			this.configurationUi.isQuickAddModalOpen = false;
		}

		// TODO logic for slider for quick add modal
		// On item upsale item click
		if (event.action === NewItemModalActionsEnum.onMenuClick) {
			const menuId = event.menuId;
			const menuSeoTitle = event.menuSeoTitle;
			this.router.navigate([`/catalog/products/${menuSeoTitle}`]);
		}
	}

	/**
	 * User press on quantity selector
	 */
	quantitySelectorEventHandler(event) {
		if (event.action === QuantitySelectorActionsEnum.onPlusClick) {
			this.store.dispatch(new IncreaseConfigurableItemQuantity());
		}

		if (event.action === QuantitySelectorActionsEnum.onMinusClick) {
			this.store.dispatch(new DecreaseConfigurableItemQuantity());
		}
	}

	/**
	 * Event handler for configurator modal
	 */
	closeUpsaleModal() {
		this.isUpsellModalOpen = false
	}

	/**
	 * Handle UpSizing Modal
	 */
	handleUpSizingModal(addToCart: boolean) {
		const isUpsizedAsked = true;
		if (addToCart) {
			this.store.dispatch(new ChangeProductSize(this.upSizing.toProductOption));
		}
		this.upSizing = null;
		this.isUpSizingModal = false;

		this._handleAddBtnClick(isUpsizedAsked);
	}

	/**
	 * Handle Personal Message Modal
	 */
	handlePersonalMessageModal(openSubConfig: boolean, isCloseBtn?: boolean) {
		this.isPersonalMessageModal = false;
		if (isCloseBtn) {
			return false;
		}

		if (openSubConfig) {
			this.store.dispatch(new ChangeProductConfiguration(this.availableConfigWithPersonalMessage.configId))
			this.store.dispatch(new ChangeProductSubConfiguration(this.availableConfigWithPersonalMessage.subConfigId))
			return false;
		}
		this.availableConfigWithPersonalMessage = null;
		this.store.dispatch(new SetPersonalMessageModalFlag(true, true))
		this._handleAddBtnClick()
	}

	/**
	 * Handle Unavailable Toppings Modal
	 */
	handleUnavailableToppings(isRemove: boolean) {
		if (this.isVerticalModal && !this.isPizzaAssistant) {
			if (isRemove) {
				// make new action to clear invalid toppings on twin inside combo
				this.store.dispatch(new RemoveUnavailableToppingsFromAnotherTwin())
				return false
			}
		}
		if (isRemove) {
			this.store.dispatch(new RemoveUnavailableToppings())
			return false
		}
		this.store.dispatch(new RevertToPreviousSize())
	}

	/**
	 * Confirm Leave Attempt
	 */
	confirmLeaveAttempt() {
		this.store.dispatch(new SetConfiguratorTouchedPristine());
		this.router.navigate([this.nextStateUrl]);
	}

	/**
	 * Handler for promo popup close
	*/
	resetPizzaConfig() {
		this.store.dispatch(new SetConfiguratorTouchedPristine());
		this.router.navigate([`/catalog/config/${this.activeSlug}`]);
	}
	/**
	 * Cancel Leave Attempt
	 */
	cancelLeaveAttempt() {
		// this.router.navigate(['']);
		this.store.dispatch(new RevertAddToCartRequest())
	}

	/**
	 * Confirm Leave Attempt
	 */
	confirmLeave() {
		this.store.dispatch(new SetConfiguratorTouchedPristine());
		this.router.navigate([`/catalog/products/${this.specialsSeoTitle}`])
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

	/**
	 * Get aria-label text for Add to Cart Button from subText Array
	 */
	getAriaLabelTextFromSubText(subText: OptionSummary[] | string) {
		if (!subText) {
			return 'Add To Cart';
		}

		if (typeof subText === 'string') {
			return subText;
		}
		let ariaLabel = 'Add ';
		subText.forEach(value => {
			if (value.quantity > 0) {
				ariaLabel += `${value.quantity} ${value.text} `;
			}
		});
		ariaLabel += 'to cart';
		return ariaLabel;
	}
}

export {
	addToCartBtnEnum,
	ConfigurationUiInterface
}
