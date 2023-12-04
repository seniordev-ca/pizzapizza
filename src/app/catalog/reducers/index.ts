import {
	createSelector,
	createFeatureSelector,
} from '@ngrx/store';

/**
 * Import all reducers
 */
import * as fromFeaturedProducts from './featured-products';
import * as fromCategories from './category';
import * as fromJustForYou from './just-for-you';
import * as fromProductList from './product-list';
import * as fromConfigurator from './configurator';
import * as fromComboConfig from './combo-config';
import * as fromTemplateConfig from './personalized-templates';
import * as fromMyPizzas from './my-pizzas';
import * as fromPizzaAssistant from './pizza-assistant';

// Import selectors from another module
import { getCartLoading } from '../../checkout/reducers';

import { addToCartBtnEnum } from '../models/configurator';
import { ProductListMapperHelper } from './mappers/product-list';
import { ProductSubHeaderInterface } from '../components/common/product-sub-header/product-sub-header.component';
import { selectAppSetting } from 'app/common/reducers';
import { Product } from '../models/product';
/**
 * Global state imported into root-reducer. No lazy loading
 */
export interface CatalogState {
	configurableItem: fromConfigurator.State,
	featuredProducts: fromFeaturedProducts.State,
	categories: fromCategories.State,
	justForYou: fromJustForYou.State
	productList: fromProductList.State,
	comboConfig: fromComboConfig.State,
	personalTemplates: fromTemplateConfig.State,
	myPizzas: fromMyPizzas.State,
	pizzaAssistant: fromPizzaAssistant.State
}

/**
 * Combined catalog reducer for importing to root reducer
 */
export function catalogCombinedReducers(
	state: CatalogState = {} as CatalogState,
	action
) {
	return {
		configurableItem: fromConfigurator.reducer(state.configurableItem, action),
		featuredProducts: fromFeaturedProducts.reducer(state.featuredProducts, action),
		categories: fromCategories.reducer(state.categories, action),
		justForYou: fromJustForYou.reducer(state.justForYou, action),
		productList: fromProductList.reducer(state.productList, action),
		comboConfig: fromComboConfig.reducer(state.comboConfig, action),
		personalTemplates: fromTemplateConfig.reducer(state.personalTemplates, action),
		myPizzas: fromMyPizzas.reducer(state.myPizzas, action),
		pizzaAssistant: fromPizzaAssistant.reducer(state.pizzaAssistant, action)
	}
}

// Define combined reducer selector
export const selectCatalogState = createFeatureSelector<CatalogState>('catalog');

/**
 * Configurable item selectors
 */
export const selectConfigurableProducts = createSelector(
	selectCatalogState,
	(state: CatalogState) => state.configurableItem
)

export const getConfigurableLoading = createSelector(
	selectConfigurableProducts,
	fromConfigurator.getIsConfigurableItemLoading
)

export const getConfigurableError = createSelector(
	selectConfigurableProducts,
	fromConfigurator.getIsConfigurableItemError
)

export const getTwinSliderChange = createSelector(
	selectConfigurableProducts,
	fromConfigurator.getTwinSliderChange
)

export const getConfigurableProductInfo = createSelector(
	selectConfigurableProducts,
	fromConfigurator.getConfigurableProductInfo
)

export const getConfigurableProductOptions = createSelector(
	selectConfigurableProducts,
	fromConfigurator.getConfigurableProductOptions
)

export const getConfigurableProductConfigurationTabs = createSelector(
	selectConfigurableProducts,
	fromConfigurator.getConfigurableProductConfigurationTabs
)

export const getConfigurableProductSubConfigurationTabs = createSelector(
	selectConfigurableProducts,
	fromConfigurator.getConfigurableProductSubConfigurationTabs
)

export const getConfigurableProductConfigurationOptions = createSelector(
	selectConfigurableProducts,
	fromConfigurator.getConfigurableProductConfigurationOptions
)

export const getConfigurableProductProductSlider = createSelector(
	selectConfigurableProducts,
	fromConfigurator.getConfigurableProductProductSlider
)

export const getSelectedConfigurationId = createSelector(
	selectCatalogState,
	(state) => state.configurableItem.selectedConfigurationId
)

