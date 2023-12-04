import {
	Component,
	Input,
	Output,
	EventEmitter,
	ViewEncapsulation,
	OnDestroy,
	OnInit,
	OnChanges,
	SimpleChanges,
	ViewChild
} from '@angular/core';
import { Store } from '@ngrx/store';

import {
	FormGroup, Validators, FormBuilder, FormControl
} from '@angular/forms';
import { SignInInterface } from '../../../../user/components/sign-in/sign-in-form/sign-in-form.component';
import {
	UserCreditCardsEmitterInterface, UserCreditCardsActions
} from '../../../../common/models/user-payment-methods';
import { BamboraValidationInterface } from '../../../../../utils/payment-methods/bambora.service';
import { UISavedCardsInterface } from '../../../../user/models/user-saved-cards';
import { UniversityListInterface } from '../../../models/university-list';
import { distinctUntilChanged } from 'rxjs/operators';
import { ServerPaymentCardTypeEnum } from '../../../../user/models/server-models/server-saved-cards-interfaces';
import {
	AsyncFormValidationService
} from '../../../../../utils/async-form-validation';
import { SeverStorePaymentInterface } from 'app/common/models/server-store';
import { StoreService} from '../../../../common/services/store.service';
import { ApplyTips } from './../../../../checkout/actions/tips';
import { ApplicationLocalStorageClient } from '../../../../../utils/app-localstorage-client';
import * as fromCommon from '../../../../common/reducers';

/**
 * Defines actions that can be taken on submitting a payment card form
 */
enum CheckoutPaymentMethodFormActionEnum {
	onSavePaymentCard,
	onStudentCardSelected,
	onCreditCardSelected,
	onPayAtDoorSelected,
	onVisaCheckoutSelected,
	onMasterPassSelected
}

/**
 * Defines the four different options that can be taken on the pay at door radio section
 */
enum PayAtDoorOptions {
	cashOption,
	creditCardOption,
	debitCardOption,
	clubElevenElevenOrPizzaCardOption
}

/*
/** Interface that defines actions that can be made on payment card form
 */
interface CheckoutPaymentMethodFormEmitterInterface {
	action: CheckoutPaymentMethodFormActionEnum,
	token?: string
}

/*
/** Interface that defines payments address on form data
 */
interface CheckoutPaymentMethodFormInterface {
	isCreditCardSelected?: boolean,
	isStudentCardSelected?: boolean,
	isPayAtDoorSelected?: boolean,
	isVisaCheckoutSelected?: boolean,
	isMasterPassSelected?: boolean,
	isOrderPaidInFull?: boolean
}

/**
 * Defines actions that can be taken on submitting a payment card form
 */
enum GiftCardFormDataActionEnum {
	onSubmitGiftCard
}

/*
/** Interface that defines actions that can be made on gift card form
 */
interface GiftCardFormDataEmitterInterface {
	action: GiftCardFormDataActionEnum,
	giftCardId
}


/**
* Item configuration page component
*/
@Component({
	selector: 'app-checkout-payment-method-form',
	templateUrl: './checkout-payment-method-form.component.html',
	styleUrls: ['./checkout-payment-method-form.component.scss'],
	encapsulation: ViewEncapsulation.None
})

/**
* Subscribe on store events and dispatch users event
*/
class CheckoutPaymentMethodFormComponent implements OnDestroy, OnInit, OnChanges {
	paymentType: FormGroup
	checkoutUI: CheckoutPaymentMethodFormInterface
	checkoutForm: FormGroup;
	@Input() isDelivery: boolean;
	@Input() isContactLessValue: boolean;
	@Input() isFormCollapsed: boolean;

	@Input() userState: SignInInterface;

	@Input() giftCardFormData: FormGroup;
	@Output() giftCardFormDataEventEmitter: EventEmitter<GiftCardFormDataEmitterInterface>
		= new EventEmitter<GiftCardFormDataEmitterInterface>();

	@Input() checkoutPaymentUI: CheckoutPaymentMethodFormInterface;
	@Input() set checkoutPaymentMethodFormData(form: FormGroup) {
		this.checkoutForm = form;
		// TODO - determine why this is not being fired on every change
		this.updatePaymentTypeForm(this.checkoutUI)
	}
	@Output() checkoutPaymentMethodFormEventEmitter: EventEmitter<CheckoutPaymentMethodFormEmitterInterface>
		= new EventEmitter<CheckoutPaymentMethodFormEmitterInterface>();

	@Input() userPaymentMethods: UISavedCardsInterface[];
	@Input() selectedPaymentMethod: UISavedCardsInterface;
	@Output() userPaymentMethodsEventEmitter: EventEmitter<UserCreditCardsEmitterInterface> =
		new EventEmitter<UserCreditCardsEmitterInterface>();

