// Actions
import {
	SDKActionTypes
} from '../actions/sdk';
import { SdkResponse } from '../../catalog/models/server-sdk';

export interface State {
	isLoading: boolean,
	isFetched: boolean,
	sdkResponse: SdkResponse,
	activeSlug: string
}

export const initialState: State = {
	isLoading: true,
	isFetched: false,
	sdkResponse: null,
	activeSlug: null
}

/**
 * Settings reducer
 */
export function reducer(
	state = initialState,
	action
): State {
	switch (action.type) {
		case SDKActionTypes.InitialSDKLoad: {
			return {
				...state,
				isLoading: true,
				isFetched: false
			};
		}

		case SDKActionTypes.InitialSDKLoadSuccess: {
			return {
				...state,
				isLoading: false,
				isFetched: true,
			}
		}

		case SDKActionTypes.InitialSDKLoadFailure: {
			return {
				...state,
				isLoading: false,
				isFetched: false
			};
		}

		case SDKActionTypes.SaveSdkProductInfo: {
			return {
				...state,
				sdkResponse: action.sdkResponse,
				activeSlug: action.productSlug
			}
		}

		default: {
			return state
		}

	}
}

export const getIsSDKLoading = (state: State) => {
	return state.isLoading && !state.isFetched;
}

export const getIsSDKError = (state: State) => {
	return !state.isLoading && !state.isFetched;
}
