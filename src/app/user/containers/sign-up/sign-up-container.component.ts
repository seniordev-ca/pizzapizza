import {
	Component,
	ViewEncapsulation,
	OnDestroy,
	Inject,
	PLATFORM_ID,
	ViewChild,
	OnInit, LOCALE_ID,
} from '@angular/core';
import { Router } from '@angular/router';
import {
	FormBuilder,
	FormGroup,
	Validators,
	FormControl,
	AbstractControl
} from '@angular/forms';
import { filter, switchMap, map } from 'rxjs/operators';

/** Interfaces */
import { SubHeaderNavigationInterface } from '../../../common/components/shared/sub-header-navigation/sub-header-navigation.component';
import * as SignUpInterfaces from '../../components/sign-up/sign-up-form/sign-up-form.component';
import {
	ServerLoginErrorResponse,
	ServerRegistrationStatusEnum
} from '../../models/server-models/server-user-registration-input';
import { UserProfileInterface } from '../../models/user-personal-details';
import {
	SignUpClubElevenElevenActionsEnum,
	SignUpClubElevenElevenEmitterInterface,
	SignUpClubElevenElevenUIInterface
} from '../../components/common/sign-up-club-eleven-eleven/sign-up-club-eleven-eleven.component';
import {
	SignUpSuccessInterface,
	SignUpSuccessActionsEnum,
	SignUpSuccessEmitterInterface
} from '../../components/sign-up/sign-up-success/sign-up-success.component';

/**
 * ngrx
 */
import { Store, select, ActionsSubject } from '@ngrx/store';
import { Observable, timer } from 'rxjs';
import * as fromReducers from '../../reducers';
import * as fromCommon from '../../../common/reducers';
import {
	MapFormToServerRegistrationRequest,
	SignUpActionTypes
} from '../../actions/sign-up-actions';
import { RegistrationDataLayer } from '../../../common/actions/tag-manager';
import { DataLayerRegistrationEventEnum } from '../../../common/models/datalayer-object';
/** SERVICES */
import { AsyncFormValidationService } from '../../../../utils/async-form-validation';
import { PPFormBuilderService } from '../../../common/services/form-builder.service';
import { Club1111ActionTypes } from '../../actions/club1111-actions';
import { isPlatformBrowser } from '@angular/common';
import { ConfirmationModalComponent } from 'app/common/components/modals/confirmation-modal/confirmation-modal.component';
import { DropdDownOptionInterface } from 'app/common/components/shared/styled-dropdown/styled-dropdown.component';

/**
 * Steps States
 */
enum SignUpContainerStateEnum {
	isSignUpFormState,
	isSignUpClubElevenEleven,
	isSuccessState,
	isRegistrationLoading
}

interface SignUpContainerInterface {
	SignUpState: SignUpContainerStateEnum;
}
@Component({
	selector: 'app-sign-up',
	templateUrl: './sign-up-container.component.html',
	styleUrls: ['./sign-up-container.component.scss'],
	encapsulation: ViewEncapsulation.None,
	providers: [PPFormBuilderService]
})

class SignUpContainerComponent implements OnDestroy, OnInit {
	@ViewChild('clubErrorPopup', { static: true }) clubErrorPopup: ConfirmationModalComponent
	@ViewChild('clubFailedModal', { static: true }) clubFailedModal: ConfirmationModalComponent
	SignUpContainerStateEnum = SignUpContainerStateEnum;

	subHeaderNavContent: SubHeaderNavigationInterface = {
		textColor: 'white',
		iconColor: '#EE5A00'
	};

	signUpDetailsData: SignUpInterfaces.SignUpFormInterface = {
		firstName: null,
		lastName: null,
		emailAddress: null,
		password: null,
		phoneNumber: null,
		userImage: {
			userImageData: null,
			userImageState: SignUpInterfaces.UserImageStateEnum.isUserImageNotExists
		},
		dateOfBirth: {
			day: null,
			month: null,
			year: null
		},
		clubElevenElevenData: {
			streetAddress: null,
			apartmentNumber: null,
			sendClubPromotions: null,
		}
	};

	signUpClubElevenElevenUI: SignUpClubElevenElevenUIInterface = {
		isHaveCardSelected: false,
		isCardAlreadyRegistered: false,
		isEditCard: false,
		isAddressRequired: false,
	};
	signUpContainerData: SignUpContainerInterface = {
		SignUpState: SignUpContainerStateEnum.isSignUpFormState
	};

