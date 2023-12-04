// Angular Core
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

// Ng Rx
import { Store } from '@ngrx/store';
// Reactive operators
import { Effect, Actions, ofType } from '@ngrx/effects';
import { map, catchError, exhaustMap, filter, withLatestFrom, flatMap } from 'rxjs/operators';
import { of } from 'rxjs';

import { State } from '../../root-reducer/root-reducer';
import { GlobalActionsTypes } from '../../common/actions/global';
// Actions
import * as actionsSignUP from '../actions/sign-up-actions';

// Services
import { SignUpService } from '../services/sign-up-service';
import { SignUpReducerHelper } from '../reducers/mappers/sign-up-mapper';
import { SignUpFormInterface } from '../components/sign-up/sign-up-form/sign-up-form.component';
import { RegisterNewClub1111User, UpdateClub1111UserInfo } from '../actions/club1111-actions';
// Router Util
import { userRouterEffectUtil } from '../user.routes';
import {
	ServerLoginResponseInterface,
	ServerUserRegistrationInputInterface,
	SignInTypeEnum
} from '../models/server-models/server-user-registration-input';
import { ApplicationHttpClient } from '../../../utils/app-http-client';
import { AccountActionTypes, RequestAccountAddresses } from '../actions/account-actions';
import { ClearCouponWallet } from 'app/common/actions/coupon-wallet';

@Injectable()
export class SignUpEffects {
	/**
	 * Always get user
	 */
	// @Effect()
	// appInitialLoad = this.actions.ofType(GlobalActionsTypes.AppInitialLoad).pipe(
	// 	map(appLoadedAction => {
	// 		if (this.signUpService.tokensExist()) {
	// 			return new GetUserSummary()
	// 		} else {
	// 			return new GetUserSummaryFailure(null)
	// 		}
	// 	})
	// )

	/**
	 * Map UI to Server Request
	 */
	@Effect()
	mapUiToSeverRequestUpdate = this.actions.pipe(
		ofType(actionsSignUP.SignUpActionTypes.MapFormToServerRegistrationRequest),
		filter(action => {
			const isUpdate = action['isUpdate'];
			const isClubElevenRegistration = action['isClubElevenRegistration']
			return isUpdate && !isClubElevenRegistration
		}),
		map((action) => {
			const isCheckout = action['isCheckout'];
			const formSubmission = action['payload'] as SignUpFormInterface
			const serverRequest = SignUpReducerHelper.parseSignUpInfoUIToServer(formSubmission)
			return new actionsSignUP.UpdateUserEditProfile(serverRequest, isCheckout)
		})
	)

	/**
	 * Map To Register New User
	 */
	@Effect()
	mapUiToSeverRequestRegistration = this.actions.pipe(
		ofType(actionsSignUP.SignUpActionTypes.MapFormToServerRegistrationRequest),
		filter(action => {
			const isUpdate = action['isUpdate'];
			const isClubElevenRegistration = action['isClubElevenRegistration']

			return !isUpdate && !isClubElevenRegistration
		}),
		map((action) => {
			const formSubmission = action['payload'] as SignUpFormInterface
			const serverRequest = SignUpReducerHelper.parseSignUpInfoUIToServer(formSubmission)
			return new actionsSignUP.RegisterNewUser(serverRequest)
		})
	)

	/**
	 * Map To Club 11-11 Register New User
	 */
	@Effect()
	mapUiToSeverRequestClub1111Registration = this.actions.pipe(
		ofType(actionsSignUP.SignUpActionTypes.MapFormToServerRegistrationRequest),
		filter(action => {
			const isUpdate = action['isUpdate'];
			const isClubElevenRegistration = action['isClubElevenRegistration']

			return !isUpdate && isClubElevenRegistration
		}),
		map((action) => {
			const formSubmission = action['payload'] as SignUpFormInterface
			const serverRequest = SignUpReducerHelper.parseSignupClub1111ToServerRequest(formSubmission, true)
			return new RegisterNewClub1111User(serverRequest)
		})
	)
	/**
	 * Map To Club 11-11 Update User
	 */
	@Effect()
	mapUiToSeverRequestClub1111Update = this.actions.pipe(
		ofType(actionsSignUP.SignUpActionTypes.MapFormToServerRegistrationRequest),
		filter(action => {
			const isUpdate = action['isUpdate'];
			const isClubElevenRegistration = action['isClubElevenRegistration']

			return isUpdate && isClubElevenRegistration
		}),
		map((action) => {
			const formSubmission = action['payload'] as SignUpFormInterface
			const serverRequest = SignUpReducerHelper.parseSignupClub1111ToServerRequest(formSubmission, true)
			return new UpdateClub1111UserInfo(serverRequest)
		})
	)

