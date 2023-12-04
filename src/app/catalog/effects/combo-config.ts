// Angular Core
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
// Ng Rx
import { Store } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
// Reactive operators
import { map, mergeMap, catchError, withLatestFrom, filter, flatMap } from 'rxjs/operators';
import { of } from 'rxjs';

import { State } from '../../root-reducer/root-reducer';

// Actions
import {
	FetchComboConfig,
	FetchComboConfigSuccess,
	FetchComboConfigFailure,
	CatalogComboConfigListTypes
} from '../actions/combo-config';

import {
	AddFlatComboProductToCartRequest,
	RemoveComboProductFromCartRequest,
	RemoveUnavailableIngredientsFromTwinInCart
} from '../../checkout/actions/cart';
// Services
import { ComboConfigService } from '../services/combo-config';
import { HalfHalfOptionsEnum } from '../models/configurator';
import { SDKActionTypes } from 'app/common/actions/sdk';
import { CatalogProductListTypes } from '../actions/product-list';
import { FetchFeaturedSlides } from '../actions/featured-products';
import { FetchCategories } from '../actions/category';

@Injectable()
export class ComboConfigEffects {
	/**
	 * After app initial load success check to see if we have categories in the store if so we need to do some logic to find the id
	 */
	@Effect()
	loadComboProductPage = this.actions.pipe(
		filter(action =>
			action.type === '@ngrx/router-store/navigated'
			|| action.type === SDKActionTypes.InitialSDKLoadSuccess
			|| action.type === CatalogComboConfigListTypes.ReloadComboConfig
			|| action.type === CatalogComboConfigListTypes.ReFetchComboConfig
		),
		withLatestFrom(this.store),
		filter(([action, state]) => {
			const isAppLaunched = state.common.settings.isFetched && state.common.store.selectedStore;
			const isComboConfigRoute = state.router.state.url.startsWith('/catalog/product-combo');
			const routerParams = state.router.state.params;
			const isSDKLoaded = state.common.sdk.isFetched;
			return isComboConfigRoute && isAppLaunched && routerParams.comboId && isSDKLoaded;
		}),
		flatMap(([action, state]) => {
			const storeId = state.common.store.selectedStore.store_id;
			const comboSlug = state.router.state.params.comboId;
			const imageBaseUrls = state.common.settings.data.web_links.image_urls;
			const currentComboInStore = state.catalog.comboConfig.entities[comboSlug];

			if (currentComboInStore) {
				return [new FetchComboConfigSuccess(currentComboInStore, imageBaseUrls)]
			} else {
				return [new FetchComboConfig(storeId, comboSlug), new FetchCategories(), new FetchFeaturedSlides()]
			}
		}))

	/**
	 * Fetch the Product Category via store id and product id
	 */
	@Effect()
	fetchProductList = this.actions.pipe(
		ofType(CatalogComboConfigListTypes.FetchComboConfig),
		withLatestFrom(this.store),
		mergeMap(([action, state]) => {
			const storeId = action['storeId'];
			const comboId = action['comboId'];

			return this.comboConfigService.getComboConfig(storeId, comboId).pipe(
				map((response) => {
					const imageBaseUrls = state.common.settings.data.web_links.image_urls;
					return new FetchComboConfigSuccess(response, imageBaseUrls)
				}),
				catchError(error => of(new FetchComboConfigFailure()))
			)
		})
	)

	/**
	 * Redirect to home page if combo is not available
	 * That could happen if combo is not available for store or caches are broken
	 */
	@Effect({ dispatch: false })
	redirectIfFetchComboFailed = this.actions.pipe(
		filter(action => action.type === CatalogComboConfigListTypes.FetchComboConfigFailure
			|| action.type === CatalogProductListTypes.FetchProductListFailure),
		map(() => this.router.navigate(['']))
	)

