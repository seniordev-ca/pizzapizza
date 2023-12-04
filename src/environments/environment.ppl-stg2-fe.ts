/* tslint:disable:indent */
// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment: IEnvConfig = {
  isProdModeEnabled: true,
  isEnvPickerEnabled: false,
  env: 'ppl-uat3-fe',
  apiHost: '/ajax', // Same as hosted static files
  googleServiceKey: 'AIzaSyBJtkkmycsGu3Ml5P87o_h-tDHi1q-xlPc',
  visaCheckoutKey: 'YDB291TDZY5ZFKORVWGH13dxZerSNQBVXW2UYVG9Q3CDW9jMI',
  visaCheckoutSDKUrl: 'https://sandbox-assets.secure.checkout.visa.com/checkout-widget/resources/js/integration/v1/sdk.js',
  visaCheckoutBtnPath: 'https://sandbox.secure.checkout.visa.com/wallet-services-web/xo/button.png',
  fbAppId: '624145881267740',
  // googleOauthClientId: '3983222672-irlctb7qil6ucpl0fvr6v63mgj4mm53s.apps.googleusercontent.com',
  // googleOauthClientId: '852383522341-7verl5g8iv1737nlh8al7dne296mj8ib.apps.googleusercontent.com',
  googleOauthClientId: '604199782140-5dp5gtv28abqlpgnv02afnibktgm7mbu.apps.googleusercontent.com',
  tagAnalyticsKey: 'GTM-MRL8SHB',
  recaptchaClientKey: '6LdbxLMUAAAAAFkT-03uAAXPZZdo33d0SNZocZWn',
  kumulosApiKey: 'f0828c45-0e7b-4a8b-82ed-320d0cf5575f',
  kumulosSecretKey: 'GREVb/IBtQ6ypf9sjN/r04TjtIrm6X+7HEDz',
  kumulosVapidPublicKey: 'BD2o4UDhvc7kKaQVqDjrX0ehEM0rbu6eNwO14UCm9F2h7Q05cwkijbJmePdkW4IRjgq0szMgkE4bqQpp1U0PikE'
};

// Temp setup to use prod keys on UAT
environment.googleServiceKey = 'AIzaSyBJtkkmycsGu3Ml5P87o_h-tDHi1q-xlPc';
environment.visaCheckoutKey = 'YDB291TDZY5ZFKORVWGH13dxZerSNQBVXW2UYVG9Q3CDW9jMI';
environment.visaCheckoutSDKUrl = 'https://sandbox-assets.secure.checkout.visa.com/checkout-widget/resources/js/integration/v1/sdk.js';
environment.visaCheckoutBtnPath = 'https://sandbox.secure.checkout.visa.com/wallet-services-web/xo/button.png';
environment.fbAppId = '134691203322543';
// environment.googleOauthClientId = '3983222672-irlctb7qil6ucpl0fvr6v63mgj4mm53s.apps.googleusercontent.com';
environment.googleOauthClientId = '604199782140-5dp5gtv28abqlpgnv02afnibktgm7mbu.apps.googleusercontent.com';



import { imageBaseUrls, googleMapStyle } from './common';
export { imageBaseUrls, googleMapStyle };
