import {
	createSelector,
	createFeatureSelector,
} from '@ngrx/store';

// Import all reducers within the user modules
import * as fromSignUp from './sign-up-reducer';
import * as fromAccount from './account-reducer';
import * as fromClub1111 from './club11-reducer';
import * as fromGiftCard from './giftcard-reducer';
import * as fromKidsClub from './kids-club-reducer';
import { getSelectedStorePayments } from 'app/checkout/reducers';
import { ServerDefaultPaymentMethodEnum } from '../models/server-models/server-saved-cards-interfaces';

/**
 * Global state imported into root-reducer. No lazy loading
 */
export interface UserState {
	userLogin: fromSignUp.State
	userAccount: fromAccount.State
	userClub1111: fromClub1111.Club11State
	userGiftCard: fromGiftCard.State
	userKidsClub: fromKidsClub.State
}

/**
 * Combined User reducer for importing to root reducer
 */
export function userCombinedReducers(
	state: UserState = {} as UserState,
	action
) {
	return {
		userLogin: fromSignUp.reducer(state.userLogin, action),
		userAccount: fromAccount.reducer(state.userAccount, action),
		userClub1111: fromClub1111.reducer(state.userClub1111, action),
		userGiftCard: fromGiftCard.reducer(state.userGiftCard, action),
		userKidsClub: fromKidsClub.reducer(state.userKidsClub, action)
	}
}

// Define combined reducer selector
export const selectUserState = createFeatureSelector<UserState>('user');

/**
 * Sign Up selectors
 */
export const getUserSignUpServerPostData = createSelector(
	selectUserState,
	(state: UserState) => state.userLogin.userSignUpRequestPayload
)

/**
 * Registration Errors
 */
export const getRegistrationErrors = createSelector(
	selectUserState,
	(state: UserState) => {
		const club111Error = state.userClub1111.userRegistrationError;
		const stepOneError = state.userLogin.userRegistrationError;
		const defaultError = club111Error ? club111Error : stepOneError;

		return defaultError ? defaultError : null
	}
)
export const getRegistrationFailure = createSelector(
	selectUserState,
	(state: UserState) => {
		const successFailure = state.userClub1111.isRegistrationSuccessful;
		return successFailure
	}
)
/**
 * Logged In User Details
 */
export const getLoggedInUser = createSelector(
	selectUserState,
	(state: UserState) => state.userLogin.loggedInUser
)
export const getDefaultPaymentMethod = createSelector(
	getLoggedInUser,
	getSelectedStorePayments,
	(user, payments) => {
		const userDefault = user && user.defaultPayment ? user.defaultPayment.paymentMethod : null;
		const isDefaultCredit = userDefault === ServerDefaultPaymentMethodEnum.MASTERPASS ||
			userDefault === ServerDefaultPaymentMethodEnum.VISA ||
			userDefault === ServerDefaultPaymentMethodEnum.WALLET;
		const isDefaultMealCard = userDefault === ServerDefaultPaymentMethodEnum.MEAL_CARD;

		const isDefaultInvalid = payments ?
			(isDefaultCredit && !payments.online_credit) || (isDefaultMealCard && !payments.online_pizzacard) : false

		return userDefault && !isDefaultInvalid ? user.defaultPayment.paymentMethod : null
	}
)
/**
 * Logged Failure
 */
export const getLoginFailErorr = createSelector(
	selectUserState,
	(state: UserState) => state.userLogin.loginFailure
)

/**
 * Check if the JWT tokens are valid
 */
export const isUserJWTokensValid = createSelector(
	selectUserState,
	(state: UserState) => state.userLogin.isJwtValid
)
export const isUserLoggedIn = createSelector(
	selectUserState,
	(state: UserState) => {
		const isFeteched = state.userLogin.isFetched;
		const isLoading = state.userLogin.isLoading;
		const jwt = state.userLogin.isJwtValid;

		return (isFeteched && !isLoading) ? jwt : !(!isFeteched && !isLoading)
	}
)
export const isCheckoutReady = createSelector(
	selectUserState,
	(state: UserState) => {
		const isFeteched = state.userLogin.isFetched;
		const isLoading = state.userLogin.isLoading;
		const jwt = state.userLogin.isJwtValid;
		const isGuest = state.userLogin.isGuestCheckoutUser;
		const isUserCompletelyLoggedIn = (isFeteched && !isLoading) ? jwt : !(!isFeteched && !isLoading)
		let isSocial = false;
		if (isUserCompletelyLoggedIn) {
			isSocial = state.userLogin.loggedInUser ? !state.userLogin.loggedInUser.contactNumber.phoneNumber : false
		}
		return (isUserCompletelyLoggedIn || isGuest) && !isSocial
	}
)
export const isLogginLoading = createSelector(
	selectUserState,
	(state: UserState) => {
		const isFeteched = state.userLogin.isFetched;
		const isLoading = state.userLogin.isLoading;
		return isLoading
	}
)

/**
 * User Addresses
 */
export const getUserAddresses = createSelector(
	selectUserState,
	(state: UserState) => {
		return state.userAccount.accountAddresses || [];
	}
)

