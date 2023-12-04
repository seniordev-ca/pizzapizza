// ngrx
import { Action } from '@ngrx/store';
import { AddressListInterface } from '../../common/models/address-list';
import { ServerProcessOrderResponse, ServerOrderStatusResponse } from '../models/server-process-order-response';
import { ServerValidationError } from '../../common/models/server-validation-error';
import { ServerOrderHistoryInterface } from '../models/server-order-details';
import { ServerCartResponseInterface } from '../models/server-cart-response';
import { ServerOrderPaymentInterface, ServerOrderPaymentTypeEnum} from '../models/server-process-order-request';


/**
 * Orders REDUX action
 */
export enum OrderActionsTypes {
	// TODO Adam why build is also sending it?!
	BuildOrderRequest = '[Checkout](Orders) BuildOrderRequest',
	EncodeOrderRequest = '[Checkout](Orders) EncodeOrderRequest',
	ProcessOrderRequestSuccess = '[Checkout](Orders) Send Order For Processing Success',
	ProcessOrderRequestFailure = '[Checkout](Orders) Send Order For Processing Failure',

	FetchOrderById = '[Checkout](Orders) Fetch Order By ID',
	FetchOrderByIdSuccess = '[Checkout](Orders) Fetch Order By ID Success',
	FetchOrderByIdFailed = '[Checkout](Orders) Fetch Order By ID Failed',

	FetchOrderStatusById = '[Checkout](Orders) Fetch Order Status By ID',
	FetchOrderStatusByIdSuccess = '[Checkout](Orders) Fetch Order Status By ID Success',
	FetchOrderStatusByIdFailed = '[Checkout](Orders) Fetch Order Status By ID Failed',
	RefetchOrderStatus = '[Checkout](Orders) ReFetch Order Status',

	FetchAllOrders = '[Checkout](Orders) Fetch All Orders',
	FetchAllOrdersSuccess = '[Checkout](Orders) Fetch All Orders Success',
	FetchAllOrdersFailed = '[Checkout](Orders) Fetch All Orders Failed',

	ValidateRepeatOrder = '[Checkout](Orders) Validate Repeat Order',
	ValidateRepeatOrderSuccess = '[Checkout](Orders) Validate Repeat Order Success',
	ValidateRepeatOrderFailure = '[Checkout](Orders) Validate Repeat Order Failure',

	AddOrderToCart = '[Checkout](Orders) Add Order To Cart',
	AddOrderToCartSuccess = '[Checkout](Orders) Add Order To Cart Success',
	AddOrderToCartFailed = '[Checkout](Orders) Add Order To Cart Failed',

	ClearCart = '[Checkout](Orders) Clear User Cart After Checkout',
	ClearCartSuccess = '[Checkout](Orders) Clear User Cart After Checkout Success',
	ClearCartFailure = '[Checkout](Orders) Clear User Cart After Checkout Failure',

	ClearAddedOrders = '[Checkout](Orders) Clear Added Orders',
	ClearOrdersLoading = '[Checkout](Orders) Clear Order Loading'
}

export class BuildOrderRequest implements Action {
	readonly type = OrderActionsTypes.BuildOrderRequest;
	constructor(public orderDetails: AddressListInterface, public paymentDetails: ServerOrderPaymentInterface) { }
}

export class EncodeOrderRequest implements Action {
	readonly type = OrderActionsTypes.EncodeOrderRequest;
	constructor(public orderDetails: AddressListInterface, public paymentDetails: ServerOrderPaymentInterface) { }
}

export class ProcessOrderRequestSuccess implements Action {
	readonly type = OrderActionsTypes.ProcessOrderRequestSuccess;
	constructor(public orderRequestResponse: ServerProcessOrderResponse,
		public baseUrl: string, public serverCart?: ServerCartResponseInterface, public paymentType?: ServerOrderPaymentTypeEnum  ) { }
}
export class ProcessOrderRequestFailure implements Action {
	readonly type = OrderActionsTypes.ProcessOrderRequestFailure;
	constructor(public error: ServerValidationError) { }
}

