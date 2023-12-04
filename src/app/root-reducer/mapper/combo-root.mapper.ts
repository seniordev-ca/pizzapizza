// Catalog, add to cart request, SDK validation
import { ServerProductConfig } from '../../catalog/models/server-product-config';
import { AddCartServerRequestInterface } from '../../checkout/models/server-cart-request';
import { SdkResponse } from '../../catalog/models/server-sdk';

// Server and View product and base image URL interface
import { Product } from '../../catalog/models/product';
import { AppSettingsImageURLInterface } from '../../common/models/server-app-settings';
import { ServerProductConfigProduct } from '../../catalog/models/server-product-config';

// Combo groups
import {
	ComboConfigGroup,
	ComboConfigDetails
} from '../../catalog/models/combo-config';
import { addToCartBtnEnum } from '../../catalog/models/configurator';


export class ComboRootMapper {

	/**
	 * TODO
	 * 1. Private mapper for flat product
	 *
	 * Maps server product to view product
	 */
	private static _parseProductUnderComboGroup(
		productUnderGroup: ServerProductConfigProduct[],
		flatBaseUrl: string,
		productBaseUrl: string,
		sdkValidation: SdkResponse,
		comboAddToCartRequest: AddCartServerRequestInterface,
		allowMultiple: boolean,
		isGroupMaxed: boolean,
		isProductForceSelected: boolean
	): Product[] {

		const configProductIds = comboAddToCartRequest ? comboAddToCartRequest.products[0].child_items.map(item => item.line_id) : [];
		const productValidationDict = sdkValidation && sdkValidation.validation ? sdkValidation.validation.children : [];
		const productList: Product[] = [];
		productUnderGroup.forEach(serverProduct => {
			const productLineId = serverProduct.line_id;
			// Take validation from SDK
			const currentProductValidation = productValidationDict[productLineId];
			if (!currentProductValidation) {
				console.error(`CRITICAL | no validation for product line id:${productLineId}`);
				console.warn(serverProduct);
			}
			const subText = currentProductValidation ? currentProductValidation.validationMsg : '';

			const isSelected = currentProductValidation ?
				currentProductValidation.isConfigValid && configProductIds.indexOf(serverProduct.line_id) > -1 : false;

			// Determine if the product's siblings are in the cart. This is used to toggle the "isNotApplicable" flag
			const siblingProductIds = productUnderGroup.filter(product => product.line_id !== serverProduct.line_id).map(sibling => sibling.line_id);
			const isSiblingProductsInCart = comboAddToCartRequest ?
				comboAddToCartRequest.products[0].child_items.filter(cartItem => siblingProductIds.indexOf(cartItem.line_id) > -1) : [];

			if (serverProduct.is_flat) {
				let isMaxReached: boolean;
				serverProduct.configurations.forEach(config => {
					const validationForSubConfig = currentProductValidation ? currentProductValidation.configurations[config.id] : null;
					isMaxReached = validationForSubConfig ?
						validationForSubConfig.isMaximumAmountReached : serverProduct.isMaxReached;
				})
				serverProduct.configuration_options.map(option => {
					const configProduct = comboAddToCartRequest ?
						comboAddToCartRequest.products[0].child_items.find(cartProduct => cartProduct.line_id === serverProduct.line_id) : null;
					const configOption = configProduct ?
						configProduct.config_options.find(configProductOption => configProductOption.config_code === option.id) : null
					const isOptionConfigured = configOption ? configOption.config_code === option.id : false;


					productList.push({
						name: option.title,
						description: option.description,
						id: option.id,
						image: flatBaseUrl + '2x/' + option.image,
						isQuantitySelectionAllowed: isOptionConfigured,
						isAddableToCartWithoutCustomization: true,
						isSelected: isOptionConfigured || !serverProduct.allow_customization,
						lineId: serverProduct.line_id,
						quantity: isOptionConfigured ? configOption.quantity : 0,
						isMaxReached: isMaxReached,
						isConfigOption: true
					} as Product);
				});
			} else {
				let defaultSiblingProductOption = null;
				const isTwin = serverProduct.product_options.options.filter(option => option.grouped_products).length > 0;
				if (isTwin) {
					const groupProductOptions = serverProduct.product_options.options.filter(option => option.grouped_products);
					defaultSiblingProductOption = groupProductOptions.find(groupOption => groupOption.selected).grouped_products;
				}
				const defaultDescription = serverProduct.description ? serverProduct.description :
					serverProduct.configuration_options.filter(config => config.quantity > 0).map(option => {
						const qtyString = option.quantity > 1 ? '(' + option.quantity + ')' : '';
						return option.title + qtyString;
					}).join(', ');
				const dynamicDescription = isSelected && currentProductValidation.isConfigValid ?
					this._mapProductConfigOptionsToDescription(serverProduct, comboAddToCartRequest)
					: defaultDescription;
				const dynamicTitle = this._mapProductConfigToTile(serverProduct, comboAddToCartRequest)

				productList.push({
					name: dynamicTitle,
					description: dynamicDescription,
					id: serverProduct.product_id,
					image: productBaseUrl + '2x/' + serverProduct.image,
					isCustomizationAllowed: serverProduct.allow_customization,
					isSelected,
					lineId: serverProduct.line_id,
					subText: subText,
					isNotApplicable: isSiblingProductsInCart.length > 0 && !allowMultiple ? true : serverProduct.isNotApplicable,
					defaultSiblingProductOption,
					isAddableToCartWithoutCustomization: !serverProduct.allow_customization,
					isMaxReached: isGroupMaxed,
					isForceSelected: isProductForceSelected
				} as Product);
			}
		});
		return productList;
	}

