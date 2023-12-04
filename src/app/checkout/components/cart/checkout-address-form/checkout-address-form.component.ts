import {
	Component,
	Input,
	EventEmitter,
	Output,
	ViewEncapsulation,
	ViewChild,
	OnInit,
	OnDestroy, Inject, LOCALE_ID,
} from '@angular/core';
import {
	FormGroup
} from '@angular/forms';
import {
	StoreListInterface,
	UserSavedPickupLocationsEmitterInterface
} from '../../../../common/models/store-list';
import { SignInInterface } from '../../../../user/components/sign-in/sign-in-form/sign-in-form.component';
import {
	AddressListInterface,
	UserSavedAddressesEmitterInterface,
	UserSavedAddressesActionsEnum
} from '../../../../common/models/address-list';
import { AddressSearchEmitterInterface } from '../../../../common/components/shared/address-search-input/address-search.component';
import { AsyncFormValidationService } from '../../../../../utils/async-form-validation';
import { StoreItemServerInterface } from '../../../../common/models/server-store';
import { UICheckoutTimeInterface } from '../../../models/order-checkout';
import { TimeFormattingService } from '../../../services/global-time-formatting';
import { UniversityListInterface } from '../../../../common/models/university-list';
import {
	AddressFormEmitterInterface,
	AddressFormActionEnum
} from '../../../../common/components/shared/add-address-form/add-address-form.component';
import { ConfirmationModalComponent } from 'app/common/components/modals/confirmation-modal/confirmation-modal.component';
import { distinctUntilChanged } from 'rxjs/operators';
import { DropdDownOptionInterface } from '../../../../common/components/shared/styled-dropdown/styled-dropdown.component';
import { StoreService } from '../../../../common/services/store.service';
/**
 * Defines actions that can be taken on checkout address component
 */
enum CheckoutAddressFormActionsEnum {
	onDeliverySelected,
	onPickUpSelected,
	onForTodaySelected,
	onForFutureSelected,
	onPickUpLocationSearch,
	onAddLocation,
	onCancelAddLocation,
	onAddressSubmit,
	onAddressSelect,
	onAddressEdit,
	onAddressDelete,
	onFetchUniversityList,
	onFetchBuildingList
}

/*
/** Checkout Address Emitter Interface to emit actions
 */
interface CheckoutAddressFormEmitterInterface {
	action: CheckoutAddressFormActionsEnum,
	userId?: number,
	universityId?: string
}

/*
/** Address Form Interface - this interface includes data flow for the form states
 */
interface CheckoutAddressFormInterface {
	isDelivery: boolean,
	isPickup: boolean,
	isToday: boolean,
	isResidential: boolean,
	isContactLessSelected: boolean
}

@Component({
	selector: 'app-checkout-address-form',
	templateUrl: './checkout-address-form.component.html',
	styleUrls: ['./checkout-address-form.component.scss'],
	encapsulation: ViewEncapsulation.None
})

class CheckoutAddressFormComponent implements OnInit, OnDestroy {
	@ViewChild('cancelModal', { static: true }) cancelModal: ConfirmationModalComponent;
	@Input() checkoutAddressForm: FormGroup;
	@Input() checkoutAddressUI: CheckoutAddressFormInterface;
	contactLess?: boolean;
	@Input() savedAddresses: Array<AddressListInterface>;

	@Input() userState: SignInInterface;
	@Output() checkoutAddressFormEventEmitter: EventEmitter<CheckoutAddressFormEmitterInterface>
		= new EventEmitter<CheckoutAddressFormEmitterInterface>();

	@Input() savedStores: Array<StoreListInterface>;
	@Input() storeSearchResults: Array<StoreItemServerInterface>;

	@Output() savedStoresEventEmitter: EventEmitter<UserSavedPickupLocationsEmitterInterface>
		= new EventEmitter<UserSavedPickupLocationsEmitterInterface>();
	@Output() storeSearchEmitter: EventEmitter<AddressSearchEmitterInterface>
		= new EventEmitter<AddressSearchEmitterInterface>();

	@Input() selectedAddressIDForCheckout: number;
	@Input() selectedStoreIdForCheckout: number;

	@Input() buildingList: UniversityListInterface[];
	@Input() universityList: UniversityListInterface[];

	dayOptions: {
		label: string,
		value: string
	}[] = [{
		label: '',
		value: '',
	}];
	selectedDate: string;
	selectedTime: string;
	timeOptions: DropdDownOptionInterface[];
	storeHours: UICheckoutTimeInterface[];
	isCancelCLicked: boolean;
	@Input() set selectedStoreHours(hours: UICheckoutTimeInterface[]) {
		this.storeHours = hours;
		if (hours) {
			this.dayOptions = hours.map(hour => {
				return {
					label: hour.label,
					value: hour.date,
				}
			});
		}
	};

	@Input() isNextBtnLoading: boolean;

	checkoutAddressDeliveryResidentialForm: FormGroup;
	checkoutAddressDeliveryUniversityForm: FormGroup;
	checkoutAddressPickUpForm: FormGroup;
	mask: (string | RegExp)[];
	dayArray: string[];

