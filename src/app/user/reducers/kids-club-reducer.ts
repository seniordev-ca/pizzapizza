import { KidsClubActions, KidsClubActionTypes } from '../actions/kids-club-actions';
import { RegisteredKidsClubInterface } from '../models/registered-kids-club';
import { KidsClubReducerHelp } from './mappers/kidsclub-mapper';
import { SignUpActionTypes, SignUpActions } from '../actions/sign-up-actions';
import { SignUpFormErrorInterface } from '../components/sign-up/sign-up-form/sign-up-form.component';
import { SignUpReducerHelper } from './mappers/sign-up-mapper';

export interface State {
	isKidsClubLoading: boolean
	isKidsClubFetched: boolean
	kidsClubDetails: RegisteredKidsClubInterface[]
	kidsClubProfileError: SignUpFormErrorInterface
}

export const initialState: State = {
	isKidsClubLoading: false,
	isKidsClubFetched: false,
	kidsClubDetails: null,
	kidsClubProfileError: null
}

/**
 * Kids Club Reducer
 */
export function reducer(
	state = initialState,
	action: KidsClubActions | SignUpActions
): State {

	switch (action.type) {

		case KidsClubActionTypes.RegisterNewKidsClub:
		case KidsClubActionTypes.UpdateKidsClub: {
			return {
				...state,
				isKidsClubLoading: true,
				isKidsClubFetched: false
			}
		}

		case KidsClubActionTypes.FetchUserKidsClubSuccess: {
			const response = action.response;
			const kidsClubDetails = response.map(kid => KidsClubReducerHelp.parseSeverToUIKidsClub(kid))

			return {
				...state,
				isKidsClubLoading: false,
				isKidsClubFetched: true,
				kidsClubDetails
			}
		}
		case KidsClubActionTypes.RegisterNewKidsClubSuccess: {
			const response = action.response;
			const currentKids = state.kidsClubDetails;
			const mappedUpdate = KidsClubReducerHelp.parseSeverToUIKidsClub(response)
			let kidsClubDetails = currentKids ? currentKids : []
			if (currentKids && currentKids.find(kid => kid.id === mappedUpdate.id)) {
				kidsClubDetails = currentKids.map(kid => {
					if (kid.id === mappedUpdate.id) {
						return mappedUpdate
					}
					return kid
				})
			} else {
				kidsClubDetails = kidsClubDetails.concat(mappedUpdate)
			}

			return {
				...state,
				isKidsClubLoading: false,
				isKidsClubFetched: true,
				kidsClubDetails,
				kidsClubProfileError: null
			}
		}

		case KidsClubActionTypes.UpdateKidsClubSuccess: {
			const response = action.response;
			const currentKids = state.kidsClubDetails;
			const mappedUpdate = KidsClubReducerHelp.parseSeverToUIKidsClub(response)
			let kidsClubDetails = currentKids ? currentKids : []
			if (currentKids && currentKids.find(kid => kid.id === mappedUpdate.id)) {
				kidsClubDetails = currentKids.map(kid => {
					if (kid.id === mappedUpdate.id) {
						return mappedUpdate
					}
					return kid
				})
			}

			return {
				...state,
				isKidsClubLoading: false,
				isKidsClubFetched: true,
				kidsClubDetails,
				kidsClubProfileError: null
			}
		}

		case KidsClubActionTypes.DeleteKidsClubUserSuccess: {
			// TODO - delete user based on id
			const id = action.id;
			const kidsClubDetails = state.kidsClubDetails.filter(kid => kid.id !== id)
			return {
				...state,
				isKidsClubLoading: false,
				isKidsClubFetched: true,
				kidsClubDetails
			}
		}

		case KidsClubActionTypes.FetchUserKidsClubFailure: {
			return {
				...state,
				isKidsClubLoading: false,
				isKidsClubFetched: false,
			}
		}

		case KidsClubActionTypes.RegisterNewKidsClubFailure:
		case KidsClubActionTypes.UpdateKidsClubFailure: {
			const errorReason = action.errorResponse;
			const mappedErrors = SignUpReducerHelper.parseServerErrorToUIForm(errorReason)
			return {
				...state,
				isKidsClubLoading: false,
				isKidsClubFetched: false,
				kidsClubProfileError: mappedErrors
			}
		}

		case SignUpActionTypes.UserLogsOut: {
			return {
				...initialState
			}
		}

		default: {
			return {
				...state
			}
		}
	}
}
