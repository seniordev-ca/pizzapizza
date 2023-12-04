import { REQUEST } from '@nguniversal/express-engine/tokens'

import { Injectable, Inject, PLATFORM_ID, Optional } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { CookieAttributes, getJSON, remove, set } from 'js-cookie'
import { Observable, Subject } from 'rxjs';

export interface ICookieService {
	// tslint:disable:no-any
	readonly cookies$: Observable<{ readonly [key: string]: any }>
	/**
	 * get all cookies
	 */
	getAll(): any
	/**
	 * get cookie
	 */
	get(name: string): any
	/**
	 * set cookies
	 */
	set(name: string, value: any, options?: CookieAttributes): void
	/**
	 * remove cookies
	 */
	remove(name: string, options?: CookieAttributes): void
}

@Injectable()
export class ApplicationCookieClient {
	private readonly cookieSource = new Subject<{ readonly [key: string]: any }>()
	public readonly cookies$ = this.cookieSource.asObservable();

	constructor(@Inject(PLATFORM_ID) private platformId: Object, @Optional() @Inject(REQUEST) private req: any) { }
	/**
	 * Sets local storage
	 */
	public set(key: string, value: any, options?: CookieAttributes) {
		if (isPlatformBrowser(this.platformId)) {
			const defaultOptions = {
				sameSite: 'Strict'
			} as CookieAttributes;

			const setOptions = { ...defaultOptions, ...options }

			set(key, value, setOptions)
			this.updateSource()
		}
	}

	/**
	 * Gets local storage
	 */
	public get(key: string): string | number | boolean | Object | Array<Object> | Array<Number> | Array<String> | null {
		if (isPlatformBrowser(this.platformId)) {
			return getJSON(key)
		} else {
			try {
				return this.req && this.req.cookies ? JSON.parse(this.req.cookies[key]) : undefined
			} catch (err) {
				return this.req && this.req.cookies ? this.req.cookies[key] : undefined
			}
		}
	}

	/**
	 * Check to see if item exists in local storage
	 */
	public exists(key: string): boolean {
		return Boolean(this.get(key))
	}

	/**
	 * Removes value from local storage
	 */
	public deleteKey(key: string, options?: CookieAttributes) {
		if (isPlatformBrowser(this.platformId)) {
			remove(key, options)
			this.updateSource()
		}
	}

	/**
	 * get all
	 */
	public getAll(): any {
		if (isPlatformBrowser(this.platformId)) {
			return getJSON()
		} else {
			if (this.req) {
				return this.req.cookies
			}
		}
	}

	/**
	 * Update Cookies
	 */
	private updateSource() {
		this.cookieSource.next(this.getAll())
	}
}
