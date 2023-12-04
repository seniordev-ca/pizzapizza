import { TipsActionsTypes } from './../../../../checkout/actions/tips';
import { ApplyTips } from './../../../../checkout/actions/tips';
import * as fromCheckout from '../../../../checkout/reducers';
import { ApplicationLocalStorageClient } from '../../../../../utils/app-localstorage-client';
import { Observable } from 'rxjs';
// Ng Rx
import { Store, select } from '@ngrx/store';

import {
	Component,
	Input,
	OnDestroy,
	OnInit,
	OnChanges
} from '@angular/core';


import {
	FormGroup, Validators, FormBuilder, FormControl, ValidatorFn, AbstractControl
} from '@angular/forms';
import { ServerCartTipsInterface, TipTypeEnum } from 'app/checkout/models/server-cart-response'
import { OrderSummaryInterface } from 'app/checkout/models/order-checkout';

/*
/** Interface that defines Tips on form data
 */
interface CheckoutTipsFormInterface {
	isTipDollar?: boolean,
	isTipPercentage?: boolean,
	isTipManuallyDollar?: boolean,
	amount?: number,
	type?: string,
}

/**
 * Defines actions that can be taken on submitting a tip form
 */
enum CheckoutTipsFormFormActionEnum {
	onDollarSelected,
	onPercentageSelected,
	onDollarManualSelected,
	onPercentageManualSelected
}

/*
/** Interface that defines actions on amount type
 */
interface CheckoutTipsFormEmitterInterface {
	action: CheckoutTipsFormFormActionEnum,
	type?: string,
	amount?: number,
}

@Component({
	selector: 'app-checkout-tips-form',
	templateUrl: './checkout-tips-form.component.html',
	styleUrls: ['./checkout-tips-form.component.scss'],
})
export class CheckoutTipsFormComponent implements OnDestroy, OnInit, OnChanges {
	tipUI: CheckoutTipsFormInterface;
	tipType: string;
	tipAmount: number;
	favoriteSeason: string;
	selecteddollar: string;
	selectedPercentage: string;
	tipBtnDisabled: boolean;
	dollar = 'amount';
	percentage = 'percentage';
	tipForm = null;
	dollarAmt: string;
	percentageAmt: string;
	manualTip: string;
	isChecked: string;
	isTip$: Observable<boolean>;
	tipData$: Observable<ServerCartTipsInterface>;
	tipsSubscriptionsRef;
	isInitialLoad = true;

	@Input() tipFormUI: CheckoutTipsFormInterface;
	@Input() orderSummaryData: OrderSummaryInterface;

	subTotal = 0;

	seasons: string[] = ['Dollar', 'Percentage'];
	dollars: string[] = ['3.00', '4.00', '5.00'];
	dollarValues = [3, 4, 5];
	percentages: string[] = ['0.10', '.15', '0.20'];
	percentageValues = [10, 15, 20];

	constructor(
		private store: Store<fromCheckout.CheckoutState>,
		private appCookies: ApplicationLocalStorageClient,
	) {
		this.tipsSubscriptionsRef = {}
		this.isTip$ = this.store.pipe(select(fromCheckout.isTipsLoading));
		this.tipData$ = this.store.pipe(select(fromCheckout.getTipData))
		this.tipUI = {}
		this.tipAmount = 0;
		this.tipType = 'percentage';
		this.tipUI.isTipDollar = true;
		this.tipForm = new FormGroup({
			'amount': new FormControl(this.tipAmount, [this.tipAmountValidator()]),
			'dollarOption': new FormControl('0'),
			'percentageOption': new FormControl('0'),
			'isOther': new FormControl('false'),
			'isNone': new FormControl('false'),
			'tipType': new FormControl('percentage')
		})

		this.tipsSubscriptionsRef.isTipsref = this.store.pipe(select(fromCheckout.isTipsApplied)).subscribe(isTips => {
			console.log(isTips)
			this.isInitialLoad = !isTips;
		})
		this.tipsSubscriptionsRef.dataRef = this.tipData$.subscribe(data => {
			if (data) {
				this.tipForm.get('amount').patchValue(data.tip_value)
				this.tipType = data.tip_type;
				if (this.tipType === TipTypeEnum.Amount) {
					this.tipUI.amount = data.tip_value;
					this.tipForm.get('percentageOption').patchValue(0)
					if (data.tip_value > 0) {
						this.tipForm.get('isOther').patchValue('true')
					} else {
						this.tipForm.get('isNone').patchValue('false')
					}
					this.tipUI.isTipManuallyDollar = true;
				}
				if (this.tipType === TipTypeEnum.Percentage) {
					this.tipUI.amount = data.tip_value / 100;
					if (data.tip_value > 0) {
						this.tipForm.get('percentageOption').patchValue(this.percentages[this.percentageValues.indexOf(data.tip_value)])
					} else {
						this.tipForm.get('isNone').patchValue('true')
					}
				}
				this.tipUI.isTipDollar = this.tipType === TipTypeEnum.Amount;
				this.tipUI.isTipPercentage = this.tipType === TipTypeEnum.Percentage;
				this.tipForm.get('tipType').patchValue(data.tip_type)
			}
		})
	}

