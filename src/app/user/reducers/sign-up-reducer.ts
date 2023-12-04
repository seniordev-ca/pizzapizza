// Models
import {
	ServerUserRegistrationInputInterface,
	ServerLoginErrorResponse
} from '../models/server-models/server-user-registration-input';
import {
	UserProfileInterface
} from '../models/user-personal-details';

// Actions
import {
	SignUpActionTypes,
	SignUpActions
} from '../actions/sign-up-actions';

// Reducer Mapping Helper
import { SignUpReducerHelper } from './mappers/sign-up-mapper';
import { AccountActions, AccountActionTypes } from '../actions/account-actions';
import { CouponWalletActions, CouponWalletActionTypes } from '../../common/actions/coupon-wallet';
import { SignUpFormErrorInterface } from '../components/sign-up/sign-up-form/sign-up-form.component';
import { Club1111ActionTypes, Club1111Actions } from '../actions/club1111-actions';

export interface State {
	userSignUpRequestPayload: ServerUserRegistrationInputInterface,
	userRegistrationError: SignUpFormErrorInterface,
	userUpdateProfileError: SignUpFormErrorInterface,
	isUpdateProfileError: boolean,
	loggedInUser: UserProfileInterface,
	loginFailure: ServerLoginErrorResponse,
	isJwtValid: boolean,
	isLoading: boolean,
	isFetched: boolean,
	isNewUser: boolean,
	isGuestCheckoutUser: boolean
}

export const initialState: State = {
	userSignUpRequestPayload: null,
	userRegistrationError: null,
	userUpdateProfileError: null,
	isUpdateProfileError: false,
	loggedInUser: null,
	loginFailure: null,
	isLoading: true,
	isFetched: false,
	isJwtValid: null,
	isNewUser: true,
	isGuestCheckoutUser: false
}

/**
 * Sign Up Reducer
 */
export function reducer(
	state = initialState,
	action: SignUpActions | AccountActions | CouponWalletActions | Club1111Actions
): State {

	switch (action.type) {

		case SignUpActionTypes.UserLogin:
		case SignUpActionTypes.GetUserSummary: {
			return {
				...state,
				isLoading: true
			}
		}

		case SignUpActionTypes.RegisterNewUserFailure: {
			const errors = action.signUpError
			const mappedErrors = SignUpReducerHelper.parseServerErrorToUIForm(errors)
			return ({
				...state,
				userSignUpRequestPayload: null,
				userRegistrationError: mappedErrors,
			})
		}

		case SignUpActionTypes.UserLoginSuccess:
		case SignUpActionTypes.RegisterNewUserSuccess:
		case SignUpActionTypes.GetUserSummarySuccess: {
			const userDetails = SignUpReducerHelper.parseUserSummaryServerToUI(action.userDetails);
			const isNewUser = !userDetails.isClubElevenElevenMember
			return ({
				...state,
				loggedInUser: userDetails,
				loginFailure: null,
				isJwtValid: true,
				isFetched: true,
				isLoading: false,
				isNewUser: isNewUser,
				isGuestCheckoutUser: false
			});
		}

		case SignUpActionTypes.UserLoginFailure:
		case SignUpActionTypes.GetUserSummaryFailure: {
			return ({
				...state,
				loggedInUser: null,
				loginFailure: action.errorResponse,
				isJwtValid: false,
				isFetched: true,
				isLoading: false,
			});
		}

		case SignUpActionTypes.UserLogsOut: {
			return {
				...initialState,
				isLoading: false
			}
		}

		case SignUpActionTypes.FetchUserEditProfileSuccess: {
			const userDetails = SignUpReducerHelper.parseUserSummaryServerToUI(action.userProfile);
			return {
				...state,
				loggedInUser: {
					...userDetails
				}
			}
		}

		case AccountActionTypes.SetUserDefaultPaymentMethodSuccess: {
			const defaultPayment = action.defaultPayment;
			return {
				...state,
				loggedInUser: {
					...state.loggedInUser,
					defaultPayment: defaultPayment ? {
						paymentMethod: defaultPayment.default_payment.payment_method,
						token: defaultPayment.default_payment.token
					} : {
							paymentMethod: null,
							token: null
						}
				}
			}
		}

		case SignUpActionTypes.ResetFormValidation: {
			return ({
				...state,
				loginFailure: null
			})
		}

		case CouponWalletActionTypes.AddCouponToWalletSuccess: {
			// const isUserHasCouponWallet = !state.loggedInUser.userHasCouponsInWallet ? true : false

			return {
				...state,
				loggedInUser: {
					...state.loggedInUser,
					userHasCouponsInWallet: true
				}
			}
		}

		case CouponWalletActionTypes.DeleteCouponFromWalletSuccess: {
			const couponCount = action.userCouponCount;
			const isUserHasCouponWallet = couponCount > 1;
			return {
				...state,
				loggedInUser: {
					...state.loggedInUser,
					userHasCouponsInWallet: isUserHasCouponWallet
				}
			}
		}

		case AccountActionTypes.SaveMealCardSuccess: {
			return {
				...state,
				loggedInUser: {
					...state.loggedInUser,
					isUserHasMealCard: true
				}
			}
		}
		case AccountActionTypes.DeleteMealCardSuccess: {
			return {
				...state,
				loggedInUser: {
					...state.loggedInUser,
					isUserHasMealCard: false
				}
			}
		}

		case SignUpActionTypes.FetchClub1111PrefillSuccess: {
			const prefillData = action.prefillData;
			const userDetails = state.loggedInUser;
			const prefillClub1111 = SignUpReducerHelper.parsePrefillData(prefillData);

			return {
				...state,
				loggedInUser: {
					...userDetails,
					clubElevenElevenData: prefillClub1111
				}
			}
		}
		case Club1111ActionTypes.RegisterNewClub111UserSuccess: {
			const userDetails = state.loggedInUser;
			return {
				...state,
				loggedInUser: {
					...userDetails,
					isClubElevenElevenMember: true
				}
			}
		}
		case Club1111ActionTypes.DeleteClubCardSuccess: {
			const userDetails = state.loggedInUser;
			return {
				...state,
				loggedInUser: {
					...userDetails,
					isClubElevenElevenMember: false,
					earnedText: null
				},
				isNewUser: true
			}
		}
		case SignUpActionTypes.UpdateUserEditProfileSuccess: {
			// we have to clear up picture name, because otherwise it will not update profile pic after saving it
			// unless we have to refresh the page.
			state.loggedInUser.profilePic = null;
			return {
				...state,
				isUpdateProfileError: false,
				userUpdateProfileError: null
			}
		}
		case SignUpActionTypes.UpdateUserEditProfileFailure: {
			const errorReason = action.errorResponse;
			const mappedErrors = SignUpReducerHelper.parseServerErrorToUIForm(errorReason)
			return {
				...state,
				isUpdateProfileError: true,
				userUpdateProfileError: mappedErrors
			}
		}

		case SignUpActionTypes.CheckoutAsGuestUser: {
			return {
				...state,
				isGuestCheckoutUser: true
			}
		}

		default: {
			return state;
		}
	}
}
