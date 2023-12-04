// Angular and ngrx
import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, filter, withLatestFrom } from 'rxjs/operators';

// models
import { ServerProcessOrderResponse } from '../../checkout/models/server-process-order-response';
import { ServerCartResponseInterface } from '../../checkout/models/server-cart-response';
import { RecommendationInterface } from '../../home/models/recommendations'
// State
import { State } from '../../root-reducer/root-reducer';

// Service
import { TagManagerService } from '../services/tag-manager'
import { SignUpActionTypes } from 'app/user/actions/sign-up-actions';
// Actions
import * as actionsSocialSignIn from 'app/user/actions/social-login';
import { TagManagerActionsTypes } from '../actions/tag-manager';
import { KidsClubActionTypes } from '../../user/actions/kids-club-actions';
import { AccountActionTypes } from '../../user/actions/account-actions';
import { Club1111ActionTypes } from '../../user/actions/club1111-actions';
import { LoyaltyActionsTypes } from '../../checkout/actions/loyalty';
import { CouponActionTypes } from '../actions/coupons';
import { StoreActionsTypes, SearchStoreForDeliveryFailure } from '../actions/store';
import { PizzaAssistantActionTypes } from '../../catalog/actions/pizza-assistant'
import { OrderActionsTypes } from '../../checkout/actions/orders';
import { ConfiguratorActionsTypes } from '../../catalog/actions/configurator'
import { CatalogComboConfigListTypes } from '../../catalog/actions/combo-config';
import { CartActionsTypes } from '../../checkout/actions/cart';
import { JustForYouTypes } from '../../catalog/actions/just-for-you'
import { CouponWalletActionTypes } from '../../common/actions/coupon-wallet';
import { HomeActionsTypes } from '../../home/actions/home'
// Enums
import { DataLayerEventEnum, DataLayerRegistrationEventEnum, DataLayerNotificationActionsEnum } from '../models/datalayer-object';

import { ServerJustForYouInterface } from 'app/catalog/models/server-just-for-you';
import { CatalogProductListTypes } from 'app/catalog/actions/product-list';
import { ServerProductList } from 'app/catalog/models/server-products-list';
import { CatalogFeaturedSliderTypes } from 'app/catalog/actions/featured-products';
import { RecommendationActionTypes } from '../actions/recommendations';
import { ServerProductInListInterface } from 'app/catalog/models/server-product-in-list';

// tslint:disable:max-file-line-count

/**
 * Filter Coupons In Wallet Based on Cart
 */
export enum eventValueEnum {
	ONE = 1,
	UNDEFINED = 'undefined'
}
@Injectable()
export class TagManagerEffects {

	@Effect({ dispatch: false })
	updateDLOnSignIn = this.actions.pipe(
		filter(action => action.type === SignUpActionTypes.UserLoginSuccess),
		withLatestFrom(this.store$),
		map(([action, storeData]) => {
			const eventLabel = action['loginType'];
			const dataObject = {
				event: 'signinsuccess',
				eventCategory: 'Sign in',
				eventAction: 'Successful sign in',
				eventLabel: eventLabel,
				eventValue: eventValueEnum.ONE
			}
			this.tagMangerService.allHitsFunction(storeData);
			this.tagMangerService.pushToDataLayer(dataObject);
		})
	)

	@Effect({ dispatch: false })
	updateDLOnSignInEvents = this.actions.pipe(
		// TO DO Social login and sign up have the same name for enum but consist of diferent actions
		filter(action => action.type === TagManagerActionsTypes.UpdateDataLayer ||
			action.type === actionsSocialSignIn.SignUpActionTypes.LoginWithFb ||
			action.type === actionsSocialSignIn.SignUpActionTypes.LoginWithFbSuccess ||
			action.type === actionsSocialSignIn.SignUpActionTypes.LoginWithGoogle ||
			action.type === actionsSocialSignIn.SignUpActionTypes.LoginWithGoogleSuccess ||
			action.type === SignUpActionTypes.ResetPasswordSendEmail),
		withLatestFrom(this.store$),
		map(([action, storeData]) => {
			let eventType = action['event'] ? action['event'] : '';
			eventType = action.type === actionsSocialSignIn.SignUpActionTypes.LoginWithFb ||
				action.type === actionsSocialSignIn.SignUpActionTypes.LoginWithGoogle ? 'signinutton' : eventType;
			eventType = action.type === actionsSocialSignIn.SignUpActionTypes.LoginWithFbSuccess ||
				action.type === actionsSocialSignIn.SignUpActionTypes.LoginWithGoogleSuccess ? 'signinsuccess' : eventType;
			eventType = action.type === SignUpActionTypes.ResetPasswordSendEmail ? 'resetpw' : eventType;

			let eventCateg = 'Sign in';
			eventCateg = action['event'] === DataLayerEventEnum.SAVEPW ? 'Account' : eventCateg;

			let eventLabel = action['eventLabel'] ? action['eventLabel'] : '';
			eventLabel = action.type === actionsSocialSignIn.SignUpActionTypes.LoginWithFb ? 'Facebook' : eventLabel;
			eventLabel = action.type === actionsSocialSignIn.SignUpActionTypes.LoginWithGoogle ? 'Google' : eventLabel;

			let eventAction = 'Clicks to sign in';
			eventAction = eventType === DataLayerEventEnum.FORGOTPW ? 'Forgot password Clicks' : eventAction;
			eventAction = action.type === SignUpActionTypes.ResetPasswordSendEmail ? 'Reset password Clicks' : eventAction;
			eventAction = eventType === DataLayerEventEnum.SIGNINBTN ||
				action.type === actionsSocialSignIn.SignUpActionTypes.LoginWithGoogle ||
				action.type === actionsSocialSignIn.SignUpActionTypes.LoginWithFb ? 'Sign in Submits' : eventAction;
			eventAction = action['event'] === DataLayerEventEnum.SAVEPW ? 'Clicks to change password' : eventAction;

			eventAction = action.type === actionsSocialSignIn.SignUpActionTypes.LoginWithGoogleSuccess ||
				action.type === actionsSocialSignIn.SignUpActionTypes.LoginWithFbSuccess ? 'Successful sign in ' : eventAction;

			let eventValue = eventValueEnum.UNDEFINED
			eventValue = eventType === 'signinsuccess' ? eventValueEnum.ONE : eventValue;

			const dataObject = {
				event: eventType,
				eventCategory: eventCateg,
				eventAction: eventAction,
				eventLabel: eventLabel,
				eventValue: eventValue
			}
			this.tagMangerService.allHitsFunction(storeData);
			this.tagMangerService.pushToDataLayer(dataObject)
		})
	)

