// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment: IEnvConfig = {
	isProdModeEnabled: true,
	isEnvPickerEnabled: true,
	env: 'sit',
	apiHost: '/ajax', // Same as hosted static files
	googleServiceKey: 'AIzaSyCrFFgNF8ymUKQvAhNykLGSJCe8xUbKtCY',
	visaCheckoutKey: 'YDB291TDZY5ZFKORVWGH13dxZerSNQBVXW2UYVG9Q3CDW9jMI',
	visaCheckoutSDKUrl: 'https://sandbox-assets.secure.checkout.visa.com/checkout-widget/resources/js/integration/v1/sdk.js',
	visaCheckoutBtnPath: 'https://sandbox.secure.checkout.visa.com/wallet-services-web/xo/button.png',
	fbAppId: '624145881267740',
	googleOauthClientId: '529491074325-ds06japs2j4m6j83mqeff3top68nl1ui.apps.googleusercontent.com',
	tagAnalyticsKey: 'GTM-MRL8SHB',
	recaptchaClientKey: '6Ld1MbAUAAAAAPcFJqLdbOHzAptLMzkPIC22RW4L',
	kumulosApiKey: '02c46fa3-99e7-4b25-ab52-423f83d7d604',
	kumulosSecretKey: '9ucw5RQMB+xVBVkU/LtRgbZnb/4MI/Vjq3Wg',
	kumulosVapidPublicKey: 'BDODkUZ3S_QWrjzi6DTGFFasVCvtZ88d2_Rd4VRQgVOyNQ4rOdrNACqg7ljGrTeeP5NM0d8KfDFP57IuDIY-y5o'
};

export * from './common';
