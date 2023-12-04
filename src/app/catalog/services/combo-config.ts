import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApplicationHttpClient } from '../../../utils/app-http-client';

import { ServerProductConfig } from '../models/server-product-config'

/**
 * Combo config service
 */
@Injectable()
export class ComboConfigService {
	constructor(
		private appHttp: ApplicationHttpClient
	) { }

	/**
	 * Get Combo Config by slug
	 */
	getComboConfig(storeid, comboslug): Observable<ServerProductConfig> {
		const params = {
			'product_slug': comboslug
		};
		const methodPath =  'catalog/api/v1/product/config/' + storeid;
		return this.appHttp.get<ServerProductConfig>(methodPath, params).pipe(
			map(response => {
				const isArray = response.data.products instanceof Array;
				if (isArray) {
					return response;
				} else {
					const errorMsg = 'Combo Product List is not an Array';
					console.warn(errorMsg)
					throw new Error(errorMsg)
				}
			})
		);
	}
}
