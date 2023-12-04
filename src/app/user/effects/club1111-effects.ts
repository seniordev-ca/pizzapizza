// Angular Core
import { Injectable } from '@angular/core';

// NGRX
import { Store } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { map, catchError, exhaustMap, filter, withLatestFrom, flatMap } from 'rxjs/operators';
import { of } from 'rxjs';

// Router Util
import { userRouterEffectUtil } from '../user.routes';

// Models
import { State } from '../../root-reducer/root-reducer';

// Services
import { SignUpService } from '../services/sign-up-service';
import { Club11Service } from '../services/club11-services';

// Actions
import { SignUpActionTypes } from '../actions/sign-up-actions';
import {
	Club1111ActionTypes,

	RegisterNewClub111UserSuccess,
	RegisterNewUClub111UserFailure,

	FetchClub11AccountBalance,
	FetchClub11AccountBalanceSuccess,
	FetchClub11AccountBalanceFailure,

	FetchClubTransactionHistory,
	FetchClubTransactionHistorySuccess,
	FetchClubTransactionHistoryFailure,

	UpdateClub1111UserInfoSuccess,
	UpdateClub1111UserInfoFailed,
	FetchClub11CardBalanceSuccess,
	FetchClub11CardBalanceFailure,
	TransferCardBalanceSuccess,
	TransferCardBalanceFailure,
	DeleteClubCardSuccess,
	DeleteClubCardFailure,
	FetchClub1111AddFundsSettingsSuccess,
	FetchClub1111AddFundsSettingsFailure,
	AddClub1111FundsRequestSuccess,
	AddClub1111FundsRequestFailure,
	FetchClub1111AutoReloadSettingsSuccess,
	FetchClub1111AutoReloadSettingsFailure,
	RemoveAutoReloadClub1111Success,
	RemoveAutoReloadClub1111Failure,
	SendClubCardNumberSuccess,
	SendClubCardNumberFailure
} from '../actions/club1111-actions';
import {
	ServerTransferBalanceRequest,
	ServerClub111AddFundsRequest,
	ServerClub1111AutoReloadSettings
} from '../models/server-models/server-club11';
import { Router } from '@angular/router';
import { Club1111AddFundsUIInterface, Club1111AutoReloadSettingsUIInterface } from '../models/club11';
import { ApplicationHttpClient } from '../../../utils/app-http-client';
import { RequestSavedCards } from '../actions/account-actions';
import { LocalStorageService } from 'app/common/services/local-storage';
import { UpdateDataLayer, CommonUseUpdateDataLayer } from 'app/common/actions/tag-manager';


@Injectable()
export class Club1111Effects {

	/**
	 * IF user profile club11 activated for profile
	 * 	Fetch user club balance
	 */
	@Effect()
	fetchClub11Balance = this.actions.pipe(
		filter(
			action => action.type === SignUpActionTypes.GetUserSummarySuccess ||
				action.type === Club1111ActionTypes.RegisterNewClub111UserSuccess ||
				action.type === SignUpActionTypes.RegisterNewUserSuccess),
		withLatestFrom(this.store),
		filter(([action, state]) => {
			const isClub11Member = state.user.userLogin.loggedInUser.isClubElevenElevenMember;
			let userHasClubToken = false;
			try {
				userHasClubToken = action['userDetails']['loyalty_card_token'] !== null;
			} catch (e) {
				console.error(e);
				return false;
			}
			return isClub11Member && userHasClubToken;
		}),
		map(([action, state]) => {
			const cardToken = action['userDetails']['loyalty_card_token'];
			return new FetchClub11AccountBalance(cardToken);
		})
	)


	/**
	 * IF user logging in and is club 11/11 memeber THAN fetch balance
	 */
	@Effect()
	fetchClubBalanceOnLoginIn = this.actions.pipe(
		ofType(SignUpActionTypes.UserLoginSuccess),
		filter((action) => {
			let isCLubMember = false;
			try {
				isCLubMember = action['userDetails']['club_11_11_member']
			} catch (e) {
				console.error(e);
			}
			return isCLubMember;
		}),
		map((action) => {
			const cardToken = action['userDetails']['loyalty_card_token'];
			return new FetchClub11AccountBalance(cardToken);
		})
	)

