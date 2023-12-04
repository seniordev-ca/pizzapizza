// Server models
import {
	AddCartProductServerConfigOption,
	AddCartServerRequestInterface,
	CheckoutTypeEnum,
	AddCartProductServerRequestInterface,
	ValidateStoreInterface
} from '../../models/server-cart-request';
import { ServerCartResponseInterface, CartItemKindEnum } from '../../models/server-cart-response';
// View model
import { Product } from '../../../catalog/models/product';
import {
	OrderSummaryInterface,
	UICheckoutTimeInterface
} from '../../models/order-checkout';
// State interface
import { State as ConfigurationInterface } from '../../../catalog/reducers/configurator';
import { State as StoreStateInterface } from '../../../common/reducers/store';
// Client model
import {
	HalfHalfOptionsEnum, OptionTabModeEnum
} from '../../../catalog/components/configurator/options-list/options-list.component';
import { ServerProcessOrderRequest } from '../../models/server-process-order-request';
import {
	AddressListInterface,
	AddressTypeEnum,
	PhoneTypeEnum
} from '../../../common/models/address-list';
import { FutureHoursResponse } from '../../models/server-process-order-response';
import { TimeFormattingService } from '../../services/global-time-formatting';
import { ProductKinds, ServerProductConfig } from '../../../catalog/models/server-product-config';
import { ServerCartResponseProductListInterface } from '../../models/server-cart-response';

export class CartMapper {
	/**
	 * Map server cart to view cart
	 */
	static mapServerCartItemsToView(
		serverCartResponse: ServerCartResponseInterface,
		imageBaseUrl: string
	): Product[] {
		const cartProductArr = serverCartResponse.products;

		return cartProductArr.map(cartProduct => {
			const isPersonalMessageApplied = cartProduct.personalized_message ? true : false;
			const isPersonalMessageEmpty = isPersonalMessageApplied ? cartProduct.personalized_message.message_from === ''
				&& cartProduct.personalized_message.message_to === ''
				&& cartProduct.personalized_message.message === '' : true;
			const isCombo = cartProduct.kind === CartItemKindEnum.Combo && cartProduct.allow_customization ||
				cartProduct.kind === CartItemKindEnum.Twin && cartProduct.allow_customization ||
				cartProduct.kind === CartItemKindEnum.SingleConfigurable && cartProduct.allow_customization;
			const isNonConfigCombo = cartProduct.kind === CartItemKindEnum.Combo && !cartProduct.allow_customization;
			const comesWith = cartProduct.child_items.filter(child => child.product_code !== cartProduct.product_code).map(child => child.name);

			return {
				id: cartProduct.product_id,
				cardId: cartProduct.cart_item_id,
				name: cartProduct.name,
				image: imageBaseUrl + '2x/' + cartProduct.image,
				description: cartProduct.description,
				quantity: cartProduct.quantity,
				priceText: {
					labels: null,
					priceValue: cartProduct.price
				},
				isCustomizationAllowed: cartProduct.allow_customization,
				isComboProduct: cartProduct.kind === CartItemKindEnum.Combo,
				// isCoupon: cartProduct.kind === 'coupon',
				seoTitle: cartProduct.seo_title,
				isQuantitySelectionAllowed: cartProduct.allow_qty_selection,
				kind: cartProduct.kind,
				isPersonalMessageApplied: isPersonalMessageApplied && !isPersonalMessageEmpty,
				hasFullWidthImage: isCombo,
				cartConfig: cartProduct.config_options,
				cartItemChildren: isCombo ? cartProduct.child_items : null,
				cartIncludes: isNonConfigCombo ? comesWith.join(', ') : null
			} as Product;
		});
	}
	/**
	* Map server cart details to view cart
	*/
	static mapServerCartSummaryToView(
		serverCartResponse: ServerCartResponseInterface
	): OrderSummaryInterface {
		// Deep copy to avoid server data mutation
		let serverOrderComponent = Object.assign(
			[],
			serverCartResponse.order_summary.order_components
		);

		// Sorting
		serverOrderComponent = serverOrderComponent.sort(
			(compareLeft, compareRight) => compareLeft.sort_id - compareRight.sort_id
		);
		// Deep copy to avoid server data mutation
		let serverRedeemtionComponent = Object.assign(
			[],
			serverCartResponse.order_summary.redemption_components
		);

		// Sorting
		serverRedeemtionComponent = serverRedeemtionComponent.sort(
			(compareLeft, compareRight) => compareLeft.sort_id - compareRight.sort_id
		);
		// Mapping to view
		const viewOrderComponents = serverOrderComponent.map(orderComponents => {
			return {
				label: orderComponents.label,
				value: orderComponents.value,
				code: orderComponents.code
			};
		});

		const redemptionComponents = serverRedeemtionComponent.map(redeemComponents => {
			return {
				code: redeemComponents.code,
				label: redeemComponents.label,
				value: redeemComponents.value
			};
		});

		return {
			total: serverCartResponse.order_summary.total,
			subtotal: serverCartResponse.order_summary.discounted_subtotal,
			orderComponent: viewOrderComponents,
			isSurchargeAdded: serverCartResponse.is_surcharge_added,
			surchargeValue: serverCartResponse.surcharge_val,
			coupon: serverCartResponse.coupon ? {
				coupons: serverCartResponse.coupon.coupons,
				isValid: serverCartResponse.coupon.is_valid
			} : null,
			redemptionComponents,
			loyalty: {
				amount: serverCartResponse.order_summary.loyalty ? serverCartResponse.order_summary.loyalty.amount : null,
				isRedeemed: serverCartResponse.order_summary.loyalty ? serverCartResponse.order_summary.loyalty.is_redeemed : null
			}
		} as OrderSummaryInterface;
	}

