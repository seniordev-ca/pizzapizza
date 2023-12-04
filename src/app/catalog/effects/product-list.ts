// Angular Core
import { Injectable } from '@angular/core';
// Ng Rx
import { Store } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';
// Reactive operators
import { map, mergeMap, catchError, flatMap, withLatestFrom, filter } from 'rxjs/operators';
import { of } from 'rxjs';
import { State } from '../../root-reducer/root-reducer';
import { GlobalActionsTypes } from '../../common/actions/global'

// Actions
import {
	FetchProductList,
	FetchProductListSuccess,
	FetchProductListFailure,
	CatalogProductListTypes
} from '../actions/product-list';

import {
	FetchCategories,
	GetProductCategory,
	CatalogCategoriesTypes
} from '../actions/category'

import {
	FetchFeaturedSlides
} from '../actions/featured-products'

// Services
import { ProductListService } from '../services/product-list';
@Injectable()
export class ProductListEffects {
	/**
	 * After app initial load success check to see if we have categories in the store if so we need to do some logic to find the id
	 */
	@Effect()
	loadProductPage = this.actions.pipe(
		filter(action =>
			action.type === '@ngrx/router-store/navigated'
			|| action.type === GlobalActionsTypes.AppInitialLoadSuccess
			|| action.type === CatalogCategoriesTypes.FetchCategoriesSuccess
			|| action.type === CatalogCategoriesTypes.ImportFeatureCategory),
		withLatestFrom(this.store),
		filter(([action, state]) => {
			const isSettingsFetched = state.common.settings.isFetched;
			const isProductListRoute = state.router.state.url.startsWith('/catalog/products');
			const routerParams = state.router.state.params;
			const isCategoriesFetched = state.catalog.categories.isFetched;
			const isFeaturedFetched = state.catalog.featuredProducts.isFetched;
			return isProductListRoute && isSettingsFetched && routerParams.productSlug && isCategoriesFetched && isFeaturedFetched
		}),
		map(([action, state]) => {
			const baseUrl = state.common.settings.data.web_links.image_urls.category;
			return new GetProductCategory(state.router.state.params.productSlug, baseUrl)
		})
	)

	/**
	 * We need both Categories and Featured Category data on load so that we can import featured category into our ngrx store.
	 * This will ensure that getProductCategory will be able to find the "featured" category id based on seo slug
	 */
	@Effect()
	loadProductPageRequirements = this.actions.pipe(
		filter(action =>
			action.type === '@ngrx/router-store/navigated'
			|| action.type === GlobalActionsTypes.AppInitialLoadSuccess
			|| action.type === CatalogProductListTypes.ReloadProductList
			|| action.type === CatalogCategoriesTypes.FetchCategoriesSuccess
			|| action.type === CatalogCategoriesTypes.ImportFeatureCategory),
		withLatestFrom(this.store),
		filter(([action, state]) => {
			const isSettingsFetched = state.common.settings.isFetched;
			const isProductListRoute = state.router.state.url.startsWith('/catalog/products');
			const routerParams = state.router.state.params;
			const isCategoriesFetched = state.catalog.categories.isFetched;
			const isSpecialsFetched = state.catalog.featuredProducts.isFetched;
			return (isProductListRoute && isSettingsFetched && routerParams.productSlug) && (!isCategoriesFetched || !isSpecialsFetched)
		}),
		flatMap(([action, state]) => {
			const requiredActions = [];
			const isCategoriesFetched = state.catalog.categories.isFetched;
			const isSpecialsFetched = state.catalog.featuredProducts.isFetched;
			if (!isCategoriesFetched) {
				requiredActions.push(new FetchCategories())
			}
			if (!isSpecialsFetched) {
				requiredActions.push(new FetchFeaturedSlides())
			}
			return requiredActions
	})
	)

	/**
	 * Look in the store to find the product category and sub categories
	 */
	@Effect()
	getProductCategory = this.actions.pipe(
		filter(action =>
			action.type === CatalogCategoriesTypes.ChangeSelectedCategory
			|| action.type === CatalogCategoriesTypes.GetProductCategory),
		withLatestFrom(this.store),
		map(([action, state]) => {
			const selectedId = state.catalog.categories.selectedId;
			const baseUrl = state.common.settings.data.web_links.image_urls.product;
			if (state.catalog.productList.entities[selectedId]) {
				return new FetchProductListSuccess(state.catalog.productList.entities[selectedId], baseUrl)
			} else {
				return new FetchProductList(selectedId);
			}
		})
	)
	/**
	 * Fetch the Product Category via store id and product id
	 */
	@Effect()
	fetchProductList = this.actions.pipe(
		filter(action =>
			action.type === CatalogProductListTypes.FetchProductList
		),
		withLatestFrom(this.store),
		mergeMap(([action, state]) => {
			const storeId = state.common.store.selectedStore.store_id;
			const isDelivery = state.common.store.isDeliveryTabActive;
			const selectedId = state.catalog.categories.selectedId;
			return this.productListService.getProductList(storeId, selectedId, isDelivery).pipe(
				map((response) => {
					const baseUrl = state.common.settings.data.web_links.image_urls.product;
					return new FetchProductListSuccess(response, baseUrl);
				}),
				catchError(error => of(new FetchProductListFailure()))
			)
		})
	)

	constructor(
		private actions: Actions,
		private store: Store<State>,
		private productListService: ProductListService,
	) { }
}


