// Angular CORE
import {
	Component,
	ViewEncapsulation,
	ViewChild,
	HostListener,
	ElementRef,
	OnDestroy,
	Inject,
	PLATFORM_ID, LOCALE_ID
} from '@angular/core';
import {
	FormBuilder,
	FormGroup,
	Validators,
	FormControl,
	AbstractControl,
} from '@angular/forms';
import { isPlatformServer } from '@angular/common';

// Components
import {
	SignUpClubElevenElevenInterface,
	SignUpClubElevenElevenUIInterface,
	SignUpClubElevenElevenEmitterInterface,
	SignUpClubElevenElevenActionsEnum,
} from '../../components/common/sign-up-club-eleven-eleven/sign-up-club-eleven-eleven.component'
import {
	ConfirmationModalComponent,
	ModalDataInterface
} from '../../../common/components/modals/confirmation-modal/confirmation-modal.component';

// Interfaces
import { CouponItemUIInterface } from '../../../common/models/coupon-ui-interface';

// NG RX core
import { Store, select, ActionsSubject } from '@ngrx/store';
import { Observable } from 'rxjs';

// Reduce, actions
import * as fromReducers from '../../../common/reducers/';
import * as fromUser from '../../reducers';
import * as fromCheckout from '../../../checkout/reducers';
// import { CouponActionEnum } from '../../../common/components/shared/add-coupon/add-coupon.component';
import {
	FetchCouponWallet
} from '../../../common/actions/coupon-wallet';
import { NgbAccordion } from '../../../../../node_modules/@ng-bootstrap/ng-bootstrap';
import { UserProfileInterface } from '../../models/user-personal-details';
import { PPFormBuilderService } from '../../../common/services/form-builder.service';
import { BamboraLoaderService, BamboraValidationInterface } from '../../../../utils/payment-methods/bambora.service';

import {
	Club11BalanceInterface,
	Club1111AddFundsSettingsUIInterface,
	Club1111AutoReloadSettingsUIInterface
} from '../../../user/models/club11';
import { MapFormToServerRegistrationRequest } from '../../actions/sign-up-actions';
import {
	Club1111ActionTypes,
	FetchClub11CardBalance,
	TransferCardBalance,
	AddClub1111FundsRequest,
	FetchClub11CardBalanceSuccess,
	RemoveAutoReloadClub1111,
	ClearAutoReloadMessage
} from '../../actions/club1111-actions';
import { filter } from 'rxjs/operators';
import { ServerTransferBalanceRequest } from '../../models/server-models/server-club11';
import { UISavedCardsInterface } from '../../models/user-saved-cards';
import { ServerPaymentCardTypeEnum } from '../../models/server-models/server-saved-cards-interfaces';
import { UserCreditCardsActions, UserCreditCardsEmitterInterface } from '../../../common/models/user-payment-methods';
import { AsyncFormValidationService } from '../../../../utils/async-form-validation';

@Component({
	selector: 'app-club-eleven-loyalty',
	templateUrl: './club-eleven-loyalty.component.html',
	styleUrls: ['./club-eleven-loyalty.component.scss'],
	providers: [ConfirmationModalComponent, PPFormBuilderService, AsyncFormValidationService],
	encapsulation: ViewEncapsulation.None
})

export class ClubElevenLoyaltyComponent implements OnDestroy {
	@ViewChild('acc', { static: true }) ngbAccordion: NgbAccordion;

	@ViewChild('clubElevenEditVerticalModal', { static: true }) clubElevenEditVerticalModal;
	@ViewChild('formModal', { static: true }) addFundsConfirmationModal;
	@ViewChild('couponCursor', { static: false }) couponCursor: ElementRef;
	@ViewChild('maxReachedModal', { static: true }) maxReachedModal: ConfirmationModalComponent;
	@ViewChild('transferModal', { static: true }) transferModal: ConfirmationModalComponent;
	@ViewChild('autoReloadCardFailure', { static: true }) autoReloadCardFailure: ConfirmationModalComponent;

	accountBalance$: Observable<Club11BalanceInterface>;

	confirmationData: ModalDataInterface;
	autoReloadCardErrorRef;
	autoReloadCardFailedMessage$: Observable<string>;
	// clubElevenElevenData: ClubElevenElevenInterface;
	clubElevenElevenForm: FormGroup;