	/**
	* Map config options to add to cart request component
	*/
	private static _getServerProductConfigsFromView(
		configurationState: ConfigurationInterface
	): AddCartProductServerConfigOption[] {
		const configOptionRequest = [] as AddCartProductServerConfigOption[];
		// Take selected product options

		const selectedProductOptions = configurationState.viewProductOptions.filter(
			productOption =>
				productOption.selected
			// && productOption.isAvailableForProduct
		);

		// Map product config options to add to cart request
		selectedProductOptions.forEach(productOption => {
			const direction = productOption.halfHalfOption
				? productOption.halfHalfOption
				: HalfHalfOptionsEnum.center;
			const quantity =
				productOption.quantity === 0 ? 1 : productOption.quantity;

			const serverConfigObject = {
				config_code: productOption.id,
				direction,
				quantity
			} as AddCartProductServerConfigOption;

			if (productOption.optionMode === OptionTabModeEnum.dropDown) {
				// TODO: use enum for base sauce and base cheese??
				const selectedSubConfig = productOption.optionDropDown.options.find(
					dropDownOption => dropDownOption.isSelected && dropDownOption.id !== 'NONE'
				);
				if (selectedSubConfig) {
					serverConfigObject.sub_config_option = selectedSubConfig.id;
				}
			}
			configOptionRequest.push(serverConfigObject);
		});

		return configOptionRequest;
	}

	/**
	* Mapping view config options to add cart request
	*/
	private static _getChildrenAddToCartObjectByConfigState(
		configurationState: ConfigurationInterface
	): AddCartProductServerRequestInterface {
		const configOptions = CartMapper._getServerProductConfigsFromView(
			configurationState
		);
		const lineId = configurationState.productKind === ProductKinds.twin ?
			configurationState.currentTwinLineId : configurationState.configurableItemData.line_id
		return {
			product_id: configurationState.configurableItemData.product_id,
			quantity: configurationState.viewProductInfo.quantity,
			config_options: configOptions,
			product_option_id: configurationState.selectedProductOptionId,
			line_id: lineId
		} as AddCartProductServerRequestInterface;
	}

	/**
	 * Merging children product add to cart request.
	 */
	private static _mergerChildrenAddToCartRequest(
		currentLineId: number,
		currentChildrenItem: AddCartProductServerRequestInterface,
		currentCartRequest: AddCartServerRequestInterface,
		serverCartResponse: ServerCartResponseProductListInterface
	): AddCartProductServerRequestInterface[] {
		let childItems = [] as AddCartProductServerRequestInterface[];

		if (!currentCartRequest) {
			// If product is not added to add to cart request than create it
			childItems = [currentChildrenItem];
		} else {
			// If product is added than update it
			childItems = currentCartRequest.products[0].child_items;

			// Update existed children by line id
			let isSubProductUpdated = false;
			childItems.forEach((comboChildren, index) => {
				if (comboChildren.line_id === currentLineId) {
					childItems[index] = currentChildrenItem;
					if (comboChildren.personalized_message && !currentChildrenItem.personalized_message) {
						childItems[index].personalized_message = comboChildren.personalized_message
					}
					isSubProductUpdated = true;
				}
			});

			// If configured sub product is not update than add it.
			if (!isSubProductUpdated) {
				childItems.push(currentChildrenItem);
			}
		}

		return childItems;
	}

