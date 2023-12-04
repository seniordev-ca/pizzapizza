import {
	Component,
	Input,
	Output,
	EventEmitter,
	ViewEncapsulation,
	ViewChild,
	ElementRef,
	AfterViewInit,
	AfterViewChecked
} from '@angular/core';

import {
	FormBuilder,
	FormGroup,
	Validators
} from '@angular/forms';
import {
	ServerLoginErrorResponse
} from '../../../models/server-models/server-user-registration-input';
import { AsyncFormValidationService } from '../../../../../utils/async-form-validation';
// services
import { UpdateDataLayer, RegistrationDataLayer } from '../../../../common/actions/tag-manager';
import { DataLayerEventEnum, DataLayerRegistrationEventEnum } from '../../../../common/models/datalayer-object';
// Reducers
import * as fromUser from '../../../../user/reducers';
// NGRX
import { Store } from '@ngrx/store';
/**
 * Defines actions that can be made on the Sign In Component
 */
enum SignInActionsEnum {
	onSignInProfile,
	onShowPassword,
	onInputChange,
	onOpenPromptModal
}

/*
/** SignInEmitterInterface
 */
interface SignInEmitterInterface {
	action: SignInActionsEnum,
	emailAddress: string,
	password: string,
	userId: string
}

/*
/** SignInInterface
 */
interface SignInInterface {
	emailAddress: string,
	password: string,
	isPasswordDisplayed: boolean,
	isSignInBtnActive: boolean,
	isEmailValid: boolean,
	isPasswordValid: boolean,
	isUserSignedIn: boolean,
	userId: string
}



@Component({
	selector: 'app-sign-in-form-component',
	templateUrl: './sign-in-form.component.html',
	styleUrls: ['./sign-in-form.component.scss'],
	encapsulation: ViewEncapsulation.None

})

class SignInFormComponent implements AfterViewChecked {
	@ViewChild('emailAddress', { static: true }) emailAddress: ElementRef;
	@ViewChild('passwordInput', { static: true }) passwordInput: ElementRef;

	@Input() isSignInLoading: boolean;
	@Input() signInDetails: SignInInterface; // consider removing this
	@Input() isCheckout: boolean;
	@Output() signInDetailsEventEmitter: EventEmitter<SignInEmitterInterface> =
		new EventEmitter<SignInEmitterInterface>();

	@Input() signInFailure: ServerLoginErrorResponse;

	signInForm: FormGroup;
	isPasswordDisplayed: boolean;

	formValidator: AsyncFormValidationService;
	/**
	* Initiate rules for form validation
	*/
	constructor(
		private fb: FormBuilder,
		private formValidationService: AsyncFormValidationService,
		private userStore: Store<fromUser.UserState>
	) {
		this.formValidator = this.formValidationService;

		const formData = this.signInDetails || {} as SignInInterface;
		this.signInForm = fb.group({
			'emailAddress': [formData.emailAddress || '', Validators.compose([
				Validators.required,
				Validators.email,
				Validators.maxLength(254),
				Validators.pattern(this.formValidationService.getEmailRegex()),
			])],
			'password': [
				formData.password || '', Validators.compose([
					Validators.required,
					Validators.maxLength(25),
					Validators.minLength(7)]
				)
			]
		})

	}

	/**
	* onSignInProfile
	*/
	onSignInProfile(event, userId) {
		event.stopPropagation();
		event.preventDefault();

		const action = {
			action: SignInActionsEnum.onSignInProfile,
			userId
		} as SignInEmitterInterface;

		this.signInDetailsEventEmitter.emit(action);
	}

	/**
	* onShowPassword
	*/
	onShowPassword(event) {
		this.isPasswordDisplayed = !this.isPasswordDisplayed
	}

	/**
	* onOpenPromptModal
	*/
	onOpenPromptModal(event) {
		event.preventDefault();
		event.stopPropagation();

		const action = {
			action: SignInActionsEnum.onOpenPromptModal
		} as SignInEmitterInterface

		this.signInDetailsEventEmitter.emit(action)
		this.userStore.dispatch(new UpdateDataLayer(DataLayerEventEnum.FORGOTPW))
	}

	/**
	* onFormSubmit
	*/
	onFormSubmit(formValue) {
		const action = {
			action: SignInActionsEnum.onSignInProfile,
			emailAddress: formValue.emailAddress,
			password: formValue.password
		} as SignInEmitterInterface

		this.signInDetailsEventEmitter.emit(action);
		this.userStore.dispatch(new UpdateDataLayer(DataLayerEventEnum.SIGNINBTN, 'Email'));

	}

	/**
	 * Force autofill fix
	 */
	ngAfterViewChecked() {
		const emailAutoFill = this.emailAddress.nativeElement.value;
		const emailValue = this.signInForm.get('emailAddress').value;
		const passwordAutoFill = this.passwordInput.nativeElement.value;
		const passwordValue = this.signInForm.get('password').value;
		if (emailAutoFill && !emailValue) {
			this.signInForm.get('emailAddress').patchValue(emailAutoFill)
		}
		if (passwordAutoFill && !passwordValue) {
			this.signInForm.get('password').patchValue(passwordAutoFill)
		}
	}

	/**
	 * handle create account click for tag manager
	 */
	handleCreateAccClick() {
		this.userStore.dispatch(new RegistrationDataLayer(DataLayerRegistrationEventEnum.REGSTARTED, 'Sign in'))
	}
}

export {
	SignInFormComponent,
	SignInInterface,
	SignInEmitterInterface,
	SignInActionsEnum,
}
