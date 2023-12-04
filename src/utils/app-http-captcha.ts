import { Injectable } from '@angular/core';
import {
	HttpEvent, HttpInterceptor, HttpHandler, HttpRequest
} from '@angular/common/http';

import { ReCaptchaV3Service } from 'ng-recaptcha';

import { Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';


// Config dictates which methods needs to have captcha
const captchaProtectedMethods = require('../../src-web-mw/config-captcha-paths');


@Injectable()
export class ApplicationHttpCaptcha implements HttpInterceptor {

	protectedMethodsDict = {};

	/**
	 * Creates a dict of path-method to avoid search by 2 values on every request
	 */
	constructor(
		private recaptchaV3Service: ReCaptchaV3Service
	) {
		captchaProtectedMethods.forEach(value => {
			this.protectedMethodsDict[`${value.method}_${value.path}`] = value.action;
		})
	}

	/**
	 * Middleware for adding silent captcha fot methods defined in the config
	 * @param req - Request issues by http client
	 * @param next
	 */
	intercept(req: HttpRequest<{}>, next: HttpHandler): Observable<HttpEvent<{}>> {
		const methodPath = `${req.method}_${req.url.replace('/ajax/', '')}`

		if (methodPath in this.protectedMethodsDict) {
			const captchaAction = this.protectedMethodsDict[methodPath];
			return this.recaptchaV3Service.execute(captchaAction)
				.pipe(
					mergeMap(token => {
						req.body['token'] = token;
						return next.handle(req);
					})
				)
		} else {
			return next.handle(req);
		}

		// send the cloned, "secure" request to the next handler.
	}
}