	isAccountError: false;
	modalResult: boolean;

	addFundsForm: FormGroup;
	autoReloadFundsForm: FormGroup;
	redeemForm: FormGroup;
	emailForm: FormGroup;

	bamboraValidation: BamboraValidationInterface;
	bamboraTokenSubscriptionRef;

	addFundsSettings$: Observable<Club1111AddFundsSettingsUIInterface>;
	defaultSettings: Club1111AddFundsSettingsUIInterface;
	autoReloadSettings: Club1111AutoReloadSettingsUIInterface;
	addFundsSettingsSubscriptionRef;

	transferForm: FormGroup;
	transferFormStep = 1;

	signUpClubElevenElevenData: SignUpClubElevenElevenInterface;

	submittedForm: string;

	couponsArray$: Observable<CouponItemUIInterface[]>
	couponValidationMsg$: Observable<string>
	isCouponValid$: Observable<boolean>
	couponWalletCursor$: Observable<string>
	couponCursorString: string;
	couponCursorSubscriptionRef;

	couponErrorSubscriptionRef;
	isCouponInCart: boolean;
	couponErrorMsg: string;

	userSummary$: Observable<UserProfileInterface>;
	userSummaryRef;
	userDetails: UserProfileInterface;
	signUpClubElevenElevenUI: SignUpClubElevenElevenUIInterface = {
		isHaveCardSelected: false,
		isCardAlreadyRegistered: false,
		isEditCard: true,
		isAddressRequired: false,
	}
	isUserLoggedIn = false;
	isAddFundsLoading = false;
	isAddFundsSuccess;
	isAutoReload = false;

	isTransferCardLoading$: Observable<boolean>;
	transferCardBalance$: Observable<number>;
	isTransferComplete$: Observable<boolean>
	transferSubscriptionRef;

	actionsSubscriptionRef;

	redeemedAmountInCart$: Observable<number>

	savedCards: UISavedCardsInterface[];
	savedCardsSubscriptionRef;
	autoReloadSettingsSubscriptionRef;
	autoReloadAddCard: boolean;
	isMaxReached: boolean;
	isTransferCardError;

	private isRenderedOnServer: boolean;

