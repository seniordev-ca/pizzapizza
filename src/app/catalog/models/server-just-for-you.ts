
/**
 * Just for use types
 */
export enum serverJustForYouKinds {
	repeat_order = 'repeat_order',
	club_11_11 = 'club_11_11',
	my_pizzas = 'my_pizzas',
	product_list = 'product_list',
	coupone_wallet = 'coupon_wallet'
}

export interface ServerJustForYouInterface {
	meta: {
		home_limit: number
		image: string
		title: string
	}
	cards: ServerJustForYouCardInterface[]
}

export interface ServerJustForYouCardInterface {
	id: number,
	kind: serverJustForYouKinds,
	sequence: number,
	image: string,
	label: string,
	data: {
		description: string
		order_total: number
		seo_title: string
		coupon_count?: number
	}
}
