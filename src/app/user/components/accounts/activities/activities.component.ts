import { Component, Input, Output, EventEmitter } from '@angular/core';
import {
	UserActivitiesInterface,
	UserActivities,
	UserActivitiesEmitterInterface,
	UserActivitiesActionsEnum
} from '../../../models/user-activities';
import {
	OrderHistoryEmitterInterface
} from '../../../models/order-history';
import {
	UserCreditCardsEmitterInterface, UserCreditCardsActions
} from '../../../../common/models/user-payment-methods';
import {
	StoreListInterface,
	UserSavedPickupLocationsEmitterInterface
} from '../../../../common/models/store-list';
import {
	AddressListInterface,
	UserSavedAddressesEmitterInterface
} from '../../../../common/models/address-list';
import {
	AddressFormEmitterInterface,
} from '../../../../common/components/shared/add-address-form/add-address-form.component';

import { AddressSearchEmitterInterface } from '../../../../common/components/shared/address-search-input/address-search.component'

import { FormGroup } from '@angular/forms';
import { StoreItemServerInterface } from '../../../../common/models/server-store';
import { UniversityListInterface } from '../../../../common/models/university-list';
import { OrderSummaryInterface } from '../../../../checkout/models/order-checkout';
import { UserSummaryInterface } from '../../../models/user-personal-details';
import { UISavedCardsInterface } from '../../../models/user-saved-cards';
import {
	CheckoutPaymentMethodFormInterface, CheckoutPaymentMethodFormEmitterInterface, CheckoutPaymentMethodFormActionEnum
} from '../../../../common/components/shared/checkout-payment-method-form/checkout-payment-method-form.component';
import { BamboraValidationInterface } from '../../../../../utils/payment-methods/bambora.service';
import { ServerPaymentCardTypeEnum } from '../../../models/server-models/server-saved-cards-interfaces';


interface AccountsActivitiesInterface {
	id: number,
	mainicon: object,
	title: string,
	action: object
}

@Component({
	selector: 'app-activities',
	templateUrl: './activities.component.html',
	styleUrls: ['./activities.component.scss'],
})

export class ActivitiesComponent {

	/**
	* Outputs: Pass events between components & containers
	*/
	@Output() userPaymentMethodsEventEmitter: EventEmitter<UserCreditCardsEmitterInterface> =
		new EventEmitter<UserCreditCardsEmitterInterface>();
	@Output() savedStoresEventEmitter: EventEmitter<UserSavedPickupLocationsEmitterInterface>
		= new EventEmitter<UserSavedPickupLocationsEmitterInterface>();
	@Output() savedAddressesEventEmitter: EventEmitter<UserSavedAddressesEmitterInterface>
		= new EventEmitter<UserSavedAddressesEmitterInterface>();
	@Output() orderHistoryEventEmitter: EventEmitter<OrderHistoryEmitterInterface> =
		new EventEmitter<OrderHistoryEmitterInterface>();
	@Output() userActivitiesEventEmitter: EventEmitter<UserActivitiesEmitterInterface> =
		new EventEmitter<UserActivitiesEmitterInterface>();
	@Output() addressFormEventEmitter: EventEmitter<AddressFormEmitterInterface> =
		new EventEmitter<AddressFormEmitterInterface>();

	@Output() storeSearchEmitter: EventEmitter<AddressSearchEmitterInterface> =
		new EventEmitter<AddressSearchEmitterInterface>();

	/**
	* Inputs: Used in order to retrieve data from demo data service in common module
	*/
	@Input() userState: UserSummaryInterface;
	@Input() userActivities: UserActivitiesInterface;
	@Input() orderHistoryItems: Array<OrderSummaryInterface[]>;
	@Input() userPaymentMethodsUI: CheckoutPaymentMethodFormInterface;
	@Input() userPaymentMethods: Array<UISavedCardsInterface>;
	@Input() savedAddresses: Array<AddressListInterface>;
	@Input() savedStores: Array<StoreListInterface>;
	@Input() storeSearchResults: Array<StoreItemServerInterface>;
	@Input() addressFormData: FormGroup;
	@Input() addPaymentCardFormData: FormGroup;
	@Input() bamboraValidation: BamboraValidationInterface

