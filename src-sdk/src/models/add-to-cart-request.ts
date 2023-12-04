/**
 * Add to card ingredient direction
 */
export enum HalfHalfOptionsEnum {
	left = 'left',
	right = 'right',
	whole = 'whole'
}

export interface AddCartProductServerConfigOption {
	config_code: string,
	quantity: number
	direction: HalfHalfOptionsEnum,
	sub_config_option?: string
}

export interface AddCartProductServerRequestInterface {
	line_id: number,
	product_id: string,
	product_option_id?: number,
	quantity: number,
	config_options: AddCartProductServerConfigOption[],
	cart_item_id?: number,
	child_items?: AddCartProductServerRequestInterface[]
}

export interface AddCartServerRequestInterface extends AddCartProductServerRequestInterface {
	store_id?: number,
	is_delivery?: boolean,
	products: AddCartProductServerRequestInterface[]
}
