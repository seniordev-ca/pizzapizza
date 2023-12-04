// ngrx
import {
	createSelector,
	createFeatureSelector,
} from '@ngrx/store';

/**
 * Import all reducers
 */
import * as fromCart from './cart';
import * as fromOrders from './orders';
import * as fromPayment from './payment';
import * as fromOrderDetails from './order-details'
import * as fromTip from './tips';
import { StoreListInterface } from 'app/common/models/store-list';
import { selectCommonState } from 'app/common/reducers';
import { Product } from 'app/catalog/models/product';

/**
 * Combined state for checkout
 */
export interface CheckoutState {
	cart: fromCart.State,
	tip: fromTip.State,
	orders: fromOrders.State,
	payment: fromPayment.State,
	orderDetails: fromOrderDetails.State
}

/**
 * Combined reducer for importing to the root reducer
 */
export function cartCombinedReducer(
	state: CheckoutState = {} as CheckoutState,
	action
) {
	return {
		cart: fromCart.reducer(state.cart, action),
		tip: fromTip.reducer(state.tip, action),
		orders: fromOrders.reducer(state.orders, action),
		payment: fromPayment.reducer(state.payment, action),
		orderDetails: fromOrderDetails.reducer(state.orderDetails, action)
	}
}

// Combined selector for checkout
export const selectCheckoutState = createFeatureSelector<CheckoutState>('checkout');

/**
 * Cart
 */
let cachedCartProducts: Product[] = [] as Product[];

export const selectTip = createSelector(
	selectCheckoutState,
	(state: CheckoutState) => state.tip
)

export const isTipsLoading = createSelector(
	selectTip,
	fromTip.isTipsLoading
)

export const selectCart = createSelector(
	selectCheckoutState,
	(state: CheckoutState) => state.cart
)

export const getTipData = createSelector(
	selectCart,
	fromCart.getTipData
)

export const isTipsApplied = createSelector(
	selectTip,
	getTipData,
	(state, tipData) => {
		return tipData && tipData.tip_value > 0 ? true : state.isTipApplied;
	}
)

export const getCartLoading = createSelector(
	selectCart,
	fromCart.getIsCartLoading
)

export const getCartError = createSelector(
	selectCart,
	fromCart.getIsCartError
)
export const getCartUpdating = createSelector(
	selectCart,
	fromCart.getIsCartUpdating
)
export const selectCartEntities = createSelector(
	selectCart,
	(featuredProducts) => featuredProducts.entities
)
export const getCartIds = createSelector(
	selectCart,
	fromCart.getIds
)
export const getCartProducts = createSelector(
	selectCartEntities,
	getCartIds,
	(entities, ids) => {
		const updatedCartProducts = ids.map(id => entities[id]);
		if (cachedCartProducts.length === 0) {
			cachedCartProducts = updatedCartProducts;
		} else {
			const lineIds = updatedCartProducts.map(updatedProduct => updatedProduct.cardId);
			const cachedIds = cachedCartProducts.map(cachedProduct => cachedProduct.cardId);
			const newIds = lineIds.filter(id => cachedIds.indexOf(id) < 0);
			const removedIds = cachedIds.filter(id => lineIds.indexOf(id) < 0);
			// add new products
			newIds.forEach(newId => {
				cachedCartProducts.push(entities[newId])
			})
			// remove old products
			removedIds.forEach(id => {
				const remove = cachedCartProducts.find(cartItem => cartItem.cardId === id);
				const index = cachedCartProducts.indexOf(remove);
				cachedCartProducts.splice(index, 1)
			})
			// update products
			cachedCartProducts.forEach(cartProduct => {
				const updatedItem = updatedCartProducts.find(item => item.cardId === cartProduct.cardId);
				cartProduct.quantity = updatedItem.quantity;
				cartProduct.description = updatedItem.description;
				cartProduct.name = updatedItem.name;
				cartProduct.priceText = updatedItem.priceText;
			})
		}
		return cachedCartProducts;
	}
)
export const getCartSummary = createSelector(
	selectCart,
	fromCart.getCartSummary
)
export const getIsCartValid = createSelector(
	selectCart,
	fromCart.getIsCartValid
)
export const getIsCartOnlyAlcohol = createSelector(
	selectCart,
	fromCart.getIsCartOnlyAlcohol
)
export const getInvalidCartProducts = createSelector(
	selectCart,
	(state) => {
		return state.invalidCartProducts ? state.invalidCartProducts.join(', ') : null
	}
)
export const getCartTotal = createSelector(
	getCartSummary,
	(summary) => {
		const isSubTotalZero = summary ? summary.subtotal <= 0 : true
		return isSubTotalZero ? 0 : summary.total

	}
)

