import { Action } from '@ngrx/store';
import { ServerPizzaAssistantResponse, ServerPizzaAssistantHelp } from '../models/server-pizza-assistant';
import { AddCartServerRequestInterface } from '../../checkout/models/server-cart-request';
import { getPizzaAssistantMessage } from '../reducers';

/**
 * Pizza Assistant Types
 */
export enum PizzaAssistantActionTypes {
	InitPizzaAssistant = '(Catalog)[Pizza Assistant] Initalize Pizza Assistant',
	SendPizzaAssistantMessage = '(Catalog)[Pizza Assistant] Send Pizza Assistant Message',
	SendPizzaAssistantMessageSuccess = '(Catalog)[Pizza Assistant] Send Pizza Assistant Message Success',
	SendPizzaAssistantMessageFailure = '(Catalog)[Pizza Assistant] Send Pizza Assistant Message Failure',
	OpenPizzaAssistantProductInModal = '(Catalog)[Pizza Assistant] Open Pizza Assistant Product In Modal',
	RemoveProductFromPizzaAssistant = '(Catalog)[Pizza Assistant] Remove Product From Pizza Assistant',
	UpdatePizzaAssistantProductViaCartRequest = '(Catalog)[Pizza Assistant] Get Cart Request To Update Product in Pizza Assistant',
	UpdatePizzaAssistantProduct = '(Catalog)[Pizza Assistant] Update Product in Pizza Assistant',
	FetchPizzaAssistantHelpConfig = '(Catalog)[Pizza Assistant] Get Pizza Assistant Configuration',
	FetchPAConfigHelpSuccess = '(Catalog)[Pizza Assistant] Get Pizza Assistant Help Configuration Success',
	FetchPAConfigHelpFailure = '(Catalog)[Pizza Assistant] Get Pizza Assistant Help Configuration Failure',
	ClearPizzaAssistant = '(Catalog)[Pizza Assistant] Clear Pizza Assistant Products'
}

export class InitPizzaAssistant implements Action {
	readonly type = PizzaAssistantActionTypes.InitPizzaAssistant;
}
export class SendPizzaAssistantMessage implements Action {
	readonly type = PizzaAssistantActionTypes.SendPizzaAssistantMessage;
	constructor(public message: string) { }
}

export class SendPizzaAssistantMessageSuccess implements Action {
	readonly type = PizzaAssistantActionTypes.SendPizzaAssistantMessageSuccess;
	constructor(public response: ServerPizzaAssistantResponse, public baseUrl: string) { }
}

export class SendPizzaAssistantMessageFailure implements Action {
	readonly type = PizzaAssistantActionTypes.SendPizzaAssistantMessageFailure;
}

export class OpenPizzaAssistantProductInModal implements Action {
	readonly type = PizzaAssistantActionTypes.OpenPizzaAssistantProductInModal;
	constructor(public lineId: number) { }

}

export class RemoveProductFromPizzaAssistant implements Action {
	readonly type = PizzaAssistantActionTypes.RemoveProductFromPizzaAssistant;
	constructor(public lineId: number) { }

}

export class UpdatePizzaAssistantProductViaCartRequest implements Action {
	readonly type = PizzaAssistantActionTypes.UpdatePizzaAssistantProductViaCartRequest;
}
export class UpdatePizzaAssistantProduct implements Action {
	readonly type = PizzaAssistantActionTypes.UpdatePizzaAssistantProduct;
	constructor(public lineId: number, public addToCartRequest: AddCartServerRequestInterface, public price: number) { }
}

export class FetchPizzaAssistantHelpConfig implements Action {
	readonly type = PizzaAssistantActionTypes.FetchPizzaAssistantHelpConfig;
}
export class FetchPAConfigHelpSuccess implements Action {
	readonly type = PizzaAssistantActionTypes.FetchPAConfigHelpSuccess;
	constructor(public payload: ServerPizzaAssistantHelp) { }
}
export class FetchPAConfigHelpFailure implements Action {
	readonly type = PizzaAssistantActionTypes.FetchPAConfigHelpFailure;
}

export class ClearPizzaAssistant implements Action {
	readonly type = PizzaAssistantActionTypes.ClearPizzaAssistant;
}

export type PizzaAssistantActions =
	| InitPizzaAssistant
	| SendPizzaAssistantMessage
	| SendPizzaAssistantMessageSuccess
	| SendPizzaAssistantMessageFailure
	| OpenPizzaAssistantProductInModal
	| RemoveProductFromPizzaAssistant
	| UpdatePizzaAssistantProductViaCartRequest
	| UpdatePizzaAssistantProduct
	| FetchPizzaAssistantHelpConfig
	| FetchPAConfigHelpSuccess
	| FetchPAConfigHelpFailure
	| ClearPizzaAssistant
