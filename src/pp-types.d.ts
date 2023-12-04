
declare interface IEnvConfig {
	isProdModeEnabled: boolean;
	isEnvPickerEnabled: boolean;
	env: string;
	apiHost: string;
	googleServiceKey: string;
	visaCheckoutKey: string;
	visaCheckoutSDKUrl: string;
	visaCheckoutBtnPath: string;
	fbAppId: string;
	googleOauthClientId: string;
	tagAnalyticsKey: string;
	recaptchaClientKey: string;
	kumulosApiKey: string;
	kumulosSecretKey: string;
	kumulosVapidPublicKey: string;
}
