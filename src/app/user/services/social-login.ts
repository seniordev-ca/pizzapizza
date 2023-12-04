// Core
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

// Utils
import { ApplicationHttpClient } from '../../../utils/app-http-client';
import { ApplicationLocalStorageClient } from '../../../utils/app-localstorage-client';

// Models
import {
	ServerLoginResponseInterface
} from '../models/server-models/server-user-registration-input';


/**
 * SignUpService - Fetching the Data for user Registration
 */
@Injectable()
export class SocialLoginService {
	constructor(
		private appHttp: ApplicationHttpClient,
		private appCookies: ApplicationLocalStorageClient,

	) { }

	/**
 	* Register New User
	*/
	registerUsingFb(authToken): Observable<ServerLoginResponseInterface> {
		const payload = {
			'access_token': authToken,
			'platform': 'facebook'
		};
		const apiPath = 'user/api/v1/social/auth/';
		return this.appHttp.post<ServerLoginResponseInterface>(apiPath, payload);
	}

	/**
 	* Register New User
	*/
	registerUsingGoogle(authToken): Observable<ServerLoginResponseInterface> {
		const payload = {
			'access_token': authToken,
			'platform': 'google'
		};
		const apiPath = 'user/api/v1/social/auth/';
		return this.appHttp.post<ServerLoginResponseInterface>(apiPath, payload);
	}
}
