// ng rx
import {
	createEntityAdapter,
	EntityAdapter,
	EntityState
} from '@ngrx/entity';

// Actions
import { PizzaAssistantActions, PizzaAssistantActionTypes } from '../actions/pizza-assistant';
import {
	ServerPizzaAssistantProduct,
	ServerPizzaAssistantHelp,
	ServerPizzaAssistantProductType,
	ServerPizzaAssistantCombo
} from '../models/server-pizza-assistant';
import { CartActionsTypes, CartActions } from 'app/checkout/actions/cart';
import { ProductListMapperHelper } from './mappers/product-list';

export interface State extends EntityState<ServerPizzaAssistantProduct> {
	isLoading: boolean
	isFetched: boolean
	isHelpConfigLoading: boolean
	isHelpConfigFetched: boolean
	isHelpConfigError: boolean
	helpConfigData: ServerPizzaAssistantHelp
	ids: number[]
	selectedId: number | null
	assistantMessage: string
	productImageBaseUrl: string
	activeLineId: number,
	comboProduct: ServerPizzaAssistantCombo
}

export const adapter: EntityAdapter<ServerPizzaAssistantProduct> = createEntityAdapter<ServerPizzaAssistantProduct>({
	selectId: (pizza: ServerPizzaAssistantProduct) => pizza.lineId,
	sortComparer: false
})

export const initialState: State = adapter.getInitialState({
	isLoading: false,
	isFetched: false,
	isHelpConfigLoading: false,
	isHelpConfigFetched: false,
	isHelpConfigError: false,
	helpConfigData: null,
	ids: [],
	selectedId: null,
	assistantMessage: null,
	productImageBaseUrl: null,
	activeLineId: 1,
	comboProduct: null
})

/**
 * Categories reducer
 */
export function reducer(
	state = initialState,
	action: PizzaAssistantActions | CartActions
): State {
	switch (action.type) {
		case PizzaAssistantActionTypes.InitPizzaAssistant: {
			return adapter.removeAll({
				...initialState
			})
		}
		case PizzaAssistantActionTypes.SendPizzaAssistantMessage: {
			return {
				...state,
				assistantMessage: null,
				comboProduct: null,
				isLoading: true,
				isFetched: false,
			};
		}
		case PizzaAssistantActionTypes.SendPizzaAssistantMessageSuccess: {
			const changes = action.response;
			const baseUrl = action.baseUrl;
			let lineId = state.activeLineId;
			// Don't attempt to map combos here. They will be handled separately
			const products = changes.cart_products.filter(product => {
				const isCombo = product.product_type === ServerPizzaAssistantProductType.COMBO;
				const isConfigurable = product.config_cache.data.products.find(productCache => productCache.line_id === 1).allow_customization;
				return !(isCombo && isConfigurable)
			}).map(product => {
				const cartRequest = product.cart_request;
				cartRequest.line_id = lineId++;
				product.config_cache.data.products.forEach(configCache => {
					const configurationOptions = configCache.configuration_options;
					configCache.configurations.forEach(config => {
						config.sub_configurations.map(subconfig => {
							configurationOptions.filter(option => option.parent_id === subconfig.id)
								.forEach(productOption => {
									// Find current cal text
									const selectedProductOption = productOption.product_options_data
										.find((productOptionData) => productOptionData.product_option_id === cartRequest.product_option_id)

									const configSequence = selectedProductOption ? selectedProductOption.sequence : config.sequence;
									const itemSquence = (productOption.sequence * 1) + (subconfig.sequence * 100) + (configSequence * 1000)
									productOption.sequence = itemSquence
								});
						})
					})
					configCache.configuration_options = configurationOptions;
					const cartConfigIds = product.cart_request.config_options;
					const nonDefaultConfigTitles = ProductListMapperHelper.buildProductDescription(configCache, cartConfigIds)
					product.description = nonDefaultConfigTitles.join(', ');
				});
				return {
					...product,
					lineId
				}
			})

			const serverComboProduct = changes.cart_products.find(product => {
				const isCombo = product.product_type === ServerPizzaAssistantProductType.COMBO;
				const isConfigurable = product.config_cache.data.products.find(productCache => productCache.line_id === 1).allow_customization;
				return (isCombo && isConfigurable)
			});
			const comboProduct = serverComboProduct ? {
				name: serverComboProduct.name,
				seo_title: serverComboProduct.config_cache.seo_title
			} : null;

			return adapter.addMany(products, {
				...state,
				isLoading: false,
				isFetched: true,
				assistantMessage: changes.message,
				productImageBaseUrl: baseUrl,
				activeLineId: lineId,
				comboProduct
			});
		}

		case PizzaAssistantActionTypes.SendPizzaAssistantMessageFailure: {
			return {
				...state,
				isLoading: false,
				isFetched: false,
			}
		}

		case PizzaAssistantActionTypes.RemoveProductFromPizzaAssistant: {
			const lineId = action.lineId;
			return adapter.removeOne(lineId, {
				...state
			})
		}

		case PizzaAssistantActionTypes.UpdatePizzaAssistantProduct: {
			const lineId = action.lineId;
			const addToCartRequest = action.addToCartRequest;
			const price = action.price
			const activeItem = state.entities[lineId];
			const activeItemConfig = activeItem.config_cache.data.products[0]

			const productOptionIds = [];
			addToCartRequest.products.forEach(addToCartRequestProduct => {
				productOptionIds.push(addToCartRequestProduct.product_option_id);
			});
			// since current product exists on AddToCart it means its configuration is valid now so flag should be changed to true
			state.entities[lineId].is_config_required = false;
			activeItem.cart_request = addToCartRequest.products[0];

			const cartConfigIds = activeItem.cart_request.config_options;
			const nonDefaultConfigTitles = ProductListMapperHelper.buildProductDescription(activeItemConfig, cartConfigIds)

			activeItem.description = nonDefaultConfigTitles.join(', ');
			activeItem.price_text.price_value = price;

			return adapter.updateOne({ id: lineId, changes: activeItem }, {
				...state
			});
		}

		case PizzaAssistantActionTypes.FetchPizzaAssistantHelpConfig: {

			return {
				...state,
				isHelpConfigLoading: true,
				isHelpConfigFetched: false,
				isHelpConfigError: false
			}
		}
		case PizzaAssistantActionTypes.FetchPAConfigHelpSuccess: {
			return {
				...state,
				isHelpConfigLoading: false,
				isHelpConfigFetched: true,
				isHelpConfigError: false,
				helpConfigData: action.payload
			}
		}
		case PizzaAssistantActionTypes.FetchPAConfigHelpFailure: {
			return {
				...state,
				isHelpConfigLoading: false,
				isHelpConfigFetched: false,
				isHelpConfigError: true,
				helpConfigData: null
			}
		}
		case PizzaAssistantActionTypes.ClearPizzaAssistant:
		case CartActionsTypes.AddPizzaAssistantProductsToCartSuccess: {
			return adapter.removeAll({
				...state,
				comboProduct: null
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

