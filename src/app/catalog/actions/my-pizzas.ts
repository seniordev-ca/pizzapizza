import { Action } from '@ngrx/store';
import { ServerProductList } from '../models/server-products-list';

/**
 * My Pizzas
 */
export enum CatalogMyPizzaTypes {
	FetchMyPizzaList = '[Catalog](My Pizza List) Fetch My Pizza List',
	FetchMyPizzaListSuccess = '[Catalog](My Pizza List) Fetch My Pizza List Success',
	FetchMyPizzaListFailure = '[Catalog](My Pizza List) Fetch My Pizza List Failure',
	ReloadMyPizzaList = '[Catalog](My Pizza List) Reload My Pizza List',
}
export class FetchMyPizzaList implements Action {
	readonly type = CatalogMyPizzaTypes.FetchMyPizzaList;
}

export class FetchMyPizzaListSuccess implements Action {
	readonly type = CatalogMyPizzaTypes.FetchMyPizzaListSuccess;
	constructor(public payload: ServerProductList, public baseUrl: string, public categoryBase: string) { }
}

export class FetchMyPizzaListFailure implements Action {
	readonly type = CatalogMyPizzaTypes.FetchMyPizzaListFailure;
}

export class ReloadMyPizzaList implements Action {
	readonly type = CatalogMyPizzaTypes.ReloadMyPizzaList;
}

/**
 * REDUX actions for categorie
 */
export type MyPizzasActions =
	| FetchMyPizzaList
	| FetchMyPizzaListSuccess
	| FetchMyPizzaListFailure

	| ReloadMyPizzaList