	/**
	 * Map server cart response to add to cart request
	 */
	static _mapTwinChildrenCardResponseToRequest(
		serverCartResponse: ServerCartResponseProductListInterface
	): AddCartProductServerRequestInterface[] {

		const result = [] as AddCartProductServerRequestInterface[];
		if (serverCartResponse) {

			serverCartResponse.child_items.forEach(responseItem => {
				console.log(responseItem)
				const twinProductConfigOptions = [];
				responseItem.config_options.forEach(configOptionItem => {
					let mappedConfigOption
					if (configOptionItem.subconfig_option) {
						mappedConfigOption = {
							config_code: configOptionItem.config_code,
							direction: configOptionItem.direction,
							quantity: configOptionItem.quantity,
							subconfig_option: configOptionItem.subconfig_option.config_code
						}
					} else {
						mappedConfigOption = {
							config_code: configOptionItem.config_code,
							direction: configOptionItem.direction,
							quantity: configOptionItem.quantity
						}
					}
					twinProductConfigOptions.push(mappedConfigOption)
				})
				result.push({
					product_id: responseItem.product_id,
					quantity: serverCartResponse.quantity,
					config_options: twinProductConfigOptions,
					product_option_id: responseItem.product_option_id,
					line_id: responseItem.line_id,
					personalized_message: responseItem.personalized_message
				})
			})
		}
		return result;
	}

	/**
	 * Build Initial Combo Request
	 */
	static _buildInitialComboRequestFromConfig(
		serverComboConfig: ServerProductConfig,
		storeState: StoreStateInterface,
	): AddCartServerRequestInterface {
		const storeId = storeState.selectedStore.store_id;
		const isDelivery = storeState.isDeliveryTabActive;
		const cartProducts = [];
		const cartProductObj = {
			product_id: serverComboConfig.product_id,
			quantity: 1,
			product_option_id: 0,
			config_options: [],
			child_items: []
		}

		const currentProducts = serverComboConfig.data.products;
		const comboGroups = serverComboConfig.data.combo.groups;

		const groupsWithoutChoices = comboGroups.filter(group => group.max_selection === group.child_items.length);
		const autoSelectedProducts = [];
		groupsWithoutChoices.forEach(group => {
			const children = group.child_items;
			children.forEach(child => {
				const childProduct = currentProducts.find(product => product.line_id === child)
				if (!childProduct.allow_customization) {
					autoSelectedProducts.push(childProduct)
				}
			})
		});
		if (autoSelectedProducts.length > 0) {
			autoSelectedProducts.forEach(product => {
				const childItem = {
					product_id: product.product_id,
					quantity: 1,
					config_options: [],
					product_option_id: product.product_options.options[0].id,
					line_id: product.line_id
				}
				cartProductObj.child_items.push(childItem)
			})
		}

		cartProducts.push(cartProductObj)

		const addCartPayload = {
			store_id: storeId,
			is_delivery: isDelivery,
			products: cartProducts
		} as AddCartServerRequestInterface;

		return addCartPayload;
	}

	/**
	 * Get product id by fine id from raw server response
	 */
	static _getProductIdByLineIdFromComboConfig(
		serverComboConfig: ServerProductConfig,
		lineId: number
	): string {
		const foundProduct = serverComboConfig ? serverComboConfig.data.products.find(product => product.line_id === lineId) : null
		if (!foundProduct) {
			return null;
		}

		return foundProduct.product_id;
	}

