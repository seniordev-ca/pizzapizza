import {
	Component,
	Input,
	ViewEncapsulation,
	Output,
	EventEmitter
} from '@angular/core';
import { CouponItemUIInterface } from '../../../../common/models/coupon-ui-interface';
import { couponParentContainerEnum } from '../../../../common/widgets/add-coupon/add-coupon.widget';
// import { CouponEmitterInterface } from '../../../../common/components/shared/add-coupon/add-coupon.component';

interface CouponsListInterface {
	listTitle: string,
	couponsArray: CouponItemUIInterface[]
}

/**
 * Coupons wallet list actions
 */
export enum couponListActions {
	addCouponToCard,
	deleteCouponFromWallet
}

export interface CouponListActionsInterface {
	action: couponListActions,
	coupon: CouponItemUIInterface
}

/**
 * Used on following containers:
 * - user/containers/club-eleven-landing.component.html
 * - user/containers/club-eleven-loyalty.component.html
 */
@Component({
	selector: 'app-coupons-list',
	templateUrl: './coupons-list.component.html',
	styleUrls: ['./coupons-list.component.scss'],
	encapsulation: ViewEncapsulation.None
})

class CouponsListComponent {
	couponParentContainerEnum = couponParentContainerEnum;
	couponDetails: CouponsListInterface;
	loadingCouponId: string;

	@Input() set couponsList (coupons: CouponsListInterface) {
		this.couponDetails = coupons;
		this.loadingCouponId = null;
	}
	@Input() isCouponValid: boolean;
	@Input() validationText: string;
	// @Output() addCouponOutputEmitter: EventEmitter<CouponEmitterInterface> =
	// 	new EventEmitter<CouponEmitterInterface>();
	@Output() walletListEventEmitter: EventEmitter<CouponListActionsInterface> =
		new EventEmitter<CouponListActionsInterface>();

	constructor() {
	}

	/**
	 * Handle for add to cart button
	 */
	onAddCouponClick(couponUi: CouponItemUIInterface) {
		this.walletListEventEmitter.emit({
			action: couponListActions.addCouponToCard,
			coupon: couponUi
		} as CouponListActionsInterface);
	}

	/**
	 * Handler for remove coupon from wallet
	 */
	onDeleteCouponClick(couponUi: CouponItemUIInterface) {
		this.walletListEventEmitter.emit({
			action: couponListActions.deleteCouponFromWallet,
			coupon: couponUi
		} as CouponListActionsInterface);
	}

}

export {
	CouponsListComponent,
	CouponsListInterface
}
