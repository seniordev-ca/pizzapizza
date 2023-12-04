import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApplicationHttpClient } from '../../../utils/app-http-client';

import { ServerProductList } from '../models/server-products-list'

/**
 * Global application service consumer
 */
@Injectable()
export class FeaturedProductService {
	constructor(
		private appHttp: ApplicationHttpClient
	) { }

	/**
	 * Application global settings
	 */
	getFeaturedProducts(id, isDelivery): Observable<ServerProductList> {
		const deliveryType = isDelivery ? 'delivery' : 'pickup';
		const methodPath =  'catalog/api/v1/product_list/featured/' + id + '/' + deliveryType;
		return this.appHttp.get<ServerProductList>(methodPath).pipe(
			map(response => {
				if (response && response.products.length >= 1) {
					return response;
				} else {
					const errorMsg = 'Featured Products data has not valid format';
					console.warn(errorMsg)
					throw new Error(errorMsg)
				}
			})
		);
	}
}
