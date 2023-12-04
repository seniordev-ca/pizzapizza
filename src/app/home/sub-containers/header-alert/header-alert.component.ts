// Angular Core
import {
	Component,
	Input,
	ViewEncapsulation,
	OnDestroy,
	Inject,
	PLATFORM_ID
} from '@angular/core';

// NGRX core
import { Store, select, ActionsSubject } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

// Actions
import { Club1111ActionTypes } from '../../../user/actions/club1111-actions';

// Reducers
import * as fromCheckout from '../../../checkout/reducers';
import * as fromUser from '../../../user/reducers';

// View Model
import { OrderInformationInterface } from '../../../checkout/components/order-confirmation/order-info/order-info.component';
import { isPlatformBrowser } from '@angular/common';

/**
* Header Alert
*/
@Component({
	selector: 'app-header-alert',
	templateUrl: './header-alert.component.html',
	styleUrls: ['./header-alert.component.scss'],
	encapsulation: ViewEncapsulation.None
})

export class HeaderAlertComponent implements OnDestroy {
	// Sub header messages
	isOrderConfirmationShown = false;
	isClubInviteShown = false;
	isClubRedeemShown = false;
	clubEarningsBannerText: string;

	// Order tracker
	activeOrder$: Observable<OrderInformationInterface>;
	listenerRef = {};
	isBrowser: boolean

	constructor(
		private checkoutStore: Store<fromCheckout.CheckoutState>,
		private userStore: Store<fromUser.UserState>,
		private actions: ActionsSubject,
		@Inject(PLATFORM_ID) platformId,
	) {
		this.isBrowser = isPlatformBrowser(platformId);

		this.activeOrder$ = this.checkoutStore.pipe(select(fromCheckout.getOrderStatus));

		if (this.isBrowser) {
			this.listenerRef['activeOrderSubscriptionRef'] = this.activeOrder$.subscribe(data => {
				if (data.orderId) {
					this.isOrderConfirmationShown = true;
				}
			})

			// this.listenerRef['appActionsSubscriptionRef'] = this.actions.pipe(
			// 	filter(action => action.type === Club1111ActionTypes.ShowBecomeMemberSubHeader)
			// ).subscribe((action) => {
			// 	this.isClubInviteShown = true;
			// })

			this.listenerRef['userClubBalanceRef'] = this.userStore.pipe(select(fromUser.getisEarnedBannerShown)).subscribe(balance => {
				if (balance && balance.isShown) {
					this.clubEarningsBannerText = balance.message
					this.isClubRedeemShown = balance.isShown;
				}
			})
		}
	}

	/**
	 * Component destructor
	 */
	ngOnDestroy() {
		for (const key in this.listenerRef) {
			if (this.listenerRef[key]) {
				this.listenerRef[key].unsubscribe();
			}
		}
	}

	/**
	 * Internal Close Alert
	 */
	closeAlert() {
		this.isOrderConfirmationShown = false;
		this.isClubInviteShown = false;
		this.isClubRedeemShown = false;
	}

}
