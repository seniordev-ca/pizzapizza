/* tslint:disable:indent */
// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment: IEnvConfig = {
  isProdModeEnabled: true,
  isEnvPickerEnabled: false,
  env: 'ppl-stg-fe',
  apiHost: '/ajax', // Same as hosted static files
  googleServiceKey: 'AIzaSyBJtkkmycsGu3Ml5P87o_h-tDHi1q-xlPc',
  visaCheckoutKey: 'YDB291TDZY5ZFKORVWGH13dxZerSNQBVXW2UYVG9Q3CDW9jMI',
  visaCheckoutSDKUrl: 'https://assets.secure.checkout.visa.com/checkout-widget/resources/js/integration/v1/sdk.js',
  visaCheckoutBtnPath: 'https://secure.checkout.visa.com/wallet-services-web/xo/button.png',
  fbAppId: '624145881267740',
  // prod oauth key
  // googleOauthClientId: '3983222672-irlctb7qil6ucpl0fvr6v63mgj4mm53s.apps.googleusercontent.com',
  googleOauthClientId: '904223452121-g82kerntovgn5m69m1mfkc5g7koip9vq.apps.googleusercontent.com',
  tagAnalyticsKey: 'GTM-MRL8SHB',
  recaptchaClientKey: '6LdbxLMUAAAAAFkT-03uAAXPZZdo33d0SNZocZWn',
  kumulosApiKey: '02c46fa3-99e7-4b25-ab52-423f83d7d604',
	kumulosSecretKey: '9ucw5RQMB+xVBVkU/LtRgbZnb/4MI/Vjq3Wg',
	kumulosVapidPublicKey: 'BDODkUZ3S_QWrjzi6DTGFFasVCvtZ88d2_Rd4VRQgVOyNQ4rOdrNACqg7ljGrTeeP5NM0d8KfDFP57IuDIY-y5o'
};


// Temp setup to use prod keys on UAT
environment.googleServiceKey = 'AIzaSyBJtkkmycsGu3Ml5P87o_h-tDHi1q-xlPc';
environment.visaCheckoutKey = 'GK1F0NIKGNGPOGG0SZH321EzssTNu1bfFhBlLbGjAm3nLCyMY';
environment.visaCheckoutSDKUrl = 'https://assets.secure.checkout.visa.com/checkout-widget/resources/js/integration/v1/sdk.js';
environment.visaCheckoutBtnPath = 'https://secure.checkout.visa.com/wallet-services-web/xo/button.png';
environment.fbAppId = '134691203322543';
// prod oauth key
// environment.googleOauthClientId = '3983222672-irlctb7qil6ucpl0fvr6v63mgj4mm53s.apps.googleusercontent.com';
environment.googleOauthClientId = '904223452121-g82kerntovgn5m69m1mfkc5g7koip9vq.apps.googleusercontent.com';





import { imageBaseUrls, googleMapStyle } from './common';
export { imageBaseUrls, googleMapStyle };
