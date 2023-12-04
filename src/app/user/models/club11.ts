
export interface TransactionHistoryRowInterface {
	date: string,
	amount: number,
	type: string,
	location: string,
	loyalty: number,
}

export interface Club11BalanceInterface {
	available: number,
	balanceToken: string,
	maskedCardNumber: string,
	earned: number,
	loyaltyPercentage: number,
	requireText: string,
	earnedText: string,
	balanceReadyText: string,
	earningsBanner: {
		message: string,
		showBanner: boolean
	}
}

export interface Club1111AddFundsUIInterface {
	amount: number,
	token: string,
	name: string,
	email: string
}

export interface Club1111AddFundsSettingsUIInterface {
	type: string[],
	frequency: string[],
	amount: [{
		label: string,
		value: number
	}]
}

export interface Club1111AutoReloadSettingsUIInterface extends Club1111AddFundsUIInterface {
	type?: string,
	frequency?: string,
	thresholdAmount?: number,
	enabled?: boolean
}
/**
 * Club 11 component has different UI on different page
 * List of all possible parent containers
 */
export enum Club11CardParentContainers {
	loyalty,
	account,
	orderConfirmation,
	checkout,
}
