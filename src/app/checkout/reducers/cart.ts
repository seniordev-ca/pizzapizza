// ng rx
import {
	createEntityAdapter,
	EntityAdapter,
	EntityState
} from '@ngrx/entity';

// Server model
import {
	AddCartServerRequestInterface, AddCartProductServerRequestInterface, AddCartProductServerConfigOption
} from '../models/server-cart-request';
import {
	ServerCartResponseInterface,
	isValidationStoreClosed,
} from '../models/server-cart-response'

// Client models
import { Product } from '../../catalog/models/product';
import { OrderSummaryInterface } from '../models/order-checkout';

// Actions
import {
	CartActionsTypes, CartActions
} from '../actions/cart';

// models
import { HalfHalfOptionsEnum } from '../../catalog/models/configurator';
// Import data mapper
import { CartMapper } from './mappers/cart-mapper';
import { ConfiguratorActionsTypes, ConfiguratorActions } from '../../catalog/actions/configurator';
import { OrderActionsTypes, OrderActions } from '../actions/orders';
import { CatalogComboConfigListTypes, ComboConfigActions } from '../../catalog/actions/combo-config';
import { PaymentActionsTypes, PaymentActions } from '../actions/payment';
import { TemplateActionsTypes, TemplateActions } from '../../catalog/actions/personalized-templates';
import { StoreActionsTypes, StoreActions } from 'app/common/actions/store';

// helper functions
import { CartHelper } from '../reducers/utils-functions'
import { ServerProductConfigProduct } from 'app/catalog/models/server-product-config';
export interface State extends EntityState<Product> {
	ids: number[],
	isLoading: boolean,
	isFetched: boolean,
	isUpdating: boolean,

	isCartHidden: boolean,

	isCartProductCopiedToConfigurable: boolean,

	viewCartItems: Product[],
	viewCartSummary: OrderSummaryInterface,

	isCartValid: boolean,
	invalidCartProducts: string[],

	serverCart: ServerCartResponseInterface,
	addToCartRequest: AddCartServerRequestInterface,
	backupCartRequest: AddCartServerRequestInterface,

	cartClubEarnings: {
		registered: string,
		unregistered: string
	}
	previousStoreId: number,
	previousIsDelivery: boolean,
	isAgeVerified: boolean,
	hasAlcohol: boolean,
	isOnlyAlcohol: boolean,
	previousCartHasAlcohol: boolean,
}

export const adapter: EntityAdapter<Product> = createEntityAdapter<Product>({
	selectId: (cartItem: Product) => cartItem.cardId,
	sortComparer: false
})

export const initialState: State = adapter.getInitialState({
	ids: [],
	isLoading: true,
	isFetched: false,
	isCartHidden: false,
	isCartProductCopiedToConfigurable: null,
	isUpdating: false,
	addToCartRequest: null,
	serverCart: null,
	viewCartItems: [],
	viewCartSummary: {} as OrderSummaryInterface,
	isCartValid: null,
	invalidCartProducts: null,
	backupCartRequest: null,

	cartClubEarnings: {
		registered: null,
		unregistered: null
	},
	previousStoreId: null,
	previousIsDelivery: null,
	isAgeVerified: null,
	hasAlcohol: null,
	isOnlyAlcohol: false,
	previousCartHasAlcohol: null
})

/**
 * Cart reducer
 */
