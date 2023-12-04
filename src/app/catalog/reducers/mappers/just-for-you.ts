// Server Models
import { ServerJustForYouInterface, serverJustForYouKinds } from '../../models/server-just-for-you';

// View Models
import { RecommendationTemplateEnum, RecommendationInterface } from '../../../home/models/recommendations';

/**
 * Class that exports reducer helper for just for you
 */
export class JustForYouReducerHelper {

/**
 * The role of this class is to map Just For You server response to view model
 */
static parseJustForYouList(
	justForYouServerObj: ServerJustForYouInterface,
	justForYouBaseImageUrl: string): RecommendationInterface[] {

	return justForYouServerObj.cards.sort(function (leftProduct, rightProduct) {
		return leftProduct.sequence - rightProduct.sequence;
	}).map(object => {
		const baseUrl = justForYouBaseImageUrl;

		let template = RecommendationTemplateEnum.Default;
		switch (object.kind) {
			case serverJustForYouKinds.club_11_11: {
				template = RecommendationTemplateEnum.ClubElevenEleven
				break
			}
			case serverJustForYouKinds.my_pizzas: {
				template = RecommendationTemplateEnum.MyPizzas
				break
			}
			case serverJustForYouKinds.repeat_order: {
				template = RecommendationTemplateEnum.LastOrder
				break
			}
			case serverJustForYouKinds.coupone_wallet: {
				template = RecommendationTemplateEnum.CouponWallet
				break
			}
		}
		return {
			id: object.id,
			image: baseUrl + object.image,
			title: object.label,
			template,
			promoText: object.data ? object.data.description : null,
			seoTitle: object.data ? object.data.seo_title : null,
			orderTotal: object.data ? object.data.order_total : null,
			couponCount: object.data ? object.data.coupon_count : null
		} as RecommendationInterface
	})

}

}
