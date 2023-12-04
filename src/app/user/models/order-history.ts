/**
 * Defines actions that can be made on the order history component
 */
enum OrderHistoryActionsEnum {
	onSelect,
	onAddToCartClick
}

/*
/** Interface that defines actions that can be made on order history component
 */
interface OrderHistoryEmitterInterface {
	action: OrderHistoryActionsEnum,
	orderId: number
}

/*
/** Interface that dictates the data structure of the order history component
 */
interface OrderHistoryInterface {
	orderId: number,
	itemsOrdered: Array<{
		id: number;
		quantity: number;
		itemName: string,
	}>,
	orderDate: string,
	orderTime: string
}

export {
	OrderHistoryInterface,
	OrderHistoryEmitterInterface,
	OrderHistoryActionsEnum
}
