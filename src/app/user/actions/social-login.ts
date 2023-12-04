import { Action } from '@ngrx/store';
import { ServerLoginResponseInterface } from '../models/server-models/server-user-registration-input';


/**
 * Sign Up Actions
 */
export enum SignUpActionTypes {
	LoginWithFb = '[User](Social Login) LoginWithFb',
	LoginWithFbSuccess = '[User](Social Login) LoginWithFbSuccess',
	LoginWithFbFailure = '[User](Social Login) LoginWithFbFailure',

	LoginWithGoogle = '[User](Social Login) LoginWithGoogle',
	LoginWithGoogleSuccess = '[User](Social Login) LoginWithGoogleSuccess',
	LoginWithGoogleFailure = '[User](Social Login) LoginWithGoogleFailure'
}

export class LoginWithFb implements Action {
	readonly type = SignUpActionTypes.LoginWithFb;
	constructor(public authToken: string, public isCheckout: boolean) { }
}

export class LoginWithFbSuccess implements Action {
	readonly type = SignUpActionTypes.LoginWithFbSuccess;
	constructor(public userDetails: ServerLoginResponseInterface, public isCheckout: boolean) { }
}

export class LoginWithFbFailure implements Action {
	readonly type = SignUpActionTypes.LoginWithFb;
	constructor() { }
}

export class LoginWithGoogle implements Action {
	readonly type = SignUpActionTypes.LoginWithGoogle;
	constructor(public authToken: string, public isCheckout: boolean ) { }
}

export class LoginWithGoogleSuccess implements Action {
	readonly type = SignUpActionTypes.LoginWithGoogleSuccess;
	constructor(public userDetails: ServerLoginResponseInterface, public isCheckout: boolean) { }
}

export class LoginWithGoogleFailure implements Action {
	readonly type = SignUpActionTypes.LoginWithGoogleFailure;
	constructor() { }
}

/**
 * NGRX actions for sign up
 */
export type SignUpActions =
	| LoginWithFb
	| LoginWithFbSuccess
	| LoginWithFbFailure