export const getSelectedSubConfigurationId = createSelector(
	selectCatalogState,
	(state) => state.configurableItem.selectedSubConfigurationId
)

export const getNewItemCategories = createSelector(
	selectCatalogState,
	(state) => state.configurableItem.viewCategories
)

export const getComboConfigItems = createSelector(
	selectCatalogState,
	(state) => state.configurableItem.configurableComboData
)

export const getExtraProducts = createSelector(
	selectCatalogState,
	(state) => state.configurableItem.viewComesWithProducts
)

export const getIsConfigurationPristine = createSelector(
	selectCatalogState,
	(state) => state.configurableItem.isProductConfigurationPristine
)

export const getValidationForSingleProduct = createSelector(
	selectCatalogState,
	(state) => {
		const msg = state.configurableItem.viewProductInfo.validationMsg;
		const isValid = state.configurableItem.viewProductInfo.isValid;
		const upSizing = state.configurableItem.viewProductInfo.upSizing
		return {
			msg,
			isValid,
			upSizing
		}
	}
)
export const getIsProductValid = createSelector(
	selectCatalogState,
	(state) => state.configurableItem.viewProductInfo.isValid
)

export const getConfigLegend = createSelector(
	selectCatalogState,
	(state) => {
		const legendFlags = {
			isPremium: false,
			isGluten: false,
			isDipOnWings: false,
			isMediumOnly: false,
			isSmallOnly: false
		}
		const configOptions = state.configurableItem.viewProductOptions;

		for (const key in legendFlags) {
			if (legendFlags.hasOwnProperty(key)) {
				legendFlags[key] = configOptions.find(option => option[key]) ? true : false;
			}
		}
		return legendFlags;
	}
)

export const getMaxQtyForSameTopping = createSelector(
	selectCatalogState,
	(state) => {
		const selectedProductOption = state.configurableItem.viewProductSizes ?
			state.configurableItem.viewProductSizes.find(option => option.isSelected) : null
		return selectedProductOption ? selectedProductOption.maxToppingQuantity : null
	}
)

/**
 * Controlling all possible states for add to cart button
 * TODO combo update button
 */
export const getConfigBtnState = createSelector(
	selectCatalogState,
	getCartLoading,
	getTwinSliderChange,
	(catalogState, cartLoadingLoadingState, sliderIndex) => {
		const isVerticalMode = catalogState.configurableItem.isVerticalModal;
		const isEditMode = catalogState.configurableItem.isEditMode;
		const isProductConfigurationPristine = catalogState.configurableItem.isProductConfigurationPristine;
		const isProductUpdatedOnEditPage = catalogState.configurableItem.isProductUpdatedOnEditPage;
		const isTwin = catalogState.configurableItem.viewProductInfo.isTwinProduct;
		const isUserOnFirstTwin = sliderIndex < 1;
		const isConfigurationValid = catalogState.configurableItem.viewProductInfo.isValid;

		let addToCardButtonState = addToCartBtnEnum.notActive;

		// If cart is loading
		if (cartLoadingLoadingState) {
			return addToCartBtnEnum.loading;
		}

		if (!isVerticalMode) {
			// Single products and twin
			if (!isEditMode) {
				// Add page
				addToCardButtonState = addToCartBtnEnum.active;
			} else {
				// Edit page
				if (isProductUpdatedOnEditPage && isProductConfigurationPristine) {
					return addToCartBtnEnum.updateSuccess;
				}
				addToCardButtonState = isProductConfigurationPristine ? addToCartBtnEnum.added : addToCartBtnEnum.update;
				if (!isConfigurationValid) {
					addToCardButtonState = addToCartBtnEnum.notActive
				}
			}
			if (isTwin && isUserOnFirstTwin) {
				addToCardButtonState = addToCartBtnEnum.nextTwin;
			}
		} else {
			// Combo sub products
			if (!isEditMode) {
				// Add page
				addToCardButtonState = addToCartBtnEnum.nextComboProduct;
			} else {
				// Edit page
				addToCardButtonState = addToCartBtnEnum.update;
			}
		}

		return addToCardButtonState;
	}

)
export const getIsEditMode = createSelector(
	selectCatalogState,
	(state: CatalogState) => state.configurableItem.isEditMode
)

