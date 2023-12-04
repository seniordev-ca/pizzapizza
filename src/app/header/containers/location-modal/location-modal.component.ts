import {
	Component,
	ViewEncapsulation,
	ElementRef,
	ViewChild,
	OnDestroy,
	Inject,
	AfterViewInit,
} from '@angular/core';
import {
	FormBuilder,
	FormGroup,
	FormControl,
	Validators
} from '@angular/forms';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

/**
 * ngrx
 */
import { Store, select, ActionsSubject } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

import * as fromCommon from '../../../common/reducers';
import * as fromUser from '../../../user/reducers';

import {
	SearchStoreForDelivery,
	SearchStoreForPickup,
	StoreActionsTypes,
	ClearStoreList,
	SaveUserInput,
	ClearLocationModalStates
} from '../../../common/actions/store';
import {
	StoreServerInterface,
	StoreItemServerInterface,
	ServerSimilarAddressInterface,
	StoreListError
} from '../../../common/models/server-store'
import { AddressInputInterface } from '../../../common/models/address-input';
import { AsyncFormValidationService } from 'utils/async-form-validation';
import { LOCALE_ID } from '@angular/core';

// actions
import { LocationsDataLayer } from '../../../common/actions/tag-manager'
import { DropdDownOptionInterface } from 'app/common/components/shared/styled-dropdown/styled-dropdown.component';
import { UserSummaryInterface } from 'app/user/models/user-personal-details';

@Component({
	selector: 'app-location-modal',
	templateUrl: './location-modal.component.html',
	styleUrls: ['./location-modal.component.scss'],
	encapsulation: ViewEncapsulation.None,
})

export class LocationModalComponent implements OnDestroy, AfterViewInit {
	@ViewChild('locationModalFooter', { static: false }) storeListElement: ElementRef;
	@ViewChild('autocomplete', { static: false }) autocompleteElement;

	storeList$: Observable<StoreItemServerInterface[]>;
	deliveryStore$: Observable<StoreServerInterface>;
	isFromCheckout$: Observable<boolean>;
	storeListCursor: string;
	placeHolderInput$: Observable<string>;
	loginUser$: Observable<UserSummaryInterface>;

	// Data related
	deliveryStoreSelf: StoreServerInterface;
	pickupStoreSelf: StoreServerInterface;
	storesListAvailable = false;
	selectedStore: StoreServerInterface;

	// Address related
	userAddress: AddressInputInterface;
	manualAddressForm: FormGroup;
	isLocationError = false;

	similarAddresses: ServerSimilarAddressInterface[];
	cityFilter: string;
	cityFilterForm: FormGroup;
	cityOptions: DropdDownOptionInterface[];
	selectText = 'Please Select';

	// UI related
	isActiveDelivery: boolean;
	isButtonLoading: boolean;
	isButtonDisabled = true;
	isManualAddress: boolean;

	isUserChangeStore = false;

	errorMsg: string;

	activeTabSubscriptionRef;
	storeListSubscriptionRef;
	deliveryStoreSubscriptionRef;
	selectedStoreSubscriptionRef;
	pickupCursorSubscriptionRef;
	deliveryErrorSubscriptionRef;
	pickupErrorSubscriptionRef;
	isFindMeTriggeredSubscriptionRef;

	constructor(
		public activeModal: NgbActiveModal,
		private fb: FormBuilder,
		private actions: ActionsSubject,
		private store: Store<fromCommon.State>,
		private formValidationService: AsyncFormValidationService,
		@Inject(LOCALE_ID) public locale: string
	) {
		if (this.locale === 'fr') {
			this.selectText = 'Veuillez choisir'
		}
		this.manualAddressForm = this.fb.group({
			'streetNumber': new FormControl('',
				Validators.compose([
					Validators.required,
					Validators.maxLength(11)
				])),
			'streetName': new FormControl('',
				Validators.compose([
					Validators.required,
					Validators.maxLength(45)
				])),
			'addressTwo': new FormControl(''),
			'city': new FormControl('', Validators.compose([
				Validators.required,
				Validators.maxLength(25)
			])),
			'province': new FormControl('AB', Validators.required),
			'postalCode': new FormControl('', Validators.compose([
				Validators.required,
				Validators.pattern(this.formValidationService.getPostalCodeRegex())
			])),
		});

		this.loginUser$ = this.store.pipe(select(fromUser.getLoggedInUser));

		this.cityFilterForm = this.fb.group({
			'city': new FormControl('')
		})

		this.activeTabSubscriptionRef = store.pipe(select(fromCommon.getSelectedTab)).subscribe(data => this.isActiveDelivery = data);

		this.storeList$ = store.pipe(select(fromCommon.getStoreList));
		this.storeListSubscriptionRef = this.storeList$.subscribe(data => {
			this.isButtonLoading = false;
			this.handleStoreListEmpty(data)
		});

		this.deliveryStore$ = store.pipe(select(fromCommon.getDeliveryStore));

		this.deliveryStoreSubscriptionRef = this.deliveryStore$.subscribe(data => {
			this.deliveryStoreSelf = data;
			this.isButtonLoading = false;
			this.handleSubmitButtonDisabled();
			this._resetManualForm();
		});

		this.placeHolderInput$ = store.pipe(select(fromCommon.getUserInputAddress));

		this.selectedStoreSubscriptionRef = store.pipe(select(fromCommon.getSelectedStore)).subscribe(data => {
			this.selectedStore = data;
			// if (!this.isActiveDelivery) {
			// 	this.pickupStoreSelf = data;
			// }
		});

		this.isFromCheckout$ = store.pipe(select(fromCommon.getIsLocationModalFromCheckout));

		this.pickupCursorSubscriptionRef =
			store.pipe(select(fromCommon.getPickUpStoreCursor)).subscribe(cursor => this.storeListCursor = cursor);

		this._errorSubscriptions();

		// Form should be blank on construction
		this.handleRetryBtnClick();

	}

