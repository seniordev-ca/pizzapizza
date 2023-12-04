import {
	Component,
	Input,
	ViewEncapsulation,
	ViewChild,
	Inject,
	PLATFORM_ID,
	OnDestroy,
	AfterViewInit
} from '@angular/core';
import {
	FormBuilder,
	FormGroup,
	Validators,
	FormControl,
	AbstractControl
} from '@angular/forms';
import {
	SignUpFormInterface,
	SignUpFormActionsEnum,
	SignUpFormEmitterInterface,
	UserImageStateEnum
} from '../../components/sign-up/sign-up-form/sign-up-form.component';
import {
	UserProfileInterface
} from '../../models/user-personal-details';
import { isPlatformBrowser } from '@angular/common';
/**
 * ngrx
 */
import { Store, select, ActionsSubject } from '@ngrx/store';
import * as fromReducers from '../../reducers';
import {
	MapFormToServerRegistrationRequest, UserLogsOut, SetNewPassword, SignUpActionTypes
} from '../../actions/sign-up-actions';

import { AsyncFormValidationService } from '../../../../utils/async-form-validation';
import { PromptModalStatusEnum } from '../sign-in/sign-in-container.component';
import { PromptModalComponent } from '../../../common/components/modals/prompt-modal/prompt-modal.component';
import {
	ConfirmationModalComponent
} from '../../../common/components/modals/confirmation-modal/confirmation-modal.component';
import { PhoneTypeEnum } from '../../../common/models/address-list';
import { PPFormBuilderService } from '../../../common/services/form-builder.service';
import { Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { DropdDownOptionInterface } from 'app/common/components/shared/styled-dropdown/styled-dropdown.component';

@Component({
	selector: 'app-edit-profile-vertical-modal',
	templateUrl: './edit-profile.component.html',
	styleUrls: ['./edit-profile.component.scss'],
	providers: [PromptModalComponent, PPFormBuilderService],
	encapsulation: ViewEncapsulation.None
})


/**
 *  TODO add reactive form validation
 */
class EditProfileComponent implements OnDestroy, AfterViewInit {
	@ViewChild('editProfileVerticalModal', { static: true }) editProfileVerticalModalRef;
	@ViewChild('resetFormModal', { static: true }) resetFormModal;
	@ViewChild('logoutWarningModal', { static: false }) logoutWarningModal;
	@ViewChild('closeEditModalRef', { static: true }) closeEditModalRef: ConfirmationModalComponent;


	signUpDetailsData: SignUpFormInterface = {
		firstName: null,
		lastName: null,
		emailAddress: null,
		password: null,
		phoneNumber: null,
		userImage: {
			userImageData: null,
			userImageState: UserImageStateEnum.isUserImageNotExists
		},
		dateOfBirth: {
			day: null,
			month: null,
			year: null
		},
		language: null,
		ppPromotions: null,

	}
	signUpFormStepOne: FormGroup;

	modalResult: boolean;
	promptModalStatus: PromptModalStatusEnum = PromptModalStatusEnum.load;
	promptModalForm: FormGroup;
	PromptModalStatusEnum = PromptModalStatusEnum;
	isUserImageSet;
	userUpdateProfileErrorData$;
	isUserUpdateProfileError$;
	isPasswordTypeDisplayed: boolean;
	isPassword2TypeDisplayed: boolean;
	isPlatformBrowser: boolean;
	updateProfileRef;
	dispatchSubscribtionRef;
	validDays: DropdDownOptionInterface[];
	validDaysSubscriptionRef;

	@Input() isForcedEdit: boolean;
	@Input() isCheckout: boolean;
	@Input() set userDetails(user: UserProfileInterface) {
		// UserSummaryInterface  -> SignUpFormInterface
		if (user) {
			const dateOfBirth = this.formBuilderService.buildUserBirthdayObject(user.birthday)
			this.signUpDetailsData = {
				...this.signUpDetailsData,
				firstName: user.firstName,
				lastName: user.lastName,
				userImage: {
					userImageData: user.profilePic,
					userImageState: user.profilePic ? UserImageStateEnum.isUserImageExists : UserImageStateEnum.isUserImageNotExists
				},
				emailAddress: user.email,
				phoneNumber: user.contactNumber.phoneNumber,
				phoneType: user.contactNumber.type === PhoneTypeEnum.Home ? PhoneTypeEnum.Home : PhoneTypeEnum.Mobile,
				phoneExtension: user.contactNumber.extension,
				language: user.optInLanguage,
				// it is possible that isOptedIn is not defined at which point the form needs to be invalid
				ppPromotions: user.isOptedIn === true ? 'yes' : user.isOptedIn === false ? 'no' : null,
				dateOfBirth
			}
			this._buildFormStepOne();
			this.isUserImageSet = user.profilePic;
		}
	}
	isPasswordDisplayed = false;

	constructor(
		private confirmModal: ConfirmationModalComponent,
		private fb: FormBuilder,
		private store: Store<fromReducers.UserState>,
		private formValidationService: AsyncFormValidationService,
		private promptModal: PromptModalComponent,
		private formBuilderService: PPFormBuilderService,
		private router: Router,
		private dispatcher: ActionsSubject,
		@Inject(PLATFORM_ID) private platformId: Object

	) {
		this.promptModalStatus = PromptModalStatusEnum.reset;
		this._definePromptData();
		this.userUpdateProfileErrorData$ = this.store.pipe(select(fromReducers.getUpdateProfileErrors));
		this.isUserUpdateProfileError$ = this.store.pipe(select(fromReducers.isUpdateProfileError));

		this.isPlatformBrowser = isPlatformBrowser(this.platformId);


		this.dispatchSubscribtionRef = this.dispatcher.pipe(
			filter(action => action.type === SignUpActionTypes.UpdateUserEditProfileSuccess)
		).subscribe((action) => {
			this.close();
		});
	}

	/**
	 * After View Init
	 */
	ngAfterViewInit() {
		this.updateProfileRef = this.store.pipe(select(fromReducers.getUpdateProfileErrors)).subscribe(error => {
			if (error) {
				this._mapUpdateProfileErrorsToForm(error);
			}
		});
	}
	/**
	 * Define Password Prompt Data
	 */
	_definePromptData() {
		this.promptModalForm = this.fb.group({
			passwords: this.fb.group({
				new_password: ['', [Validators.required, Validators.minLength(7)]],
				confirm_password: ['', [Validators.required, Validators.minLength(7)]],
			}, { validator: this._passwordConfirmation }),
		})
		return false
	}
	/**
	 * Password Confirmation validator
	 */
	_passwordConfirmation(c: AbstractControl): { noMatch: boolean } {
		if (c.get('new_password').value !== c.get('confirm_password').value) {
			return { noMatch: true };
		}
	}
	/**
	 * Open forgot password prompt
	 */
	_openPromptModal() {
		this.promptModalForm.reset();
		this.promptModalStatus = PromptModalStatusEnum.reset;
		this.promptModal.onOpen(this.resetFormModal);
	}
	/**
	 * On Reset Form Submit
	 */
	onResetFormSubmit(formData) {
		if (formData.passwords) {
			// this.promptModal.onCancel()
			const newPassword = formData.passwords.new_password;
			this.store.dispatch(new SetNewPassword(newPassword, null, true));

			// TODO - move this to action listener
			this.promptModalStatus = PromptModalStatusEnum.success;
		}
	}

	/**
	 * We need to log the user out if forcedEdit is true and user does not have a phone number
	 */
	handleVerticalModalOutput(event) {
		if (event.isClose && this.isForcedEdit && !this.signUpDetailsData.phoneNumber) {
			this.store.dispatch(new UserLogsOut())
		}
	}

	/**
	* Unsubscribe on destroy
	*/
	ngOnDestroy() {
		this.onConfirmClose();
		if (this.updateProfileRef) {
			this.updateProfileRef.unsubscribe();
		}
		if (this.dispatchSubscribtionRef) {
			this.dispatchSubscribtionRef.unsubscribe();
		}
		if (this.validDaysSubscriptionRef) {
			this.validDaysSubscriptionRef.unsubscribe()
		}
	}

	/**
	 * User clicks OKAY
	 */
	onConfirmClose() {
		this.editProfileVerticalModalRef.onModalCloseBtnClick()
	}
	/**
	 * Close Edit Modal
	 */
	closeEditModal() {
		this.confirmModal.onOpen(this.closeEditModalRef);
	}

	/**
	 * Build the first step of the form
	 */
	private _buildFormStepOne() {
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
			'password': new FormControl(
				this.signUpDetailsData.password || '', Validators.compose([
					Validators.maxLength(25),
					Validators.minLength(7)]
				)
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
					// Validators.pattern('^[0-9]+$')
				])
			),
			'phoneType': new FormControl(
				this.signUpDetailsData.phoneType || 'Home'
			),
			'dateOfBirth': this.fb.group({
				'day': new FormControl(this.signUpDetailsData.dateOfBirth.day || null),
				'month': new FormControl(this.signUpDetailsData.dateOfBirth.month || null),
				'year': new FormControl(this.signUpDetailsData.dateOfBirth.year || null)
			}),
			'language': new FormControl(this.signUpDetailsData.language),
			'ppPromotions': new FormControl(this.signUpDetailsData.ppPromotions || null, Validators.compose([Validators.required]))
		});
		if (this.isForcedEdit) {
			Object.keys(this.signUpFormStepOne.controls).forEach(field => {
				const control = this.signUpFormStepOne.get(field);
				control.markAsTouched({ onlySelf: true });
			});
		}
		this.subscribeToDateChanges();
		this.getValidDays()
	}

	/**
	* Map Errors to UI Form on Edit Profile modal window
	*/
	private _mapUpdateProfileErrorsToForm(error) {
		for (const key in error) {
			if (key && this.signUpFormStepOne.get(key) && error[key]) {
				const formControl = this.signUpFormStepOne.get(key);
				this._setFormControlErrors(formControl, key, error[key]);
			}
		}
	}

	/**
	* set errors for form control
	*/
	private _setFormControlErrors(formControl: AbstractControl, key: string, value: string) {
		// setTimeout used to avoid angulars validation reseting
		formControl.setErrors({
			'incorrect': value
		}, { emitEvent: true });
	}
	/**
 	* Sign Up Details Event Handler
 	*/
	handleSignUpDetailsEventEmitter(event: SignUpFormEmitterInterface) {
		switch (event.action) {
			case SignUpFormActionsEnum.onShowPassword: {
				// this.isPasswordDisplayed = !this.isPasswordDisplayed;
				this._openPromptModal()
				break;
			}
			case SignUpFormActionsEnum.onUserImageSave: {
				this.signUpDetailsData.userImage.userImageData = event.imageData;
				break;
			}
			case SignUpFormActionsEnum.onUserImageClear: {
				this.signUpDetailsData.userImage.userImageData = null;
				break;
			}
			case SignUpFormActionsEnum.onFormSubmit: {

				this.signUpDetailsData = {
					...this.signUpDetailsData,
					...event.formData
				}

				if (this.isUserImageSet === this.signUpDetailsData.userImage.userImageData) {
					delete (this.signUpDetailsData.userImage.userImageData)
				}
				// SUBMIT TO NGRX
				this.store.dispatch(new MapFormToServerRegistrationRequest(this.signUpDetailsData, true, false, this.isCheckout))

				break;
			}
			default: {
				console.warn('CRITICAL | Not defined sign up action');
				break;
			}
		}
	}
	/**
	 * Public method for modal opening
	*/
	open() {
		this.editProfileVerticalModalRef.openModal();
	}
	/**
	 * Public method for modal closing
	*/
	close() {
		this.editProfileVerticalModalRef.closeModal();
		if (this.isForcedEdit) {
			const redirectRoute =  this.isCheckout ? '/checkout' : '/';
			this.router.navigate([redirectRoute])
		}
	}
	/**
	 * Subscribing to date changes - TODO: resolve
	 */
	subscribeToDateChanges() {
		if (this.signUpFormStepOne) {
			this.validDaysSubscriptionRef = this.signUpFormStepOne.get('dateOfBirth').valueChanges.subscribe(changes => {
				if (changes.day) {
					this.getValidDays()
				}
			})
		}
	}
	/**
	 * Get Valid Days In Month
	 */
	getValidDays() {
		const dobControl = this.signUpFormStepOne.get('dateOfBirth').value;
		const monthValue = dobControl.month;
		const yearValue = dobControl.year;
		this.validDays = this.formValidationService.getDaysInMonth(yearValue, monthValue);
	}

}

export {
	EditProfileComponent
}
