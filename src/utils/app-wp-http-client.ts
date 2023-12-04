// Angular Core
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
// Reactive operators
import { Observable, of, throwError } from 'rxjs';
import { mergeMap, catchError, retryWhen, take } from 'rxjs/operators';


// Local storage service
import { ApplicationLocalStorageClient } from './app-localstorage-client';

// Request options interface
interface IRequestOptions {
	headers?: HttpHeaders;
	observe?: 'body';
	params?: HttpParams;
	reportProgress?: boolean;
	responseType?: 'json';
	withCredentials?: boolean;
	body?: Object;
}

@Injectable()
export class ApplicationWPHttpClient {

	private NO_RETRY_STATUS_CODES = [400, 401, 403];

	// Extending the HttpClient through the Angular DI.
	public constructor(
		public http: HttpClient,
		// @Optional() @Inject(APP_BASE_HREF) origin: string
	) {}

	/**
	 * If we need to set headers at some point
	 */
	private _getRequestHeader() {
		const options = {} as IRequestOptions;
		const commonHttpHeader = new HttpHeaders();

		options.headers = commonHttpHeader;
		return options;
	}
	/**
	 * GET request
	 */
	public get<ServerModel>(endPoint: string, params?: string | Object): Observable<ServerModel> {

		const options = this._getRequestHeader();
		let fullUrl = endPoint;
		let urlParams = '';

		// console.log('GET request');
		// console.log(fullUrl);

		// Build GET params string
		if (params && typeof params === 'string') {
			urlParams = params;
		} else if (params && typeof params === 'object') {
			urlParams = '?';
			const queryString = [];
			for (const key in params) {
				if (key) {
					queryString.push(key + '=' + params[key])
				}
			}
			urlParams += queryString.join('&');
		}
		fullUrl += urlParams;

		return this.http.get<ServerModel>(fullUrl, options).pipe(
			retryWhen(error => error.pipe(
				mergeMap((httpResponse) => {
					if (!httpResponse.ok) {
						return throwError(httpResponse);
					}
					const isHttpCodeInRetryList = this.NO_RETRY_STATUS_CODES.indexOf(httpResponse.status) > -1;
					return isHttpCodeInRetryList ? throwError(httpResponse) : of(httpResponse)
				}
				)
			))
		);
	}


}

/**
 * Http proxy client creator
 */
export function applicationWPHttpClientCreator(
	http: HttpClient,
) {
	return new ApplicationWPHttpClient(http);
}