export const getIsComboEditMode = createSelector(
	selectCatalogState,
	(state: CatalogState) => state.comboConfig.isEditMode
)

export const getIsComboPristine = createSelector(
	selectCatalogState,
	(state: CatalogState) => state.comboConfig.isComboPristine
)

/**
 * Selectors for featuredProduct
 */
export const selectFeaturedProducts = createSelector(
	selectCatalogState,
	(state: CatalogState) => state.featuredProducts,
)

export const getFeaturedLoading = createSelector(
	selectFeaturedProducts,
	fromFeaturedProducts.getIsFeaturedLoading
)

export const getFeaturedError = createSelector(
	selectFeaturedProducts,
	fromFeaturedProducts.getIsFeaturedError
)

export const selectFeaturedProductsEntities = createSelector(
	selectFeaturedProducts,
	(featuredProducts) => featuredProducts.entities
)

export const getFeaturedProductsIds = createSelector(
	selectFeaturedProducts,
	fromFeaturedProducts.getIds
)

export const getFeaturedProducts = createSelector(
	selectFeaturedProducts,
	(featuredProducts) => featuredProducts.featuredProducts
)

export const getFeaturedProductsCategory = createSelector(
	selectFeaturedProductsEntities,
	getFeaturedProductsIds,
	(entities, featuredProductIds) => {
		let category;

		category = featuredProductIds.length > 0 ? entities[featuredProductIds[0]].category : null;

		return category;
	}
)



/**
 * Selector for Categories
 */
export const selectCategories = createSelector(
	selectCatalogState,
	(state: CatalogState) => state.categories
)

export const getCategoriesLoading = createSelector(
	selectCategories,
	fromCategories.getIsCategoriesLoading
)

export const getCategoriesError = createSelector(
	selectCategories,
	fromCategories.getIsCategoriesError
)

export const selectCategoriesEntities = createSelector(
	selectCategories,
	(categories) => categories.entities
)

export const getCategoriesIds = createSelector(
	selectCategories,
	fromCategories.getIds
)

export const getCategories = createSelector(
	selectCategoriesEntities,
	getCategoriesIds,
	(entities, ids) => {
		return ids.map(id => entities[id]);
	}
)
export const selectParentCategory = createSelector(
	selectCatalogState,
	(catalogState) => catalogState.categories.selectedParent
)
export const getProductChildren = createSelector(
	selectCatalogState,
	(catalogState) => catalogState.categories.subCategories
)
export const getSelectedChild = createSelector(
	selectCatalogState,
	(catalogState) => catalogState.categories.selectedId
)


/**
 * Selector for Just for you
 */
export const selectJustForYouState = createSelector(
	selectCatalogState,
	(state: CatalogState) => state.justForYou
)

export const getJustForYouLoading = createSelector(
	selectJustForYouState,
	fromJustForYou.getIsJustForYouLoading
)

export const getJustForYouError = createSelector(
	selectJustForYouState,
	fromJustForYou.getIsJustForYouError
)

export const selectJustForYouEntities = createSelector(
	selectJustForYouState,
	(justForYou) => justForYou.entities
)

export const getJustForYouIds = createSelector(
	selectJustForYouState,
	fromJustForYou.getIds
)

export const justForYouList = createSelector(
	selectJustForYouState,
	(justForYou) => justForYou.justForYouProducts
)

