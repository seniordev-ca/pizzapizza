// Angular core
import {
	Component,
	ViewEncapsulation,
	ViewChild,
	OnDestroy,
	AfterViewInit
} from '@angular/core';
import { Router } from '@angular/router';
// Bootstrap helper
import { NgbAccordion } from '@ng-bootstrap/ng-bootstrap';
// NgRx
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Store, select, ActionsSubject } from '@ngrx/store';
// Reducers
import * as fromCheckout from '../../reducers';
import * as fromUser from '../../../user/reducers';
import * as fromCommon from '../../../common/reducers';
// Actions
import * as fromActionsCart from '../../actions/cart';
import * as fromActionsOrders from '../../actions/orders';
import * as fromActionsAccount from '../../../user/actions/account-actions';
import * as fromActionsPayment from '../../actions/payment';
import * as fromActionsGlobalCard from '../../../common/actions/cart-validation'
import { CheckoutDataLayer } from '../../../common/actions/tag-manager';

// Interfaces and Enums
import * as fromModelsOrderCheckout from '../../models/order-checkout';
import * as fromCheckoutAddressForm from '../../components/cart/checkout-address-form/checkout-address-form.component';
import * as fromModelsStoreList from '../../../common/models/store-list';
import * as fromModelsAddressList from '../../../common/models/address-list';
// tslint:disable-next-line:max-line-length
import * as fromCheckoutPaymentForm from '../../../common/components/shared/checkout-payment-method-form/checkout-payment-method-form.component';
import { Product } from '../../../catalog/models/product';
import { ServerOrderPaymentInterface, ServerOrderPaymentTypeEnum } from '../../models/server-process-order-request';
import { OrderSummaryEmitterInterface } from '../../components/order-confirmation/order-summary/order-summary.component';
import { cartItemAction, CartItemEmitterInterface } from '../../components/cart/cart-item/cart-item.component';
import { UserSummaryInterface } from '../../../user/models/user-personal-details';
import {
	ServerDefaultPaymentMethodEnum,
	ServerPaymentCardTypeEnum
} from '../../../user/models/server-models/server-saved-cards-interfaces';
import { UISavedCardsInterface } from '../../../user/models/user-saved-cards';
import { UserCreditCardsEmitterInterface, UserCreditCardsActions } from '../../../common/models/user-payment-methods';
import { FetchUniversityList, FetchBuildingList } from '../../../common/actions/university';
import { UniversityListInterface } from '../../../common/models/university-list';
/** SERVICES */
import { PPFormBuilderService } from '../../../common/services/form-builder.service';
import { BamboraLoaderService } from '../../../../utils/payment-methods/bambora.service';
import { VisaCheckoutService } from '../../../../utils/payment-methods/visa-checkout';
import { CartItemKindEnum, ServerCartTipsInterface } from '../../models/server-cart-response';
import { RedeemModalComponent } from '../../../common/sub-containers/redeem-modal/redeem-modal.component'
import { ConfirmationModalComponent } from '../../../common/components/modals/confirmation-modal/confirmation-modal.component';
import { SaveUserInput } from 'app/common/actions/store';
import { SeverStorePaymentInterface } from 'app/common/models/server-store';
import { StoreService } from '../../../common/services/store.service';
import { couponParentContainerEnum } from 'app/common/widgets/add-coupon/add-coupon.widget';

@Component({
	selector: 'app-checkout-container',
	templateUrl: './checkout-container.component.html',
	styleUrls: ['./checkout-container.component.scss'],
	encapsulation: ViewEncapsulation.None,
	providers: [PPFormBuilderService]
})
export class CheckoutContainerComponent implements OnDestroy, AfterViewInit {
	@ViewChild('checkoutAccordion', { static: true }) checkoutAccordion: NgbAccordion;
	@ViewChild('editRedeemModal', { static: true }) editRedeemModal: RedeemModalComponent;
	@ViewChild('searchModal', { static: true }) searchModal: ConfirmationModalComponent;
	@ViewChild('globalErrorModal', { static: true }) globalErrorModal: ConfirmationModalComponent;
	@ViewChild('invalidCouponModal', { static: true }) invalidCouponModal: ConfirmationModalComponent;
	@ViewChild('surchargeModal', { static: true }) surchargeModal: ConfirmationModalComponent;
	@ViewChild('editAddressModal', { static: true }) editAddressModal: ConfirmationModalComponent;
	@ViewChild('checkoutStoreModal', { static: true }) checkoutStoreModal: ConfirmationModalComponent;
	@ViewChild('checkoutCreditCardModal', { static: true }) checkoutCreditCardModal: ConfirmationModalComponent;
	@ViewChild('checkoutPaymentForm', { static: true }) checkoutPaymentForm: fromCheckoutPaymentForm.CheckoutPaymentMethodFormComponent;

	// Subscriptions
	checkoutSubscriptionsRef;
	checkoutCreditCardErrorRef;
	// UI
	checkoutUIData: fromModelsOrderCheckout.UICheckoutInterface = {}
	defaultAddressFormData;
	activeAddressData;
	// Cart Related
	productsInCart$: Observable<Product[]>;
	orderSummaryData$: Observable<fromModelsOrderCheckout.OrderSummaryInterface>;
	isCartUpdating$: Observable<boolean>;
	couponValidationMsg$: Observable<string>;
	isCouponValid$: Observable<boolean>;
	isMpRedirectLoading$: Observable<boolean>
	orderFailedReason$: Observable<string>;
	newCardFailedMessage$: Observable<string>;

	// User Related
	userSummary$: Observable<UserSummaryInterface>
	isDelivery$: Observable<boolean>;
	savedAddresses$: Observable<fromModelsAddressList.AddressListInterface[]>;
	selectedAddressId$: Observable<number | string>;
	universityList$: Observable<UniversityListInterface[]>;
	buildingList$: Observable<UniversityListInterface[]>;
	isVisaClickToPay$: Observable<boolean>;
	visaBtnUrl: string
	isSignedInUser: boolean;

	savedStores$: Observable<fromModelsStoreList.StoreListInterface[]>;
	storeSearchResults$: Observable<fromModelsStoreList.StoreListInterface[]>;
	selectedStoreId$: Observable<number>;
	selectedStoreHours$: Observable<fromModelsOrderCheckout.UICheckoutTimeInterface[]>;
	selectedStorePayments$: Observable<SeverStorePaymentInterface>;

	savedCards$: Observable<UISavedCardsInterface[]>;
	selectedCard$: Observable<UISavedCardsInterface>;
	defaultPaymentMethod$: Observable<ServerDefaultPaymentMethodEnum>;
	editCard$: Observable<UISavedCardsInterface>;
	universitiesWithMealCard$: Observable<UniversityListInterface[]>;
	userContactDetails;
	isCouponAdded$: Observable<boolean>;
	isCouponAdded = false;
	cartTipData$: Observable<ServerCartTipsInterface>;
	isCheckOutNextStepInReview = false;

	isLocationError: boolean;
	isMPDecoded: boolean;
	isStoreSearchLoading$: Observable<boolean>;
	isStoreSearchError$: Observable<boolean>;
	showAddCardLoader$: Observable<boolean>;

	couponParentContainerEnum = couponParentContainerEnum;

