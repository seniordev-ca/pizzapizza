// ng rx
import {
	createEntityAdapter,
	EntityAdapter,
	EntityState
} from '@ngrx/entity';

// Models
import {
	ServerProductConfig
} from '../models/server-product-config';

// Actions
import {
	CatalogComboConfigListTypes, ComboConfigActions
} from '../actions/combo-config'
import { CartActionsTypes, CartActions } from '../../checkout/actions/cart';
import { ConfiguratorActionsTypes, ConfiguratorActions } from '../actions/configurator';

export interface State extends EntityState<ServerProductConfig> {
	isLoading: boolean,
	isFetched: boolean,
	isEditMode: boolean,
	activeProductSlug: string,
	ids: number[];
	serverCombo?: ServerProductConfig,
	baseUrl: string,
	configBaseUrl: string,

	isCartProductCopiedToConfigurable: boolean,
	cartItemId: number,

	isComboPristine: boolean
}

export const adapter: EntityAdapter<ServerProductConfig> = createEntityAdapter<ServerProductConfig>({
	selectId: (combo: ServerProductConfig) => combo.seo_title,
	sortComparer: false
})

export const initialState: State = adapter.getInitialState({
	isLoading: true,
	isFetched: false,
	isEditMode: false,
	activeProductSlug: null,
	ids: [],
	baseUrl: null,
	configBaseUrl: null,

	isCartProductCopiedToConfigurable: false,
	cartItemId: null,
	isComboPristine: true
})

/**
 * Combo Config reducer
 */
export function reducer(
	state = initialState,
	action: CartActions | ComboConfigActions | ConfiguratorActions
): State {
	switch (action.type) {
		case CatalogComboConfigListTypes.FetchComboConfig: {
			return ({
				...state,
				isLoading: true,
				isFetched: false,
			});
		}

		case CatalogComboConfigListTypes.FetchComboConfigSuccess: {
			const serverComboConfig = action.productComboServerConfig;
			const productComboServerConfig = action.imageBaseUrls;

			const activeProductSlug = serverComboConfig.seo_title;
			// Products base images
			const baseUrl = productComboServerConfig.combo;
			// const parentBaseUrl = productComboServerConfig.product;
			const configBaseUrl = productComboServerConfig.toppings;

			return adapter.upsertOne(
				serverComboConfig, {
					...state,
					isLoading: false,
					isFetched: true,
					activeProductSlug,
					serverCombo: action.productComboServerConfig,
					baseUrl,
					configBaseUrl
				});
		}

		case CatalogComboConfigListTypes.FetchComboConfigFailure: {
			return {
				...state,
				isLoading: false,
				isFetched: false,
			}
		}

		case CatalogComboConfigListTypes.AddValidIncompleteComboToCart: {

			return {
				...state
			}
		}

		case CatalogComboConfigListTypes.ReloadComboConfig: {
			return adapter.removeAll({
				...state,
				...initialState,
			})
		}

		case CartActionsTypes.BuildComboProductAddToCartRequest: {
			const cartItem = action.cardProduct;
			const isCartProductCopiedToConfigurable = cartItem ? true : false
			const cartItemId = isCartProductCopiedToConfigurable ? cartItem.cart_item_id : null

			return {
				...state,
				isCartProductCopiedToConfigurable,
				cartItemId,
				isEditMode: isCartProductCopiedToConfigurable,
			}
		}

		case CatalogComboConfigListTypes.SetComboConfigToPristine:
		case CartActionsTypes.UpdateComboToCartSuccess:
		case CartActionsTypes.AddComboToCartSuccess: {
			return {
				...state,
				isComboPristine: true
			}
		}

		case CatalogComboConfigListTypes.IncreaseComboQuantity:
		case CatalogComboConfigListTypes.DecreaseComboQuantity:
		case ConfiguratorActionsTypes.ResetComboProductInCartRequestArray:
		case ConfiguratorActionsTypes.ConfigureComboProductInModal: {
			return {
				...state,
				isComboPristine: false
			}
		}
		default: {
			return state;
		}
	}
}


export const getIds = (state: State) => state.ids;
export const getIsComboConfigLoading = (state: State) => {
	return state.isLoading && !state.isFetched;
}
export const getIsComboConfigError = (state: State) => {
	return !state.isLoading && !state.isFetched;
}

