// NGRX core
import {
	createSelector,
	createFeatureSelector,
} from '@ngrx/store';

// Models
import {
	ServerUserRegistrationInputInterface, ServerRegistrationStatusEnum,
} from '../models/server-models/server-user-registration-input';
import { ServerValidationError } from '../../common/models/server-validation-error';

// Actions
import {
	Club1111ActionTypes,
	Club1111Actions
} from '../actions/club1111-actions';
import {
	SignUpActionTypes,
	SignUpActions
} from '../actions/sign-up-actions';

// Reducer Mapping Helper
import { SignUpReducerHelper } from './mappers/sign-up-mapper';
import { SignUpFormErrorInterface } from '../components/sign-up/sign-up-form/sign-up-form.component';

// Mapper
import { Club11Mapper } from './mappers/club11-mapper';

// View Models
import {
	Club11BalanceInterface,
	TransactionHistoryRowInterface,
	Club1111AddFundsSettingsUIInterface,
	Club1111AutoReloadSettingsUIInterface
} from '../models/club11';
import { GiftCardBalanceResponse } from '../models/server-models/server-club11';
import { CurrencyPipe } from '@angular/common';


export interface Club11State {
	userHasClub11: boolean,
	clubCardToken: string,

	isAccountBalanceLoading: boolean,
	isAccountBalanceFetched: boolean,
	club11Balance: Club11BalanceInterface,
	club11TransactionsHistory: TransactionHistoryRowInterface[],
	club11TransactionsPaginationCursor: string,

	userSignUpRequestPayload: ServerUserRegistrationInputInterface,
	userRegistrationError: SignUpFormErrorInterface,

	isTransferCardLoading: boolean,
	isTransferCardFetched: boolean,
	isTransferSuccessful: boolean,
	transferCardDetails: GiftCardBalanceResponse,
	transferCardError: SignUpFormErrorInterface,

	addFundsSettings: Club1111AddFundsSettingsUIInterface;
	autoReloadDetails: Club1111AutoReloadSettingsUIInterface;
	isEarnedBannerShown: boolean,
	isRegistrationSuccessful: boolean,
	autoReloadFailureMessage: string
}

export const initialState: Club11State = {
	userHasClub11: null,
	clubCardToken: null,

	userSignUpRequestPayload: null,
	userRegistrationError: null,
	club11Balance: {} as Club11BalanceInterface,
	club11TransactionsHistory: null,
	club11TransactionsPaginationCursor: null,

	isAccountBalanceLoading: false,
	isAccountBalanceFetched: false,

	isTransferCardLoading: false,
	isTransferCardFetched: false,
	isTransferSuccessful: false,
	transferCardDetails: null,
	transferCardError: null,

	addFundsSettings: null,
	autoReloadDetails: null,

	isEarnedBannerShown: false,

	isRegistrationSuccessful: null,
	autoReloadFailureMessage: null
}

/**
 * Sign Up Reducer
 */