	/**
	 * Ensure we unsubscribe
	 */
	ngOnDestroy() {
		this.store.dispatch(new ClearStoreList())

		if (this.activeTabSubscriptionRef) {
			this.activeTabSubscriptionRef.unsubscribe();
			this.storeListSubscriptionRef.unsubscribe();
			this.deliveryStoreSubscriptionRef.unsubscribe();
			this.selectedStoreSubscriptionRef.unsubscribe();
			this.pickupCursorSubscriptionRef.unsubscribe();
			this.deliveryErrorSubscriptionRef.unsubscribe();
			this.pickupErrorSubscriptionRef.unsubscribe();
			this.isFindMeTriggeredSubscriptionRef.unsubscribe();
		}
	}

	/**
	 * After View
	 */
	ngAfterViewInit() {
		this.isFindMeTriggeredSubscriptionRef = this.store.pipe(select(fromCommon.getIsLocationModalFindMe)).subscribe(data => {
			if (data) {
				this.handleChangeStore(true)
			}
		})
	}

	/**
	 * Subscribe to Delivery/Pickup Error Actions
	 */
	_errorSubscriptions() {
		this.deliveryErrorSubscriptionRef = this.actions.pipe(
			filter(action => action.type === StoreActionsTypes.SearchStoreForDeliveryFailure)
		).subscribe((action) => {
			// ONLY Activate error if user is still on delivery tab
			if (this.isActiveDelivery) {
				console.log('DELIVERY ERRROR', action['error']);
				this._setErrorState(action['error']);
			}
		});

		this.pickupErrorSubscriptionRef = this.actions.pipe(
			filter(action =>
				action.type === StoreActionsTypes.SearchStoreForPickupFailure
				|| action.type === StoreActionsTypes.SearchStoreFetchNextPageFailure
			)
		).subscribe((action) => {
			// ONLY activate error if user is still on pickup tab
			if (!this.isActiveDelivery) {
				console.log('PICKUP ERRROR')
				this._setErrorState(null);
			}
		});
	}

	/**
	 * Set Error States
	 */
	_setErrorState(error: StoreListError) {
		this.errorMsg = null;
		this.isButtonLoading = false;
		this.isLocationError = true;
		this.pickupStoreSelf = null;
		this.deliveryStoreSelf = null;
		this.isManualAddress = false;
		this.userAddress = null;
		if (error && error.errors && error.errors.location_not_deliverable) {
			this.errorMsg = error.errors.location_not_deliverable
		}
		if (error && error.errors && error.errors.similar_address) {
			this.similarAddresses = error.errors.similar_address;
			const labels = Array.from(new Set(this.similarAddresses.map(address => address.city)));
			this.cityOptions = labels.map(label => {
				return {
					label,
					value: label,
				}
			})
			this.cityOptions.unshift({
				label: this.selectText,
				value: null,
			})
		} else {
			this.similarAddresses = null;
		}
	}

	/**
	 * Regenerate the location search form
	 */
	handleRetryBtnClick() {
		this.store.dispatch(new ClearStoreList())
		this.isLocationError = false;
		this.handleSubmitButtonDisabled();
	}
	/**
	 * Check if store list is empty
	 */
	handleStoreListEmpty(data) {
		this.storesListAvailable = data instanceof Array
	}
	/**
	 * Handle scrolling of store list
	 */
	handleStoreListScroll(element) {
		// Removed Pagination as per JIRA TICKET PPV2-2030
		// if (this.storesListAvailable && this.storeListCursor) {
		// 	if (element.srcElement.offsetHeight + element.srcElement.scrollTop === element.srcElement.scrollHeight) {
		// 		this.store.dispatch(new SearchStoreFetchNextPage(this.userAddress, this.storeListCursor));
		// 	}
		// }
	}

	/**
	 * Handle autocomplete search
	 */
	handleAddressSearchEmitter(event) {
		this.userAddress = event.address;
		this.isButtonLoading = event.loading;
		const error = event.error;

		// if there is an error
		if (error) {
			this._setErrorState(null)
			return false;
		}

		// if the address is null we need to clear the selection and disable the form
		if (!event.address) {
			this.deliveryStoreSelf = null;
			this.pickupStoreSelf = null;
			this.store.dispatch(new ClearStoreList())
			return false;
		}

		// if the above to checks pass we need to dispatch the search
		if (!this.isActiveDelivery && this.userAddress) {
			this.storeListElement.nativeElement.scrollTop = 0;
			this.isButtonLoading = true;
			this.store.dispatch(new SearchStoreForPickup(this.userAddress));
		} else if (this.isActiveDelivery && this.userAddress) {
			this.isButtonLoading = true;
			this.store.dispatch(new SearchStoreForDelivery(this.userAddress));
		}
	}

