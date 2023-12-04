// Angular Core
import { ViewEncapsulation, Component, OnDestroy, ViewChild, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';

// NGRX core
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

// Social logic lib
import { AuthService } from 'angularx-social-login';
import { FacebookLoginProvider, GoogleLoginProvider } from 'angularx-social-login';

// Components interfaces
import {
	SignInEmitterInterface,
	SignInActionsEnum
} from '../../components/sign-in/sign-in-form/sign-in-form.component';
import {
	PromptModalComponent
} from '../../../common/components/modals/prompt-modal/prompt-modal.component';
import { ServerLoginErrorResponse } from '../../models/server-models/server-user-registration-input';

// REDUX
import * as fromReducers from '../../reducers';
import * as fromCheckout from '../../../checkout/reducers';

import { UserLogin, ResetPasswordSendEmail, SetNewPassword, CheckoutAsGuestUser } from '../../actions/sign-up-actions';
import { LoginWithFb, LoginWithGoogle } from '../../actions/social-login';
import { UserSummaryInterface } from '../../models/user-personal-details';
import { AsyncFormValidationService } from '../../../../utils/async-form-validation';
import { Product } from 'app/catalog/models/product';

/**
 * Enum to detect state of prompt modal
 */
export enum PromptModalStatusEnum {
	load,
	reset,
	sent,
	success
}

/**
 * Enum for social platforms
 */
enum SocialPlatformEnum {
	FACEBOOK = 'FACEBOOK',
	GOOGLE = 'GOOGLE'
}
const auth = {
	scope: 'email',
}
@Component({
	selector: 'app-sign-in',
	templateUrl: './sign-in-checkout-container.component.html',
	styleUrls: ['./sign-in-checkout-container.component.scss'],
	providers: [PromptModalComponent],
	encapsulation: ViewEncapsulation.None
})

export class SignInCheckoutContainerComponent implements OnDestroy, OnInit {
	@ViewChild('resetFormModal', { static: true }) resetFormModal;
	@ViewChild('editProfileModal', { static: true }) editProfileModalRef;
	productsInCart$: Observable<Product[]>;

	socialPlatformEnum = SocialPlatformEnum;

	modalResult: boolean;
	promptModalStatus: PromptModalStatusEnum = PromptModalStatusEnum.load;
	promptModalForm: FormGroup;
	PromptModalStatusEnum = PromptModalStatusEnum;

	loginFailure$: Observable<ServerLoginErrorResponse> // Switch this with a UI Interface
	paramsSub;
	resetPayload: string;

	isUserSocialLoggedIn = false;
	userLoginLoading$: Observable<boolean>;
	userSummary$: Observable<UserSummaryInterface>;
	userSummarySubscriptionRef;

	tempUI = {};
	// tempUiToken = '';
	// tempUiProvider = '';
	isPasswordDisplayed: boolean;
	isPasswordTypeDisplayed: boolean;
	isPassword2TypeDisplayed: boolean;

	constructor(
		private store: Store<fromReducers.UserState>,
		private checkoutStore: Store<fromCheckout.CheckoutState>,

		private fb: FormBuilder,
		private route: ActivatedRoute,
		private promptModal: PromptModalComponent,
		private socialLogicService: AuthService,
		private formValidationService: AsyncFormValidationService,
		private router: Router
		// private fbProvider: FacebookLoginProvider
	) {
		this.productsInCart$ = this.checkoutStore.pipe(select(fromCheckout.getCartProducts));

		this.loginFailure$ = this.store.pipe(select(fromReducers.getLoginFailErorr));
		this.userSummary$ = this.store.pipe(select(fromReducers.getLoggedInUser));
		this.userLoginLoading$ = this.store.pipe(select(fromReducers.isLogginLoading))

		this.userSummarySubscriptionRef = this.userSummary$.subscribe(user => {
			// If there is a user logged in but their phone number is null
			if (user) {
				if (!user.contactNumber.phoneNumber) {
					this.isUserSocialLoggedIn = false;
					this.editProfileModalRef.open();
				} else {
					this.router.navigate(['/checkout'])
				}
			}
		})

		this.resetPayload = null;
		this.promptModalStatus = PromptModalStatusEnum.load;

		this._definePromptData(null);

		this.paramsSub = this.route.queryParams.subscribe(params => {
			this.resetPayload = params['payload'];
		});
	}

	/**
	 * On Init we need to see if there is a reset payload
	 */
	ngOnInit() {
		if (this.resetPayload) {
			this.promptModalStatus = PromptModalStatusEnum.reset;
			this._definePromptData(true);
			this._openPromptModal();
		}
	}

	/**
	 * Destroy subscriptions
	 */
	ngOnDestroy() {
		if (this.paramsSub) {
			this.paramsSub.unsubscribe();
			this.userSummarySubscriptionRef.unsubscribe();
		}
	}

	/**
	 * Initiate Facebook/Google oauth2
	 */
	onSocialLoginClick(platform: SocialPlatformEnum) {
		const provider = platform === SocialPlatformEnum.FACEBOOK ? FacebookLoginProvider.PROVIDER_ID : GoogleLoginProvider.PROVIDER_ID;
		this.socialLogicService.authState.subscribe((user) => {
			// console.warn(user);
			if (!user || user.provider !== platform) {
				this.isUserSocialLoggedIn = false;
				const authParametersFB = platform === SocialPlatformEnum.FACEBOOK ? auth : null
				this.socialLogicService.signIn(provider, authParametersFB);

				this.tempUI = {};
				return false;
			}

			this.isUserSocialLoggedIn = true;
			this.tempUI[user.provider] = user.authToken

			if ((user.provider === platform) && (platform === SocialPlatformEnum.FACEBOOK)) {
				this.store.dispatch(new LoginWithFb(user.authToken, true));
			}

			if ((user.provider === platform) && (user.provider === SocialPlatformEnum.GOOGLE)) {
				this.store.dispatch(new LoginWithGoogle(user.authToken, true));
			}
		});

		if (!this.isUserSocialLoggedIn) {
			this.socialLogicService.signIn(platform).catch(reason => console.log(reason));
		}
	}

	/**
	 * On oAuth logout
	 */
	onSocialSignOutClick() {
		this.socialLogicService.signOut();
	}

	/**
	 * Allow Guest User Checkout
	 */
	onGuestCheckout() {
		this.store.dispatch(new CheckoutAsGuestUser(true));
	}

	/**
	 * On showing password as text
	 */
	onShowPassword(event) {
		this.isPasswordDisplayed = !this.isPasswordDisplayed
	}
	/**
	 * Define Prompt Data
	 */
	_definePromptData(reset: boolean) {
		if (reset) {
			this.promptModalForm = this.fb.group({
				passwords: this.fb.group({
					new_password: ['', [Validators.required, Validators.minLength(7)]],
					confirm_password: ['', [Validators.required, Validators.minLength(7)]],
				}, { validator: this._passwordConfirmation }),
			})
			return false
		}

		this.promptModalForm = this.fb.group(
			{
				'emailAddress': ['',
					Validators.compose([
						Validators.required,
						Validators.email,
						Validators.maxLength(254),
						Validators.pattern(this.formValidationService.getEmailRegex())
					])]
			}
		);
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
	 * Sign In Details Event Handler
	 */
	handleSignInDetailsEventEmitter(event: SignInEmitterInterface) {
		// Sign In action
		if (event.action === SignInActionsEnum.onSignInProfile) {
			// dispatch signin action
			const loginRequest = {
				username: event.emailAddress.toLowerCase(),
				password: event.password
			}
			this.store.dispatch(new UserLogin(loginRequest, true));
		}

		if (event.action === SignInActionsEnum.onOpenPromptModal) {
			// open the modal
			this._definePromptData(null);
			this.promptModalStatus = PromptModalStatusEnum.load;
			this._openPromptModal();
		}
	}

	/**
	 * Open forgot password prompt
	 */
	_openPromptModal() {
		this.promptModal.onOpen(this.resetFormModal);
	}

	/**
	 * On Reset Form Submit
	 */
	onResetFormSubmit(formData) {
		if (formData.emailAddress) {
			// TODO: move this to a listener on the success action
			this.promptModalStatus = PromptModalStatusEnum.sent;

			this.store.dispatch(new ResetPasswordSendEmail(formData.emailAddress.toLowerCase()));


		} else if (formData.passwords && this.resetPayload) {
			// TODO: move this to a listener on the success action
			this.promptModalStatus = PromptModalStatusEnum.success;

			const newPassword = formData.passwords.new_password;
			this.store.dispatch(new SetNewPassword(newPassword, this.resetPayload));
		}
	}
}