	signUpSuccessData: SignUpSuccessInterface = {
		message: this.locale === 'en-US' ? 'Welcome to Pizza Pizza.' +
			'Now please, take advantage of all our special offers!' :
			'Bienvenue chez Pizza Pizza.' +
			'Profitez maintenant de toutes nos offres spéciales!'
	};

	signUpError$: Observable<ServerLoginErrorResponse>;
	userSummary$: Observable<UserProfileInterface>;
	isLogginLoading$: Observable<boolean>;
	isUserLoggedIn: boolean;
	isUserClub1111Member: boolean;
	isPasswordDisplayed: boolean;
	isClub1111ErrorPopup: boolean;
	isClub1111Failed: boolean;

	signUpFormStepOne: FormGroup;
	signUpFormStepTwo: FormGroup;

	registerNewUserRef;
	signUpStateRef;
	dispatchSubscribtionRef;
	userSummaryRef;
	registrationFailureRef;
	isPlatformBrowser: boolean;

	validDays: DropdDownOptionInterface[];
	validDaysSubscriptionRef;

	deeplinkCouponSubscriptionRef;
	deepLinkCoupon: string;

	constructor(
		private confirmModal: ConfirmationModalComponent,
		private router: Router,
		private store: Store<fromReducers.UserState>,
		private fb: FormBuilder,
		private formValidationService: AsyncFormValidationService,
		private formBuilderService: PPFormBuilderService,
		private dispatcher: ActionsSubject,
		private commonStore: Store<fromCommon.CommonState>,
		@Inject(PLATFORM_ID) private platformId: Object,
		@Inject(LOCALE_ID) private locale: string
	) {
		this.isPlatformBrowser = isPlatformBrowser(this.platformId);

		this.signUpStateRef = this.store.pipe(select(fromReducers.getRegistrationErrors)).subscribe(error => {
			if (error) {
				this._mapErrorsToForm(error);
			}
		});
		// TODO for clean up we can map success:fail as an error for ServerValidationError
		this.registrationFailureRef = this.store.pipe(select(fromReducers.getRegistrationFailure)).subscribe(failure => {
			if (!failure && failure !== null) {
				this.confirmModal.onOpen(this.clubFailedModal)
			}
		})

		// Subscribe to the success action so that we can handle specific issues related to club1111
		this.dispatchSubscribtionRef = this.dispatcher.pipe(
			filter(action => action.type === SignUpActionTypes.RegisterNewUserSuccess
				|| action.type === Club1111ActionTypes.RegisterNewUClub111UserFailure)
		).subscribe((action) => {
			// Handle Club1111 error states here and display message accordingly
			if ((action.type === SignUpActionTypes.RegisterNewUserSuccess &&
				action['userDetails']['registration_status'] === ServerRegistrationStatusEnum.CLUB_11_11_FAIL) ||
				action.type === Club1111ActionTypes.RegisterNewUClub111UserFailure) {
				this.signUpContainerData.SignUpState = SignUpContainerStateEnum.isSignUpClubElevenEleven;
				return false;
			}
			this.signUpContainerData.SignUpState = SignUpContainerStateEnum.isSuccessState;
		});

		this.isLogginLoading$ = this.store.pipe(select(fromReducers.isLogginLoading));
		this.userSummary$ = this.store.pipe(select(fromReducers.getLoggedInUser));
		this.userSummaryRef = this.userSummary$.subscribe(user => {
			this.isUserLoggedIn = !user ? false : true;
			this.isUserClub1111Member = user && user.isClubElevenElevenMember;
			const birthday = user ? user.birthday : null;
			const dateOfBirth = this.formBuilderService.buildUserBirthdayObject(birthday);
			if (!this.isUserLoggedIn) {
				this._buildFormStepOne();
			} else if (!this.isUserClub1111Member) {
				this.signUpDetailsData.clubElevenElevenData = user.clubElevenElevenData;
				this._buildFormStepTwo();
				this.signUpFormStepTwo.patchValue({
					dateOfBirth
				});
				this.signUpContainerData.SignUpState = SignUpContainerStateEnum.isSignUpClubElevenEleven;
			} else {
				this.signUpContainerData.SignUpState = SignUpContainerStateEnum.isSuccessState;
				// what do we show if user is signed in and a club 11-11 member ?
				// I'd assume redirect to the account page
			}
		});

		this.deeplinkCouponSubscriptionRef = this.store.pipe(select(fromCommon.getDeepLinkCoupon)).subscribe(data => {
			if (data) {
				this.deepLinkCoupon = data;
			}
		})
	}

