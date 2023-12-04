// ng rx
import {
	createEntityAdapter,
	EntityAdapter,
	EntityState
} from '@ngrx/entity';

// Models
import { ServerProductList } from '../models/server-products-list';

// Actions
import {
	FeaturedSliderActions,
	CatalogFeaturedSliderTypes
} from '../actions/featured-products';

// interface
import { SliderInterface } from '../../home/models/featured-slider';
import { ImportFeatureCategory, CatalogCategoriesTypes, CategoriesActions } from '../actions/category';

export interface State extends EntityState<ServerProductList> {
	isLoading: boolean,
	isFetched: boolean,
	ids: number[];
	selectedId: number | null;
	featuredProducts: SliderInterface[],
	isError: boolean
}

export const adapter: EntityAdapter<ServerProductList> = createEntityAdapter<ServerProductList>({
	selectId: (featuredProduct: ServerProductList) => featuredProduct.category.id,
	sortComparer: false
})

export const initialState: State = adapter.getInitialState({
	isLoading: true,
	isFetched: false,
	ids: [],
	selectedId: null,
	featuredProducts: [],
	isError: false
})

/**
 * Home page featured products reducer
 */
export function reducer(
	state = initialState,
	action: FeaturedSliderActions | CategoriesActions
): State {
	switch (action.type) {
		case CatalogFeaturedSliderTypes.FetchFeaturedSlides:
		case CatalogFeaturedSliderTypes.ReloadFeatureSlides: {
			return adapter.removeAll({
				...state,
				isLoading: true,
				isFetched: false,
				selectedId: null,
				featuredProducts: []
			});
		}

		case CatalogFeaturedSliderTypes.FetchFeaturedSlidesSuccess: {

			const changes = action.payload;
			const baseUrl = action.baseUrl;
			const mappedChanges = changes.products.map(featuredProduct => {
				// const baseImageUrl = this.appSettingsService.getFeaturedBaseUrl();
				return {
					...featuredProduct,
					image: featuredProduct.is_wp_image ? featuredProduct.image : baseUrl + featuredProduct.image,
					style: {
						colorBackground: featuredProduct.color_background,
						colorOne: featuredProduct.color_one,
						colorTwo: featuredProduct.color_two
					}
				} as SliderInterface;
			})

			// since we fetched data now we can use properties of  ServerProductList interface
			// const id = changes.category.id;

			return adapter.upsertOne(
				changes,
				{
					...state,
					isLoading: false,
					isFetched: true,
					featuredProducts: mappedChanges
				}
			);
		}

		case CatalogFeaturedSliderTypes.FetchFeaturedSlidesFailure: {
			return {
				...state,
				isLoading: false,
				isFetched: false
			}
		}

		case CatalogCategoriesTypes.ImportFeatureCategory: {
			const isError = state.ids.length < 1;
			return {
				...state,
				isLoading: false,
				isFetched: true,
				isError
			}
		}

		default: {
			return state;
		}
	}
}


export const getIds = (state: State) => state.ids;
export const getIsFeaturedLoading = (state: State) => {
	return state.isLoading && !state.isFetched;
}
export const getIsFeaturedError = (state: State) => {
	return state.isError;
}
