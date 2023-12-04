import { Action } from '@ngrx/store';
import { ServerProductList } from '../models/server-products-list';

/**
 * Categories
 */
export enum CatalogProductListTypes {
	FetchProductList = '[Catalog](Product List) Fetch ProductList',
	FetchProductListSuccess = '[Catalog](Product List) Fetch ProductList Success',
	FetchProductListFailure = '[Catalog](Product List) Fetch ProductList Failure',

	UpdateProductQuantity = '[Catalog](Product List) Update Product Quantity',

	ReloadProductList = '[Catalog](Product List) Reload Product List'
}
export class FetchProductList implements Action {
	readonly type = CatalogProductListTypes.FetchProductList;
	constructor(public categoryId: string, public isCategorySlug?: boolean) {}
}

export class FetchProductListSuccess implements Action {
	readonly type = CatalogProductListTypes.FetchProductListSuccess;
	constructor(public payload: ServerProductList, public baseUrl: string) { }
}

export class FetchProductListFailure implements Action {
	readonly type = CatalogProductListTypes.FetchProductListFailure;
}

export class UpdateProductQuantity implements Action {
	readonly type = CatalogProductListTypes.UpdateProductQuantity;
	constructor(public productId: string, public quantity: number) { }
}

export class ReloadProductList implements Action {
	readonly type = CatalogProductListTypes.ReloadProductList;
}
/**
 * REDUX actions for categorie
 */
export type ProductListActions =
	| FetchProductList
	| FetchProductListSuccess
	| FetchProductListFailure

	| UpdateProductQuantity

	| ReloadProductList

