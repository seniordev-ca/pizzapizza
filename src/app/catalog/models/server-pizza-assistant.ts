import { ServerProductConfig } from './server-product-config';
import { AddToCartProductServerRequestInterface } from '../../checkout/models/server-cart-request';

export interface ServerPizzaAssistantResponse {
	cart_products: ServerPizzaAssistantProduct[],
	message: string
}
export interface ServerPizzaAssistantProduct {
	calories: number
	calories_range: string
	cart_request: AddToCartProductServerRequestInterface
	config_cache: ServerProductConfig
	description: string
	is_calories_static: boolean
	is_config_required?: boolean
	name: string
	price_text: {
		price_value: number,
		label: string
	},
	lineId?: number,
	product_type: ServerPizzaAssistantProductType
}

export interface ServerPizzaAssistantHelp {
	help: string[]
}
/**
 * Enum for different product types (determines on how we show the name)
 */
export enum ServerPizzaAssistantProductType {
	DEFAULT,
	PIZZA,
	SPECIAL,
	COMBO
}

export interface ServerPizzaAssistantCombo {
	name: string,
	seo_title: string
}