	constructor(
		private fb: FormBuilder,
		private confirmModal: ConfirmationModalComponent,
		private store: Store<fromReducers.CommonState>,
		private userStore: Store<fromUser.UserState>,
		private formBuilderService: PPFormBuilderService,
		private actions: ActionsSubject,
		private bamboraService: BamboraLoaderService,
		private formValidationService: AsyncFormValidationService,
		@Inject(PLATFORM_ID) platformId,
		@Inject(LOCALE_ID) private locale: string
	) {
		this.isRenderedOnServer = isPlatformServer(platformId);

		/**
		 * Set up the Forms
		*/
		this.bamboraValidation = this.bamboraService.getFormValidation();

		this.addFundsForm = fb.group({
			'amount': new FormControl(null, Validators.compose([Validators.required])),
			'name': new FormControl(null, Validators.compose([Validators.required])),
		});
		this.emailForm = fb.group({
			'email': new FormControl(null, Validators.compose([Validators.required, Validators.email])),
			'confirmEmail': new FormControl(null, Validators.compose([Validators.required, Validators.email]))
		})
		this.redeemForm = fb.group({
			'redeemAmount': ['', Validators.compose([Validators.required])]
		});
		this.transferForm = fb.group({
			'cardNumber': ['', Validators.compose([
				Validators.required,
				Validators.pattern('^[0-9]*$')
			])],
			'pin': ['', Validators.compose([
				Validators.required,
				Validators.pattern('^[0-9]*$')
			])],
			'transferAmount': ['', Validators.compose([Validators.required])],
		})

		this.autoReloadFundsForm = fb.group({
			'amount': new FormControl(null, Validators.compose([Validators.required])),
			'name': new FormControl(null, Validators.compose([Validators.required])),
			'frequency': new FormControl(null),
			'type': new FormControl(null),
			'savedToken': new FormControl(null),
			'thresholdAmount': new FormControl('0', Validators.compose([this.formValidationService.positiveNumberOnly.bind(this)]))
		});

		// Get the coupon wallet from the store
		this.couponsArray$ = this.store.pipe(select(fromReducers.getCouponWallet))
		this.couponValidationMsg$ = this.store.pipe(select(fromReducers.getCouponValidationMsg));
		this.isCouponValid$ = this.store.pipe(select(fromReducers.getIsCouponValid));
		this.couponWalletCursor$ = this.store.pipe(select(fromReducers.getCouponWalletCursor));
		this.couponCursorSubscriptionRef = this.couponWalletCursor$.subscribe(cursor => {
			this.couponCursorString = cursor;
		})
		this.userSummary$ = this.userStore.pipe(select(fromUser.getLoggedInUser));
		this.userSummaryRef = this.userSummary$.subscribe(user => {
			if (user) {
				this.isUserLoggedIn = true
				this.userDetails = user;
				const birthday = user ? user.birthday : null
				const dateOfBirth = this.formBuilderService.buildUserBirthdayObject(birthday)
				this._buildClub1111Form()
				this.clubElevenElevenForm.patchValue({
					dateOfBirth
				})
			}
		})

		this.accountBalance$ = this.store.pipe(select(fromUser.getAccountBalance));

		this.couponErrorSubscriptionRef = this.store.pipe(select(fromReducers.getCouponWalletToCartError)).subscribe(msg => {
			if (msg) {
				this.isCouponInCart = true;
				this.couponErrorMsg = msg;
			}
		})

		this.signUpClubElevenElevenData = {
			streetAddress: null,
			sendClubPromotions: 'no',
			dateOfBirth: {
				day: null,
				month: null,
				year: null
			}
		} as SignUpClubElevenElevenInterface;

		this.actionsSubscriptionRef = this.actions.pipe(
			filter(action =>
				action.type === Club1111ActionTypes.UpdateClub1111UserInfoSuccess
				|| action.type === Club1111ActionTypes.AddClub1111FundsRequestSuccess
				|| action.type === Club1111ActionTypes.AddClub1111FundsRequestFailure)
		).subscribe(action => {
			const isAddFunds = action.type === Club1111ActionTypes.AddClub1111FundsRequestSuccess
				|| action.type === Club1111ActionTypes.AddClub1111FundsRequestFailure;

			if (isAddFunds) {
				this.isAutoReload = false;
				this.isAddFundsSuccess = action.type === Club1111ActionTypes.AddClub1111FundsRequestSuccess
				this.isAddFundsLoading = false;
				this.confirmModal.onOpen(this.addFundsConfirmationModal, 'child-modal');

				return false
			}
			this.clubElevenEditVerticalModal.closeModal()
		})

		this.isTransferCardLoading$ = this.store.pipe(select(fromUser.getIsTransferCardLoading));
		this.transferCardBalance$ = this.store.pipe(select(fromUser.getTransferCardBalance));
		this.isTransferComplete$ = this.store.pipe(select(fromUser.getIsTransferSuccessFul));

		// this.transferCardBalance$.subscribe(data => {
		// 	console.log(data)
		// })
		this.isTransferCardError = this.store.pipe(select(fromUser.getTransferCardError)).subscribe(error => {
			if (error) {
				this._mapErrorsToForm(error);
			}
		})

		this.transferSubscriptionRef = this.isTransferComplete$.subscribe(complete => {
			if (complete) {
				// this.confirmModal.onCancel()
			}
		})

		this.redeemedAmountInCart$ = this.store.pipe(select(fromCheckout.getLoyaltyRedeemedInCart))
		this.addFundsSettings$ = this.store.pipe(select(fromUser.getAddFundsSettings))
		this.addFundsSettingsSubscriptionRef = this.addFundsSettings$.subscribe(settings => {
			this.defaultSettings = settings;
		})

		this.savedCardsSubscriptionRef = this.store.pipe(select(fromUser.getSavedCards)).subscribe(cards => {
			if (cards) {
				// we don't want meal cards
				this.savedCards = cards.filter(card => card.cardType !== ServerPaymentCardTypeEnum.MealCard)
			}
		})

		this.autoReloadSettingsSubscriptionRef = this.store.pipe(select(fromUser.getAutoReloadSettings)).subscribe(settings => {
			this.autoReloadSettings = settings;
			this.emailForm.reset()
			this._setDefaultFundsSettings()
			if (settings && (this.ngbAccordion && this.ngbAccordion.activeIds.indexOf('auto-reload') > -1)) {
				this.isAutoReload = true;
				this.isAddFundsLoading = false;
				this.isAddFundsSuccess = true;
				this.confirmModal.onOpen(this.addFundsConfirmationModal, 'child-modal');
			}
		})
		this.autoReloadCardErrorRef = this.store.pipe(select(fromUser.getAutoReloadCardFailure))
			.subscribe(isError => {
				if (isError) {
					this.isAddFundsLoading = false;
					this.confirmModal.onOpen(this.autoReloadCardFailure)
				}
			});
		this.autoReloadCardFailedMessage$ = this.store.pipe(select(fromUser.getAutoReloadCardFailure));

	}
	/**
	 * Destroy
	 */
	ngOnDestroy() {
		this.couponErrorSubscriptionRef.unsubscribe();
		this.couponCursorSubscriptionRef.unsubscribe();
		this.actionsSubscriptionRef.unsubscribe();
		this.addFundsSettingsSubscriptionRef.unsubscribe();
		this.transferSubscriptionRef.unsubscribe();
		this.userSummaryRef.unsubscribe()
		this.savedCardsSubscriptionRef.unsubscribe();
		this.autoReloadSettingsSubscriptionRef.unsubscribe();
		if (this.bamboraTokenSubscriptionRef) {
			this.bamboraTokenSubscriptionRef.unsubscribe()
		}
		this.autoReloadCardErrorRef.unsubscribe();
		this.bamboraService.destroy()
	}
	/**
	 * Close Coupon In Cart Error
	 */
	onRetryClickHandler() {
		this.isCouponInCart = false;
		this.couponErrorMsg = null;
	}

