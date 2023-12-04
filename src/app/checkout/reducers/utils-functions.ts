
// Server model
import {
	AddCartProductServerConfigOption
} from '../models/server-cart-request';

import {
	ServerProductConfig,
	ServerProductConfigProduct,
	ServerConfigOptions
} from 'app/catalog/models/server-product-config';

export class CartHelper {
	/**
	 * Ger server data by given line id
	 */
	static getServerDataForProductByLineId(lineId: number, serverProduct: ServerProductConfig): ServerProductConfigProduct {
		const currentProductServerData = serverProduct.data.products.find(serverFullProductData => serverFullProductData.line_id === lineId);
		return currentProductServerData
	}
	/**
	 * Create array of default toppings on product
	 */
	static getDefaultToppings(serverDataForProduct: ServerProductConfigProduct) {
		const defaultOptionsSelected = [];
		serverDataForProduct.configuration_options.forEach(option => {
			const proOptServerDataSelected = option.product_options_data
				.find(productOption => productOption.selected);
			if (proOptServerDataSelected) {
				defaultOptionsSelected.push(option);
			}
		})
		return defaultOptionsSelected
	}
	/**
	 * Exchange or remove unavailable ingredient in product
	 */
	static SubstituteRemoveUnavailableTopping(
		unavailableConfigOption: AddCartProductServerConfigOption,
		parentIdUnavailableIngredient,
		defaultToppingsForProduct: ServerConfigOptions[],
		serverDataForProduct: ServerProductConfigProduct) {
// AddCartProductServerConfigOption
		let isExchanged = true;
		let amountOfFalse = 0;
		defaultToppingsForProduct.forEach(defaultTopping => {
			const parentIdsSame = defaultTopping.parent_id === parentIdUnavailableIngredient.parentId ? true : false;

			if (parentIdsSame) {
				serverDataForProduct.configurations.forEach(configuration => {
					let isMultipleOptionsAllowed = null;
					isMultipleOptionsAllowed = configuration.sub_configurations
						.find(subconfig => subconfig.id === parentIdUnavailableIngredient.parentId)
					if (isMultipleOptionsAllowed && !isMultipleOptionsAllowed.allow_multiple_options) {
						// substitute with default since multiple options are not allowed
						unavailableConfigOption.config_code = defaultTopping.id;
					}
				})
			} else {
				amountOfFalse++;
			}
			// if unavailable ingredient is not in default toppings
			// TODO: we need to notify user that we completely remove this instead of substitution like in case of dough
			if (amountOfFalse === defaultToppingsForProduct.length) {
				isExchanged = false
			}
		})
		return {unavailableConfigOption, isExchanged};
	}
}