	@Effect({ dispatch: false })
	updateDLOnRegistration = this.actions.pipe(
		filter(action => action.type === SignUpActionTypes.RegisterNewUserSuccess ||
			action.type === TagManagerActionsTypes.RegistrationDataLayer),
		withLatestFrom(this.store$),
		map(([action, storeData]) => {

			let eventType = action['event'] ? action['event'] : '';
			eventType = action.type === SignUpActionTypes.RegisterNewUserSuccess &&
				!action['userDetails']['club_11_11_member'] ? 'justaccount' : eventType;
			eventType = action.type === SignUpActionTypes.RegisterNewUserSuccess &&
				action['userDetails']['club_11_11_member'] ? 'registerClick' : eventType;


			let eventAction = 'Sign up Clicks';
			eventAction = eventType === DataLayerRegistrationEventEnum.REGCONTINUE ? 'Registrations started' : eventAction;
			eventAction = eventType === DataLayerRegistrationEventEnum.REGCLICK ? 'Card Registrations' : eventAction;
			eventAction = action.type === SignUpActionTypes.RegisterNewUserSuccess ? 'Accounts created' : eventAction;

			let eventLabel = TagManagerActionsTypes.RegistrationDataLayer ? action['eventLabel'] : '';
			eventLabel = action.type === SignUpActionTypes.RegisterNewUserSuccess && !action['userDetails']['club_11_11_member'] ?
				action['userDetails']['customer_id'] : eventLabel; // will be changed on user ID
			if (action.type === SignUpActionTypes.RegisterNewUserSuccess && action['userDetails']['club_11_11_member']) {
				eventLabel = action['isNewCard'] ? 'I need a card' : 'I have a card';
				eventAction = 'Card Registrations';
			}
			let eventValue = eventValueEnum.UNDEFINED;
			eventValue = eventType === 'registerClick' || eventType === 'justaccount' ? eventValueEnum.ONE : eventValue;

			const dataObject = {
				event: eventType,
				eventCategory: 'Registrations',
				eventAction: eventAction,
				eventLabel: eventLabel,
				eventValue: eventValue
			}
			this.tagMangerService.allHitsFunction(storeData);
			this.tagMangerService.pushToDataLayer(dataObject);
		})
	)

	@Effect({ dispatch: false })
	updateDLonAccount = this.actions.pipe(
		filter(action => action.type === KidsClubActionTypes.RegisterNewKidsClubSuccess ||
			action.type === AccountActionTypes.AddUserCardSuccess ||
			action.type === AccountActionTypes.SaveMealCardSuccess ||
			action.type === AccountActionTypes.UpdateAddressRequestSuccess),
		withLatestFrom(this.store$),
		map(([action, storeData]) => {
			let eventType = ''
			eventType = action.type === KidsClubActionTypes.RegisterNewKidsClubSuccess ? 'kidsclub' : eventType;
			eventType = action.type === AccountActionTypes.AddUserCardSuccess ||
				action.type === AccountActionTypes.SaveMealCardSuccess ||
				action.type === AccountActionTypes.AddUserCardSuccess ? 'savedpayment' : eventType;
			eventType = action.type === AccountActionTypes.UpdateAddressRequestSuccess ? 'savedaddress' : eventType;
			// eventType = action.type === AccountActionTypes.UpdateStoreRequestSuccess ? 'savedpickup' : eventType;

			let eventAction = '';
			eventAction = action.type === KidsClubActionTypes.RegisterNewKidsClubSuccess ? 'Kids Club Registrations' : eventAction;
			eventAction = action.type === AccountActionTypes.AddUserCardSuccess ||
				action.type === AccountActionTypes.SaveMealCardSuccess ? 'Saved Payment methods' : eventAction;
			eventAction = action.type === AccountActionTypes.UpdateAddressRequestSuccess ? 'Saved addresses' : eventAction;
			// eventAction = action.type === AccountActionTypes.UpdateStoreRequestSuccess ? 'Saved pickup locations' : eventAction;


			let eventLabel = '';
			eventLabel = action.type === KidsClubActionTypes.RegisterNewKidsClubSuccess ? action['response']['id'] : eventLabel;
			eventLabel = action.type === AccountActionTypes.AddUserCardSuccess &&
				action['response']['cards'].length > 0 ? 'Credit Card' : eventLabel;
			eventLabel = action.type === AccountActionTypes.SaveMealCardSuccess ? 'Student Meal Card' : eventLabel;
			if (action.type === AccountActionTypes.UpdateAddressRequestSuccess) {
				eventLabel = !action['isResidential'] ? 'University' : 'Residential';
			}
			// eventLabel = action.type === AccountActionTypes.UpdateStoreRequestSuccess ? `${action['storeId']}` : eventLabel;

			let eventValue = eventValueEnum.UNDEFINED;
			eventValue = eventType === 'kidsclub' ? eventValueEnum.ONE : eventValue;

			const dataObject = {
				event: eventType,
				eventCategory: 'Account',
				eventAction: eventAction,
				eventLabel: `${eventLabel}`,
				eventValue: eventValue
			}
			this.tagMangerService.allHitsFunction(storeData);
			this.tagMangerService.pushToDataLayer(dataObject);
		})
	)

	@Effect({ dispatch: false })
	defaultUserPayments = this.actions.pipe(
		filter(action => action.type === AccountActionTypes.SetUserDefaultPaymentMethodSuccess),
		withLatestFrom(this.store$),
		map(([action, storeData]) => {
			let dataObject;
			if (action['defaultPayment'] && action['defaultPayment']['default_payment']['payment_method']
				&& action['defaultPayment']['default_payment']['payment_method'] !== 'MEAL_CARD') {
				let eventLabel = '';
				eventLabel = action['defaultPayment']['default_payment']['payment_method'] === 'MASTERPASS' ? 'MasterPass' : eventLabel;
				eventLabel = action['defaultPayment']['default_payment']['payment_method'] === 'VISA' ? 'VisaCheckout' : eventLabel;

				dataObject = {
					event: 'defaultoption',
					eventCategory: 'Account',
					eventAction: 'Default payment method',
					eventLabel: eventLabel,
					eventValue: 'undefined'
				}
				this.tagMangerService.allHitsFunction(storeData);
				this.tagMangerService.pushToDataLayer(dataObject);
			}
		})
	)
	@Effect({ dispatch: false })
	updateDLonAccountStepTwo = this.actions.pipe(
		filter(action => action.type === SignUpActionTypes.UpdateUserEditProfileSuccess ||
			action.type === SignUpActionTypes.SetNewPasswordSuccess),
		withLatestFrom(this.store$),
		map(([action, storeData]) => {
			let eventType = ''
			eventType = action.type === SignUpActionTypes.UpdateUserEditProfileSuccess ? 'saveprofile' : eventType;
			eventType = action.type === SignUpActionTypes.SetNewPasswordSuccess ? 'updatepw' : eventType;
			let eventAction = '';
			eventAction = action.type === SignUpActionTypes.UpdateUserEditProfileSuccess ? 'Saved Profiles' : eventAction;
			eventAction = action.type === SignUpActionTypes.SetNewPasswordSuccess ? 'Updated passwords' : eventAction;
			const eventLabel = '';
			const dataObject = {
				event: eventType,
				eventCategory: 'Account',
				eventAction: eventAction,
				eventLabel: eventLabel,
				eventValue: eventValueEnum.UNDEFINED
			}
			this.tagMangerService.allHitsFunction(storeData);
			this.tagMangerService.pushToDataLayer(dataObject);
		})
	)

