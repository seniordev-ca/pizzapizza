import { ServerPaymentCardStatusEnum, ServerPaymentCardTypeEnum } from './server-models/server-saved-cards-interfaces';

export interface UISavedCardsInterface {
	token: string,
	cardType: ServerPaymentCardTypeEnum,
	name: string,
	number: string,
	isDefault: boolean,
	status: ServerPaymentCardStatusEnum
}
