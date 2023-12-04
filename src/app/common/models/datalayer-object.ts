export interface DataLayerObjectInterface {
	event: string;
	eventAction: string;
	eventCategory: string;
	eventLabel: string;
	eventValue?: number
}
/**
 * Data Layer Event Enum
 */
export enum DataLayerEventEnum {
	SIGNINCTA = 'signincta',
	FORGOTPW = 'forgotpw',
	REGISTRATIONSTART = 'registrationStarted',
	RESETPW = 'resetpw',
	SIGNINBTN = 'signinbutton',
	SAVEPW = 'savepw',
	CLCKTOREEDEM = 'clicktoredeem'
}

/**
 * Data Layer FOR REGISTRATION
 */
export enum DataLayerRegistrationEventEnum {
	REGSTARTED = 'registrationStarted',
	REGCONTINUE = 'registrationContinue',
	REGCLICK = 'registerClick',
	JUSTACC = 'justaccount'
}

/**
 * Data Layer Notification Action Enum
 */
export enum DataLayerNotificationActionsEnum {
	UPSIZING = 'Upsize message',
	GLOBALERROR = 'Global Error' // placeholder for now
}