	universityList
	@Input() set universities(universities: UniversityListInterface[]) {
		this.universityList = universities;
	}

	@Input() bamboraValidation: BamboraValidationInterface;

	@Input() allPaymentMethods: UISavedCardsInterface[]

	@Input() paymentOptions: SeverStorePaymentInterface
	@Input() isVisaClickToPay = false
	currentContactLess = false;

	isTooltipOpen: boolean;
	isDefaultSelected: boolean;
	isCheckoutOutPage: boolean;
	addressUniversitySubscriptionRef;

	constructor(
		private storeService: StoreService,
		private store: Store<fromCommon.State>,
		private fb: FormBuilder,
		public formValidationService: AsyncFormValidationService,
		private appCookies: ApplicationLocalStorageClient
	) {
		this.isTooltipOpen = false;
		this.paymentType = this.fb.group({
			'paymentOption': new FormControl(null)
		})
		this.checkoutUI = {
		}
		this.isCheckoutOutPage = this.checkoutUI.isPayAtDoorSelected !== undefined;
	}

	/**
	 * On changes
	 */
	ngOnChanges(changes: SimpleChanges) {
		// let paymentMethod = 'payAtDoor';
		// const isConatctLess =  this.storeService.getContactLessFromLocalStorage('isContactLess');
		// if (isConatctLess && isConatctLess !== this.currentContactLess) {
		// 	this.currentContactLess = isConatctLess;
		// 	paymentMethod = 'creditCard';
		// 	this.checkoutPaymentMethodFormEventEmitter.emit({
		// 		action: CheckoutPaymentMethodFormActionEnum.onCreditCardSelected
		// 	} as CheckoutPaymentMethodFormEmitterInterface
		// 	);
		// }
		this.updatePaymentTypeForm(this.checkoutPaymentUI)
		// if (this.checkoutUI.isPayAtDoorSelected || this.checkoutUI.isStudentCardSelected) {
		// 	this.clearTip();
		// }
		if (changes.isFormCollapsed || changes.checkoutPaymentUI) {
			this.checkoutUI = this.checkoutPaymentUI;
		}

	}

	/**
	 * Listen to form changes on init
	 */
	ngOnInit() {
		this.onFormChanges()
	}
	/**
	 * Destroy
	 */
	ngOnDestroy() {
		this.checkoutUI = null;
		if (this.addressUniversitySubscriptionRef) {
			this.addressUniversitySubscriptionRef.unsubscribe();
		}
	}
	/**
	* Proxy to pass grandchild credit card events to parent container
	*/
	handleUserPaymentMethodEventEmitter(event: UserCreditCardsEmitterInterface) {

		this.userPaymentMethodsEventEmitter.emit(event);
	}

	/**
	* Click event for the payment method form which bubbles up to container
	*/
	onStudentCardSelected(event) {
		event.stopPropagation();

		this.checkoutPaymentMethodFormEventEmitter.emit({
			action: CheckoutPaymentMethodFormActionEnum.onStudentCardSelected
		} as CheckoutPaymentMethodFormEmitterInterface
		);

		this.checkoutUI = this.checkoutPaymentUI;
		this.updatePaymentTypeForm(this.checkoutUI)
	}

	/**
	* Click event for the payment method form which bubbles up to container
	*/
	onPayAtDoorSelected(event) {
		event.stopPropagation();

		this.checkoutPaymentMethodFormEventEmitter.emit({
			action: CheckoutPaymentMethodFormActionEnum.onPayAtDoorSelected
		} as CheckoutPaymentMethodFormEmitterInterface
		);
		this.checkoutUI = this.checkoutPaymentUI;
		this.updatePaymentTypeForm(this.checkoutUI)
	}

	/**
	* Click event for the payment method form which bubbles up to container
	*/
	onCreditCardSelected(event) {
		event.stopPropagation();
		this.checkoutPaymentMethodFormEventEmitter.emit({
			action: CheckoutPaymentMethodFormActionEnum.onCreditCardSelected
		} as CheckoutPaymentMethodFormEmitterInterface
		);

		this.checkoutUI = this.checkoutPaymentUI;
		this.updatePaymentTypeForm(this.checkoutUI)

	}

	/**
	* Submit method for gift card form
	*/
	onGiftCardFormSubmit(formValue) {
		console.log('>>>>');
		console.log(formValue);
	}

