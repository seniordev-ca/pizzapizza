import { ServerCartResponseProductListInterface } from '../../checkout/models/server-cart-response';

export interface ServerProductInListInterface {
	allergens: boolean,
	allow_add_to_cart: boolean,
	allow_customization: boolean,
	allow_qty_selection: boolean,
	allow_quick_add: boolean,
	cal_text: string,
	description: string,
	product_id: string,
	image: string,
	legal: string,
	marketing_badge: {
		color: string,
		font_key: string,
		text: string
	},
	name: string,
	price_text: {
		price_value: number,
		labels: string
	},
	seo_title: string,
	sequence: number,
	subTitle: string,
	kind: string,
	cart_request: ServerCartResponseProductListInterface,
	product_tag?: string,
	id?: string,
	lineId?: number,
	template?: string,
	color_background?: string,
	color_one?: string,
	color_two?: string,
	quantity?: number,
	is_wp_image?: boolean
}
