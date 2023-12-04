// NGRX
import { RecommendationActionTypes } from '../actions/recommendations';
import { Product } from '../../catalog/models/product';
import { CartActionsTypes } from '../../checkout/actions/cart';
import { ServerProductInListInterface } from '../../catalog/models/server-product-in-list';

export interface State {
	isLoading: boolean,
	isFetched: boolean,
	recommendations: Product[],
}

export const initialState: State = {
	isLoading: true,
	isFetched: false,
	recommendations: null
}
class RecommendationsMapperHelper {
	/**
	 * Build the product list
	 */
	static buildProductList(products: ServerProductInListInterface[], baseUrl): Product[] {
		const orderedProducts = products.sort(function (leftProduct, rightProduct) {
			return leftProduct.sequence - rightProduct.sequence;
		});
		return orderedProducts.map(product => {
			return {
				id: product.product_id,
				name: product.name,
				description: product.description,
				image: baseUrl + '2x/' + product.image,
				priceText: {
					labels: product.price_text.labels,
					priceValue: product.price_text.price_value
				},
				// TODO - confirm if cal_text is required
				// calText: product.cal_text,
				marketingBadge: {
					text: product.marketing_badge ? product.marketing_badge.text : null,
					color: product.marketing_badge ? product.marketing_badge.color : null,
					fontKey: product.marketing_badge ? product.marketing_badge.font_key : null
				},
				isCustomizationAllowed: product.allow_customization,
				isQuantityIncrementerDisplayed: product.allow_qty_selection,
				isQuickAddAllowed: product.allow_quick_add,
				isAddableToCartWithoutCustomization: product.allow_add_to_cart,
				isComboProduct: product.kind === 'combo' ? true : false,
				seoTitle: product.seo_title,
				quantity: product.quantity ? product.quantity : 1 // set quanity to 1 by default
			} as Product
		});
	}
}
/**
 * Recommendations reducer
 */
export function reducer(
	state = initialState,
	action
): State {
	switch (action.type) {

		case RecommendationActionTypes.FetchRecommendations: {
			return {
				...initialState
			}
		}

		case RecommendationActionTypes.FetchRecommendationsSuccess: {
			const recommendations = action.response;
			const baseUrl = action.baseUrl;
			const mappedRecommendations = RecommendationsMapperHelper.buildProductList(recommendations, baseUrl);

			return {
				...state,
				isFetched: true,
				isLoading: false,
				recommendations: mappedRecommendations
			}
		}

		case CartActionsTypes.AddBasicProductToCart: {
			const isRecommendation = action.isRecommendation;
			const productId = action.productId;
			const recommendations = state.recommendations;
			if (isRecommendation) {
				const selectedProduct = recommendations.find(product => product.id === productId);
				selectedProduct.isSelected = true;
			}
			return {
				...state
			}
		}

		case RecommendationActionTypes.FetchRecommendationsFailure: {
			return {
				...state,
				isFetched: true,
				isLoading: false,
				recommendations: null
			}
		}

		default: {
			return {
				...state
			}
		}
	}
}
