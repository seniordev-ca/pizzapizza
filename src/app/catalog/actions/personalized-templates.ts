import { Action } from '@ngrx/store';
import { ServerPersonalizedTemplateResponse } from '../models/server-product-config';
import { PersonalizedMessageUI } from '../models/personalized-templates';
import { ServerCartResponseProductListInterface } from '../../checkout/models/server-cart-response';
import { AddCartServerRequestInterface } from '../../checkout/models/server-cart-request';

/**
 * Template actions
 */
export enum TemplateActionsTypes {
	FetchPersonalizedTemplateByID = '[Catalog](Configurator) Find Personalized Template By ID',
	FetchPersonalizedTemplateByIDSuccess = '[Catalog](Configurator) Update Personalized Template Array',
	FetchPersonalizedTemplateByIDFailure = '[Catalog](Configurator) Update Personalized Template Array Failure',
	UpdateUserPersonalizedForm = '[Catalog](Configurator) Update The User Form On Add To Cart',
	AddChildMessageToCartRequest = '[Catalog](Configurator) Add Personalized Message To Add To Cart Request For Combos'
}

export class FetchPersonalizedTemplateByID implements Action {
	readonly type = TemplateActionsTypes.FetchPersonalizedTemplateByID;
	constructor(public templateID: number) {}
}
export class FetchPersonalizedTemplateByIDSuccess implements Action {
	readonly type = TemplateActionsTypes.FetchPersonalizedTemplateByIDSuccess;
	constructor(
		public response: ServerPersonalizedTemplateResponse,
		public cartProduct?: ServerCartResponseProductListInterface,
		public comboLineId?: number,
		public currentAddToCartRequest?: AddCartServerRequestInterface
	) {}
}
export class FetchPersonalizedTemplateByIDFailure implements Action {
	readonly type = TemplateActionsTypes.FetchPersonalizedTemplateByIDFailure;
}

export class UpdateUserPersonalizedForm implements Action {
	readonly type = TemplateActionsTypes.UpdateUserPersonalizedForm;
	constructor(public personalizedMessage: PersonalizedMessageUI) {}
}

export class AddChildMessageToCartRequest implements Action {
	readonly type = TemplateActionsTypes.AddChildMessageToCartRequest;
	constructor(public personalizedMessage: PersonalizedMessageUI, public lineId: number) {}
}

export type TemplateActions =
	| FetchPersonalizedTemplateByID
	| FetchPersonalizedTemplateByIDSuccess
	| FetchPersonalizedTemplateByIDFailure
	| UpdateUserPersonalizedForm
	| AddChildMessageToCartRequest