export const getIsCartHidden = createSelector(
	selectCart,
	(state) => state.isCartHidden
)

export const getCartClubEarnings = createSelector(
	selectCart,
	(state) => state.cartClubEarnings
)

export const getLoyaltyRedeemedInCart = createSelector(
	getCartSummary,
	(summary) => summary && summary.loyalty ? summary.loyalty.amount : 0
)

/**
 * ORDER DETAILS
 */
export const selectOrderDetails = createSelector(
	selectCheckoutState,
	(state: CheckoutState) => state.orderDetails
)
export const getSelectedAddressId = createSelector(
	selectOrderDetails,
	(state) => state.selectedAddressID
)

export const getSelectedStoreId = createSelector(
	selectOrderDetails,
	(state) => state.selectedStoreID
)

export const getSelectedStorePayments = createSelector(
	selectOrderDetails,
	(state) => state.selectedStore ? state.selectedStore.payments : null
)

const removeDuplicates = (array, key) => {
	return array.reduce((arr, item) => {
		const removed = arr.filter(i => i[key] !== item[key]);
		return [...removed, item];
	}, []);
};

export const getStoreSearchList = createSelector(
	selectOrderDetails,
	selectCommonState,
	(state, commonState) => {
		const storeList = state.storeSearchList;
		const isDelivery = commonState.store.isDeliveryTabActive;
		// Add store from header
		const selectedFromHeaderMapped = commonState.store.selectedStore ? {
			storeId: commonState.store.selectedStore.store_id,
			storeAddress: commonState.store.selectedStore.address,
			marketPhoneNumber: commonState.store.selectedStore.market_phone_number,
			province: commonState.store.selectedStore.province,
			postalCode: commonState.store.selectedStore.postal_code,
			city: commonState.store.selectedStore.city
		} as StoreListInterface : null
		if (storeList) {
			// remove duplicate of store ids
			if (!isDelivery) {
				storeList.push(selectedFromHeaderMapped)
			}
			return removeDuplicates(state.storeSearchList, 'storeId')
		}
		return !isDelivery ? [selectedFromHeaderMapped] : [];
	}
)

export const getIsCheckoutStoreValid = createSelector(
	selectOrderDetails,
	(state) => state.isCheckoutStoreValid
)

export const getUserDeliveryAddressInput = createSelector(
	selectOrderDetails,
	(state) => state.userDeliveryAddressInput
)

export const getCheckoutStoreHours = createSelector(
	selectOrderDetails,
	(state) => state.selectedStoreHours
)

export const getIsStoreClosed = createSelector(
	selectOrderDetails,
	fromOrderDetails.getIsStoreClosed
)

export const getMpDecodedData = createSelector(
	selectOrderDetails,
	(state) => {
		const isMpFetched = state.isMpDecodingFetched;
		return isMpFetched ? state.mpDecodedData : null
	}
)

/** ORDERS */
export const selectOrders = createSelector(
	selectCheckoutState,
	(state: CheckoutState) => state.orders
)
export const getOrderStatus = createSelector(
	selectOrders,
	fromOrders.getOrderStatus
)
export const getOrderHistoryCursor = createSelector(
	selectOrders,
	fromOrders.getOrderHistoryCursor
)
export const selectOrderHistoryEntities = createSelector(
	selectOrders,
	(orders) => orders.entities
)

export const getOrderHistoryIds = createSelector(
	selectOrders,
	fromOrders.getIds
)

export const getOrderHistory = createSelector(
	selectOrderHistoryEntities,
	getOrderHistoryIds,
	(entities, ids) => {
		return ids.map(id => entities[id])
	}
)
export const getActiveOrder = createSelector(
	selectOrders,
	(orders) => orders.activeOrder
)

export const isOrdersLoading = createSelector(
	selectCheckoutState,
	(state) => {
		return state.orders.isLoading && !state.orders.isFetched
	}
)

export const getOrderStatusTimeout = createSelector(
	selectCheckoutState,
	(state) => state.orders.orderStatusTimeOut
)

export const isOrderStatusFailure = createSelector(
	selectCheckoutState,
	(state) => state.orders.orderStatusError
)
export const getInvalidProductsFromRepeatOrder = createSelector(
	selectCheckoutState,
	(state) => state.orders.invalidCartProducts
)

export const getOrderError = createSelector(
	selectCheckoutState,
	(state) => state.orderDetails.orderFaiureReason
)
/**
 * Payments
 */
export const selectPayments = createSelector(
	selectCheckoutState,
	(state: CheckoutState) => state.payment
)

export const isMpRedirectLoading = createSelector(
	selectPayments,
	fromPayment.isMpRedirectLoading
)

export const getSecurePaymentHTML = createSelector(
	selectPayments,
	(state) => state.securePaymentHTML
)