	/**
	 * Click Fast Checkout
	 */
	onFastCheckout(isVisa: boolean, isNoPayment?: boolean) {
		const isSelected = !isNoPayment ?
			(isVisa && this.checkoutUI.isVisaCheckoutSelected) || (!isVisa && this.checkoutUI.isMasterPassSelected) : false;
		if (isSelected) {
			return false
		}

		let action = isVisa ? UserCreditCardsActions.onSelectVisa : UserCreditCardsActions.onSelectMasterPass;
		action = isNoPayment ? UserCreditCardsActions.onClearDefault : action;
		this.userPaymentMethodsEventEmitter.emit({
			action,
			token: null
		})
	}

	/**
	 * Click Save Payment
	 */
	onSavePayment(event) {
		event.stopPropagation();

		this.userPaymentMethodsEventEmitter.emit({
			action: UserCreditCardsActions.onSaveNewCard,
			token: null
		})
	}

	/**
	 * On Add Btn Click
	 */
	onAddNewCard(isOpen) {
		this.userPaymentMethodsEventEmitter.emit({
			action: UserCreditCardsActions.onAddNewCard,
			token: null,
			isOpen
		})
	}
	/**
	 * Check if form is valid
	 */
	isFormValid(allPaymentMethods: UISavedCardsInterface[]) {
		const ids = Object.keys(this.bamboraValidation);
		const isMaxCards = allPaymentMethods ? allPaymentMethods
			.filter(card => card.cardType !== ServerPaymentCardTypeEnum.MealCard).length < 5 : true

		return ids.filter(id => !this.bamboraValidation[id].complete).length < 1 && this.checkoutForm.valid && isMaxCards;
	}
	/**
	 * Clear Tip
	 */
	clearTip() {
		const tipAmount = 0;
		const tipType = this.appCookies.get('tipType');
		const currenttipAmount =  Number(this.appCookies.get('tipAmount'));
		if (tipType !== null && tipAmount !== currenttipAmount) {
			this.appCookies.set('tipAmount', tipAmount);
			this.appCookies.set('tipType', tipType);
			this.store.dispatch(new ApplyTips(tipAmount, String(tipType), false))
		}
	}
	/**
	 * Selected University
	 */
	getSelectedUniversity() {
		if (!this.universityList || this.universityList.length < 1) {
			return false
		}
		const universityControl = this.checkoutForm.get('studentCardKey')
		return universityControl && universityControl.value ? universityControl.value : this.universityList[0].value
	}
	/**
	 * Subscribe to form changes so that we can dispatch university actions
	 */
	onFormChanges(): void {
		if (this.checkoutForm) {
			const universityControl = this.checkoutForm.get('studentCardKey');
			const cardControl = this.checkoutForm.get('studentCardNumber');

			this.addressUniversitySubscriptionRef = universityControl.valueChanges
				.subscribe(val => {
					const selectedUniversity = this.universityList ? this.universityList.find(university => {
						return val ? university.value === val : false
					}) : null;
					if (selectedUniversity) {
						const minLength = selectedUniversity.mealCard.minLength;
						const maxLength = selectedUniversity.mealCard.maxLength;

						cardControl.setValidators([
							Validators.minLength(minLength),
							Validators.maxLength(maxLength),
							Validators.required,
							Validators.pattern('^[0-9]*$')
						])
						cardControl.updateValueAndValidity()
					}
				})
		}
	}

	/**
	 * Update Payment Form Type -- required to allow container to prevent change
	 */
	updatePaymentTypeForm(ui: CheckoutPaymentMethodFormInterface) {
		this.isCheckoutOutPage = this.checkoutUI.isPayAtDoorSelected !== undefined;

		const isQuickPaymentSelected = this.checkoutPaymentUI.isMasterPassSelected || this.checkoutPaymentUI.isVisaCheckoutSelected;
		this.isDefaultSelected = this.userPaymentMethods ?
			this.userPaymentMethods.filter(card => card.isDefault).length > 0 || isQuickPaymentSelected : isQuickPaymentSelected;
		const isAccount = ui.isPayAtDoorSelected === undefined;
		let paymentMethod = 'payAtDoor';
		paymentMethod = ui.isStudentCardSelected ? 'studentCard' : paymentMethod;
		paymentMethod = ui.isCreditCardSelected  ? 'creditCard' : paymentMethod;
		paymentMethod = ui.isVisaCheckoutSelected && this.isCheckoutOutPage ? 'visa' : paymentMethod;
		this.paymentType.setValue({
			'paymentOption': paymentMethod
		})

	}
}



export {
	CheckoutPaymentMethodFormActionEnum,
	CheckoutPaymentMethodFormEmitterInterface,
	CheckoutPaymentMethodFormInterface,
	CheckoutPaymentMethodFormComponent,
	GiftCardFormDataActionEnum,
	GiftCardFormDataEmitterInterface,
	PayAtDoorOptions
}