	constructor(
		private confirmModal: ConfirmationModalComponent,
		private router: Router,
		private store: Store<fromCheckout.CheckoutState>,
		private userStore: Store<fromUser.UserState>,
		private commonStore: Store<fromCommon.CommonState>,
		private ppFormBuilder: PPFormBuilderService,
		private actions: ActionsSubject,
		private bamboraService: BamboraLoaderService,
		private visaService: VisaCheckoutService,
	) {
		this.isLocationError = false;
		this.isStoreSearchLoading$ = this.store.pipe(select(fromUser.getisStoreSearchLoading));
		this.isStoreSearchError$ = this.store.pipe(select(fromUser.getisStoreSearchError));
		this.showAddCardLoader$ = this.store.pipe(select(fromUser.showAddCardLoader));

		this.userContactDetails = {
			phoneNumber: null,
			extension: null,
			type: fromModelsAddressList.PhoneTypeEnum.Home
		}
		this.defaultAddressFormData = {
			addressId: null,
			address: null,
			entrance: 'Front Door',
			contactInfo: {
				phoneNumber: null,
				type: fromModelsAddressList.PhoneTypeEnum.Home,
				extension: null
			},
			type: fromModelsAddressList.AddressTypeEnum.Home
		}
		this.checkoutSubscriptionsRef = {};
		this._subscribeOnOrderRequestOperations();
		this.checkoutUIData.checkoutAddressFormData = this.ppFormBuilder.buildAddressForm(true)
		this.checkoutUIData.checkoutPaymentUI = {
			isPayAtDoorSelected: true,
			isCreditCardSelected: false,
			isStudentCardSelected: false,
			isVisaCheckoutSelected: false,
			isMasterPassSelected: false
		}
		this.checkoutUIData.checkoutAddressUI = {
			isDelivery: true,
			isResidential: true,
			isToday: true,
			isContactLessSelected: false,

		}
		this.checkoutUIData.paymentMethod = ServerOrderPaymentTypeEnum.Offline;
		this.checkoutUIData.checkoutPaymentForm = this.ppFormBuilder.buildPaymentForm();
		this.checkoutUIData.checkoutPaymentForm = this.ppFormBuilder.buildPayAtDoorForm(this.checkoutUIData.checkoutPaymentForm);
		this.checkoutUIData.bamboraValidation = this.bamboraService.getFormValidation();
		this.checkoutSubscriptionsRef.visaResponseSubscriptionRef = this.visaService.visaResponseObject.subscribe(visaObject => {
			if (visaObject.encKey) {
				// Token Generated! Time to connect to back-end
				this.checkoutUIData.paymentTokenRequest = {
					token: visaObject.callid
				}
				this.checkoutUIData.paymentMethod = ServerOrderPaymentTypeEnum.VisaCheckout;
				this._buildOrderRequest()
			}
		})
		/**
		 * CART RELATED INIT
		 */
		this.isMpRedirectLoading$ = this.store.pipe(select(fromCheckout.isMpRedirectLoading));
		this.couponValidationMsg$ = this.store.pipe(select(fromCommon.getCouponValidationMsg));
		this.isCouponValid$ = this.store.pipe(select(fromCommon.getIsCouponValid));
		this.productsInCart$ = this.store.pipe(select(fromCheckout.getCartProducts));
		this.isCartUpdating$ = this.store.pipe(select(fromCheckout.getCartUpdating));
		this.orderSummaryData$ = this.store.pipe(select(fromCheckout.getCartSummary));
		this.isCouponAdded$ = this.store.pipe(select(fromCommon.getIsCouponAdded));
		this.cartTipData$ = this.store.pipe(select(fromCheckout.getTipData));

		this.checkoutSubscriptionsRef.surchargeSubscriptionRef = this.orderSummaryData$.subscribe(data => {
			this.checkoutUIData.isCouponsValid = true;
			if (data.total === 0) {
				this.checkoutUIData.isCartHasSurcharge = data.isSurchargeAdded;
				this.checkoutUIData.cartSurchargeValue = data.surchargeValue;
				this.checkoutUIData.isSurchargeConfirmed = !data.isSurchargeAdded;
				this.checkoutUIData.paymentMethod = ServerOrderPaymentTypeEnum.Offline;
				this.checkoutUIData.checkoutPaymentUI.isOrderPaidInFull = true;
				return false;
			}
			if (data.total) {
				this.checkoutUIData.isCartHasSurcharge = data.isSurchargeAdded;
				this.checkoutUIData.cartSurchargeValue = data.surchargeValue;
				this.checkoutUIData.isSurchargeConfirmed = !data.isSurchargeAdded;

				this.checkoutUIData.isCouponsValid = data.coupon ? data.coupon.isValid : true;
				this.checkoutUIData.couponErrorMsg = data.coupon ? data.coupon.coupons.map(coupon => coupon.message).join(', ') : null;

				this.checkoutUIData.visaPaymentRequest = {
					subtotal: data.total.toString(),
					currencyCode: 'CAD'
				}
				// this.visaService.initVisaCheckout(this.checkoutUIData.visaPaymentRequest);
			}
		})
		/**
		 * USER RELATED INIT
		 */
		this.isDelivery$ = store.pipe(select(fromCommon.getSelectedTab))
		this.userSummary$ = this.userStore.pipe(select(fromUser.getLoggedInUser));
		this.savedStores$ = this.store.pipe(select(fromCheckout.getStoreSearchList));
		this.storeSearchResults$ = this.userStore.pipe(select(fromUser.getStoreList));
		this.selectedStoreId$ = this.store.pipe(select(fromCheckout.getSelectedStoreId));
		this.selectedStorePayments$ = this.store.pipe(select(fromCheckout.getSelectedStorePayments))
		this.savedAddresses$ = this.userStore.pipe(select(fromUser.getUserAddresses));
		this.selectedAddressId$ = this.store.pipe(select(fromCheckout.getSelectedAddressId));
		this.selectedStoreHours$ = this.store.pipe(select(fromCheckout.getCheckoutStoreHours));
		this.universityList$ = this.commonStore.pipe(select(fromCommon.getUniversities));
		this.buildingList$ = this.commonStore.pipe(select(fromCommon.getBuildingList));
		this.savedCards$ = this.store.pipe(select(fromUser.getSavedCards));
		this.selectedCard$ = this.store.pipe(select(fromUser.getSelectedCard));
		this.defaultPaymentMethod$ = this.store.pipe(select(fromUser.getDefaultPaymentMethod));
		this.editCard$ = this.userStore.pipe(select(fromUser.getEditCard));
		this.universitiesWithMealCard$ = this.commonStore.pipe(select(fromCommon.getUniversitiesWithMealCard));
		this.isVisaClickToPay$ = this.commonStore.pipe(select(fromCommon.selectIsVisaClickToPay));

		this.checkoutSubscriptionsRef.isVisaClickToPay = this.isVisaClickToPay$.subscribe(isVisaClickToPay => {
			this.visaBtnUrl = this.visaService.getBtnSrc(isVisaClickToPay)
		})
		// this.checkoutSubscriptionsRef.locationModalInputRef = this.store.pipe(select(fromCommon.getUserInputAddress)).subscribe(data => {
		// 	this.checkoutUIData.checkoutAddressFormData.get('addressString').patchValue(data)
		// 	if (this.checkoutAccordion && this.checkoutAccordion.activeIds.indexOf('payment') >= 0) {
		// 		this.checkoutNextStep('address');
		// 	}
		// });
		this.checkoutSubscriptionsRef.userAddressInput = this.store.pipe(select(fromCheckout.getUserDeliveryAddressInput)).subscribe(data => {
			this.activeAddressData = data;
			if (this.activeAddressData) {
				// update UI address to the address data from state
				this._setDefaultAddress(this.activeAddressData, true, false)
				this.checkoutUIData.checkoutAddressUI.isToday = this.activeAddressData.time ? false : true;
				this.checkoutUIData.checkoutAddressFormData.patchValue({
					'date': this.activeAddressData.date,
					'time': this.activeAddressData.time
				})
			}
		})
		this.orderFailedReason$ = this.store.pipe(select(fromCheckout.getOrderError));
		this.newCardFailedMessage$ = this.store.pipe(select(fromUser.getAddCardFailure));
		/**
		 * Subscriptions
		 */
		this.checkoutSubscriptionsRef.isDeliverySubscriptionRef = this.isDelivery$.subscribe(isDelivery => {
			this.checkoutUIData.checkoutAddressUI = {
				...this.checkoutUIData.checkoutAddressUI,
				isDelivery: isDelivery
			}
			if (!isDelivery) {
				this.checkoutUIData.checkoutAddressFormData.get('addressString').clearValidators();
				this.checkoutUIData.checkoutAddressFormData.get('address').clearValidators();
			}
		});
		this.checkoutSubscriptionsRef.editAddressRef = this.store.pipe(select(fromUser.getSelectedAddress)).subscribe(address => {
			if (address) {
				this._setDefaultAddress(address, true, false);
			}
		});
		this.checkoutSubscriptionsRef.cartSubscriptionRef = this.store.pipe(select(fromCheckout.getIsCartValid))
			.subscribe(isValid => {
				this.checkoutUIData.isCartInvalid = !isValid;
			});
		this.checkoutSubscriptionsRef.cartAlcoholSubscriptionRef = this.store.pipe(select(fromCheckout.getIsCartOnlyAlcohol))
			.subscribe(isOnlyAlcohol => {
				this.checkoutUIData.isOnlyAlcohol = isOnlyAlcohol
			})
		this.checkoutSubscriptionsRef.checkoutSubscriptionRef = this.store.pipe(select(fromCheckout.getIsCheckoutStoreValid))
			.subscribe(isValid => {
				this.checkoutUIData.checkoutValidationStatus = isValid;
				if (isValid !== fromModelsOrderCheckout.CheckoutValidationEnum.NOT_VALIDATED) {
					this.checkoutUIData.isCheckoutStoreValid = isValid === fromModelsOrderCheckout.CheckoutValidationEnum.VALID ? true : false;
					if (isValid === fromModelsOrderCheckout.CheckoutValidationEnum.INVALID) {
						this.confirmModal.onOpen(this.checkoutStoreModal)
					}
					if (this.checkoutUIData.isCheckoutStoreValid && !this.checkoutUIData.isCartInvalid
						&& this.checkoutAccordion && this.activeAddressData) {
						// update UI address to the address data from state
						this._setDefaultAddress(this.activeAddressData, true, false)
						this.checkoutUIData.checkoutAddressUI.isToday = this.activeAddressData.time ? false : true;
						this.checkoutUIData.checkoutAddressFormData.patchValue({
							'date': this.activeAddressData.date,
							'time': this.activeAddressData.time
						})
						if (this.checkoutUIData.isNextBtnLoading) {
							this.checkoutNextStep('payment');
							this.checkoutUIData.isNextBtnLoading = false;
							this.checkoutUIData.checkoutPaymentForm.get('paymentMethodAtDoor').patchValue('Cash')
						}
						this.checkoutUIData.isNextBtnLoading = isValid === fromModelsOrderCheckout.CheckoutValidationEnum.VALID ? false : true
					}
				}
			});

		this.checkoutSubscriptionsRef.isCouponadded = this.isCouponAdded$.subscribe(data => {
			if (data) {
				this.isCouponAdded = data;
				this.checkoutNextStep('review');
			}
		})

		this.checkoutCreditCardErrorRef = this.store.pipe(select(fromUser.getAddCardFailure))
			.subscribe(isError => {
				if (isError) {
					console.log('Error Credit Card', isError);
					this.confirmModal.onOpen(this.checkoutCreditCardModal)
				}
			})
		this.checkoutSubscriptionsRef.defaultPaymentMethodSubscriptionRef = this.defaultPaymentMethod$.subscribe(paymentMethod => {
			const isCardDefault = paymentMethod === ServerDefaultPaymentMethodEnum.MASTERPASS ||
				paymentMethod === ServerDefaultPaymentMethodEnum.MEAL_CARD ||
				paymentMethod === ServerDefaultPaymentMethodEnum.VISA ||
				paymentMethod === ServerDefaultPaymentMethodEnum.WALLET
			this.checkoutUIData.checkoutPaymentUI = {
				isCreditCardSelected: paymentMethod === ServerDefaultPaymentMethodEnum.WALLET,
				isPayAtDoorSelected: !isCardDefault,
				isStudentCardSelected: paymentMethod === ServerDefaultPaymentMethodEnum.MEAL_CARD,
				isMasterPassSelected: paymentMethod === ServerDefaultPaymentMethodEnum.MASTERPASS,
				isVisaCheckoutSelected: paymentMethod === ServerDefaultPaymentMethodEnum.VISA
			}
			if (paymentMethod === ServerDefaultPaymentMethodEnum.VISA || paymentMethod === ServerDefaultPaymentMethodEnum.MASTERPASS) {
				this.checkoutUIData.paymentMethod = paymentMethod === ServerDefaultPaymentMethodEnum.VISA ?
					ServerOrderPaymentTypeEnum.VisaCheckout :
					ServerOrderPaymentTypeEnum.MasterCard
			}
			if (this.checkoutUIData.checkoutPaymentUI.isPayAtDoorSelected) {
				this.checkoutUIData.checkoutPaymentForm.markAsDirty()
			}
		})
		this.checkoutSubscriptionsRef.selectedCardSubscriptionRef = this.selectedCard$.subscribe(card => {
			this.checkoutUIData.paymentTokenRequest = card ? {
				token: card.token,
				name: card.name
			} : null;
			if (card) {
				const creditPayment = card.cardType === ServerPaymentCardTypeEnum.MealCard ?
					ServerOrderPaymentTypeEnum.MealCard :
					ServerOrderPaymentTypeEnum.Credit;

				this.checkoutUIData.paymentMethod = creditPayment;

				this.checkoutUIData.checkoutPaymentUI.isCreditCardSelected = creditPayment === ServerOrderPaymentTypeEnum.Credit;
				this.checkoutUIData.checkoutPaymentUI.isStudentCardSelected = creditPayment === ServerOrderPaymentTypeEnum.MealCard;
				this.checkoutUIData.checkoutPaymentUI.isPayAtDoorSelected = false;
			}
		})
		this.checkoutSubscriptionsRef.editCardSubscriptionref = this.editCard$.subscribe(card => {
			this.checkoutUIData.checkoutPaymentForm.patchValue({
				'nameOnCreditCard': card ? card.name : null,
				'token': card ? card.token : null
			})
		})
		this.checkoutSubscriptionsRef.masterPassInputRef = this.store.pipe(
			select(fromCheckout.getMpDecodedData)
		).subscribe(mpDataDecodedData => {
			const address = mpDataDecodedData ? mpDataDecodedData.mappedAddress : null;
			const rawDecodedData = mpDataDecodedData ? mpDataDecodedData.rawDecodedData : null;
			if (address) {
				this.isMPDecoded = true;
				if (!address.addressId) {
					this._setDefaultAddress(address, true, true);
				}
				this.checkoutUIData.checkoutAddressUI.isToday = address.date ? false : true;
				this.checkoutUIData.checkoutAddressFormData.patchValue({
					'date': address.date,
					'time': address.time
				})
				this.checkoutUIData.checkoutPaymentUI = {
					isCreditCardSelected: true,
					isPayAtDoorSelected: false,
					isStudentCardSelected: false,
					isMasterPassSelected: true,
					isVisaCheckoutSelected: false
				}
				this.checkoutUIData.paymentMethod = ServerOrderPaymentTypeEnum[rawDecodedData.payment_type];
			}
		});
		this.checkoutSubscriptionsRef.userSubscriptionRef = this.userSummary$.subscribe(user => {
			this.isSignedInUser = user ? true : false;
			this.checkoutUIData.checkoutAddressFormData = this.ppFormBuilder.updateAddressRequiredFieldsForGuest(
				this.isSignedInUser, this.checkoutUIData.checkoutAddressFormData
			)
			if (this.isSignedInUser && this.checkoutUIData.checkoutAddressFormData.get('contactInfo').invalid) {
				this.userContactDetails.phoneNumber = user.contactNumber.phoneNumber;
				this.userContactDetails.extension = user.contactNumber.extension
				this.checkoutUIData.checkoutAddressFormData.patchValue({
					'contactInfo': {
						'phoneNumber': this.userContactDetails.phoneNumber,
						'type': this.userContactDetails.extension.type,
						'extension': this.userContactDetails.extension
					}
				})
			}
		})

		this.checkoutSubscriptionsRef.selectedPaymentMethod = this.store.pipe(select(fromUser.getCheckoutPaymentMethod)).subscribe(data => {
			this.checkoutUIData.checkoutPaymentUI = {
				isCreditCardSelected: data === fromCheckoutPaymentForm.CheckoutPaymentMethodFormActionEnum.onCreditCardSelected,
				isPayAtDoorSelected: data === fromCheckoutPaymentForm.CheckoutPaymentMethodFormActionEnum.onPayAtDoorSelected || !data,
				isStudentCardSelected: data === fromCheckoutPaymentForm.CheckoutPaymentMethodFormActionEnum.onStudentCardSelected,
				isVisaCheckoutSelected: data === fromCheckoutPaymentForm.CheckoutPaymentMethodFormActionEnum.onVisaCheckoutSelected,
				isMasterPassSelected: data === fromCheckoutPaymentForm.CheckoutPaymentMethodFormActionEnum.onMasterPassSelected
			}
		})

		/**
		 * Check for tips should last to ensure if there are tips on reload we ensure online payment selected
		 */
		this.checkoutSubscriptionsRef.isTipAdded = this.cartTipData$.subscribe(data => {
			if (data && data.tip_value > 0 && this.checkoutUIData.checkoutPaymentUI.isPayAtDoorSelected) {
				this.checkoutUIData.checkoutPaymentUI.isCreditCardSelected = true;
				this.checkoutUIData.checkoutPaymentUI.isStudentCardSelected = false;
				this.checkoutUIData.checkoutPaymentUI.isPayAtDoorSelected = false;
				this.checkoutUIData.paymentMethod = ServerOrderPaymentTypeEnum.Credit;
			}
		})
	}
	/**
	 * On Destroy unsubscribe
	 */
	ngOnDestroy() {
		for (const key in this.checkoutSubscriptionsRef) {
			if (this.checkoutSubscriptionsRef[key]) {
				this.checkoutSubscriptionsRef[key].unsubscribe();
			}
		}
		this.checkoutCreditCardErrorRef.unsubscribe();
		this.bamboraService.destroy();
		this.visaService.destroy();
		this.checkoutUIData.paymentTokenRequest = null
	}
	/**
	 * Because these services require dom elements we should fire them after view init to be safe
	 */
	ngAfterViewInit() {
		this.bamboraService.initCustomCheckout();
		this.visaService.initVisaCheckout(this.checkoutUIData.visaPaymentRequest);
		// this.checkoutPaymentForm.clearTip();
	}
	/**
	 * Subscribe on cart operations
	 */
	_subscribeOnOrderRequestOperations() {
		this.checkoutSubscriptionsRef.processOrderSuccessRef = this.actions.pipe(
			filter(
				action => action.type === fromActionsOrders.OrderActionsTypes.ProcessOrderRequestFailure
					|| action.type === fromActionsCart.CartActionsTypes.ValidateCartInvalid
					|| action.type === fromActionsPayment.PaymentActionsTypes.HandleSecurePaymentCheckoutFailure
					|| action.type === fromActionsGlobalCard.CartValidationTypes.ShowValidation
			)
		).subscribe((action) => {

			// Show card validation unavailable message
			if (action.type === fromActionsGlobalCard.CartValidationTypes.ShowValidation) {
				this.checkoutUIData.isNextBtnLoading = false;
				return false;
			}

			const isFailure =
				action.type === fromActionsOrders.OrderActionsTypes.ProcessOrderRequestFailure ||
				action.type === fromActionsPayment.PaymentActionsTypes.HandleSecurePaymentCheckoutFailure;

			this.checkoutUIData.isPlaceOrderLoading = false;
			this.checkoutUIData.isNextBtnLoading = false;
			this.checkoutUIData.isGlobalError = isFailure;
			if (this.checkoutUIData.isGlobalError) {
				this.confirmModal.onOpen(this.globalErrorModal)
			}
		})
	}