	@Effect({ dispatch: false })
	updateDLpnClub1111 = this.actions.pipe(
		// withLatestFrom(store)
		filter(action => action.type === Club1111ActionTypes.AddClub1111FundsRequestSuccess ||
			action.type === LoyaltyActionsTypes.RedeemLoyaltyCardSuccess ||
			action.type === Club1111ActionTypes.FetchClub11CardBalance),
		withLatestFrom(this.store$),
		map(([action, storeData]) => {
			let eventType = ''
			eventType = action.type === Club1111ActionTypes.AddClub1111FundsRequestSuccess ? 'addfunds' : eventType;
			eventType = action['event'] === DataLayerEventEnum.CLCKTOREEDEM ? action['event'] : eventType;
			eventType = action.type === LoyaltyActionsTypes.RedeemLoyaltyCardSuccess ? 'redeem' : eventType;
			eventType = action.type === Club1111ActionTypes.FetchClub11CardBalance ? 'addcard' : eventType

			let eventAction = '';
			eventAction = action.type === Club1111ActionTypes.AddClub1111FundsRequestSuccess ? 'Added Funds' : eventAction;
			eventAction = action['event'] === DataLayerEventEnum.CLCKTOREEDEM ? 'Clicks to redeem' : eventAction;
			eventAction = action.type === LoyaltyActionsTypes.RedeemLoyaltyCardSuccess ? 'Redemptions' : eventAction;
			eventAction = action.type === Club1111ActionTypes.FetchClub11CardBalance ? 'Added Cards' : eventAction;

			let eventLabel = '';
			eventLabel = action.type === Club1111ActionTypes.AddClub1111FundsRequestSuccess ? `${action['amountAdded']}` : eventLabel;
			eventLabel = action['event'] === DataLayerEventEnum.CLCKTOREEDEM ? action['eventLabel'] : eventLabel;
			eventLabel = action.type === LoyaltyActionsTypes.RedeemLoyaltyCardSuccess ? `${action['redeemAmount']}` : eventLabel;
			eventLabel = action.type === Club1111ActionTypes.FetchClub11CardBalance ? action['cardNumber'] : eventLabel;

			const dataObject = {
				event: eventType,
				eventCategory: 'Club 11/11',
				eventAction: eventAction,
				eventLabel: eventLabel,
				eventValue: eventValueEnum.UNDEFINED
			}
			if (storeData.router.state.url !== '/' && storeData.router.state.url !== '/user/account' &&
				action.type === Club1111ActionTypes.FetchClub1111AutoReloadSettingsSuccess) {
				this.tagMangerService.allHitsFunction(storeData);
				this.tagMangerService.pushToDataLayer(dataObject);
			} else if (action.type !== Club1111ActionTypes.FetchClub1111AutoReloadSettingsSuccess) {
				this.tagMangerService.allHitsFunction(storeData);
				this.tagMangerService.pushToDataLayer(dataObject);
			}
		})
	)

	@Effect({ dispatch: false })
	updateDLBasedOnStore = this.actions.pipe(
		filter(action => action.type === TagManagerActionsTypes.UpdateDataLayerClub11111),
		withLatestFrom(this.store$),
		map(([action, storeData]) => {
			let eventType = ''
			eventType = action['event'] === DataLayerEventEnum.CLCKTOREEDEM ? action['event'] : eventType;

			let eventAction = '';
			eventAction = action['event'] === DataLayerEventEnum.CLCKTOREEDEM ? 'Clicks to redeem' : eventAction;


			let eventLabel = '';
			const pageRoute = storeData.router.state.url === '/checkout' ? 'Checkout' : 'Club 11-11'
			eventLabel = action['event'] === DataLayerEventEnum.CLCKTOREEDEM ? pageRoute : '';

			const dataObject = {
				event: eventType,
				eventCategory: 'Club 11/11',
				eventAction: eventAction,
				eventLabel: eventLabel,
				eventValue: eventValueEnum.UNDEFINED
			}
			this.tagMangerService.allHitsFunction(storeData);
			this.tagMangerService.pushToDataLayer(dataObject);
		})
	)

	@Effect({ dispatch: false })
	updateDLCoupons = this.actions.pipe(
		filter(action => action.type === TagManagerActionsTypes.CouponsDataLayer ||
			action.type === CouponActionTypes.AddCouponSuccess ||
			action.type === CouponWalletActionTypes.AddCouponToWalletSuccess),
		withLatestFrom(this.store$),
		map(([action, storeData]) => {
			let eventType = '';
			eventType = action.type === TagManagerActionsTypes.CouponsDataLayer ? 'addcoupon' : eventType;
			eventType = action.type === CouponActionTypes.AddCouponSuccess ||
				action.type === CouponWalletActionTypes.AddCouponToWalletSuccess ? 'couponapplied' : eventType;

			let eventAction = '';
			eventAction = action.type === TagManagerActionsTypes.CouponsDataLayer ? 'Clicks to add coupons' : eventAction;
			eventAction = action.type === CouponActionTypes.AddCouponSuccess ||
				action.type === CouponWalletActionTypes.AddCouponToWalletSuccess ? 'Added coupons' : eventAction;

			let eventLabel = '';
			eventLabel = action.type === TagManagerActionsTypes.CouponsDataLayer ? action['eventLabel'] : eventLabel;
			eventLabel = action.type === CouponActionTypes.AddCouponSuccess ||
				action.type === CouponWalletActionTypes.AddCouponToWalletSuccess ? action['couponCode'] : eventLabel;

			let eventValue = eventValueEnum.UNDEFINED;
			eventValue = eventType === 'couponapplied' ? eventValueEnum.ONE : eventValue;

			const dataObject = {
				event: eventType,
				eventCategory: 'Coupons',
				eventAction: eventAction,
				eventLabel: eventLabel,
				eventValue: eventValue
			}
			this.tagMangerService.allHitsFunction(storeData);
			this.tagMangerService.pushToDataLayer(dataObject);
		})
	)

