// ng rx
import {
	createEntityAdapter,
	EntityAdapter,
	EntityState
} from '@ngrx/entity';

// Actions
import {
	JustForYouActions,
	JustForYouTypes
} from '../actions/just-for-you';
import {
	RecommendationInterface,
} from '../../home/models/recommendations';
import { SignUpActionTypes, SignUpActions } from '../../user/actions/sign-up-actions';
import { JustForYouReducerHelper } from './mappers/just-for-you'
import { SubHeaderNavigationInterface } from '../../common/components/shared/sub-header-navigation/sub-header-navigation.component';
import { ServerProductList } from '../models/server-products-list';

import {ProductListMapperHelper} from './mappers/product-list';
import { Product } from '../models/product';
import { ServerCartResponseProductListInterface } from '../../checkout/models/server-cart-response';
import { ComboConfigDetails } from '../models/combo-config';
import { CartActionsTypes, CartActions } from '../../checkout/actions/cart';
import { OrderActions, OrderActionsTypes } from '../../checkout/actions/orders';
export interface State extends EntityState<ServerProductList> {
	isLoading: boolean,
	isFetched: boolean,
	ids: number[];
	selectedId: number | null;
	justForYouProducts: RecommendationInterface[],
	justForYouHeaderMeta: SubHeaderNavigationInterface,
	selectedProductList: Product[],
	selectedHeaderMeta: ComboConfigDetails,
	selectedProductsCartRequest: ServerCartResponseProductListInterface[]
	serverProductsCartRequest: ServerCartResponseProductListInterface[]

}

export const adapter: EntityAdapter<ServerProductList> = createEntityAdapter<ServerProductList>({
	selectId: (justForYouSlide: ServerProductList) => justForYouSlide.category.seo_title,
	sortComparer: false
})

export const initialState: State = adapter.getInitialState({
	isLoading: true,
	isFetched: false,
	ids: [],
	selectedId: null,
	justForYouProducts: [],
	justForYouHeaderMeta: {
		title: '',
	} as SubHeaderNavigationInterface,
	selectedProductList: null,
	selectedHeaderMeta: {
		name: '',
	} as ComboConfigDetails,
	selectedProductsCartRequest: null,
	serverProductsCartRequest: null
})

/**
 * Just for you reducer
 */
