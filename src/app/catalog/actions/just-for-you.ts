import { Action } from '@ngrx/store';
import { ServerJustForYouInterface } from '../models/server-just-for-you';
import { ServerProductList } from '../models/server-products-list';

/**
 * Just for you section
 */
export enum JustForYouTypes {
	FetchJustForYou = '[Catalog](JustForYou) Fetch Just For You Slides',
	FetchJustForYouSuccess = '[Catalog](JustForYou) Fetch Just For You Success',
	FetchJustForYouFailure = '[Catalog](JustForYou) Fetch Just For You Failure',

	GetJustForYouProductList = '[Catalog](JustForYou) Get Just For You Product List',
	FetchJustForYouProductList = '[Catalog](JustForYou) Fetch Just For You Product List',
	FetchJustForYouProductListSuccess = '[Catalog](JustForYou) Fetch Just For You Product List Success',
	FetchJustForYouProductListFailure = '[Catalog](JustForYou) Fetch Just For You Product List Failure',

	UpdateJFYProductQuantity = '[Catalog](JustForYou) Update Product Quantity',
	UpdateJFYGroupQuantity = '[Catalog](JustForYou) Update Group Quantity',
	SelectJFYProduct = '[Catalog](JustForYou) Select Product',

	ReloadJustForYou =  '[Catalog](JustForYou) Mark Just For You Slides For Reload'
}

export class ReloadJustForYou implements Action {
	readonly type = JustForYouTypes.ReloadJustForYou;
}
export class FetchJustForYou implements Action {
	readonly type = JustForYouTypes.FetchJustForYou;
}

export class FetchJustForYouSuccess implements Action {
	readonly type = JustForYouTypes.FetchJustForYouSuccess;
	constructor(public payload: ServerJustForYouInterface,  public baseUrl: string, public categoryBase: string) { }
}

export class GetJustForYouProductList implements Action {
	readonly type = JustForYouTypes.GetJustForYouProductList;
	constructor(public productId: string) {}
}
export class FetchJustForYouFailure implements Action {
	readonly type = JustForYouTypes.FetchJustForYouFailure;
}

export class FetchJustForYouProductList implements Action {
	readonly type = JustForYouTypes.FetchJustForYouProductList;
	constructor(public productId: string) {}
}

export class FetchJustForYouProductListSuccess implements Action {
	readonly type = JustForYouTypes.FetchJustForYouProductListSuccess;
	constructor(public payload: ServerProductList,  public baseUrl: string, public categoryBase: string) { }
}

export class FetchJustForYouProductListFailure implements Action {
	readonly type = JustForYouTypes.FetchJustForYouProductListFailure;
}

export class UpdateJFYProductQuantity implements Action {
	readonly type = JustForYouTypes.UpdateJFYProductQuantity
	constructor(public productId: string, public quantity: number) {}
}
export class UpdateJFYGroupQuantity implements Action {
	readonly type = JustForYouTypes.UpdateJFYGroupQuantity
	constructor(public isIncrease: boolean) {}
}
export class SelectJFYProduct implements Action {
	readonly type = JustForYouTypes.SelectJFYProduct
	constructor(public productId: string) {}
}

/**
 * REDUX actions for featured slider
 */
export type JustForYouActions =
	| FetchJustForYou
	| FetchJustForYouSuccess
	| FetchJustForYouFailure

	| GetJustForYouProductList
	| FetchJustForYouProductList
	| FetchJustForYouProductListSuccess
	| FetchJustForYouProductListFailure

	| UpdateJFYProductQuantity
	| UpdateJFYGroupQuantity
	| SelectJFYProduct
	| ReloadJustForYou