	@Effect({ dispatch: false })
	updateDLonLocations = this.actions.pipe(
		filter(action => action.type === TagManagerActionsTypes.LocationsDataLayer ||
			action.type === StoreActionsTypes.SaveUserInput),
		withLatestFrom(this.store$),
		map(([action, storeData]) => {

			let eventType = '';
			eventType = action.type === TagManagerActionsTypes.LocationsDataLayer ? action['eventType'] : eventType;
			eventType = action.type === StoreActionsTypes.SaveUserInput ? 'goclick' : eventType;

			let eventCateg = 'Locations';
			eventCateg = action['eventType'] === 'helpassistant' || action['eventType'] === 'backassistant' ||
				action['eventType'] === 'doneassistant' ? 'Pizza Assistant' : eventCateg;

			let eventAction = '';
			eventAction = action.type === TagManagerActionsTypes.LocationsDataLayer ? action['eventAction'] : eventAction;
			eventAction = action.type === StoreActionsTypes.SaveUserInput ? 'Search Clicks' : eventAction;

			let eventLabel = '';
			eventLabel = action.type === TagManagerActionsTypes.LocationsDataLayer ? action['eventLabel'] : eventLabel;
			if (action.type === StoreActionsTypes.SaveUserInput) {
				eventLabel = action['isDelivery'] ? 'Delivery' : 'Pickup';
			}

			let eventValue = eventValueEnum.UNDEFINED;
			eventValue = eventType === 'doneassistant' ? eventValueEnum.ONE : eventValue;
			const dataObject = {
				event: eventType,
				eventCategory: eventCateg,
				eventAction: eventAction,
				eventLabel: eventLabel,
				eventValue: eventValue
			}
			if (eventType === 'doneassistant') {
				const impressions = [];
				const assitantProductList = storeData.catalog.pizzaAssistant.entities
				for (const key of Object.keys(assitantProductList)) {
					impressions.push({
						name: assitantProductList[key].name,
						id: assitantProductList[key].cart_request.product_id,
						brand: 'default',
						category: assitantProductList[key].config_cache.data.products[0].is_pizza ? 'Pizza' : 'Not Pizza',
						list: 'Pizza Assistant',
						position: Math.abs(assitantProductList[key].config_cache.data.products[0].sequence)
					})
				}
				const dataObjectImpressions = {
					event: 'impressionview',
					ecommerce: {
						impressions
					}
				}
				this.tagMangerService.pushToDataLayer(dataObjectImpressions);
			}
			if (storeData.router.state.url === '/catalog/pizza-assistant' && action['eventType'] === 'backassistant') {
				this.tagMangerService.allHitsFunction(storeData);
				this.tagMangerService.pushToDataLayer(dataObject);
			} else if (action['eventType'] !== 'backassistant') {
				this.tagMangerService.allHitsFunction(storeData);
				this.tagMangerService.pushToDataLayer(dataObject);
			}
		})
	)
	@Effect({ dispatch: false })
	updateDLonPizzaAssistant = this.actions.pipe(
		filter(action => action.type === PizzaAssistantActionTypes.InitPizzaAssistant),
		withLatestFrom(this.store$),
		map(([action, storeData]) => {
			let eventType = '';
			eventType = action.type === PizzaAssistantActionTypes.InitPizzaAssistant ? 'assistantclick' : eventType;


			let eventAction = '';
			eventAction = action.type === PizzaAssistantActionTypes.InitPizzaAssistant ? 'Launches' : eventAction;

			const eventLabel = '';

			const dataObject = {
				event: eventType,
				eventCategory: 'Pizza Assistant',
				eventAction: eventAction,
				eventLabel: eventLabel,
				eventValue: eventValueEnum.UNDEFINED
			}
			this.tagMangerService.allHitsFunction(storeData);
			this.tagMangerService.pushToDataLayer(dataObject);
		})
	)

	@Effect({ dispatch: false })
	updateDLonPurchase = this.actions.pipe(
		filter(action => {
			const isOrderSuccss = action.type === OrderActionsTypes.ProcessOrderRequestSuccess;
			const isCartInState = action['serverCart'];
			return isOrderSuccss && isCartInState
		}),
		withLatestFrom(this.store$),
		map(([action, storeData]) => {
			let actionData = {} as ServerProcessOrderResponse;
			actionData = action.type === OrderActionsTypes.ProcessOrderRequestSuccess ?
				action['orderRequestResponse'] : actionData;
			const serverCartData = action['serverCart'] as ServerCartResponseInterface

			const summaryOrder = actionData.summary.order_components;

			const taxGST = summaryOrder.find(price => price.code === 'GST') ? summaryOrder.find(price => price.code === 'GST').value : 0;
			const taxHST = summaryOrder.find(price => price.code === 'HST') ? summaryOrder.find(price => price.code === 'HST').value : 0;
			const taxPST = summaryOrder.find(price => price.code === 'PST') ? summaryOrder.find(price => price.code === 'PST').value : 0;
			const taxTotal = taxGST + taxHST + taxPST;
			const shippingPrice = summaryOrder.find(charge => charge.code === 'delivery_charge') ?
				summaryOrder.find(charge => charge.code === 'delivery_charge').value : 0;
			const couponAmount = summaryOrder.find(charge => charge.label === 'Discount') ?
				summaryOrder.find(charge => charge.code === 'discount').value : 0;
			let redemptionAmount = 0;
			let giftCardAmount = 0;
			let discountNames = [];
			let discountList = '';
			actionData.summary.redemption_components.forEach(item => {
				if (item.code === 'club_11_11') {
					redemptionAmount = item.value;
					discountNames.push(item.label);
				}
				if (item.code === 'gift_card') {
					giftCardAmount = item.value;
					discountNames.push(item.label);
				}
			})


			const mappedProducts = [];
			serverCartData.products.forEach(product => {
				let productDescription = '';
				product.config_options.forEach(option => {
					productDescription += option.name + ',' + ' ';
				})
				const couponFreeProductId = product.price === 0 ? serverCartData.coupon.coupons[0].coupon_code : 'undefined';

				if (couponFreeProductId !== 'undefined') {
					discountNames.push('coupon');
				}
				if (discountNames.length > 0) {
					discountList = discountNames.join(', ')
				} else {
					discountNames = []
					discountList = discountNames.join('')
				}

				const variantNum = product.product_option_id === 0 ? 'undefined' : product.product_option_id;
				const currentProduct = {
					name: product.name,
					id: `${product.product_id}`,
					price: `${product.price}`,
					brand: product.kind,
					category: 'undefined',
					variant: `${variantNum}`,
					dimension6: productDescription,
					quantity: product.quantity,
					coupon: `${couponFreeProductId}`
				}
				if (product.price >= 0) {
					mappedProducts.push(currentProduct);
				}
			})

			const isCLub1111Member = storeData.user.userLogin.loggedInUser && storeData.user.userLogin.loggedInUser.isClubElevenElevenMember
				? 'Club 11-11' : 'undefined';
			let amountOfFreeProducts = 0;
			serverCartData.products.forEach(serverProduct => {
				if (serverProduct.price === 0) {
					amountOfFreeProducts++;
				}
			})
			const couponCode = serverCartData.coupon ? serverCartData.coupon.coupons[0].coupon_code : 'undefined';
			const dataObject = {
				event: 'purchase',
				couponDiscount: `${couponAmount}`,
				redemptionDiscount: `${Math.abs(redemptionAmount)}`,
				giftCardDiscount: `${Math.abs(giftCardAmount)}`,
				orderType: actionData.order_type,
				paymentType: action['paymentType'],
				discountType: discountList,
				ecommerce: {
					currencyCode: 'CAD',
					purchase: {
						actionField: {
							id: `${actionData.order_id}`,
							affiliation: isCLub1111Member,
							revenue: `${actionData.total - taxTotal}`,
							tax: `${taxTotal}`,
							shipping: `${shippingPrice}`,
							coupon: amountOfFreeProducts === 0 ? couponCode : 'undefined'
						},
						products: mappedProducts,
					}
				}
			}
			this.tagMangerService.allHitsFunction(storeData);
			this.tagMangerService.pushToDataLayer(dataObject);
			let optionType = action['paymentType'];
			optionType = action['paymentType'] === 'Offline' ? 'pay at door' : '';
			optionType = action['paymentType'] === 'Credit' ? 'credit card' : optionType;
			optionType = action['paymentType'] === 'MealCard' ? 'student card' : optionType;
			const eecObject = {
				event: 'eec.checkout_option',
				ecommerce: {
					checkout_option: {
						actionField: {
							step: 3,
							option: action['paymentType']
						}
					}
				}
			};
			this.tagMangerService.pushToDataLayer(eecObject);
		})
	)

