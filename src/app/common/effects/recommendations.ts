// Angular Core
import { Injectable } from '@angular/core';
// Ng Rx
import { Store } from '@ngrx/store';
// Reactive operators
import { Effect, Actions, ofType } from '@ngrx/effects';
import { map, catchError, exhaustMap, filter, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';
// import 'rxjs/add/observable/fromPromise';
import { State } from '../../root-reducer/root-reducer';
import { CartActionsTypes } from '../../checkout/actions/cart';
import {
	FetchRecommendations,
	RecommendationActionTypes,
	FetchRecommendationsSuccess,
	FetchRecommendationsFailure
} from '../actions/recommendations';
import { CatalogProductListTypes } from '../../catalog/actions/product-list';
import { RecommendationService } from '../services/recommendations';
import { RecommendationsServerInterface } from '../../catalog/models/server-recommendations';
import { ConfiguratorActionsTypes } from '../../catalog/actions/configurator';
import { CatalogComboConfigListTypes } from '../../catalog/actions/combo-config';
import { CatalogMyPizzaTypes } from '../../catalog/actions/my-pizzas';
import { JustForYouTypes } from '../../catalog/actions/just-for-you';
import { ApplicationHttpClient } from '../../../utils/app-http-client';
import { CartItemKindEnum } from 'app/checkout/models/server-cart-response';

@Injectable()
export class RecommendationEffects {

	/**
	 * Product List Recommendations
	 */
	@Effect()
	findRecommendationsOnProductList = this.actions.pipe(
		filter(action =>
			action.type === CatalogProductListTypes.FetchProductListSuccess ||
			action.type === CartActionsTypes.AddBasicProductToCartSuccess
		),
		withLatestFrom(this.store),
		filter(([action, store]) => {
			const isProductListPage = store.router.state.params.productSlug
			return isProductListPage
		}),
		map(([action, store]) => {
			const selectedProductList = store.catalog.productList.selectedProductList;
			const productIds = selectedProductList.map(product => product.id)
			return new FetchRecommendations(productIds)
		})
	)

	/**
	 * My Pizza Recommendations
	 */
	@Effect()
	findRecommendationsOnMyPizza = this.actions.pipe(
		filter(action =>
			action.type === CatalogMyPizzaTypes.FetchMyPizzaListSuccess ||
			action.type === CartActionsTypes.AddAdvancedProductToCartSuccess
		),
		withLatestFrom(this.store),
		map(([action, store]) => {
			const selectedProductList = store.catalog.myPizzas.selectedProductList;
			const productIds = selectedProductList.map(product => product.id)
			return new FetchRecommendations(productIds)
		})
	)
	/**
	 * Just For You Product List Recommendations
	 */
	@Effect()
	findRecommendationsOnJustForYou = this.actions.pipe(
		filter(action =>
			action.type === JustForYouTypes.FetchJustForYouProductListSuccess ||
			action.type === CartActionsTypes.AddProductArrayToCartSuccess
		),
		withLatestFrom(this.store),
		map(([action, store]) => {
			const selectedProductList = store.catalog.justForYou.selectedProductList
			const productIds = selectedProductList.map(product => product.id)
			return new FetchRecommendations(productIds)
		})
	)
	/**
	 * Single Config Recommendations
	 */
	@Effect()
	findRecommendationsOnSingleConfig = this.actions.pipe(
		filter(action =>
			action.type === ConfiguratorActionsTypes.FetchSingleConfigurableComboSuccess
			|| action.type === ConfiguratorActionsTypes.FetchSingleProductSuccess
			|| action.type === ConfiguratorActionsTypes.FetchTwinProductConfigSuccess
			|| action.type === CartActionsTypes.AddBasicProductToCartSuccess
			|| action.type === CartActionsTypes.AddConfigurableProductToCartSuccess
		),
		withLatestFrom(this.store),
		filter(([action, store]) => {
			const isProductConfigPage = store.router.state.params.singleProductId
			return isProductConfigPage
		}),
		map(([action, store]) => {
			const currentSingleConfg = store.router.state.params.singleProductId
			const selectedProduct = store.catalog.configurableItem.entities[currentSingleConfg]
			const selectedProductIDs = selectedProduct ? [selectedProduct.product_id] : []
			return new FetchRecommendations(selectedProductIDs)
		})
	)

	/**
	 * Combo Recommendations
	 */
	// @Effect()
	// findRecommendationsOnCombo = this.actions.pipe(
	// 	filter(action =>
	// 		action.type === CatalogComboConfigListTypes.FetchComboConfigSuccess ||
	// 		action.type === CartActionsTypes.AddBasicProductToCartSuccess ||
	// 		action.type === CartActionsTypes.AddComboToCartSuccess
	// 	),
	// 	withLatestFrom(this.store),
	// 	filter(([action, store]) => {
	// 		const isComboPage = store.router.state.params.comboId
	// 		return isComboPage
	// 	}),
	// 	map(([action, store]) => {
	// 		const currentComboConfg = store.router.state.params.comboId
	// 		const productIds = [store.catalog.comboConfig.entities[currentComboConfg].product_id]
	// 		return new FetchRecommendations(productIds)
	// 	})
	// )

	/**
	 * Cart Recommendations
	 */
	@Effect()
	findRecommendationsOnCheckout = this.actions.pipe(
		filter(action =>
			action.type === CartActionsTypes.AddBasicProductToCartSuccess
		),
		withLatestFrom(this.store),
		filter(([action, store]) => {
			const isCheckoutRoute = store.router.state.url.startsWith('/checkout');
			const isCartLoaded = store.checkout.cart.serverCart ? true : false
			return isCheckoutRoute && isCartLoaded
		}),
		map(([action, store]) => {
			const productIds = store.checkout.cart.serverCart.products.filter(item => {
				const isCoupon = item.kind === CartItemKindEnum.Coupon;
				const isClub11 = item.kind === CartItemKindEnum.Club11;
				const isGiftCard = item.kind === CartItemKindEnum.GiftCard;
				return !(isCoupon || isClub11 || isGiftCard)
			}).map(item => item.product_id);
			return new FetchRecommendations(productIds)
		})
	)

	/**
	 * Fetch Recommendations will fail due to no store id so reload the page
	 */
	@Effect({ dispatch: false })
	fetchRecommendationsFailed = this.actions.pipe(
		ofType(RecommendationActionTypes.FetchRecommendations),
		withLatestFrom(this.store),
		filter(([action, store]) => {
			const store_id = store.common.store.selectedStore.store_id;

			return store_id === null
		}),
		map(([action, store]) => {
			window.location.reload();
			return of()
		})
	)

	/**
	 * Fetch Recommendations ONLY IF STORE ID EXISTS
	 */
	@Effect()
	fetchRecommendations = this.actions.pipe(
		ofType(RecommendationActionTypes.FetchRecommendations),
		withLatestFrom(this.store),
		filter(([action, store]) => {
			const store_id = store.common.store.selectedStore.store_id;

			return store_id !== null
		}),
		// exhaustMap(([action, store]) => this.applicationHttpClient.renewAuthTokenIfRequired('FetchRecommendations').pipe(
		exhaustMap(([action, store]) => {
			const productIds = action['productIDs'];
			const baseUrl = store.common.settings.data.web_links.image_urls.product;
			const userCartProducts = store.checkout.cart.serverCart ? store.checkout.cart.serverCart.products
				.filter(item => {
					const isCoupon = item.kind === CartItemKindEnum.Coupon;
					const isClub11 = item.kind === CartItemKindEnum.Club11;
					const isGiftCard = item.kind === CartItemKindEnum.GiftCard;
					return !(isCoupon || isClub11 || isGiftCard)
				}).map(item => item.product_id) : null;
			const city = store.common.store.selectedStore.city;
			const store_id = store.common.store.selectedStore.store_id;


			const request = {
				for_products: productIds,
				city,
				cart_products: userCartProducts ? userCartProducts : [],
				store_id,
				by_count: false
			} as RecommendationsServerInterface

			return this.recommendService.getRecommendations(request).pipe(
				map(response => new FetchRecommendationsSuccess(response, baseUrl)),
				catchError(error => of(new FetchRecommendationsFailure()))
			)
		})
		// ))
	)

	constructor(
		private actions: Actions,
		private store: Store<State>,
		private recommendService: RecommendationService,
		private applicationHttpClient: ApplicationHttpClient
	) { }
}
