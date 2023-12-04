import { ServerCouponItem, ServerCouponStatusEnum } from '../../models/server-coupon';
import { CouponItemUIInterface } from '../../models/coupon-ui-interface';

export class CouponMapperHelper {
	/**
	 * Map server coupon to ui
	 */
	static mapServerCouponToUI(coupons: ServerCouponItem[], baseUrl: string): CouponItemUIInterface[] {
		return coupons.map(coupon => {
			return {
				id: coupon.coupon_id,
				title: coupon.name,
				imageUrl: coupon.image ? baseUrl + '2x/' + coupon.image : null,
				expiryDate: coupon.expiry_date,
				description: coupon.description,
				status: coupon.status,
				couponCode: coupon.coupon_code,
				isExpired: coupon.status === ServerCouponStatusEnum.Expired,
				isExpiring: coupon.status === ServerCouponStatusEnum.Expiring,
				tag: coupon.tag
			} as CouponItemUIInterface
		})
	}
}
