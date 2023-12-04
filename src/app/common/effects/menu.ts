// Angular and ngrx
import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, exhaustMap, catchError, flatMap, filter, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';

// State
import { State } from '../reducers';
import { FooterMenuActionTypes, FetchFooterMenuSuccess, FetchFooterMenuFailure } from '../actions/menu';
import { FooterMenuService } from '../services/footer-menu.service';
import { GlobalActionsTypes } from '../actions/global';

@Injectable()
export class FooterMenuEffects {

	/**
	 * Fetch footer menu
	 */
	@Effect()
	fetchFooterMenu = this.actions.pipe(
		ofType(GlobalActionsTypes.FetchSettingsSuccess),
		withLatestFrom(this.store$),
		exhaustMap(([action, store]) => {
			return this.settingsService.getFooterMenu().pipe(
				map(response => {
					return new FetchFooterMenuSuccess(response);
				}),
				catchError(error => {
					return of(new FetchFooterMenuFailure());
				})
			)
		})
	)

	constructor(
		private actions: Actions,
		private store$: Store<State>,
		private settingsService: FooterMenuService
	) { }
}