	/**
	 * Checks Address form and submits to validate cart if everything is valid/complete
	 */
	validateCartIfReady() {
		const addressInput = this.checkoutUIData.checkoutAddressFormData.value;
		if (addressInput.addressId) {
			this.checkoutUIData.isEditAddress = true;
			this.confirmModal.onOpen(this.editAddressModal)
			return false
		}
		// use the right formatted_address field "manual address" vs "autocomplete address"
		const formattedAddress = this.activeAddressData ? (this.activeAddressData.address && this.activeAddressData.address.formatted_address ?
			this.activeAddressData.address.formatted_address : this.activeAddressData.formatted_address) : null;
		const isAddressValidated = this.activeAddressData ?
		formattedAddress === this.checkoutUIData.checkoutAddressFormData.get('addressString').value : false;
		// debugging
		// console.log({
		// 	isAddressValidated: !isAddressValidated,
		// 	address: addressInput.address,
		// 	checkoutValidation: this.checkoutUIData.checkoutValidationStatus === fromModelsOrderCheckout.CheckoutValidationEnum.NOT_VALIDATED,
		// 	checkoutAddressFormData: this.checkoutUIData.checkoutAddressFormData.valid,
		// 	thischeck: (!isAddressValidated && addressInput.hasOwnProperty('address') )
		// })
		if (
			(
				(!isAddressValidated && addressInput.hasOwnProperty('address') )
				|| this.checkoutUIData.isCartInvalid
			)
			&&
				this.checkoutUIData.checkoutAddressFormData.valid
			) {
			this.dispatchSaveAddress(addressInput)
		}
	}

