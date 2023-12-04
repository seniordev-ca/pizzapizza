import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApplicationHttpClient } from '../../../utils/app-http-client';

import { ServerProductConfig, ServerPersonalizedTemplateResponse, ProductKinds } from '../models/server-product-config'
import { AppSdkService } from '../../../utils/app-sdk'
import { SdkResponse } from '../models/server-sdk';
import { AddCartServerRequestInterface } from '../../checkout/models/server-cart-request';

/**
 * Configurator http service
 */
@Injectable()
export class ConfiguratorService {
	constructor(
		private appHttp: ApplicationHttpClient,
	) { }

	/**
	 * Fetching product configuration
	 */
	getProductConfig(storeId, productId): Observable<ServerProductConfig> {
		const methodPath = `catalog/api/v1/product/config/${storeId}`;
		const params = {
			'product_slug': productId
		}
		return this.appHttp.get<ServerProductConfig>(methodPath, params).pipe(
			map(response => {
				const isArray = response.data.products instanceof Array;
				const isAllProductsValid = response.data.products.filter(product => {
					const isConfigOptionEmpty = product.configuration_options.length < 1;
					const isConfigEmpty = product.configurations.length < 1;
					return isConfigOptionEmpty || isConfigEmpty
				});
				const isProductSingle = response.kind === ProductKinds.single;
				const isProductValid = isProductSingle ? isAllProductsValid.length < 1 : true;
				if (isArray && isProductValid) {
					return response;
				} else {
					const errorMsg = 'Config Product List is not an Array or is Single and not valid';
					console.warn(errorMsg)
					throw new Error(errorMsg)
				}
			})
		);
	}

	/**
	 * create observable of sdk initProduct for effect
	 */
	initProduct(productConfig: ServerProductConfig, device: string, language: string): Observable<SdkResponse> {
		console.log(language)
		return of(AppSdkService.initProduct(productConfig, device, language)).pipe(
			map(response => {
				const errorCode = response.errorCode
				if (errorCode === 0) {
					return response;
				} else {
					const errorMsg = response.errorMessage;
					throw new Error(errorMsg)
				}
			})
		);
	}

	/**
	 * create observable of sdk getProductInfo
	 */
	getProductInfo(addToCartRequest: AddCartServerRequestInterface): Observable<SdkResponse> {
		return of(AppSdkService.getProductInfo(addToCartRequest)).pipe(
			map(response => {
				const errorCode = response.errorCode
				if (errorCode === 0) {
					return response;
				} else {
					const errorMsg = response.errorMessage;
					throw new Error(errorMsg)
				}
			})
		);
	}

	/**
	 * Get personalized message template
	 */
	getPersonalizedTemplate(id: number): Observable<ServerPersonalizedTemplateResponse> {
		const path = 'catalog/api/v1/personalized_message/' + id;
		return this.appHttp.get<ServerPersonalizedTemplateResponse>(path);
	}
}
