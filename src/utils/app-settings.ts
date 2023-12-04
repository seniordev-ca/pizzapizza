// Angular Core
import {
	Injectable,
	Inject,
	PLATFORM_ID
} from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';

// NG RX
import { Store, select } from '@ngrx/store';
import * as fromCommon from '../app/common/reducers';

// Models
import { AppSettingsInterface } from '../app/common/models/server-app-settings';

@Injectable()
export class AppSettingService {
	appSettings: AppSettingsInterface;
	private isBrowser: boolean;
	/**
	 * Listen to commons store which has setting and save it into the variable
	 * Idea is to provide settings for components as not Observable
	 */
	constructor(
		private commonStore: Store<fromCommon.CommonState>,
		@Inject(PLATFORM_ID) platformId
	) {
		this.isBrowser = isPlatformBrowser(platformId);
		this.commonStore.pipe(select(fromCommon.selectAppSetting))
			.subscribe(settings => this.appSettings = settings.data)
	}

	/**
	 * Get base url for categories
	 */
	getCategoriesBaseUrl() {
		if (!this.appSettings) {
			console.warn('CRITICAL | Attempt to get not fetched setting data');
			return false;
		}

		return this.appSettings.web_links.image_urls.category + '2x/';
	}

	/**
	 * Base image url for featured
	 */
	getFeaturedBaseUrl() {
		return this.appSettings.web_links.image_urls.featured;
	}

	/**
	 * Base image url for just for you
	 */
	getJustForYouBaseUrl() {
		return this.appSettings.web_links.image_urls.just_for_you;
	}

	/**
	 * Base image url for product
	 */
	getProductBaseUrl() {
		if (!this.appSettings) {
			return false;
		}
		return this.appSettings.web_links.image_urls.product + '2x/';
	}

	/**
	 * Get server icon fonts.
	 */
	getServerFontIcons() {
		// Don't render fonts on the server
		if (!this.isBrowser) {
			return false;
		}

		if (!this.appSettings) {
			console.warn('CRITICAL | Attempt to get not fetched setting data');
			return false;
		}

		const elem = document.getElementById('server-fonts');
		if (elem) {
			elem.parentNode.removeChild(elem);
		}

		const fontUrl = this.appSettings.web_links.icons_font;
		const fontElement = document.createElement('STYLE');
		fontElement.setAttribute('id', 'server-fonts');

		const font = `@font-face {
		font-family: 'server-font-icons';
		src: url('${fontUrl}.eot?cache=buster');
		src: url('${fontUrl}.woff2?cache=buster') format('woff2'),
			url('${fontUrl}.woff?cache=buster') format('woff'),
			url('${fontUrl}.ttf?cache=buster') format('truetype'),
			url('${fontUrl}.svg?cache=buster') format('svg');
		}
		.server-font-icon {
			font-family:'server-font-icons';
		 }`;

		fontElement.innerHTML = font;
		document.head.appendChild(fontElement);
	}
}
