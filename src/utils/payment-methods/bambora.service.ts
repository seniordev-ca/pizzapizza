import { Injectable } from '@angular/core';
import { JSLoaderService, ScriptModel } from '../app-load-script-client';
import { Observable, Observer } from '../../../node_modules/rxjs';

declare var customcheckout

interface TokenResultInterface {
	code: number,
	token?: string,
	last4?: string,
	expiryMonth?: string,
	expiryYear?: string,
	error?: string
}
interface FormInputValidation {
	focus: boolean,
	error: string,
	complete: boolean
	background?: string
}
export interface BamboraValidationInterface {
	[key: string]: FormInputValidation
}
@Injectable()
export class BamboraLoaderService {
	/**
	 * For documentation visit
	 * https://dev.na.bambora.com/docs/guides/custom_checkout/
	 */
	BAMBORA_SCRIPT = {
		name: 'bambora',
		src: 'https://libs.na.bambora.com/customcheckout/1/customcheckout.js'
	} as ScriptModel;

	DEFAULT_STYLE = {
		padding: '0',
		fontSize: '15px',
		color: '#6d7273',
		fontFamily: 'proxima-nova, "HelveticaNeue-Light",  \
		"Helvetica Neue Light", "Helvetica Neue", Helvetica, \
		Arial, "Lucida Grande", sans-serif',
	}

	LOGO_PATH = 'https://cdn.na.bambora.com/downloads/images/cards/';

	private customCheckout;

	private formValidation = {
		'card-number': {
			error: null,
			focus: false,
			complete: false,
			background: null
		},
		'cvv': {
			error: null,
			complete: false,
			focus: false
		},
		'expiry': {
			error: null,
			complete: false,
			focus: false
		},
	}

	private creditInput;
	private cvvInput;
	private expiryInput;

	loadScriptSubscriptionRef;

	constructor(private jsLoader: JSLoaderService) { }

	/**
	 * Init Bambora and save main function to const
	 */
	init() {
		this.loadScriptSubscriptionRef = this.jsLoader.load(this.BAMBORA_SCRIPT, false).subscribe(b => {
			if (b.loaded) {
				this.customCheckout = customcheckout();
				this.initCustomCheckout()
			}
		})
	}

	/**
	 * Destroy
	 */
	destroy() {
		// unmounting the inputs actually creates errors when navigating back to a page with Bambora
		if (this.loadScriptSubscriptionRef) {
			// unmount the inputs
			// if (this.creditInput) {
			// 	this.creditInput.unmount();
			// 	this.creditInput = null;
			// }
			// if (this.cvvInput) {
			// 	this.cvvInput.unmount();
			// 	this.cvvInput = null;
			// }
			// if (this.expiryInput) {
			// 	this.expiryInput.unmount();
			// 	this.expiryInput = null;
			// }

			// this.customCheckout = null;
			// if (this.loadScriptSubscriptionRef) {
			// 	this.loadScriptSubscriptionRef.unsubscribe();
			// 	this.loadScriptSubscriptionRef = null;
			// }
			// this.jsLoader.load(this.BAMBORA_SCRIPT, true)
			console.log('destroy bambora')
		}
	}

	/**
	 * Clear Inputs
	 */
	clearInputs() {
		this.creditInput.clear();
		this.cvvInput.clear();
		this.expiryInput.clear();

		this._createInputs()
	}
	/**
	 * Set up the form
	 */
	initCustomCheckout() {
		if (this.customCheckout) {
			// console.log('Bambora loaded', this.customCheckout)
			this._createInputs();
			this._addListeners();
		} else {
			// console.log('Bambora loading')

			this.init()
		}
	}
	/**
	 * Create the inputs
	 */
	private _createInputs() {
		const options = {
			style: {
				base: {}
			},
			placeholder: ''
		};
		options.style.base = this.DEFAULT_STYLE;
		// Create and mount the inputs
		options.placeholder = '    -    -    -    ';
		if (!this.creditInput) {
			// only create the input once
			this.creditInput = this.customCheckout.create('card-number', options);
		}
		this.creditInput.mount('#card-number');

		options.placeholder = ' ';
		if (!this.cvvInput) {
			// only create the input once
			this.cvvInput = this.customCheckout.create('cvv', options);
		}
		this.cvvInput.mount('#cvv');

		options.placeholder = 'MM / YY';
		if (!this.expiryInput) {
			// only create the input once
			this.expiryInput = this.customCheckout.create('expiry', options);
		}
		this.expiryInput.mount('#expiry');
	}

	/**
	 * Setup bambora listeners
	 */
	private _addListeners() {
		this.customCheckout.on('brand', (event) => {
			// console.log('brand: ' + JSON.stringify(event));
			let cardLogo = 'none';
			this.formValidation['card-number'].background = null;
			if (event.brand && event.brand !== 'unknown') {
				const filePath =
					this.LOGO_PATH +
					event.brand +
					'.svg';
				cardLogo = 'url(' + filePath + ')';
			}
			this.formValidation['card-number'].background = cardLogo;
		});

		this.customCheckout.on('blur', (event) => {
			// console.log('blur: ' + JSON.stringify(event));
			this.formValidation[event.field].focus = false;

		});

		this.customCheckout.on('focus', (event) => {
			// console.log('focus: ' + JSON.stringify(event));
			this.formValidation[event.field].focus = true;
		});

		this.customCheckout.on('empty', (event) => {
			// console.log('empty: ' + JSON.stringify(event));
			this.formValidation[event.field].error = null;

			if (event.empty) {
				this.formValidation[event.field].complete = false;
			}
		});

		this.customCheckout.on('complete', (event) => {
			// console.log('complete: ' + JSON.stringify(event));
			this.formValidation[event.field].error = null;
			this.formValidation[event.field].complete = true;
		});

		this.customCheckout.on('error', (event) => {
			// console.log('error: ' + JSON.stringify(event));
			this.formValidation[event.field].error = event.message
			this.formValidation[event.field].complete = false;
		});
	}

	/**
	 * Submit card and fetch token
	 */
	onSubmit(): Observable<TokenResultInterface> {
		return new Observable<TokenResultInterface>((observer: Observer<TokenResultInterface>) => {
			// console.log('checkout.onSubmit()');
			const callback = (result: TokenResultInterface) => {
				// console.log('token result : ' + JSON.stringify(result));
				if (result.error) {
					observer.next(result);
					observer.complete();
				} else {
					observer.next(result);
					observer.complete();
				}
			};
			// console.log('checkout.createToken()');
			this.customCheckout.createToken(callback);
		})

	}

	/**
	 * Return weither or not the form is complete
	 */
	isCardInfoComplete() {
		const ids = Object.keys(this.formValidation)

		return ids.filter(id => !this.formValidation[id].complete).length < 1
	}

	/**
	 * Pass Along Form Input Validations
	 */
	getFormValidation() {
		return this.formValidation
	}
}
