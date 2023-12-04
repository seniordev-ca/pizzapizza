import { Action } from '@ngrx/store';

import {
	ServerClub1111RegistrationInterface,
	ServerLoginResponseInterface,
	ServerClub1111RegistrationResponse
} from '../models/server-models/server-user-registration-input';
import { ServerValidationError } from '../../common/models/server-validation-error';
import { ServerUpdateAddressResponse } from '../models/server-models/server-account-interfaces';

import {
	Club11BalanceResponse,
	ClubTransactionsResponse,
	GiftCardBalanceResponse,
	ServerTransferBalanceRequest,
	ServerGiftCardBalance,
	ServerClub1111AddFundsSettings,
	ServerClub1111AutoReloadSettings
} from '../models/server-models/server-club11';
import { Club1111AddFundsUIInterface } from '../models/club11';

/**
 * Club 1111 Actions
 */
export enum Club1111ActionTypes {
	RegisterNewClub1111User = '[User](Club11) User Registers For Club 1111',
	RegisterNewClub111UserSuccess = '[User](Club11) User Registers For Club 1111, call succeeds, user is successfully registered',
	RegisterNewUClub111UserFailure = '[User](Club11) User Registers For Club 1111, call is unsuccessful, registration has failed',

	FetchClub11AccountBalance = '[User](Club11) FetchClub11AccountBalance',
	FetchClub11AccountBalanceSuccess = '[User](Club11) FetchClub11AccountBalanceSuccess',
	FetchClub11AccountBalanceFailure = '[User](Club11) FetchClub11AccountBalanceFailure',

	UpdateClub1111UserInfo = '[User](Club11) Update Club 1111 User Details',
	UpdateClub1111UserInfoSuccess = '[User](Club11) Update Club 1111 User Details Success',
	UpdateClub1111UserInfoFailed = '[User](Club11) Update Club 1111 User Details Failure',

	FetchClubTransactionHistory = '[User](Club11) FetchClubTransactionHistory',
	FetchClubTransactionHistorySuccess = '[User](Club11) FetchClubTransactionHistorySuccess',
	FetchClubTransactionHistoryFailure = '[User](Club11) FetchClubTransactionHistoryFailure',

	FetchClub11CardBalance = '[User](Club11) Fetch Card Balance via Number and Pin',
	FetchClub11CardBalanceSuccess = '[User](Club11) Fetch Card Balance Success',
	FetchClub11CardBalanceFailure = '[User](Club11) Fetch Card Balance Failure',

	TransferCardBalance = '[User](Club11) Transfer Club1111 Card Balance',
	TransferCardBalanceSuccess = '[User](Club11) Transfer Club1111 Card Balance Success',
	TransferCardBalanceFailure = '[User](Club11) Transfer Club1111 Card Balance Failure',

	ShowBecomeMemberSubHeader = '[User](Club11) ShowBecomeMemberSubHeader',
	DeleteClubCard = '[User](Club11) Delete Club Card From Account',
	DeleteClubCardSuccess = '[User](Club11) Delete Club Card From Account Success',
	DeleteClubCardFailure = '[User](Club11) Delete Club Card From Account Failure',

	FetchClub1111AddFundsSettings = '[User](Club11) Fetch Add Funds Settings',
	FetchClub1111AddFundsSettingsSuccess = '[User](Club11) Fetch Add Funds Settings Success',
	FetchClub1111AddFundsSettingsFailure = '[User](Club11) Fetch Add Funds Settings Failure',

	FetchClub1111AutoReloadSettings = '[User](Club11) Fetch Auto Reload Settings',
	FetchClub1111AutoReloadSettingsSuccess = '[User](Club11) Fetch Auto Reload Settings Success',
	FetchClub1111AutoReloadSettingsFailure = '[User](Club11) Fetch Auto Reload Settings Failure',
	ClearAutoReloadMessage =  '[User](Club11) Clear Failure Message for Auto Reload',

	AddClub1111FundsRequest = '[User](Club11) Add Funds Request',
	AddClub1111FundsRequestSuccess = '[User](Club11) Add Funds Request Success',
	AddClub1111FundsRequestFailure = '[User](Club11) Add Funds Request Failure',

	RemoveAutoReloadClub1111 = '[User](Club11) Remove Auto Reload',
	RemoveAutoReloadClub1111Success = '[User](Club11) Remove Auto Reload Success',
	RemoveAutoReloadClub1111Failure = '[User](Club11) Remove Auto Reload Failure',

	SendClubCardNumber = '[User](Club11) Send Club Card Number',
	SendClubCardNumberSuccess = '[User](Club11) Send Club Card Number Success',
	SendClubCardNumberFailure = '[User](Club11) Send Club Card Number Failur',

