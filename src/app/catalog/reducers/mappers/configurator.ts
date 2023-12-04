
// Server Models
import {
	ServerProductConfig,
	ServerProductConfigProduct,
	ProductKinds,
	ProductOptionSizeCodes
} from '../../models/server-product-config';
import { ServerCategoriesInterface } from '../../models/server-category';
// View Models
import { SizePickerTabInterface } from '../../components/common/product-size-picker/product-size-picker.component';
import { ConfigurationTabInterface } from '../../components/configurator/product-configuration-tabs/product-configuration-tabs.component';
import { SubCategoryInterface } from '../../components/common/sub-category-selector/sub-category-selector.component';
import { Product } from '../../models/product';
import {
	OptionTabsInterface,
	OptionTabModeEnum,
	HalfHalfOptionsEnum
} from '../../models/configurator';
// Server Models
import { AddCartServerRequestInterface } from '../../../checkout/models/server-cart-request';
import {
	AddCartProductServerRequestInterface
} from '../../../checkout/models/server-cart-request';
import { ConfigurableProductsSliderInterface } from '../../components/configurator/header/header.component';
import { NewItemCategorieInterface } from '../../components/configurator/add-item-modal/add-item-modal.component';
import { AppSettingsImageURLInterface } from '../../../common/models/server-app-settings';
import { ServerCartResponseProductListInterface } from '../../../checkout/models/server-cart-response';

export interface SingleConfigViewModel {
	viewProductInfo: Product,
	viewProductSizes: SizePickerTabInterface[],
	viewProductConfiguration: ConfigurationTabInterface[],
	viewProductSubConfiguration: SubCategoryInterface[],
	viewProductOptions: OptionTabsInterface[]
}

/**
 * The role of this class is to map server response to view model
 */
export class ConfiguratorReducerHelper {

	/**
	 * Map product server response and user selection into view model
	 */
	static parseSingleProductConfig(
		serverFullConfig: ServerProductConfig,
		productOptionId: number,
		selectedConfigurationId: string,
		selectedSubConfigurationId: string,
		productBaseUrls: AppSettingsImageURLInterface,

		comboSubProductLineId?: number,
		currentAddToCartRequest?: AddCartServerRequestInterface
	): SingleConfigViewModel {

		let serverProductConfig = {} as ServerProductConfigProduct;
		// For single product get first product
		if (serverFullConfig.kind === ProductKinds.single || serverFullConfig.kind === ProductKinds.twin) {
			serverProductConfig = serverFullConfig.data.products.sort(function (leftProduct, rightProduct) {
				return leftProduct.sequence - rightProduct.sequence;
			})[0] as ServerProductConfigProduct;
		}

		// For combo product get product by line id
		if (serverFullConfig.kind === ProductKinds.combo) {
			serverProductConfig = serverFullConfig.data.products.find(product => product.line_id === comboSubProductLineId);
		}

		// For single configurable item get product by allow_customization flag
		if (serverFullConfig.kind === ProductKinds.single_configurable_combo) {
			serverProductConfig = serverFullConfig.data.products.find(product => product.allow_customization === true);
		}

		if (Object.keys(serverProductConfig).length === 0) {
			console.error('CRITICAL | no product data available');
		}

		// Get product option id from add to card request for editing product under the combo
		let currentChildProductAddToCardRequest = null;
		if (currentAddToCartRequest) {
			currentChildProductAddToCardRequest = currentAddToCartRequest.products[0].child_items
				.find(childItem => childItem.line_id === comboSubProductLineId);
			if (currentChildProductAddToCardRequest) {
				productOptionId = currentChildProductAddToCardRequest.product_option_id;
			}
		}

		// Product image, description, basic price
		const viewProductInfo = ConfiguratorReducerHelper.parseViewProductInfo(
			serverFullConfig,
			serverProductConfig,
			productOptionId,
			productBaseUrls,
			// currentChildProductAddToCardRequest
		);

		// Product sizes
		const viewProductSizes = ConfiguratorReducerHelper.parseViewProductSizes(
			serverProductConfig,
			productOptionId
		);

		// Configuration tabs level 0
		const viewProductConfiguration = ConfiguratorReducerHelper.parseViewProductConfigurationTabs(
			serverProductConfig,
			productOptionId,
			selectedConfigurationId
		);

		// Configuration tabs level 1
		const viewProductSubConfiguration = ConfiguratorReducerHelper.parseViewProductSubConfigurationTabs(
			serverProductConfig,
			selectedConfigurationId,
			selectedSubConfigurationId
		);

		// Build product config options
		const viewProductOptions = ConfiguratorReducerHelper.parseViewProductConfigurationOptions(
			serverProductConfig,
			productOptionId,
			selectedConfigurationId,
			selectedSubConfigurationId,
			productBaseUrls
		);

		// Build sub text from product option
		viewProductInfo.subText = ConfiguratorReducerHelper.updateViewProductIngredientsOverlays(viewProductOptions);

		return {
			viewProductInfo,
			viewProductSizes,
			viewProductConfiguration,
			viewProductSubConfiguration,
			viewProductOptions
		} as SingleConfigViewModel
	};