	// Accordion Related
	/**
	 * Listen to Accordian Toggles
	 */
	toggleAccordian(event) {

		// if (this.checkoutAccordion.activeIds.indexOf('review')) {
		// 	this.isCheckOutNextStepInReview = true;
		// }

		// on every accordion toggle we need to check if form is ready to validate cart
		this.validateCartIfReady();

		if (this.checkoutAccordion.activeIds.indexOf('review') >= 0 && event.panelId === 'address') {
			// console.log('from review to address')
			this.store.dispatch(new CheckoutDataLayer(1, 'review'))
			this.store.dispatch(new CheckoutDataLayer(2, event.panelId))
		}
		if (this.checkoutAccordion.activeIds.indexOf('address') >= 0 && event.panelId === 'payment') {
			// console.log('from address to payments');
			this.store.dispatch(new CheckoutDataLayer(2, 'payment'));
			this.store.dispatch(new CheckoutDataLayer(3, ''));
			this.isCheckOutNextStepInReview = false;
			this.isCouponAdded = false;
		}
		if (this.checkoutAccordion.activeIds.indexOf('review') >= 0 && event.panelId === 'payment') {
			// console.log('from review to payments');
			this.store.dispatch(new CheckoutDataLayer(1, 'review'));
			this.store.dispatch(new CheckoutDataLayer(3, ''));
		}
		if (event.panelId === 'payment' && this.checkoutAccordion.activeIds.indexOf('payment') < 0) {
			if (this.checkoutUIData.checkoutAddressUI.isContactLessSelected) {
				this.checkoutUIData.checkoutPaymentUI.isPayAtDoorSelected = false;
				this.checkoutUIData.checkoutPaymentForm = this.ppFormBuilder.buildCreditCardForm(this.checkoutUIData.checkoutPaymentForm)
				this.checkoutUIData.paymentMethod = null;
				this.checkoutUIData.checkoutPaymentForm.markAsDirty()
			}
			if (this.checkoutUIData.checkoutPaymentUI.isPayAtDoorSelected) {
				this.checkoutUIData.paymentMethod = ServerOrderPaymentTypeEnum.Offline;
				this.checkoutUIData.checkoutPaymentForm = this.ppFormBuilder.buildPayAtDoorForm(this.checkoutUIData.checkoutPaymentForm);
				this.checkoutUIData.checkoutPaymentForm.get('paymentMethodAtDoor').patchValue('Cash')
				this.checkoutUIData.checkoutPaymentForm.markAsDirty()
			}
			this.isMPDecoded = false;
			this.visaService.initVisaCheckout(this.checkoutUIData.visaPaymentRequest);
			// only init if user hasn't entered card details
			if (!this.bamboraService.isCardInfoComplete()) {
				this.bamboraService.initCustomCheckout();
			}
		}
		this.checkoutUIData.checkoutAddressFormData.markAsPristine()

		if (event.nextState) {
			const el = document.getElementById('top-anchor');
			el.scrollIntoView({ behavior: 'smooth' });
		}

	}
	/**
	 * Toggle next accordion tab
	 */
	checkoutNextStep(id) {
		if (this.checkoutAccordion.activeIds.indexOf(id) < 0) {
			// console.log('MOVE TO THE NEXT TAB ------->', id)
			this.checkoutAccordion.toggle(id);
		}
	}

