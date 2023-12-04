import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApplicationHttpClient } from '../../../utils/app-http-client';
import { ApplicationSessionsStorage } from '../../../utils/app-session-storage';
import { ApplicationCookieClient } from '../../../utils/app-cookie-client';

import {
	ServerUserRegistrationInputInterface,
	ServerLoginRequestInterface,
	ServerLoginResponseInterface,
	ServerClub1111RegistrationInterface,
	ServerClub1111PrefillInterface,
	ServerClub1111RegistrationResponse
} from '../models/server-models/server-user-registration-input';

import { ServerUpdateAddressResponse } from '../models/server-models/server-account-interfaces';
import { map } from 'rxjs/operators';

/**
 * SignUpService - Fetching the Data for user Registration
 */
@Injectable()
export class SignUpService {
	constructor(
		private appHttp: ApplicationHttpClient,
		private appCookies: ApplicationCookieClient,
		private appSession: ApplicationSessionsStorage
	) { }

	/**
 	* Register New User
	*/
	registerNewUser(payload: ServerUserRegistrationInputInterface): Observable<ServerLoginResponseInterface> {
		const apiPath = 'user/api/v1/register';
		return this.appHttp.post<ServerLoginResponseInterface>(apiPath, payload);
	}

	/**
 	* Register New Club 1111 User
	*/
	registerNewClubUser(payload: ServerClub1111RegistrationInterface): Observable<ServerClub1111RegistrationResponse> {
		const apiPath = 'user/api/v1/club_11_11/';
		return this.appHttp.post<ServerClub1111RegistrationResponse>(apiPath, payload).pipe(
			map(response => {
				if (!response.success) {
					throw new Error('Failed')
				} else {
					return response
				}
			})
		);
	}

	/**
 	* Update Club 1111 User
	*/
	updateClubUser(payload: ServerClub1111RegistrationInterface): Observable<ServerUpdateAddressResponse> {
		const apiPath = 'user/api/v1/club_11_11/';
		return this.appHttp.put<ServerUpdateAddressResponse>(apiPath, payload);
	}

	/**
	 * User Login
	 */
	userLogin(payload: ServerLoginRequestInterface): Observable<ServerLoginResponseInterface> {
		const apiPath = 'user/api/v1/auth/login';
		return this.appHttp.post<ServerLoginResponseInterface>(apiPath, payload);
	}

	/**
	 * Get User
	 */
	getUser(): Observable<ServerLoginResponseInterface> {
		const apiPath = 'user/api/v1/summary';
		return this.appHttp.get<ServerLoginResponseInterface>(apiPath);
	}


	/**
	 * Checking local storage if club 11 banner was shown to user withing the browser session
	 */
	isClubBannerShown() {
		return this.appCookies.get('isClubBannerShown') as boolean;
	}

	/**
	 * Sets local storage club banner visibility flag
	 */
	setClubBannerAsShown() {
		this.appCookies.set('isClubBannerShown', true);
	}

	/**
	 * Save Tokens to local Storage
	 */
	saveTokens(response: ServerLoginResponseInterface) {
		// Current unix time
		const fetchTime = Math.round(new Date().getTime() / 1000);

		this.appSession.set('accessToken', response.access_token);
		this.appSession.set('refreshToken', response.refresh_token);
		this.appSession.set('expiresInSec', response.expires_in);
		this.appSession.set('fetchTime', fetchTime);

		return null;
	}

	/**
	 * Remove Tokens from local Storage
	 */
	removeTokens() {
		this.appSession.deleteKey('accessToken');
		this.appSession.deleteKey('refreshToken');
		return null;
	}

	/**
	 * Check if Tokens are in storage
	 */
	tokensExist() {
		if (this.appSession.exists('accessToken')) {
			return true;
		}
	}

	/**
	 * Get User Profile
	 */
	getUserProfile() {
		const apiPath = 'user/api/v1/profile';
		return this.appHttp.get<ServerLoginResponseInterface>(apiPath);
	}

	/**
	 * Edit User Profile
	 */
	editUserProfile(payload: ServerUserRegistrationInputInterface) {
		const apiPath = 'user/api/v1/profile';

		return this.appHttp.put<ServerLoginResponseInterface>(apiPath, payload);
	}

	/**
	 * Send Reset Password Email
	 */
	sendResetEmail(username: string) {
		const apiPath = 'user/api/v1/forgot_password/send_email/';
		const body = {
			username
		}
		return this.appHttp.post(apiPath, body);
	}

	/**
	 * Reset User Password
	 */
	resetUserPassword(password: string, payload: string) {
		const apiPath = 'user/api/v1/forgot_password/set_new_password/';
		const body = {
			new_password: password,
			payload
		}
		return this.appHttp.post(apiPath, body)
	}

	/**
	 * Fetch Prefill
	 */
	fetchClub11Prefill() {
		const methodPath = 'user/api/v1/club_11_11/prefill_info';
		return this.appHttp.get<ServerClub1111PrefillInterface>(methodPath)
	}
}
