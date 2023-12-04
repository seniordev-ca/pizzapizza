// ngrx core
// Actions
import {
	PaymentActions,
	PaymentActionsTypes
} from '../actions/payment';

import { CartActions, CartActionsTypes } from '../actions/cart';
import { OrderActionsTypes, OrderActions } from '../actions/orders';
import { SignUpActions, SignUpActionTypes } from '../../user/actions/sign-up-actions';
import { AccountActionTypes, AccountActions } from '../../user/actions/account-actions';

import { UICheckoutTimeInterface, CheckoutValidationEnum } from '../models/order-checkout';
import { isValidationOk, isValidationStoreClosed } from '../models/server-cart-response';
import { MpDecodeCheckoutSuccess } from '../models/server-payment-response';
import { StoreServerInterface } from '../../common/models/server-store';
import { AddressListInterface } from '../../common/models/address-list';
import { StoreListInterface } from '../../common/models/store-list';

import { CartMapper } from './mappers/cart-mapper';
import { AccountMapperHelper } from '../../user/reducers/mappers/account-mapper';
import { TimeFormattingService } from '../services/global-time-formatting';
import { StoreActionsTypes, StoreActions } from 'app/common/actions/store';
import { ServerValidationError } from 'app/common/models/server-validation-error';

export interface State {
	isMpDecodingFetched: boolean,
	mpDecodedData: {
		mappedAddress: AddressListInterface,
		rawDecodedData: MpDecodeCheckoutSuccess
	},
	userDeliveryAddressInput: AddressListInterface,

	selectedStoreHours: UICheckoutTimeInterface[],
	selectedAddressID: number | string,
	selectedStore: StoreServerInterface,
	selectedStoreID: number,
	storeSearchList: StoreListInterface[],

	isDelivery: boolean,
	isCheckoutStoreValid: CheckoutValidationEnum,
	isStoreClosed: boolean,

	orderFaiureReason: string
}

const initialState: State = {
	isMpDecodingFetched: false,
	mpDecodedData: null,
	userDeliveryAddressInput: null,
	selectedStoreHours: null,
	selectedAddressID: null,
	selectedStore: null,
	selectedStoreID: null,
	isDelivery: true,
	storeSearchList: null,
	isCheckoutStoreValid: CheckoutValidationEnum.NOT_VALIDATED,
	isStoreClosed: false,
	orderFaiureReason: null
}

/**
 * Payment reducer
 */
