import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApplicationHttpClient } from '../../../utils/app-http-client';

import { ServerProductList } from '../models/server-products-list'

/**
 * Global application service consumer
 */
@Injectable()
export class ProductListService {
	constructor(
		private appHttp: ApplicationHttpClient
	) { }

	/**
	 * Application global settings
	 */
	getProductList(storeId, productId, isDelivery): Observable<ServerProductList> {
		const deliveryOption = isDelivery ? 'delivery' : 'pickup';
		const methodPath = `catalog/api/v1/product_list/${storeId}/${deliveryOption}`;
		const params = {
			category_id: productId
		}
		return this.appHttp.get<ServerProductList>(methodPath, params).pipe(
			map(response => {
				if (response && response.products instanceof Array) {
					return response;
				} else {
					const errorMsg = 'Product List has not valid format';
					console.warn(errorMsg)
					throw new Error(errorMsg)
				}
			})
		);
	}

	/**
	 * Get My Pizzas
	 */
	getMyPizzaList(storeId, isDelivery): Observable<ServerProductList> {
		const methodPath = 'user/api/v1/my_pizzas/';
		const resquest = {
			is_delivery: isDelivery,
			store_id: storeId
		}
		return this.appHttp.post<ServerProductList>(methodPath, resquest)
	}
}
