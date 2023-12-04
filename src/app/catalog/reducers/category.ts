// ng rx
import {
	createEntityAdapter,
	EntityAdapter,
	EntityState
} from '@ngrx/entity';

// Models
import { ServerCategoriesInterface } from '../models/server-category';
import { SubCategoryInterface } from '../components/common/sub-category-selector/sub-category-selector.component';
import { SubHeaderNavigationInterface } from '../../common/components/shared/sub-header-navigation/sub-header-navigation.component';
// Actions
import {
	CategoriesActions,
	CatalogCategoriesTypes
} from '../actions/category'


export interface State extends EntityState<ServerCategoriesInterface> {
	isLoading: boolean,
	isFetched: boolean,
	ids: number[],
	selectedId: string | null;
	selectedParent: SubHeaderNavigationInterface,
	subCategories: SubCategoryInterface[];
}

export const adapter: EntityAdapter<ServerCategoriesInterface> = createEntityAdapter<ServerCategoriesInterface>({
	selectId: (category: ServerCategoriesInterface) => category.id,
	sortComparer: false
})

export const initialState: State = adapter.getInitialState({
	isLoading: true,
	isFetched: false,
	ids: [],
	selectedId: null,
	selectedParent: {
		title: '',
	} as SubHeaderNavigationInterface,
	subCategories: []
})

class CategoryMapperHelper {
	/**
	 * Map subcategories to UI Interface
	 */
	static mapSubCategories(subCategories, currentSelected): SubCategoryInterface[] {
		if (!subCategories) {
			return null;
		}
		return subCategories.sort(function (leftProduct, rightProduct) {
			return leftProduct.sequence - rightProduct.sequence;
		}).map(item => {
			return {
				title: item.title ? item.title : item.name,
				id: item.id,
				isSelected: item.id === currentSelected
			}
		})
	}


	/**
	 * Update subcategories
	 */
	static updateSubCategories(subcategories, currentSelected): SubCategoryInterface[] {
		subcategories.forEach(item =>
			item.isSelected = item.id === currentSelected
		)
		return subcategories;
	}


	/**
	 * Map the Top Content on a Product Category Page
	 */
	static mapSelectedParentCategory(category, baseUrl): SubHeaderNavigationInterface {
		if (!category) {
			return {
				title: '',
			} as SubHeaderNavigationInterface;
		}
		const isImageValid = category.image.name && category.image.name !== '' ? true : false;
		return {
			title: category.name,
			backgroundImage: isImageValid ? baseUrl + '2x/' + category.image.name : null,
			hasBackgroundImage: isImageValid ? category.image.is_full_width : false
		} as SubHeaderNavigationInterface
	}
}

/**
 * Categories reducer
 */
export function reducer(
	state = initialState,
	action: CategoriesActions
): State {
	switch (action.type) {
		case CatalogCategoriesTypes.ReloadCategories: {
			return adapter.removeAll({
				...state,
				...initialState
			});
		}
		case CatalogCategoriesTypes.FetchCategories: {
			return adapter.removeAll({
				...state,
				isLoading: true,
				isFetched: false,
				selectedId: null,
				selectedParent: {
					title: '',
				} as SubHeaderNavigationInterface,
				subCategories: []
			});
		}

		case CatalogCategoriesTypes.FetchCategoriesSuccess: {
			const categories = action.categoriesArr;

			return adapter.upsertMany(categories, {
				...state,
				isLoading: false,
				isFetched: true
			});
		}

		case CatalogCategoriesTypes.ImportFeatureCategory: {
			const categories = action.categoriesArr;
			if (categories) {
				return adapter.upsertMany(categories, {
					...state
				});
			} else {
				return {
					...state
				}
			}
		}

		case CatalogCategoriesTypes.FetchCategoriesFailure: {
			return {
				...state,
				isLoading: false,
				isFetched: false
			}
		}

		case CatalogCategoriesTypes.GetProductCategory: {
			const entities = state.entities;
			const ids = state.ids;
			const currentSelected = state.selectedId;
			let selectedId: string;
			const arrayOfEntities = []

			ids.map(id => {
				arrayOfEntities.push(entities[id])
			});

			const selectedParent = arrayOfEntities.find(product => product.seo_title === action['payload']);
			let subCategories = [];
			if (selectedParent) {
				subCategories = arrayOfEntities.filter(product => product.parent_id === selectedParent['id'])
					.sort(function (leftProduct, rightProduct) {
						return leftProduct.sequence - rightProduct.sequence;
					});
				selectedId = subCategories[0] ? subCategories[0].id : selectedParent.id;
			}

			return {
				...state,
				selectedParent: CategoryMapperHelper.mapSelectedParentCategory(selectedParent, action['baseUrl']),
				subCategories: CategoryMapperHelper.mapSubCategories(subCategories, selectedId),
				selectedId
			}
		}

		case CatalogCategoriesTypes.ChangeSelectedCategory: {
			const subCategories = state.subCategories;
			return {
				...state,
				subCategories: CategoryMapperHelper.updateSubCategories(subCategories, action.payload),
				selectedId: action.payload
			}
		}

		default: {
			return state;
		}
	}
}


export const getIds = (state: State) => state.ids;
export const getIsCategoriesLoading = (state: State) => {
	return state.isLoading && !state.isFetched;
}
export const getIsCategoriesError = (state: State) => {
	return !state.isLoading && !state.isFetched;
}

