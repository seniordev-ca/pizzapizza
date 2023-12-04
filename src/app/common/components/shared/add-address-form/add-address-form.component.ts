import {
	Component,
	Input,
	Output,
	EventEmitter,
	ViewEncapsulation,
	OnDestroy, Inject, LOCALE_ID
} from '@angular/core';
import {
	FormGroup, Validators, FormBuilder, FormControl
} from '@angular/forms';

import {
	AddressListInterface,
	AddressTypeEnum
} from '../../../models/address-list';

import {
	AsyncFormValidationService
} from '../../../../../utils/async-form-validation'
import { UniversityListInterface } from '../../../models/university-list';
import { isString } from 'util';
/**
 * Defines actions that can be taken on submitting addresses
 */
enum AddressFormActionEnum {
	onSaveAddress,
	onFetchUniversityList,
	onFetchBuildingList
}

/*
/** Interface that defines actions that can be made on address form
 */
interface AddressFormEmitterInterface {
	action: AddressFormActionEnum,
	formData?: AddressListInterface,
	universityId?: string
}

/*
/** Interface that defines address form data
 */
interface AddressFormInterface {
	addressId: number,
	isInvalid: boolean
}


@Component({
	selector: 'app-add-address-form',
	templateUrl: './add-address-form.component.html',
	styleUrls: ['./add-address-form.component.scss'],
	encapsulation: ViewEncapsulation.None
})


class AddAddressFormComponent implements OnDestroy {

	@Input() buildingList: UniversityListInterface[];
	@Input() universityList: UniversityListInterface[];

	addressForm: FormGroup;
	initialInput: string;
	@Input() set addressFormData(form: FormGroup) {
		this.addressForm = form;
		const isHome = form.get('type').value === AddressTypeEnum.Home;
		this.setValidators(isHome)
		this.onFormChanges()
		if (this.addressForm.pristine) {
			this.initialInput = this.addressForm.get('addressString').value;
		}
	}
	@Input() isCheckout = false;
	@Input() isGuestUser = false;
	@Output() addressFormEventEmitter: EventEmitter<AddressFormEmitterInterface> =
		new EventEmitter<AddressFormEmitterInterface>();

	addressTypeEnum = AddressTypeEnum;
	mask: (string | RegExp)[];
	error: string;
	addressFormSubscriptionRef;
	addressUniversitySubscriptionRef;
	manualAddressForm: FormGroup;

	constructor(
		private formValidationService: AsyncFormValidationService,
		private fb: FormBuilder,
		@Inject(LOCALE_ID) private locale: string) {
		this.mask = this.formValidationService.getPhoneNumberMask();

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
		})
	}

	/**
	 * Unsubscribe
	 */
	ngOnDestroy() {
		if (this.addressFormSubscriptionRef) {
			this.addressFormSubscriptionRef.unsubscribe();
			this.addressUniversitySubscriptionRef.unsubscribe();
			this.addressForm.markAsPristine();
		}
	}

	/**
	 * Handle data from address search
	 */
	handleAddressSearchEmitter(event) {
		this.error = event.error
		this.addressForm.patchValue({
			address: event.address,
			addressString: event.addressString
		}, { emitEvent: false })
	}

	/**
	* Click event for the save address form which wil save address data with id
	*/
	onSaveAddress(event, formData) {
		event.stopPropagation();
		event.preventDefault();

		this.addressFormEventEmitter.emit({
			action: AddressFormActionEnum.onSaveAddress,
			formData
		} as AddressFormEmitterInterface
		);
	}

	/**
	 * Selected University
	 */
	getSelectedUniversity() {
		const universityControl = this.addressForm.get('university');
		const defaultValue = this.universityList ? this.universityList[0].value : null
		return universityControl.value ? universityControl.value : defaultValue
	}

	/**
	 * Selected Building
	 */
	getSelectedBuilding() {
		const buildingControl = this.addressForm.get('building');
		const buildingDefault = this.buildingList ? this.buildingList[0] : null
		return buildingControl.value ? buildingControl.value : buildingDefault
	}

	/**
	 * Update Vaidators
	 */
	setValidators(isHome) {
		const universityControl = this.addressForm.get('university');
		const unitNumberControl = this.addressForm.get('unitNumber');
		const addressControl = this.addressForm.get('address');
		const addressStringControl = this.addressForm.get('addressString');
		const buildingControl = this.addressForm.get('building');

		if (!isHome) {
			universityControl.setValidators(Validators.required);
			unitNumberControl.setValidators(Validators.required);
			buildingControl.setValidators(Validators.required);

			addressStringControl.clearValidators();
			addressControl.clearValidators()

			if (!this.universityList) {
				this.addressFormEventEmitter.emit({
					action: AddressFormActionEnum.onFetchUniversityList,
				} as AddressFormEmitterInterface
				);
			}
			if (universityControl.value && isString(universityControl.value)) {
				this.addressFormEventEmitter.emit({
					action: AddressFormActionEnum.onFetchBuildingList,
					universityId: universityControl.value
				} as AddressFormEmitterInterface
				);
			}

		} else {
			addressControl.setValidators(Validators.required);
			addressStringControl.setValidators(Validators.required);

			universityControl.clearValidators();
			buildingControl.clearValidators();

			// unitNumberControl.patchValue('');
			unitNumberControl.clearValidators();
		}
		universityControl.updateValueAndValidity();
		buildingControl.updateValueAndValidity();
		unitNumberControl.updateValueAndValidity();

		addressControl.updateValueAndValidity();
		addressStringControl.updateValueAndValidity();
	}

	/**
	 * Subscribe to form changes so that we can dispatch university actions
	 */
	onFormChanges(): void {
		if (this.addressForm) {
			const universityControl = this.addressForm.get('university');
			const typeControl = this.addressForm.get('type');
			this.addressFormSubscriptionRef = typeControl.valueChanges.subscribe(val => {
				const isHome = val === AddressTypeEnum.Home;
				this.setValidators(isHome)
				this.addressForm.get('unitNumber').patchValue('');
				this.addressForm.get('unitNumber').markAsUntouched();

			});

			this.addressUniversitySubscriptionRef = universityControl.valueChanges.subscribe(val => {
				if (val && isString(val)) {
					this.addressFormEventEmitter.emit({
						action: AddressFormActionEnum.onFetchBuildingList,
						universityId: val
					} as AddressFormEmitterInterface
					);
				}
			})

		}
	}
}

export {
	AddAddressFormComponent,
	AddressFormInterface,
	AddressFormEmitterInterface,
	AddressFormActionEnum
}
