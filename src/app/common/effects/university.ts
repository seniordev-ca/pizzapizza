// Angular and ngrx
import {Inject, Injectable, LOCALE_ID} from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { map, catchError, exhaustMap, filter, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';
import { State } from '../reducers';

import {
	UniversityActionsTypes,
	FetchUniversityListSuccess,
	FetchUniversityListFailed,
	FetchBuildingListSuccess,
	FetchBuildingListFailed,
} from '../actions/university';
import { UniversityService } from '../services/university.service';
import { Store } from '@ngrx/store';

@Injectable()
export class UniversityEffects {

	/**
	 * Fetch All Universities
	 */
	@Effect()
	fetchAllUniversities = this.actions.pipe(
		ofType(UniversityActionsTypes.FetchUniversityList),
		withLatestFrom(this.store),
		filter(([action, store]) => !store.common.university.isUniveristyListFetched),
		exhaustMap(() => this.universityService.fetchUniversityList().pipe(
			map(response => new FetchUniversityListSuccess(response, this.locale)),
			catchError(() => of(new FetchUniversityListFailed()))
		))
	)
	/**
	 * Fetch Buildings for univeristy
	 */
	@Effect()
	fetchBuildings = this.actions.pipe(
		ofType(UniversityActionsTypes.FetchBuildingList),
		withLatestFrom(this.store),
		exhaustMap(([action, store]) => {
			const listFromNGRX = store.common.university.entities[action['code']];
			if (listFromNGRX) {
				return of(new FetchBuildingListSuccess(listFromNGRX.buildings, listFromNGRX.id, this.locale))
			} else {
				return this.universityService.fetchBuildings(action['code']).pipe(
					map(response => new FetchBuildingListSuccess(response, action['code'], this.locale)),
					catchError(() => of(new FetchBuildingListFailed()))
				)
			}
		}
		))

	constructor(
		private actions: Actions,
		private store: Store<State>,
		private universityService: UniversityService,
		@Inject(LOCALE_ID) private locale: string
	) { }
}
