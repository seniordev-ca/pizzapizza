import { Action } from '@ngrx/store';
import {
	ServerUserRegistrationInputInterface,
	ServerLoginRequestInterface,
	ServerLoginResponseInterface,
	ServerLoginErrorResponse,
	ServerClub1111PrefillInterface,
	SignInTypeEnum,
} from '../models/server-models/server-user-registration-input';

import {
	SignUpFormInterface
} from '../components/sign-up/sign-up-form/sign-up-form.component';
import { ServerValidationError } from '../../common/models/server-validation-error';

/**
 * Sign Up Actions
 */
export enum SignUpActionTypes {
	MapFormToServerRegistrationRequest = '[User](SignUp) Map UI to Server Interface',
	RegisterNewUser = '[User](SignUp) User clicks register',
	RegisterNewUserSuccess = '[User](SignUp) User clicks register, call succeeds, user is successfully registered',
	RegisterNewUserFailure = '[User](SignUp) User clicks register, call is unsuccessful, registration has failed',

	GetUserSummary = '[User](SignUp) Get User Summary Via Access Tokens',
	GetUserSummarySuccess = '[User](SignUp) Get User Summary Success',
	GetUserSummaryFailure = '[User](SignUp) Get User Summary Failed',

	UserLogin = '[User](SignUp) User Login Request',
	UserLoginSuccess = '[User](SignUp) User Login Successful',
	UserLoginFailure = '[User](SignUp) User Login Fails',
	UserLogsOut = '[User](SignUp) User Logs Out',

	FetchUserEditProfile = '[User](SignUp) Fetch Profile',
	FetchUserEditProfileSuccess = '[User](SignUp) Fetch Profile Success',
	FetchUserEditProfileFailure = '[User](SignUp) Fetch Profile Failure',

	UpdateUserEditProfile = '[User](SignUp) Update Profile',
	UpdateUserEditProfileSuccess = '[User](SignUp) Update Profile Success',
	UpdateUserEditProfileFailure = '[User](SignUp) Update Profile Failure',

	ResetPasswordSendEmail = '[User](SignUp) Send Reset Password Email',
	ResetPasswordSendEmailSuccess = '[User](SignUp) Send Reset Password Email Success',
	ResetPasswordSendEmailFailure = '[User](SignUp) Send Reset Password Email Failure',

	SetNewPassword = '[User](SignUp) Set New Password',
	SetNewPasswordSuccess = '[User](SignUp) Set New Password Success',
	SetNewPasswordFailure = '[User](SignUp) Set New Password Failure',

	ResetFormValidation = '[User](SignUp) Reset Form Validation',

	FetchClub1111PrefillSuccess = '[User](SignUp) Fetch Club 1111 Prefill Data Success',
	FetchClub1111PrefillFailure = '[User](SignUp) Fetch Club 1111 Prefill Data Failure',

	CheckoutAsGuestUser = '[User](SignUp) Checkout As Guest User'
}

export class MapFormToServerRegistrationRequest implements Action {
	readonly type = SignUpActionTypes.MapFormToServerRegistrationRequest;
	constructor(
		public payload: SignUpFormInterface,
		public isUpdate?: boolean,
		public isClubElevenRegistration?: boolean,
		public isCheckout?: boolean
	) { }
}
export class RegisterNewUser implements Action {
	readonly type = SignUpActionTypes.RegisterNewUser;
	constructor(public registarationRequestPayload: ServerUserRegistrationInputInterface) { }
}

export class RegisterNewUserSuccess implements Action {
	readonly type = SignUpActionTypes.RegisterNewUserSuccess;
	constructor(public userDetails: ServerLoginResponseInterface, public isNewCard: boolean) { }
}

export class RegisterNewUserFailure implements Action {
	readonly type = SignUpActionTypes.RegisterNewUserFailure;
	constructor(public signUpError: ServerValidationError) { }
}

export class GetUserSummary implements Action {
	readonly type = SignUpActionTypes.GetUserSummary;
	constructor(public isUpdate?: boolean) { }
}
export class GetUserSummarySuccess implements Action {
	readonly type = SignUpActionTypes.GetUserSummarySuccess;
	constructor(public userDetails: ServerLoginResponseInterface, public isUpdate?: boolean) { }
}

export class GetUserSummaryFailure implements Action {
	readonly type = SignUpActionTypes.GetUserSummaryFailure;
	constructor(public errorResponse: ServerLoginErrorResponse) { }
}
export class UserLogin implements Action {
	readonly type = SignUpActionTypes.UserLogin;
	constructor(public userLogin: ServerLoginRequestInterface, public isCheckout: boolean) { }
}