export class FetchOrderById implements Action {
	readonly type = OrderActionsTypes.FetchOrderById;
	constructor(public orderId: string) {}
}
export class FetchOrderByIdSuccess implements Action {
	readonly type = OrderActionsTypes.FetchOrderByIdSuccess;
	constructor(public orderRequestResponse: ServerProcessOrderResponse, public baseUrl: string) { }
}
export class FetchOrderByIdFailed implements Action {
	readonly type = OrderActionsTypes.FetchOrderByIdFailed;
}

export class FetchOrderStatusById implements Action {
	readonly type = OrderActionsTypes.FetchOrderStatusById;
	constructor(public orderId: string) {}
}
export class FetchOrderStatusByIdSuccess implements Action {
	readonly type = OrderActionsTypes.FetchOrderStatusByIdSuccess;
	constructor(public orderRequestResponse: ServerOrderStatusResponse, public baseUrl: string) { }
}
export class FetchOrderStatusByIdFailed implements Action {
	readonly type = OrderActionsTypes.FetchOrderStatusByIdFailed;
}
export class RefetchOrderStatus implements Action {
	readonly type = OrderActionsTypes.RefetchOrderStatus;
}

export class FetchAllOrders implements Action {
	readonly type = OrderActionsTypes.FetchAllOrders;
}
export class FetchAllOrdersSuccess implements Action {
	readonly type = OrderActionsTypes.FetchAllOrdersSuccess;
	constructor(public orderHistory: ServerOrderHistoryInterface, public baseUrl: string) { }
}
export class FetchAllOrdersFailed implements Action {
	readonly type = OrderActionsTypes.FetchAllOrdersFailed;
}

export class ValidateRepeatOrder implements Action {
	readonly type = OrderActionsTypes.ValidateRepeatOrder;
	constructor(public orderId: number) { }
}
export class ValidateRepeatOrderSuccess implements Action {
	readonly type = OrderActionsTypes.ValidateRepeatOrderSuccess;
	constructor(public validationResponse: ServerCartResponseInterface) { }
}
export class ValidateRepeatOrderFailure implements Action {
	readonly type = OrderActionsTypes.ValidateRepeatOrderFailure;
}
export class AddOrderToCart implements Action {
	readonly type = OrderActionsTypes.AddOrderToCart;
	constructor(public orderId: number) { }
}
export class AddOrderToCartSuccess implements Action {
	readonly type = OrderActionsTypes.AddOrderToCartSuccess;
	constructor(public serverResponse: ServerCartResponseInterface, public imageBaseUrl: string, public orderId: number) { }
}
export class AddOrderToCartFailed implements Action {
	readonly type = OrderActionsTypes.AddOrderToCartFailed;
}

export class ClearCart implements Action {
	readonly type = OrderActionsTypes.ClearCart
}
export class ClearCartSuccess implements Action {
	readonly type = OrderActionsTypes.ClearCartSuccess
}
export class ClearCartFailure implements Action {
	readonly type = OrderActionsTypes.ClearCartFailure
}

export class ClearAddedOrders implements Action {
	readonly type = OrderActionsTypes.ClearAddedOrders
}

export class ClearOrdersLoading implements Action {
	readonly type = OrderActionsTypes.ClearOrdersLoading
}

export type OrderActions =
	| BuildOrderRequest
	| ProcessOrderRequestSuccess
	| ProcessOrderRequestFailure

	| FetchOrderById
	| FetchOrderByIdSuccess
	| FetchOrderByIdFailed

	| FetchAllOrders
	| FetchAllOrdersSuccess
	| FetchAllOrdersFailed

	| AddOrderToCart
	| AddOrderToCartSuccess
	| AddOrderToCartFailed

	| ClearCartSuccess
	| ClearCartFailure
	| ClearCart

	| FetchOrderStatusById
	| FetchOrderStatusByIdSuccess
	| FetchOrderStatusByIdFailed
	| RefetchOrderStatus

	| ValidateRepeatOrder
	| ValidateRepeatOrderSuccess
	| ValidateRepeatOrderFailure

	| ClearAddedOrders
	| ClearOrdersLoading
