// ng rx
import { AccountActions, AccountActionTypes } from '../actions/account-actions';
import { AddressListInterface } from '../../common/models/address-list';
import { StoreListInterface } from '../../common/models/store-list';
import { AccountMapperHelper } from './mappers/account-mapper';
import { SignUpActions, SignUpActionTypes } from '../actions/sign-up-actions';
import { UISavedCardsInterface } from '../models/user-saved-cards';
import { ServerPaymentCardTypeEnum, ServerDefaultPaymentMethodEnum } from '../models/server-models/server-saved-cards-interfaces';
// tslint:disable-next-line:max-line-length
import { CheckoutPaymentMethodFormActionEnum } from 'app/common/components/shared/checkout-payment-method-form/checkout-payment-method-form.component';
export interface State {
	accountAddresses: AddressListInterface[],
	selectedAddress: AddressListInterface

	accountStores: StoreListInterface[],
	storeSearchResults: StoreListInterface[],
	isStoreSearchLoading: boolean;
	isStoreSearchError: boolean;

	accountCards: UISavedCardsInterface[],
	selectedCard: UISavedCardsInterface,
	selectedPaymentMethod: CheckoutPaymentMethodFormActionEnum,
	editCard: UISavedCardsInterface,

	showLoadingState: boolean,

	isAccountAddressesFetched: boolean,
	isAccountStoresFetched: boolean,
	newCreditCardFailureMessage: string
}

export const initialState: State = {
	accountAddresses: null,
	selectedAddress: null,

	accountStores: null,
	storeSearchResults: null,
	isStoreSearchLoading: false,
	isStoreSearchError: false,

	accountCards: null,
	selectedCard: null,
	selectedPaymentMethod: null,
	editCard: null,

	showLoadingState: false,
	isAccountAddressesFetched: false,
	isAccountStoresFetched: false,
	newCreditCardFailureMessage: null
}

/**
 * Sign Up Reducer
 */
