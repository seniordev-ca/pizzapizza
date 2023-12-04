// ng rx
import {
	createEntityAdapter,
	EntityAdapter,
	EntityState
} from '@ngrx/entity';
import { OrderInformationInterface } from '../components/order-confirmation/order-info/order-info.component';
import { ProcessStepStatusEnum } from '../components/order-confirmation/process-steps/process-steps.component';

import { SignUpActionTypes, SignUpActions } from '../../user/actions/sign-up-actions';
import { CartActions, CartActionsTypes } from '../../checkout/actions/cart';
import { OrderActions, OrderActionsTypes } from '../actions/orders'
import { OrderMapper } from './mappers/orders-mapper';

import { OrderSummaryInterface } from '../models/order-checkout';
import { OrderStatusTrackerKindEnum } from '../models/server-process-order-response';

// Env config
import { environment, googleMapStyle } from '../../../environments/environment';
import { CartMapper } from './mappers/cart-mapper';
export interface State extends EntityState<OrderInformationInterface> {
	isLoading: boolean,
	isFetched: boolean,
	isInitalLoad: boolean,
	ids: number[],
	entities: {
		[index: string]: OrderSummaryInterface,
	},
	orderStatus: OrderInformationInterface
	orderHistoryCursor: string,
	orderStatusTimeOut: number,
	orderStatusError: boolean,
	invalidCartProducts: string[],
	activeOrder: OrderSummaryInterface,
}

export const adapter: EntityAdapter<OrderSummaryInterface> = createEntityAdapter<OrderSummaryInterface>({
	selectId: (order: OrderSummaryInterface) => order.orderId,
	sortComparer: false
})
export const initialState: State = adapter.getInitialState({
	isLoading: true,
	isFetched: false,
	isInitalLoad: true,
	ids: [],
	entities: {},
	orderStatus: {
		orderId: null,
		name: null,
		phone: null,
		address: null,
		timeGuarantee: null,
		tracker: null,
	},
	orderStatusError: false,
	orderHistoryCursor: null,
	orderStatusTimeOut: null,
	invalidCartProducts: null,
	activeOrder: null
})
/**
 * Order reducer
 */