	/**
	 * Map product config to title
	 */
	private static _mapProductConfigToTile(
		productUnderGroup: ServerProductConfigProduct,
		comboAddToCartRequest: AddCartServerRequestInterface
	) {
		const cartProduct = comboAddToCartRequest ?
			comboAddToCartRequest.products[0].child_items.find(child => child.line_id === productUnderGroup.line_id) : null;
		let selectedProductOption = cartProduct ? productUnderGroup.product_options.options
			.find(option => option.id === cartProduct.product_option_id) : productUnderGroup.product_options.options.find(option => option.selected);

		const addToCrtProdIds = [];
		if (comboAddToCartRequest.products[0].child_items.length > 0) {
			comboAddToCartRequest.products[0].child_items.forEach(childFromATR => {
				addToCrtProdIds.push(childFromATR.product_option_id)
			})
		}
		// Checking if one if twins is already in cart so we can change title for second not customized twin
		productUnderGroup.product_options.options.forEach(serverProductOption => {
			if (serverProductOption.grouped_products && addToCrtProdIds.indexOf(serverProductOption.grouped_products.product_option) > -1) {
				selectedProductOption = serverProductOption;
				// console.log('second twin product ', selectedProductOption)
			}
		})
		return selectedProductOption ? selectedProductOption.title : productUnderGroup.name;
	}
	/**
	 * Map product config options to description
	 */
	private static _mapProductConfigOptionsToDescription(
		productUnderGroup: ServerProductConfigProduct,
		comboAddToCartRequest: AddCartServerRequestInterface
	) {
		const cartProduct = comboAddToCartRequest.products[0].child_items.find(child => child.line_id === productUnderGroup.line_id);
		const selectedConfigIds = cartProduct.config_options.map(config => config.config_code);

		const selectedConfigOptions = productUnderGroup.configuration_options
			.filter(config => selectedConfigIds.indexOf(config.id) > -1)
			.map(option => {
				const cartConfigOption = cartProduct.config_options.find(cartOption => cartOption.config_code === option.id)
				const isExtraInfo = cartConfigOption.sub_config_option ? true : false;
				let extraInfo = '';
				if (isExtraInfo) {
					productUnderGroup.sub_configuration_options.filter(subconfOpt => {
						const subConf = subconfOpt.options.find(opt => opt.product_code === cartConfigOption.sub_config_option);
						if (subConf) {
							extraInfo = ' ( ' + subConf.title + ' ) ';
						}
					})
				}
				const qtyString = cartConfigOption.quantity > 1 ? '(' + cartConfigOption.quantity + ')' : '';
				return option.title + extraInfo + qtyString;
			});

		return selectedConfigOptions.join(', ');
	}
	/**
	 * Return empty config groupe.
	 */
	static getEmptyComboGroupedProduct(): ComboConfigGroup[] {
		return [] as ComboConfigGroup[];
	}