export const getSavedAddresses = createSelector(
	selectUserState,
	(state: UserState) => {
		const addresses = state.userAccount.accountAddresses;
		return addresses ? addresses.filter(address => address.isSaved) : null
	}
)

/**
 * Selected Address
 */
export const getSelectedAddress = createSelector(
	selectUserState,
	(state: UserState) => state.userAccount.selectedAddress
)

export const getUserStores = createSelector(
	selectUserState,
	(state: UserState) => state.userAccount.accountStores
)
export const getStoreList = createSelector(
	selectUserState,
	(state: UserState) => {
		if (!state.userAccount.storeSearchResults) {
			return null;
		}
		return state.userAccount.storeSearchResults;
	}
);
export const getisStoreSearchLoading = createSelector(
	selectUserState,
	(state: UserState) => state.userAccount.isStoreSearchLoading
)
export const getisStoreSearchError = createSelector(
	selectUserState,
	(state: UserState) => state.userAccount.isStoreSearchError
)

/**
 * Saved Cards
 */
export const getSavedCards = createSelector(
	selectUserState,
	(state: UserState) => state.userAccount.accountCards
)
export const getSelectedCard = createSelector(
	selectUserState,
	(state: UserState) => state.userAccount.selectedCard
)
export const getEditCard = createSelector(
	selectUserState,
	(state: UserState) => state.userAccount.editCard
)
export const showAddCardLoader = createSelector(
	selectUserState,
	(state: UserState) => state.userAccount.showLoadingState
)

/**
 * Credit Card Errors
 */
export const getAddCardFailure = createSelector(
	selectUserState,
	(state: UserState) => state.userAccount.newCreditCardFailureMessage
)

export const getAutoReloadCardFailure = createSelector(
	selectUserState,
	(state: UserState) => state.userClub1111.autoReloadFailureMessage
)

export const getCheckoutPaymentMethod = createSelector(
	selectUserState,
	(state: UserState) => {
		return state.userAccount.selectedPaymentMethod
	}
)
/**
 * Club 11 11
 */
export const userClub11 = createSelector(
	selectUserState,
	(state: UserState) => state.userClub1111
)

export const userHasClub11 = createSelector(
	userClub11,
	fromClub1111.userHasClub11
)

export const isBalanceLoading = createSelector(
	userClub11,
	fromClub1111.isBalanceLoading
)

export const getAccountBalance = createSelector(
	userClub11,
	fromClub1111.getAccountBalance
)

export const getTransactionHistory = createSelector(
	userClub11,
	fromClub1111.getTransactionHistory
)

export const getIsTransferCardLoading = createSelector(
	selectUserState,
	(state: UserState) => {
		const isLoading = state.userClub1111.isTransferCardLoading;
		const isFetched = state.userClub1111.isTransferCardFetched;
		return isLoading && !isFetched
	}
)
export const getIsTransferSuccessFul = createSelector(
	selectUserState,
	(state: UserState) => state.userClub1111.isTransferSuccessful
)
export const getTransferCardBalance = createSelector(
	selectUserState,
	(state: UserState) => state.userClub1111.transferCardDetails ? state.userClub1111.transferCardDetails.balance : null
)

export const getIsGiftCardLoading = createSelector(
	selectUserState,
	(state: UserState) => {
		const isLoading = state.userGiftCard.isGiftCardLoading;
		const isFetched = state.userGiftCard.isGiftCardFetched;
		return isLoading && !isFetched
	}
)

export const getGiftCardBalance = createSelector(
	selectUserState,
	(state: UserState) => state.userGiftCard.giftCardDetails ? state.userGiftCard.giftCardDetails.balance : null
)

export const getGiftCardHistory = createSelector(
	selectUserState,
	(state: UserState) => state.userGiftCard.transactionHistory
)

export const getAddFundsSettings = createSelector(
	selectUserState,
	(state: UserState) => state.userClub1111.addFundsSettings
)

export const getAutoReloadSettings = createSelector(
	selectUserState,
	(state: UserState) => state.userClub1111.autoReloadDetails
)

export const getKidsClubUsers = createSelector(
	selectUserState,
	(state: UserState) => state.userKidsClub.kidsClubDetails && state.userKidsClub.kidsClubDetails.length > 0
		? state.userKidsClub.kidsClubDetails : null
)
export const getTransferCardError = createSelector(
	selectUserState,
	(state: UserState) => state.userClub1111.transferCardError
)

export const getisEarnedBannerShown = createSelector(
	selectUserState,
	(state: UserState) => {
		if (state.userClub1111.club11Balance.earningsBanner) {
			return {
				isShown: state.userClub1111.isEarnedBannerShown,
				message: state.userClub1111.club11Balance.earningsBanner.message
			}
		}
	}
)
/**
 * Edit profile
 */
export const isUpdateProfileError = createSelector(
	selectUserState,
	(state: UserState) => state.userLogin.isUpdateProfileError
)
export const getUpdateProfileErrors = createSelector(
	selectUserState,
	(state: UserState) => state.userLogin.userUpdateProfileError
)

/**
 * kids club
 */
export const getKidsClubProfileErrors = createSelector(
	selectUserState,
	(state: UserState) => state.userKidsClub.kidsClubProfileError
)
