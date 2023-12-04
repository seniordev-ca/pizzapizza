import { Action } from '@ngrx/store';
import { StoreServerInterface } from '../models/server-store';

/**
 * Add to cart or checkout validation handling
 */
import { ServerValidationDetails } from '../models/server-validation-error'

/**
 * Global cart and cart validation actions
 */
export enum CartValidationTypes {
	ShowValidation = '[Common](Cart Validation) Show Validation'
}

export class ShowValidation implements Action {
	readonly type = CartValidationTypes.ShowValidation;
	constructor(public validationDetails: ServerValidationDetails, public store: StoreServerInterface) { }
}

/**
 * Cart validation Actions
 */
export type CartValidationActions =
	| ShowValidation
