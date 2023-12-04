import { OrderTypeEnum } from './order-checkout';

export interface ServerOrderHistoryInterface {
	cursor: string,
	orders: ServerOrderDetailsInterface[]
}

export interface ServerOrderDetailsInterface {
	order_id: number,
	summary: {
		total: number,
		order_components: ServerOrderComponentInterface[],
		redemption_components: [{
			code: string,
			label: string,
			sort_id: number,
			value: number
		}],
	},
	order_type: OrderTypeEnum,
	order_type_text: OrderTypeEnum,
	order_date: string,
	order_time: string,
	total: number,
	order_lines: ServerOrderLineInterface[],
	address_nickname: string,
	delivery_address: string,
	pickup_address: string
}

export interface ServerOrderLineInterface {
	price: 0,
	image: string,
	name: {},
	description: string,
	quantity: number,
	is_available: boolean
}

export interface ServerOrderComponentInterface {
	code?: string,
	sort_id: number,
	value: number,
	label: string
}
