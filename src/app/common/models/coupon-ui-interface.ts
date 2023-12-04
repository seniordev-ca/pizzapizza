export interface CouponItemUIInterface {
	title: string,
	imageUrl: string,
	expiryDate: string,
	description: string,
	status?: string,
	couponCode?: string,
	isSingleUse?: boolean,
	isExpired?: boolean,
	isExpiring?: boolean,
	isAdded?: boolean,
	isLoading?: boolean,
	id?: string,
	tag?: string
}
