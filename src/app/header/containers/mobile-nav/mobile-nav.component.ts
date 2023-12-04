import { Component, ViewEncapsulation, ViewChild, Input, Inject, LOCALE_ID } from '@angular/core';
import { StoreServerInterface } from '../../../common/models/server-store'
import { UserSummaryInterface } from '../../../user/models/user-personal-details';
import { couponParentContainerEnum } from '../../../common/widgets/add-coupon/add-coupon.widget';

@Component({
	selector: 'app-mobile-nav',
	templateUrl: './mobile-nav.component.html',
	styleUrls: ['./mobile-nav.component.scss'],
	encapsulation: ViewEncapsulation.None
})

export class MobileNavComponent {
	couponParentContainerEnum = couponParentContainerEnum;
	isFrench: boolean;

	@ViewChild('menuVerticalModal', { static: true }) menuVerticalModalRef;
	@Input() isDelivery: boolean;
	@Input() selectedStore: StoreServerInterface;
	@Input() userDetails: UserSummaryInterface;


	constructor(
		@Inject(LOCALE_ID) protected localId: string
	) {
		this.isFrench = this.localId === 'fr';
	}
	/**
	 * Public method for opening configuration modal
	 * TODO pass product id to it
	*/
	open() {
		this.menuVerticalModalRef.openModal()
	}

	/**
	 * Public method for closing configuration modal
	 */
	close() {
		this.menuVerticalModalRef.closeModal()
	}
}