	/**
	 * Getting initial config and sub config id for product
	 */
	static getInitialConfigsAndSubConfigsSelection(
		serverProductConfig: ServerProductConfigProduct,
	) {
		// Order config options
		const sortedConfigurations = serverProductConfig.configurations.sort(function (leftProduct, rightProduct) {
			return leftProduct.sequence - rightProduct.sequence;
		})
		const sortedFirstSubConfigurations = sortedConfigurations[0].sub_configurations.sort(function (leftProduct, rightProduct) {
			return leftProduct.sequence - rightProduct.sequence;
		});
		// Preselect first options as selected one
		const firstConfigurationId = sortedConfigurations[0].id;
		const firstSubConfigurationId = sortedFirstSubConfigurations[0].id;

		return {
			firstConfigurationId,
			firstSubConfigurationId
		}
	}

	/**
	 * Get initial product id for product
	 */
	static getInitialProductOptionId(
		serverProductConfig: ServerProductConfigProduct,
	) {
		const firstProductOption = serverProductConfig.product_options.options
			.find(option => option.selected);

		let firstProductOptionId = null;
		if (!firstProductOption) {
			console.warn(`CRITICAL | product option is not selected for product`);
			console.warn(serverProductConfig.product_options.options);
			firstProductOptionId = serverProductConfig.product_options.options[0].id;
		} else {
			firstProductOptionId = firstProductOption.id;
		}

		return firstProductOptionId;
	}

	/**
	 * Used only for 'comes with products'
	 */
	static parseComesWithProducts(
		serverFullConfig: ServerProductConfig,
		baseUrl: AppSettingsImageURLInterface
	): Product[] {
		const comesWithProducts = [] as Product[];

		const notCustomizableProducts = serverFullConfig.data.products
			.filter(product => product.allow_customization === false);

		notCustomizableProducts.forEach(notCustomizableProduct => {
			const productOption = notCustomizableProduct.product_options.options[0];
			comesWithProducts.push({
				id: productOption.id.toString(),
				name: notCustomizableProduct.name,
				image: baseUrl.product + '2x/' + notCustomizableProduct.image,
				description: notCustomizableProduct.name,
				// calText: {
				// 	calValue: '',
				// 	calScale: ''
				// }
			} as Product);
		});

		return comesWithProducts;
	}

