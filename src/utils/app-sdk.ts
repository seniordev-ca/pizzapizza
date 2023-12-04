import {
	Injectable,
	Inject,
	PLATFORM_ID
} from '@angular/core';
import { TransferState, makeStateKey } from '@angular/platform-browser';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { Store, select } from '@ngrx/store';
import { Observable, BehaviorSubject, Observer } from 'rxjs';

import { AppSettingsInterface } from '../app/common/models/server-app-settings';
import { SdkResponse } from '../app/catalog/models/server-sdk';
import { ServerProductConfig } from '../app/catalog/models/server-product-config';
import { AddCartServerRequestInterface } from '../app/checkout/models/server-cart-request';

/* tslint:disable:no-any */
declare var ppSdk: any;

@Injectable()
export class AppSdkService {

	/**
	 * Load script.
	 * Supports client and server implementation
	 */
	static loadScript(sdkURl: string, windowKey: string, isBrowser: boolean): Observable<boolean> {
		// const isBrowser = isPlatformBrowser(platformId);
		// const loadScriptResult: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
		return new Observable<boolean>((observer: Observer<boolean>) => {
			const createScriptDOM = () => {
				// Create script DOM with URL and emits status on script load
				if (!window[windowKey]) {
					window[windowKey] = {};
					const script = document.createElement('script');

					script.type = 'text/javascript';
					// TODO fix issue with google static files hashing
					script.src = `${sdkURl}`;
					script.id = windowKey;
					document.head.appendChild(script);

					script.onload = () => {
						observer.next(true);
						observer.complete();
					};

					script.onerror = () => {
						observer.next(false);
						observer.complete();
					};
				}
			}

			const loadServerSDK = () => {
				observer.next(true);
				observer.complete();
			}

			// Check runtime environment
			if (isBrowser) {
				createScriptDOM();
			} else {
				loadServerSDK();
			}
		});
		// return loadScriptResult.asObservable();
	}

	/**
	 * Call sdk initProduct
	 */
	static initProduct(productConfig: ServerProductConfig, device: string, language: string) {
		return ppSdk.initProduct(productConfig, device, language.substring(0, 2));
	}

	/**
	 * Call sdk getProductInfo
	 */
	static getProductInfo(addToCartRequest: AddCartServerRequestInterface) {
		return ppSdk.getProductInfo(addToCartRequest);
	}

}