	dateControlSubscriptionRef;
	globalContactLessDelivery: boolean;
	globalContactLessPickup: boolean;

	/**
	* Constructor to instantiate for this component
	*/
	constructor(
		private formValidationService: AsyncFormValidationService, private confirmModal: ConfirmationModalComponent,
		@Inject(LOCALE_ID) private locale,
		private storeService: StoreService
	) {
		this.mask = this.formValidationService.getPhoneNumberMask();
	}

	/**
	 * On Init
	 */
	ngOnInit() {
		this.selectedDate = this.checkoutAddressForm.controls.date.value;
		this.selectedTime = this.checkoutAddressForm.controls.time.value;
		this._handleTimeOptions();
		this.subscribeToDateChange();
		this.globalContactLessDelivery = this.storeService.getGlobalContactLessDeliveryFromLocalStorage('GlobalContactLessDelivery');
		this.globalContactLessPickup = this.storeService.getGlobalContactLessPickUpFromLocalStorage('GlobalContactLessPickup');
	}

	/**
	 * On Destroy
	 */
	ngOnDestroy() {
		if (this.dateControlSubscriptionRef) {
			this.dateControlSubscriptionRef.unsubscribe();
		}
	}

	/**
	 * Subscribe to date change
	 */
	subscribeToDateChange() {
		if (this.checkoutAddressForm) {
			this.dateControlSubscriptionRef = this.checkoutAddressForm.get('date').valueChanges.pipe(
				distinctUntilChanged((a, b) => a === b)
			).subscribe(date => {
				this._handleSelectedDate();
				this._handleTimeOptions();
			})
		}
	}

	/**
	 * handles the selected date based on the returned store hours
	 */
	_handleSelectedDate() {
		this.selectedDate = this.checkoutAddressForm.controls.date.value ?
			this.checkoutAddressForm.controls.date.value : this.storeHours[0].date;
		this.checkoutAddressForm.controls.date.setValue(this.selectedDate);

		// If not today's date selected than select the first available time for that date
		const isTodaySelected = this.storeHours[0].date === this.selectedDate;
		if (!isTodaySelected) {
			const selectedDate = this.storeHours
				.find(storeHour => storeHour.date === this.selectedDate)
			this.checkoutAddressForm.controls.time.setValue(TimeFormattingService.convertTo12Hour(selectedDate.times[0]));
			this.selectedTime = this.checkoutAddressForm.controls.time.value;

		}
		return this.selectedDate;
	}

	/**
	 * Determine the time options based on selectd day
	 */
	_handleTimeOptions() {
		const selectedDate: UICheckoutTimeInterface = this.storeHours.find(
			hour => hour.date === this.selectedDate
		)
		if (selectedDate) {
			this.timeOptions = selectedDate.times.map(time => {
				const timeStr = this.locale === 'en-US' ?
					TimeFormattingService.convertTo12Hour(time) : TimeFormattingService.convertTo24HourFr(time);
				const dropdownItem = {
					label: timeStr,
					value: timeStr,
				} as DropdDownOptionInterface
				return dropdownItem;
			});
		}
		return this.timeOptions;
	}

	/**
	* Proxy to pass grandchild pickup location events to parent container
	*/
	handleStoreListEventEmitter(event: UserSavedPickupLocationsEmitterInterface) {
		this.savedStoresEventEmitter.emit(event);
	}
	/**
	 *  Store Search Passthrough
	 */
	handleStoreSearch(event) {
		this.storeSearchEmitter.emit(event);
	}
	/**
	* Proxy to pass grandchild address location events to parent container
	*/
	handleSavedAddressesEventEmitter(event: UserSavedAddressesEmitterInterface) {
		switch (event.action) {
			case UserSavedAddressesActionsEnum.onEdit: {
				console.log('edit')
				this.checkoutAddressFormEventEmitter.emit({
					action: CheckoutAddressFormActionsEnum.onAddressEdit,
					userId: event.addressId
				} as CheckoutAddressFormEmitterInterface);
				break
			}
			case UserSavedAddressesActionsEnum.onSetDefault: {
				this.checkoutAddressFormEventEmitter.emit({
					action: CheckoutAddressFormActionsEnum.onAddressSelect,
					userId: event.addressId
				} as CheckoutAddressFormEmitterInterface);
				break
			}
			case UserSavedAddressesActionsEnum.onDelete: {
				this.checkoutAddressFormEventEmitter.emit({
					action: CheckoutAddressFormActionsEnum.onAddressDelete,
					userId: event.addressId
				} as CheckoutAddressFormEmitterInterface);
				break
			}
			default: {
				console.log('action not defined', event.action)
			}
		}
	}