	/**
	 * Maps combo server config, combo add to cart request and
	 * SDK response to combo edit view
	 */
	static parseComboGroupedProduct(
		comboServerConfig: ServerProductConfig,
		comboAddToCartRequest: AddCartServerRequestInterface,
		sdkValidation: SdkResponse,
		baseUrls: AppSettingsImageURLInterface
	): ComboConfigGroup[] {
		const groups = comboServerConfig.data.combo.groups.sort((compareLeft, compareRight) => compareLeft.sequence - compareRight.sequence);
		const products = comboServerConfig.data.products;
		const comboGropedProducts = [] as ComboConfigGroup[];
		const flatBaseUrl = baseUrls.toppings;
		const productBaseUrl = baseUrls.product;
		let entityAdapterIndex = 0;
		const lineIdsInCart = comboAddToCartRequest.products[0].child_items.map(cartProduct => cartProduct.line_id);

		groups.forEach(comboGroup => {
			const productUnderGroup = products.filter(product => comboGroup.child_items.indexOf(product.line_id) > -1)
				.sort((compareLeft, compareRight) => compareLeft.sequence - compareRight.sequence);


			const isGroupMaxed = productUnderGroup.filter(product => lineIdsInCart.indexOf(product.line_id) > -1).length >= comboGroup.max_selection;
			const isProductForceSelected = comboGroup.max_selection === productUnderGroup.length

			const productViewList = ComboRootMapper._parseProductUnderComboGroup(
				productUnderGroup,
				flatBaseUrl,
				productBaseUrl,
				sdkValidation,
				comboAddToCartRequest,
				comboGroup.allow_multiple_items,
				isGroupMaxed,
				isProductForceSelected
			);
			const isGroupFlat = productUnderGroup.filter(product => product.is_flat).length > 0;

			// only groups that have products that have allow_customization = true should show the reset button
			const isResetAllowed = productUnderGroup.filter(product => !product.allow_customization).length !== productUnderGroup.length;

			// Only groups with is_flat product will have validation message
			const comboValidationMessage = isGroupFlat ?
				sdkValidation.validation.children[productUnderGroup.find(product => product.is_flat).line_id].validationMsg : '';

			// TODO check logic here:
			comboGropedProducts.push({
				groupImage: productBaseUrl + '2x/' + comboGroup.group_image,
				groupTitle: comboGroup.group_title,
				products: productViewList,
				isGroupFlat,
				groupId: isGroupFlat ? productUnderGroup[0].product_id : (entityAdapterIndex++).toString(), // TODO what is logic here?
				validationMsg: comboValidationMessage,
				isResetAllowed,
				isAllowMultiple: comboGroup.allow_multiple_items
			});
		});

		return comboGropedProducts;
	}

	/**
	 * Parse combo details
	 */
	static parseComboDetails(
		comboServerConfig: ServerProductConfig,
		comboAddToCartRequest: AddCartServerRequestInterface,
		sdkValidation: SdkResponse,
		baseUrls: AppSettingsImageURLInterface,
		isEditMode: boolean,
		isBtnLoading: boolean,
		isComboPristine: boolean
	): ComboConfigDetails {
		let defaultState = isEditMode ? addToCartBtnEnum.added : addToCartBtnEnum.active;
		defaultState = isEditMode && !isComboPristine ? addToCartBtnEnum.update : defaultState;

		let totalItemsToConfig = 0;
		comboServerConfig.data.combo.groups.forEach(group => {
			totalItemsToConfig += group.allow_multiple_items ? group.child_items.length : 1;
		});

		const mappedGroups = comboServerConfig.data.combo.groups.filter(group => {
			const configedProducts = group.child_items.filter(child => {
				return sdkValidation.validation ? sdkValidation.validation.notConfiguredLineIds.indexOf(child) > -1 : false
			})
			return configedProducts.length > 0
		})

		totalItemsToConfig = mappedGroups.length;

		return {
			id: comboServerConfig.product_id,
			name: comboServerConfig.data.combo.name,
			image: baseUrls.combo + '2x/' + comboServerConfig.data.combo.image,
			quantity: comboAddToCartRequest.products[0].quantity,
			price: sdkValidation.productPrice ? sdkValidation.productPrice : 0,
			calories: sdkValidation.productCalories ? sdkValidation.productCalories : '0',
			seoTitle: comboServerConfig.seo_title,
			isValid: sdkValidation.validation ? sdkValidation.validation.isConfigValid : false,
			validationMsg: sdkValidation.validation ? sdkValidation.validation.validationMsg : '',
			description: comboServerConfig.data.combo.description,
			btnState: isBtnLoading ? addToCartBtnEnum.loading : defaultState,
			nonConfigCount: totalItemsToConfig
		} as ComboConfigDetails;
	}

	/**
	 * Get empty combo groups
	 */
	static getEmptyComboDetails() {
		return {
			id: '',
			name: '',
			quantity: null,
			price: null,
			seoTitle: '',
		} as ComboConfigDetails;
	}

}


