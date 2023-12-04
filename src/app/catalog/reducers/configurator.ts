// NGRX
import {
	createEntityAdapter,
	EntityAdapter,
	EntityState
} from '@ngrx/entity';

// Actions
import { ConfiguratorActionsTypes } from '../actions/configurator'
import { CatalogCategoriesTypes } from '../actions/category'
import { CartActionsTypes } from '../../checkout/actions/cart';

// Server Models
import { ServerProductConfig, ServerProductConfigProduct, ProductKinds, ProductOptionSizeCodes } from '../models/server-product-config';
import { AddCartServerRequestInterface } from '../../checkout/models/server-cart-request';
import { AppSettingsImageURLInterface } from '../../common/models/server-app-settings';

// View Models
import { SizePickerTabInterface } from '../components/common/product-size-picker/product-size-picker.component';
import { ConfigurationTabInterface } from '../components/configurator/product-configuration-tabs/product-configuration-tabs.component';
import { SubCategoryInterface } from '../components/common/sub-category-selector/sub-category-selector.component';
import { Product } from '../models/product';
import { OptionTabsInterface } from '../components/configurator/options-list/options-list.component';
import { ConfigurableProductsSliderInterface } from '../components/configurator/header/header.component';
import { NewItemCategorieInterface } from '../components/configurator/add-item-modal/add-item-modal.component';

import { ConfiguratorReducerHelper } from './mappers/configurator';
import { SDKActionTypes } from '../../common/actions/sdk';
import { SdkResponse } from '../models/server-sdk';
import { PizzaAssistantActionTypes } from '../actions/pizza-assistant';
import { CatalogComboConfigListTypes } from '../actions/combo-config';
export interface State extends EntityState<ServerProductConfig> {
	isLoading: boolean,
	isFetched: boolean,

	rootProductId: string,
	productKind: ProductKinds,
	productSeoTitle: string,

	isCartProductCopiedToConfigurable: boolean,
	cartItemId: number,

	isEditMode: boolean,
	isVerticalModal: boolean,

	// Two flags below are user for add to cart button state
	isProductConfigurationPristine: boolean,
	isProductUpdatedOnEditPage: boolean,

	comboSubProductLineId?: number,

	currentTwinLineId?: number,
	currentTwinSliderIndex?: number,

	configurableComboData: AddCartServerRequestInterface[],
	configurableItemData: ServerProductConfigProduct,

	viewProductInfo: Product,
	viewProductsSlider: ConfigurableProductsSliderInterface[],
	viewProductSizes: SizePickerTabInterface[],
	viewProductConfiguration: ConfigurationTabInterface[],
	viewProductSubConfiguration: SubCategoryInterface[],
	viewProductOptions: OptionTabsInterface[],
	viewCategories: NewItemCategorieInterface[],

	viewComesWithProducts: Product[], // For kind comes with

	selectedProductOptionId: number,
	selectedProductOptionSibling: { // For mapping twin product
		productLineId: number,
		productOptionId: number
	},
	selectedConfigurationId: string,
	selectedSubConfigurationId: string,

	personalizedMessageTemplate: {},
	isUpsizingModalAlreadyShow: boolean,

	unavailableIngredients: string[],
	previousProductSize: number,

	baseUrls: AppSettingsImageURLInterface,
	twinProductCalories: {
		[key: number]: string
	}
}

export const adapter: EntityAdapter<ServerProductConfig> = createEntityAdapter<ServerProductConfig>({
	selectId: (productConfig: ServerProductConfig) => productConfig.seo_title,
	sortComparer: false
})

export const initialState: State = adapter.getInitialState({
	isLoading: true,
	isFetched: false,

	rootProductId: null,
	productKind: null,
	productSeoTitle: null,

	isCartProductCopiedToConfigurable: null,
	cartItemId: null,

	isEditMode: null,
	isVerticalModal: null,
	isProductConfigurationPristine: null,
	isProductUpdatedOnEditPage: null,

	configurableComboData: [],
	configurableItemData: null,

	viewProductInfo: {
		priceText: {},
		isSelected: false,
		calText: {}
	} as Product,
	viewProductsSlider: [] as ConfigurableProductsSliderInterface[],
	viewProductSizes: [] as SizePickerTabInterface[],
	viewProductConfiguration: [] as ConfigurationTabInterface[],
	viewProductSubConfiguration: [] as SubCategoryInterface[],
	viewProductOptions: [] as OptionTabsInterface[],
	viewCategories: [] as NewItemCategorieInterface[],

	viewComesWithProducts: null,

	selectedProductOptionId: null,
	selectedProductOptionSibling: null,
	selectedConfigurationId: null,
	selectedSubConfigurationId: null,

	personalizedMessageTemplate: null,
	isUpsizingModalAlreadyShow: false,

	unavailableIngredients: null,
	previousProductSize: null,

	baseUrls: null,
	twinProductCalories: null
});

/**
 * Configurator reducer
 */
