import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable()
export class ApplicationLocalStorageClient {
	constructor(@Inject(PLATFORM_ID) private platformId: Object) {}
	/**
	 * Sets local storage
	 */
	public set(key: string, value: string | number | boolean | Object | Array<Object> | Array<Number> | Array<String>) {
		if (isPlatformBrowser(this.platformId)) {
			localStorage.setItem(key, JSON.stringify(value));
		}
	}

	/**
	 * Gets local storage
	 */
	public get(key: string): string | number | boolean | Object | Array<Object> | Array<Number> | Array<String> | null {
		if (!isPlatformBrowser(this.platformId)) {
			return null;
		}
		const localStore = localStorage.getItem(key);
		return JSON.parse(localStore);
	}

	/**
	 * Check to see if item exists in local storage
	 */
	public exists(key): boolean {
		if (!isPlatformBrowser(this.platformId)) {
			return false;
		}
		return Boolean(localStorage.getItem(key));
	}

	/**
	 * Removes value from local storage
	 */
	public deleteKey(key: string) {
		if (!isPlatformBrowser(this.platformId)) {
			return null;
		}
		localStorage.removeItem(key);
	}
}
