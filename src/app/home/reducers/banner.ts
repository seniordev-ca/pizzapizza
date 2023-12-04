// ng rx
import {
	createEntityAdapter,
	EntityAdapter,
	EntityState
} from '@ngrx/entity';

// Models
import { ServerSingleBannerInterface } from '../models/server-banner';

// Actions
import {
	HomeBannerActionTypes,
	BannerActions
} from '../actions/banner'
import { UIBannerInterface } from '../models/banner-ui';


export interface State extends EntityState<ServerSingleBannerInterface> {
	isLoading: boolean,
	isFetched: boolean,
	ids: number[];
	uiBanners: UIBannerInterface[]
}

export const adapter: EntityAdapter<ServerSingleBannerInterface> = createEntityAdapter<ServerSingleBannerInterface>({
	selectId: (serverBanner: ServerSingleBannerInterface) => serverBanner.title,
	sortComparer: false
})

export const initialState: State = adapter.getInitialState({
	isLoading: true,
	isFetched: false,
	ids: [],
	uiBanners: []
})

/**
 * Categories reducer
 */
export function reducer(
	state = initialState,
	action: BannerActions
): State {
	switch (action.type) {
		case HomeBannerActionTypes.ReloadBanner: {
			return adapter.removeAll({
				...state,
				...initialState
			});
		}

		case HomeBannerActionTypes.FetchBannerSuccess: {
			const changes = action.payload;
			const mappedBanners = changes.map(banner => {
				return {
					id: banner.id,
					mobileImage: banner.mobile_image,
					desktopImage: banner.desktop_image,
					sequence: banner.sequence,
					title: banner.title,
					url: banner.url
				} as UIBannerInterface
			})
				return adapter.upsertMany(changes, {
					...state,
					isLoading: false,
					isFetched: true,
					uiBanners: mappedBanners
				});
		}

		case HomeBannerActionTypes.FetchBannerFailure: {
			return {
				...state,
				isLoading: false,
				isFetched: false,
				uiBanners: []
			}
		}

		default: {
			return state;
		}
	}
}


export const getIds = (state: State) => state.ids;
export const getIsBannerLoading = (state: State) => {
	return state.isLoading && !state.isFetched;
}
export const getIsBannerError = (state: State) => {
	return !state.isLoading && !state.isFetched;
}

