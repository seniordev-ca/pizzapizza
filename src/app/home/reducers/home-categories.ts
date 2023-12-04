// Models
import { Category } from '../../catalog/models/category';
// Actions
import {
	CategoriesActions,
	CatalogCategoriesTypes
} from '../../catalog/actions/category'

// Reducer Mapping Helper
import { HomeCategoriesReducerHelper } from './mappers/home-categories-mapper';

export interface State {
	viewHomeCat: Category[],
	isFetched: boolean;
}

export const initialState: State = {
	viewHomeCat: [],
	isFetched: false
}

/**
 * Categories reducer
 */
export function reducer(
	state = initialState,
	action: CategoriesActions
): State {

	switch (action.type) {

		// Add in the other switch cases after mapping is complete - we need categories load state and fail state handling
		// Actions are getting renedered through the effects package
		case CatalogCategoriesTypes.FetchCategoriesSuccess: {
			const serverCategories = action.categoriesArr;

			const viewHomeCat = HomeCategoriesReducerHelper.parseHomeCategoriesInfo(
				serverCategories, action.baseUrl
			);

			return {
				...state,
				viewHomeCat,
				isFetched: true
			}
		}

		case CatalogCategoriesTypes.ReloadCategories: {
			return {
				...state,
				...initialState
			}
		}

		default: {
			return state;
		}
	}
}

export const getAllCategories = (state: State) => {
	return state.viewHomeCat;
}
