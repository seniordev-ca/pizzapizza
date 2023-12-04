import { FutureHoursResponse } from './server-process-order-response';
import { FormGroup } from '../../../../node_modules/@angular/forms';
import { CheckoutAddressFormInterface } from '../components/cart/checkout-address-form/checkout-address-form.component';
import {
	CheckoutPaymentMethodFormInterface
} from '../../common/components/shared/checkout-payment-method-form/checkout-payment-method-form.component';
import { BamboraValidationInterface } from '../../../utils/payment-methods/bambora.service';
import { VisaPaymentRequestInterface } from '../../../utils/payment-methods/visa-checkout';
import { ServerPaymentRequestInterface } from '../../user/models/server-models/server-saved-cards-interfaces';
import { ServerOrderPaymentTypeEnum } from './server-process-order-request';
import { StoreServerInterface } from 'app/common/models/server-store';

/**
 * Defines actions that can be taken on credit card tabs
 */
export enum OrderActionsEnum {
	onPlaceOrder,
	onRemoveItem,
	onEditItem,
	onCustomizeItem,
	onMpButtonClick,
	onWarningClick
}
/**
 * Enum for type of redemption code
 */
export enum RedemptionComponentCodeEnum {
	giftCard = 'gift_card',
	total = 'total',
	club1111 = 'club_11_11'
}

/**
 * Order Summary Interface - this interface also includes an array of products for their cart
 */
export interface OrderSummaryInterface {
	orderId?: number,
	total?: number,
	subtotal?: number,

	orderComponent?: [
		{
			label: string,
			value: number,
			code: string
		}
	],
	redemptionComponents?: [
		{
			code: string,
			label: string,
			value: number
		}
	],
	loyalty?: {
		amount: number,
		isRedeemed: boolean
	}
	orderDate?: string,
	orderTime?: string,
	orderType?: OrderTypeEnum,
	orderTypeText?: OrderTypeEnum,
	orderLocationName?: string,
	cartItems?: CartItemIterface[],
	isSurchargeAdded?: boolean,
	surchargeValue?: number,
	coupon?: {
		isValid: boolean,
		coupons: UICouponCartItem[]
	}
	isUnavailable?: boolean,
	isLoading?: boolean,
	selected?: boolean
}
interface CartItemIterface {
	price: number,
	image: string,
	name: string,
	description: string,
	quantity: number,
	expired?: boolean
}

/**
 * Order Types Should be and Enum
 */
export enum OrderTypeEnum {
	DELIVERY = 'Delivery',
	PICKUP = 'Pickup'
}
interface UICouponCartItem {
	state: string,
	message: string,
	coupon_code: string
}

export interface UICheckoutInterface {
	// Address UI
	checkoutAddressFormData?: FormGroup;
	checkoutAddressUI?: CheckoutAddressFormInterface;

	// Store UI
	isStoreListValid?: boolean;

	// Payment uI
	checkoutPaymentForm?: FormGroup;
	checkoutPaymentUI?: CheckoutPaymentMethodFormInterface;
	isPaymentFormOpen?: boolean;
	bamboraValidation?: BamboraValidationInterface;
	visaPaymentRequest?: VisaPaymentRequestInterface;
	paymentTokenRequest?: ServerPaymentRequestInterface
	paymentMethod?: ServerOrderPaymentTypeEnum

	// Validation
	checkoutValidationStatus?: CheckoutValidationEnum;
	isGlobalError?: boolean;
	isCartInvalid?: boolean;
	isCheckoutStoreInvalid?: boolean;
	isCheckoutStoreValid?: boolean;
	isStoreSearch?: boolean;
	isCartHasSurcharge?: boolean;
	cartSurchargeValue?: number;
	isSurchargeConfirmed?: boolean;
	isSurchargeModalOpen?: boolean;
	isNextBtnLoading?: boolean;
	isPlaceOrderLoading?: boolean;
	isEditAddress?: boolean;
	isCouponsValid?: boolean;
	couponErrorMsg?: string;
	isCouponInvalidError?: boolean;
	errorCode?: string;
	contactLessErrorMessage?: boolean;
	isOnlyAlcohol?: boolean;
}

/**
 * Used to determine if checkout is valid
 */
export enum CheckoutValidationEnum {
	NOT_VALIDATED,
	VALID,
	INVALID
}
export interface UICheckoutTimeInterface extends FutureHoursResponse {
	label: string
}

export interface UpdateUserCartOptions {
	removeInvalid?: boolean
	confirmAge?: boolean
	skipStoreUpdate?: boolean
	store?: StoreServerInterface,
	isKeepValidationState?: boolean
}