	/**
	 * If product is twin or combo with twin we need to bind product sizes
	 */
	static _updateProductSibling(
		addToCartRequestProducts: AddCartProductServerRequestInterface[],
		configurationState: ConfigurationInterface,
		serverComboConfig?: ServerProductConfig,
	): AddCartProductServerRequestInterface[] {
		const siblingLineId = configurationState.selectedProductOptionSibling.productLineId;
		const siblingOptionId = configurationState.selectedProductOptionSibling.productOptionId;

		const productSibling = addToCartRequestProducts
			.find(childItem => childItem.line_id === siblingLineId);

		const defaultOptionsSelected = [];
		if (typeof productSibling === 'object') {
			// IF product found THAN update it
			productSibling.product_option_id = siblingOptionId;
			if (configurationState.unavailableIngredients && configurationState.unavailableIngredients.length > 0) {
				// get default options
				const serverData = configurationState.entities[configurationState.productSeoTitle].data.products;
				const serverConfigOptionsForSibling = serverData.find(sibling => sibling.line_id === siblingLineId);
				serverConfigOptionsForSibling.configuration_options.forEach(option => {
					if (option.quantity > 0) {
						defaultOptionsSelected.push(option);
					}
				})
				// update selectedConfigOptionsSibling
				configurationState.unavailableIngredients.forEach(unavailableIngr => {
					const siblingAddToCartProduct = addToCartRequestProducts.find(product => product.line_id === siblingLineId);
					const siblingConfigOptions = siblingAddToCartProduct.config_options;
					const notExistingConfigOptionInCart = siblingConfigOptions.find(configOption => configOption.config_code === unavailableIngr)
					if (notExistingConfigOptionInCart) {
						// find parent id in subconfig
						const notExistConfigOptType = serverConfigOptionsForSibling.configuration_options
							.find(option => option.id === notExistingConfigOptionInCart.config_code).parent_id;
						defaultOptionsSelected.forEach(defaultOption => {
							// TODO check if allow multiple items : false, because some config oprions might not need to be exchanged
							if (defaultOption.parent_id === notExistConfigOptType) {
								// exchange on default with same parent id
								notExistingConfigOptionInCart.config_code = defaultOption.id
							}
						})
					}
				})
			}
		} else {
			// ELSE IF product is combo add new product in add to request
			// const isProductCombo = serverComboConfig && serverComboConfig.kind === ProductKinds.combo;
			// const siblingProductCode = CartMapper._getProductIdByLineIdFromComboConfig(serverComboConfig, siblingLineId);

			// if (isProductCombo && siblingProductCode) {
			// 	const siblingProduct = serverComboConfig.data.products.filter(prod => prod.product_id === siblingProductCode);
			// 	const sinblingConfig = siblingProduct[0].configuration_options;


			// 	// check on not existing configs on current size
			// 	const selectedConfigOptionsSibling = sinblingConfig
			// 		.filter(configOption => configOption.quantity > 0).map(option => {
			// 			return {
			// 				config_code: option.id,
			// 				quantity: option.quantity,
			// 				direction: HalfHalfOptionsEnum.center
			// 			} as AddCartProductServerConfigOption
			// 		})
			// 	addToCartRequestProducts.push({
			// 		product_id: siblingProductCode,
			// 		line_id: siblingLineId,
			// 		product_option_id: siblingOptionId,
			// 		quantity: 1,
			// 		config_options: selectedConfigOptionsSibling
			// 	});
			// }
		}

		return addToCartRequestProducts;
	}

	/**
	* Maps combo config options
	*/
	static mapComboConfigurationToCartRequest(
		serverComboConfig: ServerProductConfig,
		configurationState: ConfigurationInterface,
		storeState: StoreStateInterface,
		currentCartRequest: AddCartServerRequestInterface,
		serverCartResponse: ServerCartResponseProductListInterface,
		requiredCopyFromServerCart
	): AddCartServerRequestInterface {
		let comboAddToCartRequest = {} as AddCartServerRequestInterface;
		const comboID = serverComboConfig.product_id;
		// Initial add to cart request
		if (!currentCartRequest) {
			const cartRequest = CartMapper._buildInitialComboRequestFromConfig(serverComboConfig, storeState);
			if (requiredCopyFromServerCart && serverCartResponse) {
				cartRequest.products[0].quantity = serverCartResponse.quantity;
				cartRequest.products[0].child_items = CartMapper._mapTwinChildrenCardResponseToRequest(serverCartResponse);
			}
			comboAddToCartRequest = cartRequest;
		} else {
			const storeId = storeState.selectedStore.store_id;
			const isDelivery = storeState.isDeliveryTabActive;

			const currentChildrenItem = CartMapper._getChildrenAddToCartObjectByConfigState(
				configurationState
			);
			const currentLineId = configurationState.configurableItemData.line_id;
			const currentCartProduct = currentCartRequest.products[0]
			const currentParentGroup = serverComboConfig.data.combo.groups
				.find(group => group.child_items.indexOf(currentChildrenItem.line_id) > -1);
			let childItems = CartMapper._mergerChildrenAddToCartRequest(
				currentLineId,
				currentChildrenItem,
				currentCartRequest,
				serverCartResponse
			);

			if (!currentParentGroup.allow_multiple_items) {
				const invalidChildren = childItems.filter(child => currentParentGroup.child_items.indexOf(child.line_id) > -1
					&& child.product_id !== currentChildrenItem.product_id);
				childItems = childItems.filter(child => invalidChildren.indexOf(child) < 0);
			}

			if (requiredCopyFromServerCart) {
				childItems = CartMapper._mapTwinChildrenCardResponseToRequest(serverCartResponse);
			}

			const cartProduct = [{
				product_id: currentCartProduct.product_id,
				quantity: currentCartProduct.quantity,
				product_option_id: 0,
				config_options: [],
				child_items: childItems
			}]
			comboAddToCartRequest = {
				store_id: storeId,
				is_delivery: isDelivery,
				products: cartProduct
			};
		}

		// IF product has siblings: find sibling in add to request and update it
		if (configurationState.selectedProductOptionSibling !== null) {
			const comboProduct = comboAddToCartRequest.products.find(product => product.product_id === comboID)
			comboAddToCartRequest.products.find(product => product.product_id === comboID).child_items =
				CartMapper._updateProductSibling(comboProduct.child_items, configurationState, serverComboConfig);
		}
		return comboAddToCartRequest;
	}

