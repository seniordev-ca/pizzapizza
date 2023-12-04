
import {
	DevActions,
	DevActionsTypes
} from '../actions/dev-actions';

export interface State {
	baseApiUrl: string | null,
	mockHeader: string | null,
	isMockImageBaseUrl: boolean | null,
}

export const initialState: State = {
	baseApiUrl: null,
	mockHeader: null,
	isMockImageBaseUrl: false
}

/**
 * Dev tool reducer
 */
export function reducer(
	state = initialState,
	action: DevActions
): State {
	switch (action.type) {

		case DevActionsTypes.SetBaseApiUrl: {
			return {
				...state,
				baseApiUrl: action.baseUrl
			};
		}

		case DevActionsTypes.SetMockHeader: {
			return {
				...state,
				mockHeader: action.mockUrl
			}
		}

		case DevActionsTypes.ToggleMockImageBaseUrl: {
			return {
				...state,
				isMockImageBaseUrl: !state.isMockImageBaseUrl
			}
		}

		case DevActionsTypes.SetDevSettingsFromLocalStorage: {

			if (!action['devSettings'] || !action['devSettings']['environment']) {
				return state;
			} else {
				const devEnvironment = action['devSettings']['environment'];
				return {
					...state,
					...devEnvironment
				};
			}
		}

		default: {
			return state
		}

	}
}

export const getDevSetting = (state: State) => {
	return state;
}
