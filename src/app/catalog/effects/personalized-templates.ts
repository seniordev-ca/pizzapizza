// Angular Core
import { Injectable } from '@angular/core';
// Ng Rx
import { Store } from '@ngrx/store';
// Reactive operators
import { Effect, Actions, ofType } from '@ngrx/effects';
import { map, catchError, exhaustMap, filter, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';
// import 'rxjs/add/observable/fromPromise';
import { State } from '../../root-reducer/root-reducer';
import {
	TemplateActionsTypes,
	FetchPersonalizedTemplateByIDSuccess,
	FetchPersonalizedTemplateByIDFailure,
	AddChildMessageToCartRequest
} from '../actions/personalized-templates';
import { ConfiguratorService } from '../services/configurator';

@Injectable()
export class TemplateEffects {

	@Effect()
	findByID = this.actions.pipe(
		ofType(TemplateActionsTypes.FetchPersonalizedTemplateByID),
		withLatestFrom(this.store),
		filter(([action, store]) => {
			const templateID = action['templateID'];
			const isInRedux = store.catalog.personalTemplates.entities[templateID]

			return !isInRedux;
		}),
		exhaustMap(([action, store]) => {
			// Check if that is edit by URL
			const cartItemId = Number(store.router.state.params.cartItemId);

			// If URL is under edit mode, find product in server cart response
			const serverCart = store.checkout.cart.serverCart;
			const cartProduct = serverCart && cartItemId ? serverCart.products.find(product => product.cart_item_id === cartItemId) : null;
			const currentCartRequest = store.checkout.cart.addToCartRequest;
			const templateID = action['templateID'];

			return this.configuratorService.getPersonalizedTemplate(templateID).pipe(
				map(response => {
					response.id = templateID;
					const comboLineId = store.catalog.configurableItem.comboSubProductLineId;
					return new FetchPersonalizedTemplateByIDSuccess(response, cartProduct, comboLineId, currentCartRequest)
				}),
				catchError(error => of(new FetchPersonalizedTemplateByIDFailure()))
			)
		})
	);


	@Effect()
	findByIDLocally = this.actions.pipe(
		ofType(TemplateActionsTypes.FetchPersonalizedTemplateByID),
		withLatestFrom(this.store),
		filter(([action, store]) => {
			const templateID = action['templateID'];
			const isInRedux = store.catalog.personalTemplates.entities[templateID]

			return isInRedux ? true : false
		}),
		map(([action, store]) => {
			const templateID = action['templateID'];
			const inRedux = store.catalog.personalTemplates.entities[templateID];
			// Check if that is edit by URL
			const cartItemId = Number(store.router.state.params.cartItemId);
			// If URL is under edit mode, find product in server cart response
			const serverCart = store.checkout.cart.serverCart;
			const cartProduct = serverCart && cartItemId ? serverCart.products.find(product => product.cart_item_id === cartItemId) : null;
			const comboLineId = store.catalog.configurableItem.comboSubProductLineId;
			const currentCartRequest = store.checkout.cart.addToCartRequest;

			return new FetchPersonalizedTemplateByIDSuccess(inRedux, cartProduct, comboLineId, currentCartRequest)
		})
	)

	@Effect()
	updateComboCartRequestMessages = this.actions.pipe(
		ofType(TemplateActionsTypes.UpdateUserPersonalizedForm),
		withLatestFrom(this.store),
		filter(([action, store]) => {
			const isComboChild = store.catalog.configurableItem.comboSubProductLineId;
			return isComboChild ? true : false
		}),
		map(([action, store]) => {
			const comboChild = store.catalog.configurableItem.comboSubProductLineId;
			return new AddChildMessageToCartRequest(action['personalizedMessage'], comboChild)
		})
	)

	constructor(
		private actions: Actions,
		private store: Store<State>,
		private configuratorService: ConfiguratorService,
	) { }
}