	/**
	 * Building initial add to cart request for twins
	 */
	static _buildInitialTwinChild(
		serverProduct: ServerProductConfig
	): AddCartProductServerRequestInterface[] {
		const result = [] as AddCartProductServerRequestInterface[];

		serverProduct.data.products.forEach(product => {
			const productOptions = product.product_options.options;
			const selectedOptions = productOptions.find(productOption => productOption.selected);
			const selectedConfigOptions = product.configuration_options
				.filter(configOption => configOption.quantity > 0).map(option => {
					return {
						config_code: option.id,
						quantity: option.quantity,
						direction: HalfHalfOptionsEnum.center
					} as AddCartProductServerConfigOption
				})
			result.push({
				product_id: product.product_id,
				quantity: 1,
				config_options: selectedConfigOptions,
				product_option_id: selectedOptions.id,
				line_id: product.line_id,
			})
		})
		return result;
	}

	/**
	* Map twin configuration view into add to cart request
	*/
	static mapTwinToCartRequest(
		configurationState: ConfigurationInterface,
		storeState: StoreStateInterface,
		currentCartRequest: AddCartServerRequestInterface,
		requiredCopyFromServerCart: boolean,
		serverCartResponse: ServerCartResponseProductListInterface,
	): AddCartServerRequestInterface {
		const storeId = storeState.selectedStore.store_id;
		const isDeliveryTabActive = storeState.isDeliveryTabActive;
		let addCartPayload = {} as AddCartServerRequestInterface;

		let childItems = [] as AddCartProductServerRequestInterface[];
		// console.log(requiredCopyFromServerCart, serverCartResponse)
		if (requiredCopyFromServerCart && serverCartResponse) {
			// For editing take childItem from serve cart
			childItems = CartMapper._mapTwinChildrenCardResponseToRequest(serverCartResponse);
		} else if (currentCartRequest === null) {
			// For initial load build children from config
			const currentProductSlug = configurationState.productSeoTitle;
			const productServerConfig = configurationState.entities[currentProductSlug];
			childItems = CartMapper._buildInitialTwinChild(productServerConfig);
		} else {
			// For editing merger existed cart with card from view
			const currentChildrenItem = CartMapper._getChildrenAddToCartObjectByConfigState(
				configurationState
			);

			const currentLineId = configurationState.currentTwinLineId;
			childItems = CartMapper._mergerChildrenAddToCartRequest(
				currentLineId,
				currentChildrenItem,
				currentCartRequest,
				serverCartResponse
			);
		}

		// IF product has siblings: find sibling in add to request and update it - ONLY if we are not copying from cart
		if (configurationState.selectedProductOptionSibling !== null && !requiredCopyFromServerCart) {
			childItems = CartMapper._updateProductSibling(childItems, configurationState);
		}

		const quantity = requiredCopyFromServerCart && serverCartResponse ?
			serverCartResponse.quantity : configurationState.viewProductInfo.quantity;

		const products = [{
			product_id: configurationState.rootProductId,
			quantity,
			product_option_id: 0,
			config_options: [],
			child_items: childItems
		}]

		addCartPayload = {
			store_id: storeId,
			is_delivery: isDeliveryTabActive,
			products
		};

		return addCartPayload;
	}

	/**
	* Map single configuration view into add to cart request
	*/
	static mapSingleConfigurationToCartRequest(
		configurationState: ConfigurationInterface,
		storeState: StoreStateInterface,
		currentCardProduct: ServerCartResponseProductListInterface,
		requiredCopyFromServerCart: boolean
	): AddCartServerRequestInterface {
		const storeId = storeState.selectedStore.store_id;
		const isDeliveryTabActive = storeState.isDeliveryTabActive;

		let addCartPayload = {} as AddCartServerRequestInterface;

		let requestConfigOptions = null;

		if (!requiredCopyFromServerCart || (requiredCopyFromServerCart && !currentCardProduct)) {
			requestConfigOptions = CartMapper._getServerProductConfigsFromView(
				configurationState
			);
		} else {
			requestConfigOptions = currentCardProduct.config_options.map(option => {
				let editedOption = {}
				if (option.subconfig_option) {
					editedOption = {
						config_code: option.config_code,
						quantity: option.quantity,
						direction: option.direction,
						subconfig_option: option.subconfig_option.config_code
					}
				} else {
					editedOption = {
						config_code: option.config_code,
						quantity: option.quantity,
						direction: option.direction
					}
				}
				return editedOption
			})
		}
		// this not working for Pizza assistant because selectedProductOptionId will be based on FetchSingleProd Success
		// with default size while config options will be updated and default size mught not have current config options available.
		const prodOptId = requiredCopyFromServerCart && currentCardProduct ?
			currentCardProduct.product_option_id : configurationState.selectedProductOptionId;
		const products = [{
			product_id: configurationState.rootProductId,
			quantity: requiredCopyFromServerCart && currentCardProduct ?
				currentCardProduct.quantity : configurationState.viewProductInfo.quantity,
			product_option_id: prodOptId,
			config_options: requestConfigOptions,
			line_id: configurationState.viewProductInfo.lineId
		}]
		addCartPayload = {
			store_id: storeId,
			is_delivery: isDeliveryTabActive,
			products
		};
		return addCartPayload;
	}

