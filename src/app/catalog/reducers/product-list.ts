// ng rx
import {
	createEntityAdapter,
	EntityAdapter,
	EntityState
} from '@ngrx/entity';

// Models
import { ServerProductList } from '../models/server-products-list';
import { Product } from '../models/product';

// Actions
import {
	ProductListActions,
	CatalogProductListTypes
} from '../actions/product-list'
import { CartActions, CartActionsTypes } from '../../checkout/actions/cart';
import { ProductListMapperHelper } from './mappers/product-list'
export interface State extends EntityState<ServerProductList> {
	isLoading: boolean,
	isFetched: boolean,
	ids: number[];
	selectedId: number | null;
	selectedProductList: Product[]
}

export const adapter: EntityAdapter<ServerProductList> = createEntityAdapter<ServerProductList>({
	selectId: (category: ServerProductList) => category.category.id,
	sortComparer: false
})

export const initialState: State = adapter.getInitialState({
	isLoading: true,
	isFetched: false,
	ids: [],
	selectedId: null,
	selectedProductList: []
})

/**
 * Categories reducer
 */
export function reducer(
	state = initialState,
	action: ProductListActions | CartActions
): State {
	switch (action.type) {
		case CatalogProductListTypes.FetchProductList: {
			return ({
				...state,
				isLoading: true,
				isFetched: false,
				selectedProductList: []
			});
		}
		case CatalogProductListTypes.FetchProductListSuccess: {
			const changes = action.payload;
			const id = changes.category.id;
			const baseUrl = action.baseUrl;
			return adapter.upsertOne(changes, {
				...state,
				isLoading: false,
				isFetched: true,
				selectedProductList: ProductListMapperHelper.buildProductList(changes.products, baseUrl)
			});
		}

		case CatalogProductListTypes.FetchProductListFailure: {
			return {
				...state,
				isLoading: false,
				isFetched: false,
			}
		}

		case CatalogProductListTypes.UpdateProductQuantity: {
			state.selectedProductList.find(product => action.productId === product.id).quantity = action.quantity;
			return {
				...state,
				// selectedProductList
			}
		}

		case CatalogProductListTypes.ReloadProductList: {
			return adapter.removeAll({
				...state,
				...initialState
			})
		}

		case CartActionsTypes.AddBasicProductToCart: {
			const selectedId = action.productId;
			if (action.isRecommendation) {
				return {
					...state
				}
			}
			const selectedProduct = state.selectedProductList.find(product => product.id === selectedId);
			selectedProduct.isLoading = true;

			return {
				...state,
			}
		}

		case CartActionsTypes.AddBasicProductToCartFailure:
		case CartActionsTypes.AddBasicProductToCartSuccess:
		case CartActionsTypes.TooManyItemsInCartFailure: {
			const loadingProducts = state.selectedProductList.filter(product => product.isLoading);
			loadingProducts.map(product => product.isLoading = false);
			return {
				...state
			}
		}
		default: {
			return state;
		}
	}
}


export const getIds = (state: State) => state.ids;
export const getIsProductListLoading = (state: State) => {
	return state.isLoading && !state.isFetched;
}
export const getIsProductListError = (state: State) => {
	return !state.isLoading && !state.isFetched;
}