	/**
	 * Dispatach Save Address
	 */
	dispatchSaveAddress(addressInput) {
		this.store.dispatch(new SaveUserInput(
			addressInput,
			this.checkoutUIData.checkoutAddressUI.isDelivery,
			this.checkoutUIData.checkoutAddressUI.isContactLessSelected,
			true,
			null,
			!this.checkoutUIData.checkoutAddressUI.isToday))
	}

	/**
	 * Determine if the "Address" tab is complete. If the payment tab is open that means we have validated the address or store already.
	 * Or if isCheckoutReady is true and we are not in the address tab (for situations in which all tabs are closed basically)
	 */
	isAddressTabComplete(selectedAddress, isDelivery, orderSummary, selectedStore, stores) {
		return (this.checkoutAccordion.activeIds.indexOf('payment') >= 0)
			|| (this.checkoutAccordion.activeIds.indexOf('address') < 0 &&
				this.isCheckoutReady(selectedAddress, isDelivery, orderSummary, selectedStore, stores))
	}
	/**
	 * Determine if the "Payment" tab is complete. Basically just needs to check if user selected a payment method
	 */
	isPaymentTabComplete() {
		const isCreditCardComplete = this.checkoutUIData.checkoutPaymentUI.isCreditCardSelected &&
			this.bamboraService.isCardInfoComplete() &&
			this.checkoutUIData.checkoutPaymentForm.valid && !this.checkoutUIData.checkoutPaymentForm.pristine
		const isStudentCardComplete = this.checkoutUIData.checkoutPaymentUI.isStudentCardSelected &&
			this.checkoutUIData.checkoutPaymentForm.valid && !this.checkoutUIData.checkoutPaymentForm.pristine
		const isOrderPaidInFull = this.checkoutUIData.checkoutPaymentUI.isOrderPaidInFull;
		const isPayatDoorComplete = this.checkoutUIData.checkoutPaymentUI.isPayAtDoorSelected &&
			this.checkoutUIData.checkoutPaymentForm.valid && !this.checkoutUIData.checkoutPaymentForm.pristine
			&& !this.checkoutUIData.checkoutAddressUI.isContactLessSelected

		const isComplete = isOrderPaidInFull || isCreditCardComplete || isStudentCardComplete || isPayatDoorComplete ||
			(this.checkoutUIData.checkoutPaymentUI.isCreditCardSelected && this.checkoutUIData.paymentTokenRequest) ||
			(this.checkoutUIData.checkoutPaymentUI.isStudentCardSelected && this.checkoutUIData.paymentTokenRequest) ||
			(this.checkoutUIData.checkoutPaymentUI.isMasterPassSelected || this.checkoutUIData.checkoutPaymentUI.isVisaCheckoutSelected)
			? true : false;
		return isComplete
	}
	/**
	 * Determine if entire checkout is valid
	 */
	isCheckoutReady(selectedAddress, isDelivery, orderSummary, selectedStore, stores) {
		this.checkoutUIData.checkoutPaymentUI.isOrderPaidInFull = orderSummary ?
			orderSummary.total <= 0 : this.checkoutUIData.checkoutPaymentUI.isOrderPaidInFull;
		// Ensure address form has been validated
		const isAddressValidated = this.activeAddressData ?
			this.activeAddressData.addressString === this.checkoutUIData.checkoutAddressFormData.get('addressString').value : false;
		const isAddressValid = isAddressValidated && this.checkoutUIData.checkoutAddressFormData.valid;
		const isDeliveryVaild = isDelivery && (selectedAddress || isAddressValid) &&
			selectedAddress !== this.checkoutUIData.checkoutAddressFormData.get('addressId');
		const isPickUpValid = !isDelivery && selectedStore && (selectedAddress || isAddressValid) && (stores && stores.length > 0);

		const isValid = !this.checkoutUIData.isCartInvalid && this.isPaymentTabComplete() && !this.checkoutUIData.isOnlyAlcohol
			&& (isDeliveryVaild || isPickUpValid) && !this.isCouponAdded && !this.isCheckOutNextStepInReview
			&& this.checkoutUIData.checkoutValidationStatus === fromModelsOrderCheckout.CheckoutValidationEnum.VALID;


		// console.log({
		// 	cart: !this.checkoutUIData.isCartInvalid,
		// 	paymentTab: this.isPaymentTabComplete(),
		// 	onlyAl: !this.checkoutUIData.isOnlyAlcohol,
		// 	dp: (isDeliveryVaild || isPickUpValid),
		// 	maybe: !this.isCheckOutNextStepInReview,
		// 	validationStatus: this.checkoutUIData.checkoutValidationStatus === fromModelsOrderCheckout.CheckoutValidationEnum.VALID
		// })

		return isValid;
	}