	@Effect({ dispatch: false })
	updateDLonPageViews = this.actions.pipe(
		filter(action =>
			action.type === ConfiguratorActionsTypes.FetchSingleProductSuccess ||
			action.type === CatalogComboConfigListTypes.FetchComboConfigSuccess ||
			action.type === ConfiguratorActionsTypes.FetchSingleConfigurableComboSuccess ||
			action.type === ConfiguratorActionsTypes.FetchTwinProductConfigSuccess),
		withLatestFrom(this.store$),
		map(([action, storeData]) => {
			let actionData = action.type === ConfiguratorActionsTypes.FetchSingleProductSuccess ||
				action.type === ConfiguratorActionsTypes.FetchSingleConfigurableComboSuccess ||
				action.type === ConfiguratorActionsTypes.FetchTwinProductConfigSuccess ?
				action['serverProductConfig'] : {};
			actionData = action.type === CatalogComboConfigListTypes.FetchComboConfigSuccess ? action['productComboServerConfig'] : actionData;
			let nameOfProduct = actionData.seo_title;
			nameOfProduct = action.type === ConfiguratorActionsTypes.FetchSingleProductSuccess ?
				actionData['data']['products'][0]['name'] : nameOfProduct;
			nameOfProduct = action.type === CatalogComboConfigListTypes.FetchComboConfigSuccess ||
				action.type === ConfiguratorActionsTypes.FetchTwinProductConfigSuccess ||
				action.type === ConfiguratorActionsTypes.FetchSingleConfigurableComboSuccess ? actionData['data']['combo']['name'] : nameOfProduct;
			let dataObject = {};
			dataObject = {
				event: 'detailview',
				ecommerce: {
					detail: {
						actionField: {},
						products: [{
							name: nameOfProduct,
							id: actionData.product_id,
							brand: actionData.kind,
							category: actionData['data']['products'][0]['is_pizza'] ? 'Pizza' : 'Not Pizza'
						}]
					}
				}
			}
			this.tagMangerService.allHitsFunction(storeData);
			this.tagMangerService.pushToDataLayer(dataObject);

			// REMOVE this comment with next PR
			// let productClick = {};
			// if (action['serverProductConfig']) {
			// 	productClick = {
			// 		event: 'productClick',
			// 		ecommerce: {
			// 			click: {
			// 				actionField: {
			// 					// list: 'Menu'
			// 				},
			// 				products: [{
			// 					name: actionData['data']['products'][0]['name'],
			// 					id: `${actionData['product_id']}`,
			// 					brand: actionData['data']['products'][0]['allow-customization'] ? 'customized' : 'default',
			// 					category: actionData['data']['products'][0]['is_pizza'] ? 'Pizza' : 'Not Pizza',
			// 					position: Math.abs(actionData['data']['products'][0]['sequence'])
			// 				}]
			// 			}
			// 		}
			// 	}
			// 	this.tagMangerService.pushToDataLayer(productClick);
			// }
			// if (action['productComboServerConfig']) {
			// 	productClick = {
			// 		event: 'productClick',
			// 		ecommerce: {
			// 			click: {
			// 				actionField: {},
			// 				products: [{
			// 					name: actionData['data']['combo']['name'],
			// 					id: `${actionData['product_id']}`,
			// 					brand: 'customized',
			// 					category: 'Not Pizza',
			// 					position: 'undefined'
			// 				}]
			// 			}
			// 		}
			// 	}
			// 	this.tagMangerService.pushToDataLayer(productClick);
			// }
		})
	)

