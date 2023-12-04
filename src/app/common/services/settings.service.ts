// Angular Core
import {
	Injectable,
	Inject,
	PLATFORM_ID
} from '@angular/core';

// Helpers for universal rendering
import { isPlatformBrowser } from '@angular/common';

// Reactive operators
import { Observable, of } from 'rxjs';

// Utils
import { ApplicationHttpClient } from '../../../utils/app-http-client';
import { AppSdkService } from '../../../utils/app-sdk'
import { AppKumulosService } from '../../../utils/app-kumulos';
// Models
import { AppSettingsInterface } from '../models/server-app-settings'
import { ApplicationCookieClient } from 'utils/app-cookie-client';


/**
 * Global application service consumer
 */
@Injectable()
export class SettingsService {

	private isBrowser: boolean;
	constructor(
		private appHttp: ApplicationHttpClient,
		@Inject(PLATFORM_ID) platformId,
		private appCookies: ApplicationCookieClient
	) {
		this.isBrowser = isPlatformBrowser(platformId);
	}

	/**
	 * Application global settings
	 */
	getAppSetting(): Observable<AppSettingsInterface> {
		// console.log('fetch settings');
		const methodPath = 'application/api/v1/config/';
		return this.appHttp.get<AppSettingsInterface>(methodPath)
	}

	/**
	 * Create observable of sdk service for effect
	 */
	loadSdk(url: string): Observable<boolean> {
		const windowKey = 'ppSdk';
		return AppSdkService.loadScript(url, windowKey, this.isBrowser);
	}

	/**
	 * Create observable of kumulos sdk service for effect
	 */
	loadKumulos(configKeys): Observable<boolean> {
		return AppKumulosService.loadScript(this.isBrowser, configKeys);
	}

	/**
	 * Create observable of kumulos getID for effect
	 */
	fetchKumulosId(): Observable<string> {
		return AppKumulosService.getInstallId();
	}

	/**
	 * Set Kumulos Id as Cookie
	 */
	setKumulosIdAsCookie(id) {
		this.appCookies.set('kumulosID', id)
	}
}