export function reducer(
	state = initialState,
	action: JustForYouActions | SignUpActions | CartActions | OrderActions
): State {
	switch (action.type) {
		case JustForYouTypes.ReloadJustForYou: {
			return adapter.removeAll({
				...state,
				...initialState
			});
		}
		case JustForYouTypes.FetchJustForYou: {
			return ({
				...state,
				isLoading: true,
				isFetched: false
			});
		}

		case JustForYouTypes.FetchJustForYouSuccess: {
			const changes = action.payload;
			const baseUrl = action.baseUrl;
			const categoryBase = action.categoryBase
			const mappedChanges = JustForYouReducerHelper.parseJustForYouList(changes, baseUrl)
			const mappedHeader = {
				title: changes.meta.title,
				backgroundImage: categoryBase + '2x/' + changes.meta.image,
				hasBackgroundImage: true
			} as SubHeaderNavigationInterface
			return {
				...state,
				isLoading: false,
				isFetched: true,
				justForYouProducts: mappedChanges,
				justForYouHeaderMeta: mappedHeader
			};
		}

		case JustForYouTypes.FetchJustForYouFailure: {
			return {
				...state,
				isLoading: false,
				isFetched: false
			}
		}

		case JustForYouTypes.FetchJustForYouProductList:
		case JustForYouTypes.FetchJustForYouProductListFailure: {
			return {
				...state,
				isLoading: true,
				isFetched: false,
				selectedProductList: null,
				selectedHeaderMeta: {
					name: '',
				} as ComboConfigDetails,
				selectedProductsCartRequest: null,
				serverProductsCartRequest: null
			}
		}
		case JustForYouTypes.FetchJustForYouProductListSuccess: {
			const changes = action.payload;
			const baseUrl = action.baseUrl;
			const categoryBase = action.categoryBase;
			const selectedHeaderMeta = {
				name: changes.category.name,
				image: categoryBase + '2x/' + changes.category.image.name,
				quantity: 1,
			} as ComboConfigDetails
			let mappedProducts = ProductListMapperHelper.buildProductList(changes.products, baseUrl)
			mappedProducts = mappedProducts.map(product => {
				return {
					...product,
					isCustomizationAllowed: false,
					isQuantitySelectionAllowed: true,
				}
			})
			const selectedProductsCartRequest = changes.products.map(product => {
				return {
					...product.cart_request,
					product_id: product.product_id,
					quantity: selectedHeaderMeta.quantity,
					child_items: product.cart_request.child_items ? product.cart_request.child_items : []
				}
			})

			return adapter.upsertOne(changes, {
				...state,
				isLoading: false,
				isFetched: true,
				selectedProductList: mappedProducts,
				selectedHeaderMeta,
				selectedProductsCartRequest,
				serverProductsCartRequest: selectedProductsCartRequest
			});
		}

		case JustForYouTypes.UpdateJFYProductQuantity: {
			const productId = action.productId;
			const quantity = action.quantity;
			let selectedProductsCartRequest = state.selectedProductsCartRequest;
			selectedProductsCartRequest = selectedProductsCartRequest.map(product => {
				return {
					...product,
					quantity: product.product_id === productId ? quantity : product.quantity
				}
			})
			return {
				...state,
				selectedProductsCartRequest
			}
		}

		case JustForYouTypes.UpdateJFYGroupQuantity: {
			const selectedHeaderMeta = state.selectedHeaderMeta;
			const quantity = action.isIncrease ? selectedHeaderMeta.quantity + 1 : selectedHeaderMeta.quantity - 1;

			let selectedProductsCartRequest = state.selectedProductsCartRequest;
			selectedProductsCartRequest = selectedProductsCartRequest.map(product => {
				let productQuantity = product.quantity
				if (action.isIncrease) {
					productQuantity = productQuantity < quantity ? quantity : productQuantity
				} else {
					productQuantity = productQuantity > quantity ? quantity : productQuantity
				}
				return {
					...product,
					quantity: productQuantity
				}
			})

			selectedHeaderMeta.quantity = quantity;

			return {
				...state,
				selectedHeaderMeta,
				selectedProductsCartRequest
			}
		}

		case JustForYouTypes.SelectJFYProduct: {
			const productId = action.productId;
			let selectedProductList = state.selectedProductList;

			let selectedProductsCartRequest = state.selectedProductsCartRequest;
			const isInCartRequest = selectedProductsCartRequest.find(product => product.product_id === productId)
			if (isInCartRequest) {
				selectedProductsCartRequest = selectedProductsCartRequest.filter(product => product.product_id !== productId)
			} else {
				const serverCartRequest = state.serverProductsCartRequest.find(product => product.product_id === productId)
				selectedProductsCartRequest.push(serverCartRequest)
			}

			selectedProductList = selectedProductList.map(product => {
				const isInCurrentCart = selectedProductsCartRequest.find(cartProduct => cartProduct.product_id === product.id)

				return {
					...product,
					isQuantitySelectionAllowed: isInCurrentCart ? true : false
				}
			})

			return {
				...state,
				selectedProductsCartRequest,
				selectedProductList
			}
		}

		case SignUpActionTypes.UserLogsOut:
		case SignUpActionTypes.UserLoginSuccess:
		case SignUpActionTypes.RegisterNewUserSuccess:
		case SignUpActionTypes.GetUserSummarySuccess:
		case OrderActionsTypes.ProcessOrderRequestSuccess: {
			return {
				...initialState
			}
		}

		case CartActionsTypes.AddProductArrayToCart:
		case CartActionsTypes.AddProductArrayToCartSuccess:
		case CartActionsTypes.AddProductArrayToCartFailure:
		case CartActionsTypes.TooManyItemsInCartFailure: {
			const selectedHeaderMeta = state.selectedHeaderMeta
			selectedHeaderMeta.isSelected = !selectedHeaderMeta.isSelected;
			return {
				...state,
				selectedHeaderMeta
			}
		}

		default: {
			return state;
		}
	}
}

export const getIds = (state: State) => state.ids;
export const getIsJustForYouLoading = (state: State) => {
	return state.isLoading && !state.isFetched;
}
export const getIsJustForYouError = (state: State) => {
	return !state.isLoading && !state.isFetched;
}
