import { Injectable } from '@angular/core';
import { JSLoaderService, ScriptModel } from '../app-load-script-client';
import { Subject } from '../../../node_modules/rxjs';
import { environment } from '../../environments/environment';

/**
 * Visa Click to pay:
 * Currently "legacy=false" is the only indicator for
 * RXO vs SRC branded buttons. Load of merchant config will change query param to `false` if
 * it's SRC enabled, so if this fires too fast or before config load, it'll return a false negative.
 */

declare var V;
// declare var onVisaCheckoutReady;

export interface VisaPaymentRequestInterface {
	currencyCode: string, // likely will always be CAD
	subtotal: string // 11.00
}
export interface VisaResponseInterface {
	callid: string,
	vInitRequest: {
		apikey: string,
		paymentRequest: VisaPaymentRequestInterface,
		parentUrl: string,
		settings: {
			widgetStyle: string,
			buttonPosition: string,
			shipping: {
				collectShipping: boolean,
				acceptedRegions: [
					string
				]
			},
			payment: {
				billingCountries: [
					string
				]
			}
		},
		browserLocale: string,
		clientId: string,
		allowEnrollment: boolean,
		allowCustomBranding: boolean,
		guestCheckout: boolean,
		currencyFormat: string,
		enableUserDataPrefill: boolean,
		displayName: string
	}
	encKey?: string,
	encPaymentData?: string,
	partialPaymentInstrument?: {
		lastFourDigits: string,
		paymentType: {
			cardBrand: string,
			cardType: string
		}
	},
}
@Injectable()
export class VisaCheckoutService {
	/**
	 * For documentation visit
	 * https://developer.visa.com/capabilities/visa_checkout/docs
	 */
	VISA_SCRIPT = {
		name: 'visa-sdk',
		src: environment.visaCheckoutSDKUrl
	} as ScriptModel;

	// Might need to pass the btn img src up to the container from here
	BTN_PATH = environment.visaCheckoutBtnPath;
	VISA_KEY = environment.visaCheckoutKey;
	private isVisaSdkLoaded: boolean;
	private isVisaSdkInitiated: boolean;

	public visaResponseObject = new Subject<VisaResponseInterface>();
	loadScriptSubscriptionRef;

	constructor(private jsLoader: JSLoaderService) { }
	/**
	 * Set up visa checkout
	 */
	initVisaCheckout(visaPaymentRequest: VisaPaymentRequestInterface) {
		if (this.isVisaSdkLoaded) {
			// console.log('visa loaded')
			this._initVisaCheckout(visaPaymentRequest);
			this._addListeners();
		} else {
			// console.log('visa loading')
			this._init()
		}
	}

	/**
	 * Destroy -- we need to remove the script because the sdk doesn't seem to have any way to recheck the DOM for buttons
	 */
	destroy() {
		if (this.loadScriptSubscriptionRef) {
			this.loadScriptSubscriptionRef.unsubscribe();
		}
		this.isVisaSdkLoaded = false;
		this.isVisaSdkInitiated = false;
		this.jsLoader.load(this.VISA_SCRIPT, true)
	}

	/**
	 * Provide Button Image Source
	 */
	getBtnSrc(isClickToPay) {
		return isClickToPay ? this.BTN_PATH + '?legacy=false' : this.BTN_PATH;
	}

	/**
	 * Init Visa and update const to true
	 */
	private _init() {
		this.loadScriptSubscriptionRef = this.jsLoader.load(this.VISA_SCRIPT, false)
			.subscribe(requestedScript => {
				if (requestedScript.loaded) {
					this.isVisaSdkLoaded = true;
				}
			})
	}

	/**
	 * Visa SDK params
	 */
	private _getVisaSdkSetting(visaPaymentRequest: VisaPaymentRequestInterface) {
		return {
			apikey: this.VISA_KEY,
			paymentRequest: visaPaymentRequest,
			settings: {
				shipping: {
					collectShipping: false
				}
			}
		}
	}

	/**
	 * Init Visa
	 */
	private _initVisaCheckout(visaPaymentRequest: VisaPaymentRequestInterface) {
		// TODO Artur why we flag isVisaSdkInitiated?
		if (!this.isVisaSdkInitiated) {
			const visaInitParams = this._getVisaSdkSetting(visaPaymentRequest);
			V.init(visaInitParams);
			this.isVisaSdkInitiated = true;
		} else {
			V.setOptions(this._getVisaSdkSetting(visaPaymentRequest))
		}
	}

	/**
	 * Setup visa listeners
	 */
	private _addListeners() {
		V.on('payment.success', (payment) => {
			// console.log('success');
			this.visaResponseObject.next(payment);
		});
		V.on('payment.cancel', (payment) => {
			// console.log('cancelled');
			this.visaResponseObject.next(payment);
		});
		V.on('payment.error', (payment, error) => {
			// console.log('error', error);
			this.visaResponseObject.next(payment);
		});
	}
}