	/**
	* Map Single Combo Config to cart request
	*/
	static mapSingleComboConfigurationToCartRequest(
		configurationState: ConfigurationInterface,
		storeState: StoreStateInterface,
		currentCardProduct: ServerCartResponseProductListInterface,
		requiredCopyFromServerCart: boolean
	): AddCartServerRequestInterface {
		const storeId = storeState.selectedStore.store_id;
		const isDeliveryTabActive = storeState.isDeliveryTabActive;
		const requestConfigOptions = CartMapper._getServerProductConfigsFromView(
			configurationState
		);
		// get the full config from entities
		const fullConfigFromEntity =
			configurationState.entities[configurationState.productSeoTitle];
		// find the main product via line id
		const configurableProduct = fullConfigFromEntity.data.products.find(
			product => product.line_id === configurationState.viewProductInfo.lineId
		);
		// find any other products
		const extraProducts = fullConfigFromEntity.data.products.filter(
			product => product.line_id !== configurationState.viewProductInfo.lineId
		);
		let addCartPayload = {} as AddCartServerRequestInterface;
		let childItems = [];
		// Add the first product to child items
		childItems.push({
			product_id: configurableProduct.product_id,
			product_option_id: configurationState.selectedProductOptionId,
			quantity: configurationState.viewProductInfo.quantity,
			config_options: requestConfigOptions,
			line_id: configurableProduct.line_id
		});
		// check if there are extra products available and add them to child items
		if (extraProducts.length > 0) {
			extraProducts.map(extraProduct => {
				const productOptionId = extraProduct.product_options.options.find(
					option => option.selected
				);
				childItems.push({
					product_id: extraProduct.product_id,
					product_option_id: productOptionId.id,
					config_options: [],
					quantity: configurationState.viewProductInfo.quantity,
					line_id: extraProduct.line_id
				});
			});
		}
		if (requiredCopyFromServerCart && currentCardProduct) {
			childItems = currentCardProduct.child_items;
		}
		// the main add to cart payload
		const products = [{
			product_id: configurationState.rootProductId,
			quantity: configurationState.viewProductInfo.quantity,
			product_option_id: 0,
			config_options: [],
			child_items: childItems
		}]
		addCartPayload = {
			store_id: storeId,
			is_delivery: isDeliveryTabActive,
			products
		};

		return addCartPayload;
	}

	/**
	* Map configuration view into add to cart request
	*/
	static mapProductToCartRequest(
		product: Product,
		storeState: StoreStateInterface
	): AddCartServerRequestInterface {
		let addCartPayload = {} as AddCartServerRequestInterface;
		const configOptionRequest = [] as AddCartProductServerConfigOption[];
		const products = [{
			product_id: product.id,
			quantity: product.quantity,
			config_options: configOptionRequest
		}]
		addCartPayload = {
			store_id: storeState.selectedStore.store_id,
			is_delivery: storeState.isDeliveryTabActive,
			products
		};

		return addCartPayload;
	}

	/**
	* Map Delivery Validation Request
	*/
	static mapDeliveryStoreValidationRequest(
		selectedAddressID: number | string,
		selectedAddressObject,
		userInputAddress: AddressListInterface
	): ValidateStoreInterface {
		const validateRequest = {
			is_delivery: true
		} as ValidateStoreInterface;

		if (selectedAddressID) {
			if (selectedAddressObject && selectedAddressObject.type === AddressTypeEnum.University) {
				validateRequest.building_key = selectedAddressObject.building
			} else {
				validateRequest.address = {
					province: selectedAddressObject.address.province,
					city: selectedAddressObject.address.city,
					postal_code: selectedAddressObject.address.postalCode,
					street_address: selectedAddressObject.address.streetName,
					street_number: selectedAddressObject.address.streetNumber
				};
			}
		} else {
			if (userInputAddress.type === AddressTypeEnum.University) {
				validateRequest.building_key = userInputAddress.building;
			} else {
				validateRequest.address_components =
					userInputAddress.address.address ? userInputAddress.address.address.address_components : userInputAddress.address.address_components;
				if (!validateRequest.address_components) {
					validateRequest.address = userInputAddress.address.address ?
						{
							street_address: userInputAddress.address.address.street_address,
							street_number: userInputAddress.address.address.street_number,
							province: userInputAddress.address.address.province,
							postal_code: userInputAddress.address.address.postal_code,
							city: userInputAddress.address.address.city
						}
						: {
							street_address: userInputAddress.address.streetName,
							street_number: userInputAddress.address.streetNumber,
							province: userInputAddress.address.province,
							postal_code: userInputAddress.address.postalCode,
							city: userInputAddress.address.city
						}
				}
			}
		}

		if (userInputAddress && userInputAddress.date && userInputAddress.time) {
			validateRequest.order_time = CartMapper._getFutureTime(userInputAddress.time, userInputAddress.date)
		}
		return validateRequest;
	}