	/**
	 * Register New User
	 */
	@Effect()
	registerNewUser = this.actions.pipe(
		ofType(actionsSignUP.SignUpActionTypes.RegisterNewUser),
		withLatestFrom(this.store),
		exhaustMap(([action, store]) => {
			const payload = action['registarationRequestPayload'] as ServerUserRegistrationInputInterface;
			return this.signUpService.registerNewUser(payload).pipe(
				map((response) => {
					// this.location.back()
					const isNewCard = payload.club_11_11 ? payload.club_11_11.is_new_card : false;
					const baseUrl = store.common.settings.data.web_links.image_urls.profile_images;
					response.profile_pic = response.profile_pic ? baseUrl + response.profile_pic : response.profile_pic;
					this.signUpService.saveTokens(response);
					return new actionsSignUP.RegisterNewUserSuccess(response, isNewCard);
				}),
				catchError(error => {
					return of(new actionsSignUP.RegisterNewUserFailure(error.error))
				})
			)
		})
	)

	/**
	 * Prefill club 1111
	 */
	@Effect()
	callFetchPrefillClub1111 = this.actions.pipe(
		filter(action =>
			action.type === '@ngrx/router-store/navigated' ||
			action.type === actionsSignUP.SignUpActionTypes.RegisterNewUserSuccess ||
			action.type === actionsSignUP.SignUpActionTypes.FetchUserEditProfileSuccess
		),
		withLatestFrom(this.store),
		filter(([action, store]) => {
			const currentRoute = store.router.state.url;
			const isSignUpPage = userRouterEffectUtil.isUserOnCorrectPage(currentRoute, 'sign-up')
			const isUserLoggedIn = store.user.userLogin.loggedInUser;
			const hasPrefill = isUserLoggedIn ? isUserLoggedIn.isClubElevenElevenPrefillAvail : null

			return isSignUpPage && hasPrefill;
		}),
		exhaustMap(() => {
			return this.signUpService.fetchClub11Prefill().pipe(
				map(response => new actionsSignUP.FetchClub1111PrefillSuccess(response)),
				catchError(error => of(new actionsSignUP.FetchClub1111PrefillFailure()))
			)
		})
	)

	/**
	 * User Login
	 */
	@Effect()
	userLogin = this.actions.pipe(
		ofType(actionsSignUP.SignUpActionTypes.UserLogin),
		withLatestFrom(this.store),
		exhaustMap(([action, store]) => {
			const payload = action['userLogin'];
			const isCheckout = action['isCheckout']
			return this.signUpService.userLogin(payload).pipe(
				map((response) => {
					const baseUrl = store.common.settings.data.web_links.image_urls.profile_images;
					response.profile_pic = response.profile_pic ? baseUrl + response.profile_pic : response.profile_pic;
					return new actionsSignUP.UserLoginSuccess(response, SignInTypeEnum.EMAIL, isCheckout)
				}),
				catchError(error => of(new actionsSignUP.UserLoginFailure(error.error)))
			)
		})
	)

	@Effect({ dispatch: false })
	onLoginSuccess = this.actions.pipe(
		filter(action => action.type === actionsSignUP.SignUpActionTypes.UserLoginSuccess ||
			action.type === actionsSignUP.SignUpActionTypes.UpdateUserEditProfileSuccess),
		filter(action => !action['isCheckout']),
		withLatestFrom(this.store),
		map(([action, store]) => {
			const currentRoute = store.router.state.url;
			const deeplinkCoupon = store.common.couponWallet.deeplinkCoupon;
			const response = action['userDetails'] as ServerLoginResponseInterface;
			const isUserClub1111Member = response.club_11_11_member;
			const link = isUserClub1111Member ? '/user/club-eleven-eleven/loyalty' : '/user/club-eleven-eleven';

			this.signUpService.saveTokens(response);
			if (response.contact_number
				&& response.contact_number.phone_number
				&& action.type === actionsSignUP.SignUpActionTypes.UserLoginSuccess) {
				const isSignInRoute = userRouterEffectUtil.isUserOnCorrectPage(currentRoute, 'sign-in');
				if (isSignInRoute) {
					if (deeplinkCoupon) {
						this.router.navigate([link], { queryParams: { coupon: deeplinkCoupon } })
					} else {
						this.location.back();
					}
				} else {
					this.router.navigate([''])
				}
			}
		})
	)