	@Input() buildingList: UniversityListInterface[];
	@Input() universityList: UniversityListInterface[];
	@Input() universitiesWithMealCard: UniversityListInterface[]

	userActivitiesActionsEnum = UserActivitiesActionsEnum;
	userActivitiesEnum = UserActivities;

	constructor() {
	}

	/**
	 * Proxy the Payment Method Selection
	 */
	handleUserPaymentMethodEventEmitter(event: UserCreditCardsEmitterInterface) {
		this.userPaymentMethodsEventEmitter.emit(event);
	}

	/**
	 * Proxy the Payment UI Form
	 */
	handleCheckoutPaymentMethodFormEventEmitter(event: CheckoutPaymentMethodFormEmitterInterface) {
		const action = event.action === CheckoutPaymentMethodFormActionEnum.onCreditCardSelected ?
			UserCreditCardsActions.onSelectAddCreditCard : UserCreditCardsActions.onSelectAddStudentCard

		this.userPaymentMethodsEventEmitter.emit({
			action,
			token: event.token,
			paymentMethods: this.userPaymentMethods
		});
	}
	/**
	* Proxy to pass grandchild address form data up to container
	*/
	handleAddressFormEventEmitter(event: AddressFormEmitterInterface) {
		this.addressFormEventEmitter.emit(event);
	}

	/**
	*  Proxy to pass grandchild pickup location events to parent container
	*/
	handleStoreListEventEmitter(event: UserSavedPickupLocationsEmitterInterface) {
		this.savedStoresEventEmitter.emit(event);
	}

	/**
	*  Proxy to pass grandchild address location events to parent container
	*/
	handleSavedAddressesEventEmitter(event: UserSavedAddressesEmitterInterface) {
		this.savedAddressesEventEmitter.emit(event);
	}

	/**
	*  Proxy to pass grandchild order history events to parent container
	*/
	handleOrderHistoryEventEmitter(event: OrderHistoryEmitterInterface) {
		this.orderHistoryEventEmitter.emit(event);
	}

	/**
	* Click event for the activities see Menu button, which emits the event up to parent containers along with the activity id
	*/
	onSeeMenu(event, type) {
		event.stopPropagation();

		this.userActivitiesEventEmitter.emit({
			action: UserActivitiesActionsEnum.onSeeMenu,
			type
		} as UserActivitiesEmitterInterface
		);
	}

	/**
	* Click event for the add button, which emits the event up to parent containers along with the activity id
	*/
	onAdd(event, type, addresses, stores, orders, payments) {
		event.stopPropagation();
		let length = 0;
		switch (type) {
			case UserActivities.orderHistory: {
				length = orders ? orders.length : 0
				break;
			}
			case UserActivities.savedAddresses: {
				length = addresses ? addresses.length : 0;
				break;
			}
			case UserActivities.savedPickUpLocations: {
				length = stores ? stores.length : 0;
				break
			}
			case UserActivities.paymentMethods: {
				length = payments ? payments.filter(card => card.cardType !== ServerPaymentCardTypeEnum.MealCard).length : 0
				break
			}
			default: {
				console.warn('No Activity Matched')
			}
		}
		this.userActivitiesEventEmitter.emit({
			action: UserActivitiesActionsEnum.onAdd,
			type,
			activityLength: length
		} as UserActivitiesEmitterInterface
		);
	}

	/**
	 * Pass through store search
	 */
	handleStoreSearch(event) {
		console.log(event)
		this.storeSearchEmitter.emit(event);
	}
}

export {
	AccountsActivitiesInterface
}