// tslint:disable-next-line:cyclomatic-complexity
export function reducer(
	state = initialState,
	action: PaymentActions | CartActions | AccountActions | OrderActions | SignUpActions | StoreActions
): State {
	switch (action.type) {
		case CartActionsTypes.FetchUserCartSuccess: {
			const isDelivery = action.serverResponse.is_delivery;
			const selectedStoreID = action.serverResponse.store_id;
			return {
				...state,
				isDelivery,
				selectedStoreID
			}
		}
		case PaymentActionsTypes.DecodeCheckoutDataSuccess: {
			const decodedData = action.decodedCheckoutData;

			const mappedUserAddress = !decodedData.is_pickup_order && decodedData.address ?
				AccountMapperHelper.parseAccountAddresses([decodedData.address])[0] : {} as AddressListInterface;

			if (decodedData.address_id) {
				mappedUserAddress.addressId = decodedData.address_id;
			}
			if (decodedData.future_order_time && decodedData.future_order_time.date) {
				mappedUserAddress.date = decodedData.future_order_time.date
				mappedUserAddress.time = TimeFormattingService.convertTo12Hour(decodedData.future_order_time.time)
			}
			if (decodedData.guest_user) {
				mappedUserAddress.address = decodedData.address ? {
					address_components: decodedData.address.address_components,
					addressString: decodedData.address_str ? decodedData.address_str : null,
					formatted_address: decodedData.address_str ? decodedData.address_str : null
				} : null
				mappedUserAddress.firstName = decodedData.guest_user.first_name,
					mappedUserAddress.lastName = decodedData.guest_user.last_name,
					mappedUserAddress.email = decodedData.guest_user.email
			}

			mappedUserAddress.contactInfo = decodedData.phone_number ? {
				extension: decodedData.phone_number.extension,
				phoneNumber: decodedData.phone_number.phone_number,
				type: decodedData.phone_number.type
			} : mappedUserAddress.contactInfo

			return {
				...state,
				isMpDecodingFetched: true,
				mpDecodedData: {
					mappedAddress: mappedUserAddress,
					rawDecodedData: decodedData
				},

				selectedAddressID: decodedData.address_id,
				selectedStoreID: decodedData.store_id,
				isDelivery: !decodedData.is_pickup_order,
				isCheckoutStoreValid: CheckoutValidationEnum.VALID,
				isStoreClosed: false
			}
		}
		case CartActionsTypes.AddStoreObjectToCheckout: {
			const selectedStore = action.store;
			let currentList = state.storeSearchList;

			if (selectedStore) {
				selectedStore.isTemp = true;
				currentList = currentList ? currentList.filter(store => !store.isTemp) : [];
			}
			const isInList = selectedStore ? currentList.find(store => store.storeId === selectedStore.storeId) : true;
			if (!isInList) {
				currentList.unshift(selectedStore);
			}
			return {
				...state,
				storeSearchList: currentList
			}
		}
		case CartActionsTypes.FetchDeliveryStoreForCheckoutSuccess: {
			const isMPDecoded = state.isMpDecodingFetched;
			const addressID = isMPDecoded ? state.selectedAddressID : action.addressId;
			return {
				...state,
				selectedAddressID: addressID,
			}
		}
		case AccountActionTypes.RequestAccountStoresSuccess: {
			const accountStores = action.accountStores;
			const isDelivery = action.isDeliveryTab;
			const currectSelected = state.selectedStoreID;
			const defaultStore = accountStores.find(store => store.default_store);
			let storeSearchList = AccountMapperHelper.parseServerStoresToUI(accountStores);
			if (!isDelivery && storeSearchList.find(store => store.storeId !== currectSelected)) {
				const mappedModalStore = AccountMapperHelper.parseServerStoresToUI([action.selectedStore]);
				storeSearchList = storeSearchList.concat(mappedModalStore)
			}
			const selectedStoreID = defaultStore ? defaultStore.store_id : null;

			return {
				...state,
				selectedStoreID: !isDelivery ? currectSelected : selectedStoreID,
				storeSearchList: storeSearchList
			}
		}
		// case CartActionsTypes.ValidateCheckoutStore:
		case StoreActionsTypes.SaveUserInput: {
			const isDelivery = action.isDelivery;
			const userDeliveryAddressInput = action.addressInput;
			userDeliveryAddressInput.time = action.isFutureOrder ? userDeliveryAddressInput.time : null;
			userDeliveryAddressInput.date = action.isFutureOrder ? userDeliveryAddressInput.date : null;
			const selectedAddressID = action.isStrictValidation ? state.selectedAddressID : null;
			userDeliveryAddressInput.address = selectedAddressID ? null : userDeliveryAddressInput.address;
			userDeliveryAddressInput.addressString = selectedAddressID ? null : userDeliveryAddressInput.addressString;
			return {
				...state,
				isDelivery,
				selectedStoreID: !isDelivery && action.store ? action.store.store_id : state.selectedStoreID,
				userDeliveryAddressInput,
				selectedAddressID,
				isCheckoutStoreValid: CheckoutValidationEnum.NOT_VALIDATED,
				orderFaiureReason: null
			}
		}
		case StoreActionsTypes.SaveUserInputFromCookie: {
			const existingAddress = state.userDeliveryAddressInput;
			const userDeliveryAddressInput = {
				...existingAddress,
				address: action.addressInput
			};
			return {
				...state,
				userDeliveryAddressInput,
			}
		}

		case CartActionsTypes.UpdateUserCartSuccess: {
			return {
				...state,
				isCheckoutStoreValid: action.isKeepValidationState ? state.isCheckoutStoreValid : CheckoutValidationEnum.VALID,
				orderFaiureReason: null
			}
		}
		case CartActionsTypes.ValidateCartSuccess:
		case CartActionsTypes.ValidateCartInvalid: {
			let cartValidation = state.isCheckoutStoreValid;
			let isStoreClosed = state.isStoreClosed;
			let orderFaiureReason = state.orderFaiureReason; // tslint:​disable: no-shadowed-variable
			const isStrictValidation = action.isStrictValidation;

			const response = action.validationResponse;
			const error = response.error && response.error.error_code

			const selectedStore = action.validationResponse.store;
			const isDelivery = action.isDelivery;
			let storeSearchList = state.storeSearchList ? state.storeSearchList : [];
			if (!isDelivery && !storeSearchList.find(store => store.storeId !== selectedStore.store_id)) {
				const mappedModalStore = AccountMapperHelper.parseServerStoresToUI([selectedStore]);
				storeSearchList = storeSearchList.concat(mappedModalStore)
			}
			if (isStrictValidation) {
				cartValidation = isValidationOk(error) ? CheckoutValidationEnum.VALID : CheckoutValidationEnum.INVALID;
				isStoreClosed = isValidationStoreClosed(error);
				orderFaiureReason = response.error && response.error.error_msg;
			}
			return {
				...state,
				selectedStore,
				isDelivery,
				storeSearchList,
				isCheckoutStoreValid: cartValidation,
				isStoreClosed,
				orderFaiureReason
			}
		}
		// case CartActionsTypes.ValidateCartFailed: {
		// 	const cartError = action.validationError;
		// 	let cartValidation = state.isCheckoutStoreValid;
		// 	let isStoreClosed = state.isStoreClosed;
		// 	if (cartError) {
		// 		cartValidation = cartError.errors.store_closed || cartError.errors.not_available ? CheckoutValidationEnum.INVALID : cartValidation
		// 		isStoreClosed = cartError.errors.store_closed
		// 	}
		// 	return {
		// 		...state,
		// 		isCheckoutStoreValid: cartValidation,
		// 		isStoreClosed
		// 	}
		// }

		case CartActionsTypes.SelectDeliveryAddressForCheckout: {
			const selectedAddressID = action.addressId;
			const existingAddress = state.userDeliveryAddressInput;
			let userDeliveryAddressInput = null;
			if (existingAddress && existingAddress.time) {
				userDeliveryAddressInput = {
					time: existingAddress.time,
					date: existingAddress.date
				}
			}
			return {
				...state,
				selectedAddressID,
				userDeliveryAddressInput,
				isCheckoutStoreValid: CheckoutValidationEnum.NOT_VALIDATED
			}
		}
		case CartActionsTypes.SelectPickupStoreForCheckout: {
			const stores = state.storeSearchList
			const defaultStore = stores ? state.storeSearchList.find(store => store.isDefault) : null
			const defaultID = defaultStore ? defaultStore.storeId : null;
			const selectedStoreID = action.storeId ? action.storeId : defaultID;

			return {
				...state,
				selectedStoreID,
				isCheckoutStoreValid: CheckoutValidationEnum.NOT_VALIDATED
			}
		}

		case CartActionsTypes.FetchStoreHoursForCheckout: {
			return {
				...state,
				// isCheckoutStoreValid: CheckoutValidationEnum.NOT_VALIDATED
			}
		}

		case CartActionsTypes.FetchStoreHoursForCheckoutSuccess: {
			const selectedStoreHours = action.storeHours;
			const locale = action.locale;
			const storeHours = CartMapper.mapStoreHours(selectedStoreHours, locale);
			return {
				...state,
				selectedStoreHours: storeHours,
				// isCheckoutStoreValid: CheckoutValidationEnum.VALID
			}
		}
		case OrderActionsTypes.BuildOrderRequest: {
			return {
				...state,
				orderFaiureReason: null
			}
		}
		case OrderActionsTypes.ProcessOrderRequestSuccess:
		case SignUpActionTypes.UserLogsOut:
		case SignUpActionTypes.UserLoginSuccess: {
			return {
				...state,
				isMpDecodingFetched: false,
				mpDecodedData: null,
				selectedAddressID: null,
				isCheckoutStoreValid: CheckoutValidationEnum.NOT_VALIDATED,
				isStoreClosed: false,
				storeSearchList: null,
				orderFaiureReason: null
			}
		}

		case OrderActionsTypes.ProcessOrderRequestFailure: {
			const error = action.error
			let orderFaiureReason = error.errors.card_error ? error.errors.card_error : null
			if (!orderFaiureReason) {
				orderFaiureReason = getGenericErr(error)
			}
			return {
				...state,
				orderFaiureReason
			}
		}

		default: {
			return state
		}
	}
}

export const getIsCheckoutStoreValid = (state: State) => {
	return state.isCheckoutStoreValid;
}
export const getIsStoreClosed = (state: State) => {
	return state.isStoreClosed;
}

// QTrinh
export const getGenericErr = (error: ServerValidationError) => {
	if (error) {
		const keyList = Object.keys(error.errors)
		const errKey = Object.keys(error.errors)[keyList.length - 1]
		return error.errors[errKey] ? error.errors[errKey] : null
	}
}