	/**
	 * Login On Checkout
	 */
	@Effect({ dispatch: false })
	onLoginSuccessCheckout = this.actions.pipe(
		filter(action => action.type === actionsSignUP.SignUpActionTypes.UserLoginSuccess ||
			action.type === actionsSignUP.SignUpActionTypes.UpdateUserEditProfileSuccess ||
			action.type === actionsSignUP.SignUpActionTypes.CheckoutAsGuestUser),
		filter(action => action['isCheckout']),
		withLatestFrom(this.store),
		map(([action, store]) => {
			if (action.type === actionsSignUP.SignUpActionTypes.UserLoginSuccess) {
				const response = action['userDetails'] as ServerLoginResponseInterface
				this.signUpService.saveTokens(response);
			}
			this.router.navigate(['/checkout'])
		})
	)

	/**
	 * User Summary on load
	 */
	@Effect()
	getUser = this.actions.pipe(
		ofType(actionsSignUP.SignUpActionTypes.GetUserSummary),
		withLatestFrom(this.store),
		// exhaustMap((([action, store]) => this.applicationHttpClient.renewAuthTokenIfRequired('GetUserSummary').pipe(
		// 	withLatestFrom(this.store),
		exhaustMap(([action, store]) => {
			const isUpdate = action['isUpdate']

			return this.signUpService.getUser().pipe(
				map((response) => {
					const baseUrl = store.common.settings.data.web_links.image_urls.profile_images;
					response.profile_pic = response.profile_pic ? baseUrl + response.profile_pic : response.profile_pic;
					return new actionsSignUP.GetUserSummarySuccess(response, isUpdate)
				}),
				catchError(error => of(new actionsSignUP.GetUserSummaryFailure(error.error)))
			)
		})
		// )))
	)

	/**
	 * User Login
	 */
	@Effect({ dispatch: false })
	userLogOut = this.actions.pipe(
		ofType(actionsSignUP.SignUpActionTypes.UserLogsOut),
		map((action) => {
			this.signUpService.removeTokens()
			this.router.navigate([''])
		})
	)

	/**
	 * Fetch User Profile
	 */
	@Effect()
	userProfile = this.actions.pipe(
		ofType(actionsSignUP.SignUpActionTypes.FetchUserEditProfile),
		withLatestFrom(this.store),
		exhaustMap((([action, store]) => this.applicationHttpClient.renewAuthTokenIfRequired('FetchUserEditProfile').pipe(
			withLatestFrom(this.store),
			exhaustMap(() => {
				return this.signUpService.getUserProfile().pipe(
					map((response) => {
						const baseUrl = store.common.settings.data.web_links.image_urls.profile_images;
						response.profile_pic = response.profile_pic ? baseUrl + response.profile_pic : response.profile_pic;
						return new actionsSignUP.FetchUserEditProfileSuccess(response)
					}),
					catchError(error => of(new actionsSignUP.FetchUserEditProfileFailure(error.error)))
				)
			})
		)))
	)

