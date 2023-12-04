// Angular and ngrx
import { Store, Action } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { map, catchError, mergeMap, exhaustMap, flatMap, filter, withLatestFrom } from 'rxjs/operators';
import { Observable, of } from 'rxjs';


// Actions
import {
	GlobalActionsTypes
} from '../../common/actions/global';
import {
	DevActions,
	SetDevSettingsFromLocalStorage,
	DevActionsTypes
} from '../actions/dev-actions';

// Reducers
import { State } from '../reducers';

import { DevLocalStorage } from '../services/dev-local-storage';
/**
 * TODO think about caching at this level
 */
@Injectable()
export class DevEffects {

	/**
	 * Get dev settings on app launch
	 */
	@Effect()
	getDevSettingsFromLocalStorage = this.actions.pipe(
		ofType('@ngrx/router-store/navigated'),
		filter(routerNavAction => routerNavAction['payload']['event']['id'] === 1),
		map(action => {
			const devSettings = DevLocalStorage.getDevSetting();
			return new SetDevSettingsFromLocalStorage(devSettings);
		})
	);

	/**
	 * Save dev settings into local storage
	 */
	@Effect()
	saveEnvOptions = this.actions.pipe(
		filter(action =>
			action.type === DevActionsTypes.SetBaseApiUrl
			|| action.type === DevActionsTypes.SetMockHeader
			|| action.type === DevActionsTypes.ToggleMockImageBaseUrl),
		withLatestFrom(this.store$),
		mergeMap(([action, state]) => {
			DevLocalStorage.saveDevSetting(state.dev);
			if (typeof window === 'object') {
				window.location.reload();
			}
			return of();
		})
	);

	constructor(
		private actions: Actions,
		private store$: Store<State>,
	) { }
}
