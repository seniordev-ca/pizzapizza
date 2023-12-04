import { ServerOrderDetailsInterface } from '../../models/server-order-details';
import { OrderSummaryInterface, OrderTypeEnum } from '../../models/order-checkout';
import { ServerProcessOrderResponse } from '../../models/server-process-order-response';

export class OrderMapper {
	/**
	 * Map server response to ui for order history
	 */
	static mapOrderHistory(
		serverResponse: ServerOrderDetailsInterface[],
		imageBaseUrl: string
	): OrderSummaryInterface[] {
		const orders = serverResponse;
		const mappedOrders = orders.map(order => {
			const mappedCartItems = order.order_lines.map(line => {
				return {
					price: line.price,
					image: imageBaseUrl + '2x/' + line.image,
					name: line.name,
					description: line.description,
					quantity: line.quantity,
					expired: !line.is_available
				}
			});
			const mappedOrderComponents = order.summary.order_components
				.sort(function (leftProduct, rightProduct) {
					return leftProduct.sort_id - rightProduct.sort_id;
				})
				.map(component => {
					return {
						label: component.label,
						value: component.value,
						code: component.code
					}
				})

			// Deep copy to avoid server data mutation
			let serverRedeemtionComponent = Object.assign(
				[],
				order.summary.redemption_components
			);

			// Sorting
			serverRedeemtionComponent = serverRedeemtionComponent.sort(
				(compareLeft, compareRight) => compareLeft.sort_id - compareRight.sort_id
			);
			const redemptionComponents = serverRedeemtionComponent.map(redeemComponents => {
				return {
					code: redeemComponents.code,
					label: redeemComponents.label,
					value: redeemComponents.value
				};
			});
			return {
				orderId: order.order_id,
				orderDate: order.order_date,
				orderTime: order.order_time,
				orderType: order.order_type,
				orderTypeText: order.order_type_text,
				orderLocationName: order.address_nickname,
				total: order.total,
				cartItems: mappedCartItems,
				orderComponent: mappedOrderComponents,
				redemptionComponents,
				isUnavailable: mappedCartItems.filter(item => item.expired).length === mappedCartItems.length
			} as OrderSummaryInterface
		})
		return mappedOrders;
	}

	/**
	 * Map Single Order
	 */
	static mapSingleOrder(orderDetails: ServerProcessOrderResponse, imageBaseUrl: string
	) {
		const orderStatus = {
			name: orderDetails.name,
			phone: orderDetails.phone_number,
			phoneExtension: orderDetails.phone_number_extension,
			address: orderDetails.order_type === OrderTypeEnum.DELIVERY ? orderDetails.delivery_address : orderDetails.pickup_address,
			timeGuarantee: orderDetails.guarantee_text,
			orderId: orderDetails.order_id,
			orderType: orderDetails.order_type_text,
			orderTypeText: orderDetails.order_type_text,
			orderLocationName: orderDetails.address_nickname,
			earnedText: orderDetails.club_11_11_earnings,
		}
		const mappedCartItems = orderDetails.order_lines.map(line => {
			return {
				price: line.price,
				image: imageBaseUrl + '2x/' + line.image,
				name: line.name,
				description: line.description,
				quantity: line.quantity,
				expired: !line.is_available
			}
		});
		const mappedOrderComponents = orderDetails.summary.order_components
			.sort(function (leftProduct, rightProduct) {
				return leftProduct.sort_id - rightProduct.sort_id;
			})
			.map(component => {
				return {
					label: component.label,
					value: component.value,
					code: component.code
				}
			})
		// Deep copy to avoid server data mutation
		let serverRedeemtionComponent = Object.assign(
			[],
			orderDetails.summary.redemption_components
		);

		// Sorting
		serverRedeemtionComponent = serverRedeemtionComponent.sort(
			(compareLeft, compareRight) => compareLeft.sort_id - compareRight.sort_id
		);
		const redemptionComponents = serverRedeemtionComponent.map(redeemComponents => {
			return {
				code: redeemComponents.code,
				label: redeemComponents.label,
				value: redeemComponents.value
			};
		});
		const mappedOrder = {
			orderId: orderDetails.order_id,
			orderDate: orderDetails.order_date,
			orderTime: orderDetails.order_time,
			orderType: orderDetails.order_type_text,
			orderLocationName: orderDetails.address_nickname,
			total: orderDetails.total,
			cartItems: mappedCartItems,
			orderComponent: mappedOrderComponents,
			redemptionComponents,
			isUnavailable: mappedCartItems.filter(item => item.expired).length === mappedCartItems.length
		} as OrderSummaryInterface

		return { orderStatus, mappedOrder }
	}
}
