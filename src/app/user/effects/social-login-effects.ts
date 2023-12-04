// Angular Core
import { Injectable } from '@angular/core';

// Reactive operators
import { Effect, Actions, ofType } from '@ngrx/effects';
import { map, catchError, exhaustMap, filter } from 'rxjs/operators';
import { of } from 'rxjs';

// Actions
import * as actionsSocialSignIn from '../actions/social-login';

// Services
import { SocialLoginService } from '../services/social-login';
import { UserLoginSuccess } from '../actions/sign-up-actions';
import { SignInTypeEnum } from '../models/server-models/server-user-registration-input';

@Injectable()
export class SocialLoginEffect {

	@Effect()
	fbLogin = this.actions.pipe(
		ofType(actionsSocialSignIn.SignUpActionTypes.LoginWithFb),
		exhaustMap((action) => {
			const authToken = action['authToken']
			const isCheckout = action['isCheckout']
			return this.socialLoginService.registerUsingFb(authToken).pipe(
				map(response => new actionsSocialSignIn.LoginWithFbSuccess(response, isCheckout)),
				catchError(error => of(new actionsSocialSignIn.LoginWithFbFailure()))
			)
		})
	)

	@Effect()
	googleLogin = this.actions.pipe(
		ofType(actionsSocialSignIn.SignUpActionTypes.LoginWithGoogle),
		exhaustMap((action) => {
			const authToken = action['authToken']
			const isCheckout = action['isCheckout']

			return this.socialLoginService.registerUsingGoogle(authToken).pipe(
				map(response => new actionsSocialSignIn.LoginWithGoogleSuccess(response, isCheckout)),
				catchError(error => of(new actionsSocialSignIn.LoginWithGoogleFailure()))
			)
		})
	)

	@Effect()
	socialLoginSuccess = this.actions.pipe(
		filter(action => action.type === actionsSocialSignIn.SignUpActionTypes.LoginWithFbSuccess ||
			action.type === actionsSocialSignIn.SignUpActionTypes.LoginWithGoogleSuccess),
		map(action => {
			const userDetails = action['userDetails'];
			const signInType = action.type === actionsSocialSignIn.SignUpActionTypes.LoginWithFbSuccess ?
				SignInTypeEnum.FACEBOOK : SignInTypeEnum.GOOGLE
			const isCheckout = action['isCheckout'];
			return new UserLoginSuccess(userDetails, signInType, isCheckout)
		})
	)

	constructor(
		private actions: Actions,
		private socialLoginService: SocialLoginService
	) { }
}