	/**
	 * Set Add Funds Defaults
	 */
	private _setDefaultFundsSettings(isAutoTab?: boolean) {
		if (this.autoReloadSettings && this.defaultSettings) {
			// console.log(this.autoReloadSettings, isAutoTab)
			this.addFundsForm.get('amount').setValue(this.defaultSettings.amount[0].value)

			this.autoReloadFundsForm.patchValue({
				'amount': this.autoReloadSettings.amount ? this.autoReloadSettings.amount : this.defaultSettings.amount[0].value,
				'frequency': this.autoReloadSettings.frequency ? this.autoReloadSettings.frequency : this.defaultSettings.frequency[0],
				'type': this.autoReloadSettings.type ? this.autoReloadSettings.type : this.defaultSettings.type[0],
				'savedToken': this.autoReloadSettings.token,
				'thresholdAmount': this.autoReloadSettings.thresholdAmount
			})

			this.emailForm.patchValue({
				'email': isAutoTab ? this.autoReloadSettings.email : null
			})
		}
	}
	/**
	* Build the Club Eleven Section of the form
	*/
	private _buildClub1111Form() {
		const clubData = this.userDetails.clubElevenElevenData ? this.userDetails.clubElevenElevenData : {
			streetAddress: null,
			apartmentNumber: null,
			sendClubPromotions: null,
			cardNumber: null,
			cardPin: null
		};

		this.clubElevenElevenForm = new FormGroup({
			'streetAddress': new FormControl(clubData.streetAddress || '', Validators.compose(
				[Validators.required]
			)),
			'addressString': new FormControl(''),
			'apartmentNumber': new FormControl(clubData.apartmentNumber || ''),
			'dateOfBirth': this.fb.group({
				'day': new FormControl(null),
				'month': new FormControl(null),
				'year': new FormControl(null)
			}),
			'language': new FormControl(this.userDetails.optInLanguage || 'English'),
			'sendClubPromotions': new FormControl(clubData.sendClubPromotions || 'yes'),
			'cardNumber': new FormControl(clubData.cardNumber || null),
			'cardPin': new FormControl(clubData.cardPin || null
			),
			'token': new FormControl(null)
		});
	}

	/**
	 * Sign Up Details Event Handler
	 */
	handleSignUpClubElevenElevenEventEmitter(event: SignUpClubElevenElevenEmitterInterface) {
		switch (event.action) {
			case SignUpClubElevenElevenActionsEnum.onFormSubmit: {
				const formSubmission = event.formData;
				const updateRequest = {
					dateOfBirth: formSubmission.dateOfBirth,
					language: formSubmission.language,
					clubElevenElevenData: {
						streetAddress: formSubmission.streetAddress,
						apartmentNumber: formSubmission.apartmentNumber,
						sendClubPromotions: formSubmission.sendClubPromotions,
					}
				}
				const isUpdate = true;
				this.store.dispatch(new MapFormToServerRegistrationRequest(updateRequest, isUpdate, this.isUserLoggedIn));

				break;
			}
			default: {
				console.warn('CRITICAL | Not defined club 1111 action', event);
				break;
			}
		}
	}