// tslint:disable-next-line:cyclomatic-complexity
export function reducer(
	state = initialState,
	action: AccountActions | SignUpActions
): State {

	switch (action.type) {
		case AccountActionTypes.RequestAccountAddresses: {
			return {
				...state,
				selectedAddress: null
			}
		}
		case AccountActionTypes.RequestAccountAddressesSuccess: {
			return ({
				...state,
				accountAddresses: AccountMapperHelper.parseAccountAddresses(action.accountAddresses),
				isAccountAddressesFetched: true
			})
		}
		case AccountActionTypes.RequestAccountStoresSuccess: {
			return ({
				...state,
				accountStores: AccountMapperHelper.parseServerStoresToUI(action.accountStores),
				isAccountStoresFetched: true,
			})
		}
		case AccountActionTypes.GetAddressByID: {
			const selectedAddress = state.accountAddresses ?
				state.accountAddresses.find(address => address.addressId === action.addressID) || null : null;
			return ({
				...state,
				selectedAddress
			})
		}
		case AccountActionTypes.SearchForStores: {
			return {
				...state,
				isStoreSearchLoading: true,
				isStoreSearchError: false
			}
		}
		case AccountActionTypes.SearchForStoresSuccess: {
			return {
				...state,
				isStoreSearchLoading: false,
				isStoreSearchError: false,
				storeSearchResults: AccountMapperHelper.parseServerStoresToUI(action.payload.stores)
			}
		}
		case AccountActionTypes.SearchForStoresFailure: {
			return {
				...state,
				storeSearchResults: null,
				isStoreSearchLoading: false,
				isStoreSearchError: true
			}
		}
		case AccountActionTypes.SyncUserStores:
		case AccountActionTypes.ClearStoreSearch: {
			return {
				...state,
				storeSearchResults: null,
				isStoreSearchLoading: false,
				isStoreSearchError: false
			}
		}
		case AccountActionTypes.RequestSavedCards: {
			const defaultCard = state.selectedCard;

			return {
				...state,
				selectedCard: defaultCard,
				editCard: null
			}
		}
		case AccountActionTypes.RequestSavedCardsSuccess: {
			let existingCards = state.accountCards ? state.accountCards.filter(card => card.cardType === ServerPaymentCardTypeEnum.MealCard) : [];
			const selectedPaymentMethod = state.selectedPaymentMethod;
			const selectedCard = state.selectedCard;

			const defaultToken = action.userDefaultToken;
			const accountCards = AccountMapperHelper.parseServerCardsToUI(action.userCards, defaultToken)

			const defaultCard = accountCards && !selectedPaymentMethod ? accountCards.find(card => card.token === defaultToken) : selectedCard

			existingCards = existingCards.concat(accountCards)

			return {
				...state,
				accountCards: existingCards,
				selectedCard: defaultCard
			}
		}
		case AccountActionTypes.AddUserCard:
		case AccountActionTypes.AddUserCardForCheckout: {
			return {
				...state,
				showLoadingState: true,
				newCreditCardFailureMessage: null
			}
		}
		case AccountActionTypes.AddUserCardSuccess:
		case AccountActionTypes.AddUserCardForCheckoutSuccess: {
			let existingCards = state.accountCards ? state.accountCards.filter(card => card.cardType === ServerPaymentCardTypeEnum.MealCard) : [];

			const defaultToken = action.userDefaultToken;

			const accountCards = AccountMapperHelper.parseServerCardsToUI(action.response, defaultToken)
			const selectedCard = action.type === AccountActionTypes.AddUserCardForCheckoutSuccess
				? accountCards.find(card => card.token === action.response.recent_token)
				: state.selectedCard

			existingCards = existingCards.concat(accountCards)

			return {
				...state,
				accountCards: existingCards,
				showLoadingState: false,
				selectedCard,
				newCreditCardFailureMessage: null
			}
		}
		case AccountActionTypes.AddUserCardFailure:
		case AccountActionTypes.AddUserCardForCheckoutFailure: {
			const error = action.error;
			const failureMessage = error.errors.card_error ? error.errors.card_error : null
			return {
				...state,
				showLoadingState: false,
				newCreditCardFailureMessage: failureMessage
			}
		}
		case AccountActionTypes.ClearCardFailureMessage: {
			return {
				...state,
				newCreditCardFailureMessage: null
			}
		}
		case AccountActionTypes.SaveMealCardSuccess: {
			let existingCards = state.accountCards ? state.accountCards.filter(card => card.cardType !== ServerPaymentCardTypeEnum.MealCard) : [];
			const currentDefault = existingCards.find(card => card.isDefault);
			const defaultToken = currentDefault ? currentDefault.token : null;
			const newMealCard = AccountMapperHelper.parseSingleServerCardToUI(action.savedCardData, defaultToken);

			existingCards = existingCards.concat(newMealCard)

			return {
				...state,
				accountCards: existingCards
			}

		}
		case SignUpActionTypes.UserLoginSuccess:
		case SignUpActionTypes.GetUserSummarySuccess: {
			const userDetails = action.userDetails;
			const isMealCardDefault = userDetails.default_payment ?
				userDetails.default_payment.payment_method === ServerDefaultPaymentMethodEnum.MEAL_CARD : false
			const userMealCard = userDetails.meal_card && userDetails.meal_card.token ? action.userDetails.meal_card : null;
			let existingCards = state.accountCards ? state.accountCards.filter(card => card.cardType !== ServerPaymentCardTypeEnum.MealCard) : [];
			const currentDefault = isMealCardDefault ? userMealCard : existingCards.find(card => card.isDefault);
			const defaultToken = currentDefault ? currentDefault.token : null;

			if (userMealCard) {
				const newMealCard = AccountMapperHelper.parseSingleServerCardToUI(userMealCard, defaultToken);
				existingCards = existingCards.concat(newMealCard)
			}

			return {
				...state,
				accountCards: existingCards
			}
		}
		case AccountActionTypes.SelectPaymentMethodForCheckout: {
			const selectedToken = action.token;
			const selectedCard = state.accountCards ? state.accountCards.find(card => card.token === selectedToken) : null;
			const selectedPaymentMethod = action.checkoutPaymentMethodAction;

			return {
				...state,
				selectedCard,
				selectedPaymentMethod,
				editCard: null
			}
		}
		case AccountActionTypes.SetUserDefaultPaymentMethodSuccess: {
			const defaultToken = action.defaultPayment ? action.defaultPayment.default_payment.token : null;
			const accountCards = state.accountCards ? state.accountCards.map(card => {
				return {
					...card,
					isDefault: defaultToken === card.token
				} as UISavedCardsInterface
			}) as UISavedCardsInterface[] : null;

			const defaultCard = accountCards ? accountCards.find(card => card.token === defaultToken) : null

			return {
				...state,
				accountCards,
				selectedCard: defaultCard
			}
		}
		case AccountActionTypes.EditPaymentMethod: {
			const editToken = action.token;
			const accountCards = state.accountCards;
			const editCard = accountCards.find(card => card.token === editToken);
			return {
				...state,
				editCard,
				selectedCard: null
			}
		}

		case AccountActionTypes.DeleteMealCardSuccess: {
			const accountCards = state.accountCards;
			return {
				...state,
				accountCards: accountCards.filter(card => card.cardType !== ServerPaymentCardTypeEnum.MealCard)
			}
		}
		/**
		 * When the user signs out we should clear the state
		 */
		case SignUpActionTypes.UserLogsOut: {
			return {
				...initialState
			}
		}
		default: {
			return state;
		}
	}
}

export const getStoreList = (state: State) => {
	if (!state.storeSearchResults) {
		return null;
	}
	return state.storeSearchResults;
}