	/**
	* Map Pick up Store Validation
	*/
	static mapPickupStoreValidation(
		selectedStoreId: number,
		userInputAddress: AddressListInterface
	): ValidateStoreInterface {
		const validateRequest = {
			is_delivery: false,
			store_id: selectedStoreId
		} as ValidateStoreInterface;
		if (userInputAddress && userInputAddress.date && userInputAddress.time) {
			validateRequest.order_time = CartMapper._getFutureTime(userInputAddress.time, userInputAddress.date)
		}
		return validateRequest;
	}

	/**
	* Map Store Hours to front end UI
	*/
	static mapStoreHours(storeHours: FutureHoursResponse[], locale: string) {
		const todayText = locale === 'en-US' ? 'Today' : 'Aujourd\'hui\n';
		const tomorrowText = locale === 'en-US' ? 'Tomorrow' : 'demain';
		const currentDate = new Date();
		const tomorrow = new Date();
		const currentMonth = ('0' + (currentDate.getMonth() + 1)).slice(-2);
		const currentDay = ('0' + currentDate.getDate()).slice(-2);

		tomorrow.setDate(currentDate.getDate() + 1);
		const tomorrowMonth = ('0' + (tomorrow.getMonth() + 1)).slice(-2);
		const tomorrowDay = ('0' + tomorrow.getDate()).slice(-2);

		const theCurrentDateString =
			currentDate.getFullYear() + '-' + currentMonth + '-' + currentDay;
		const tomorrowDateString =
			currentDate.getFullYear() + '-' + tomorrowMonth + '-' + tomorrowDay;

		const uiStoreHours = storeHours.map(date => {
			// Date() was providing the previous day
			// https://stackoverflow.com/questions/7556591/javascript-date-object-always-one-day-off
			const thisDate = new Date(date.date.replace(/-/g, '\/').replace(/T.+/, ''));

			const isToday = date.date === theCurrentDateString.toString();
			const isTomorrow = date.date === tomorrowDateString.toString();
			const defaultLabel = thisDate.toLocaleString(locale, {
				weekday: 'short',
				month: 'short',
				day: 'numeric'
			});

			return {
				date: date.date,
				day_code: date.day_code,
				label: isToday ? todayText : isTomorrow ? tomorrowText : defaultLabel,
				times: date.times
			};
		});
		return uiStoreHours as UICheckoutTimeInterface[];
	}

	/**
	* Map Pickup Order Request
	*/
	static mapPickupOrderRequest(
		submittedAddressDetails: AddressListInterface,
		submittedPaymentDetails,
		selectedStoreId
	): ServerProcessOrderRequest {
		const orderRequest = {
			...submittedPaymentDetails,
			store_id: selectedStoreId,
			is_pickup_order: true
		} as ServerProcessOrderRequest;

		/**
		* Future date
		*/
		if (submittedAddressDetails.date && submittedAddressDetails.time) {
			orderRequest.future_order_time = CartMapper._getFutureTime(submittedAddressDetails.time, submittedAddressDetails.date)
		}
		/**
		* Phone number object
		*/
		if (submittedAddressDetails.contactInfo.phoneNumber !== '') {
			const phoneString = submittedAddressDetails.contactInfo.phoneNumber.replace(
				/[^0-9.]/g,
				''
			);
			const phoneType =
				submittedAddressDetails.contactInfo.type === 'Mobile'
					? PhoneTypeEnum.Mobile
					: PhoneTypeEnum.Home;
			orderRequest.phone_number = {
				phone_number: phoneString,
				type: phoneType,
				extension: submittedAddressDetails.contactInfo.extension ? submittedAddressDetails.contactInfo.extension : ''
			};
		}
		/**
		* Build Guest User
		 */
		if (submittedAddressDetails.email) {
			orderRequest.guest_user = {
				first_name: submittedAddressDetails.firstName,
				last_name: submittedAddressDetails.lastName,
				email: submittedAddressDetails.email.trim().toLowerCase() // remove whitespace from email
			}
		}
		return orderRequest;
	}

