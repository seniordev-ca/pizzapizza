import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApplicationHttpClient } from '../../../utils/app-http-client';
import { RecommendationsServerInterface } from '../../catalog/models/server-recommendations';
import { ServerProductInListInterface } from '../../catalog/models/server-product-in-list';

/**
 * Global application service consumer
 */
@Injectable()
export class RecommendationService {
	constructor(
		private appHttp: ApplicationHttpClient
	) { }

	/**
	 * Get recommendations
	 */
	getRecommendations(request: RecommendationsServerInterface): Observable<ServerProductInListInterface[]> {
		const methodPath = 'catalog/api/v1/recommendations/';
		return this.appHttp.post<ServerProductInListInterface[]>(methodPath, request)
	}
}

