// Angular and ngrx
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, exhaustMap, catchError, flatMap, filter, withLatestFrom, first } from 'rxjs/operators';
import { of } from 'rxjs';
import { LocalStorageService } from '../services/local-storage';
import { ConfiguratorActionsTypes, SetUpsizeModalFlag, SetPersonalMessageModalFlag } from '../../catalog/actions/configurator';
import { CartActionsTypes } from '../../checkout/actions/cart';
import { OrderActionsTypes } from '../../checkout/actions/orders';
import { Club1111ActionTypes, PromptClub1111EarnedBanner } from 'app/user/actions/club1111-actions';
import { Club11BalanceResponse } from 'app/user/models/server-models/server-club11';
import { CatalogComboConfigListTypes } from 'app/catalog/actions/combo-config';

@Injectable()
export class LocalStorageEffects {
	/**
	 * Toggle Upsizing LocalStorage Flag
	 */
	@Effect()
	getUpsizingFlag = this.actions.pipe(
		filter(action =>
			action.type === ConfiguratorActionsTypes.FetchSingleProductSuccess
			|| action.type === ConfiguratorActionsTypes.FetchSingleConfigurableComboSuccess
			|| action.type === ConfiguratorActionsTypes.FetchTwinProductConfigSuccess
			|| action.type === ConfiguratorActionsTypes.ConfigureComboProductInModal
		),
		flatMap(action => {
			const isUpsizingFlagSet = this.localStorageService.getFlag('isUpsizingAsked');
			const isPersonalMessageDefined = this.localStorageService.getFlag('isPersonalMessageModalShown');

			return [
				new SetUpsizeModalFlag(isUpsizingFlagSet),
				new SetPersonalMessageModalFlag(isPersonalMessageDefined, false)
			]
		})
	)
	@Effect()
	setUpsizingFlag = this.actions.pipe(
		filter(action => action.type === CartActionsTypes.AddConfigurableProductToCart ||
			action.type === CartActionsTypes.UpdateConfigurableProductToCart ||
			action.type === CatalogComboConfigListTypes.ComboProductNextClick),
		filter(action => action['isUpsizeAsked']),
		map(action => {
			this.localStorageService.setFlag('isUpsizingAsked', true);
			return new SetUpsizeModalFlag(true)
		})
	)
	@Effect()
	deleteUpsizingFlag = this.actions.pipe(
		ofType(OrderActionsTypes.ProcessOrderRequestSuccess),
		flatMap(action => {
			this.localStorageService.setFlag('isUpsizingAsked', false);
			return [new SetUpsizeModalFlag(false), new SetPersonalMessageModalFlag(false, true)]
		})
	)
	@Effect()
	setPersonalMessageFlag = this.actions.pipe(
		ofType(ConfiguratorActionsTypes.SetPersonalMessageModalFlag),
		filter(action => action['saveToLocalStorage']),
		map(action => {
			const isAsked = action['isPersonalMessageDefined']
			this.localStorageService.setFlag('isPersonalMessageModalShown', isAsked)
			return new SetPersonalMessageModalFlag(isAsked, false)
		})
	)
	@Effect()
	setClubEarnedFlag = this.actions.pipe(
		ofType(Club1111ActionTypes.FetchClub11AccountBalanceSuccess),
		map(action => {
			const balance = action['club11Balance'] as Club11BalanceResponse
			const localBannerFlag = this.localStorageService.getFlag('isClubEarningsBannerShown');
			const isEarningsBannerShown = localBannerFlag !== balance.earnings_banner.show_banner ?
				balance.earnings_banner.show_banner : localBannerFlag
			this.localStorageService.setFlag('isClubEarningsBannerShown', isEarningsBannerShown);
			const isLocalBanner = !localBannerFlag && balance.earnings_banner.show_banner
			return new PromptClub1111EarnedBanner(isLocalBanner)
		})
	)

	constructor(
		private actions: Actions,
		private localStorageService: LocalStorageService
	) { }
}