	/**
	 * Checks if forms are valid
	 */
	isAddFundsValid() {
		const isAutoTab = this.ngbAccordion ? this.ngbAccordion.activeIds.indexOf('auto-reload') > -1 : false;
		const isPaymentFormValid = isAutoTab ? this.autoReloadFundsForm.valid : this.addFundsForm.valid;
		const isSavedCardSelected = isAutoTab ? this.autoReloadFundsForm.get('savedToken').value : false;
		const frequencySelected = isAutoTab ? this.autoReloadFundsForm.get('frequency').value : false;

		const isEmailValid = this.emailForm.valid;
		const isEmailMatched = this.emailForm.get('email').value === this.emailForm.get('confirmEmail').value;

		const isAmountValid = isAutoTab && frequencySelected === this.defaultSettings.frequency[this.defaultSettings.frequency.length - 1] ?
			this.autoReloadFundsForm.get('thresholdAmount').value <= this.autoReloadFundsForm.get('amount').value : true;

		const ids = Object.keys(this.bamboraValidation)
		const bamboraValid = ids.filter(id => !this.bamboraValidation[id].complete).length < 1

		return (bamboraValid || isSavedCardSelected) && isPaymentFormValid && (isEmailValid && isEmailMatched) && isAmountValid
	}
	/**
	 * Handles the submission from the add funds form
	 */
	handleAddFundsFormSubmission(isAutoReload) {
		// event.preventDefault();
		const formToUse = isAutoReload ? this.autoReloadFundsForm : this.addFundsForm;

		const isValid = this.isAddFundsValid();

		if (!isValid) {
			const controls = formToUse.controls;
			const emailControls = this.emailForm.controls;
			const ids = Object.keys(this.bamboraValidation)
			ids.forEach(id => {
				if (!this.bamboraValidation[id].complete) {
					this.bamboraValidation[id].error = 'Missing';
				}
			});
			Object.keys(controls).forEach(controlName => controls[controlName].markAsTouched());
			Object.keys(emailControls).forEach(controlName => emailControls[controlName].markAsTouched());
			return false;
		}

		const nameOnCard = formToUse.get('name').value;
		const amount = formToUse.get('amount').value;
		const savedCard = isAutoReload ? formToUse.get('savedToken').value : null;
		const email = this.emailForm.get('email').value
		const addFundsRequest = {
			name: nameOnCard,
			email: email,
			amount: Number(amount)
		} as Club1111AutoReloadSettingsUIInterface

		if (isAutoReload) {
			addFundsRequest.frequency = formToUse.get('frequency').value;
			addFundsRequest.type = formToUse.get('type').value;
			addFundsRequest.enabled = true;
			// TODO - we don't have UI for Threshold Amount yet
			if (formToUse.get('frequency').value === 'Threshold reached') {
				addFundsRequest.thresholdAmount = formToUse.get('thresholdAmount').value
			}
		}

		if (savedCard) {
			addFundsRequest.token = savedCard;

			this.store.dispatch(new AddClub1111FundsRequest(addFundsRequest, isAutoReload))
			return false
		}
		this._getBamboraToken(addFundsRequest, isAutoReload)
	}

	/**
	 * Remove Auto Reload
	 */
	removeAutoReload() {
		this.store.dispatch(new RemoveAutoReloadClub1111())
	}
	/**
	 * opens the transfer funds modal
	 */
	handleTransferBalanceClick(content) {

		this.store.dispatch(new FetchClub11CardBalanceSuccess(null))

		this.transferFormStep = 1;
		this.transferForm.reset();
		// event.preventDefault();
		this.confirmModal.onOpen(content, 'child-modal');
	}
	/**
	 * Transfer Form has two steps
	*/
	continueTransfer() {
		this.transferFormStep = 2;
		const cardNumber = this.transferForm.get('cardNumber').value;
		const cardPin = this.transferForm.get('pin').value

		this.store.dispatch(new FetchClub11CardBalance(cardNumber, Number(cardPin)))
	}

