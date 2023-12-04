import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApplicationHttpClient } from '../../../utils/app-http-client';

import { ServerJustForYouInterface } from '../models/server-just-for-you'
import { ServerProductList } from '../models/server-products-list';

/**
 * Global application service consumer
 */
@Injectable()
export class JustForYouService {
	constructor(
		private appHttp: ApplicationHttpClient
	) { }

	/**
	 * Application global settings
	 */
	getJustForYouSlides(storeID): Observable<ServerJustForYouInterface> {
		const methodPath = 'user/api/v1/just_for_you/' + storeID;
		return this.appHttp.get<ServerJustForYouInterface>(methodPath, null, true)
	}

	/**
	 * Just For You Product List
	 */
	getProductList(storeId, productId, isDelivery): Observable<ServerProductList> {
		const deliveryOption = isDelivery ? 'delivery' : 'pickup';
		const methodPath = `catalog/api/v1/product_list/just_for_you/${storeId}`;
		const params = {
			category_slug: productId,
			delivery_option: deliveryOption
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
	}}