	PromptClub1111EarnedBanner = '[User](Club11) Prompt the Club 11-11 Banner'
}

export class RegisterNewClub1111User implements Action {
	readonly type = Club1111ActionTypes.RegisterNewClub1111User;
	constructor(public registarationRequestPayload: ServerClub1111RegistrationInterface) { }
}

export class RegisterNewClub111UserSuccess implements Action {
	readonly type = Club1111ActionTypes.RegisterNewClub111UserSuccess;
	constructor(public userDetails: ServerClub1111RegistrationResponse) { }
}

export class RegisterNewUClub111UserFailure implements Action {
	readonly type = Club1111ActionTypes.RegisterNewUClub111UserFailure;
	constructor(public signUpError: ServerValidationError) { }
}


export class FetchClub11AccountBalance implements Action {
	readonly type = Club1111ActionTypes.FetchClub11AccountBalance;
	constructor(public cardToken: string) { }
}

export class FetchClub11AccountBalanceSuccess implements Action {
	readonly type = Club1111ActionTypes.FetchClub11AccountBalanceSuccess;
	constructor(public club11Balance: Club11BalanceResponse) { }
}

export class FetchClub11AccountBalanceFailure implements Action {
	readonly type = Club1111ActionTypes.FetchClub11AccountBalanceFailure;
}


export class UpdateClub1111UserInfo implements Action {
	readonly type = Club1111ActionTypes.UpdateClub1111UserInfo;
	constructor(public registarationRequestPayload: ServerClub1111RegistrationInterface) { }
}

export class UpdateClub1111UserInfoSuccess implements Action {
	readonly type = Club1111ActionTypes.UpdateClub1111UserInfoSuccess;
	constructor(public payload: ServerUpdateAddressResponse) { }
}

export class UpdateClub1111UserInfoFailed implements Action {
	readonly type = Club1111ActionTypes.UpdateClub1111UserInfoFailed;
	constructor(public signUpError: ServerValidationError) { }
}

export class FetchClubTransactionHistory implements Action {
	readonly type = Club1111ActionTypes.FetchClubTransactionHistory;
	constructor(public clubCardToken: string) { }
}

export class FetchClubTransactionHistorySuccess implements Action {
	readonly type = Club1111ActionTypes.FetchClubTransactionHistorySuccess;
	constructor(public transactionsHistory: ClubTransactionsResponse) { }
}

export class FetchClubTransactionHistoryFailure implements Action {
	readonly type = Club1111ActionTypes.FetchClubTransactionHistoryFailure;
}

export class FetchClub11CardBalance implements Action {
	readonly type = Club1111ActionTypes.FetchClub11CardBalance;
	constructor(public cardNumber: string, public cardPin: number) { }
}
export class FetchClub11CardBalanceSuccess implements Action {
	readonly type = Club1111ActionTypes.FetchClub11CardBalanceSuccess;
	constructor(public response: GiftCardBalanceResponse) { }
}
export class FetchClub11CardBalanceFailure implements Action {
	readonly type = Club1111ActionTypes.FetchClub11CardBalanceFailure;
	constructor(public serverValidationError: ServerValidationError) { }
}

export class TransferCardBalance implements Action {
	readonly type = Club1111ActionTypes.TransferCardBalance;
	constructor(public transferRequest: ServerTransferBalanceRequest) { }
}
export class TransferCardBalanceSuccess implements Action {
	readonly type = Club1111ActionTypes.TransferCardBalanceSuccess;
	constructor(public clubBalance: ServerGiftCardBalance) { }
}

export class TransferCardBalanceFailure implements Action {
	readonly type = Club1111ActionTypes.TransferCardBalanceFailure;
	constructor(public serverValidationError: ServerValidationError) { }
}

export class ShowBecomeMemberSubHeader implements Action {
	readonly type = Club1111ActionTypes.ShowBecomeMemberSubHeader;
}

export class DeleteClubCard implements Action {
	readonly type = Club1111ActionTypes.DeleteClubCard;
}
export class DeleteClubCardSuccess implements Action {
	readonly type = Club1111ActionTypes.DeleteClubCardSuccess;
}
export class DeleteClubCardFailure implements Action {
	readonly type = Club1111ActionTypes.DeleteClubCardFailure;
}

