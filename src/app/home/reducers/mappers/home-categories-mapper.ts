// Server Model
import { ServerCategoriesInterface } from '../../../catalog/models/server-category';

// View Model
import { Category } from '../../../catalog/models/category';


/**
 * The role of this class is to map server response to view model
 */
export class HomeCategoriesReducerHelper {

	/**
	 * Maps Category Info
	 */
	static parseHomeCategoriesInfo(
		serverCategories: ServerCategoriesInterface[],
		baseUrl
	): Category[] {

		// Get all top level parents
		const serverParentCategories = serverCategories.filter(obj => obj.parent_id === 0).map(obj => obj.id);

		// Filter all direct children of top level parents - sorted by sequence
		const serverDirectChildren = serverCategories
			.filter(obj => serverParentCategories.indexOf(obj.parent_id) > -1)
			.sort(function (leftCategory, rightCategory) {
				return leftCategory.sequence - rightCategory.sequence
			})
		const mappedItems = serverDirectChildren.map(serverCat => {
			const isImageValid = serverCat.image.name && serverCat.image.name !== '' ? true : false;
			const parentSequence = serverCategories.find(obj => obj.parent_id === serverCat.parent_id).sequence * 1000;
			return {
				id: serverCat.id,
				parentId: serverCat.parent_id,
				productsAvailable: serverCat.products_available,
				name: serverCat.name,
				image: isImageValid ? baseUrl + '2x/' + serverCat.image.name : null,
				sequence: serverCat.sequence,
				parentSequence,
				seoTitle: serverCat.seo_title,
				uiMetadata: serverCat.ui_metadata
			} as Category
		}).sort(function (leftCategory, rightCategory) {
			return rightCategory.parentSequence - leftCategory.parentSequence
		})

		return mappedItems


	}

}