	/**
	 * Maps product basic info
	 */
	static parseViewProductInfo(
		serverFullConfig: ServerProductConfig,
		serverProductConfig: ServerProductConfigProduct,
		forProductOptionId: number,
		baseUrl: AppSettingsImageURLInterface,
		lineId?: number
		// currentChildProductAddToCardRequest: AddCartProductServerRequestInterface
	): Product {

		let selectedProduct = serverProductConfig.product_options.options
			.find(productOption => productOption.id === forProductOptionId);
		if (!selectedProduct) {
			selectedProduct = serverProductConfig.product_options.options
				.find(productOption => productOption.selected);
		}

		const productImageBaseUrl = baseUrl.product;

		const image = serverProductConfig.is_pizza && serverFullConfig.kind !== ProductKinds.single_configurable_combo
			? baseUrl.base_pizza : productImageBaseUrl + '2x/' + selectedProduct.image;

		let productName = serverFullConfig.kind === ProductKinds.single_configurable_combo ? selectedProduct.title : serverProductConfig.name;

		if (serverFullConfig.kind === ProductKinds.twin) {
			const firstTwin = serverFullConfig.data.products.sort(function (leftProduct, rightProduct) {
				return leftProduct.sequence - rightProduct.sequence;
			})[0];
			const selectedTwin = lineId ? serverFullConfig.data.products.find(product => product.line_id === lineId) : firstTwin
			const selectedOptions = selectedTwin.product_options.options.find(option => option.id === forProductOptionId);
			productName = selectedOptions.title;
		}

		let isQuantitySelectionAllowed = serverProductConfig.is_quantity_selector_allowed;
		// let isQuantitySelectionAllowed = !(serverProductConfig.configurations.length <= 1
		// 	&& serverProductConfig.product_options.options.length <= 1 && serverFullConfig.kind === ProductKinds.single);

		// Assuming that product under combo can't have quantity selector
		if (serverFullConfig.kind === ProductKinds.combo) {
			isQuantitySelectionAllowed = false;
		}

		const isPizza = serverProductConfig.is_pizza && serverFullConfig.kind !== ProductKinds.single_configurable_combo;
		const priceValue = selectedProduct ? selectedProduct.base_price : null;
		const calValue = selectedProduct.cal_count ? selectedProduct.cal_count.toString() : null;
		const isTwinProduct = serverFullConfig.kind === ProductKinds.twin;
		const isCoupon = serverFullConfig.is_coupon_item;

		return {
			id: serverFullConfig.product_id,
			name: productName,
			image,
			description: serverProductConfig.description,
			calText: selectedProduct ? {
				calValue,
				calScale: selectedProduct.cal_scale
			} : null,
			quantity: 1,
			priceText: {
				labels: null,
				priceValue
			},
			isQuantitySelectionAllowed,
			isPizza,
			isTwinProduct,
			isCoupon,
			isCartEditingProduct: false, // Will be update by action if required
			lineId: serverProductConfig.line_id
		} as Product;
	}

	/**
	 * Update product basic info
	 */
	static updateViewProductInfo(
		product: Product,
		serverProductConfig: ServerProductConfigProduct,
		selectedProductOptionId: number,
		quantity: number,
		kind: ProductKinds,
		baseUrl: AppSettingsImageURLInterface
	): Product {
		const selectedProduct = serverProductConfig.product_options.options
			.find(productOption => productOption.id === selectedProductOptionId);

		const productImageBaseUrl = kind === ProductKinds.single
			|| kind === ProductKinds.single_configurable_combo ? baseUrl.product : baseUrl.combo;
		const image = serverProductConfig.is_pizza && kind !== ProductKinds.single_configurable_combo
			? baseUrl.base_pizza : productImageBaseUrl + '2x/' + selectedProduct.image;

		product.quantity = quantity;

		product.priceText.priceValue = selectedProduct.base_price * quantity;
		product.calText = {
			calValue: selectedProduct.cal_count ? selectedProduct.cal_count.toString() : null,
			calScale: selectedProduct.cal_scale
		}
		product.name = selectedProduct.title;
		product.image = image;

		// console.log(selectedProduct, product)
		return product;
	}

	/**
	 * Maps server config into product size view model
	 */
	static parseViewProductSizes(
		serverProductConfig: ServerProductConfigProduct,
		selectedOptionId: number
	): SizePickerTabInterface[] {
		return serverProductConfig.product_options.options.sort(function (leftProduct, rightProduct) {
			return leftProduct.sequence - rightProduct.sequence;
		}).map(productOption => {
			return {
				id: productOption.id,
				title: productOption.size_name ? productOption.size_name : productOption.title,
				subTitle: productOption.size_label ? productOption.size_label : null,
				fontKey: productOption.font_key,
				isSelected: productOption.id === selectedOptionId,
				maxToppingQuantity: productOption.same_topping_limit
			} as SizePickerTabInterface;
		})
	}

