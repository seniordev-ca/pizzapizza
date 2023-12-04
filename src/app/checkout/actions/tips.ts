// NGRX core
import { Action } from '@ngrx/store';
// Server Models
import { TipsResponse } from '../models/server-tips';

/**
 * Club 11-11 and gift card actions
 */

export enum TipsActionsTypes {
	ApplyTips = '[Checkout](Tip) Apply Tips',
	TipsSuccess = '[Checkout](Tip) Tips Success',
	TipsFailure = '[Checkout](Tip) Tips Failure',
}

export class ApplyTips implements Action {
	readonly type = TipsActionsTypes.ApplyTips;
	constructor(public tipAmount: number, public tipType: string , public isTips: boolean) {}
}


export class TipsSuccess implements Action {
	readonly type = TipsActionsTypes.TipsSuccess;
	constructor(public tipAmount: string, public isTips?: boolean) { }
}

export class TipsFailure implements Action {
	readonly type = TipsActionsTypes.TipsFailure;
}

export type TipsAction =
	| ApplyTips
	| TipsSuccess
	| TipsFailure