	/**
	 * Determine if ghost warning btn is needed
	 */
	isGhostWarningButton() {
		return (!this.checkoutUIData.isSurchargeConfirmed || !this.checkoutUIData.isCouponsValid) &&
			(this.checkoutUIData.checkoutPaymentUI.isMasterPassSelected || this.checkoutUIData.checkoutPaymentUI.isVisaCheckoutSelected)
	}
	/**
	 * Determine if payment tab is disabled
	 */
	isPaymentTabEnabled(selectedStore, selectedAddress, stores) {
		const isDelivery = this.checkoutUIData.checkoutAddressUI.isDelivery;
		if (this.checkoutUIData.checkoutAddressFormData) {
			const isDeliveryFormComplete = this.checkoutUIData.checkoutAddressFormData.valid
			const isDeliveryValid = isDelivery && (selectedAddress || isDeliveryFormComplete) &&
				selectedAddress !== this.checkoutUIData.checkoutAddressFormData.get('addressId');
			const isPickUpValid = !isDelivery && selectedStore && isDeliveryFormComplete && (stores && stores.length > 0)
			return isDeliveryValid || isPickUpValid
		}
		return false;
	}
	// Payment Private Methods
	/**
	 * Get Bambora Token
	 */
	private _getBamboraToken(isProcessOrder) {
		const nameOnCard = this.checkoutUIData.checkoutPaymentForm.get('nameOnCreditCard').value;
		const existingToken = this.checkoutUIData.checkoutPaymentForm.get('token').value;
		this.checkoutSubscriptionsRef.bamboraTokenSubscriptionRef = this.bamboraService.onSubmit().subscribe(token => {
			if (token.error) {
				// TODO - How to handle error
			} else {
				const bamboraSuccessToken = {
					token: token.token,
					name: nameOnCard
				}
				if (isProcessOrder) {
					this.checkoutUIData.paymentTokenRequest = bamboraSuccessToken
					this.checkoutUIData.paymentMethod = ServerOrderPaymentTypeEnum.Credit;

					this._orderRequestPreflight()
				} else {
					this.checkoutUIData.checkoutPaymentForm.patchValue({
						'nameOnCreditCard': null,
						'token': null,
						'studentCardNumber': null,
					})
					this.bamboraService.clearInputs()
					this.checkoutUIData.checkoutPaymentForm.markAsPristine()
					this.commonStore.dispatch(new fromActionsAccount.AddUserCardForCheckout(bamboraSuccessToken, existingToken));
				}
			}
		})
	}
	/**
	 * Dispatch Order Request
	 */
	private _buildOrderRequest() {
		const paymentRequest = {
			payment_type: this.checkoutUIData.checkoutPaymentUI.isOrderPaidInFull ?
				ServerOrderPaymentTypeEnum.Offline : this.checkoutUIData.paymentMethod,
		} as ServerOrderPaymentInterface
		if (this.checkoutUIData.checkoutPaymentUI.isPayAtDoorSelected || this.checkoutUIData.checkoutPaymentUI.isOrderPaidInFull) {
			paymentRequest.offline_payment_type = this.checkoutUIData.checkoutPaymentUI.isOrderPaidInFull ?
				'Cash' : this.checkoutUIData.checkoutPaymentForm.get('paymentMethodAtDoor').value
		} else {
			paymentRequest.payment_data = this.checkoutUIData.paymentTokenRequest
		}
		this.store.dispatch(new fromActionsOrders.BuildOrderRequest(this.checkoutUIData.checkoutAddressFormData.value, paymentRequest));
		this.checkoutUIData.paymentTokenRequest = null
	}
	/**
	 * Build Order Request For Student Cards
	 */
	private _buildStudentCardPayment() {
		const nameOnCard = this.checkoutUIData.checkoutPaymentForm.get('nameOnCreditCard').value;
		const cardNumber = this.checkoutUIData.checkoutPaymentForm.get('studentCardNumber').value;
		const studentCardKey = this.checkoutUIData.checkoutPaymentForm.get('studentCardKey').value;
		let mealKey = '';
		let universityCode = '';
		let universityName = '';
		this.universitiesWithMealCard$.subscribe(universityList => {
			const selectedUniversity = universityList ? universityList.find(university => {
				return universityList ? university.value === studentCardKey : false
			}) : null;
			if (selectedUniversity) {
				universityCode = selectedUniversity.code;
				universityName = selectedUniversity.label;
				mealKey = selectedUniversity.mealKey;
			}
		});

		const studentCardPayment = {
			name: nameOnCard,
			meal_card_number: Number(cardNumber),
			token: mealKey,
			university_code: universityCode,
			university_name: universityName,
		}
		this.checkoutUIData.paymentTokenRequest = studentCardPayment
		this.checkoutUIData.paymentMethod = ServerOrderPaymentTypeEnum.MealCard;
		this._orderRequestPreflight()
	}
	/**
	 * Encode Order Request For MP
	 */
	private _encodeOrderRequest() {
		const paymentRequest = {
			payment_type: this.checkoutUIData.paymentMethod,
		} as ServerOrderPaymentInterface
		this.store.dispatch(new fromActionsOrders.EncodeOrderRequest(this.checkoutUIData.checkoutAddressFormData.value, paymentRequest));
		this.store.dispatch(new fromActionsPayment.FetchMpRedirectUrl());
	}
	/**
	 * Preflight for order request to check if there are errors
	 */
	private _orderRequestPreflight() {
		if (!this.checkoutUIData.isCouponsValid || this.checkoutUIData.isCartHasSurcharge) {
			this.checkoutUIData.isPlaceOrderLoading = false;
			this.checkoutUIData.isCouponInvalidError = !this.checkoutUIData.isCouponsValid;
			this.checkoutUIData.isSurchargeModalOpen = this.checkoutUIData.isCartHasSurcharge;
			if (this.checkoutUIData.isCouponInvalidError) {
				this.confirmModal.onOpen(this.invalidCouponModal)
			}
			// if coupon applied then do not show up this message
			if (this.checkoutUIData.isSurchargeModalOpen && !this.checkoutUIData.couponErrorMsg) {
				this.confirmModal.onOpen(this.surchargeModal)
			}
			return false;
		}
		this._buildOrderRequest();
	}
	/**
	 * private method to update address
	 */
	private _setDefaultAddress(
		address: fromModelsAddressList.AddressListInterface,
		isResetContact: boolean,
		isResetDate: boolean,
		isPickup?: boolean) {
		address = address ? address : this.defaultAddressFormData;
		address.contactInfo = isPickup ? this.userContactDetails : address.contactInfo
		this.checkoutUIData.checkoutAddressFormData = this.ppFormBuilder.updateAddressFormData(
			address,
			this.checkoutUIData.checkoutAddressFormData,
			isResetContact,
			isResetDate
		);
	}
	/**
	 * If we are editing a coupon
	 */
	private _editGiftCard(cartItem: Product) {
		const type = cartItem.kind
		this.editRedeemModal.editAmount = cartItem.priceText.priceValue * -1;
		this.editRedeemModal.isGiftCard = type === CartItemKindEnum.GiftCard;
		if (type === CartItemKindEnum.GiftCard) {
			const giftCardToken = cartItem.id;
			this.editRedeemModal.giftCardForm.get('giftCardNumber').patchValue(cartItem.cartConfig[0].name)
			this.editRedeemModal.onGiftCardFormSubmit(giftCardToken);
		} else {
			this.editRedeemModal.handleRedeemClick()
		}
	}

