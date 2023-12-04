import { Product } from '../../models/product';
import { ServerPizzaAssistantProduct, ServerPizzaAssistantProductType } from '../../models/server-pizza-assistant';
import { ProductKinds, ServerProductConfig, ServerProductConfigProduct } from '../../models/server-product-config';
import { AppSettingsImageURLInterface } from 'app/common/models/server-app-settings';
import { AddCartProductServerConfigOption } from 'app/checkout/models/server-cart-request';

export class ProductListMapperHelper {
	/**
	 * Build the product list
	 */
	static buildProductList(products, baseUrl): Product[] {
		const orderedProducts = products.sort(function (leftProduct, rightProduct) {
			return leftProduct.sequence - rightProduct.sequence;
		});
		return orderedProducts.map(product => {
			const cartRequest = product.cart_request;
			const quantity = cartRequest ? cartRequest.quantity : product.quantity;
			return {
				id: product.product_id,
				name: product.name,
				description: product.description,
				image: baseUrl + '2x/' + product.image,
				priceText: {
					labels: product.price_text.label,
					priceValue: product.price_text.price_value
				},
				calText: product.cal_text,
				marketingBadge: {
					text: product.marketing_badge ? product.marketing_badge.text : null,
					color: product.marketing_badge ? product.marketing_badge.color : null,
					fontKey: product.marketing_badge ? product.marketing_badge.font_key : null
				},
				isCustomizationAllowed: product.allow_customization,
				isQuantityIncrementerDisplayed: product.allow_qty_selection,
				isQuickAddAllowed: product.allow_quick_add,
				isAddableToCartWithoutCustomization: product.allow_add_to_cart,
				isComboProduct: product.kind === 'combo' ? true : false,
				seoTitle: product.seo_title,
				quantity: quantity ? quantity : 1, // set quanity to 1 by default
				pizzaId: product.id ? product.id : null,
				lineId: product.lineId,
				productTag: product.product_tag,
				hasFullWidthImage: product.kind === ProductKinds.combo && product.allow_customization
			} as Product
		});
	}
	/**
	 * Build the product list
	 */
	static buildProductListFromAssistant(productConfig: ServerPizzaAssistantProduct[], baseUrls: AppSettingsImageURLInterface): Product[] {

		return productConfig.map(product => {
			const isConfigRequired = product.is_config_required;
			const productCache = product.config_cache.data.products.find(activeProduct => activeProduct.line_id === 1);
			const cartRequest = product.cart_request;
			const quantity = cartRequest ? cartRequest.quantity : 1 // set quanity to 1 by default
			const img = product.product_type === ServerPizzaAssistantProductType.COMBO ? product.config_cache.data.combo.image : productCache.image;
			const selectedProductOption = cartRequest.product_option_id > 0 ? cartRequest.product_option_id : null;
			let label = product.product_type !== ServerPizzaAssistantProductType.SPECIAL && selectedProductOption ?
				productCache.product_options.options.find(option => option.id === selectedProductOption).title :
				null;
			const name = selectedProductOption ?
				productCache.product_options.options.find(option => option.id === selectedProductOption).title : product.name;

			label = product.product_type !== ServerPizzaAssistantProductType.SPECIAL && !label ? name : label;

			const description = product.description;

			const cartConfigIds = product.cart_request.child_items && product.cart_request.child_items.length > 0 ?
				product.cart_request.child_items.find(childItem => childItem.line_id === productCache.line_id).config_options :
				product.cart_request.config_options;

			const nonDefaultConfigTitles = productCache.configuration_options
				.filter(config => config.quantity < 1 && cartConfigIds.find(obj => obj.config_code === config.id))
				.sort(function (leftProduct, rightProduct) {
					return leftProduct.sequence - rightProduct.sequence;
				})
				.map(config => {
					const configOptionsObject = cartConfigIds.find(obj => obj.config_code === config.id);
					const configOptionsQuantity = configOptionsObject.quantity && configOptionsObject.quantity > 1 ?
						'(X' + configOptionsObject.quantity + ')' : '';
					const descriptionWithAmount = config.title + configOptionsQuantity;
					return descriptionWithAmount;
				})


			let pizzaAssistantDescription = nonDefaultConfigTitles.slice(0, 3).join(', ');
			pizzaAssistantDescription = nonDefaultConfigTitles.length > 3 ? pizzaAssistantDescription + '...' : pizzaAssistantDescription;

			const baseUrl = baseUrls.product

			return {
				id: productCache.product_id,
				name: name,
				description: description,
				image: baseUrl + '2x/' + img,
				priceText: {
					labels: product.price_text.label,
					priceValue: product.price_text.price_value
				},
				isCustomizationAllowed: productCache.allow_customization,
				isComboProduct: productCache.kind === 'combo' ? true : false,
				seoTitle: productCache.seo_title,
				quantity: quantity,
				lineId: product.lineId,
				isSelected: true,
				isAddableToCartWithoutCustomization: false,
				pizzaAssistantLabel: label ? label : null,
				pizzaAssistantDescription,
				isConfigRequired: isConfigRequired
			} as Product
		});
	}

	/**
	 * Return Array of Config Options to be used as description.
	 */
	static buildProductDescription(configCache: ServerProductConfigProduct, cartConfigIds: AddCartProductServerConfigOption[]) {
		return configCache.configuration_options
			.filter(config => cartConfigIds.find(obj => obj.config_code === config.id))
			.sort(function (leftProduct, rightProduct) {
				return leftProduct.sequence - rightProduct.sequence;
			})
			.map(config => {
				const configOptionsObject = cartConfigIds.find(obj => obj.config_code === config.id);
				const configOptionsQuantity = configOptionsObject.quantity && configOptionsObject.quantity > 1 ?
					'(X' + configOptionsObject.quantity + ')' : '';
				const descriptionWithAmount = config.title + configOptionsQuantity;
				return descriptionWithAmount;
			})
	}
}
