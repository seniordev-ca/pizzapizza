// Angular core
import {
	Component,
	ViewEncapsulation,
	Input,
	ViewChild,
	ElementRef,
	Renderer,
	Renderer2,
	Inject,
	PLATFORM_ID,
	Output,
	EventEmitter,
	OnInit
} from '@angular/core';
// ngrx core
import { Store, select, ActionsSubject } from '@ngrx/store';

// Redux implementation
import {
	AddCoupon,
	ClearCouponValidation,
	CouponActionTypes
} from '../../../common/actions/coupons';

// actions
import { CouponsDataLayer } from '../../../common/actions/tag-manager'
import * as fromCommon from '../../../common/reducers';
import { filter } from '../../../../../node_modules/rxjs/operators';
import { AddCouponToWallet, CouponWalletActionTypes } from '../../actions/coupon-wallet';
import { isPlatformBrowser } from '@angular/common';

const ADDED_STATE_SHOWN_FOR_MSEC = 3000;

/**
 * All states for coupons
 */
enum couponWidgetUiStates {
	addCouponBtn,
	inputField,
	validationError,
	added
}

/**
 * Widget Parent Container Enum
 * Changing enums value would need css selection change.
 */
export enum couponParentContainerEnum {
	Header = 'header',
	MobileNav = 'mobileNav',
	Checkout = 'checkout',
	Wallet = 'wallet',
}
/**
 * This widget is used in:
 * - checkout/component/order-confirmation/order-summary
 * - header/component/mobile-nav
 * - header/container/header
 * - user/components/common/coupons-list
 */
@Component({
	selector: 'app-add-coupon-widget',
	templateUrl: './add-coupon.widget.html',
	styleUrls: ['./add-coupon.widget.scss'],
	encapsulation: ViewEncapsulation.None
})

export class AddCouponWidgetComponent implements OnInit {
	couponParentContainerEnum = couponParentContainerEnum;
	@Input() parentContainer: couponParentContainerEnum;
	isFocused: boolean;
	@ViewChild('addCouponInput', { static: false }) inputCoupon: ElementRef;
	widgetUiStates = couponWidgetUiStates;
	uiState: couponWidgetUiStates;
	couponCode: string;
	validationText: string;
	isLoading: boolean;
	isCouponApplied: boolean;
	addedStateTimeoutRef = null;
	isPlatformBrowser: boolean;

	defaultUIState: couponWidgetUiStates;
	isCouponAccordionOpen = false;

	@Output() applyCouponEmitter: EventEmitter<string> = new EventEmitter();
	constructor(
		private store: Store<fromCommon.State>,
		private actions: ActionsSubject,
		private renderer: Renderer,
		private renderer2: Renderer2,
		private hostElement: ElementRef,
		@Inject(PLATFORM_ID) private platformId: Object
	) {
		this.isPlatformBrowser = isPlatformBrowser(this.platformId);

		this.couponCode = '';

		this.isLoading = false;
		this.isCouponApplied = false;
		this.validationText = null;
	}


	/**
	 * On Init
	 */
	ngOnInit() {
		// By default we show button unless we are on the checkout page
		this.defaultUIState = this.parentContainer === couponParentContainerEnum.Checkout ?
			couponWidgetUiStates.inputField : couponWidgetUiStates.addCouponBtn;

		this.uiState = this.defaultUIState;
	}

	/**
	 * Due to UX we need to show button for few seconds
	 */
	_resetToInputStateAfterDelay() {
		if (this.isPlatformBrowser) {
			this.addedStateTimeoutRef = setTimeout(() => {
				this.uiState = this.defaultUIState;
			}, ADDED_STATE_SHOWN_FOR_MSEC);
		}
	}

	/**
	 * Remote call and handle result
	 */
	_applyCouponAndHandleResult(couponCode) {
		this.isLoading = true;
		if (this.parentContainer === couponParentContainerEnum.Wallet) {
			this.store.dispatch(new AddCouponToWallet(couponCode));
		} else {
			this.store.dispatch(new AddCoupon(couponCode));
		}
		// This action would result to success or failure;

		const addCouponRef = this.actions.pipe(
			filter(action =>
				action.type === CouponActionTypes.AddCouponSuccess ||
				action.type === CouponActionTypes.AddCouponFailed ||
				action.type === CouponActionTypes.CouponInvalid ||
				action.type === CouponWalletActionTypes.AddCouponToWalletSuccess ||
				action.type === CouponWalletActionTypes.AddCouponToWalletFailure ||
				action.type === CouponWalletActionTypes.CouponWalletInvalid
			)
		).subscribe((action) => {
			this.isLoading = false;
			// Un subscribe from store listening
			addCouponRef.unsubscribe();

			switch (action.type) {
				// Success
				case CouponActionTypes.AddCouponSuccess:
				case CouponWalletActionTypes.AddCouponToWalletSuccess: {
					this.isCouponApplied = true;
					this.applyCouponEmitter.emit('coupon');
					this.couponCode = '';
					this.uiState = couponWidgetUiStates.added;
					this._resetToInputStateAfterDelay();
					break;
				}

				// Server validation
				case CouponActionTypes.CouponInvalid:
				case CouponWalletActionTypes.CouponWalletInvalid: {
					let errorMessage = '';
					try {
						errorMessage = action['error']['errors']['coupon_code'] as string;
					} catch (exception) {
						console.error('CRITICAL | Missing coupon error message');
					}
					this.uiState = couponWidgetUiStates.validationError;
					this.validationText = errorMessage;
					break;
				}

				// Http call failure TODO message for http failure
				case CouponActionTypes.AddCouponFailed:
				case CouponWalletActionTypes.AddCouponToWalletFailure: {
					const serverErrorMessage = action['errorMessage'] as string;
					this.uiState = couponWidgetUiStates.validationError;
					this.validationText = serverErrorMessage;
					break;
				}
			}

		});

	}

	/**
	 * Handle add coupon button
	 */
	onCouponAddClick() {
		this.validationText = null;
		// Clear time to not overwrite user action
		if (this.addedStateTimeoutRef) {
			clearTimeout(this.addedStateTimeoutRef);
		}

		console.log(this.uiState)
		switch (this.uiState) {
			case couponWidgetUiStates.validationError: {
				this.uiState = couponWidgetUiStates.inputField;
				break;
			}

			case couponWidgetUiStates.added: {
				this.uiState = couponWidgetUiStates.inputField;
				break;
			}

			case couponWidgetUiStates.inputField: {
				if (this.couponCode.length >= 1) {
					this._applyCouponAndHandleResult(this.couponCode);
				}
				break;
			}

			case couponWidgetUiStates.addCouponBtn: {
				this.uiState = couponWidgetUiStates.inputField;
				setTimeout(() => {
					this.inputCoupon.nativeElement.focus();
				}, 0);
				if (this.parentContainer === couponParentContainerEnum.Header) {
					this.store.dispatch(new CouponsDataLayer('Header'))
				} else if (this.parentContainer === couponParentContainerEnum.Checkout) {
					this.store.dispatch(new CouponsDataLayer('Checkout'))
				} else if (this.parentContainer === couponParentContainerEnum.Wallet) {
					this.store.dispatch(new CouponsDataLayer('Club 11/11'))
				}
				break;
			}
		}
	}

	/**
	 * Reset UI state
	 */
	resetUiState() {
		this.couponCode = '';
		this.uiState = this.defaultUIState;
	}

	/**
	 * Toggle Coupon form
	 */
	toggleCoupon() {
		this.isCouponAccordionOpen = !this.isCouponAccordionOpen;
		this.resetUiState();
	}

}
