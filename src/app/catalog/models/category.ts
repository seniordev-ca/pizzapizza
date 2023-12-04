
import { ServerProductMetaUi } from './server-product-ui'

/**
 * Category
 */
export interface Category {
	id: number,
	parentId: number,
	productsAvailable: boolean,
	name: string,
	image: string,
	sequence: number,
	seoTitle: string,
	uiMetadata: ServerProductMetaUi,
	parentSequence?: number
}