	/**
	 * Listen to changes on init
	 */
	tipAmountValidator(): ValidatorFn {
		// tslint:disable-next-line: no-any
		return (control: AbstractControl): { [key: string]: any } | null => {
			const tipAmount = control.value
			let isValidTipAmount = false
			if (tipAmount > 50) {
				isValidTipAmount = true
			}
			return isValidTipAmount ? { 'isValidTipAmount': { value: isValidTipAmount } } : null
		}
	}
	get amount() { return this.tipForm.get('amount') }
	/**
	 * Listen to changes on init
	 */
	ngOnInit() {
		this.tipBtnDisabled = false;
	}

	/**
	 * Listen to changes on changes
	 */
	ngOnChanges() {
		this.findSubTotal(this.orderSummaryData);
	}
	/**
	 * Listen to changes on destory
	 */
	ngOnDestroy() {
		for (const key in this.tipsSubscriptionsRef) {
			if (this.tipsSubscriptionsRef[key]) {
				this.tipsSubscriptionsRef[key].unsubscribe();
			}
		}
	}

	/**
	 * Find Subtotal
	 */
	findSubTotal(orderSummary: OrderSummaryInterface) {
		if (orderSummary.orderComponent) {
			if (this.isInitialLoad) {
				this.tipForm.get('percentageOption').patchValue('.15');
				this.changeAmount(null, '.15');
			}
			this.subTotal = orderSummary.orderComponent.find(component => component.code === 'subtotal').value
		}
	}

	/**
	 * Listen to changes on amount
	 */
	// tslint:disable-next-line: no-any
	changeAmountType(event: any, selectedValue: string) {
		this.manualTip = '';
		this.tipType = selectedValue;
		this.tipUI.isTipDollar = false;
		this.tipUI.isTipPercentage = false;
		if (this.tipType === 'amount') {
			this.tipUI.isTipDollar = true;
		}

		if (this.tipType === 'percentage') {
			this.tipUI.isTipPercentage = true;
		}
	}


	/**
	 * Listen to changes on manually enter amount
	 */

	changeManuallyAmount(event) {
		this.tipBtnDisabled = false;
		const selectedValue = event.target.value;
		if (this.tipUI.isTipDollar) {
			this.tipUI.amount = parseFloat(selectedValue);
			this.tipUI.type = 'amount';
			this.tipAmount = parseFloat(selectedValue);
			this.tipType = 'amount';
		}
		if (this.tipUI.isTipPercentage) {
			this.tipUI.amount = parseFloat(selectedValue);
			this.tipUI.type = 'percentage';
			this.tipAmount = parseFloat(selectedValue);
			this.tipType = 'percentage';
		}
		if (!isNaN(selectedValue) && (parseFloat(selectedValue) <= 50 && parseFloat(selectedValue) > 0)) {
			this.tipBtnDisabled = true;
			this.tipAmount = selectedValue;
		}
	}
	/**
	 * Listen to changes on amount
	 */
	changeAmount(event, selectedValue) {
		this.manualTip = '';

		if (selectedValue === 'other') {
			this.tipUI.isTipManuallyDollar = true;
			this.tipForm.get('amount').patchValue(0)
			this.tipForm.get('percentageOption').patchValue('0');

			return false;
		}
		this.tipForm.get('isOther').patchValue('false')
		this.tipForm.get('isNone').patchValue('false')

		this.tipUI.isTipManuallyDollar = false;
		this.tipUI.amount = parseFloat(selectedValue) * 100;
		this.tipUI.type = 'percentage';
		this.tipType = 'percentage';
		this.tipAmount = parseFloat(selectedValue) * 100;

		this.tipBtnDisabled = true;

		this.onTipSubmit(null)
	}
	/**
	 * focus in to unchcek radio button
	 */
	unCheckRadio(selectedValue) {
		this.dollarAmt = '';
		this.percentageAmt = '';
	}

	/**
	 * button submit method
	 */
	onTipSubmit(event) {
		if (this.tipUI.isTipManuallyDollar) {
			this.tipType = 'amount';
			this.tipAmount = this.tipForm.get('amount').value
		}
		this.appCookies.set('tipAmount', this.tipAmount);
		this.appCookies.set('tipType', this.tipType);
		this.store.dispatch(new ApplyTips(Number(this.tipAmount), this.tipType, true))
		this.tipsSubscriptionsRef.isLoadingRef = this.store.pipe(select(fromCheckout.isTipsLoading)).subscribe(isTipLoading => {
			this.tipBtnDisabled = false;
		})
	}

	/**
	 * Clear Tip
	 */
	clearTip() {
		this.tipForm.get('isOther').patchValue('false')
		this.tipForm.get('percentageOption').patchValue('0');

		const tipAmount = 0;
		this.store.dispatch(new ApplyTips(tipAmount, 'percentage', true))
		this.tipUI.isTipManuallyDollar = false;
		this.tipForm.get('amount').patchValue(0)
	}
}
