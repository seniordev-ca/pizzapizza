import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApplicationHttpClient } from '../../../utils/app-http-client';
import { ServerUniversityInterface, ServerUniversityBuildingInterface } from '../models/server-university';

/**
 * Location service consumer
 */
@Injectable()
export class UniversityService {
	constructor(
		private appHttp: ApplicationHttpClient,
	) { }

	/**
	 * Fetch All Universities
	 */
	fetchUniversityList(): Observable<ServerUniversityInterface[]> {
		const methodPath = 'store/api/v1/universities/';
		return this.appHttp.get<ServerUniversityInterface[]>(methodPath).pipe(
			map(response => {
				const isArray = response instanceof Array;
				if (isArray) {
					return response;
				} else {
					const errorMsg = 'University List is not an array';
					console.warn(errorMsg)
					throw new Error(errorMsg)
				}
			})
		);
	}

	/**
	 * Fetch Buildings for University
	 */
	fetchBuildings(code: string): Observable<ServerUniversityBuildingInterface[]> {
		const methodPath = 'store/api/v1/buildings/?university_code=' + code;
		return this.appHttp.get<ServerUniversityBuildingInterface[]>(methodPath).pipe(
			map(response => {
				const isArray = response instanceof Array;
				if (isArray && response.length > 0) {
					return response;
				} else {
					const errorMsg = 'Building List is not an array';
					console.warn(errorMsg)
					throw new Error(errorMsg)
				}
			})
		);
	}
}