// tslint:disable-next-line:cyclomatic-complexity
export function reducer(
	state = initialState,
	action
): State {
	switch (action.type) {

		// Clear ngrx when user changes the store
		case ConfiguratorActionsTypes.ReloadProductConfig: {
			return adapter.removeAll({
				...state,
				isLoading: true,
				isFetched: false,
				isSDKLoaded: false,
			})
		}
		// Start fetching product config
		case ConfiguratorActionsTypes.ConfigureComboProductInModal:
		case ConfiguratorActionsTypes.FetchProductConfig:
		case PizzaAssistantActionTypes.InitPizzaAssistant:
		case PizzaAssistantActionTypes.OpenPizzaAssistantProductInModal:
		case CatalogComboConfigListTypes.FetchComboConfigSuccess:
		case CartActionsTypes.UpdateComboToCartSuccess: {
			// We need to retain the categories for "add new"
			const viewCategories = state.viewCategories
			// Clean configurator state
			return {
				...state,
				...initialState,
				viewCategories,
				isProductConfigurationPristine: true
			}
		}

		/**
		 * Map product sub config from combo into single configurator view
		 * Used when the user customizing product sub product first time
		 */
		case ConfiguratorActionsTypes.CopyComboProductIntoConfigurable: {
			const comboServerConfig = action.comboServerConfig as ServerProductConfig;
			const productImageBaseUrl = action.productImageBaseUrl as AppSettingsImageURLInterface;
			const comboSubProductLineId = action.comboSubProductLineId as number;
			const currentAddToCartRequest = action.currentAddToCartRequest as AddCartServerRequestInterface;

			// Get configurable item by line id
			const singleProductConfig = comboServerConfig.data.products
				.find(product => product.line_id === comboSubProductLineId);

			// Get first config and sub config options as selected
			const {
				firstConfigurationId,
				firstSubConfigurationId
			} = ConfiguratorReducerHelper.getInitialConfigsAndSubConfigsSelection(singleProductConfig);

			// Get first sub config option
			let currentProductOptionId = ConfiguratorReducerHelper.getInitialProductOptionId(singleProductConfig);

			// Check if product is already in add to cart request
			const currentParent = currentAddToCartRequest.products.find(product => product.product_id === comboServerConfig.product_id)
			const currentProductInAddToCardRequest = currentParent.child_items.find(child => child.line_id === comboSubProductLineId);

			const addToLineIds = [];
			if (currentAddToCartRequest.products[0].child_items.length > 0) {
				currentAddToCartRequest.products[0].child_items.forEach(childFromATR => {
					addToLineIds.push(childFromATR.line_id)
				})
			}
			// changing size of another twin pizza even if it is not in cart
			if (
				singleProductConfig.product_options.options[0].grouped_products &&
				addToLineIds.indexOf(singleProductConfig.product_options.options[0].grouped_products.line_id) > -1) {
				const currentSiblingInCart = currentParent.child_items
					.find(child => child.line_id === singleProductConfig.product_options.options[0].grouped_products.line_id);
				const groupProductOption = singleProductConfig.product_options.options
					.find(option => option.grouped_products.product_option === currentSiblingInCart.product_option_id)
				console.log('FOUND SIBLIG!!!!!!!', currentSiblingInCart, groupProductOption)
				currentProductOptionId = groupProductOption.id;
			}

			if (currentProductInAddToCardRequest) {
				currentProductOptionId = currentProductInAddToCardRequest.product_option_id;
			}

			// Map server to view model
			const {
				viewProductInfo,
				viewProductSizes,
				viewProductConfiguration,
				viewProductSubConfiguration,
				viewProductOptions
			} = ConfiguratorReducerHelper.parseSingleProductConfig(
				comboServerConfig,
				currentProductOptionId,
				firstConfigurationId,
				firstSubConfigurationId,
				productImageBaseUrl,

				comboSubProductLineId,
				currentAddToCartRequest
			);

			const viewModal = {
				viewProductInfo,
				viewProductSizes,
				viewProductConfiguration,
				viewProductSubConfiguration,
				viewProductOptions
			}

			if (currentProductInAddToCardRequest) {
				// TODO - consider moving this to a mapper function
				const cartItem = currentProductInAddToCardRequest

				// map config options based on cart
				viewModal.viewProductOptions = viewModal.viewProductOptions.map(item => {
					const thisConfigOption = cartItem.config_options.find(option => option.config_code === item.id);
					if (thisConfigOption && thisConfigOption.sub_config_option) {
						item.optionDropDown.options.forEach(subOption => {
							subOption.isSelected = subOption.id === thisConfigOption.sub_config_option
						})
					}
					return {
						...item,
						selected: thisConfigOption ? true : false,
						halfHalfOption: thisConfigOption ? thisConfigOption.direction : item.halfHalfOption,
						quantity: thisConfigOption ? thisConfigOption.quantity : item.quantity
					}
				});

				// map product size based on cart
				viewModal.viewProductSizes = viewModal.viewProductSizes.map(size => {
					const isSelectedSize = cartItem.product_option_id === size.id;
					return {
						...size,
						isSelected: isSelectedSize
					}
				})

				// map product info based on cart
				const selectedOptons = ConfiguratorReducerHelper.updateViewProductIngredientsOverlays(viewModal.viewProductOptions);
				viewModal.viewProductInfo = {
					...viewProductInfo,
					quantity: cartItem.quantity,
					isSelected: true,
					subText: selectedOptons
				}
			}

			// Save info for twin product mapping
			const currentProductConfig = singleProductConfig;
			const selectedProductOptionSibling = ConfiguratorReducerHelper.parseProductOptionSibling(currentProductConfig, currentProductOptionId);

			// TODO think about it for slider
			const viewProductsSlider = [];
			const newState = {
				...state,
				...viewModal,
				isLoading: false,
				isFetched: true,
				isVerticalModal: true,
				isProductConfigurationPristine: true,

				rootProductId: comboServerConfig.product_id,
				productKind: comboServerConfig.kind,
				productSeoTitle: comboServerConfig.seo_title,
				comboSubProductLineId,

				configurableItemData: singleProductConfig,
				viewProductsSlider,

				// Set first options as selected ones
				selectedProductOptionId: currentProductOptionId,
				selectedConfigurationId: firstConfigurationId,
				selectedSubConfigurationId: firstSubConfigurationId,

				baseUrls: productImageBaseUrl,

				selectedProductOptionSibling
			}

			// In order to reset product toppings we need to store the default serverConfig in entity adapter
			return adapter.upsertOne(comboServerConfig, newState);
		}

		/**
		 * Map single product into view
		 */
		case ConfiguratorActionsTypes.FetchSingleProductSuccess:
		case ConfiguratorActionsTypes.FetchSingleConfigurableComboSuccess:
		case ConfiguratorActionsTypes.FetchTwinProductConfigSuccess: {
			const serverProductConfig = action.serverProductConfig as ServerProductConfig;
			const productImageBaseUrl = action.productImageBaseUrl as AppSettingsImageURLInterface;

			const productKind = serverProductConfig.kind;
			const productSeoTitle = serverProductConfig.seo_title;

			const singleProductConfig = serverProductConfig.data.products.sort(function (leftProduct, rightProduct) {
				return leftProduct.sequence - rightProduct.sequence;
			})[0];

			// Product slug is used as an key for config hashing
			const productSlug = serverProductConfig.seo_title;
			// Used for building add to cart request
			const rootProductId = serverProductConfig.product_id;
			// Get first config and sub config options as selected
			const {
				firstConfigurationId,
				firstSubConfigurationId
			} = ConfiguratorReducerHelper.getInitialConfigsAndSubConfigsSelection(singleProductConfig);

			// Get first sub config option
			const firstProductOptionId = ConfiguratorReducerHelper.getInitialProductOptionId(singleProductConfig);

			// Map server to view model
			const {
				viewProductInfo,
				viewProductSizes,
				viewProductConfiguration,
				viewProductSubConfiguration,
				viewProductOptions
			} = ConfiguratorReducerHelper.parseSingleProductConfig(
				serverProductConfig,
				firstProductOptionId,
				firstConfigurationId,
				firstSubConfigurationId,
				productImageBaseUrl
			);

			// Special handling for twin
			let currentTwinLineId = null;
			let currentTwinSliderIndex = null;
			if (action.type === ConfiguratorActionsTypes.FetchTwinProductConfigSuccess) {
				currentTwinLineId = singleProductConfig.line_id;
				currentTwinSliderIndex = 0;
			}

			// Special handling for single configurable item
			let viewComesWithProducts = null;
			if (serverProductConfig.kind === ProductKinds.single_configurable_combo) {
				viewComesWithProducts = ConfiguratorReducerHelper.parseComesWithProducts(serverProductConfig, productImageBaseUrl);
			}

			// Build image and product id array for top product slider based on kind
			const viewProductsSlider = ConfiguratorReducerHelper.parseViewProductsSlider(
				serverProductConfig,
				productImageBaseUrl,
				serverProductConfig.kind
			)

			// Update ingredients overlay and sub text
			const selectedOptons = ConfiguratorReducerHelper.updateViewProductIngredientsOverlays(viewProductOptions);
			viewProductInfo.subText = selectedOptons;

			// Save info for twin product mapping
			const currentProductConfig = singleProductConfig;
			const productSizeId = firstProductOptionId;
			const selectedProductOptionSibling = ConfiguratorReducerHelper.parseProductOptionSibling(currentProductConfig, productSizeId);

			const newState = {
				...state,
				isLoading: false,
				isFetched: true,
				isVerticalModal: false,
				isEditMode: false,

				isCardProductEditing: false,
				cartItemId: null,
				isProductConfigurationPristine: true,
				isProductUpdatedOnEditPage: false,

				rootProductId,
				productKind,
				productSeoTitle,
				currentTwinLineId,
				currentTwinSliderIndex,

				configurableItemData: singleProductConfig,

				viewProductInfo,
				viewProductSizes,
				viewProductConfiguration,
				viewProductSubConfiguration,
				viewProductOptions,
				viewProductsSlider,

				// Set first options as selected ones
				selectedProductOptionId: firstProductOptionId,
				selectedProductOptionSibling,
				selectedConfigurationId: firstConfigurationId,
				selectedSubConfigurationId: firstSubConfigurationId,

				// Only for comes single configurable products
				viewComesWithProducts,
				baseUrls: productImageBaseUrl
			}

			// Save raw server response to entity adapter and return state for config view-model
			return adapter.upsertOne(serverProductConfig, newState)
		}

		case ConfiguratorActionsTypes.PersonalMessageHasChanged:
		case ConfiguratorActionsTypes.ProductConfigurationChanged: {
			return {
				...state,
				isProductConfigurationPristine: false,
			}
		}

		case CartActionsTypes.UpdateConfigurableProductToCart: {
			return {
				...state,
				isProductConfigurationPristine: true,
				isProductUpdatedOnEditPage: true
			};
		}

		case CartActionsTypes.AddComboToCart:
		case CartActionsTypes.AddConfigurableProductToCart:
		case ConfiguratorActionsTypes.SetConfiguratorTouchedPristine: {
			return {
				...state,
				isProductConfigurationPristine: true,
				unavailableIngredients: null
			}
		}

		case CartActionsTypes.ClearAddToCartRequest: {
			return {
				...state,
				isCartProductCopiedToConfigurable: false,
			}
		}

		/**
		 * Following action are coping server cart to configurable
		 */
		case ConfiguratorActionsTypes.CopyServerCartToConfigurable: {
			const productKind = action.productKind;
			const cartProduct = action.cardProduct;
			let currentSibling;
			let currentTwin;
			let siblingTwin;
			// If build server request action has server card than this server edit action
			if (cartProduct && !state.isCartProductCopiedToConfigurable) {
				const cartItemId = cartProduct.cart_item_id;
				const viewProductInfo = state.viewProductInfo;
				viewProductInfo.quantity = cartProduct.quantity ? cartProduct.quantity : 1;
				viewProductInfo.isCartEditingProduct = true;
				viewProductInfo.priceText.priceValue = cartProduct.price;

				const currentViewProductOptions = state.viewProductOptions;
				let viewProductsSlider = state.viewProductsSlider;

				let currentCartProduct = cartProduct;
				if (productKind === ProductKinds.twin) {
					currentTwin = state.currentTwinLineId;
					currentCartProduct = cartProduct.child_items.find(child => child.line_id === currentTwin);
					siblingTwin = cartProduct.child_items.filter(child => child.line_id !== currentTwin);
					if (siblingTwin.length === 1) {
						currentSibling = {
							productLineId: siblingTwin[0].line_id,
							productOptionId: siblingTwin[0].product_option_id
						}
					} else {
						console.error('Current twin product has more than 2 child items inside!!! ')
					}
				}
				if (productKind === ProductKinds.single_configurable_combo) {
					currentCartProduct = cartProduct.child_items.find(child => child.line_id === viewProductInfo.lineId);
				}
				if (productKind === ProductKinds.combo) {
					console.log('test');
				}

				const productSizeId = currentCartProduct.product_option_id;
				const selectedConfigurationId = state.selectedConfigurationId;
				const selectedSubConfigurationId = state.selectedSubConfigurationId;
				// Show the product options that are available for the selected size in the cart
				let viewProductOptions = ConfiguratorReducerHelper.updateSizeProductOptions(
					currentViewProductOptions,
					productSizeId,
					selectedConfigurationId,
					selectedSubConfigurationId
				)

				viewProductOptions = ConfiguratorReducerHelper.updateProductOptionsBasedOnServerCard(
					currentViewProductOptions,
					currentCartProduct
				);

				const viewProductSizes = state.viewProductSizes.map(size => {
					return {
						...size,
						isSelected: currentCartProduct.product_option_id === size.id
					}
				})

				// Render top slider overlays
				if (productKind === ProductKinds.twin) {
					const stateViewSlider = state.viewProductsSlider;
					const configurableTwinLineId = state.currentTwinLineId;
					viewProductsSlider = ConfiguratorReducerHelper.updateViewProductSliderForTwin(
						stateViewSlider,
						viewProductOptions,
						configurableTwinLineId
					)
				}
				const selectedOptons = ConfiguratorReducerHelper.updateViewProductIngredientsOverlays(viewProductOptions);
				viewProductInfo.subText = selectedOptons

				return {
					...state,
					viewProductInfo,
					viewProductsSlider,
					viewProductOptions,
					viewProductSizes,
					isCartProductCopiedToConfigurable: true,
					isVerticalModal: false,
					isEditMode: cartProduct && cartProduct.cart_item_id ? true : false,
					selectedProductOptionId: currentCartProduct.product_option_id,
					selectedProductOptionSibling: currentSibling,
					cartItemId
				}
			} else {
				return state;
			}
		}

		case ConfiguratorActionsTypes.TwinProductSliderChange: {
			const newLineId = action.newSelectionProductLineId;
			const sliderIndex = action.sliderIndex;
			const productImageBaseUrl = state.baseUrls;

			const productSlug = state.productSeoTitle;
			const rawServerResponse = state.entities[productSlug];

			const currentTwinLineId = state.currentTwinLineId;
			const currentTwinSizeId = state.selectedProductOptionId;
			const currentTwinConfig = rawServerResponse.data.products.find(product => product.line_id === currentTwinLineId);
			const currentSizeOption = currentTwinConfig.product_options.options.find(option => option.id === currentTwinSizeId);

			const newTwinConfig = rawServerResponse.data.products.find(product => product.line_id === newLineId);
			const newConfigOptionByIndex = newTwinConfig.product_options.options.find(option => option.size_code === currentSizeOption.size_code);

			const {
				firstConfigurationId,
				firstSubConfigurationId
			} = ConfiguratorReducerHelper.getInitialConfigsAndSubConfigsSelection(newTwinConfig);
			const mappedNewToppings = ConfiguratorReducerHelper.parseViewProductConfigurationOptions(
				newTwinConfig,
				newConfigOptionByIndex.id,
				firstConfigurationId,
				firstSubConfigurationId,
				productImageBaseUrl,
			);
			const viewProductConfiguration = ConfiguratorReducerHelper.parseViewProductConfigurationTabs(
				newTwinConfig,
				newConfigOptionByIndex.id,
				firstConfigurationId
			);
			// Configuration tabs level 1
			const viewProductSubConfiguration = ConfiguratorReducerHelper.parseViewProductSubConfigurationTabs(
				newTwinConfig,
				firstConfigurationId,
				firstSubConfigurationId,
			);

			const selectedProductOptionSibling = ConfiguratorReducerHelper.parseProductOptionSibling(newTwinConfig, newConfigOptionByIndex.id);

			return {
				...state,
				currentTwinSliderIndex: sliderIndex,
				currentTwinLineId: newLineId,
				selectedProductOptionId: newConfigOptionByIndex.id,
				viewProductOptions: mappedNewToppings,
				viewProductConfiguration,
				viewProductSubConfiguration,
				selectedConfigurationId: firstConfigurationId,
				selectedSubConfigurationId: firstSubConfigurationId,
				selectedProductOptionSibling
			}
		}


		case CartActionsTypes.SetTwinAddToCartRequestToConfigurator: {
			const twinLineId = action.twinLineId;
			const currentProductOptions = state.viewProductOptions;
			const productAddToCartRequest = action.productAddToCartRequest;
			const viewProductInfo = state.viewProductInfo;

			// Update product options for tween
			const viewProductOptions = ConfiguratorReducerHelper
				.updateViewProductOptionOnTwinProductChange(currentProductOptions, productAddToCartRequest);

			// Update selected option
			const selectedOptions = ConfiguratorReducerHelper.updateViewProductIngredientsOverlays(viewProductOptions);
			viewProductInfo.subText = selectedOptions;

			// Update product size ids
			const fullServerConfig = state.entities[state.productSeoTitle];
			const configurableItemData = fullServerConfig.data.products.find(product => product.line_id === twinLineId);
			const productOptionId = state.selectedProductOptionId;
			const viewProductSizes = ConfiguratorReducerHelper.parseViewProductSizes(
				configurableItemData,
				productOptionId
			);
			// Update Topping Overlays
			const currentViewSlider = state.viewProductsSlider;
			const configurableTwinLineId = state.currentTwinLineId;

			const viewProductsSlider = ConfiguratorReducerHelper.updateViewProductSliderForTwin(
				currentViewSlider,
				viewProductOptions,
				configurableTwinLineId
			)
			// Update product title
			const currentOption = configurableItemData.product_options.options.find(options => options.id === productOptionId);
			viewProductInfo.name = currentOption.title;
			viewProductInfo.lineId = twinLineId

			return {
				...state,
				viewProductSizes,
				viewProductOptions,
				viewProductInfo,
				configurableItemData,
				viewProductsSlider
			}
		}

		// Config fetch failure
		case ConfiguratorActionsTypes.FetchProductConfigFailure: {
			return {
				...state,
				isLoading: false,
				isFetched: false,
			}
		}

		// Configurator change product size
		case ConfiguratorActionsTypes.ChangeProductSize: {
			const currenctSize = state.viewProductSizes.find(size => size.isSelected).id
			const productQuantity = state.viewProductInfo.quantity;


			// If product is kind than take current option id and product config from another field
			const productSizeId = action.productSizeId;
			let currentProductConfig = state.configurableItemData;

			if (state.productKind === ProductKinds.twin) {
				// productSizeId = state.selectedProductOptionId;
				const currentFullServerProduct = state.entities[state.productSeoTitle];
				const twinLineId = state.currentTwinLineId;
				currentProductConfig = currentFullServerProduct.data.products.find(product => product.line_id === twinLineId);
			}

			const viewProductSizes = ConfiguratorReducerHelper.updateViewProductSizes(
				state.viewProductSizes,
				productSizeId
			);

			const viewProductInfo = ConfiguratorReducerHelper.updateViewProductInfo(
				state.viewProductInfo,
				currentProductConfig,
				productSizeId,
				productQuantity,
				state.productKind,
				state.baseUrls
			);

			const viewProductConfiguration = ConfiguratorReducerHelper.updateViewProductConfigurationTab(
				productSizeId,
				state.viewProductConfiguration,
				state.selectedConfigurationId
			)

			// Check if selected config option is available for this size
			let selectedConfigurationId = state.selectedConfigurationId;
			let viewProductSubConfiguration = state.viewProductSubConfiguration;
			let selectedSubConfigurationId = state.selectedSubConfigurationId;
			const selectedAndNotAvailable = viewProductConfiguration
				.find(configuration =>
					configuration.id === state.selectedConfigurationId
					&& !configuration.isAvailableForProduct
				)
			// Select first available
			if (selectedAndNotAvailable) {
				// Configuration
				viewProductConfiguration.forEach(configuration => {
					if (configuration.isAvailableForProduct) {
						selectedConfigurationId = configuration.id;
						configuration.isSelected = true;
					} else {
						configuration.isSelected = false;
					}
				});

				// Sub configuration
				selectedSubConfigurationId = state.configurableItemData.configurations
					.find(configuration => configuration.id === selectedConfigurationId)
					.sub_configurations[0].id;
				viewProductSubConfiguration = ConfiguratorReducerHelper.parseViewProductSubConfigurationTabs(
					state.configurableItemData,
					selectedConfigurationId,
					selectedSubConfigurationId
				);
			}

			const viewProductOptions = ConfiguratorReducerHelper.updateSizeProductOptions(
				state.viewProductOptions,
				productSizeId,
				selectedConfigurationId,
				selectedSubConfigurationId
			)

			const selectedOptons = ConfiguratorReducerHelper.updateViewProductIngredientsOverlays(viewProductOptions);
			viewProductInfo.subText = selectedOptons;

			// Save info for twin product mapping
			const selectedProductOptionSibling = ConfiguratorReducerHelper.parseProductOptionSibling(currentProductConfig, productSizeId);

			return {
				...state,
				selectedConfigurationId,
				selectedProductOptionId: productSizeId,
				selectedProductOptionSibling,
				viewProductInfo,
				viewProductSizes,
				viewProductOptions,
				viewProductConfiguration,
				viewProductSubConfiguration,
				previousProductSize: currenctSize
			}
		}

		// Product configuration change
		case ConfiguratorActionsTypes.ChangeProductConfiguration: {
			const configurationId = action.configurationId;
			const selectedConfiguration = state.configurableItemData.configurations
				.find(configuration => configuration.id === configurationId);

			const selectedSubConfigurationIds = selectedConfiguration.sub_configurations
				.sort(function (leftProduct, rightProduct) {
					return leftProduct.sequence - rightProduct.sequence;
				}).map(subconfiguration => subconfiguration.id)
			const viewProductConfiguration = ConfiguratorReducerHelper.updateViewProductConfigurationTab(
				state.selectedProductOptionId,
				state.viewProductConfiguration,
				configurationId
			)

			const viewProductSubConfiguration = ConfiguratorReducerHelper.parseViewProductSubConfigurationTabs(
				state.configurableItemData,
				configurationId,
				selectedSubConfigurationIds[0]
			);

			const viewProductOptions = ConfiguratorReducerHelper.updateViewProductConfigurationOption(
				state.viewProductOptions,
				selectedSubConfigurationIds[0]
			);

			const selectedOptons = ConfiguratorReducerHelper.updateViewProductIngredientsOverlays(viewProductOptions);

			return {
				...state,
				selectedConfigurationId: configurationId,
				selectedSubConfigurationId: selectedSubConfigurationIds[0],
				viewProductConfiguration,
				viewProductSubConfiguration,
				viewProductOptions,
				viewProductInfo: {
					...state.viewProductInfo,
					subText: selectedOptons
				},
			}
		}

		// Product sub configuration change
		case ConfiguratorActionsTypes.ChangeProductSubConfiguration: {
			const subConfigurationId = action.subConfigurationId;
			const viewProductSubConfiguration = ConfiguratorReducerHelper.updateViewProductSubConfigurationTab(
				state.viewProductSubConfiguration,
				subConfigurationId
			);

			const viewProductOptions = ConfiguratorReducerHelper.updateViewProductConfigurationOption(
				state.viewProductOptions,
				subConfigurationId,
			);

			const selectedOptons = ConfiguratorReducerHelper.updateViewProductIngredientsOverlays(viewProductOptions);

			return {
				...state,
				selectedSubConfigurationId: subConfigurationId,
				viewProductSubConfiguration,
				viewProductOptions,
				viewProductInfo: {
					...state.viewProductInfo,
					subText: selectedOptons
				}
			}
		}

		// Product quantity plus
		case ConfiguratorActionsTypes.IncreaseConfigurableItemQuantity: {
			const productSizeId = state.selectedProductOptionId;
			let productQuantity = state.viewProductInfo.quantity;

			productQuantity++;

			const currentProductConfig = state.configurableItemData;

			const viewProductInfo = ConfiguratorReducerHelper.updateViewProductInfo(
				state.viewProductInfo,
				state.configurableItemData,
				productSizeId,
				productQuantity,
				state.productKind,
				state.baseUrls
			);

			return {
				...state,
				viewProductInfo,
			}
		}

		// Product quantity minus
		case ConfiguratorActionsTypes.DecreaseConfigurableItemQuantity: {
			const productSizeId = state.selectedProductOptionId;
			let productQuantity = state.viewProductInfo.quantity;
			productQuantity--;

			const viewProductInfo = ConfiguratorReducerHelper.updateViewProductInfo(
				state.viewProductInfo,
				state.configurableItemData,
				productSizeId,
				productQuantity,
				state.productKind,
				state.baseUrls
			);

			return ({
				...state,
				viewProductInfo,
			})
		}

		case ConfiguratorActionsTypes.OptionsSelectUnSelect: {
			const optionsId = action.optionId;
			const viewProductOptions = ConfiguratorReducerHelper.updateSelectedProductOptions(
				state.viewProductOptions,
				optionsId
			);

			// Update twins slider overlays
			const currentProductKing = state.productKind;
			if (currentProductKing === ProductKinds.twin) {
				const currentViewSlider = state.viewProductsSlider;
				const configurableTwinLineId = state.currentTwinLineId;

				const viewProductsSlider = ConfiguratorReducerHelper.updateViewProductSliderForTwin(
					currentViewSlider,
					viewProductOptions,
					configurableTwinLineId
				)
			}

			const selectedOptons = ConfiguratorReducerHelper.updateViewProductIngredientsOverlays(viewProductOptions);
			return {
				...state,
				viewProductOptions,
				viewProductInfo: {
					...state.viewProductInfo,
					subText: selectedOptons
				},
			}
		}

		// Reset all options in the selected tab to the default values
		case ConfiguratorActionsTypes.OptionsResetSelected: {
			const configurableProductSlug = state.productSeoTitle;
			const serverFullProductConfig = state.entities[configurableProductSlug];

			const currentProductKind = state.productKind;
			const productOptionId = state.selectedProductOptionId;
			const currentViewProductOptions = state.viewProductOptions;
			const subConfigCat = state.selectedSubConfigurationId; // returns all toppings and some of them with quntity since selected

			if (currentProductKind === ProductKinds.single || currentProductKind === ProductKinds.single_configurable_combo) {
				const currentProductConfig = serverFullProductConfig.data.products.find(product => product.allow_customization);
				const viewProductOptions = ConfiguratorReducerHelper.resetConfigsToDefaultForSingle(
					currentProductConfig,
					productOptionId,
					currentViewProductOptions,
					subConfigCat
				)

				const selectedOptonsSubTitle = ConfiguratorReducerHelper.updateViewProductIngredientsOverlays(viewProductOptions);
				return {
					...state,
					viewProductOptions,
					viewProductInfo: {
						...state.viewProductInfo,
						subText: selectedOptonsSubTitle
					},
				}
			} else if (currentProductKind === ProductKinds.twin) {
				const currentTwinId = state.currentTwinLineId;
				const currentProductConfig = serverFullProductConfig.data.products
					.find(product => product.line_id === currentTwinId);

				const viewProductOptions = ConfiguratorReducerHelper.resetConfigsToDefaultForSingle(
					currentProductConfig,
					productOptionId,
					currentViewProductOptions,
					subConfigCat
				)

				const selectedOptonsSubTitle = ConfiguratorReducerHelper.updateViewProductIngredientsOverlays(viewProductOptions);

				const stateViewSlider = state.viewProductsSlider;
				const viewProductsSlider = ConfiguratorReducerHelper.updateViewProductSliderForTwin(
					stateViewSlider,
					viewProductOptions,
					currentTwinId
				)

				return {
					...state,
					viewProductOptions,
					viewProductsSlider,
					viewProductInfo: {
						...state.viewProductInfo,
						subText: selectedOptonsSubTitle
					},
				}
			} else {
				// Combo product config options reset
				if (currentProductKind === ProductKinds.combo) {
					const currentComboProductOptionId = state.selectedProductOptionId;
					const currentComboProductLineId = state.comboSubProductLineId;

					const currentProductConfig = serverFullProductConfig.data.products
						.find(product => product.line_id === currentComboProductLineId);

					const viewProductOptions = ConfiguratorReducerHelper.resetConfigsToDefaultForSingle(
						currentProductConfig,
						currentComboProductOptionId,
						currentViewProductOptions,
						subConfigCat
					)
					const selectedOptonsSubTitle = ConfiguratorReducerHelper.updateViewProductIngredientsOverlays(viewProductOptions);
					return {
						...state,
						viewProductOptions,
						viewProductInfo: {
							...state.viewProductInfo,
							subText: selectedOptonsSubTitle
						}

					}
				}
				return state;
			}

		}

		case ConfiguratorActionsTypes.OptionsUpdateQuantity: {
			const optionId = action.optionId;
			const quantityChange = action.quantityChange;
			/**
			 * TODO take validation rules from SDK
			 */
			const viewProductOptions = ConfiguratorReducerHelper.updateQuantity(
				state.viewProductOptions,
				optionId,
				quantityChange
			)

			const selectedOptons = ConfiguratorReducerHelper.updateViewProductIngredientsOverlays(viewProductOptions);

			return {
				...state,
				viewProductOptions,
				viewProductInfo: {
					...state.viewProductInfo,
					subText: selectedOptons
				},
			}
		}

		case ConfiguratorActionsTypes.OptionsSetHalfHalf: {
			const optionId = action.optionId;
			const direction = action.direction;


			const viewProductOptions = ConfiguratorReducerHelper.updateHalfHalf(
				state.viewProductOptions,
				optionId,
				direction
			)

			// Update twins slider overlays
			let viewProductsSlider = state.viewProductsSlider;
			const currentProductKing = state.productKind;
			if (currentProductKing === ProductKinds.twin) {
				const stateViewSlider = state.viewProductsSlider;
				const configurableTwinLineId = state.currentTwinLineId;

				viewProductsSlider = ConfiguratorReducerHelper.updateViewProductSliderForTwin(
					stateViewSlider,
					viewProductOptions,
					configurableTwinLineId
				)
			}

			const selectedOptons = ConfiguratorReducerHelper.updateViewProductIngredientsOverlays(viewProductOptions);

			return {
				...state,
				viewProductsSlider,
				viewProductInfo: {
					...state.viewProductInfo,
					subText: selectedOptons
				},
			}
		}

		case ConfiguratorActionsTypes.OptionsUpdateDropDown: {
			const optionId = action.optionId;
			const selectedValue = action.selectedValue;

			const viewProductOptions = ConfiguratorReducerHelper.updateOptionsDropDown(
				state.viewProductOptions,
				optionId,
				selectedValue
			)
			let viewProductsSlider = state.viewProductsSlider;
			const currentProductKing = state.productKind;
			if (currentProductKing === ProductKinds.twin) {
				const stateViewSlider = state.viewProductsSlider;
				const configurableTwinLineId = state.currentTwinLineId;

				viewProductsSlider = ConfiguratorReducerHelper.updateViewProductSliderForTwin(
					stateViewSlider,
					viewProductOptions,
					configurableTwinLineId
				)
			}

			const selectedOptons = ConfiguratorReducerHelper.updateViewProductIngredientsOverlays(viewProductOptions);
			return {
				...state,
				viewProductOptions,
				viewProductsSlider,
				viewProductInfo: {
					...state.viewProductInfo,
					subText: selectedOptons
				},
			}
		}

		// viewCategories
		case CatalogCategoriesTypes.FetchCategoriesSuccess: {
			const serverCategories = action.categoriesArr;
			const viewCategories = ConfiguratorReducerHelper.parseViewNewItemCategories(serverCategories);

			return {
				...state,
				viewCategories,
			}
		}

		case SDKActionTypes.LoadSDKAfterConfigSuccess: {
			const currentPrice = state.viewProductInfo.priceText;
			const currentCal = state.viewProductInfo.calText;
			let viewInfo = state.viewProductInfo;

			viewInfo = {
				...viewInfo,
				priceText: currentPrice ? currentPrice : { priceValue: 0, labels: '' },
				calText: currentCal ? currentCal : { calScale: '', calValue: '' }
			}

			return {
				...state,
				viewProductInfo: viewInfo,
			}
		}

		case SDKActionTypes.SaveSdkProductInfo: {
			const sdkResponse = action.sdkResponse as SdkResponse;
			const viewProductInfo = state.viewProductInfo;
			const viewProductOptions = state.viewProductOptions;
			const isUpsizingModalAlreadyShow = state.isUpsizingModalAlreadyShow;
			let unavailableIngredients = state.unavailableIngredients;
			let twinProductCalories = state.twinProductCalories;

			const lineId = viewProductInfo.lineId

			if (sdkResponse && sdkResponse.errorCode === 0) {
				if (!sdkResponse.unavailableIngredients) {
					viewProductInfo.priceText.priceValue = sdkResponse ? sdkResponse.productPrice : viewProductInfo.priceText.priceValue;
					viewProductInfo.calText.calValue = sdkResponse ? sdkResponse.productCalories : viewProductInfo.calText.calValue;
					viewProductInfo.isValid = sdkResponse ? sdkResponse.validation.isConfigValid : null;
					viewProductInfo.validationMsg = sdkResponse.validation.validationMsg;
					twinProductCalories = sdkResponse ? sdkResponse.twinProductCalories : twinProductCalories;

					// if we are in a combo product
					if (sdkResponse.validation.children && lineId) {
						const isChildValid = sdkResponse.validation.children[lineId];
						viewProductInfo.isValid = isChildValid ? isChildValid.isConfigValid : null;
						viewProductInfo.validationMsg = isChildValid ? isChildValid.validationMsg : null;
						viewProductInfo.upSizing = isChildValid && !isUpsizingModalAlreadyShow ? isChildValid.upSizing : null
						if (isChildValid && isChildValid.configurations) {
							viewProductOptions.forEach(productOption => {
								const validationForSubConfig = isChildValid.configurations[productOption.parentId];
								productOption.isMaxQuantityReached = validationForSubConfig ?
									validationForSubConfig.isMaximumAmountReached : productOption.isMaxQuantityReached;
							});
						}
					} else {
						viewProductInfo.upSizing = !isUpsizingModalAlreadyShow ? sdkResponse.upSizing : null
					}
					if (sdkResponse.validation.configurations) {
						viewProductOptions.forEach(productOption => {
							const validationForSubConfig = sdkResponse.validation.configurations[productOption.parentId];
							productOption.isMaxQuantityReached = validationForSubConfig ?
								validationForSubConfig.isMaximumAmountReached : productOption.isMaxQuantityReached;
						});
					}

				}
				unavailableIngredients = sdkResponse.unavailableIngredients
			}
			return {
				...state,
				viewProductInfo,
				viewProductOptions,
				unavailableIngredients,
				twinProductCalories
			}
		}

		case ConfiguratorActionsTypes.RemoveUnavailableToppings: {
			const selectedProductOptionId = state.selectedProductOptionId;
			const productSlug = state.productSeoTitle;
			const serverProductsData = state.entities[productSlug].data;
			const viewProductOptions = state.viewProductOptions;
			const unavailableIngredients = state.unavailableIngredients;

			const currentLineId = state.viewProductInfo.lineId;
			const defaultOptionsSelected = [];

			const currentProductServerData = serverProductsData.products
				.find(serverFullProductData => serverFullProductData.line_id === currentLineId);

			// save dict of all default options
			currentProductServerData.configuration_options.forEach(option => {
				const proOptServerDataSelected = option.product_options_data
					.find(productOption => productOption.product_option_id === selectedProductOptionId && productOption.selected);
				if (proOptServerDataSelected) {
					defaultOptionsSelected.push(option);
				}
			})

			const updateOptions = viewProductOptions.map(option => {
				const isInvalid = unavailableIngredients.indexOf(option.id) > -1
				return {
					...option,
					selected: isInvalid ? false : option.selected
				}
			});
			// TODO: try to clean up using utils-functions.ts
			currentProductServerData.configurations.forEach(config => {
				config.sub_configurations.forEach(subConfig => {
					const defaultOption = defaultOptionsSelected.find(option => option.parent_id === subConfig.id)
					// make sure there is a default option and check if there are no options selected
					const isCurrentSubConfigEmpty = updateOptions.filter(updatedOption =>
						updatedOption.parentId === subConfig.id && updatedOption.selected
					).length < 1 && defaultOption;
					// Select default only if selectedSubConfig requires a selection and there are no config options selected
					if (!subConfig.allow_multiple_options && isCurrentSubConfigEmpty) {
						const defaultOptionId = defaultOption.id
						updateOptions.filter(option => option.parentId === subConfig.id).forEach(option => {
							option.selected = option.id === defaultOptionId ? true : option.selected
						})
					}
				})
			})


			return {
				...state,
				viewProductOptions: updateOptions,
			}
		}

		case ConfiguratorActionsTypes.SetUpsizeModalFlag: {
			return {
				...state,
				isUpsizingModalAlreadyShow: action.isUpsizeFlagDefined
			}
		}

		default: {
			return state;
		}

		case ConfiguratorActionsTypes.RevertToPreviousSize: {
			return {
				...state,
				unavailableIngredients: null
			}
		}
	}
}