	/**
	 * On Init
	 */
	ngOnInit() {
		this.subscribeToDateChanges();
		this.getValidDays()
	}
	/**
	 * Angular destructor
	 */
	ngOnDestroy() {
		this.registrationFailureRef.unsubscribe();
		this.deeplinkCouponSubscriptionRef.unsubscribe();
		this._unsubscribeFromAll();
	}
	/**
	 * Unsubscribe
	 */
	private _unsubscribeFromAll() {
		if (this.signUpStateRef) {
			this.signUpStateRef.unsubscribe();
			this.dispatchSubscribtionRef.unsubscribe();
			this.userSummaryRef.unsubscribe();
		}
		if (this.validDaysSubscriptionRef) {
			this.validDaysSubscriptionRef.unsubscribe()
		}
	}

	/**
	 * Map Errors to UI Form
	 */
	private _mapErrorsToForm(errors: SignUpInterfaces.SignUpFormErrorInterface) {
		let isErrorOnStepOne = false;
		const haveCardError = ['cardNumber', 'cardPin', 'addressRequired', 'invalidCard'];
		for (const key in errors) {
			if (key && (this.signUpFormStepOne && this.signUpFormStepOne.get(key)) && errors[key]) {
				const formControl = this.signUpFormStepOne.get(key);
				this._setFormControlErrors(formControl, key, errors[key]);
				isErrorOnStepOne = true;
			} else if (key && (this.signUpFormStepTwo && this.signUpFormStepTwo.get(key)) && errors[key]) {
				const formControl = this.signUpFormStepTwo.get(key);
				this._setFormControlErrors(formControl, key, errors[key]);
			}
		}

		this.signUpContainerData.SignUpState = isErrorOnStepOne ?
			SignUpContainerStateEnum.isSignUpFormState : SignUpContainerStateEnum.isSignUpClubElevenEleven;

		this.signUpClubElevenElevenUI.isAddressRequired = errors['addressRequired'] ? true : false;
		this.signUpClubElevenElevenUI.isHaveCardSelected = haveCardError.find(error => errors[error]) ? true : false;

		this.isClub1111ErrorPopup = this.signUpClubElevenElevenUI.isAddressRequired;
		this.isClub1111Failed = errors['invalidCard'] && !this.isClub1111ErrorPopup ? true : false;
		if (this.isClub1111ErrorPopup) {
			this.confirmModal.onOpen(this.clubErrorPopup)
		}
		if (this.isClub1111Failed) {
			this.confirmModal.onOpen(this.clubFailedModal)
		}
	}

