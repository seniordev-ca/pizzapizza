import { Injectable } from '@angular/core';
import { ApplicationLocalStorageClient } from '../../../utils/app-localstorage-client'

/**
 * Configurator http service
 */
@Injectable()
export class LocalStorageService {
	constructor(
		private appCookies: ApplicationLocalStorageClient
	) { }

	/**
	 * Set flag
	 */
	setFlag(flag: string, value: boolean) {
		let uiFlagsObject = JSON.stringify({});
		const isUiFlagObjectExists = this.appCookies.exists('uiFlags');
		if (isUiFlagObjectExists) {
			uiFlagsObject = JSON.stringify(this.appCookies.get('uiFlags'));
		}
		uiFlagsObject = JSON.parse(uiFlagsObject);
		uiFlagsObject[flag] = value;
		this.appCookies.set('uiFlags', uiFlagsObject)
	}

	/**
	 * Get Upsizing Flag
	 */
	getFlag(flag: string) {
		const isUiFlagObjectExists = this.appCookies.exists('uiFlags');
		if (!isUiFlagObjectExists) {
			return false;
		}
		let uiFlagsObject = JSON.stringify(this.appCookies.get('uiFlags'));
		uiFlagsObject = JSON.parse(uiFlagsObject);
		return uiFlagsObject[flag]
	}
}