	// Event Handlers
	/**
	 * Handler for cart item events
	 */
	cartProductEventHandler(event: CartItemEmitterInterface) {
		const action = event.action;
		const productCartId = event.cartId;
		switch (action) {
			case cartItemAction.removeItem: {
				this.store.dispatch(new fromActionsCart.RemoveCartItem(productCartId));
				break;
			}
			case cartItemAction.increaseQuantity:
			case cartItemAction.decreaseQuantity: {
				const isIncrease = event.action === cartItemAction.increaseQuantity
				this.store.dispatch(new fromActionsCart.UpdateCartItemQuantity(productCartId, isIncrease))
				break
			}
			case cartItemAction.editItem: {
				const type = event.cartItem.kind
				const isCombo = event.cartItem.isComboProduct;
				const seoTitle = event.cartItem.seoTitle;
				const cartItd = event.cartItem.cardId
				const isRedemtion = type === CartItemKindEnum.GiftCard || type === CartItemKindEnum.Club11
				if (!isRedemtion) {
					const baseSlug = isCombo ? 'product-combo' : 'config';
					this.router.navigate([`/catalog/${baseSlug}/${cartItd}/${seoTitle}`])
					return false
				}
				this._editGiftCard(event.cartItem)

				break
			}
			default: {
				console.log('no provided action', event)
			}
		}
	}
	/**
	 * Store List Event Handler
	 */
	handleStoreListEventEmitter(event: fromModelsStoreList.UserSavedPickupLocationsEmitterInterface) {
		const UserSavedPickupLocationsActionsEnum = fromModelsStoreList.UserSavedPickupLocationsActionsEnum
		switch (event.action) {
			case UserSavedPickupLocationsActionsEnum.onSelect: {
				this.store.dispatch(new fromActionsCart.SelectPickupStoreForCheckout(event.storeId))
				break
			}
			default: {
				console.log('action not set', event)
			}
		}
	}
	/**
	* Order Summary Event Handler
	*/
	handleOrderSummaryDataEventEmitter(event: OrderSummaryEmitterInterface) {
		const OrderActionsEnum = fromModelsOrderCheckout.OrderActionsEnum
		const action = event.action;
		switch (action) {
			case OrderActionsEnum.onMpButtonClick: {
				this._encodeOrderRequest();
				break
			}
			case OrderActionsEnum.onPlaceOrder: {
				this.checkoutUIData.isPlaceOrderLoading = true;
				// TODO consider clean up of the below section
				// If the user is entering a new credit card we need to get Bambora token first
				if (!this.checkoutUIData.paymentTokenRequest && this.checkoutUIData.paymentMethod !== ServerOrderPaymentTypeEnum.Offline) {
					if (this.checkoutUIData.checkoutPaymentUI.isCreditCardSelected) {
						const isProcessOrder = true;
						this._getBamboraToken(isProcessOrder);
					} else if (this.checkoutUIData.checkoutPaymentUI.isStudentCardSelected) {
						this._buildStudentCardPayment()
					}
				} else {
					this.checkoutUIData.paymentMethod =
						(this.checkoutUIData.checkoutPaymentUI.isStudentCardSelected && this.checkoutUIData.paymentTokenRequest) ||
							(this.checkoutUIData.checkoutPaymentUI.isCreditCardSelected && this.checkoutUIData.paymentTokenRequest) ?
							this.checkoutUIData.paymentMethod : ServerOrderPaymentTypeEnum.Offline
					this._orderRequestPreflight();
				}
				break
			}
			// Ghost button for Masterpass and visacheckout
			case OrderActionsEnum.onWarningClick: {
				this._orderRequestPreflight();

				break
			}
			default: {
				console.log(event)
			}
		}
	}
	/**
	 * Handle Store Search
	 */
	handleStoreSearchEmitter(event) {
		if (event.error) {
			this.isLocationError = true;
			this.userStore.dispatch(new fromActionsAccount.ClearStoreSearch)
			return false
		}
		if (event.action === fromModelsAddressList.UserSavedAddressesActionsEnum.onSelect) {
			this.store.dispatch(new fromActionsCart.SelectPickupStoreForCheckout(event.storeId));
			this.closeStoreSearch();
		}
		if (event.address) {
			this.userStore.dispatch(new fromActionsAccount.SearchForStores(event.address));
		}
	}
	/**
	 * Handle Store Search on Retry
	 */
	handleRetryLocationEmitter(event) {
		this.isLocationError = false;
		this.userStore.dispatch(new fromActionsAccount.ClearStoreSearch());
	}
	/**
	 * Checkout Address Form Event Handler
	 */
	handleCheckoutAddressFormEventEmitter(event: fromCheckoutAddressForm.CheckoutAddressFormEmitterInterface) {
		this.checkoutUIData.isCartInvalid = true;
		const CheckoutAddressFormActionsEnum = fromCheckoutAddressForm.CheckoutAddressFormActionsEnum
		switch (event.action) {
			case CheckoutAddressFormActionsEnum.onDeliverySelected:
			case CheckoutAddressFormActionsEnum.onPickUpSelected: {
				const isPickup = event.action === CheckoutAddressFormActionsEnum.onPickUpSelected
				this._setDefaultAddress(this.checkoutUIData.checkoutAddressFormData.value, this.isSignedInUser, false, isPickup);
				this.checkoutUIData.checkoutAddressUI.isDelivery = event.action === CheckoutAddressFormActionsEnum.onDeliverySelected;
				if (this.checkoutUIData.checkoutAddressUI.isDelivery) {
					if (event.userId) {
						this.store.dispatch(new fromActionsCart.SelectDeliveryAddressForCheckout(event.userId));
						return false;
					}
					this.store.dispatch(new fromActionsCart.SelectDefaultAddress())
				} else {
					this.checkoutPaymentForm.clearTip()
				}
				this.checkoutUIData.checkoutAddressFormData = this.ppFormBuilder.updateAddressRequiredFieldsForDelivery(
					this.checkoutUIData.checkoutAddressUI.isDelivery, this.checkoutUIData.checkoutAddressFormData
				)
				break
			}
			case CheckoutAddressFormActionsEnum.onForTodaySelected:
			case CheckoutAddressFormActionsEnum.onForFutureSelected: {
				this.checkoutUIData.checkoutAddressFormData = this.ppFormBuilder.resetTimeOnly(this.checkoutUIData.checkoutAddressFormData);
				this.checkoutUIData.checkoutAddressUI.isToday = event.action === CheckoutAddressFormActionsEnum.onForTodaySelected;

				break
			}
			case CheckoutAddressFormActionsEnum.onAddressSubmit: {
				this.checkoutUIData.isNextBtnLoading = true;
				const deliveryAddress = this.checkoutUIData.checkoutAddressFormData.value;
				if (deliveryAddress.addressId) {
					this.checkoutUIData.isEditAddress = true;
					this.confirmModal.onOpen(this.editAddressModal);
				} else {
					this.dispatchSaveAddress(deliveryAddress)
				}
				break
			}
			case CheckoutAddressFormActionsEnum.onAddLocation:
			case CheckoutAddressFormActionsEnum.onAddressSelect:
			case CheckoutAddressFormActionsEnum.onAddressEdit: {
				const isPickup = !this.checkoutUIData.checkoutAddressUI.isDelivery && event.action === CheckoutAddressFormActionsEnum.onAddLocation;
				if (this.activeAddressData) {
					this._setDefaultAddress(this.activeAddressData, false, false, isPickup);
				} else {
					this._setDefaultAddress(this.checkoutUIData.checkoutAddressFormData.value, this.isSignedInUser, false, isPickup);
				}
				const getId = event.action === CheckoutAddressFormActionsEnum.onAddressEdit ? event.userId : null;
				const selectId = event.action !== CheckoutAddressFormActionsEnum.onAddLocation ? event.userId : null;

				this.userStore.dispatch(new fromActionsAccount.GetAddressByID(getId))
				this.store.dispatch(new fromActionsCart.SelectDeliveryAddressForCheckout(selectId));

				if (isPickup) {
					this.confirmModal.onOpen(this.searchModal, 'store-search-modal-container')
				}
				break
			}
			case CheckoutAddressFormActionsEnum.onCancelAddLocation: {
				this._setDefaultAddress(null, true, false);
				this.activeAddressData = null;
				this.userStore.dispatch(new fromActionsAccount.GetAddressByID(null));
				if (event.userId) {
					this.store.dispatch(new fromActionsCart.SelectDeliveryAddressForCheckout(event.userId));
				} else {
					this.store.dispatch(new fromActionsCart.SelectDefaultAddress())
				}
				break
			}
			case CheckoutAddressFormActionsEnum.onFetchUniversityList: {
				this.commonStore.dispatch(new FetchUniversityList())
				break
			}
			case CheckoutAddressFormActionsEnum.onFetchBuildingList: {
				const val = event.universityId;
				this.commonStore.dispatch(new FetchBuildingList(val))
				break
			}
			default: {
				console.log(event)
			}
		}
	}