let cachedJFYProducts: Product[] = [] as Product[];
export const justForYouProductList = createSelector(
	selectJustForYouState,
	(justForYou) => {
		cachedJFYProducts = justForYou.selectedProductList
		const cartRequestProducts = justForYou.selectedProductsCartRequest;
		cachedJFYProducts.forEach(product => {
			const productInCartRequest = cartRequestProducts.find(cart => cart.product_id === product.id)
			product.isSelected = productInCartRequest ? true : false;
			product.quantity = productInCartRequest ? productInCartRequest.quantity : 1
		})

		return cachedJFYProducts;
	}
)
export const justForYouProductCategory = createSelector(
	selectJustForYouState,
	(justForYou) => {
		// shallow copy
		const details = JSON.parse(JSON.stringify(justForYou.selectedHeaderMeta));
		const selectedProducts = justForYou.selectedProductsCartRequest;
		const allProducts = justForYou.selectedProductList

		if (details && selectedProducts) {
			let price = 0;
			const description = [];
			const productIds = selectedProducts.map(product => product.product_id)
			allProducts.map(product => {
				if (productIds.indexOf(product.id) > -1) {
					const inCartProduct = selectedProducts.find(cartProduct => cartProduct.product_id === product.id)
					price = price + (product.priceText.priceValue * inCartProduct.quantity);
					const productDescription = inCartProduct.quantity > 1 ? product.name + ' (X' + inCartProduct.quantity + ')' : product.name
					description.push(productDescription)
				}
			})

			details.price = price
			details.isValid = selectedProducts.length > 0;
			details.itemConfigText = selectedProducts.length;
			details.description = description.join(', ')
		}
		details.btnState = !details.isValid ? addToCartBtnEnum.notActive : addToCartBtnEnum.active
		details.btnState = details.isSelected ? addToCartBtnEnum.loading : details.btnState

		return details
	}
)

export const getjustForYouCategory = createSelector(
	selectCatalogState,
	(state: CatalogState) => state.justForYou.justForYouHeaderMeta
)

/**
 * Selector for Product List
 */
export const selectProductList = createSelector(
	selectCatalogState,
	(state: CatalogState) => state.productList
)

export const getProductListLoading = createSelector(
	selectProductList,
	fromProductList.getIsProductListLoading
)

export const getProductListError = createSelector(
	selectProductList,
	fromProductList.getIsProductListError
)

export const selectProductListEntities = createSelector(
	selectProductList,
	(productList) => productList.entities
)

export const getProductListIds = createSelector(
	selectProductList,
	fromProductList.getIds
)

export const getProductList = createSelector(
	selectProductList,
	(productList) => {
		return productList.selectedProductList
	}
)

/**
 * Selector for Combo Config
 */
export const selectComboConfig = createSelector(
	selectCatalogState,
	(state: CatalogState) => state.comboConfig
)

export const getComboConfigLoading = createSelector(
	selectComboConfig,
	fromComboConfig.getIsComboConfigLoading
)

export const getComboConfigError = createSelector(
	selectComboConfig,
	fromComboConfig.getIsComboConfigError
)

export const getActivePersonalizationTemplate = createSelector(
	selectCatalogState,
	(state: CatalogState) => state.personalTemplates.activeTemplate
)

export const getPersonalMessage = createSelector(
	selectCatalogState,
	(state: CatalogState) => state.personalTemplates.activePersonalizedForm
)

export const getPersonalTemplateAvailable = createSelector(
	selectCatalogState,
	(state: CatalogState) => {

		const isTemplateLoaded = state.personalTemplates.activeTemplate ? true : false;
		const isModalAlreadyShown = state.personalTemplates.isModalAlreadyShown;

		const configWithTemplate = state.configurableItem.configurableItemData ? state.configurableItem.configurableItemData.configurations
			.filter(config => config.sub_configurations.find(sub => sub.personalized_message.display_personalized_message))
			.find(config => config.sub_configurations.find(sub => sub.personalized_message.display_personalized_message) ? true : false) : null

		const configIds = configWithTemplate ? {
			configId: configWithTemplate.id,
			subConfigId: configWithTemplate.sub_configurations.find(sub => sub.personalized_message.display_personalized_message).id
		} : null

		return !isTemplateLoaded && !isModalAlreadyShown ? configIds : null
	}
)

export const getUnavailableToppings = createSelector(
	selectCatalogState,
	(state: CatalogState) => {
		const ids = state.configurableItem.unavailableIngredients;
		const arrayOfToppingNames = ids ? state.configurableItem.viewProductOptions
			.filter(option => ids.indexOf(option.id) > -1).map(option => option.name) : null
		return arrayOfToppingNames
	}
)

