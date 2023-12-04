// Models
import { TipsResponse } from '../models/server-tips';


// Actions
import {  TipsAction, TipsActionsTypes } from '../actions/tips';



export interface State {
	isTipLoading: boolean
	isTipApplied: boolean
	tipResponse: TipsResponse
}

export const initialState: State = {
	tipResponse: null,
	isTipApplied: false,
	isTipLoading: false,
}

/**
 * Sign Up Reducer
 */
export function reducer(
	state = initialState,
	action: TipsAction
): State {

	switch (action.type) {

		case TipsActionsTypes.ApplyTips: {
			return {
				...state,
				isTipApplied: false,
				isTipLoading: false,
				tipResponse: null
			}
		}
		case TipsActionsTypes.TipsSuccess: {
			return {
				...state,
				isTipApplied: action.isTips,
				isTipLoading: false
			}
		}

		case TipsActionsTypes.TipsFailure: {
			return {
				...state,
				isTipApplied: false,
				isTipLoading: false,
				tipResponse:  null,
			}
		}
		default: {
			return state;
		}
	}
}
export const isTipsLoading = (state: State) => {
	return state.isTipLoading
}

export const isTipsApplied = (state: State) => {
	return state.isTipApplied;
}

