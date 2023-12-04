/* tslint:disable:indent */
// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment: IEnvConfig = {
  isProdModeEnabled: true,
  isEnvPickerEnabled: false,
  env: 'ppl-tmp-fe',
  apiHost: '/ajax', // Same as hosted static files
  googleServiceKey: 'AIzaSyBJtkkmycsGu3Ml5P87o_h-tDHi1q-xlPc',
  visaCheckoutKey: 'YDB291TDZY5ZFKORVWGH13dxZerSNQBVXW2UYVG9Q3CDW9jMI',
  visaCheckoutSDKUrl: 'https://assets.secure.checkout.visa.com/checkout-widget/resources/js/integration/v1/sdk.js',
  visaCheckoutBtnPath: 'https://secure.checkout.visa.com/wallet-services-web/xo/button.png',
  fbAppId: '624145881267740',
  // googleOauthClientId: '3983222672-irlctb7qil6ucpl0fvr6v63mgj4mm53s.apps.googleusercontent.com',
  googleOauthClientId: '852383522341-7verl5g8iv1737nlh8al7dne296mj8ib.apps.googleusercontent.com',
  tagAnalyticsKey: 'GTM-MRL8SHB',
  recaptchaClientKey: '6LdbxLMUAAAAAFkT-03uAAXPZZdo33d0SNZocZWn',
	kumulosApiKey: '61c3bf31-6e02-459f-acdd-3babfb39e9a6',
	kumulosSecretKey: 'DpacTnhtQFG4XYVPV0axBLkEyjFw+ZNYsjwF',
	kumulosVapidPublicKey: 'BJz2_S6WrA1d3h8qCruL67mpchR1gPvIJCjrczbg2DfysZx2IIWIC_pXOQPOBKdeYM72VzwiVMD06kVJG6ERVLc'
};

// Temp setup to use prod keys on UAT
environment.googleServiceKey = 'AIzaSyBJtkkmycsGu3Ml5P87o_h-tDHi1q-xlPc';
environment.visaCheckoutKey = 'YDB291TDZY5ZFKORVWGH13dxZerSNQBVXW2UYVG9Q3CDW9jMI';
environment.visaCheckoutSDKUrl = 'https://sandbox-assets.secure.checkout.visa.com/checkout-widget/resources/js/integration/v1/sdk.js';
environment.visaCheckoutBtnPath = 'https://sandbox.secure.checkout.visa.com/wallet-services-web/xo/button.png';
environment.fbAppId = '134691203322543';
// environment.googleOauthClientId = '3983222672-irlctb7qil6ucpl0fvr6v63mgj4mm53s.apps.googleusercontent.com';
environment.googleOauthClientId = '852383522341-7verl5g8iv1737nlh8al7dne296mj8ib.apps.googleusercontent.com';



import { imageBaseUrls, googleMapStyle } from './common';
export { imageBaseUrls, googleMapStyle };
