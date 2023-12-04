// Angular Core
import { Injectable } from '@angular/core';
// Ng Rx
import { Store } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
// Reactive operators
import { map, catchError, withLatestFrom, filter, exhaustMap, flatMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { State } from '../../root-reducer/root-reducer';
import {
	PizzaAssistantActionTypes,
	SendPizzaAssistantMessageSuccess,
	SendPizzaAssistantMessageFailure,
	InitPizzaAssistant,
	UpdatePizzaAssistantProduct,
	FetchPizzaAssistantHelpConfig,
	FetchPAConfigHelpSuccess,
	FetchPAConfigHelpFailure
} from '../actions/pizza-assistant';
import { PizzaAssistantService } from '../services/pizza-assistant';
import { GlobalActionsTypes } from '../../common/actions/global';
import { ProductKinds } from '../models/server-product-config';
import {
	FetchSingleProductSuccess,
	FetchSingleConfigurableComboSuccess,
	FetchTwinProductConfigSuccess,
	FetchProductConfigFailure,
	CopyServerCartToConfigurable,
	RemoveUnavailableToppings,
	UpdateCartRequestFromPizzaAssistant
} from '../actions/configurator';
import { ServerPizzaAssistantProduct } from '../models/server-pizza-assistant';
import { ServerCartResponseProductListInterface } from '../../checkout/models/server-cart-response';

@Injectable()
export class PizzaAssistantEffects {

	@Effect()
	loadProductPage = this.actions.pipe(
		filter(action =>
			action.type === '@ngrx/router-store/navigated'
			|| action.type === GlobalActionsTypes.AppInitialLoadSuccess),
		withLatestFrom(this.store),
		filter(([action, state]) => {
			const isPizzaAssistantRoute = state.router.state.url.startsWith('/catalog/pizza-assistant');

			return isPizzaAssistantRoute
		}),
		map(([action, state]) => new InitPizzaAssistant())
	)

	/**
	 * Effect to check data and dispatch event to get data for Help from Pizza Assistant
	 */
	@Effect()
	getPAHelpConfig = this.actions.pipe(
		filter(action =>
			action.type === '@ngrx/router-store/navigated'
			|| action.type === GlobalActionsTypes.AppInitialLoadSuccess),
		withLatestFrom(this.store),
		filter(([action, state]) => {
			const isPizzaAssistantRoute = state.router.state.url.startsWith('/catalog/pizza-assistant');
			return isPizzaAssistantRoute
		}),
		map(([action, state]) => {
			const isHelpConfigFetched = state.catalog.pizzaAssistant.isHelpConfigFetched;
			if (isHelpConfigFetched) {
				const helpAssistantData = state.catalog.pizzaAssistant.helpConfigData
				return new FetchPAConfigHelpSuccess(helpAssistantData)
			} else {
				return new FetchPizzaAssistantHelpConfig()
			}
		})
	)

	/**
	 * Effect to get data from server for Help Pizza Assistant
	 */
	@Effect()
	fetchingHelpConfig = this.actions.pipe(
		ofType(PizzaAssistantActionTypes.FetchPizzaAssistantHelpConfig),
		exhaustMap(action => {
			return this.pizzaAssistantService.receiveHelp().pipe(
				map(response => new FetchPAConfigHelpSuccess(response)),
				catchError(() => of(new FetchPAConfigHelpFailure()))
			)
		})
	)
	/**
	 * Effect to send message to pizza assistant
	 */
	@Effect()
	sendPissaAssistantMessage = this.actions.pipe(
		ofType(PizzaAssistantActionTypes.SendPizzaAssistantMessage),
		withLatestFrom(this.store),
		exhaustMap(([action, store]) => {
			const storeId = store.common.store.selectedStore.store_id;
			const message = action['message'];
			const baseUrl = store.common.settings.data.web_links.image_urls.product;
			return this.pizzaAssistantService.sendMessage(storeId, message).pipe(
				map(response => {
					return new SendPizzaAssistantMessageSuccess(response, baseUrl)
				}),
				catchError(() => of(new SendPizzaAssistantMessageFailure()))
			)
		})
	)


	/**
	 * Copy data from pizza assistant configurator product field into configurable item
	 */
	@Effect()
	configureComboProductInModal = this.actions.pipe(
		ofType(PizzaAssistantActionTypes.OpenPizzaAssistantProductInModal),
		withLatestFrom(this.store),
		flatMap(([action, state]) => {
			const productLineId = action['lineId'] as number;

			const fullPizzaAssistantServerConfig = state.catalog.pizzaAssistant.entities[productLineId] as ServerPizzaAssistantProduct
			const productImageBaseUrl = state.common.settings.data.web_links.image_urls;
			const productFromNGRX = fullPizzaAssistantServerConfig.config_cache;
			const addToCartRequestProducts = fullPizzaAssistantServerConfig.cart_request;

			const cartProduct = {
				price: null,
				image: null,
				child_items: addToCartRequestProducts.child_items,
				config_options: addToCartRequestProducts.config_options,
				cart_item_id: productLineId,
				line_id: productLineId,
				product_id: addToCartRequestProducts.product_id,
				product_option_id: addToCartRequestProducts.product_option_id,
				quantity: addToCartRequestProducts.quantity
			} as ServerCartResponseProductListInterface

			const configActions = []
			switch (productFromNGRX.kind) {
				case ProductKinds.single:
					configActions.push(new FetchSingleProductSuccess(productFromNGRX, productImageBaseUrl));
					break
				case ProductKinds.single_configurable_combo:
					configActions.push(new FetchSingleConfigurableComboSuccess(productFromNGRX, productImageBaseUrl));
					break

				case ProductKinds.twin:
					configActions.push(new FetchTwinProductConfigSuccess(productFromNGRX, productImageBaseUrl));
					break
				default:
					configActions.push(new FetchProductConfigFailure());
					break
			}

			configActions.push(new CopyServerCartToConfigurable(
				productFromNGRX.kind,
				cartProduct
			));

			configActions.push(new UpdateCartRequestFromPizzaAssistant())

			return configActions;
		})
	)

	@Effect()
	updateViaCartRequest = this.actions.pipe(
		ofType(PizzaAssistantActionTypes.UpdatePizzaAssistantProductViaCartRequest),
		withLatestFrom(this.store),
		map(([action, store]) => {
			const cartRequest = store.checkout.cart.addToCartRequest;
			const lineId = store.catalog.configurableItem.cartItemId;
			const price = store.catalog.configurableItem.viewProductInfo.priceText.priceValue;
			return new UpdatePizzaAssistantProduct(lineId, cartRequest, price)
		})
	)

	constructor(
		private pizzaAssistantService: PizzaAssistantService,
		private actions: Actions,
		private store: Store<State>
	) { }
}