export function reducer(
	state = initialState,
	action: OrderActions | SignUpActions | CartActions
) {
	switch (action.type) {

		case OrderActionsTypes.FetchOrderById: {
			return adapter.removeAll({
				...state,
				isLoading: true,
				isFetched: false,
				orderHistoryCursor: null,
				activeOrder: null
			})
		}

		case OrderActionsTypes.FetchOrderByIdSuccess: {
			const orderStatusFromServer = action.orderRequestResponse;
			const baseUrl = action.baseUrl;
			const mappedOrder = OrderMapper.mapSingleOrder(orderStatusFromServer, baseUrl);

			// const changes = mappedOrder.mappedOrder;
			const newStatus = mappedOrder.orderStatus;
			const orderStatus = {
				...state.orderStatus,
				...newStatus
			}

			return {
				...state,
				isInitalLoad: true,
				orderStatus,
				activeOrder: mappedOrder.mappedOrder
			}
		}

		case OrderActionsTypes.RefetchOrderStatus: {
			return {
				...state,
				orderStatusTimeOut: null
			}
		}
		case OrderActionsTypes.FetchOrderStatusByIdSuccess: {
			const tracker = action.orderRequestResponse.tracker;
			const orderStatusTimeOut = action.orderRequestResponse.next_status_avail_in_sec;
			const currentOrderTrackingObj = tracker.find(step => step.status === ProcessStepStatusEnum.onActive);
			const currentOrderStatusLabel = currentOrderTrackingObj.title;
			const baseUrl = action.baseUrl;
			const googleAPIKey = environment.googleServiceKey;
			const mapStyleJson = googleMapStyle;

			const googleBaseUrl =
				'https://maps.googleapis.com/maps/api/staticmap?zoom=16&size=800x250&key=' + googleAPIKey + '&center=';
			const mappedTracker = tracker.map(trackerStatus => {
				const imgBase = trackerStatus.kind === OrderStatusTrackerKindEnum.IMG ? baseUrl : googleBaseUrl;
				return {
					status: trackerStatus.status,
					orderId: state.orderStatus.orderId,
					title: trackerStatus.title,
					subtitle: trackerStatus.description,
					image: imgBase + trackerStatus.image_data,
					kind: trackerStatus.kind,
					tracking_url: trackerStatus.tracking_url
				}
			})
			// mappedTracker[mappedTracker.length - 1].status = 'in_progress'
			const orderStatus = {
				...state.orderStatus,
				tracker: mappedTracker,
				currentOrderStatusLabel
			}

			return {
				...state,
				orderStatus,
				orderStatusTimeOut
			}
		}

		case OrderActionsTypes.FetchOrderStatusByIdFailed: {
			return {
				...state,
				orderStatusError: true
			}
		}

		case OrderActionsTypes.FetchAllOrders: {
			const orderIds = state.ids;
			orderIds.forEach(id => {
				state.entities[id].selected = false
			})
			return {
				...state,
				isLoading: true,
				isFetched: false,
			}
		}

		case OrderActionsTypes.FetchAllOrdersSuccess: {
			const serverResponse = action.orderHistory;
			const baseUrl = action.baseUrl;

			const mappedSummary = OrderMapper.mapOrderHistory(serverResponse.orders, baseUrl);

			return adapter.upsertMany(mappedSummary, {
				...state,
				isLoading: false,
				isFetched: true,
				isInitalLoad: false,
				// orderHistory: mappedSummary, -> should be removed, since currently not used
				orderHistoryCursor: serverResponse.cursor
			})
		}

		case OrderActionsTypes.FetchAllOrdersFailed: {
			return {
				...state,
				isLoading: false,
				isFetched: true,
				orderHistoryCursor: null
			}
		}

		case OrderActionsTypes.ValidateRepeatOrder: {
			const loadingOrder = action.orderId;
			const activeOrder = state.entities[loadingOrder]
			if (activeOrder) {
				activeOrder.isLoading = true;
			}
			return {
				...state,
				invalidCartProducts: null
			}
		}

		// Clear loading state on validation
		case OrderActionsTypes.ClearOrdersLoading:
		case CartActionsTypes.TooManyItemsInCartFailure: {
			const orderIds = state.ids;
			orderIds.forEach(id => {
				state.entities[id].isLoading = false
			})
			return {
				...state
			}
		}

		case OrderActionsTypes.ValidateRepeatOrderSuccess: {
			const invalidOrder = action.validationResponse.products
			const mappedInvalidProducts = CartMapper.mapInvalidCartProducts(invalidOrder);

			return {
				...state,
				invalidCartProducts: mappedInvalidProducts
			}
		}

		case OrderActionsTypes.AddOrderToCartSuccess: {
			const orderId = action.orderId;
			const activeOrder = state.entities[orderId]
			if (activeOrder) {
				// only mark as selected if there are more items than invalid products
				activeOrder.selected = state.invalidCartProducts ? activeOrder.cartItems.length > state.invalidCartProducts.length : true
				activeOrder.isLoading = false;
			}
			return {
				...state,
				invalidCartProducts: null
			}
		}
		case OrderActionsTypes.AddOrderToCartFailed: {
			const orderIds = state.ids;
			orderIds.forEach(id => {
				state.entities[id].selected = false;
				state.entities[id].isLoading = false;
			})

			return {
				...state
			}
		}

		case OrderActionsTypes.ClearAddedOrders: {
			const orderIds = state.ids;
			orderIds.forEach(id => {
				state.entities[id].selected = false
			})
			return {
				...state
			}
		}

		/**
		 * When the user signs in/out we should clear this state as it is all related to user
		 */
		case SignUpActionTypes.UserLogsOut:
		case SignUpActionTypes.UserLoginSuccess: {
			return adapter.removeAll(initialState)
		}
		default: {
			return state;
		}
	}
}

export const getOrderStatus = (state: State) => {
	return state.orderStatus;
}
export const getIds = (state: State) => state.ids;

export const getOrderHistoryCursor = (state: State) => {
	return state.orderHistoryCursor;
}