	// need to add "remove from cart"
	@Effect({ dispatch: false })
	updateDLonAddToCart = this.actions.pipe(
		filter(action => action.type === CartActionsTypes.AddConfigurableProductToCartSuccess ||
			action.type === CartActionsTypes.AddComboToCartSuccess ||
			action.type === OrderActionsTypes.AddOrderToCartSuccess ||
			action.type === CartActionsTypes.RemoveCartItemSuccess ||
			action.type === CartActionsTypes.AddPizzaAssistantProductsToCartSuccess ||
			action.type === CartActionsTypes.AddBasicProductToCartSuccess ||
			action.type === CartActionsTypes.AddProductArrayToCartSuccess),
		withLatestFrom(this.store$),
		// what to do with updated cart - pass product id?
		map(([action, storeData]) => {
			const actionData = action['serverResponse'] as ServerCartResponseInterface;
			let dataObject = {}

			switch (action.type) {

				case CartActionsTypes.AddConfigurableProductToCartSuccess:
				case CartActionsTypes.AddComboToCartSuccess:
				case CartActionsTypes.AddBasicProductToCartSuccess: {
					const addedProductId = actionData.last_item_id;
					const productData = actionData.products.find(prod => prod.cart_item_id === addedProductId);
					const addedItemCartId = actionData.last_item_id;

					// Cart could be empty for some items but have error message
					if (!productData) {
						break
					}

					let categoryData = 'Not Pizza';
					let productDescription = '';
					if (action.type === CartActionsTypes.AddConfigurableProductToCartSuccess) {
						const productSlug = actionData.products.find(prod => prod.cart_item_id === addedItemCartId).seo_title;
						const productServerData = storeData.catalog.configurableItem.entities[productSlug].data;
						categoryData = productServerData.products[0].is_pizza ? 'Pizza' : categoryData;
						productData.config_options.forEach(configOption => {
							productDescription += configOption.name + ', ';
						})
					}
					if (action.type === CartActionsTypes.AddComboToCartSuccess) {
						productData.child_items.forEach(child => {
							productDescription += child.name + ', ';
						})
					}

					dataObject = {
						event: 'addToCart',
						metric4: `${actionData.order_summary.order_components.find(item => item.code === 'subtotal') ?
							actionData.order_summary.order_components.find(item => item.code === 'subtotal').value : 0}`,
						ecommerce: {
							add: {
								products: [{
									name: productData.name,
									id: `${productData.product_id}`,
									brand: productData.kind,
									price: `${productData.price / productData.quantity}`,
									category: categoryData,
									variant: `${productData.product_option_id === 0 ? 'undefined' : productData.product_option_id}`,
									dimension6: productDescription,
									quantity: productData.quantity,
									metric3: `${productData.price}`
								}]
							}
						}
					}
					this.tagMangerService.allHitsFunction(storeData);
					this.tagMangerService.pushToDataLayer(dataObject);
					break
				}

				case OrderActionsTypes.AddOrderToCartSuccess: {
					const orderId = action['orderId'];
					const productsInOrder = [];
					const addedItemsFromHistory = storeData.checkout.orders.entities[orderId].cartItems
					addedItemsFromHistory.forEach(addedProduct => {
						const productToAdd = {
							name: addedProduct.name,
							id: 'undefined',
							brand: 'default',
							price: `${addedProduct.price / addedProduct.quantity}`,
							category: 'undefined',
							variant: 'undefined',
							dimension6: addedProduct.description,
							quantity: addedProduct.quantity,
							metric3: `${addedProduct.price}`
						}
						productsInOrder.push(productToAdd)
					})
					dataObject = {
						event: 'addToCart',
						metric4: `${actionData.order_summary.order_components.find(item => item.code === 'subtotal') ?
							actionData.order_summary.order_components.find(item => item.code === 'subtotal').value : 0}`,
						ecommerce: {
							add: {
								// TODO: return all items in cart even those which were in cart before clicking "add to cart" from history, need to fix
								products: productsInOrder
							}
						}
					}
					this.tagMangerService.allHitsFunction(storeData);
					this.tagMangerService.pushToDataLayer(dataObject);
					break
				}
				case CartActionsTypes.AddPizzaAssistantProductsToCartSuccess:
				case CartActionsTypes.AddProductArrayToCartSuccess: {
					const productsInOrder = [];
					actionData.products.forEach(addedProduct => {
						const productToAdd = {
							name: addedProduct.name,
							id: `${addedProduct.product_id}`,
							brand: addedProduct.kind,
							price: `${addedProduct.price / addedProduct.quantity}`,
							category: 'undefined',
							variant: 'undefined',
							dimension6: '',
							quantity: addedProduct.quantity,
							metric3: `${addedProduct.price}`
						}
						productsInOrder.push(productToAdd)
					})
					dataObject = {
						event: 'addToCart',
						metric4: `${actionData.order_summary.order_components.find(item => item.code === 'subtotal') ?
							actionData.order_summary.order_components.find(item => item.code === 'subtotal').value : 0}`,
						ecommerce: {
							add: {
								// TODO: return all items in cart even those which were in cart before clicking "add to cart" from history, need to fix
								products: productsInOrder
							}
						}
					}
					if (action.type === CartActionsTypes.AddProductArrayToCartSuccess) {
						dataObject['ecommerce']['add']['actionField'] = { list: 'Just For You' }
					}
					this.tagMangerService.allHitsFunction(storeData);
					this.tagMangerService.pushToDataLayer(dataObject);
					break
				}
				case CartActionsTypes.RemoveCartItemSuccess: {
					const serverCartData = action['serverCart'] as ServerCartResponseInterface;
					const removedProductId = action['removedProductId'];
					const productToRemove = serverCartData.products.find(removingProd => removingProd.cart_item_id === removedProductId);
					let removedProductDescription = '';
					if (productToRemove.kind === 'combo') {
						productToRemove.child_items.forEach(child => {
							removedProductDescription += child.name + ', '
						})
					} else {
						productToRemove.config_options.forEach(option => {
							removedProductDescription += option.name + ', '
						})
					}
					dataObject = {
						event: 'removeFromCart',
						metric4: `${actionData.order_summary.order_components.find(item => item.code === 'subtotal') ?
							actionData.order_summary.order_components.find(item => item.code === 'subtotal').value : 0}`,
						ecommerce: {
							remove: {
								products: [{
									name: productToRemove.name,
									id: `${productToRemove.product_id}`,
									brand: productToRemove.kind,
									price: `${productToRemove.price / productToRemove.quantity}`,
									category: 'undefined',
									variant: `${productToRemove.product_option_id === 0 ? 'undefined' : productToRemove.product_option_id}`,
									dimension6: removedProductDescription,
									quantity: productToRemove.quantity,
									metric3: `${productToRemove.price}`
								}]
							}
						}
					}
					if (productToRemove.price >= 0) {
						this.tagMangerService.allHitsFunction(storeData);
						this.tagMangerService.pushToDataLayer(dataObject);
					}
					break

				}

			}
		})
	)

	@Effect({ dispatch: false })
	updateDLonJustForYou = this.actions.pipe(
		filter(action => action.type === JustForYouTypes.FetchJustForYouSuccess),
		withLatestFrom(this.store$),
		map(([action, storeData]) => {
			const payload = action['payload'] as ServerJustForYouInterface;
			const promotions = payload.cards.map(card => {
				const position = payload.cards.sort(function (leftProduct, rightProduct) {
					return leftProduct.sequence - rightProduct.sequence;
				}).indexOf(card) + 1;
				return {
					id: card.id,
					name: card.label,
					creative: card.kind,
					position: `${position}`
				}
			})
			let dataObject = {};
			dataObject = {
				event: 'promoview',
				ecommerce: {
					promoView: {
						promotions
					}
				}
			}
			this.tagMangerService.allHitsFunction(storeData);
			this.tagMangerService.pushToDataLayer(dataObject);
		})
	)
	// On checkout Button click
	@Effect({ dispatch: false })
	updateLayerOnCheckOut = this.actions.pipe(
		filter(action => action.type === TagManagerActionsTypes.CheckoutDataLayer),
		withLatestFrom(this.store$),
		map(([action, storeData]) => {
			const isUserSignedIn = storeData.user.userLogin.loggedInUser ? 'signed in' : 'anonymous'
			const productsInCart = storeData.checkout.cart.entities;
			const productsInCartMapped = [];
			const dataObject = {
				event: 'checkout',
				ecommerce: {
					checkout: {
						actionField: {
							step: action['stepNumber'],
							option: 'undefined'
						},
						products: productsInCartMapped
					}
				}
			};
			const eecObject = {
				event: 'eec.checkout_option',
				ecommerce: {
					checkout_option: {
						actionField: {
							step: action['stepNumber'],
							option: 'undefined'
						}
					}
				}
			};

			// mapping products in cart
			for (const key of Object.keys(productsInCart)) {
				let description = '';
				productsInCart[key].cartConfig.forEach(config => {
					description += config.name + ', ';
				})
				const product = {
					name: productsInCart[key].name,
					id: productsInCart[key].id,
					price: `${productsInCart[key].priceText.priceValue}`,
					brand: productsInCart[key].kind,
					category: 'undefined',
					variant: 'undefined',
					dimension6: description,
					quantity: productsInCart[key].quantity
				}
				if (productsInCart[key].priceText.priceValue >= 0) {
					productsInCartMapped.push(product)
				}
			}
			// TODO turn into switch case for 3 steps
			switch (action['stepNumber']) {
				case 1:
					if (action['proceedToForm'] === '') {
						dataObject.ecommerce.checkout.actionField.option = isUserSignedIn;
						this.tagMangerService.pushToDataLayer(dataObject);
					}
					if (action['proceedToForm'] === 'review') {
						eecObject.ecommerce.checkout_option.actionField.option = isUserSignedIn;
						this.tagMangerService.allHitsFunction(storeData);
						this.tagMangerService.pushToDataLayer(eecObject);
					}
					break;
				case 2:
					if (action['proceedToForm'] === 'address') {
						// send dataObject for step 2 empty
						dataObject.ecommerce.checkout.actionField.option = 'undefined';
						this.tagMangerService.pushToDataLayer(dataObject);
					}
					if (action['proceedToForm'] === 'payment') {
						// send eec step 2
						const orderType = storeData.checkout.orderDetails.isDelivery ? 'delivery' : 'pickup'
						const timeType = storeData.checkout.orderDetails.userDeliveryAddressInput &&
							storeData.checkout.orderDetails.userDeliveryAddressInput.time ? 'future' : 'now';
						let address = '';
						let addressDash = '';
						if (orderType === 'delivery') {
							address = storeData.checkout.orderDetails.userDeliveryAddressInput &&
								storeData.checkout.orderDetails.userDeliveryAddressInput.type === 'Home' ? 'residential' : 'university';
							addressDash = '-';
						}
						eecObject.ecommerce.checkout_option.actionField.option = orderType + '-' + timeType + addressDash + address;
						this.tagMangerService.allHitsFunction(storeData);
						this.tagMangerService.pushToDataLayer(eecObject);
					}
					break;
				case 3:
					if (action['proceedToForm'] === '') {
						dataObject.ecommerce.checkout.actionField.option = 'undefined';
						this.tagMangerService.pushToDataLayer(dataObject);
					}
					break;
			}
		})
	);

