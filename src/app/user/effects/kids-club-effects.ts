// Angular Core
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { State } from '../../root-reducer/root-reducer';

import {
	KidsClubActionTypes,
	FetchUserKidsClubSuccess,
	FetchUserKidsClubFailure,
	RegisterNewKidsClubSuccess,
	RegisterNewKidsClubFailure,
	DeleteKidsClubUserSuccess,
	DeleteKidsClubUserFailure,
	UpdateKidsClubSuccess,
	UpdateKidsClubFailure,
} from '../actions/kids-club-actions';
import { KidsClubService } from '../services/kids-club-service';
import { KidsClubReducerHelp } from '../reducers/mappers/kidsclub-mapper';
import { exhaustMap, map, catchError, withLatestFrom, filter } from 'rxjs/operators';
import { of } from 'rxjs';
import { Store } from '@ngrx/store';
@Injectable()
export class KidsClubEffects {

	@Effect()
	fetchKidsClub = this.actions.pipe(
		ofType(KidsClubActionTypes.FetchUserKidsClub),
		withLatestFrom(this.store),
		filter(([action, store]) => {
			const isKidsClubFetched = store.user.userKidsClub.isKidsClubFetched
			return !isKidsClubFetched
		}),
		exhaustMap(action => this.kidClubService.fetchKidsClub().pipe(
			map(response => new FetchUserKidsClubSuccess(response)),
			catchError(() => of(new FetchUserKidsClubFailure()))
		))
	)

	@Effect()
	registerKidsClub = this.actions.pipe(
		ofType(KidsClubActionTypes.RegisterNewKidsClub),
		exhaustMap(action => {
			const mappedRequest = KidsClubReducerHelp.parseUIToServerKidsClub(action['registration'])
			return this.kidClubService.registerKidsClub(mappedRequest).pipe(
				map(response => new RegisterNewKidsClubSuccess(response)),
				catchError((error) => of(new RegisterNewKidsClubFailure(error.error)))
			)
		})
	)

	@Effect()
	deleteKidsClub = this.actions.pipe(
		ofType(KidsClubActionTypes.DeleteKidsClubUser),
		exhaustMap(action => this.kidClubService.deleteKidsClub(action['id']).pipe(
			map(response => new DeleteKidsClubUserSuccess(action['id'])),
			catchError(() => of(new DeleteKidsClubUserFailure()))
		))
	)

	@Effect()
	updateKidsClub = this.actions.pipe(
		ofType(KidsClubActionTypes.UpdateKidsClub),
		exhaustMap(action => {
			const mappedRequest = KidsClubReducerHelp.parseUIToServerKidsClub(action['registration'])
			return this.kidClubService.updateKidsClub(mappedRequest).pipe(
				map(response => new UpdateKidsClubSuccess(mappedRequest)),
				catchError((error) => of(new UpdateKidsClubFailure(error.error)))
			)
		})
	)

	constructor(
		private store: Store<State>,
		private actions: Actions,
		private kidClubService: KidsClubService,
	) {}
}