	/**
	 * Fetch club 11 balance
	 */
	@Effect()
	fetchClubBalance = this.actions.pipe(
		ofType(Club1111ActionTypes.FetchClub11AccountBalance),
		exhaustMap((action) => {
			const cardToken = action['cardToken'];
			return this.club11Service.fetchClub11Balance(cardToken).pipe(
				map((response) => {
					return new FetchClub11AccountBalanceSuccess(response)
				}),
				catchError(error => {
					return of(new FetchClub11AccountBalanceFailure())
				})
			)
		})
	)

	/**
	 * Register New User
	 */
	@Effect()
	registerNewClub111User = this.actions.pipe(
		ofType(Club1111ActionTypes.RegisterNewClub1111User),
		exhaustMap((action) => {
			const payload = action['registarationRequestPayload'];
			return this.signUpService.registerNewClubUser(payload).pipe(
				map((response) => {
					// this.location.back()
					return new RegisterNewClub111UserSuccess(response)
				}),
				catchError(error => {
					return of(new RegisterNewUClub111UserFailure(error.error))
				})
			)
		})
	)

	/**
	 * Update Club 1111 User
	 */
	@Effect()
	updateClub111User = this.actions.pipe(
		ofType(Club1111ActionTypes.UpdateClub1111UserInfo),
		exhaustMap((action) => {
			const payload = action['registarationRequestPayload'];
			return this.signUpService.updateClubUser(payload).pipe(
				map((response) => {
					return new UpdateClub1111UserInfoSuccess(response)
				}),
				catchError(error => {
					return of(new UpdateClub1111UserInfoFailed(error.error))
				})
			)
		})
	)

	/**
	 * IF user on transaction history page
	 */
	@Effect()
	renderTransactionHistory = this.actions.pipe(
		filter(action =>
			action.type === '@ngrx/router-store/navigated'
			|| action.type === SignUpActionTypes.GetUserSummarySuccess),
		withLatestFrom(this.store),
		filter(([action, state]) => {
			const isUserAuthenticated = state.user.userLogin.isJwtValid;
			const currentUrl = state.router.state.url;
			const isUserOnTransactionPage = userRouterEffectUtil.isUserOnClubTransactionPage(currentUrl);

			return isUserAuthenticated && isUserOnTransactionPage;
		}),
		map(([action, state]) => {
			const cardToken = state.user.userClub1111.clubCardToken;
			return new FetchClubTransactionHistory(cardToken);
		})
	)

	/**
	 * Fetch transaction history for club 11
	 */
	@Effect()
	fetchTransactionHistory = this.actions.pipe(
		ofType(Club1111ActionTypes.FetchClubTransactionHistory),
		withLatestFrom(this.store),
		exhaustMap(([action, state]) => {
			const club11Token = state.user.userClub1111.clubCardToken;

			return this.club11Service.fetchClub11Transactions(club11Token).pipe(
				map((response) => {
					return new FetchClubTransactionHistorySuccess(response)
				}),
				catchError(error => {
					return of(new FetchClubTransactionHistoryFailure())
				})
			)

		})
	)

	/**
	 * Fetch Card Balance For Transfer
	 */
	@Effect()
	fetchClub11CardBalance = this.actions.pipe(
		ofType(Club1111ActionTypes.FetchClub11CardBalance),
		exhaustMap(action => {
			const cardNumber = action['cardNumber'];
			const cardPin = action['cardPin'];
			return this.club11Service.fetchClubBalanceViaNumber(cardNumber, cardPin).pipe(
				map(response => new FetchClub11CardBalanceSuccess(response)),
				catchError(error => of(new FetchClub11CardBalanceFailure(error.error)))
			)
		})
	)

