// Server models
import {
	AppSettingsInterface
} from '../models/server-app-settings';

// Actions
import {
	GlobalActions,
	GlobalActionsTypes
} from '../actions/global';
import { ServerMenuInterface } from '../models/server-menu';
import { FooterMenuActionTypes, FooterMenuActions } from '../actions/menu';
import { UIFooterMenuInterface } from '../models/footer-menu';
import { KumulosActions, KumulosActionTypes } from '../actions/kumulos';
import { StoreActions, StoreActionsTypes } from '../actions/store';

export interface State {
	isLoading: boolean,
	isFetched: boolean,
	data: AppSettingsInterface | null,
	footerMenu: UIFooterMenuInterface[],
	legalMenu: UIFooterMenuInterface[],
	kumulosUserId: string,
	isLocationModalFindMe: boolean,
	isLocationModalFromCheckout: boolean,
}

export const initialState: State = {
	isLoading: true,
	isFetched: false,
	data: null,
	footerMenu: null,
	legalMenu: null,
	kumulosUserId: null,
	isLocationModalFindMe: false,
	isLocationModalFromCheckout: false,
}

/**
 * Settings reducer
 */
export function reducer(
	state = initialState,
	action: GlobalActions | FooterMenuActions | KumulosActions | StoreActions
): State {
	switch (action.type) {
		case GlobalActionsTypes.FetchSettings: {
			return {
				...state,
				isLoading: true,
				isFetched: false
			};
		}

		case GlobalActionsTypes.FetchSettingsSuccess: {
			const appConfig = action.payload;
			const mockImageUrls = action['mockImageUrls'];

			if (mockImageUrls) {
				for (const key of Object.keys(mockImageUrls)) {
					const imageBaseUrl = mockImageUrls[key];
					appConfig.web_links.image_urls[key] = imageBaseUrl;
				}
			}
			// appConfig.web_links.sdk = 'http://localhost:8080/bundle.js';


			return {
				...state,
				isLoading: false,
				isFetched: true,
				data: appConfig
			}
		}

		case GlobalActionsTypes.FetchSettingsFailure: {
			return {
				...state,
				isLoading: false,
				isFetched: false
			};
		}

		case FooterMenuActionTypes.FetchFooterMenuSuccess: {
			const menu = action.menu;
			const mainMenu = menu['main-menu'] ? menu['main-menu'].items : [];
			const secondMenu = menu['legal-menu'] ? menu['legal-menu'].items : []
			const footerMenu = mainMenu.filter(item => item.parent_id === '0').map(parent => {
				return {
					label: parent.title,
					id: parent.id,
					childItems: mainMenu.filter(item => item.parent_id === parent.id)
				} as UIFooterMenuInterface
			})
			const legalMenu = secondMenu.map(item => {
				return {
					label: item.title,
					id: item.id,
					url: item.url
				} as UIFooterMenuInterface
			})
			return {
				...state,
				footerMenu,
				legalMenu
			}
		}

		case KumulosActionTypes.StoreKumulosUserID: {
			const kumulosUserId = action.user;
			return {
				...state,
				kumulosUserId
			}
		}

		case StoreActionsTypes.ShowLocationModal: {
			return {
				...state,
				isLocationModalFindMe: action.isFindMe,
				isLocationModalFromCheckout: action.isFromCheckout
			}
		}

		case StoreActionsTypes.ClearLocationModalStates: {
			return {
				...state,
				isLocationModalFromCheckout: false,
				isLocationModalFindMe: false
			}
		}

		default: {
			return state
		}

	}
}

export const getIsSettingLoading = (state: State) => {
	return state.isLoading && !state.isFetched;
}

export const getIsSettingError = (state: State) => {
	return !state.isLoading && !state.isFetched;
}