export const getIsConfigurableItemLoading = (state: State) => {
	return state.isLoading && !state.isFetched
}

export const getIsConfigurableItemError = (state: State) => {
	return !state.isLoading && !state.isFetched;
}

export const getIsFetchSuccess = (state: State) => {
	return !state.isLoading
}

export const getTwinSliderChange = (state: State) => {
	return state.currentTwinSliderIndex
}

export const getConfigurableProductInfo = (state: State) => {
	const isTwin = state.productKind === ProductKinds.twin;
	const twinLineId = state.currentTwinLineId;
	if (isTwin && state.twinProductCalories && state.viewProductInfo.calText) {
		state.viewProductInfo.calText.calValue = state.twinProductCalories[twinLineId];
	}
	return state.viewProductInfo;
}

export const getConfigurableProductOptions = (state: State) => {
	return state.viewProductSizes;
}

export const getConfigurableProductConfigurationTabs = (state: State) => {
	return state.viewProductConfiguration;
}

export const getConfigurableProductSubConfigurationTabs = (state: State) => {
	return state.viewProductSubConfiguration;
}

export const getConfigurableProductConfigurationOptions = (state: State) => {
	return state.viewProductOptions;
}

export const getConfigurableProductProductSlider = (state: State) => {
	return state.viewProductsSlider;
}

export const getExtraProducts = (state: State) => {
	return state.viewComesWithProducts;
}

export const getIsConfigurationPristine = (state: State) => {
	return state.isProductConfigurationPristine;
}
// tslint:disable-next-line:max-file-line-count