	/**
	 * Transfer Card Balance
	 */
	@Effect()
	transferCardBalance = this.actions.pipe(
		ofType(Club1111ActionTypes.TransferCardBalance),
		withLatestFrom(this.store),
		exhaustMap(([action, store]) => {
			const clubToken = store.user.userClub1111.clubCardToken;
			const requestToken = store.user.userClub1111.transferCardDetails.card_balance_token;
			const request = action['transferRequest'] as ServerTransferBalanceRequest
			request.loyalty_card_token = clubToken;
			request.card_balance_token = requestToken;
			return this.club11Service.transferCardBalance(request).pipe(
				map(response => new TransferCardBalanceSuccess(response)),
				catchError(error => of(new TransferCardBalanceFailure(error.error)))
			)
		})
	)

	/**
	 * Delete Club 11 11 from Account
	 */
	@Effect()
	deleteClubCard = this.actions.pipe(
		ofType(Club1111ActionTypes.DeleteClubCard),
		exhaustMap(action => this.club11Service.deleteClubCard().pipe(
			map(response => new DeleteClubCardSuccess()),
			catchError(error => of(new DeleteClubCardFailure()))
		))
	)

	/**
	 * If User navigates to loyalty page and is not a user we should redirect them
	 */
	@Effect({ dispatch: false })
	redirectIfUserIsNotLoyalty = this.actions.pipe(
		filter(action => action.type === '@ngrx/router-store/navigated' ||
			action.type === Club1111ActionTypes.DeleteClubCardSuccess
			|| action.type === SignUpActionTypes.GetUserSummarySuccess),
		withLatestFrom(this.store),
		filter(([action, store]) => {
			const currentUrl = store.router.state.url;
			const isParentPage = userRouterEffectUtil.isUserOnCorrectPage(currentUrl, '/user/club-eleven-eleven')
			const isLoyatyPage = userRouterEffectUtil.isUserOnCorrectPage(currentUrl, '/user/club-eleven-eleven/loyalty')
			return isLoyatyPage || isParentPage
		}),
		map(([action, store]) => {
			const currentUrl = store.router.state.url;

			const isUserLoggedIn = store.user.userLogin.isJwtValid;
			const isUserClub1111 = isUserLoggedIn ? store.user.userLogin.loggedInUser.isClubElevenElevenMember : null;
			const isParentPage = userRouterEffectUtil.isUserOnCorrectPage(currentUrl, '/user/club-eleven-eleven')
			const isLoyatyPage = userRouterEffectUtil.isUserOnCorrectPage(currentUrl, '/user/club-eleven-eleven/loyalty')
			if (isUserClub1111 && isParentPage) {
				this.router.navigate(['/user/club-eleven-eleven/loyalty'])
			} else if (!isUserClub1111 && isLoyatyPage) {
				this.router.navigate(['/user/club-eleven-eleven'])
			}
		})
	)

	/**
	 * Fetch Add Funds Settings
	 */
	@Effect()
	fetchAddFundsSettings = this.actions.pipe(
		ofType(Club1111ActionTypes.FetchClub11AccountBalanceSuccess),
		withLatestFrom(this.store),
		filter(([action, store]) => {
			const isSettingsFetched = store.user.userClub1111.addFundsSettings
			return !isSettingsFetched;
		}),
		exhaustMap(() => this.club11Service.fetchAddFundsSettings().pipe(
			map(response => new FetchClub1111AddFundsSettingsSuccess(response)),
			catchError(error => of(new FetchClub1111AddFundsSettingsFailure()))
		))
	)