	@Effect()
	signUpPageInit = this.actions.pipe(
		filter(action =>
			action.type === '@ngrx/router-store/navigated'
			|| action.type === actionsSignUP.SignUpActionTypes.GetUserSummarySuccess),
		withLatestFrom(this.store),
		filter(([action, state]) => {
			const isUserLoaded = state.user.userLogin.isFetched && !state.user.userLogin.isLoading
			const isJwtValid = state.user.userLogin.isJwtValid
			const currentRoute = state.router.state.url;
			// const isLoyaltyPage = userRouterEffectUtil.isUserOnCorrectPage(currentRoute, 'club-eleven-eleven/loyalty')
			const isSignUpPage = userRouterEffectUtil.isUserOnCorrectPage(currentRoute, 'sign-up');
			return isSignUpPage && isUserLoaded && isJwtValid;
		}),
		map(action => new actionsSignUP.FetchUserEditProfile())
	)
	/**
	 * Edit User Profile
	 */
	@Effect()
	editUserProfile = this.actions.pipe(
		ofType(actionsSignUP.SignUpActionTypes.UpdateUserEditProfile),
		withLatestFrom(this.store),
		exhaustMap(([action, store]) => {
			const payload = action['registarationRequestPayload'] as ServerUserRegistrationInputInterface;
			delete payload.email
			const activeUser = store.user.userLogin.loggedInUser
			payload.digital_wallet_exists = activeUser.isUserHasWallet;
			const isCheckoutPage = action['isCheckout'];

			return this.signUpService.editUserProfile(payload).pipe(
				flatMap((response) => {
					return [
						new actionsSignUP.UpdateUserEditProfileSuccess(response, isCheckoutPage),
						new actionsSignUP.GetUserSummary(true),
						new RequestAccountAddresses(true)
					]
				}),
				catchError(error => of(new actionsSignUP.UpdateUserEditProfileFailure(error.error)))
			)
		})
	)

	/**
	 * Reset user password - part one (send user email)
	 */
	@Effect()
	sendResetPasswordEmail = this.actions.pipe(
		ofType(actionsSignUP.SignUpActionTypes.ResetPasswordSendEmail),
		exhaustMap((action) => {
			const email = action['email']
			return this.signUpService.sendResetEmail(email).pipe(
				map((response) => new actionsSignUP.ResetPasswordSendEmailSuccess()),
				catchError(error => of(new actionsSignUP.ResetPasswordSendEmailFailure()))
			)
		})
	)
	/**
	 * Reset user password - part two (update user's password)
	 */
	@Effect()
	resetUserPassword = this.actions.pipe(
		ofType(actionsSignUP.SignUpActionTypes.SetNewPassword),
		filter((action) => {
			const isEditPassword = action['isEdit'];
			const isPayloadProvided = action['payload'];
			return !isEditPassword && isPayloadProvided;
		}),
		exhaustMap((action) => {
			const password = action['password'];
			const payload = action['payload']
			return this.signUpService.resetUserPassword(password, payload).pipe(
				map((response) => new actionsSignUP.SetNewPasswordSuccess()),
				catchError(error => of(new actionsSignUP.SetNewPasswordFailure()))
			)
		})
	)

	/**
	 * Edit user password
	 */
	@Effect()
	editUserPassword = this.actions.pipe(
		ofType(actionsSignUP.SignUpActionTypes.SetNewPassword),
		filter((action) => {
			const isEditPassword = action['isEdit'];
			return isEditPassword
		}),
		withLatestFrom(this.store),
		exhaustMap(([action, store]) => {
			const password = action['password'];
			const userDetails = store.user.userLogin.loggedInUser
			const payload = {
				password,
				first_name: userDetails.firstName,
				last_name: userDetails.lastName,
				contact_number: {
					phone_number: userDetails.contactNumber.phoneNumber,
					extension: userDetails.contactNumber.extension,
					type: userDetails.contactNumber.type
				}
			} as ServerUserRegistrationInputInterface
			return this.signUpService.editUserProfile(payload).pipe(
				map((response) => new actionsSignUP.SetNewPasswordSuccess()),
				catchError(error => of(new actionsSignUP.SetNewPasswordFailure()))
			)
		})
	)

	/**
	 * Reset user login failure
	 */
	@Effect()
	loadSignInPage = this.actions.pipe(
		filter(action =>
			action.type === '@ngrx/router-store/navigated'
			|| action.type === GlobalActionsTypes.AppInitialLoadSuccess),
		withLatestFrom(this.store),
		filter(([action, state]) => {
			const currentRoute = state.router.state.url;
			const isSignInRoute = userRouterEffectUtil.isUserOnCorrectPage(currentRoute, 'sign-in');
			const isLoginFailure = state.user.userLogin.loginFailure !== null ? true : false;
			// const logFail = state.user.userLogin.loginFailure;
			return isSignInRoute && isLoginFailure
		}),
		map(([action, state]) => {
			return new actionsSignUP.ResetFormValidation();
		})
	)

