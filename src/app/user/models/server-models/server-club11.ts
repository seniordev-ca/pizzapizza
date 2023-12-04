

export interface Club11BalanceResponse {
	available: number,
	card_balance_token: string,
	card_number: string,
	earned: number
	earned_text: string,
	loyalty_percentage: number,
	require_text: string,
	checkout_earnings: {
		is_displayed: boolean,
		message: string
	},
	club_11_11_earnings: string,
	earnings_banner: {
		message: string,
		show_banner: boolean
	}
}

export interface GiftCardBalanceRequest {
	number: string,
	pin: number,
	cursor?: string
}

export interface ServerGiftCardBalance {
	balance: number
}
export interface GiftCardBalanceResponse extends ServerGiftCardBalance {
	card_balance_token: string
}

export interface ClubTransactionsResponse {
	cursor: string,
	balance: number,
	transactions: [{
		date: string,
		amount: number,
		type: string,
		location: string,
		loyalty: number,
		time: string
	}]
}


export interface ServerTransferBalanceRequest {
	amount: number,
	loyalty_card_token: string,
	card_balance_token: string
}

export interface ServerClub1111RedeemRequest {
	store_id: 0,
	amount: 0,
	is_delivery: true
	loyalty_card_token?: string,
	card_balance_token?: string,
}

export interface ServerClub1111AddFundsSettings {
	type: string[],
	frequency: string[],
	load_amount: number[]
}

export interface ServerClub111AddFundsRequest {
	amount?: number,
	loyalty_card_token?: string,
	payment_data?: {
		token: string,
		name: string
	},
	email?: string,
	threshold_amount?: number
}

export interface ServerClub1111AutoReloadSettings extends ServerClub111AddFundsRequest {
	frequency?: string,
	threshold_amount?: number,
	type?: string,
	loyalty_card_token?: string,
	enabled: boolean,
}

