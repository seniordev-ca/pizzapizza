import { ServerCartResponseInterface } from './server-cart-response';

export interface TipsRequest {
	tip_value: number,
	tip_type: string
}

export interface TipsResponse {
	cart: ServerCartResponseInterface
}