	/**
	 * Handle Address Form
	 */
	handleAddressFormEmitter(event: AddressFormEmitterInterface) {
		switch (event.action) {
			case AddressFormActionEnum.onFetchUniversityList: {
				this.checkoutAddressFormEventEmitter.emit({
					action: CheckoutAddressFormActionsEnum.onFetchUniversityList,
				})
				break
			}
			case AddressFormActionEnum.onFetchBuildingList: {
				this.checkoutAddressFormEventEmitter.emit({
					action: CheckoutAddressFormActionsEnum.onFetchBuildingList,
					universityId: event.universityId
				})
			}
		}
	}
	/**
	* Method to select Delivery Form
	*/
	onDeliverySelected(event) {
		event.preventDefault();
		event.stopPropagation();

		this.checkoutAddressFormEventEmitter.emit({
			action: CheckoutAddressFormActionsEnum.onDeliverySelected,
			userId: this.selectedAddressIDForCheckout
		} as CheckoutAddressFormEmitterInterface);
	}

	/**
	* Method to select Pickup Form
	*/
	onPickUpSelected(event) {
		event.preventDefault();
		event.stopPropagation();

		this.checkoutAddressFormEventEmitter.emit({
			action: CheckoutAddressFormActionsEnum.onPickUpSelected
		} as CheckoutAddressFormEmitterInterface);
	}

	/**
	* Method to display date time form row on select For Today radio option
	*/
	onForTodaySelected(event) {
		const action = {
			action: CheckoutAddressFormActionsEnum.onForTodaySelected
		} as CheckoutAddressFormEmitterInterface

		this.checkoutAddressFormEventEmitter.emit(action);
	}

	/**
	* Method to display date time form row on select For Future radio option
	*/
	onForFutureSelected(event) {

		this.checkoutAddressFormEventEmitter.emit({
			action: CheckoutAddressFormActionsEnum.onForFutureSelected
		} as CheckoutAddressFormEmitterInterface);
	}


	/**
	* Method to display store list when search icon clciked - emits up to container
	*/
	onPickUpLocationSearch(event) {
		this.checkoutAddressFormEventEmitter.emit({
			action: CheckoutAddressFormActionsEnum.onPickUpLocationSearch
		} as CheckoutAddressFormEmitterInterface);
	}

	/**
	* Method to pass up that location has been added
	*/
	onAddLocation(event) {

		this.checkoutAddressFormEventEmitter.emit({
			action: CheckoutAddressFormActionsEnum.onAddLocation
		} as CheckoutAddressFormEmitterInterface);
	}

	/**
	* Triggers message about losing data to show
	*/
	onCancelAddLocation(event) {
		event.preventDefault();
		event.stopPropagation();
		if (this.checkoutAddressForm.untouched) {
			this.checkoutAddressFormEventEmitter.emit({
				action: CheckoutAddressFormActionsEnum.onCancelAddLocation,
				userId: this.selectedAddressIDForCheckout
			} as CheckoutAddressFormEmitterInterface);
			return false
		};
		this.isCancelCLicked = true;
		this.confirmModal.onOpen(this.cancelModal)
	}

	/**
	* If user clicks OK and loses unsaved address
	*/
	onNotSaveAddress() {
		this.isCancelCLicked = false;
		this.checkoutAddressFormEventEmitter.emit({
			action: CheckoutAddressFormActionsEnum.onCancelAddLocation,
			userId: this.selectedAddressIDForCheckout
		} as CheckoutAddressFormEmitterInterface);
	}

	/**
	* If user clicks Cancel and continue editing new address
	*/
	onCancelLoseUnsaved() {
		this.isCancelCLicked = false;
	}

	/**
	* Method to submit address
	*/
	onCheckoutAddressFormSubmit() {
		if (!this.isFormValid()) {
			const controls = this.checkoutAddressForm.controls;
			const phoneGroup = this.checkoutAddressForm.get('contactInfo') as FormGroup;
			const phoneControls = phoneGroup.controls;

			Object.keys(controls).forEach(controlName => controls[controlName].markAsTouched());
			Object.keys(phoneControls).forEach(controlName => phoneControls[controlName].markAsTouched());

			return false
		}
		// if timeOptions exists thats how we know option "For future" was chosen
		if (this.timeOptions) {
			const selectedTime = this.checkoutAddressForm.controls.time.value ? this.checkoutAddressForm.controls.time.value : this.timeOptions[0];
			this.checkoutAddressForm.controls.time.setValue(selectedTime);
		}

		this.checkoutAddressFormEventEmitter.emit({
			action: CheckoutAddressFormActionsEnum.onAddressSubmit
		} as CheckoutAddressFormEmitterInterface
		);
	}

	/**
	 * Checkout if 'Next' Button is valid
	 */
	isFormValid() {
		const isFormComplete = this.checkoutAddressForm.valid;

		const isDeliveryValid = this.checkoutAddressUI.isDelivery &&
			(this.selectedAddressIDForCheckout || (this.checkoutAddressForm.valid && isFormComplete));
		const isPickUpValid = !this.checkoutAddressUI.isDelivery
			&& this.selectedStoreIdForCheckout
			&& (this.savedStores && this.savedStores.length > 0)
			&& this.checkoutAddressForm.valid;
		return isDeliveryValid || isPickUpValid
	}
}

export {
	CheckoutAddressFormComponent,
	CheckoutAddressFormActionsEnum,
	CheckoutAddressFormEmitterInterface,
	CheckoutAddressFormInterface,
}