export function reducer(
	state = initialState,
	action: Club1111Actions | SignUpActions
): Club11State {
// tslint:disable-next-line:cyclomatic-complexity
	switch (action.type) {

		case Club1111ActionTypes.FetchClub11AccountBalance: {
			return {
				...state,
				isAccountBalanceLoading: true,
				isAccountBalanceFetched: false,
			}
		}

		case Club1111ActionTypes.FetchClub11AccountBalanceFailure: {
			return {
				...state,
				isAccountBalanceLoading: false,
				isAccountBalanceFetched: false,
			}
		}

		case Club1111ActionTypes.FetchClub11AccountBalanceSuccess:
		case Club1111ActionTypes.AddClub1111FundsRequestSuccess: {
			const balanceServerResponse = action.club11Balance;
			const club11Balance = Club11Mapper.parseClub11Balance(balanceServerResponse);

			return {
				...state,
				userHasClub11: true,
				isAccountBalanceLoading: false,
				isAccountBalanceFetched: true,
				club11Balance
			}
		}

		case Club1111ActionTypes.RegisterNewUClub111UserFailure: {
			const errors = action.signUpError
			const mappedErrors = SignUpReducerHelper.parseServerErrorToUIForm(errors);
			let regFailure = null;
			// here if errors undefined means response was success:false
			if (typeof errors === 'undefined') {
				regFailure = false
			}
			return ({
				...state,
				userSignUpRequestPayload: null,
				userRegistrationError: mappedErrors,
				isRegistrationSuccessful: regFailure
			})
		}

		case SignUpActionTypes.GetUserSummarySuccess:
		case SignUpActionTypes.UserLoginSuccess: {
			const clubCardToken = action.userDetails.loyalty_card_token;

			return {
				...state,
				clubCardToken
			};
		}
		case SignUpActionTypes.RegisterNewUserSuccess: {
			const clubCardToken = action.userDetails.loyalty_card_token;
			let regFailure = null;
			if (action.userDetails.registration_status === ServerRegistrationStatusEnum.CLUB_11_11_FAIL) {
				regFailure = false
			}
			return {
				...state,
				clubCardToken,
				isRegistrationSuccessful: regFailure
			};
		}

		// club11TransactionsHistory
		case Club1111ActionTypes.FetchClubTransactionHistorySuccess: {
			const transactionResponse = action.transactionsHistory;
			const club11TransactionsHistory = Club11Mapper.parseClubTransactionsHistory(transactionResponse);
			const club11TransactionsPaginationCursor = transactionResponse.cursor;

			return {
				...state,
				club11TransactionsHistory,
				club11TransactionsPaginationCursor
			}
		}

		case Club1111ActionTypes.FetchClub11CardBalance: {
			return {
				...state,
				isTransferCardLoading: true,
				isTransferCardFetched: false,
				transferCardDetails: null,
				isTransferSuccessful: false,
				transferCardError: null
			}
		}
		case Club1111ActionTypes.FetchClub11CardBalanceSuccess: {
			return {
				...state,
				isTransferCardLoading: false,
				isTransferCardFetched: true,
				transferCardDetails: action.response,
				isTransferSuccessful: false,
				transferCardError: null
			}
		}
		case Club1111ActionTypes.FetchClub11CardBalanceFailure:
		case Club1111ActionTypes.TransferCardBalanceFailure: {
			// const mappedErrors = SignUpReducerHelper.parseServerErrorToUIForm(action.serverValidationError);
			const errors = action.serverValidationError;
			const mappedErrors = SignUpReducerHelper.parseServerErrorToUIForm(errors);

			return {
				...state,
				isTransferCardFetched: false,
				isTransferCardLoading: false,
				transferCardError: mappedErrors
			}
		}
		case Club1111ActionTypes.TransferCardBalance: {
			return {
				...state,
				isTransferCardLoading: true,
				isTransferCardFetched: false,
			}
		}
		case Club1111ActionTypes.TransferCardBalanceSuccess: {
			const newBalance = action.clubBalance.balance;
			return {
				...state,
				club11Balance: {
					...state.club11Balance,
					available: newBalance
				},
				transferCardDetails: null,
				isTransferCardFetched: true,
				isTransferSuccessful: true,
				isTransferCardLoading: false
			}
		}

		case Club1111ActionTypes.FetchClub1111AddFundsSettingsSuccess: {
			const settings = action.settings;
			const mappedSettings = {
				type: settings.type,
				frequency: settings.frequency,
				amount: settings.load_amount.map(amount => {
					return {
						label: new CurrencyPipe('en-CA').transform(amount, 'CAD', 'symbol-narrow', '1.2'),
						value: amount
					}
				})
			} as Club1111AddFundsSettingsUIInterface
			return {
				...state,
				addFundsSettings: mappedSettings
			}
		}

		case Club1111ActionTypes.FetchClub1111AutoReloadSettingsSuccess:
		case Club1111ActionTypes.RemoveAutoReloadClub1111Success: {
			const settings = action.settings;
			const mappedSettings = {
				type: settings.type,
				frequency: settings.frequency,
				amount: settings.amount,
				enabled: settings.enabled,
				thresholdAmount: settings.threshold_amount,
				token: settings.enabled ? settings.payment_data.token : null,
				email: settings.email
			} as Club1111AutoReloadSettingsUIInterface

			return {
				...state,
				autoReloadDetails: mappedSettings
			}
		}

		case SignUpActionTypes.UserLogsOut:
		case Club1111ActionTypes.DeleteClubCardSuccess: {
			return {
				...initialState
			}
		}

		case Club1111ActionTypes.FetchClub1111AutoReloadSettingsFailure: {
			const error = action.error;
			const failureMsg = error.errors.card_error
			return {
				...state,
				autoReloadFailureMessage: failureMsg
			}
		}

		case Club1111ActionTypes.ClearAutoReloadMessage: {
			return {
				...state,
				autoReloadFailureMessage: null
			}
		}

		case Club1111ActionTypes.PromptClub1111EarnedBanner: {
			const isBannerShown = action.isBannerShown;
			return {
				...state,
				isEarnedBannerShown: isBannerShown
			}
		}

		default: {
			return state;
		}
	}
}

export const userHasClub11 = (state: Club11State) => {
	return state.userHasClub11;
}

export const isBalanceLoading = (state: Club11State) => {
	return state.userHasClub11 && !state.isAccountBalanceLoading;
}

export const getAccountBalance = (state: Club11State) => {
	return state.club11Balance;
}

export const getTransactionHistory = (state: Club11State) => {
	return state.club11TransactionsHistory;
}