	/**
	 * set errors for form control
	 */
	private _setFormControlErrors(formControl: AbstractControl, key: string, value: string) {
		// setTimeout used to avoid angulars validation reseting
		if (this.isPlatformBrowser) {
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
	 * Build the first step of the form
	 * TODO - MOVE The form builder to the global service so that it is easily used in this and the edit modal
	 */
	private _buildFormStepOne() {
		this.signUpContainerData.SignUpState = SignUpContainerStateEnum.isSignUpFormState;

		this.signUpFormStepOne = this.fb.group({
			'firstName': new FormControl(this.signUpDetailsData.firstName || '',
				Validators.compose([
					Validators.required,
					Validators.maxLength(this.formValidationService.getNameFieldMaxlength())
				])
			),
			'lastName': new FormControl(this.signUpDetailsData.lastName || '',
				Validators.compose([
					Validators.required,
					Validators.maxLength(this.formValidationService.getNameFieldMaxlength())
				])
			),
			'emailAddress': new FormControl(
				this.signUpDetailsData.emailAddress || '',
				Validators.compose([
					Validators.required,
					Validators.email,
					Validators.pattern(this.formValidationService.getEmailRegex()),
					Validators.maxLength(254)
				]),
				this.validateEmailNotTaken.bind(this)
			),
			'password': new FormControl(
				this.signUpDetailsData.password || null, Validators.compose([
					Validators.required,
					Validators.maxLength(25),
					Validators.minLength(7)
				]),
			),
			'phoneNumber': new FormControl(
				this.signUpDetailsData.phoneNumber || '', Validators.compose([
					Validators.required,
					Validators.pattern(this.formValidationService.getPhoneNumberRegex())
				])
			),
			'phoneExtension': new FormControl(
				this.signUpDetailsData.phoneExtension || '', Validators.compose([
					Validators.maxLength(5),
				])
			),
			'phoneType': new FormControl(
				this.signUpDetailsData.phoneType || 'Home'
			),
			'dateOfBirth': this.fb.group({
				'day': new FormControl(null),
				'month': new FormControl(null),
				'year': new FormControl(null)
			}),
			'language': new FormControl(this.signUpDetailsData.language || 'English'),
			'ppPromotions': new FormControl(this.signUpDetailsData.ppPromotions || null, Validators.compose([Validators.required]))
		});
	}
	/**
	 * Async Validation for if email exists
	 */
	validateEmailNotTaken(control: AbstractControl) {
		// The timer allows us to delay the api calls
		return timer(2000).pipe(
			switchMap(() => {
				return this.formValidationService.checkIfUserEmailExists({ user_email: control.value.toLowerCase() }).pipe(
					map(res => {
						return !res.exists ? control.errors : { emailTaken: true };
					})
				);
			}));
	}
	/**
	* Build the Club Eleven Section of the form
	*/
	private _buildFormStepTwo() {
		if (this.isPlatformBrowser) {
			window.scrollTo(0, 0);
		}
		const clubData = this.signUpDetailsData.clubElevenElevenData ? this.signUpDetailsData.clubElevenElevenData : {
			streetAddress: null,
			apartmentNumber: null,
			sendClubPromotions: null,
			cardNumber: null,
			cardPin: null
		};

		this.signUpFormStepTwo = new FormGroup({
			'streetAddress': new FormControl(clubData.streetAddress || '', Validators.compose(
				[Validators.required]
			)),
			'addressString': new FormControl(clubData.addressString || ''),
			'apartmentNumber': new FormControl(clubData.apartmentNumber || ''),
			'dateOfBirth': this.fb.group({
				'day': new FormControl(null),
				'month': new FormControl(null),
				'year': new FormControl(null)
			}),
			'language': new FormControl(this.signUpDetailsData.language || 'English'),
			'sendClubPromotions': new FormControl(clubData.sendClubPromotions || null, Validators.compose([Validators.required])),
			'cardNumber': new FormControl(clubData.cardNumber || null,
				Validators.compose([Validators.pattern('^[0-9]+$'), Validators.maxLength(19)])),
			'cardPin': new FormControl(clubData.cardPin || null,
				Validators.compose([Validators.pattern('^[0-9]+$'), Validators.maxLength(3)]))
			,
			'token': new FormControl(null)
		});
	}

	/**
	 * Update Step Two Validators
	 */
	private _updateStepTwoValidation() {
		const streetAddress = this.signUpFormStepTwo.get('streetAddress');
		const cardNumber = this.signUpFormStepTwo.get('cardNumber');
		const cardPin = this.signUpFormStepTwo.get('cardPin');
		const cardToken = this.signUpFormStepTwo.get('token');
		if (this.signUpClubElevenElevenUI.isHaveCardSelected) {
			streetAddress.clearValidators();
			cardNumber.setValidators(Validators.required);
			cardPin.setValidators([Validators.required, Validators.pattern('^[0-9]+$')]);
		} else {
			streetAddress.setValidators(Validators.required);
			cardNumber.clearValidators();
			cardPin.clearValidators();
			cardToken.patchValue(null);
			this.signUpClubElevenElevenUI.isAddressRequired = false;
		}

		streetAddress.updateValueAndValidity();
		cardNumber.updateValueAndValidity();
		cardPin.updateValueAndValidity();
	}

	/**
	 * Sign Up Details Event Handler
	 */
	handleSignUpDetailsEventEmitter(event: SignUpInterfaces.SignUpFormEmitterInterface) {
		switch (event.action) {
			case SignUpInterfaces.SignUpFormActionsEnum.onShowPassword: {
				this.isPasswordDisplayed = !this.isPasswordDisplayed;
				break;
			}
			case SignUpInterfaces.SignUpFormActionsEnum.onUserImageSave: {
				this.signUpDetailsData.userImage.userImageData = event.imageData;
				break;
			}
			case SignUpInterfaces.SignUpFormActionsEnum.onUserImageClear: {
				this.signUpDetailsData.userImage.userImageData = null;
				break;
			}
			case SignUpInterfaces.SignUpFormActionsEnum.onFormSubmit: {
				this.signUpDetailsData = {
					...this.signUpDetailsData,
					...event.formData
				};
				if (this.signUpDetailsData.ppPromotions === 'yes') {
					this.store.dispatch(new RegistrationDataLayer(DataLayerRegistrationEventEnum.REGCONTINUE, 'Send promotions: Yes'))
				} else {
					this.store.dispatch(new RegistrationDataLayer(DataLayerRegistrationEventEnum.REGCONTINUE, 'Send promotions: No'))
				}
				this._buildFormStepTwo();
				this.signUpContainerData.SignUpState = SignUpContainerStateEnum.isSignUpClubElevenEleven;

				break;
			}
			default: {
				console.warn('CRITICAL | Not defined sign up action', event);
				break;
			}
		}
	}
	/**
	 * Sign Up Details Event Handler
	 */
	handleSignUpSuccessEventEmitter(event: SignUpSuccessEmitterInterface) {
		// On Success Continue Click
		if (event.action === SignUpSuccessActionsEnum.onContinueClick) {
			if (this.deepLinkCoupon) {
				const link = this.isUserClub1111Member ? '/user/club-eleven-eleven/loyalty' : '/user/club-eleven-eleven';
				this.router.navigate([link], {queryParams: {coupon: this.deepLinkCoupon}})
			} else {
				this.router.navigate(['']);
			}

		}
	}

	/**
	 * Sign Up Details Event Handler
	 */
	handleSignUpClubElevenElevenEventEmitter(event: SignUpClubElevenElevenEmitterInterface) {
		switch (event.action) {
			case SignUpClubElevenElevenActionsEnum.onNeedCardSelect:
			case SignUpClubElevenElevenActionsEnum.onHaveCardSelect: {
				this.signUpClubElevenElevenUI.isHaveCardSelected = event.action === SignUpClubElevenElevenActionsEnum.onHaveCardSelect;
				this._updateStepTwoValidation();
				break;
			}

			case SignUpClubElevenElevenActionsEnum.onFormSubmit: {
				const formSubmission = event.formData;
				this.signUpDetailsData = {
					...this.signUpDetailsData,
					dateOfBirth: formSubmission.dateOfBirth,
					language: formSubmission.language,
					clubElevenElevenData: {
						streetAddress: formSubmission.streetAddress,
						apartmentNumber: formSubmission.apartmentNumber,
						cardNumber: formSubmission.cardNumber,
						cardPin: formSubmission.cardPin,
						sendClubPromotions: formSubmission.sendClubPromotions,
						token: formSubmission.token
					},
				};
				// TODO - Complete User Registration with Club 11-11
				this.store.dispatch(new MapFormToServerRegistrationRequest(this.signUpDetailsData, false, this.isUserLoggedIn));
				this.signUpContainerData.SignUpState = SignUpContainerStateEnum.isRegistrationLoading;
				if (this.isPlatformBrowser) {
					window.scrollTo(0, 0);
				}
				break;
			}

			case SignUpClubElevenElevenActionsEnum.onCreateAccountClick: {
				delete (this.signUpDetailsData.clubElevenElevenData);
				this.store.dispatch(new MapFormToServerRegistrationRequest(this.signUpDetailsData));
				this.signUpContainerData.SignUpState = SignUpContainerStateEnum.isRegistrationLoading;
				if (this.isPlatformBrowser) {
					window.scrollTo(0, 0);
				}
				break;
			}
			default: {
				console.warn('CRITICAL | Not defined club 1111 action', event);
				break;
			}
		}
	}

	/**
	 * Subscribing to date changes - TODO: resolve
	 */
	subscribeToDateChanges() {
		if (this.signUpFormStepOne) {
			this.validDaysSubscriptionRef = this.signUpFormStepOne.get('dateOfBirth').valueChanges.subscribe(changes => {
				if (changes.month) {
					this.getValidDays()
				}
			})
		}
	}
	/**
	 * Get Valid Days In Month
	 */
	getValidDays() {
		if (this.signUpFormStepOne) {
			const dobControl = this.signUpFormStepOne.get('dateOfBirth').value;
			const monthValue = dobControl.month;
			const yearValue = dobControl.year;
			this.validDays = this.formValidationService.getDaysInMonth(yearValue, monthValue);
		}
	}
}

export {
	SignUpContainerComponent,
	SignUpContainerStateEnum,
	SignUpContainerInterface
};