	/**
	 * Maps data required for siblings logic
	 */
	static parseProductOptionSibling(
		serverConfigurableProduct: ServerProductConfigProduct,
		selectedProductSizeId: number
	) {
		const selectedServerProductOption = serverConfigurableProduct.product_options.options
			.find(productOption => productOption.id === selectedProductSizeId)
		let selectedProductOptionSibling = null;
		if (selectedServerProductOption && selectedServerProductOption.grouped_products) {
			selectedProductOptionSibling = {
				productLineId: selectedServerProductOption.grouped_products.line_id,
				productOptionId: selectedServerProductOption.grouped_products.product_option
			}
		}

		return selectedProductOptionSibling;
	}

	/**
	 * Update selected state for product size view model
	 */
	static updateViewProductSizes(
		viewProductSizes: SizePickerTabInterface[],
		selectedId: number
	): SizePickerTabInterface[] {
		viewProductSizes.forEach(productSize =>
			productSize.isSelected = productSize.id === selectedId
		)
		return viewProductSizes;
	}

	/**
	 * Maps data for product config slider
	 */
	static parseViewProductsSlider(
		serverFullProductConfig: ServerProductConfig,
		baseUrl: AppSettingsImageURLInterface,
		kind: ProductKinds
	): ConfigurableProductsSliderInterface[] {
		// const currentProduct = serverProductConfig;
		let productSlider = [];

		// Build top slider image for single, single configurable or combo
		if (kind !== ProductKinds.twin) {
			const serverProductConfig = serverFullProductConfig.data.products.sort(function (leftProduct, rightProduct) {
				return leftProduct.sequence - rightProduct.sequence;
			})[0];

			const productImageBaseUrl = kind === ProductKinds.single
				|| kind === ProductKinds.single_configurable_combo ? baseUrl.product : baseUrl.combo;

			const productImageFullUrl = serverProductConfig.is_pizza && kind !== ProductKinds.single_configurable_combo
				? baseUrl.base_pizza : productImageBaseUrl + '2x/' + serverProductConfig.image;

			const productSlide = {
				productId: serverProductConfig.product_id,
				productImageUrl: productImageFullUrl
			};

			productSlider = [productSlide];
		} else {
			// Build slider for twin
			const twinProducts = serverFullProductConfig.data.products.sort(function (leftProduct, rightProduct) {
				return leftProduct.sequence - rightProduct.sequence;
			});
			twinProducts.forEach(twinProduct => {
				const productImageFullUrl = baseUrl.base_pizza;
				const productSlide = {
					productId: twinProduct.product_id,
					productImageUrl: productImageFullUrl,
					productLineId: twinProduct.line_id
				};

				productSlider.push(productSlide);
			});
		}

		return productSlider;
	}

	/**
	 * Update product slider overlay for twin product
	 */
	static updateViewProductSliderForTwin(
		currentViewSlider: ConfigurableProductsSliderInterface[],
		currentProductOptions: OptionTabsInterface[],
		configurableTwinLineId: number
	): ConfigurableProductsSliderInterface[] {

		const productOverlays = ConfiguratorReducerHelper.updateViewProductIngredientsOverlays(currentProductOptions);
		const currentSlide = currentViewSlider.find(slide => slide.productLineId === configurableTwinLineId);

		currentSlide.ingredients = productOverlays.map(productOverlay => {
			return {
				image: productOverlay.image,
				id: productOverlay.id,
				zIndex: productOverlay.zIndex
			}
		});

		return currentViewSlider;
	}

	/**
	 * Update product options when pizza changes in slider
	 */
	static updateViewProductOptionOnTwinProductChange(
		currentProductOptions: OptionTabsInterface[],
		productAddToCartRequest: AddCartProductServerRequestInterface
	): OptionTabsInterface[] {

		let currentProductConfigOptions = [];

		if (productAddToCartRequest) {
			currentProductConfigOptions = productAddToCartRequest.config_options;
		}

		currentProductOptions.forEach(productOption => {
			const optionInList = currentProductConfigOptions.find(option => option.config_code === productOption.id);
			const quantity = optionInList ? optionInList.quantity : 0;
			productOption.halfHalfOption = optionInList ? optionInList.direction : HalfHalfOptionsEnum.center
			productOption.selected = optionInList ? true : false;
			productOption.quantity = quantity;
			if (optionInList && optionInList.sub_config_option) {
				console.log(optionInList);
				productOption.optionDropDown.options.forEach(subOption => {
					subOption.isSelected = subOption.id === optionInList.sub_config_option
				})
			}
		})
		return currentProductOptions;
	}

