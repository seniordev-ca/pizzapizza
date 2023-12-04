import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { DataLayerObjectInterface } from '../models/datalayer-object';
import { Effect, Actions, ofType } from '@ngrx/effects';
// State
import { State } from '../../root-reducer/root-reducer';
import { isPlatformBrowser } from '@angular/common';

/* tslint:disable:no-any */
declare var dataLayer: any;
import { TagManagerActionsTypes } from '../actions/tag-manager';
import { JSLoaderService, ScriptModel } from 'utils/app-load-script-client';
import { environment } from '../../../environments/environment';
/**
 * Tag Manager Service
 */

export interface TagManagerMetaData {
	currentUrl: string
}
@Injectable()
export class TagManagerService {
	isPlatformBrowser: boolean;

	TAGMANAGER_SCRIPT = {
		name: 'analytics',
		src: `https://www.googletagmanager.com/gtm.js?id=${environment.tagAnalyticsKey}`
	} as ScriptModel;
	BUILTIN_TAG_MANAGER_SCRIPT = {
		name: 'builtInTagScript',
		src: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
		new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
		j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
		'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
		})(window,document,'script','dataLayer', '${environment.tagAnalyticsKey}');`
	} as ScriptModel;


	constructor(
		@Inject(PLATFORM_ID) private platformId: Object,
		private jsLoader: JSLoaderService
	) {
		this.isPlatformBrowser = isPlatformBrowser(platformId);
	}

	/**
	 * Initial script links creator
	*/
	init() {
		this.jsLoader.loadTagManagerScript(this.BUILTIN_TAG_MANAGER_SCRIPT);
		this.jsLoader.loadTagManagerBodyScript(this.TAGMANAGER_SCRIPT);
	}

	/**
	 * Push To Global DataLayer
	 */
	pushToDataLayer(dataObject) {
		if (!this.isPlatformBrowser) {
			return false;
		}
		// console.log('TCL: TagManagerService -> pushToDataLayer -> dataObject', dataObject)

		dataLayer.push(dataObject);
		return true;
	}


	/**
	 * Push To Global DataLayer
	 */
	allHitsFunction(state: State) {
		if (!this.isPlatformBrowser) {
			return false;
		}
		dataLayer.push({
			loginState: state.user.userLogin.loggedInUser ? 'logged in' : 'anonymous',
			membership: state.user.userClub1111.userHasClub11 ? 'Club 11-11' : 'Not a member',
			balance: `${state.user.userClub1111.club11Balance.available}`,
			userId: state.user.userLogin.loggedInUser ? state.user.userLogin.loggedInUser.customerId : 'undefined',
			store: `${state.common.store.selectedStore.store_id}`
		});
		// console.log({
		// 	loginState: state.user.userLogin.loggedInUser ? 'logged in' : 'anonymous',
		// 	membership: state.user.userClub1111.userHasClub11 ? 'Club 11-11' : 'Not a member',
		// 	balance: `${state.user.userClub1111.club11Balance.available}`,
		// 	userId: state.user.userLogin.loggedInUser ? state.user.userLogin.loggedInUser.customerId : 'undefined',
		// 	store: `${state.common.store.selectedStore.store_id}`
		// })
	}
}
