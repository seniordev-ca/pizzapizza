import {
	Component,
	ViewEncapsulation,
	Input,
	OnDestroy,
	ViewChild, Inject, LOCALE_ID
} from '@angular/core';
import {
	FormBuilder,
	FormGroup,
	Validators
} from '@angular/forms';
import {
	ConfirmationModalComponent,
	ModalDataInterface
} from '../../components/modals/confirmation-modal/confirmation-modal.component';

// Interfaces and Enums
import * as fromModelsOrderCheckout from '../../../checkout/models/order-checkout';
// NG RX core
import { Store, select } from '@ngrx/store';

import { UpdateDataLayerClub11111 } from '../../../common/actions/tag-manager';
import { DataLayerEventEnum } from '../../../common/models/datalayer-object'

// Reduce, actions
import * as fromUser from '../../../user/reducers';
import * as fromCheckout from '../../../checkout/reducers';
import { Observable } from 'rxjs';
import { Club11BalanceInterface } from '../../../user/models/club11';
import { FetchGiftCardBalance } from '../../../user/actions/gift-card';
import { RedeemLoyaltyCard } from '../../../checkout/actions/loyalty';


@Component({
	selector: 'app-redeem-modal',
	templateUrl: './redeem-modal.component.html',
	styleUrls: ['./redeem-modal.component.scss'],
	providers: [ConfirmationModalComponent],
	encapsulation: ViewEncapsulation.None
})

export class RedeemModalComponent implements OnDestroy {
	@ViewChild('redeemModal', { static: true }) redeemModal
	@ViewChild('failureSecondGiftCard', { static: true }) failureSecondGiftCard

	@Input() isGiftCard: boolean;
	@Input() editAmount = 0;
	@Input() popupOnly: boolean;

	redeemForm: FormGroup;
	giftCardForm: FormGroup;


	reedeemSubscriptionsRef;
	accountBalance$: Observable<Club11BalanceInterface>

	isGiftCardLoading$: Observable<boolean>
	giftCardBalance$: Observable<number>
	orderSummaryData$: Observable<fromModelsOrderCheckout.OrderSummaryInterface>;

	cartTotal$: Observable<number>;
	giftCardError: boolean;

	defaultBalance: number;

	giftCardBalanceRef;
	accountBalanceRef;
	orderSummaryRef;

	giftCardLoadingRef;
	isSecondGiftCard: boolean;

	isGiftCardOpen = false;

	constructor(
		private fb: FormBuilder,
		private confirmModal: ConfirmationModalComponent,
		private userStore: Store<fromUser.UserState>,
		private checkoutStore: Store<fromCheckout.CheckoutState>,
		@Inject(LOCALE_ID) private locale
	) {
		this.reedeemSubscriptionsRef = {};
		this.redeemForm = this.fb.group({
			'redeemAmount': ['', Validators.compose([Validators.required])]
		});

		this.orderSummaryData$ = this.checkoutStore.pipe(select(fromCheckout.getCartSummary));

		this.giftCardForm = this.fb.group({
			'giftCardNumber': ['', Validators.compose([Validators.required])],
			'giftCardPin': ['']
		})


		this.reedeemSubscriptionsRef.orderSummaryRef = this.orderSummaryData$.subscribe(data => {
			if (data && data.redemptionComponents) {
				this.isSecondGiftCard = data.redemptionComponents
					.find(obj => obj.code === fromModelsOrderCheckout.RedemptionComponentCodeEnum.giftCard) ? true : false;
			}

		})

		this.isGiftCardLoading$ = this.userStore.pipe(select(fromUser.getIsGiftCardLoading))
		this.giftCardBalance$ = this.userStore.pipe(select(fromUser.getGiftCardBalance))
		this.accountBalance$ = this.userStore.pipe(select(fromUser.getAccountBalance));

		this.reedeemSubscriptionsRef.accountBalanceRef = this.accountBalance$.subscribe(balance => {
			if (!this.isGiftCard) {
				this.defaultBalance = balance.available > this.defaultBalance ? this.defaultBalance : balance.available;
				this.redeemForm.get('redeemAmount').patchValue(this.defaultBalance)
			}
		})
		this.reedeemSubscriptionsRef.giftCardBalanceRef = this.giftCardBalance$.subscribe(balance => {
			if (this.isGiftCard) {
				this.defaultBalance = this.defaultBalance && (balance > this.defaultBalance) ? this.defaultBalance : balance;
				this.giftCardError = !(balance > 0);
			}
		})

		this.reedeemSubscriptionsRef.giftCardLoadingRef = this.isGiftCardLoading$.subscribe(isloading => {
			if (!isloading && this.isGiftCard && this.giftCardForm.get('giftCardNumber').value && !this.giftCardError) {
				this.handleRedeemClick()
			}
		})
		this.cartTotal$ = this.checkoutStore.pipe(select(fromCheckout.getCartTotal));
	}