	/**
	 * Maps server config into product config tabs
	 */
	static parseViewProductConfigurationTabs(
		serverProductConfig: ServerProductConfigProduct,
		selectedOptionId: number,
		selectedConfigurationId: string
	): ConfigurationTabInterface[] {
		return serverProductConfig.configurations.map(configuration => {
			const isAvailableForProduct = configuration.not_available.indexOf(selectedOptionId) === -1;

			return {
				id: configuration.id,
				fontKey: configuration.font_key,
				tabText: configuration.title,
				isSelected: configuration.id === selectedConfigurationId,
				isAvailableForProduct,
				notAvailableForSize: configuration.not_available
			} as ConfigurationTabInterface
		})
	}

	/**
	 * Update selected state for product configuration
	 */
	static updateViewProductConfigurationTab(
		selectedOptionId: number,
		configurationTabs: ConfigurationTabInterface[],
		selectedConfigurationId: string
	): ConfigurationTabInterface[] {
		configurationTabs.forEach(configuration => {
			const isAvailableForProduct = configuration.notAvailableForSize.indexOf(selectedOptionId) === -1;

			configuration.isSelected = configuration.id === selectedConfigurationId
			configuration.isAvailableForProduct = isAvailableForProduct;
		});
		return configurationTabs;
	}

	/**
	 * Maps server sub config into product config tabs
	 */
	static parseViewProductSubConfigurationTabs(
		serverProductConfig: ServerProductConfigProduct,
		selectedConfigurationId: string,
		selectedSubConfigurationId: string
	): SubCategoryInterface[] {
		return serverProductConfig.configurations
			.find(configuration => configuration.id === selectedConfigurationId)
			.sub_configurations.sort(function (leftProduct, rightProduct) {
				return leftProduct.sequence - rightProduct.sequence;
			})
			.map(subConfiguration => {
				const personalSettings = subConfiguration.personalized_message;
				return {
					id: subConfiguration.id,
					title: subConfiguration.title,
					isSelected: subConfiguration.id === selectedSubConfigurationId,
					personalizedTemplate: personalSettings.display_personalized_message ? personalSettings.personalized_template_id : null
				} as SubCategoryInterface;
			})
	}

	/**
	 * Updates selected sub category
	 */
	static updateViewProductSubConfigurationTab(
		configurationSubTabs: SubCategoryInterface[],
		selectedSubConfigurationId: string)
		: SubCategoryInterface[] {
		configurationSubTabs.forEach(configuration =>
			configuration.isSelected = configuration.id === selectedSubConfigurationId
		);
		return configurationSubTabs;
	}