	/**
	 * Add Flat Option to Combo Cart Request Array
	 */
	@Effect()
	addFlatComboProductToConfig = this.actions.pipe(
		ofType(CatalogComboConfigListTypes.AddFlatConfigOptionToComboConfigurator),
		filter(action => {
			const isConfigOption = action['isConfigOption']
			const isDelete = action['isDelete']
			return (!isConfigOption && !isDelete) || isConfigOption
		}),
		withLatestFrom(this.store),
		map(([action, state]) => {
			const itemId = action['itemId'];
			const itemQuantity = action['quantity']
			const selectedId = action['selectedProduct'];
			const isConfigOption = action['isConfigOption']
			const lineID = action['lineId']

			const productFromCart = state.checkout.cart.addToCartRequest
			let parentProduct = null;
			let currentProductConfig = [];
			if (isConfigOption) {
				parentProduct = state.catalog.comboConfig.serverCombo.data.products
					.find(product => product.product_id === selectedId)

				const currentProductChildItem = productFromCart ?
					productFromCart.products[0]
						.child_items.find(cartItem => cartItem.line_id === parentProduct.line_id) : null;
				currentProductConfig = currentProductChildItem ? currentProductChildItem.config_options : [];

				const selectedConfigOption = parentProduct.configuration_options.find(item => item.id === itemId);
				const isSelectedOptionAlreadyInCart = currentProductConfig
					.filter(currentConfig => currentConfig.config_code === selectedConfigOption.id).length > 0;
				if (isSelectedOptionAlreadyInCart) {
					currentProductConfig = currentProductConfig.filter(currentConfig => currentConfig.config_code !== selectedConfigOption.id);
				} else {
					currentProductConfig.push({
						config_code: selectedConfigOption.id,
						quantity: itemQuantity,
						direction: HalfHalfOptionsEnum.center,
					})
				}
			} else {
				parentProduct = state.catalog.comboConfig.serverCombo.data.products.find(product =>
					product.product_id === itemId && product.line_id === lineID)
				currentProductConfig = parentProduct.configuration_options;
			}

			const cartRequest = {
				line_id: parentProduct.line_id,
				product_id: parentProduct.product_id,
				product_option_id: parentProduct.product_options.options[0].id,
				quantity: 1,
				config_options: currentProductConfig,
			}
			return new AddFlatComboProductToCartRequest(cartRequest)
		})
	)
	/**
	 * Update Flat Option to Combo Cart Request Array
	 */
	@Effect()
	updateQtyFlatComboProductToConfig = this.actions.pipe(
		ofType(CatalogComboConfigListTypes.UpdateFlatConfigOptionQuantity),
		withLatestFrom(this.store),
		map(([action, state]) => {
			const itemId = action['itemId'];
			const itemQuantity = action['quantity']
			const selectedId = action['selectedProduct'];

			const productFromCart = state.checkout.cart.addToCartRequest
			const parentProduct = state.catalog.comboConfig.serverCombo.data.products
				.find(product => product.product_id === selectedId)

			const currentProductChildItem = productFromCart ?
				productFromCart.products[0]
					.child_items.find(cartItem => cartItem.line_id === parentProduct.line_id) : null;
			let currentProductConfig = currentProductChildItem ? currentProductChildItem.config_options : [];

			const selectedConfigOption = parentProduct.configuration_options.find(item => item.id === itemId);

			currentProductConfig = currentProductConfig.filter(currentConfig => currentConfig.config_code !== selectedConfigOption.id);

			currentProductConfig.push({
				config_code: selectedConfigOption.id,
				quantity: itemQuantity,
				direction: HalfHalfOptionsEnum.center,
			})

			const cartRequest = {
				line_id: parentProduct.line_id,
				product_id: parentProduct.product_id,
				product_option_id: parentProduct.product_options.options[0].id,
				quantity: 1,
				config_options: currentProductConfig,
			}
			return new AddFlatComboProductToCartRequest(cartRequest)
		})
	)

	@Effect()
	removeComboItemFromCart = this.actions.pipe(
		ofType(CatalogComboConfigListTypes.AddFlatConfigOptionToComboConfigurator),
		filter(action => {
			const isConfigOption = action['isConfigOption']
			const isDelete = action['isDelete']
			return !isConfigOption && isDelete
		}),
		withLatestFrom(this.store),
		map(([action, state]) => {
			const itemId = action['itemId'];
			const lineID = action['lineId']

			const parentProduct = state.catalog.comboConfig.serverCombo.data.products.find(product =>
				product.product_id === itemId && product.line_id === lineID)
			return new RemoveComboProductFromCartRequest(parentProduct.line_id)
		})
	)
	/**
	 * Update ATR and delete unavailable ingredient from twin
	 */
	@Effect()
	updateAddToCartRequestOnTwin = this.actions.pipe(
		ofType(CatalogComboConfigListTypes.RemoveUnavailableToppingsFromAnotherTwin),
		withLatestFrom(this.store),
		map(([action, state]) => {
			const comboConfigServer = state.catalog.comboConfig.serverCombo;
			const unavailableIngredients = state.common.sdk.sdkResponse.unavailableIngredients ?
				state.common.sdk.sdkResponse.unavailableIngredients : []
			const productLineId = state.catalog.configurableItem.comboSubProductLineId;
			return new RemoveUnavailableIngredientsFromTwinInCart(comboConfigServer, unavailableIngredients, productLineId)
		})
	)
	constructor(
		private actions: Actions,
		private store: Store<State>,
		private comboConfigService: ComboConfigService,
		private router: Router,
	) { }
}


