// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment: IEnvConfig = {
	isProdModeEnabled: false,
	isEnvPickerEnabled: true,
	env: 'local',
	apiHost: '/ajax',
	googleServiceKey: 'AIzaSyAfi4I9Wr8jK5C317HxXGXUhalllPFxLfg',
	visaCheckoutKey: 'YDB291TDZY5ZFKORVWGH13dxZerSNQBVXW2UYVG9Q3CDW9jMI',
	visaCheckoutSDKUrl: 'https://sandbox-assets.secure.checkout.visa.com/checkout-widget/resources/js/integration/v1/sdk.js',
	visaCheckoutBtnPath: 'https://sandbox.secure.checkout.visa.com/wallet-services-web/xo/button.png',
	fbAppId: '624145881267740',
	googleOauthClientId: '529491074325-ds06japs2j4m6j83mqeff3top68nl1ui.apps.googleusercontent.com',
	tagAnalyticsKey: 'GTM-MRL8SHB',
	recaptchaClientKey: '6Ld1MbAUAAAAAPcFJqLdbOHzAptLMzkPIC22RW4L',
	kumulosApiKey: '61c3bf31-6e02-459f-acdd-3babfb39e9a6',
	kumulosSecretKey: 'DpacTnhtQFG4XYVPV0axBLkEyjFw+ZNYsjwF',
	kumulosVapidPublicKey: 'BJz2_S6WrA1d3h8qCruL67mpchR1gPvIJCjrczbg2DfysZx2IIWIC_pXOQPOBKdeYM72VzwiVMD06kVJG6ERVLc'
};

export * from './common';
