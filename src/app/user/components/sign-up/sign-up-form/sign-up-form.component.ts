import {
	Component,
	Input,
	Output,
	EventEmitter,
	ViewEncapsulation,
	ViewChild,
	ElementRef,
	OnInit,
	OnChanges, LOCALE_ID, Inject
} from '@angular/core';

import {
	FormGroup
} from '@angular/forms';

import {
	AsyncFormValidationService
} from '../../../../../utils/async-form-validation';
import { SignUpClubElevenElevenInterface } from '../../common/sign-up-club-eleven-eleven/sign-up-club-eleven-eleven.component'
import { PhoneTypeEnum } from '../../../../common/models/address-list';
import { DropdDownOptionInterface } from 'app/common/components/shared/styled-dropdown/styled-dropdown.component';
// services
import { UpdateDataLayer } from '../../../../common/actions/tag-manager';
import { DataLayerEventEnum } from '../../../../common/models/datalayer-object';
// Reducers
import * as fromUser from '../../../../user/reducers';
// NGRX
import { Store } from '@ngrx/store';
/**
 * Sign Up Actions
 */
enum SignUpFormActionsEnum {
	onShowPassword,
	onFormSubmit,
	onUserImageAdd,
	onUserImageClose,
	onUserImageUpload,
	onUserImageSave,
	onUserImageClear,
	onEmailFocusedOut
}

/**
 * User Image States
 */
enum UserImageStateEnum {
	isUserImageNotExists,
	isUserImageExists,
	isStateUserImageUpload,
	isStateUserImageSave
}

/*
/** Sign Up Emitter
 */
interface SignUpFormEmitterInterface {
	action: SignUpFormActionsEnum,
	formData?: SignUpFormInterface,
	imageData?: string
}
/**
 * Date of Birth Interface
 */
interface DateOfBirthInterface {
	day: number | string;
	month: number | string;
	year: number | string;
}
/*
/** Sign Up Interface
 */
interface SignUpFormInterface {
	firstName?: string;
	lastName?: string;
	emailAddress?: string;
	password?: string;
	phoneNumber?: string;
	phoneExtension?: string;
	phoneType?: PhoneTypeEnum;
	dateOfBirth?: DateOfBirthInterface;
	userImage?: UserImageInterface,
	language?: string,
	ppPromotions?: string,
	clubElevenElevenData?: SignUpClubElevenElevenInterface,
	isPasswordDisplayed?: boolean
}

interface SignUpFormErrorInterface {
	firstName: string,
	lastName: string,
	emailAddress: string,
	password: string,
	phoneNumber: string,
	phoneExtension: string
	streetAddress: string,
	cardNumber: string,
	cardPin: string,
	addressRequired: string,
	giftCard: string,
	token: string
}
interface UserImageInterface {
	userImageState?: UserImageStateEnum,
	userImageData?: string
}

@Component({
	selector: 'app-sign-up-form-component',
	templateUrl: './sign-up-form.component.html',
	styleUrls: ['./sign-up-form.component.scss'],
	encapsulation: ViewEncapsulation.None
})

class SignUpFormComponent implements OnInit {
	@ViewChild('phoneNumberExt', { static: false }) phoneNumberExt: ElementRef;

	@Input() isPasswordDisplayed: boolean;
	@Input() userImageDetails: UserImageInterface;
	@Input() submitBtn: string;
	@Input() isEditForm = false;
	@Input() isForcedEdit = false;
	@Output() signUpDetailsEventEmitter: EventEmitter<SignUpFormEmitterInterface> =
		new EventEmitter<SignUpFormEmitterInterface>();

	@Input() signUpForm: FormGroup

	userImageStateEnum = UserImageStateEnum;
	PhoneTypeEnum = PhoneTypeEnum;
	mask: (string | RegExp)[];

	@Input() validDays: DropdDownOptionInterface[];
	yearOptions: string[];
	monthOptions: string[];
	/**
	* Initiate rules for form validation
	*/
	constructor(
		public formValidationService: AsyncFormValidationService,
		private userStore: Store<fromUser.UserState>,
		@Inject(LOCALE_ID) private locale: string
	) {
		this.mask = formValidationService.getPhoneNumberMask();
	}

	/**
	 * On Init
	 */
	ngOnInit() {
		this.yearOptions = this.formValidationService.getYearRange(100);
		this.monthOptions = this.formValidationService.getMonths();
	}
	/**
	* onShowPassword click
	*/
	onShowPassword(event) {
		event.preventDefault();
		const action = {
			action: SignUpFormActionsEnum.onShowPassword,
		} as SignUpFormEmitterInterface;

		this.signUpDetailsEventEmitter.emit(action);
		this.userStore.dispatch(new UpdateDataLayer(DataLayerEventEnum.SAVEPW))
	}

	/**
	 * User Image Pass Through
	 */
	userImageEventEmitterHandler(event) {
		this.signUpDetailsEventEmitter.emit(event);

	}
	/**
	* onFormSubmit
	*/
	onFormSubmit() {
		if (this.signUpForm.valid) {
			const formData = this.signUpForm.value;
			const action = {
				action: SignUpFormActionsEnum.onFormSubmit,
				formData
			} as SignUpFormEmitterInterface;

			this.signUpDetailsEventEmitter.emit(action);
		} else {
			const controls = this.signUpForm.controls;
			Object.keys(controls).forEach(controlName => controls[controlName].markAsTouched());
		}
	}

	/**
	 * Check length of phone number value
	 */
	checkLength(event) {
		// strip all special characters and join them
		let value = event.srcElement.value.match(/\d+/g);
		if (!value) {
			return false;
		}
		value = value.join('');
		if (value.length === 10) {
			this.phoneNumberExt.nativeElement.focus()
		}
	}
}

export {
	SignUpFormComponent,
	SignUpFormInterface,
	SignUpFormActionsEnum,
	SignUpFormEmitterInterface,
	UserImageStateEnum,
	UserImageInterface,
	DateOfBirthInterface,
	SignUpFormErrorInterface
}
