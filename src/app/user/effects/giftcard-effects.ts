// Angular Core
import { Injectable } from '@angular/core';

// NGRX
import { Store } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { map, catchError, exhaustMap, filter, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';


// Models
import { State } from '../../root-reducer/root-reducer';

// Services
import { GiftCardService } from '../services/gift-card-services'
import {
	GiftCardActionTypes,
	FetchGiftCardBalanceSuccess,
	FetchGiftCardBalanceFailure,
	FetchGiftCardTransactionsSuccess,
	FetchGiftCardTransactionsFailure
} from '../actions/gift-card';
import { Club11Service } from '../services/club11-services';

// Actions


@Injectable()
export class GiftCardEffects {

	/**
	 * Fetch Gift Card Balance
	 */
	@Effect()
	fetchGiftCardBalance = this.actions.pipe(
		ofType(GiftCardActionTypes.FetchGiftCardBalance),
		exhaustMap((action) => {
			const cardNumber = action['cardNumber'];
			const cardPin = action['cardPin'];
			const cardToken = action['cardToken'];

			return this.clubElevenService.fetchClubBalanceViaNumber(cardNumber, cardPin, cardToken).pipe(
				map(response => new FetchGiftCardBalanceSuccess(response)),
				catchError(error => of(new FetchGiftCardBalanceFailure()))
			)
		})
	)

	/**
	 * Fetch Gift Card History
	 */
	@Effect()
	fetchGiftCardHistory = this.actions.pipe(
		ofType(GiftCardActionTypes.FetchGiftCardTransactions),
		withLatestFrom(this.store),
		exhaustMap(([action, store]) => {
			const cardNumber = action['cardNumber'];
			const cardPin = action['cardPin'];
			const cursor = store.user.userGiftCard.transactionCursor

			return this.clubElevenService.fetchGiftCardTransactions(cardNumber, cardPin, cursor).pipe(
				map(response => new FetchGiftCardTransactionsSuccess(null)),
				catchError(error => of(new FetchGiftCardTransactionsFailure()))
			)
		})
	)

	constructor(
		private actions: Actions,
		private giftCardService: GiftCardService,
		private clubElevenService: Club11Service,
		private store: Store<State>
	) { }
}
