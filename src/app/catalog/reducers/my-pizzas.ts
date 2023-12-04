// ng rx
import {
	createEntityAdapter,
	EntityAdapter,
	EntityState
} from '@ngrx/entity';

// Models
import { Product } from '../models/product';

// Actions
import {
	CatalogMyPizzaTypes,
	MyPizzasActions
} from '../actions/my-pizzas'
import { CartActions, CartActionsTypes } from '../../checkout/actions/cart';
import { ProductListMapperHelper } from './mappers/product-list'
import { ServerProductInListInterface } from '../models/server-product-in-list';
import { SubHeaderNavigationInterface } from '../../common/components/shared/sub-header-navigation/sub-header-navigation.component';
export interface State extends EntityState<ServerProductInListInterface> {
	isLoading: boolean,
	isFetched: boolean,
	ids: number[];
	selectedId: number | null;
	selectedProductList: Product[],
	myPizzaCategory: SubHeaderNavigationInterface
}

export const adapter: EntityAdapter<ServerProductInListInterface> = createEntityAdapter<ServerProductInListInterface>({
	selectId: (pizza: ServerProductInListInterface) => pizza.id,
	sortComparer: false
})

export const initialState: State = adapter.getInitialState({
	isLoading: true,
	isFetched: false,
	ids: [],
	selectedId: null,
	selectedProductList: [],
	myPizzaCategory: {
		title: '',
	} as SubHeaderNavigationInterface,
})

/**
 * Categories reducer
 */
export function reducer(
	state = initialState,
	action: MyPizzasActions | CartActions
): State {
	switch (action.type) {
		case CatalogMyPizzaTypes.FetchMyPizzaList: {
			return ({
				...state,
				isLoading: true,
				isFetched: false,
				selectedProductList: []
			});
		}
		case CatalogMyPizzaTypes.FetchMyPizzaListSuccess: {
			const changes = action.payload;
			const baseUrl = action.baseUrl;
			const categoryBase = action.categoryBase
			const mappedCategory = {
				title: changes.category.name,
				backgroundImage: categoryBase + '2x/' + changes.category.image.name,
				hasBackgroundImage: changes.category.image.is_full_width
			} as SubHeaderNavigationInterface
			return adapter.upsertMany(changes.products, {
				...state,
				isLoading: false,
				isFetched: true,
				selectedProductList: ProductListMapperHelper.buildProductList(changes.products, baseUrl),
				myPizzaCategory: mappedCategory
			});
		}

		case CatalogMyPizzaTypes.FetchMyPizzaListFailure: {
			return {
				...state,
				isLoading: false,
				isFetched: false,
			}
		}

		case CartActionsTypes.AddAdvancedProductToCart: {
			const selectedId = action.productId;
			const selectedProduct = state.selectedProductList.find(product => product.pizzaId === selectedId) ?
				state.selectedProductList.find(product => product.pizzaId === selectedId).isLoading = true : null;

			return {
				...state,
			}
		}

		case CartActionsTypes.AddAdvancedProductToCartFailure:
		case CartActionsTypes.AddAdvancedProductToCartSuccess:
		case CartActionsTypes.TooManyItemsInCartFailure: {
			const loadingProducts = state.selectedProductList.filter(product => product.isLoading);
			loadingProducts.map(product => product.isLoading = false);
			return {
				...state
			}
		}

		case CatalogMyPizzaTypes.ReloadMyPizzaList: {
			return adapter.removeAll({
				...initialState
			})
		}
		default: {
			return state;
		}
	}
}


export const getIds = (state: State) => state.ids;
export const getIsMyPizzaListLoading = (state: State) => {
	return state.isLoading && !state.isFetched;
}
export const getIsMyPizzaListError = (state: State) => {
	return !state.isLoading && !state.isFetched;
}

