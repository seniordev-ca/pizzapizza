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
	LoyaltyActionsTypes,
	RedeemLoyaltyCardSuccess,
	RedeemLoyaltyCardFailure,
} from '../actions/loyalty';

// Services
import { LoyaltyService } from '../services/loyalty';

// Models
import { RedeemClubCardRequest } from '../models/server-loyalty';
import { FetchUserCartSuccess } from '../actions/cart';

@Injectable()
export class LoyaltyEffect {

	// Handle user's redeem
	@Effect()
	redeemLoyalty = this.actions.pipe(
		ofType(LoyaltyActionsTypes.RedeemLoyaltyCard),
		withLatestFrom(this.store),
		exhaustMap(([action, state]) => {
			const amount = action['redeemAmount'];
			const isGiftCard = action['isGiftCard'];

			const selectedStore = state.common.store.selectedStore;
			const isDelivery = state.common.store.isDeliveryTabActive;
			const cardBalanceToken = state.user.userClub1111.club11Balance.balanceToken;

			const cardRedeemRequest: RedeemClubCardRequest = {
				amount,
				store_id: selectedStore.store_id,
				is_delivery: isDelivery,
				card_balance_token: cardBalanceToken
			}
			if (isGiftCard) {
				const giftCardBalanceToken = state.user.userGiftCard.giftCardDetails.card_balance_token
				cardRedeemRequest.card_balance_token = giftCardBalanceToken;
			}

			return this.loyaltyService.redeemLoyaltyCart(cardRedeemRequest).pipe(
				flatMap(response => {
					const cart = response.cart
					const baseUrl = state.common.settings.data.web_links.image_urls.product;
					const isLoyalityRedemtion = true;
					return [
						new RedeemLoyaltyCardSuccess(response, amount),
						new FetchUserCartSuccess(cart, baseUrl, isLoyalityRedemtion)
					]
				}),
				catchError(error => of(new RedeemLoyaltyCardFailure()))
			)
		})
	)


	constructor(
		private actions: Actions,
		private store: Store<State>,
		private router: Router,
		private loyaltyService: LoyaltyService
	) { }
}
