import { Injectable } from '@angular/core';
import { ApplicationHttpClient } from '../../../utils/app-http-client';
import { Observable } from 'rxjs';

import { ServerKidsClubInterface } from '../models/server-models/server-kids-club';
import { map } from 'rxjs/operators';

@Injectable()
export class KidsClubService {
	constructor(
		private appHttp: ApplicationHttpClient,
	) { }

	/**
	 * Fetch All Kids Club
	 */
	fetchKidsClub(): Observable<ServerKidsClubInterface[]> {
		const methodPath = 'user/api/v1/kids_club/'
		return this.appHttp.get<ServerKidsClubInterface[]>(methodPath).pipe(
			map(response => {
				const isArray = response instanceof Array;
				if (isArray) {
					return response;
				} else {
					const errorMsg = 'Kids Club is not an Array';
					console.warn(errorMsg)
					throw new Error(errorMsg)
				}
			})
		)
	}

	/**
	 * Kids Club Registration
	 */
	registerKidsClub(registration: ServerKidsClubInterface): Observable<ServerKidsClubInterface> {
		const methodPath = 'user/api/v1/kids_club/'
		return this.appHttp.post<ServerKidsClubInterface>(methodPath, registration)
	}

	/**
	 * Delete Kids Club User
	 */
	deleteKidsClub(id: number): Observable<string> {
		const methodPath = 'user/api/v1/kids_club/?id=' + id
		return this.appHttp.delete(methodPath)
	}

	/**
	 * Update Kids Club User
	 */
	updateKidsClub(kidDetails: ServerKidsClubInterface): Observable<ServerKidsClubInterface> {
		const methodPath = 'user/api/v1/kids_club/'
		return this.appHttp.put<ServerKidsClubInterface>(methodPath, kidDetails)
	}
}
