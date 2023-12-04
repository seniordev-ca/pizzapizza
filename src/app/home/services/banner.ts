import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ServerSingleBannerInterface, ServerBannerInterface } from '../models/server-banner';
import { map } from 'rxjs/operators';
import { ApplicationHttpClient } from 'utils/app-http-client';

/**
 * Home page banner service
 */
@Injectable()
export class BannerService {
	constructor(
		private appHttp: ApplicationHttpClient,
	) { }

	/**
	 * Fetch home page banner
	 */
	getHomePageBanners(storeId: number): Observable<ServerSingleBannerInterface[]> {
		// const methodPath =  wpUrl + '/wp-json/pp-marketing/v1/ads';
		// return this.appHttp.get<ServerSingleBannerInterface[]>(methodPath)
		const methodPath =  'application/api/v1/banners/?store_id=' + storeId;
		return this.appHttp.get<ServerBannerInterface>(methodPath).pipe(
			map(response => {
				const isArray = response ? response.banners instanceof Array : false
				if (isArray && response.banners.length >= 1) {
					return response.banners;
				} else {
					const errorMsg = 'Banner data has not valid format';
					console.warn(errorMsg)
					throw new Error(errorMsg)
				}
			})
		);
	}
}
