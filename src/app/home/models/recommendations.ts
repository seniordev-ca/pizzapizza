/**
 * Switch Template Enum
 */
export enum RecommendationTemplateEnum {
	ClubElevenEleven = 'club_11_11',
	LastOrder = 'repeat_order',
	Default = 'product_list',
	MyPizzas = 'my_pizzas',
	CouponWallet = 'coupon_wallet'
}

export interface RecommendationInterface {
	id: number;
	image: string;
	title: string;
	template?: RecommendationTemplateEnum;
	class?: string;
	promoText?: string;
	seoTitle?: string;
	orderTotal?: number;
	couponCount?: number;
}