	/**
	 * Redirect to homepage if user logs in and lands up on sign up form
	 */
	@Effect({ dispatch: false })
	signUpRedirectToHomepage = this.actions.pipe(
		filter(action =>
			action.type === '@ngrx/router-store/navigated'
			|| action.type === GlobalActionsTypes.AppInitialLoadSuccess),
		withLatestFrom(this.store),
		filter(([action, state]) => {
			const currentRoute = state.router.state.url;
			const isSignUpRoute = userRouterEffectUtil.isUserOnCorrectPage(currentRoute, 'sign-up');
			const isNewUser = state.user.userLogin.isNewUser
			// const logFail = state.user.userLogin.loginFailure;
			return isSignUpRoute && !isNewUser
		}),
		map(([action, state]) => {
			this.router.navigate([''])
		})
	)


	/**
	 * Redirect to coupon wallet if on sign in page and logged in
	 */
	@Effect({ dispatch: false })
	signInRedirectToCouponWallet = this.actions.pipe(
		filter(action =>
			action.type === '@ngrx/router-store/navigated'
			|| action.type === GlobalActionsTypes.AppInitialLoadSuccess),
		withLatestFrom(this.store),
		filter(([action, state]) => {
			const currentRoute = state.router.state.url;
			const isSignUpRoute = userRouterEffectUtil.isUserOnCorrectPage(currentRoute, 'sign-in');
			const deeplinkCoupon = state.common.couponWallet.deeplinkCoupon
			const user = state.user.userLogin.loggedInUser;
			return isSignUpRoute && deeplinkCoupon !== null && user !== null
		}),
		map(([action, state]) => {
			const isUserClub1111Member = state.user.userLogin.loggedInUser && state.user.userLogin.loggedInUser.isClubElevenElevenMember;

			const deeplinkCoupon = state.common.couponWallet.deeplinkCoupon;
			const link = isUserClub1111Member ? '/user/club-eleven-eleven/loyalty' : '/user/club-eleven-eleven';
			this.router.navigate([link], { queryParams: { coupon: deeplinkCoupon } })
		})
	)

	/**
	 * Redirect to homepage if anomonous user attempts to access user specific pages
	 */
	@Effect({ dispatch: false })
	notLoggedInpRedirectToHomepage = this.actions.pipe(
		filter(action => action.type === '@ngrx/router-store/navigated'
			|| action.type === actionsSignUP.SignUpActionTypes.GetUserSummaryFailure),
		withLatestFrom(this.store),
		filter(([action, state]) => {
			const currentRoute = state.router.state.url;
			const isAccountRoute = userRouterEffectUtil.isUserOnCorrectPage(currentRoute, 'account');
			const isOrderHistoryRoute = userRouterEffectUtil.isUserOnCorrectPage(currentRoute, 'order-history');
			const isRepeatLastOrderRoute = userRouterEffectUtil.isUserOnCorrectPage(currentRoute, 'repeat-last-order');
			const logFailOnNavigate = !state.user.userLogin.loggedInUser && state.user.userLogin.isFetched && !state.user.userLogin.isLoading;
			const logFailOnNavigatAlt = !state.user.userLogin.loggedInUser && !state.user.userLogin.isFetched && !state.user.userLogin.isLoading;

			return (logFailOnNavigate || logFailOnNavigatAlt) && (isAccountRoute || isOrderHistoryRoute || isRepeatLastOrderRoute)
		}),
		map(([action, state]) => {
			this.router.navigate([''])
		})
	)

	/**
	 * Reset deeplink coupon on navigation
	 */
	@Effect()
	clearDeeplinkCoupon = this.actions.pipe(
		filter(action =>
			action.type === '@ngrx/router-store/navigated'),
		withLatestFrom(this.store),
		filter(([action, state]) => {
			const currentRoute = state.router.state.url;
			const isSignInRoute = userRouterEffectUtil.isUserOnCorrectPage(currentRoute, 'sign-in');
			const isSignUpRoute = userRouterEffectUtil.isUserOnCorrectPage(currentRoute, 'sign-up');
			const isDeepLinkCoupon = state.common.couponWallet.deeplinkCoupon
			return !isSignInRoute && !isSignUpRoute && isDeepLinkCoupon !== null
		}),
		map(([action, state]) => {
			return new ClearCouponWallet();
		})
	)

	constructor(
		private actions: Actions,
		private signUpService: SignUpService,
		private store: Store<State>,
		private router: Router,
		private location: Location,
		private applicationHttpClient: ApplicationHttpClient
	) { }
}


