import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';


@Injectable()
export class ApplicationSessionsStorage {

	private isSessionStorageAvail = false;
	private sessionStorageEmulator = {};

	/**
	 * The session data would be saved to js runtime memory if
	 * session storage is not accessible.
	 */
	constructor(@Inject(PLATFORM_ID) private platformId: Object) {
		this.isSessionStorageAvail = typeof sessionStorage === 'object' && 'setItem' in sessionStorage;
	}

	/**
	 * Sets local storage
	 */
	public set(key: string, value: string | number | boolean | Object | Array<Object> | Array<Number> | Array<String>) {
		if (isPlatformBrowser(this.platformId)) {
			if (this.isSessionStorageAvail) {
				sessionStorage.setItem(key, JSON.stringify(value));
			} else {
				this.sessionStorageEmulator[key] = JSON.stringify(value);
			}
		}
	}

	/**
	 * Gets local storage
	 */
	public get(key: string): string | number | boolean | Object | Array<Object> | Array<Number> | Array<String> | null {
		if (!isPlatformBrowser(this.platformId)) {
			return null;
		}

		if (this.isSessionStorageAvail) {
			const value = sessionStorage.getItem(key);
			return JSON.parse(value);
		} else {
			const value = this.sessionStorageEmulator[key];
			return JSON.parse(value);

		}
	}

	/**
	 * Check to see if item exists in local storage
	 */
	public exists(key): boolean {
		if (!isPlatformBrowser(this.platformId)) {
			return false;
		}

		if (this.isSessionStorageAvail) {
			return Boolean(sessionStorage.getItem(key));
		} else {
			return Boolean(key in this.sessionStorageEmulator);
		}
	}

	/**
	 * Removes value from local storage
	 */
	public deleteKey(key: string) {
		if (!isPlatformBrowser(this.platformId)) {
			return null;
		}
		if (this.isSessionStorageAvail) {
			sessionStorage.removeItem(key);
		} else {
			delete this.sessionStorageEmulator;
		}
	}

}
