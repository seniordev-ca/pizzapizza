import { ServerCartResponseInterface } from './server-cart-response';
import { Club11BalanceResponse } from '../../user/models/server-models/server-club11';

export interface RedeemClubCardRequest {
	store_id: number,
	is_delivery: boolean,
	amount: number,
	card_balance_token: string,
	loyalty_card_token?: string,
	gift_card?: {
		number: string,
		pin: string,
	}
}

export interface RedeemClubCardResponse {
	earnings: Club11BalanceResponse,
	cart: ServerCartResponseInterface
}
