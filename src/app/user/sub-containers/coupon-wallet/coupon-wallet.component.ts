// Angular Core
import {
	Component,
	ViewEncapsulation,
	ViewChild,
	HostListener,
	ElementRef,
	OnDestroy,
	Inject,
	PLATFORM_ID,
	OnInit
} from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';

// Interfaces
import {
	ConfirmationModalComponent
} from '../../../common/components/modals/confirmation-modal/confirmation-modal.component';
import { CouponItemUIInterface } from '../../../common/models/coupon-ui-interface';
import {
	CouponListActionsInterface,
	couponListActions
} from '../../../user/components/common/coupons-list/coupons-list.component';

// NG RX core
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

// Reduce, actions
import * as fromReducers from '../../../common/reducers/';
import {
	AddCouponToWallet,
	ApplyWalletCoupon,
	ClearCouponWalletValidation,
	DeleteCouponFromWallet,
	FetchCouponWallet
} from '../../../common/actions/coupon-wallet';
import { ActivatedRoute } from '@angular/router';

@Component({
	selector: 'app-coupon-wallet-container',
	templateUrl: './coupon-wallet.component.html',
	styleUrls: ['./coupon-wallet.component.scss'],
	providers: [ConfirmationModalComponent],
	encapsulation: ViewEncapsulation.None
})

export class CouponWalletComponent implements OnDestroy, OnInit {
	@ViewChild('couponCursor', { static: false }) couponCursor: ElementRef;
	@ViewChild('confirmDeleteCoupon', { static: true }) confirmDeleteCoupon: ConfirmationModalComponent;
	@ViewChild('couponInCartModal', { static: true }) couponInCartModal: ConfirmationModalComponent;

	couponsArray$: Observable<CouponItemUIInterface[]>
	couponValidationMsg$: Observable<string>
	isCouponValid$: Observable<boolean>
	couponWalletCursor$: Observable<string>
	isLoading$: Observable<boolean>;
	couponCursorString: string;
	isCouponInCart: boolean;
	couponErrorMsg: string;
	activeCouponId: string;

	deepLinkedCoupon: string;

	couponCursorSubscriptionRef;
	couponErrorSubscriptionRef;
	couponDeepLinkSubscriptionRef;

	private isRenderedOnServer: boolean;

	constructor(
		private confirmModal: ConfirmationModalComponent,
		private store: Store<fromReducers.CommonState>,
		private route: ActivatedRoute,
		@Inject(PLATFORM_ID) platformId
	) {
		this.isRenderedOnServer = isPlatformServer(platformId);

		// Get the coupon wallet from the store
		this.couponsArray$ = this.store.pipe(select(fromReducers.getCouponWallet))
		this.couponValidationMsg$ = this.store.pipe(select(fromReducers.getCouponValidationMsg));
		this.isCouponValid$ = this.store.pipe(select(fromReducers.getIsCouponValid));
		this.couponWalletCursor$ = this.store.pipe(select(fromReducers.getCouponWalletCursor));
		this.couponCursorSubscriptionRef = this.couponWalletCursor$.subscribe(cursor => {
			this.couponCursorString = cursor;
		})

		this.isLoading$ = this.store.pipe(select(fromReducers.getIsCouponWalletLoading));
		this.couponErrorSubscriptionRef = this.store.pipe(select(fromReducers.getCouponWalletToCartError)).subscribe(msg => {
			if (msg) {
				this.isCouponInCart = true;
				this.confirmModal.onOpen(this.couponInCartModal)
				this.couponErrorMsg = msg;
			}
		})
	}

	/**
	 * Init
	 */
	ngOnInit() {
		this.couponDeepLinkSubscriptionRef = this.route
		.queryParams
		.subscribe(params => {
			this.deepLinkedCoupon = params['coupon'];
			if (this.deepLinkedCoupon) {
				const el = document.getElementById('wallet');
				el.scrollIntoView({behavior: 'smooth'});
				this.store.dispatch(new AddCouponToWallet(this.deepLinkedCoupon));
			}
		});
	}

	/**
	 * Destroy
	 */
	ngOnDestroy() {
		if (this.couponErrorSubscriptionRef) {
			this.couponErrorSubscriptionRef.unsubscribe();
		}
		if (this.couponCursorSubscriptionRef) {
			this.couponCursorSubscriptionRef.unsubscribe();
		}
		if (this.couponDeepLinkSubscriptionRef) {
			this.couponDeepLinkSubscriptionRef.unsubscribe();
		}
	}
	/**
	 * Close Coupon In Cart Error
	 */
	onRetryClickHandler() {
		this.isCouponInCart = false;
		this.couponErrorMsg = null;
		this.store.dispatch(new ClearCouponWalletValidation());
	}

	/**
	 * Handle coupons list actions
	 */
	handleWalletListEventEmitter(couponEvent: CouponListActionsInterface) {
		this.activeCouponId = couponEvent.coupon.id;
		switch (couponEvent.action) {
			case couponListActions.addCouponToCard: {
				this.store.dispatch(new ApplyWalletCoupon(this.activeCouponId));
				break
			}
			case couponListActions.deleteCouponFromWallet: {
				this.confirmModal.onOpen(this.confirmDeleteCoupon);
			}
		}
	}

	/**
	 * Confirms that the user wants to delete the coupon
	 */
	onConfirmDelete() {
		this.store.dispatch(new DeleteCouponFromWallet(this.activeCouponId));
	}
	/**
	 * Listen for window scroll and when it hits the bottom. This will triggler pagination
	 */
	@HostListener('window:scroll', ['$event'])
	checkifElementInView() {
		if (this.isRenderedOnServer) {
			return false;
		}

		if (this.couponCursor && this.couponCursorString) {
			const scrollPos = window.scrollY;

			const windowHeight = 'innerHeight' in window ? window.innerHeight : document.documentElement.offsetHeight;

			const elementHeight = this.couponCursor.nativeElement.offsetHeight;
			const elementPos = this.couponCursor.nativeElement.offsetTop || 0;

			if (scrollPos >= elementPos || (scrollPos + windowHeight) >= (elementPos + elementHeight)) {
				this.store.dispatch(new FetchCouponWallet(this.couponCursorString))
			}
		}
	}
}