	/**
	 * Maps product options into view model
	 */
	static parseViewProductConfigurationOptions(
		serverProductConfig: ServerProductConfigProduct,
		optionId: number,
		configurationId: string,
		subConfigurationId: string,
		baseUrl: AppSettingsImageURLInterface,
	): OptionTabsInterface[] {
		const configurationOptions = serverProductConfig.configuration_options;
		const configurations = serverProductConfig.configurations;

		// Build hash map for dropdown
		const optionDropDownHash = {};
		const subConfigurationOptions = serverProductConfig.sub_configuration_options;
		subConfigurationOptions.forEach(subConfigurationOption => {
			optionDropDownHash[subConfigurationOption.sub_configuration_id] = {
				id: subConfigurationOption.sub_configuration_id,
				options: subConfigurationOption.options
			}
		})

		const productOptionNames = serverProductConfig.product_options.options.map(option => {
			return {
				title: option.size_name,
				code: option.size_code,
				id: option.id
			}
		})

		const orderedOptions = [];
		configurations.map(config => {
			return config.sub_configurations.map(subconfig => {
				return configurationOptions.filter(option => option.parent_id === subconfig.id)
					.map(productOption => {
						// Find current cal text
						const selectedProductOption = productOption.product_options_data
							.find((productOptionData) => productOptionData.product_option_id === optionId)

						const configSequence = selectedProductOption ? selectedProductOption.sequence : productOption.sequence;
						const itemSquence = (productOption.sequence * 1) + (subconfig.sequence * 100) + (configSequence * 1000)
						// const itemSquence = productOption.sequence;
						// Check is option is available for product
						const isAvailableForProduct = productOption.not_available.indexOf(optionId) === -1;
						let calText = null;
						if (isAvailableForProduct && selectedProductOption) {
							calText = selectedProductOption.cal_count;
						}

						let isSmallOnly = false;
						let isMediumOnly = false;

						if (productOption.product_options_data.length === 1) {
							const onlyProductOption = productOption.product_options_data[0];
							const matchedProductOption = productOptionNames.find(productOptionName =>
								productOptionName.id === onlyProductOption.product_option_id
							);
							isSmallOnly = productOptionNames.length > 1 && matchedProductOption.code === ProductOptionSizeCodes.small;
							isMediumOnly = productOptionNames.length > 1 && matchedProductOption.code === ProductOptionSizeCodes.medium;
						}

						// Get option mode (Has half/half option)
						const configMode = {
							hasHalfHalf: subconfig.allow_half_and_half,
							hasMultiSelect: subconfig.allow_multiple_options
						}
						const halfHalfOption = HalfHalfOptionsEnum.center;
						const hasMultiConfig = configMode.hasMultiSelect;
						let optionMode = OptionTabModeEnum.notConfigurable;

						// Get drop down options
						let optionDropDown = null;
						const dropDownOptions = optionDropDownHash[productOption.parent_id];
						if (dropDownOptions) {
							optionMode = OptionTabModeEnum.dropDown;
							optionDropDown = {};
							optionDropDown.id = dropDownOptions.id;
							optionDropDown.options = dropDownOptions.options.map(dropDownOption => {
								return {
									id: dropDownOption.product_code,
									fontKey: dropDownOption.font_key,
									title: dropDownOption.title,
									isSelected: dropDownOption.selected,
									sequence: itemSquence
								}
							})
						} else if (hasMultiConfig) {
							optionMode = OptionTabModeEnum.incrementor;
						}
						const overlayImage = productOption.parent_id !== 'basecheese' ? baseUrl.toppings_overlay + '2x/' + productOption.id : null;

						const option = {
							id: productOption.id,
							parentId: productOption.parent_id,
							name: productOption.title,
							productImage: baseUrl.toppings + '2x/' + productOption.image,
							ingredientsOverlayImage: overlayImage,
							calText,
							tag: '', // TODO what is that
							allowHalfAndHalf: configMode.hasHalfHalf,
							halfHalfOption,
							optionMode,
							// some product configs do not provide selected product options but do have config options that come with predefined quantity
							selected: selectedProductOption ? selectedProductOption.selected : false,
							quantity: productOption.quantity, // Only for OptionTabModeEnum.Incrementor

							allowMultiSelect: hasMultiConfig,
							isVisible: productOption.parent_id === subConfigurationId,
							isAvailableForProduct,

							optionDropDown,
							serverCopy: {
								not_available: productOption.not_available,
								product_options_data: productOption.product_options_data
							},
							sequence: itemSquence,
							isPremium: productOption.is_premium,
							isDipOnWings: productOption.is_dip_on_wings,
							isGluten: productOption.is_gluten,
							isSmallOnly,
							isMediumOnly,
							zIndex: productOption.overlay_sequence
						} as OptionTabsInterface;

						orderedOptions.push(option)
					});
			})
		})

		return orderedOptions.sort(function (leftProduct, rightProduct) {
			return leftProduct.sequence - rightProduct.sequence;
		});
	}

	/**
	 * Update product config on size change
	 */
	static updateSizeProductOptions(
		optionList: OptionTabsInterface[],
		productSizeId: number,
		configurationId: string,
		subConfigurationId: string
	): OptionTabsInterface[] {

		optionList.forEach(option => {
			// Get cal text for options
			let calText = '';
			const calObj = option.serverCopy.product_options_data
				.find(productOption => productOption.product_option_id === productSizeId);
			if (calObj && calObj.cal_count) {
				calText = calObj.cal_count.toString();
			}

			option.calText = calText;
			option.isVisible = option.parentId === subConfigurationId;
			option.isAvailableForProduct = option.serverCopy.not_available.indexOf(productSizeId) === -1;
		});

		return optionList;
	}