	/**
	 * Fetch Auto Reload Settings
	 */
	@Effect()
	fetchAutoReloadSettings = this.actions.pipe(
		ofType(Club1111ActionTypes.FetchClub1111AddFundsSettingsSuccess),
		withLatestFrom(this.store),
		filter(([action, store]) => {
			const isSettingsFetched = store.user.userClub1111.autoReloadDetails
			return !isSettingsFetched;
		}),
		exhaustMap(() => this.club11Service.fetchAutoReloadSettings().pipe(
			map(response => new FetchClub1111AutoReloadSettingsSuccess(response)), // happens when just signed in or reload page with club 11 11
			catchError(error => of(new FetchClub1111AutoReloadSettingsFailure(error.error)))
		))
	)

	/**
	 * Add funds request
	 */
	@Effect()
	addFundsToClub = this.actions.pipe(
		ofType(Club1111ActionTypes.AddClub1111FundsRequest),
		filter(action => !action['isAutoReload']),
		withLatestFrom(this.store),
		exhaustMap(([action, store]) => {
			const clubToken = store.user.userClub1111.clubCardToken;
			const request = action['uiRequest'] as Club1111AddFundsUIInterface;
			const serverRequest = {
				amount: request.amount,
				payment_data: {
					token: request.token,
					name: request.name
				},
				loyalty_card_token: clubToken,
				email: request.email
			} as ServerClub111AddFundsRequest
			return this.club11Service.addClubFunds(serverRequest).pipe(
				map(response => {
					return new AddClub1111FundsRequestSuccess(response, serverRequest.amount)
				}),
				catchError(error => of(new AddClub1111FundsRequestFailure()))
			)
		})
	)

	/**
	 * Add Automatic Reload option
	 */
	@Effect()
	autoReloadFundsToClub = this.actions.pipe(
		ofType(Club1111ActionTypes.AddClub1111FundsRequest),
		filter(action => action['isAutoReload']),
		withLatestFrom(this.store),
		exhaustMap(([action, store]) => {
			const clubToken = store.user.userClub1111.clubCardToken;
			const request = action['uiRequest'] as Club1111AutoReloadSettingsUIInterface;
			const serverRequest = {
				amount: request.amount,
				payment_data: {
					token: request.token,
					name: request.name
				},
				loyalty_card_token: clubToken,
				email: request.email,
				frequency: request.frequency,
				type: request.type,
				enabled: request.enabled
			} as ServerClub1111AutoReloadSettings
			if (request.thresholdAmount) {
				serverRequest.threshold_amount = Number(request.thresholdAmount)
			}
			return this.club11Service.autoReloadClubFunds(serverRequest).pipe( // happens when we set up new auto reload
				flatMap(response => [new FetchClub1111AutoReloadSettingsSuccess(serverRequest),
				new CommonUseUpdateDataLayer('autoreload', 'Club 11/11', 'Automatic Reloads', request.frequency)]),
				catchError(error => of(new FetchClub1111AutoReloadSettingsFailure(error.error)))
			)
		})
	)

	@Effect()
	removeAutoReload = this.actions.pipe(
		ofType(Club1111ActionTypes.RemoveAutoReloadClub1111),
		exhaustMap(action => {
			const serverRequest = {
				enabled: false
			}
			return this.club11Service.autoReloadClubFundsDelete().pipe(
				map(response => new RemoveAutoReloadClub1111Success(response)),
				catchError(() => of(new RemoveAutoReloadClub1111Failure()))
			)
		})
	)

	@Effect()
	fetchUserCardsOnAutoReload = this.actions.pipe(
		ofType(Club1111ActionTypes.FetchClub1111AutoReloadSettingsSuccess),
		map(() => new RequestSavedCards())
	)

	@Effect()
	sendClubNumber = this.actions.pipe(
		ofType(Club1111ActionTypes.SendClubCardNumber),
		exhaustMap(() => this.club11Service.sendClubNumber().pipe(
			map(response => new SendClubCardNumberSuccess()),
			catchError(() => of(new SendClubCardNumberFailure()))
		))
	)

	constructor(
		private actions: Actions,
		private signUpService: SignUpService,
		private club11Service: Club11Service,
		private store: Store<State>,
		private router: Router,
		private localStorageService: LocalStorageService
	) { }
}
