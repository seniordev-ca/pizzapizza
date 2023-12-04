import { Action } from '@ngrx/store';
import { ServerCategoriesInterface } from '../models/server-category';

/**
 * Categories
 */
export enum CatalogCategoriesTypes {
	FetchCategories = '[Catalog](Category) Fetch Categories',
	FetchCategoriesSuccess = '[Catalog](Category) Fetch Categories Success',
	FetchCategoriesFailure = '[Catalog](Category) Fetch Categories Failure',
	GetProductCategory = '[Catalog](Category) Get Product Category and SubCategories',
	ChangeSelectedCategory = '[Catalog](Category) Select Category',
	ImportFeatureCategory = '[Catalog](Category) Import Featured Category to Category List',
	ReloadCategories = '[Catalog](Category) Mark Categories For Reload'
}

export class ReloadCategories implements Action {
	readonly type = CatalogCategoriesTypes.ReloadCategories;
}
export class FetchCategories implements Action {
	readonly type = CatalogCategoriesTypes.FetchCategories;
}

export class FetchCategoriesSuccess implements Action {
	readonly type = CatalogCategoriesTypes.FetchCategoriesSuccess;
	constructor(public categoriesArr: ServerCategoriesInterface[], public baseUrl?: string) { }
}

export class FetchCategoriesFailure implements Action {
	readonly type = CatalogCategoriesTypes.FetchCategoriesFailure;
}

export class GetProductCategory implements Action {
	readonly type = CatalogCategoriesTypes.GetProductCategory;
	constructor(public payload: string, public baseUrl: string) {}
}
export class ChangeSelectedCategory implements Action {
	readonly type = CatalogCategoriesTypes.ChangeSelectedCategory;
	constructor(public payload: string) { }
}
export class ImportFeatureCategory implements Action {
	readonly type = CatalogCategoriesTypes.ImportFeatureCategory;
	constructor(public categoriesArr: ServerCategoriesInterface[]) { }
}
/**
 * REDUX actions for categories
 */
export type CategoriesActions =
	| FetchCategories
	| FetchCategoriesSuccess
	| FetchCategoriesFailure
	| GetProductCategory
	| ChangeSelectedCategory
	| ImportFeatureCategory
	| ReloadCategories