	/**
	 * Update selection for options list
	 */
	static updateSelectedProductOptions(
		optionList: OptionTabsInterface[],
		optionProductId: string
	): OptionTabsInterface[] {
		const selectedOption = optionList.find(option => option.id === optionProductId);
		// Check if only one selection is allowed in that tab and unselect all if so
		if (!selectedOption.allowMultiSelect && !selectedOption.selected) {
			const allOptionsUnderTab = optionList
				.filter(option => option.parentId === selectedOption.parentId)
			allOptionsUnderTab.forEach(allOption => allOption.selected = false);

			selectedOption.selected = !selectedOption.selected;
		}

		if (selectedOption.allowMultiSelect) {
			selectedOption.selected = !selectedOption.selected;
		}
		if (selectedOption.optionMode === OptionTabModeEnum.incrementor && selectedOption.selected) {
			selectedOption.quantity++
		} else {
			selectedOption.quantity = 0;
		}
		optionList.forEach(optionItem => {
			if (!optionItem.selected) {
				optionItem.halfHalfOption = HalfHalfOptionsEnum.center;
			}
		})
		return optionList;
	}

	/**
	 * Reset product config options to default selection from the server
	 */
	static resetConfigsToDefaultForSingle(
		serverProductConfig: ServerProductConfigProduct,
		productOptionId: number,
		currentViewProductOptions: OptionTabsInterface[],
		subConfigId: string
	): OptionTabsInterface[] {

		const productConfigRawDict = {};
		// Creating dict [optionId]: {optionConfig}
		serverProductConfig.configuration_options.forEach(productOption => {
			productConfigRawDict[productOption.id] = productOption;
		});

		// Update option config based on raw server response
		currentViewProductOptions.forEach(productOption => {

			let defaultDropDownId = null;
			try {
				if (productOption.optionDropDown) {
					const subConfigOptions = serverProductConfig.sub_configuration_options
						.find(configOption => configOption.sub_configuration_id === subConfigId).options;
					const defaultDropDownValue = subConfigOptions.find(subConfigOption => subConfigOption.selected === true);
					defaultDropDownId = defaultDropDownValue.product_code;
				}
			} catch (e) {
				console.error(`CRITICAL | can't find default value for option dropdown ${e.toString()}`);
			}

			// Reset to default for only selected sub config
			if (productOption.parentId === subConfigId) {
				const serverOptions = productConfigRawDict[productOption.id];

				// Select default value for dropdown
				if (defaultDropDownId) {
					productOption.optionDropDown.options
						.forEach(option => {
							option.isSelected = option.id === defaultDropDownId
						})
				}

				// Update selection state quantity, halfHalf
				const serverOptionForCurrentOption = serverOptions ? serverOptions.product_options_data
					.find(serverProductOption => serverProductOption.product_option_id === productOptionId) : null;
				if (serverOptionForCurrentOption) {
					productOption.selected = serverOptionForCurrentOption.selected;
					productOption.halfHalfOption = HalfHalfOptionsEnum.center;
					productOption.quantity = serverOptionForCurrentOption.selected ? 1 : 0;
				}

			}
		})

		return currentViewProductOptions;
	}

	/**
	 * Add to cart request to config options
	 */
	static updateProductOptionsBasedOnServerCard(
		currentViewProductOptions: OptionTabsInterface[],
		currentProductCart: ServerCartResponseProductListInterface,
	): OptionTabsInterface[] {

		if (currentProductCart) {
			currentViewProductOptions.forEach(productOption => {
				const isAddedToCart = currentProductCart.config_options.find(option => option.config_code === productOption.id);
				productOption.selected = isAddedToCart ? true : false;
				productOption.quantity = isAddedToCart ? isAddedToCart.quantity : productOption.quantity;
				productOption.halfHalfOption = isAddedToCart ? isAddedToCart.direction : productOption.halfHalfOption;

				if (isAddedToCart && isAddedToCart.subconfig_option && productOption.optionDropDown) {
					productOption.optionDropDown.options.forEach(subOption => {
						subOption.isSelected = subOption.id === isAddedToCart.subconfig_option.config_code
					})
				}
			});
		}

		return currentViewProductOptions;
	}