export class UserLoginSuccess implements Action {
	readonly type = SignUpActionTypes.UserLoginSuccess;
	constructor(public userDetails: ServerLoginResponseInterface, public loginType: SignInTypeEnum, public isCheckout: boolean) { }
}

export class UserLoginFailure implements Action {
	readonly type = SignUpActionTypes.UserLoginFailure;
	constructor(public errorResponse: ServerLoginErrorResponse) { }
}

export class UserLogsOut implements Action {
	readonly type = SignUpActionTypes.UserLogsOut;
	constructor() { }
}

export class FetchUserEditProfile implements Action {
	readonly type = SignUpActionTypes.FetchUserEditProfile;
}
export class FetchUserEditProfileSuccess implements Action {
	readonly type = SignUpActionTypes.FetchUserEditProfileSuccess;
	constructor(public userProfile: ServerLoginResponseInterface) { }
}
export class FetchUserEditProfileFailure implements Action {
	readonly type = SignUpActionTypes.FetchUserEditProfileFailure;
	constructor(public errorResponse: ServerLoginErrorResponse) { }
}

export class UpdateUserEditProfile implements Action {
	readonly type = SignUpActionTypes.UpdateUserEditProfile;
	constructor(public registarationRequestPayload: ServerUserRegistrationInputInterface, public isCheckout: boolean) { }
}
export class UpdateUserEditProfileSuccess implements Action {
	readonly type = SignUpActionTypes.UpdateUserEditProfileSuccess;
	constructor(public userDetails: ServerLoginResponseInterface, public isCheckout: boolean) { }
}
export class UpdateUserEditProfileFailure implements Action {
	readonly type = SignUpActionTypes.UpdateUserEditProfileFailure;
	constructor(public errorResponse: ServerLoginErrorResponse) { }
}

export class ResetPasswordSendEmail implements Action {
	readonly type = SignUpActionTypes.ResetPasswordSendEmail;
	constructor(public email: string) { }
}
export class ResetPasswordSendEmailSuccess implements Action {
	readonly type = SignUpActionTypes.ResetPasswordSendEmailSuccess;
}
export class ResetPasswordSendEmailFailure implements Action {
	readonly type = SignUpActionTypes.ResetPasswordSendEmailFailure;
}
export class SetNewPassword implements Action {
	readonly type = SignUpActionTypes.SetNewPassword;
	constructor(public password: string, public payload?: string, public isEdit?: boolean) { }
}
export class SetNewPasswordSuccess implements Action {
	readonly type = SignUpActionTypes.SetNewPasswordSuccess;
}
export class SetNewPasswordFailure implements Action {
	readonly type = SignUpActionTypes.SetNewPasswordFailure;
}
export class ResetFormValidation implements Action {
	readonly type = SignUpActionTypes.ResetFormValidation;
}

export class FetchClub1111PrefillSuccess implements Action {
	readonly type = SignUpActionTypes.FetchClub1111PrefillSuccess;
	constructor(public prefillData: ServerClub1111PrefillInterface) { }
}
export class FetchClub1111PrefillFailure implements Action {
	readonly type = SignUpActionTypes.FetchClub1111PrefillFailure
}

export class CheckoutAsGuestUser implements Action {
	readonly type = SignUpActionTypes.CheckoutAsGuestUser;
	constructor(public isCheckout: boolean) { }
}
/**
 * NGRX actions for sign up
 */
export type SignUpActions =
	| MapFormToServerRegistrationRequest
	| RegisterNewUser
	| RegisterNewUserSuccess
	| RegisterNewUserFailure
	| GetUserSummary
	| GetUserSummaryFailure
	| GetUserSummarySuccess
	| UserLogin
	| UserLoginSuccess
	| UserLoginFailure
	| UserLogsOut
	| FetchUserEditProfile
	| FetchUserEditProfileSuccess
	| FetchUserEditProfileFailure
	| UpdateUserEditProfile
	| UpdateUserEditProfileSuccess
	| UpdateUserEditProfileFailure
	| ResetPasswordSendEmail
	| ResetPasswordSendEmailSuccess
	| ResetPasswordSendEmailFailure
	| SetNewPassword
	| SetNewPasswordSuccess
	| SetNewPasswordSuccess
	| ResetFormValidation

	| FetchClub1111PrefillSuccess
	| FetchClub1111PrefillFailure

	| CheckoutAsGuestUser