	// Product List / JFY / Featured Slider List Impressions
	@Effect({ dispatch: false })
	productImpressions = this.actions.pipe(
		filter(action => action.type === CatalogProductListTypes.FetchProductListSuccess
			|| action.type === JustForYouTypes.FetchJustForYouProductListSuccess
			|| action.type === CatalogFeaturedSliderTypes.FetchFeaturedSlidesSuccess
			|| action.type === CatalogFeaturedSliderTypes.FetchFeaturedSlidesSuccess
			|| action.type === HomeActionsTypes.RenderHomePage),
		withLatestFrom(this.store$),
		map(([action, storeData]) => {
			let dataObject = {};
			if (action.type !== HomeActionsTypes.RenderHomePage) {
				let list = action.type === CatalogProductListTypes.FetchProductListSuccess ?
					storeData.catalog.categories.selectedParent.title : 'Just For You';
				list = action.type === CatalogFeaturedSliderTypes.FetchFeaturedSlidesSuccess ? 'Featured/Specials Carousel' : list;
				list = list === 'Specials' ? 'All Specials' : list;
				const payload = action['payload'] as ServerProductList;
				const impressions = payload.products.map(product => {
					const position = payload.products.sort(function (leftProduct, rightProduct) {
						return leftProduct.sequence - rightProduct.sequence;
					}).indexOf(product) + 1;
					return {
						name: product.name ? product.name : 'undefined',
						id: product.product_id ? product.product_id : 'undefined',
						brand: 'default',
						category: 'undefined',
						list,
						position: position
					}
				})
				dataObject = {
					event: 'impressionview',
					ecommerce: {
						impressions
					}
				}
				this.tagMangerService.allHitsFunction(storeData);
				this.tagMangerService.pushToDataLayer(dataObject);
			} else if (storeData.catalog.featuredProducts.isFetched && storeData.catalog.justForYou.isFetched) {
				const impressions = storeData.catalog.featuredProducts.featuredProducts.map(product => {
					const position = storeData.catalog.featuredProducts.featuredProducts.sort(function (leftProduct, rightProduct) {
						return leftProduct.sequence - rightProduct.sequence;
					}).indexOf(product) + 1;
					return {
						name: product.name ? product.name : 'undefined',
						id: product.product_id ? product.product_id : 'undefined',
						brand: product.kind,
						category: 'undefined',
						list: 'Featured/Specials Carousel',
						position: position
					}
				})
				dataObject = {
					event: 'impressionview',
					ecommerce: {
						impressions
					}
				}
				this.tagMangerService.allHitsFunction(storeData);
				this.tagMangerService.pushToDataLayer(dataObject);

				const promotions = storeData.catalog.justForYou.justForYouProducts.map((card, index) => {
					return {
						id: card.id,
						name: card.promoText,
						creative: card.template,
						position: index + 1
					}
				})
				let dataObject2 = {};
				dataObject2 = {
					event: 'promoview',
					ecommerce: {
						promoView: {
							promotions
						}
					}
				}
				// this.tagMangerService.allHitsFunction(storeData);
				this.tagMangerService.pushToDataLayer(dataObject2);
			}
		})
	);
	// REMOVE this comment with next PR
	// Product Clicks
	// @Effect({ dispatch: false })
	// productBtnClick = this.actions.pipe(
	// 	filter(action => action.type === CartActionsTypes.AddBasicProductToCart),
	// 	withLatestFrom(this.store$),
	// 	map(([action, storeData]) => {
	// 		const url = storeData.router.state.url;
	// 		const isRecommendation = action['isRecommendation'];
	// 		const selectedProductList = isRecommendation ?
	// 			storeData.common.recommendations.recommendations : storeData.catalog.productList.selectedProductList;

	// 		let selectedProduct = null;
	// 		if (action.type === ConfiguratorActionsTypes.OpenQuickAddSingleProductModal) {
	// 			selectedProduct = selectedProductList.find(product => product.seoTitle === action['productId']);
	// 		} else {
	// 			selectedProduct = selectedProductList.find(product => product.id === action['productId']);
	// 		}

	// 		let list = url.startsWith('/checkout') ? 'Checkout' : 'Category';
	// 		list = url.startsWith('/catalog/config') ? 'Product Details' : list;
	// 		list = isRecommendation ? list + ' - You may also like' : 'Menu';

	// 		const position = selectedProductList.indexOf(selectedProduct) + 1;

