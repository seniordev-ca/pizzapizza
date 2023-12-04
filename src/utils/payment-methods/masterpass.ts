import { Injectable } from '@angular/core';
import { JSLoaderService, ScriptModel } from '../app-load-script-client';

declare var masterpass;

@Injectable()
export class MasterPassService {
	/**
	 * For documentation visit
	 * https://developer.mastercard.com/documentation/masterpass-merchant-integration-v7
	 */
	MASTERPASS_SCRIPT = {
		name: 'masterpass',
		src: ''
	} as ScriptModel;

	// Might need to pass the btn img src up to the container from here
	BTN_PATH = 'https://masterpass.com/dyn/img/btn/global/mp_chk_btn_147x034px.svg';

	// TEMP *** This might have to live somewhere higher up and change based on Enviroment ?
	MASTERPASS_KEY = 'TODO'

	private masterpass;

	loadScriptSubscriptionRef;

	constructor(private jsLoader: JSLoaderService) { }

	/**
	 * Init MasterPass and update const to true
	 */
	init() {
		this.loadScriptSubscriptionRef = this.jsLoader.load(this.MASTERPASS_SCRIPT, true).subscribe(b => {
			if (b.loaded) {
				this.masterpass = masterpass;
				this.initMasterPass()
			}
		})
	}

	/**
	 * Destroy
	 */
	destroy() {
		if (this.loadScriptSubscriptionRef) {
			this.loadScriptSubscriptionRef.unsubscribe();
		}
	}
	/**
	 * Provide Button Image Source
	 */
	getBtnSrc() {
		return this.BTN_PATH;
	}
	/**
	 * Set up masterpass
	 */
	initMasterPass() {
		if (this.masterpass) {
			this._initMasterPass();
			this._addListeners();
		} else {
			this.init()
		}
	}

	/**
	 * init MasterPass
	 */
	private _initMasterPass() {

	}
	/**
	 * Setup masterpass listeners
	 */
	private _addListeners() {

	}


}