export const getMyPizzasList = createSelector(
	selectCatalogState,
	(state: CatalogState) => state.myPizzas.selectedProductList
)
export const getMyPizzasLoading = createSelector(
	selectCatalogState,
	(state: CatalogState) => state.myPizzas.isLoading && !state.myPizzas.isFetched
)
export const getMyPizzasError = createSelector(
	selectCatalogState,
	(state: CatalogState) => !state.myPizzas.isLoading && !state.myPizzas.isFetched
)

export const getMyPizzaCategory = createSelector(
	selectCatalogState,
	(state: CatalogState) => state.myPizzas.myPizzaCategory
)

export const getPizzaAssistantMessage = createSelector(
	selectCatalogState,
	(state: CatalogState) => state.pizzaAssistant.assistantMessage
)

export const getPizzaAssistantProducts = createSelector(
	selectCatalogState,
	selectAppSetting,
	(state: CatalogState, settings) => {
		const ids = state.pizzaAssistant.ids;
		const serverProducts = [];
		ids.forEach(id => {
			serverProducts.push(state.pizzaAssistant.entities[id])
		})
		let products = [];
		if (ids && ids.length > 0) {
			const baseUrls = settings.data.web_links.image_urls;
			products = ProductListMapperHelper.buildProductListFromAssistant(serverProducts, baseUrls);
		}

		return products;
	}
)

export const getPizzaAssistantOrderDetails = createSelector(
	selectCatalogState,
	(state: CatalogState) => {
		const ids = state.pizzaAssistant.ids;
		const serverProducts = [];
		ids.forEach(id => {
			serverProducts.push(state.pizzaAssistant.entities[id])
		})
		let price = 0;
		let text = '';
		if (ids && ids.length > 0) {
			serverProducts.forEach(product => {
				price = price + (product.price_text.price_value * product.cart_request.quantity)
			})
			text = serverProducts.map(product => {
				const productCache = product.config_cache.data.products.find(activeProduct => activeProduct.line_id === 1);
				const selectedOption = product.cart_request.product_option_id;
				const title = product.name && selectedOption ?
					productCache.product_options.options.find(option => option.id === selectedOption).title :
					productCache.name;

				const quantity = product.cart_request.quantity ? product.cart_request.quantity + ' ' : '';
				return quantity + title;
			}).join(', ')
		}
		return {
			itemDescription: text,
			itemPrice: price
		} as ProductSubHeaderInterface
	}
)

export const getIsPizzaAssistantLoading = createSelector(
	selectCatalogState,
	(state: CatalogState) => state.pizzaAssistant.isLoading && !state.pizzaAssistant.isFetched
)

export const getPizzaAssistantHelpConfigLoaded = createSelector(
	selectCatalogState,
	(state: CatalogState) => state.pizzaAssistant.isHelpConfigFetched && !state.pizzaAssistant.isHelpConfigError
)
export const getPizzaAssistantHelpConfig = createSelector(
	selectCatalogState,
	(state: CatalogState) => state.pizzaAssistant.helpConfigData.help
)
// Selector for Pizza assistant
export const getPizzaAssistantProductValidation = createSelector(
	selectCatalogState,
	(state: CatalogState) => {
		const isCurrentProductValid = state.configurableItem.viewProductInfo.isValid ? state.configurableItem.viewProductInfo.isValid : false;
		return isCurrentProductValid
	}
)

export const getPizzaAssistantCombo = createSelector(
	selectCatalogState,
	(state: CatalogState) => state.pizzaAssistant.comboProduct
)

export const isDoneButtonValid = createSelector(
	selectCatalogState,
	(state: CatalogState) => {
		const pizzaAssistantIds = state.pizzaAssistant.ids;
		let isBtnValid = false;
		const configurationRequiredArray = [];
		if (pizzaAssistantIds.length === 0) {
			isBtnValid = false
		} else {
			const paEntities = state.pizzaAssistant.entities;
			pizzaAssistantIds.forEach(entId => {
				if (paEntities[entId].is_config_required) {
					configurationRequiredArray.push(paEntities[entId].is_config_required)
				}
			})
			if (configurationRequiredArray.length === 0) {
				isBtnValid = true;
			} else {
				isBtnValid = false;
			}
		}
		return isBtnValid;
	}
)