	// 		let dataObject = {};
	// 		dataObject = {
	// 			event: 'productClick',
	// 			ecommerce: {
	// 				click: {
	// 					actionField: {
	// 						// list
	// 					},
	// 					products: [{
	// 						name: selectedProduct.name,
	// 						id: `${selectedProduct.id}`,
	// 						brand: selectedProduct.isAddableToCartWithoutCustomization ? 'default' : 'customized',
	// 						category: 'undefined',
	// 						position: position
	// 					}]
	// 				}
	// 			}
	// 		}
	// 		this.tagMangerService.allHitsFunction(storeData);
	// 		this.tagMangerService.pushToDataLayer(dataObject);
	// 	})
	// );
	// Recommendations Impressions
	@Effect({ dispatch: false })
	recommendationsImpressions = this.actions.pipe(
		filter(action => action.type === RecommendationActionTypes.FetchRecommendationsSuccess),
		withLatestFrom(this.store$),
		map(([action, storeData]) => {
			const url = storeData.router.state.url;
			let listBase = url.startsWith('/checkout') ? 'Checkout' : 'Category';
			listBase = url.startsWith('/catalog/config') ? 'Product Details' : listBase;

			const list = 'You May Also Like - ' + listBase;
			const payload = action['response'] as ServerProductInListInterface[];
			const impressions = payload.map(product => {
				const position = payload.sort(function (leftProduct, rightProduct) {
					return leftProduct.sequence - rightProduct.sequence;
				}).indexOf(product) + 1;
				return {
					name: product.name,
					id: product.product_id,
					brand: 'default',
					category: 'undefined',
					list,
					position: position
				}
			})
			let dataObject = {};
			dataObject = {
				event: 'impressionview',
				ecommerce: {
					impressions
				}
			}
			this.tagMangerService.allHitsFunction(storeData);
			this.tagMangerService.pushToDataLayer(dataObject);
		})
	);
	// Notification Data Layer
	@Effect({ dispatch: false })
	notificationDataLayer = this.actions.pipe(
		filter(action => action.type === TagManagerActionsTypes.NotificationsDataLayer),
		withLatestFrom(this.store$),
		map(([action, storeData]) => {
			const eventAction = action['eventAction'] as DataLayerNotificationActionsEnum;
			let dataObject = {};
			let eventLabel = '';
			const impressions = [];
			switch (eventAction) {
				case DataLayerNotificationActionsEnum.UPSIZING: {
					const productConfig = storeData.catalog.configurableItem;
					const upSizeOptionId = action['upSizing'].toProductOption;
					const upSizeLabel = productConfig.viewProductSizes.find(size => size.id === upSizeOptionId).title;
					eventLabel = 'Upgrade to ' + upSizeLabel;
					impressions.push({
						name: productConfig.viewProductInfo.name,
						id: productConfig.viewProductInfo.id,
						brand: 'customized',
						category: 'undefined',
						list: 'Upsizing',
						position: 1
					});

					break;
				}
				default: {

				}
			}
			dataObject = {
				event: 'notification',
				eventCategory: 'Notifications',
				eventAction,
				eventLabel,
				eventValue: 1,
				ecommerce: {
					impressions
				}
			}
			this.tagMangerService.allHitsFunction(storeData);
			this.tagMangerService.pushToDataLayer(dataObject);
		})
	);
	@Effect({ dispatch: false })
	commonUseUpdates = this.actions.pipe(
		filter(action => action.type === TagManagerActionsTypes.CommonUseUpdateDataLayer ||
			action.type === TagManagerActionsTypes.CommonObjectUpdateData),
		withLatestFrom(this.store$),
		map(([action, storeData]) => {
			if (action.type === TagManagerActionsTypes.CommonUseUpdateDataLayer) {
				const dataObject = {
					event: action['event'],
					eventCategory: action['eventCategory'],
					eventAction: action['eventAction'],
					eventLabel: `${action['eventLabel']}`,
					eventValue: eventValueEnum.UNDEFINED
				}
				this.tagMangerService.allHitsFunction(storeData);
				this.tagMangerService.pushToDataLayer(dataObject);
			}
			if (action.type === TagManagerActionsTypes.CommonObjectUpdateData && action['data']['title']) {
				const actionData = action['data'] as RecommendationInterface
				const dataObject2 = {
					event: 'promotionClick',
					ecommerce: {
						promoClick: {
							promotions: [
								{
									id: actionData.id ? actionData.id : 'undefined',
									name: actionData.title ? actionData.title : 'undefined',
									creative: actionData.template,
									position: 'undefined'
								}
							]
						}
					}
				}
				this.tagMangerService.allHitsFunction(storeData);
				this.tagMangerService.pushToDataLayer(dataObject2);
			} else {
				// just push ready object
				if (action['eventType'] && action['eventType'] === 'customizeBtnClick') {
					action['data']['ecommerce']['click']['actionField']['list'] = storeData.catalog.categories.selectedParent ?
						storeData.catalog.categories.selectedParent.title : 'Menu';
					action['data']['ecommerce']['click']['actionField']['list'] =
						action['data']['ecommerce']['click']['actionField']['list'] === 'Specials' ? 'All Specials' :
							action['data']['ecommerce']['click']['actionField']['list']
				}
				if (action['eventType'] && action['eventType'] === 'pizzaAssistant') {
					action['data']['ecommerce']['click']['actionField']['list'] = 'Pizza Assistant';
				}
				this.tagMangerService.pushToDataLayer(action['data']);
			}

		})
	)
	@Effect({ dispatch: false })
	failedAddress = this.actions.pipe(
		filter(action => action.type === StoreActionsTypes.SearchStoreForDeliveryFailure ||
			action.type === AccountActionTypes.SearchForStoresSuccess ||
			action.type === StoreActionsTypes.SearchStoreForPickupSuccess),
		withLatestFrom(this.store$),
		map(([action, storeData]) => {
			const dataObject = {
				event: 'addressfailed',
				eventCategory: 'Address Failed',
				eventAction: 'header',
				eventLabel: action['formattedAddress'],
				eventValue: eventValueEnum.UNDEFINED
			}
			if ((action.type === AccountActionTypes.SearchForStoresSuccess ||
				action.type === StoreActionsTypes.SearchStoreForPickupSuccess) && action['payload']['stores'].length === 0) {
				dataObject.eventAction = action.type === AccountActionTypes.SearchForStoresSuccess ? 'saved pickup' : 'header';
				this.tagMangerService.allHitsFunction(storeData);
				this.tagMangerService.pushToDataLayer(dataObject);
			} else if (action.type === StoreActionsTypes.SearchStoreForDeliveryFailure) {
				this.tagMangerService.allHitsFunction(storeData);
				this.tagMangerService.pushToDataLayer(dataObject);
			}
		})
	)
	/**
	 * App initial launch
	 */
	@Effect({ dispatch: false })
	routerTransition = this.actions.pipe(
		ofType('@ngrx/router-store/navigation'),
		withLatestFrom(this.store$),
		map(([action, storeData]) => {
			const store = storeData.common.store.selectedStore ? storeData.common.store.selectedStore.store_id : 'undefined';
			const dataObject = {
				event: 'custompush',
				loginState: storeData.user.userLogin.loggedInUser ? 'logged in' : 'anonymous',
				membership: storeData.user.userClub1111.userHasClub11 ? 'Club 11-11' : 'Not a member',
				balance: `${storeData.user.userClub1111.club11Balance.available}`,
				userId: storeData.user.userLogin.loggedInUser ? storeData.user.userLogin.loggedInUser.customerId : 'undefined',
				store: `${store}`
			};
			this.tagMangerService.pushToDataLayer(dataObject);
		})
	)

	constructor(
		private actions: Actions,
		private store$: Store<State>,
		private tagMangerService: TagManagerService
	) { }
}