// tslint:disable-next-line:cyclomatic-complexity
export function reducer(
	state = initialState,
	action: PaymentActions | CartActions | OrderActions | StoreActions | ConfiguratorActions | ComboConfigActions | TemplateActions
) {
	switch (action.type) {

		case CartActionsTypes.ClearAddToCartRequest: {
			const backupCartRequest = { ...state.addToCartRequest };
			return {
				...state,
				addToCartRequest: null,
				isCartProductCopiedToConfigurable: false,
				backupCartRequest
			}
		}

		case CartActionsTypes.AddFlatComboProductToCartRequest: {
			const requestChildren = action.cartChildRequest;
			const currentComboProduct = state.addToCartRequest.products[0];
			let comboCartItems = currentComboProduct ? currentComboProduct.child_items : [];

			if (requestChildren) {
				const requestChildrenId = requestChildren.line_id
				comboCartItems = comboCartItems.filter(item => item.line_id !== requestChildrenId);
				// add incoming products
				comboCartItems = comboCartItems.concat(requestChildren);
				currentComboProduct.child_items = comboCartItems;
			}

			return {
				...state,
				addToCartRequest: {
					...state.addToCartRequest,
					products: [currentComboProduct]
				}
			}
		}
		case CartActionsTypes.RemoveComboProductFromCartRequest: {
			const productLineId = action.lineId;
			const currentComboProduct = state.addToCartRequest.products[0];
			let comboCartItems = currentComboProduct ? currentComboProduct.child_items : [];
			comboCartItems = comboCartItems.filter(item => item.line_id !== productLineId)
			currentComboProduct.child_items = comboCartItems;

			return {
				...state,
				addToCartRequest: {
					...state.addToCartRequest,
					products: [currentComboProduct]
				}
			}
		}
		case ConfiguratorActionsTypes.ResetComboProductInCartRequestArray: {
			const resetProducts = action.comboGroup.products;
			const resetProductIds = resetProducts.map(product => product.lineId);
			const currentCart = state.addToCartRequest;
			const currentCartProduct = currentCart.products[0]
			const currentCartChildren = currentCartProduct.child_items;

			// If products have TWIN products in cart reset that product option id to default
			resetProducts.filter(product => product.defaultSiblingProductOption).forEach(product => {
				const sibling = currentCartChildren.find(child => child.line_id === product.defaultSiblingProductOption.line_id);
				if (sibling) {
					sibling.product_option_id = product.defaultSiblingProductOption.product_option
				}
			})

			// Remove products under group that is RESET
			const filteredChildren = currentCartChildren.filter(child => resetProductIds.indexOf(child.line_id) < 0);

			currentCartProduct.child_items = filteredChildren

			return {
				...state
			}
		}

		case CatalogComboConfigListTypes.IncreaseComboQuantity: {
			const currentCart = state.addToCartRequest;
			currentCart.products[0].quantity++;

			return {
				...state,
				addToCartRequest: currentCart
			}
		}
		case CatalogComboConfigListTypes.DecreaseComboQuantity: {
			const currentCart = state.addToCartRequest;
			currentCart.products[0].quantity--;

			return {
				...state,
				addToCartRequest: currentCart
			}
		}
		case CartActionsTypes.BuildSingleProductAddToCartRequest:
		case CartActionsTypes.BuildTwinProductAddToCartRequest:
		case CartActionsTypes.BuildComboProductAddToCartRequest:
		case CartActionsTypes.BuildSingleConfigurableProductAddToCartRequest: {
			// configuratorState = returns configurableItem
			const configurationState = action.configuratorState;
			const storeState = action.storeState;
			const currentAddToCartRequest = action.currentAddToCartRequest;

			const cardProduct = action.cardProduct;
			const isCartFetched = state.serverCart ? true : false;
			const requiredCopyFromServerCart = isCartFetched && !state.isCartProductCopiedToConfigurable && (cardProduct !== undefined);


			let addToCartRequest = {} as AddCartServerRequestInterface;

			if (action.type === CartActionsTypes.BuildSingleProductAddToCartRequest) {
				addToCartRequest = CartMapper.mapSingleConfigurationToCartRequest(
					configurationState,
					storeState,
					cardProduct,
					requiredCopyFromServerCart
				);
			}

			if (action.type === CartActionsTypes.BuildTwinProductAddToCartRequest) {
				// console.log(action)
				addToCartRequest = CartMapper.mapTwinToCartRequest(
					configurationState,
					storeState,
					currentAddToCartRequest,
					requiredCopyFromServerCart,
					cardProduct
				);
			}

			// TODO edit for single combo
			if (action.type === CartActionsTypes.BuildSingleConfigurableProductAddToCartRequest) {
				addToCartRequest = CartMapper.mapSingleComboConfigurationToCartRequest(
					configurationState,
					storeState,
					cardProduct,
					requiredCopyFromServerCart
				);
			}

			if (action.type === CartActionsTypes.BuildComboProductAddToCartRequest) {
				const serverComboConfig = action.serverComboConfig;
				addToCartRequest = CartMapper.mapComboConfigurationToCartRequest(
					serverComboConfig,
					configurationState,
					storeState,
					currentAddToCartRequest,
					cardProduct,
					requiredCopyFromServerCart
				);
			}

			return {
				...state,
				addToCartRequest,
				isCartProductCopiedToConfigurable: true,
				backupCartRequest: { ...addToCartRequest }
			}
		}


		case CartActionsTypes.AddConfigurableProductToCart:
		case CartActionsTypes.AddBasicProductToCart:
		case CartActionsTypes.UpdateConfigurableProductToCart:
		case CartActionsTypes.UpdateComboToCart:
		case CartActionsTypes.AddComboToCart:
		case CartActionsTypes.AddAdvancedProductToCart:
		case CartActionsTypes.AddProductArrayToCart:
		case CartActionsTypes.AddPizzaAssistantProductsToCart: {
			return {
				...state,
				isLoading: true,
				isFetched: false
			}
		}

		case CartActionsTypes.UpdateUserCart: {
			return adapter.removeAll({ ...state })
		}

		case CartActionsTypes.FetchUserCartSuccess:
		case CartActionsTypes.AddConfigurableProductToCartSuccess:
		case CartActionsTypes.RemoveCartItemSuccess:
		case CartActionsTypes.AddBasicProductToCartSuccess:
		case CartActionsTypes.AddComboToCartSuccess:
		case CartActionsTypes.UpdateConfigurableProductToCartSuccess:
		case CartActionsTypes.UpdateComboToCartSuccess:
		case CartActionsTypes.UpdateUserCartSuccess:
		case OrderActionsTypes.AddOrderToCartSuccess:
		case CartActionsTypes.FetchUserCartViaCouponSuccess:
		case CartActionsTypes.AddAdvancedProductToCartSuccess:
		case CartActionsTypes.AddProductArrayToCartSuccess:
		case CartActionsTypes.AddPizzaAssistantProductsToCartSuccess: {
			const serverCart = action.serverResponse;
			const imageBaseUrl = action.imageBaseUrl;
			const viewCartItems = CartMapper.mapServerCartItemsToView(serverCart, imageBaseUrl);
			const viewCartSummary = CartMapper.mapServerCartSummaryToView(serverCart);

			const cartClubEarnings = {
				registered: serverCart.club_11_11_earnings.club1111_registered,
				unregistered: serverCart.club_11_11_earnings.club1111_nonregistered
			}

			const changes = viewCartItems;

			const newState = {
				...state,
				isLoading: false,
				isFetched: true,
				isUpdating: false,
				serverCart,
				viewCartItems,
				viewCartSummary,
				cartClubEarnings
			}
			if (action.type === CartActionsTypes.UpdateUserCartSuccess || action.type === CartActionsTypes.FetchUserCartSuccess) {
				newState.isCartValid = action.isKeepValidationState ? state.isCartValid : true,
				newState.invalidCartProducts = null
			}
			// All success card change actions
			if ('is_age_verified' in action.serverResponse
					&& 'has_alcohol' in action.serverResponse) {
				newState.previousCartHasAlcohol = newState.hasAlcohol
				newState.isAgeVerified = action.serverResponse.is_age_verified
				newState.hasAlcohol = action.serverResponse.has_alcohol
				const boozeProducts = action.serverResponse.products.filter(product => product.is_alcohol && !product.is_food)
				const allFood = action.serverResponse.products.filter(product => product.is_food)
				// if we have a booze product check to see we also have food
				newState.isOnlyAlcohol = boozeProducts.length > 0 ? allFood.length < 1 : false
			}
			if (changes.length === 0) {
				return adapter.removeAll(newState)
			}

			return adapter.upsertMany(changes, newState)
		}
		case CartActionsTypes.RemoveUnavailableIngredientsFromTwinInCart: {
			const unavailableIngredients = action.unavailableIngredients;
			const comboConfigServer = action.comboConfigServer;
			let lineIdOfProductWithNotAvailableIngredient;
			let serverDataForProduct = {} as ServerProductConfigProduct;
			let defaultToppingsForProduct;
			unavailableIngredients.forEach(ingredient => {
				state.addToCartRequest.products[0].child_items.forEach(childItem => {
					let unavailableExchangeConfigOption = childItem.config_options.find(configOption => configOption.config_code === ingredient)
					// find configOption with unavailable ingredient in child item
					if (unavailableExchangeConfigOption) {
						// TODO: if SDK returns line id of product where unavailable ingredient is located -> we don't have to do this loop
						lineIdOfProductWithNotAvailableIngredient = childItem.line_id;
						serverDataForProduct = CartHelper.getServerDataForProductByLineId(lineIdOfProductWithNotAvailableIngredient, comboConfigServer);
						defaultToppingsForProduct = CartHelper.getDefaultToppings(serverDataForProduct)

						// find parent id of unavailable ingredient
						const parentIdAndUnavailableIngredient = {
							topping: ingredient,
							parentId: serverDataForProduct.configuration_options.find(topping => topping.id === ingredient).parent_id
						}
						const unavailableExchangeConfigOptionMapped = CartHelper.SubstituteRemoveUnavailableTopping(
							unavailableExchangeConfigOption,
							parentIdAndUnavailableIngredient,
							defaultToppingsForProduct,
							serverDataForProduct)

						unavailableExchangeConfigOption = unavailableExchangeConfigOptionMapped.unavailableConfigOption;
						// if function returns null just remove config option from list of config options of child in ATR
						if (!unavailableExchangeConfigOptionMapped.isExchanged) {
							childItem.config_options = childItem.config_options.filter(option => option !== unavailableExchangeConfigOption)
						}
					}
				})
			})
			return {
				...state
			}
		}
		case CartActionsTypes.AddValidIncompleteProductToCartRequest: {
			const notConfiguredLineIdsArray = action.notConfiguredLineIdsArray;
			const serverResponseComboProductsArray = action.serverResponseComboProductsArray;
			let addToCartRequestUpdated;

			const notConfiguredProductsDefaultData = serverResponseComboProductsArray.filter(product =>
				notConfiguredLineIdsArray.indexOf(product.line_id) > -1
			);
			const comboProduct = state.addToCartRequest.products[0];
			const oldAddToCartChildItems = comboProduct.child_items;
			const newAddToCartChildItems = oldAddToCartChildItems;

			// get default toppings per combo product
			let calls = 0;
			notConfiguredProductsDefaultData.forEach(defaultProduct => {
				const arrayOfDefaultConfigOptions = [];

				const defaultConfiguration = defaultProduct.configuration_options.filter(item => item.quantity > 0);
				const productConfigOptions = defaultConfiguration.map(item => {
					return {
						config_code: item.id,
						direction: HalfHalfOptionsEnum.center,
						quantity: item.quantity
					} as AddCartProductServerConfigOption
				});
				arrayOfDefaultConfigOptions.push(productConfigOptions);

				// get product_option_id from sever for not configured product
				let notConfiguredProdProductOptionId = defaultProduct.product_options.options.find(
					item => item.selected
				);

				if (!notConfiguredProdProductOptionId) {
					console.error('CRITICAL | There is no default size selected for current product')
					notConfiguredProdProductOptionId = defaultProduct.product_options.options[0]
				}

				const defaultComboProductToAdd = {
					product_id: defaultProduct.product_id,
					quantity: 1,
					config_options: arrayOfDefaultConfigOptions[0],
					product_option_id: notConfiguredProdProductOptionId.id,
					line_id: defaultProduct.line_id,
				} as AddCartProductServerRequestInterface

				newAddToCartChildItems.push(defaultComboProductToAdd)
				calls++;
			});


			if (calls === notConfiguredProductsDefaultData.length) {
				addToCartRequestUpdated = {
					...state.addToCartRequest,
					products: [{
						...comboProduct,
						child_items: newAddToCartChildItems
					}]
				}
			}
			return {
				...state,
				addToCartRequest: addToCartRequestUpdated
			}
		}

		case CartActionsTypes.RemoveCartItem: {
			const cartItem = action.productCartId;
			return adapter.removeOne(cartItem, {
				...state,
				isUpdating: true
			})
		}
		case CartActionsTypes.UpdateCartItemQuantity: {
			const cartItem = action.productCartId;
			const isIncreaseQty = action.isIncreaseQuantity;
			const updatedCartItem = state.entities[cartItem];
			updatedCartItem.quantity = isIncreaseQty ? updatedCartItem.quantity + 1 : updatedCartItem.quantity - 1;

			return adapter.updateOne({ id: cartItem, changes: updatedCartItem }, {
				...state,
				isUpdating: true
			})
		}

		case CartActionsTypes.AddConfigurableProductToCartFailure:
		case CartActionsTypes.AddBasicProductToCartFailure:
		case CartActionsTypes.UpdateConfigurableProductToCartFailure:
		case CartActionsTypes.UpdateComboToCartFailure:
		case CartActionsTypes.AddAdvancedProductToCartFailure:
		case CartActionsTypes.AddProductArrayToCartFailure:
		case CartActionsTypes.AddPizzaAssistantProductsToCartFailure:
		case CartActionsTypes.TooManyItemsInCartFailure: {
			return {
				...state,
				isLoading: false,
				isFetched: false,
				isUpdating: false
			}
		}

		case ConfiguratorActionsTypes.ConfigureComboProductInModal: {
			const currentAddToCartRequest = JSON.parse(JSON.stringify(state.addToCartRequest))

			return {
				...state,
				backupCartRequest: currentAddToCartRequest
			}
		}

		case CartActionsTypes.RevertAddToCartRequest: {
			const backupCartRequest = { ...state.backupCartRequest };
			return {
				...state,
				addToCartRequest: backupCartRequest,
				backupCartRequest: null
			}
		}

		case CartActionsTypes.UserHasNoCart:
		case CartActionsTypes.FetchUserCartFailure: {
			return {
				...state,
				isLoading: false,
				isFetched: false,
				isCartHidden: false
			}
		}

		case CartActionsTypes.SelectDeliveryAddressForCheckout:
		case CartActionsTypes.SelectPickupStoreForCheckout:
		case StoreActionsTypes.SaveUserInput:
		case CartActionsTypes.ValidateCheckoutStore:
		case CartActionsTypes.ValidateCart: {
			return {
				...state,
				isCartValid: null
			}
		}
		case CartActionsTypes.ValidateCartSuccess:
		case PaymentActionsTypes.DecodeCheckoutDataSuccess: {
			return {
				...state,
				isCartValid: true,
			}
		}
		case CartActionsTypes.ValidateCartInvalid: {
			const invalidCartProducts = action.validationResponse.products
			const mappedInvalidProducts = CartMapper.mapInvalidCartProducts(invalidCartProducts);
			const previousStoreId = action.validationResponse.previous_store_id;
			const previousIsDelivery = action.validationResponse.previous_is_delivery;
			const error = action.validationResponse.error
			return {
				...state,
				isCartValid: isValidationStoreClosed(error && error.error_code),
				invalidCartProducts: mappedInvalidProducts,
				previousStoreId,
				previousIsDelivery
			}
		}

		case OrderActionsTypes.ClearCartSuccess:
		case OrderActionsTypes.ProcessOrderRequestSuccess: {
			return {
				...initialState,
				isFetched: true,
				isLoading: false
			}
		}

		case TemplateActionsTypes.AddChildMessageToCartRequest: {
			const currentAddToCartRequest = state.addToCartRequest;
			const lineId = action.lineId;
			const currentChild = currentAddToCartRequest.products[0].child_items ?
				currentAddToCartRequest.products[0].child_items.find(item => item.line_id === lineId) : currentAddToCartRequest.products[0];
			currentChild.personalized_message = action.personalizedMessage;
			return {
				...state
			}
		}

		case CartActionsTypes.ShowIncompleteOrderPopup: {
			return {
				...state,
				isCartHidden: true
			}
		}
		case CartActionsTypes.CloseIncompleteOrderPopup: {
			const isClearCart = action.isClearCart
			return {
				...state,
				isCartHidden: isClearCart
			}
		}

		default: {
			return state;
		}

	}
}

export const getIsCartLoading = (state: State) => {
	return state.isLoading && !state.isFetched;
}

export const getIsCartError = (state: State) => {
	return !state.isLoading && !state.isFetched;
}
export const getIsCartUpdating = (state: State) => {
	return state.isUpdating;
}
export const getIds = (state: State) => state.ids;

export const getCartSummary = (state: State) => {
	return state.viewCartSummary;
}

export const getIsCartValid = (state: State) => {
	return state.isCartValid;
}

export const getIsCartOnlyAlcohol = (state: State) => {
	return state.isOnlyAlcohol
}

export const getTipData = (state: State) => {
	return state.serverCart ? state.serverCart.tips : null
}