	/**
	* handler coupon emitter - validate call
	*/
	handleOnAddCouponEventEmitter(event) {
		const deliveryAddress = this.checkoutUIData.checkoutAddressFormData.value;
		this.dispatchSaveAddress(deliveryAddress)
	}

	/**
	* Checkout Payment Method Form Event Handler - TODO turn this into switch statement
	*/
	handleCheckoutPaymentMethodFormEventEmitter(event: fromCheckoutPaymentForm.CheckoutPaymentMethodFormEmitterInterface) {
		const CheckoutPaymentMethodFormActionEnum = fromCheckoutPaymentForm.CheckoutPaymentMethodFormActionEnum
		this.checkoutUIData.checkoutPaymentUI = {
			isCreditCardSelected: event.action === CheckoutPaymentMethodFormActionEnum.onCreditCardSelected,
			isPayAtDoorSelected: event.action === CheckoutPaymentMethodFormActionEnum.onPayAtDoorSelected,
			isStudentCardSelected: event.action === CheckoutPaymentMethodFormActionEnum.onStudentCardSelected
		}
		this.checkoutUIData.paymentTokenRequest = null;
		this.store.dispatch(new fromActionsAccount.SelectPaymentMethodForCheckout(null, event.action))

		switch (event.action) {
			case CheckoutPaymentMethodFormActionEnum.onCreditCardSelected: {
				this.bamboraService.initCustomCheckout();
				this.checkoutUIData.paymentMethod = null;
				this.checkoutUIData.checkoutPaymentForm = this.ppFormBuilder.buildCreditCardForm(this.checkoutUIData.checkoutPaymentForm)
				break
			}
			case CheckoutPaymentMethodFormActionEnum.onPayAtDoorSelected: {
				this.checkoutUIData.paymentMethod = ServerOrderPaymentTypeEnum.Offline;
				this.checkoutUIData.checkoutPaymentForm = this.ppFormBuilder.buildPayAtDoorForm(this.checkoutUIData.checkoutPaymentForm);
				this.checkoutUIData.checkoutPaymentForm.markAsDirty()
				this.checkoutPaymentForm.clearTip()
				break
			}
			case CheckoutPaymentMethodFormActionEnum.onStudentCardSelected: {
				this.checkoutUIData.paymentMethod = null;
				this.store.dispatch(new FetchUniversityList())
				this.checkoutUIData.checkoutPaymentForm = this.ppFormBuilder.buildPayViaStudentCardForm(this.checkoutUIData.checkoutPaymentForm)
				this.checkoutPaymentForm.clearTip()
				break
			}
			default: {
				console.log(event.action)
			}
		}
	}
	/**
	 * Handle User Payment Methods Events
	 */
	handleUserPaymentMethodsEventEmitter(event: UserCreditCardsEmitterInterface) {
		this.checkoutUIData.checkoutPaymentUI.isMasterPassSelected = event.action === UserCreditCardsActions.onSelectMasterPass
		this.checkoutUIData.checkoutPaymentUI.isVisaCheckoutSelected = event.action === UserCreditCardsActions.onSelectVisa
		switch (event.action) {
			case UserCreditCardsActions.onSelect:
			case UserCreditCardsActions.onSelectVisa:
			case UserCreditCardsActions.onSelectMasterPass:
			case UserCreditCardsActions.onAddNewCard:
			case UserCreditCardsActions.onEdit:
			case UserCreditCardsActions.onSaveNewCard: {
				const paymentId = event.action === UserCreditCardsActions.onSelect ? event.token : null;
				let isOpen = event.action !== UserCreditCardsActions.onAddNewCard ? true : event.isOpen;
				isOpen = event.action === UserCreditCardsActions.onEdit ? false : isOpen;
				this.checkoutUIData.isPaymentFormOpen = !isOpen;
				const creditFormAction = event.action === UserCreditCardsActions.onAddNewCard ||
					event.action === UserCreditCardsActions.onEdit;
				const isSaveCard = event.action === UserCreditCardsActions.onSaveNewCard;
				let paymentMethodEnum = event.action === UserCreditCardsActions.onSelectMasterPass ?
					fromCheckoutPaymentForm.CheckoutPaymentMethodFormActionEnum.onMasterPassSelected :
					fromCheckoutPaymentForm.CheckoutPaymentMethodFormActionEnum.onCreditCardSelected;
				paymentMethodEnum = event.action === UserCreditCardsActions.onSelectVisa ?
					fromCheckoutPaymentForm.CheckoutPaymentMethodFormActionEnum.onVisaCheckoutSelected :
					paymentMethodEnum;
				if (isSaveCard) {
					const isProcessOrder = false;
					this._getBamboraToken(isProcessOrder);
					return false;
				}
				if (paymentId) {
					this.checkoutUIData.checkoutPaymentForm.patchValue({
						'nameOnCreditCard': null,
						'token': null,
						'studentCardNumber': null,
					})
					this.bamboraService.clearInputs()
					this.checkoutUIData.checkoutPaymentForm.markAsPristine()
				}
				if (creditFormAction) {
					this.store.dispatch(new fromActionsAccount.EditPaymentMethod(event.token))
					this.checkoutUIData.checkoutPaymentForm.patchValue({
						'nameOnCreditCard': null,
						'token': event.token,
						'studentCardNumber': null,
					})
					this.bamboraService.clearInputs()
					this.checkoutUIData.checkoutPaymentForm.markAsPristine()
					return false
				}
				this.store.dispatch(new fromActionsAccount.SelectPaymentMethodForCheckout(paymentId, paymentMethodEnum))
				break
			}
			default: {
				console.log(event)
			}
		}
	}
	// MODALS
	/**
	 * Confirm Surcharge
	 */
	onConfirmSurchargeClickHandler(isPlaceOrder: boolean, isConfirmed: boolean) {
		this.checkoutUIData.isSurchargeModalOpen = false;
		this.checkoutUIData.isSurchargeConfirmed = isConfirmed;
		if (isPlaceOrder && isConfirmed) {
			this.checkoutUIData.isPlaceOrderLoading = true;
			this._buildOrderRequest()
		}
	}
	/**
		* Handle Edit Address Confirmation
		*/
	handleEditAddressConfirmation(isSave, isCancel = false) {
		this.checkoutUIData.isEditAddress = false;
		if (isCancel) {
			this.checkoutUIData.isNextBtnLoading = false;
			this.checkoutNextStep('address');
			return false
		}
		const addressInput = this.checkoutUIData.checkoutAddressFormData.value;
		addressInput.addressId = isSave ? addressInput.addressId : null;
		this._setDefaultAddress(null, true, false);
		this.dispatchSaveAddress(addressInput)
	}
	/**
		* Handle when user gets notified about failure to add credit card
		*/
	handleCreditCardFailure() {
		this.userStore.dispatch(new fromActionsAccount.ClearCardFailureMessage())
	}
	/**
	 * Store is not avail for validate
	 */
	// handleStoreNotAvail() {
	// 	if ( !this.checkoutUIData.contactLessErrorMessage) {
	// 		if ( !this.checkoutUIData.errorCode) {
	// 			window.location.reload();
	// 		}
	// 	}
	// }
	/**
	 * Close Store Search Modal
	 */
	closeStoreSearch() {
		this.confirmModal.onCancel()
		this.userStore.dispatch(new fromActionsAccount.ClearStoreSearch());
		this.isLocationError = false;
	}
	/**
	 * General Error Close
	 */
	closeErrorMessage(id) {
		this.checkoutUIData.isNextBtnLoading = false;
		this.checkoutNextStep(id);
	}
	// tslint:disable-next-line:max-file-line-count
}