	/**
	* Map Order For Delivery
	*/
	static mapDeliveryOrderRequest(
		submittedAddressDetails: AddressListInterface,
		submittedPaymentDetails,
		selectedAddress: number | string,
		storeId: number
	): ServerProcessOrderRequest {

		console.log(submittedAddressDetails, selectedAddress);

		// TODO Proper fix for phone number
		submittedAddressDetails.contactInfo.phoneNumber = submittedAddressDetails.contactInfo.phoneNumber || '';


		const orderRequest = {
			...submittedPaymentDetails,
			store_id: storeId,
			is_pickup_order: false,
			delivery_instructions: submittedAddressDetails.deliveryIntructions
				? submittedAddressDetails.deliveryIntructions
				: ''
		} as ServerProcessOrderRequest;
		const phoneString = submittedAddressDetails.contactInfo.phoneNumber.replace(
			/[^0-9.]/g,
			''
		);
		const phoneType =
			submittedAddressDetails.contactInfo.type === 'Mobile'
				? PhoneTypeEnum.Mobile
				: PhoneTypeEnum.Home;
		/**
		* If user picks future order
		*/
		if (submittedAddressDetails.date && submittedAddressDetails.time) {
			orderRequest.future_order_time = CartMapper._getFutureTime(submittedAddressDetails.time, submittedAddressDetails.date)
		}
		/**
		* If user selects a saved address
		*/
		if (selectedAddress) {
			orderRequest.address_id = selectedAddress;
		} else {
			const addressType =
				submittedAddressDetails.type === 'University'
					? AddressTypeEnum.University
					: AddressTypeEnum.Home;
			orderRequest.address = {
				address_type: addressType,
				saved: false,
				address_name: submittedAddressDetails.title,
				apartment_number: submittedAddressDetails.unitNumber,
				security_code: submittedAddressDetails.unitBuzzer,
				phone_number: {
					phone_number: phoneString,
					type: phoneType,
					extension: submittedAddressDetails.contactInfo.extension ? submittedAddressDetails.contactInfo.extension : ''
				}
			};
			/**
			* If user adds a university address
			*/
			if (submittedAddressDetails.type === AddressTypeEnum.University) {
				orderRequest.address.university_code =
					submittedAddressDetails.university;
				orderRequest.address.building_key = submittedAddressDetails.building;
				orderRequest.address.entrance_specs =
					submittedAddressDetails.buildingEntrance;
			} else {
				orderRequest.address.entrance_specs = submittedAddressDetails.entrance;
				orderRequest.address.address_components =
					submittedAddressDetails.address.address ?
						submittedAddressDetails.address.address.address_components :
						submittedAddressDetails.address.address_components;

				if (!orderRequest.address.address_components) {
					orderRequest.address.address = {
						street_address: submittedAddressDetails.address.streetName,
						street_number: submittedAddressDetails.address.streetNumber,
						province: submittedAddressDetails.address.province,
						postal_code: submittedAddressDetails.address.postalCode,
						city: submittedAddressDetails.address.city
					}
				}
			}
			/**
			* Build phone number object
			*/
			orderRequest.phone_number = {
				phone_number: phoneString,
				type: phoneType,
				extension: submittedAddressDetails.contactInfo.extension ? submittedAddressDetails.contactInfo.extension : ''
			};

			/**
			 * Build Guest User
			 */
			if (submittedAddressDetails.email) {
				orderRequest.guest_user = {
					first_name: submittedAddressDetails.firstName,
					last_name: submittedAddressDetails.lastName,
					email: submittedAddressDetails.email.trim()
				}
			}
		}
		return orderRequest;
	}

	/**
	 * Map invalid products to array of strings
	 */
	static mapInvalidCartProducts(products: ServerCartResponseProductListInterface[]): string[] {
		const cartItems = products.filter(product => {
			const productInvalid = !product.is_valid;
			const productHasInvalidConfig = product.config_options.filter(configur => !configur.is_valid).length > 0;
			return productInvalid || productHasInvalidConfig
		}).map(product => {
			return product.name + ' (' + product.invalid_reason + ')';
		})
		return cartItems;
	}

	/**
	 * Get Future Order Object
	 */
	static _getFutureTime(time, date) {
		// safety net for bug in which dropdown sends an object instead of only the value
		const timeFix = time['value'] ? time['value'] : time;
		const formatTime = TimeFormattingService.convertTo24Hour(
			timeFix
		);
		return {
			date: date,
			time: formatTime
		};
	}
	// tslint:disable-next-line:max-file-line-count
}
