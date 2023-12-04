import { ServerProductMetaUi } from './server-product-ui'

export interface ServerCategoriesInterface {
	id: number,
	parent_id: number,
	products_available: boolean,
	name: string,
	image?: {
		is_full_width: boolean,
		name: string
	},
	sequence?: number,
	description: string,
	seo_title: string,
	ui_metadata: ServerProductMetaUi,
}
