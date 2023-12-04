// NGRX core
import { Action } from '@ngrx/store';
// Server Models
import { RedeemClubCardResponse } from '../models/server-loyalty';

/**
 * Club 11-11 and gift card actions
 */

export enum LoyaltyActionsTypes {
	RedeemLoyaltyCard = '[Checkout](Loyalty) Redeem Loyalty Card',
	RedeemLoyaltyCardSuccess = '[Checkout](Loyalty) Redeem Loyalty Card Success',
	RedeemLoyaltyCardFailure = '[Checkout](Loyalty) Redeem Loyalty Card Failure',
}

export class RedeemLoyaltyCard implements Action {
	readonly type = LoyaltyActionsTypes.RedeemLoyaltyCard;
	constructor(public redeemAmount: number, public isGiftCard: boolean) {}
}

export class RedeemLoyaltyCardSuccess implements Action {
	readonly type = LoyaltyActionsTypes.RedeemLoyaltyCardSuccess;
	constructor(public redeemRequest: RedeemClubCardResponse, public redeemAmount: number) { }
}

export class RedeemLoyaltyCardFailure implements Action {
	readonly type = LoyaltyActionsTypes.RedeemLoyaltyCardFailure;
}

export type LoyaltyAction =
	| RedeemLoyaltyCard
	| RedeemLoyaltyCardSuccess
	| RedeemLoyaltyCardFailure