	/**
	 * Handle Transfer
	 */
	submitTransfer() {
		const transferAmount = this.transferForm.get('transferAmount').value;
		const transferRequest = {
			amount: Number(transferAmount),
		} as ServerTransferBalanceRequest

		this.store.dispatch(new TransferCardBalance(transferRequest))

	}

	/**
	 *  Listen for window scroll and when it hits the bottom. This will triggler pagination
	 */
	@HostListener('window:scroll', ['$event'])
	checkifElementInView() {
		if (this.isRenderedOnServer) {
			return false;
		}

		if (this.couponCursor) {
			const scrollPos = window.scrollY;

			const windowHeight = 'innerHeight' in window ? window.innerHeight : document.documentElement.offsetHeight;

			const elementHeight = this.couponCursor.nativeElement.offsetHeight;
			const elementPos = this.couponCursor.nativeElement.offsetTop || 0;

			if (scrollPos >= elementPos || (scrollPos + windowHeight) >= (elementPos + elementHeight)) {
				this.store.dispatch(new FetchCouponWallet(this.couponCursorString))
			}
		}
	}

	/**
	 * Load bambora when payment form is open --- consider destroying it when removed
	 */
	handleOpenPaymentForm(event) {
		if (event) {
			this.bamboraService.initCustomCheckout();
		}
	}

	/**
	 * Collapse All Panels
	 */
	collapseAll() {
		const activeIds = this.ngbAccordion.activeIds;
		for (const id of activeIds) {
			this.ngbAccordion.toggle(id)
		}
	}
	/**
	 * Listen To Accordion Toggle
	 */
	handleAccordionToggle(event) {
		const isAutoPanelOpening = event.panelId === 'auto-reload' && event.nextState
		this.addFundsForm.reset()
		this.emailForm.reset()
		this._setDefaultFundsSettings(isAutoPanelOpening)
	}

	/**
	 * Handle when user selects card
	 */
	handleUserPaymentMethodsEventEmitter(event: UserCreditCardsEmitterInterface) {
		if (event.action === UserCreditCardsActions.onSelect) {
			this.autoReloadAddCard = false;
			this.autoReloadFundsForm.get('name').patchValue('savedCard')
			this.autoReloadFundsForm.get('savedToken').patchValue(event.token)
		}
	}
	/**
	 * Handle when user hits ok on autoreload failure
	 */
	handleAutoReloadFailure() {
		this.userStore.dispatch(new ClearAutoReloadMessage())
	}
	/**
	 * Toggle Auto Reload Add Card Form
	 */
	toggleAutoReloadAddCard(savedCards) {
		if (!savedCards || savedCards.length > 4) {
			this.isMaxReached = true;
			this.confirmModal.onOpen(this.maxReachedModal)
			return false;
		}
		this.autoReloadAddCard = !this.autoReloadAddCard;
		this.autoReloadFundsForm.get('savedToken').reset()
		this.autoReloadFundsForm.get('name').reset()
	}

	/**
	 * Get Bambora Token
	 */
	private _getBamboraToken(addFundsRequest, isAutoReload) {
		this.isAddFundsLoading = true;
		this.bamboraTokenSubscriptionRef = this.bamboraService.onSubmit().subscribe(token => {
			if (token.error) {
				this.isAddFundsLoading = false;
				// TODO - How to handle error
			} else {
				addFundsRequest.token = token.token;

				this.store.dispatch(new AddClub1111FundsRequest(addFundsRequest, isAutoReload))
			}
		})
	}

	/**
	* set errors for form control
	*/
	private _setFormControlErrors(formControl: AbstractControl, key: string, value: string) {
		console.log('!!!!', formControl, key, value)
		// setTimeout used to avoid angulars validation reseting
		if (!this.isRenderedOnServer) {
			setTimeout(() => {
				formControl.setErrors({
					'incorrect': value
				}, { emitEvent: true });
				if (key === 'token') {
					formControl.patchValue(value);
					formControl.setErrors(null);
				}
			}, 100);
		}
	}
	/**
 * Map Errors to UI Form
 */
	private _mapErrorsToForm(errors) {
		for (const key in errors) {
			if (key && (this.transferForm && this.transferForm.get(key)) && errors[key]) {
				const formControl = this.transferForm.get(key);
				this._setFormControlErrors(formControl, key, errors[key]);
			}
		}
	}
}
