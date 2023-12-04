import { Injectable } from '@angular/core';

import {
	HttpInterceptor,
	HttpHandler,
	HttpRequest,
	HttpEvent,
	HttpErrorResponse
} from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { Store } from '@ngrx/store';
import * as fromCommon from '../app/common/reducers';
import { RateLimitReached } from '../app/common/actions/global';

@Injectable()
export class ApplicationHttpErrors implements HttpInterceptor {

	private SHOW_GLOBAL_ERROR_CODES = [429];

	constructor(
		private store: Store<fromCommon.State>
	) { }

	/**
	 * Check if HTTP code
	 */
	private handleOnRequest(event) {
		const httpCode = event.status;
		const isGlobalErrorForCode = this.SHOW_GLOBAL_ERROR_CODES.indexOf(httpCode) !== -1;
		if (isGlobalErrorForCode) {
			this.store.dispatch(new RateLimitReached());
		}
	}

	/**
	 * Middleware for checking all HTTP codes.
	 * Dispatches NGRX action if any call returns 429
	 */
	intercept(
		req: HttpRequest<{}>,
		next: HttpHandler
	): Observable<HttpEvent<{}>> {
		return next.handle(req).pipe(
			map((event: HttpEvent<{}>) => {
				this.handleOnRequest(event);
				return event;
			}),
			catchError((error: HttpErrorResponse) => {
				this.handleOnRequest(error);
				return throwError(error);
			})
		);

	}
}
