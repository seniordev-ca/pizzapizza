import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApplicationHttpClient } from '../../../utils/app-http-client';

import { ServerCategoriesInterface } from '../models/server-category'

/**
 * Global application service consumer
 */
@Injectable()
export class CategoryService {
	constructor(
		private appHttp: ApplicationHttpClient
	) { }

	/**
	 * Get categories by id
	 */
	getCategories(id): Observable<ServerCategoriesInterface[]> {
		const methodPath =  `catalog/api/v1/category_list/${id}`;
		return this.appHttp.get<ServerCategoriesInterface[]>(methodPath).pipe(
			map(response => {
				const isArray = response instanceof Array;
				if (isArray) {
					return response;
				} else {
					const errorMsg = 'Category List is not an Array';
					console.warn(errorMsg)
					throw new Error(errorMsg)
				}
			})
		);
	}
}
