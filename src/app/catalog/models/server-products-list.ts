import { ServerProductMetaUi } from './server-product-ui';
import { ServerProductInListInterface } from './server-product-in-list';

export interface ServerProductList {
	category: {
		description: string,
		id: number,
		image: {
			is_full_width: boolean,
			name: string
		},
		name: string,
		parent_id: number,
		products_available: boolean,
		seo_title: string,
		ui_metadata: ServerProductMetaUi
	},
	products: [
		ServerProductInListInterface
	],
	isSelected?: boolean,
}