	/**
	 * Change option quantity
	 */
	static updateQuantity(
		optionList: OptionTabsInterface[],
		optionId,
		quantityChange
	): OptionTabsInterface[] {
		const selectedOption = optionList.find(option => option.id === optionId);
		// quantityChange could be negative number
		if (selectedOption.quantity + quantityChange >= 1) {
			selectedOption.quantity += quantityChange;
		}
		return optionList;
	}

	/**
	 * Change half half mode
	 */
	static updateHalfHalf(
		optionList: OptionTabsInterface[],
		optionId,
		direction
	): OptionTabsInterface[] {
		const selectedOption = optionList.find(option => option.id === optionId);
		selectedOption.halfHalfOption = direction;
		return optionList;
	}

	/**
	 * Change drop down selection
	 */
	static updateOptionsDropDown(
		optionList: OptionTabsInterface[],
		optionId,
		selectedValue
	): OptionTabsInterface[] {
		const selectedOption = optionList.find(option => option.id === optionId);

		selectedOption.optionDropDown.options.forEach(dropDownOption => {
			dropDownOption.isSelected = dropDownOption.id === selectedValue
		});

		return optionList;
	}

	/**
	 * Updates product options
	 */
	static updateViewProductConfigurationOption(
		configurationOptions: OptionTabsInterface[],
		subConfigurationId: string,
	): OptionTabsInterface[] {

		configurationOptions.forEach(productOption => {
			productOption.isVisible = productOption.parentId === subConfigurationId;
		});

		return configurationOptions;
	}

	/**
	 * Parse categories for new item mini modal
	 */
	static parseViewNewItemCategories(
		serverCategories: ServerCategoriesInterface[]
	): NewItemCategorieInterface[] {
		const result = [] as NewItemCategorieInterface[];

		const parentCategories = serverCategories
			.filter(categorie => categorie.parent_id === 0);

		// For each parent
		parentCategories.forEach(parentCategorie => {
			const categorie = {} as NewItemCategorieInterface;
			categorie.groupName = parentCategorie.name;
			categorie.groupMenu = [];

			// Find children and parse
			serverCategories
				.filter(subCategorie => subCategorie.parent_id === parentCategorie.id)
				.forEach(subCategorie => {
					categorie.groupMenu.push({
						id: subCategorie.id,
						title: subCategorie.name,
						setTitle: subCategorie.seo_title,
					})
				})

			result.push(categorie);
		})

		return result;
	}

	/**
	 * Mapper for dynamic product subtext
	 */
	static updateViewProductIngredientsOverlays(viewProductOptions: OptionTabsInterface[]) {
		const selectedOptions = viewProductOptions
			.filter(option => option.selected && option.isAvailableForProduct);

		const selectedViewOptions = selectedOptions.sort(function (leftProduct, rightProduct) {
			return leftProduct.sequence - rightProduct.sequence;
		}).map(option => {
			let overlayImage = null;
			let configOptionInfo;
			if (option.ingredientsOverlayImage) {
				overlayImage = option.halfHalfOption === HalfHalfOptionsEnum.center ? option.ingredientsOverlayImage + '.png'
					: option.ingredientsOverlayImage + '-' + option.halfHalfOption + '.png';
			}
			let subConfigOption = null;
			if (option.optionDropDown) {
				const selectedSubconfig = option.optionDropDown.options.find(subOption => subOption.isSelected);
				subConfigOption = selectedSubconfig.id !== 'NONE' ? selectedSubconfig.title : null;
			}

			configOptionInfo = {
				text: option.name,
				additionalInfo: subConfigOption,
				direction: option.halfHalfOption,
				isDipOnWings: option.isDipOnWings,
				isGluten: option.isGluten,
				isPremium: option.isPremium,
				quantity: option.quantity,
				image: overlayImage,
				id: option.id,
				zIndex: option.zIndex,

			}
			return configOptionInfo
		});
		return selectedViewOptions
	}

}