	/**
	 * Unsubscribe
	 */
	ngOnDestroy() {
		for (const key in this.reedeemSubscriptionsRef) {
			if (this.reedeemSubscriptionsRef[key]) {
				this.reedeemSubscriptionsRef[key].unsubscribe()
			}
		}
		// this comment will be removed when stable
		// if (this.accountBalanceRef) {
		// 	this.accountBalanceRef.unsubscribe()
		// 	this.giftCardBalanceRef.unsubscribe();
		// 	this.giftCardLoadingRef.unsubscribe();
		// 	this.orderSummaryRef.unsubscribe();
		// }
	}
	/**
	 * Opens the redeem Modal
	 */
	handleRedeemClick() {
		const redeemAmount = this.editAmount ? this.editAmount : this.defaultBalance;

		this.redeemForm.get('redeemAmount').patchValue(redeemAmount);
		this.confirmModal.onOpen(this.redeemModal, 'child-modal');
		this.userStore.dispatch(new UpdateDataLayerClub11111(DataLayerEventEnum.CLCKTOREEDEM))
	}
	/**
	 * Handles Redeem Modal Request
	 */
	submitRedeem() {
		this.giftCardForm.reset()
		let redeemAmount;
		if (this.locale === 'en-US') {
			redeemAmount = Number(this.redeemForm.get('redeemAmount').value);
		} else {
			// change ',' separator in fr locale
			redeemAmount = Number(this.redeemForm.get('redeemAmount').value.toString().replace(',', '.'));
		}
		this.checkoutStore.dispatch(new RedeemLoyaltyCard(redeemAmount, this.isGiftCard))
	}

	/**
	 * Handle Gift Card Apply
	 */
	onGiftCardFormSubmit(giftCardToken?: string) {
		this.giftCardError = false;

		if (!this.isSecondGiftCard) {
			if (!giftCardToken) {
				const cardNumber = this.giftCardForm.get('giftCardNumber').value;
				const cardPin = this.giftCardForm.get('giftCardPin').value
				this.userStore.dispatch(new FetchGiftCardBalance(cardNumber, Number(cardPin)))
				return false
			}
			this.userStore.dispatch(new FetchGiftCardBalance(null, null, giftCardToken))
		} else {
			console.error('second gift card can not be redeemed');
			this.confirmModal.onOpen(this.failureSecondGiftCard);
			return false
		}

	}

	/**
	 * Validate Redeem Amount
	 */
	isAmountValid(giftCardBalance: number, club11Balance: number, cartTotal: number) {
		if (cartTotal + this.editAmount <= this.defaultBalance && this.redeemForm.get('redeemAmount').pristine) {
			this.defaultBalance = cartTotal + this.editAmount;
			// this.redeemForm.get('redeemAmount').patchValue(redeemAmountForm)
			// this.redeemForm.get('redeemAmount').markAsTouched()
		}
		let currentRedeemAmount = 0;

		const isFormValid = this.redeemForm.valid;
		if (this.locale === 'en-US') {
			currentRedeemAmount = parseFloat(this.redeemForm.get('redeemAmount').value);
		} else {
			// change ',' separator in fr locale
			currentRedeemAmount = parseFloat(this.redeemForm.get('redeemAmount').value.toString().replace(',', '.'))
		}

		const redeemAmount = currentRedeemAmount - this.editAmount;
		const balanceToCheck = this.isGiftCard ? giftCardBalance : club11Balance;
		const isPositive = this.editAmount ? currentRedeemAmount > 0 : redeemAmount > 0;

		return isFormValid && (balanceToCheck >= redeemAmount) && (redeemAmount <= cartTotal) && isPositive;
	}

	/**
	 * Is Redeem Disabled
	 */
	isRedeemDisabled(club11Balance: number, cartTotal: number) {
		return club11Balance > 0 && (cartTotal + this.editAmount) > 0
	}

	/**
	 * Toggle Gift Card Form
	 */
	toggleGiftCard() {
		this.isGiftCardOpen = !this.isGiftCardOpen;
	}
}