// ServerClub111AddFundsRequest
export class FetchClub1111AddFundsSettings implements Action {
	readonly type = Club1111ActionTypes.FetchClub1111AddFundsSettings
}
export class FetchClub1111AddFundsSettingsSuccess implements Action {
	readonly type = Club1111ActionTypes.FetchClub1111AddFundsSettingsSuccess
	constructor(public settings: ServerClub1111AddFundsSettings) { }
}
export class FetchClub1111AddFundsSettingsFailure implements Action {
	readonly type = Club1111ActionTypes.FetchClub1111AddFundsSettingsFailure
}

export class AddClub1111FundsRequest implements Action {
	readonly type = Club1111ActionTypes.AddClub1111FundsRequest;
	constructor(public uiRequest: Club1111AddFundsUIInterface, public isAutoReload: boolean) {}
}
export class AddClub1111FundsRequestSuccess implements Action {
	readonly type = Club1111ActionTypes.AddClub1111FundsRequestSuccess;
	constructor(public club11Balance: Club11BalanceResponse, public amountAdded: number) {}
}

export class AddClub1111FundsRequestFailure implements Action {
	readonly type = Club1111ActionTypes.AddClub1111FundsRequestFailure
}

export class FetchClub1111AutoReloadSettings implements Action {
	readonly type = Club1111ActionTypes.FetchClub1111AutoReloadSettings
}
export class FetchClub1111AutoReloadSettingsSuccess implements Action {
	readonly type = Club1111ActionTypes.FetchClub1111AutoReloadSettingsSuccess
	constructor(public settings: ServerClub1111AutoReloadSettings) { }
}
export class FetchClub1111AutoReloadSettingsFailure implements Action {
	readonly type = Club1111ActionTypes.FetchClub1111AutoReloadSettingsFailure
	constructor(public error: ServerValidationError) { }
}
export class ClearAutoReloadMessage implements Action {
	readonly type = Club1111ActionTypes.ClearAutoReloadMessage
}
export class RemoveAutoReloadClub1111 implements Action {
	readonly type = Club1111ActionTypes.RemoveAutoReloadClub1111
}
export class RemoveAutoReloadClub1111Success implements Action {
	readonly type = Club1111ActionTypes.RemoveAutoReloadClub1111Success
	constructor(public settings: ServerClub1111AutoReloadSettings) { }
}
export class RemoveAutoReloadClub1111Failure implements Action {
	readonly type = Club1111ActionTypes.RemoveAutoReloadClub1111Failure
}

export class SendClubCardNumber implements Action {
	readonly type = Club1111ActionTypes.SendClubCardNumber
}
export class SendClubCardNumberSuccess implements Action {
	readonly type = Club1111ActionTypes.SendClubCardNumberSuccess
}
export class SendClubCardNumberFailure implements Action {
	readonly type = Club1111ActionTypes.SendClubCardNumberFailure
}

export class PromptClub1111EarnedBanner implements Action {
	readonly type = Club1111ActionTypes.PromptClub1111EarnedBanner
	constructor(public isBannerShown: boolean) { }
}
/**
 * NGRX actions for sign up
 */
export type Club1111Actions =
	| RegisterNewClub1111User
	| RegisterNewClub111UserSuccess
	| RegisterNewUClub111UserFailure

	| FetchClub11AccountBalance
	| FetchClub11AccountBalanceSuccess
	| FetchClub11AccountBalanceFailure

	| UpdateClub1111UserInfo
	| UpdateClub1111UserInfoSuccess
	| UpdateClub1111UserInfoFailed

	| FetchClubTransactionHistory
	| FetchClubTransactionHistorySuccess
	| FetchClubTransactionHistoryFailure

	| FetchClub11CardBalance
	| FetchClub11CardBalanceSuccess
	| FetchClub11CardBalanceFailure

	| TransferCardBalance
	| TransferCardBalanceSuccess
	| TransferCardBalanceFailure

	| DeleteClubCard
	| DeleteClubCardSuccess
	| DeleteClubCardFailure

	| ShowBecomeMemberSubHeader

	| FetchClub1111AddFundsSettings
	| FetchClub1111AddFundsSettingsSuccess
	| FetchClub1111AddFundsSettingsFailure
	| ClearAutoReloadMessage

	| AddClub1111FundsRequest
	| AddClub1111FundsRequestSuccess
	| AddClub1111FundsRequestFailure

	| FetchClub1111AutoReloadSettings
	| FetchClub1111AutoReloadSettingsSuccess
	| FetchClub1111AutoReloadSettingsFailure

	| RemoveAutoReloadClub1111
	| RemoveAutoReloadClub1111Success
	| RemoveAutoReloadClub1111Failure

	| SendClubCardNumber
	| SendClubCardNumberSuccess
	| SendClubCardNumberFailure

	| PromptClub1111EarnedBanner
