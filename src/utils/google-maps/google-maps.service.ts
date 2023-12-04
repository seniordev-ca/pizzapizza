import {
	Injectable,
	ModuleWithProviders,
	Optional,
	Inject,
	PLATFORM_ID
} from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { HttpClient } from '@angular/common/http';

import { map } from 'rxjs/operators';
import { UserServiceConfig } from './google-maps.class';


// Env config
import { environment } from '../../environments/environment';
const googleServiceKey = environment.googleServiceKey;

@Injectable()
export class GoogleMapsService {
	/* tslint:disable:no-any */

	/**
	 * Google Maps Api link
	 */
	readonly base = 'https://maps.googleapis.com/maps/api/';
	readonly url: string;
	readonly geoUrl: string;

	/**
	 * Promise to callback
	 */
	private loadAPI: Promise<any>;

	private isRenderedOnServer: boolean;

	/**
	 * Configure core method
	 * @param config
	 * @returns {{ngModule: GoogleMapsService, providers: [{provide: UserServiceConfig, useValue: UserServiceConfig}]}}
	 */
	static forRoot(config: UserServiceConfig): ModuleWithProviders {
		return {
			ngModule: GoogleMapsService,
			providers: [
				{ provide: UserServiceConfig, useValue: config }
			]
		};
	}

	/**
	 * Constructor
	 * @param config
	 */
	constructor(
		@Optional() config: UserServiceConfig,
		private http: HttpClient,
		@Inject(PLATFORM_ID) platformId
	) {
		this.isRenderedOnServer = isPlatformServer(platformId);

		if (config) {
			this.url = this.base + 'js?key=' + googleServiceKey + '&callback=__onGoogleLoaded&libraries=' + config.libraries.join(',');
			this.geoUrl = this.base + 'geocode/json?key=' + googleServiceKey;
		} else {
			throw new Error('Module have been forRoot({API_KEY: your api key})');
		}
	}

	/**
	 * Load script
	 */
	private loadScript(): void {
		if (!this.isRenderedOnServer) {
			if (!document.getElementById('google-maps-angular2')) {
				const script = document.createElement('script');

				script.type = 'text/javascript';
				script.src = `${this.url}`;
				script.id = 'google-maps-angular2';

				document.head.appendChild(script);
			}
		}
	}

	/**
	 * Wait callback and return google.maps object
	 * @returns {Promise<any>}
	 */


	get init(): Promise<any> {
		this.loadAPI = new Promise((resolve) => {
			if (!this.isRenderedOnServer) {

				if (!window['__onGoogleLoaded']) {
					window['__onGoogleLoaded'] = (ev: any) => {
						resolve(window['google']['maps']);
					};
					this.loadScript();
				} else {
					resolve(window['google']['maps']);
				}

			}
		});
		return this.loadAPI;
	}


	/**
	 * find addresses based on lat and long
	 */
	reverseGeo(latlng) {
		const url = this.geoUrl + '&latlng=' + latlng;
		return this.http.get(url).pipe(
			map((res) => res)
		);
		// ...errors if any
		// .catch((error: any) => Observable.throwError(error.json().error || 'Server error'));
	}

}
