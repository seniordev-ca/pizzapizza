
// Angular Core
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

// Ng Rx
import { Store } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';

// Reactive operators
import {
	flatMap,
	exhaustMap,
	catchError,
	withLatestFrom
} from 'rxjs/operators';
import { of } from 'rxjs';

// REDUX store/actions
import { State } from '../../root-reducer/root-reducer';
import {
	TipsActionsTypes,
	TipsSuccess,
	TipsFailure,
} from '../actions/tips';

// Services
import { TipsService } from '../services/tips';

// Models
import { TipsRequest } from '../models/server-tips';
import { UpdateUserCartSuccess } from './../actions/cart';


@Injectable()
export class TipsEffect {

	// Handle user's redeem
	@Effect()
	applyTips = this.actions.pipe(
		ofType(TipsActionsTypes.ApplyTips),
		withLatestFrom(this.store),
		exhaustMap(([action, state]) => {
			const tipAmount = action['tipAmount'];
			const tipType = action['tipType'];
			const selectedStore = state.common.store.selectedStore;
			const isTips = action['isTips'];

			const tipRequest: TipsRequest = {
				tip_value: tipAmount,
				tip_type: tipType
			}
			return this.tipsService.applyTips(tipRequest).pipe(
				flatMap(response => {
					const cart = response;
					const baseUrl = state.common.settings.data.web_links.image_urls.product;
					const returnActions = []
					returnActions.push(new TipsSuccess(tipAmount, isTips))
					if (selectedStore) {
						returnActions.push(
							new UpdateUserCartSuccess(cart, baseUrl, selectedStore)
						)
					}
					return returnActions;
				}),
				catchError(error => of(new TipsFailure()))
			)
		})
	)


	constructor(
		private actions: Actions,
		private store: Store<State>,
		private tipsService: TipsService,
	) { }
}
