// Core
import {
	Component,
	OnDestroy,
	Inject,
	PLATFORM_ID,
	LOCALE_ID
} from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

// NGRX
import { Store, select, ActionsSubject } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

// Reducer selectors
import * as fromCommon from '../../../common/reducers';
import * as fromUser from '../../../user/reducers';

// Actions
import { StoreActionsTypes } from '../../../common/actions/store';

// View Models
import { UserSummaryInterface } from '../../../user/models/user-personal-details';
import { StoreServerInterface } from '../../../common/models/server-store';

// Components
import { LocationModalComponent } from '../location-modal/location-modal.component';
import { MobileNavComponent } from '../mobile-nav/mobile-nav.component';
import { couponParentContainerEnum } from '../../../common/widgets/add-coupon/add-coupon.widget';
import { AddressInputInterface } from 'app/common/models/address-input';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss'],
})

export class HeaderComponent implements OnDestroy {
	couponParentContainerEnum = couponParentContainerEnum;
	navbarCollapsed = true;

	selectedStore$: Observable<StoreServerInterface>;
	isActiveDelivery$: Observable<boolean>;
	isStoreLoading$: Observable<boolean>;

	loginUser$: Observable<UserSummaryInterface>;

	userInputAddress$: Observable<string>;
	isAddressComplete$: Observable<boolean>;
	isFrench: boolean;
	// couponValidationMsg$: Observable<string>;
	// isCouponValid$: Observable<boolean>;

	dispatchSubscribtionRef;
	private isBrowser: boolean;
	constructor(
		private modalService: NgbModal,
		private store: Store<fromCommon.State>,
		private dispatcher: ActionsSubject,
		@Inject(PLATFORM_ID) platformId,
		@Inject(LOCALE_ID) protected localId: string
	) {
		this.selectedStore$ = this.store.pipe(select(fromCommon.getSelectedStore));
		this.isActiveDelivery$ = this.store.pipe(select(fromCommon.getSelectedTab));
		this.isStoreLoading$ = this.store.pipe(select(fromCommon.getSettingLoadState));
		this.loginUser$ = this.store.pipe(select(fromUser.getLoggedInUser));
		this.userInputAddress$ = this.store.pipe(select(fromCommon.getUserInputAddress));
		this.isAddressComplete$ = this.store.pipe(select(fromCommon.getIsAddressComplete))

		// this.couponValidationMsg$ = this.store.pipe(select(fromCommon.getCouponValidationMsg));
		// this.isCouponValid$ = this.store.pipe(select(fromCommon.getIsCouponValid));

		this.isBrowser = isPlatformBrowser(platformId);

		// Checks to see if there is a selected store, if not then open the location modal
		if (this.isBrowser) {
			this.dispatchSubscribtionRef = this.dispatcher.pipe(
				filter(action => action.type === StoreActionsTypes.ShowLocationModal)
			).subscribe(() =>
				this.openLocationModal()
			);
		}

		this.isFrench = this.localId === 'fr';
	}

	/**
	 * Unsubscribe on destroy
	 */
	ngOnDestroy() {
		if (this.dispatchSubscribtionRef) {
			this.dispatchSubscribtionRef.unsubscribe();
		}
	}

	/**
	 * Open navigation menu modal for mobile
	 */
	openMobileNav() {
		const modalRef = this.modalService.open(MobileNavComponent, {
			windowClass: 'mobile-nav-container',
		});
	}

	/**
	 * Open navigation menu modal for locations
	 */
	openLocationModal() {
		const modalRef = this.modalService.open(LocationModalComponent, {
			windowClass: 'location-modal-container',
		}).componentInstance;
	}

}