	/**
	 * Handle when user clicks Manual Address
	 */
	handleManualToggleEmitter(event) {
		this.isManualAddress = event;
	}

	/**
	 * Submit Similar Address
	 */
	submitSimilarAddress(address) {
		this.manualAddressForm.patchValue({
			city: address.city,
			province: address.province,
			streetName: address.street_name,
			streetNumber: address.street_number,
			postalCode: address.postal_code
		})
		this.manualFormSubmission(this.manualAddressForm.value)
	}
	/**
	 * Manual Form Submission
	 */
	manualFormSubmission(formData) {
		this.userAddress = {
			address: {
				city: formData.city,
				province: formData.province,
				street_address: formData.streetName,
				street_number: formData.streetNumber,
				postal_code: formData.postalCode
			},
			// city: formData.city,
			// province: formData.province,
			// streetName: formData.streetName,
			// streetNumber: formData.streetNumber,
			// postalCode: formData.postalCode
		} as AddressInputInterface
		this.store.dispatch(new SearchStoreForDelivery(this.userAddress));
	}

	/**
	 * Reset Form and close the modal only when the manual form is open
	 */
	_resetManualForm() {
		this.manualAddressForm.patchValue({
			'streentNumber': '',
			'streetName': '',
			'addressTwo': '',
			'city': '',
			'province': 'AB',
			'postalCode': ''
		});
		if (this.isManualAddress || this.similarAddresses) {
			this.closeModal()
		}
	}

	/**
	 * storeListEventEmitterHandler
	 */
	storeListEventEmitterHandler(e) {
		this.store.dispatch(new LocationsDataLayer('selectpickup', 'Pickup stores selected', `${e.store.store_id}`))
		this.pickupStoreSelf = e.store;
		this.handleSubmitButtonDisabled();
	}

	/**
	 * Close Modal Method
	*/
	closeModal(forceClose?: boolean) {
		this.store.dispatch(new ClearLocationModalStates())

		if (!forceClose) {
			// this.store.dispatch(new IsDeliveryTabActive(this.isActiveDelivery));
			if (this.isActiveDelivery) {
				this.selectedStore = this.deliveryStoreSelf;
			} else {
				this.selectedStore = this.pickupStoreSelf;
			}
			if (this.selectedStore) {
				this.store.dispatch(new SaveUserInput({ address: this.userAddress }, this.isActiveDelivery, false, false, this.selectedStore));
			}

			this.isManualAddress = false;
			this.similarAddresses = null;
		}

		this.activeModal.close();
	}
	/**
	* Demo handler
	*/
	onPickUpClick() {
		this.store.dispatch(new LocationsDataLayer('locationtab', 'Tab Clicks', 'Pickup'))
		if (this.isActiveDelivery) {
			this.isManualAddress = false;
			this.isActiveDelivery = false;
			this.isLocationError = false;
			// If a user has previously searched for delivery, closed the modal then opened it again
			// we would have the delivery lat/lng so if they click Pick Up we should do a search based on that info
			this.userAddress = !this.userAddress && (this.deliveryStoreSelf && this.deliveryStoreSelf.lat > 0 && this.deliveryStoreSelf.lng > 0) ? {
				latitude: this.deliveryStoreSelf.lat,
				longitude: this.deliveryStoreSelf.lng
			} : this.userAddress;
			if (!this.pickupStoreSelf && this.userAddress) {
				this.store.dispatch(new SearchStoreForPickup(this.userAddress));
			}
		}
		this.handleSubmitButtonDisabled();
	}
	/**
	* Demo handler
	*/
	onDeliveryClick() {
		this.store.dispatch(new LocationsDataLayer('locationtab', 'Tab Clicks', 'Delivery'))
		if (!this.isActiveDelivery) {
			this.isActiveDelivery = true;
			this.isLocationError = false;
			if (!this.deliveryStoreSelf && this.userAddress) {
				// console.log(this.userAddress)
				this.store.dispatch(new SearchStoreForDelivery(this.userAddress));
			}
		}
		this.handleSubmitButtonDisabled();
	}

	/**
	 * Checks to see if the button is disabled or not depending on if there is data
	 */
	handleSubmitButtonDisabled() {
		let disabled = true;
		if (this.isActiveDelivery && this.deliveryStoreSelf) {
			disabled = false;
		} else if (!this.isActiveDelivery && this.pickupStoreSelf) {
			disabled = false;
		}
		this.isButtonDisabled = disabled;
	}

	/**
	 * Handles change store select
	 */
	handleChangeStore(isFindMe) {
		this.isUserChangeStore = true;
		if (isFindMe) {
			this.autocompleteElement.getLocation()
		}
	}

}
