import { Injectable } from '@angular/core';
import {
	FormBuilder,
	Validators,
	FormControl,
	FormGroup
} from '@angular/forms';
import { AsyncFormValidationService } from '../../../utils/async-form-validation';
import * as fromModelsAddressList from '../models/address-list';

/**
 * Location service consumer
 */
@Injectable()
export class PPFormBuilderService {
	constructor(
		private formValidationService: AsyncFormValidationService,
		private fb: FormBuilder
	) { }
	/**
	 * The form expects a string for the address input
	 */
	buildAddresString(address: fromModelsAddressList.AddressListInterface): string {
		if (!address || !address.address) {
			return null;
		}
		if (address.address && address.address.formatted_address) {
			return address.address.formatted_address;
		}
		if (address.address && !(address.address.address && address.address.address.street_number)) {
			const addressString = address.address.addressString ? address.address.addressString : address.addressString;
			return addressString ?
				addressString :
				address.address.streetNumber + ' ' +
				address.address.streetName + ', ' +
				address.address.city + ' ' +
				address.address.province + ', ' +
				address.address.postalCode;
		}
		if (address.address.address && address.address.address.street_number) {
			return address.address.address.street_number + ' ' +
			address.address.address.street_address + ', ' +
			address.address.address.city + ' ' +
			address.address.address.province + ', ' +
			address.address.address.postal_code;
		}
	}

	/**
	 * set address object
	 */
	_setAddress(address: fromModelsAddressList.AddressListInterface) {
		let addressFromMasterPass = null
		if (address && address.address) {
			addressFromMasterPass = !address.addressId ? {
				'address': {
					'address_components': address.address.address
						? address.address.address.address_components :
						address.address.address_components,
				},
				'addressString': this.buildAddresString(address) || ''
			} : address.address
			if (address.address.streetNumber) {
				addressFromMasterPass = {
					streetNumber: address.address.streetNumber,
					streetName: address.address.streetName,
					province: address.address.province,
					postalCode: address.address.postalCode,
					city: address.address.city,
					addressString: this.buildAddresString(address) || ''
				}
			}
		}

		return addressFromMasterPass
	}
	/**
	 * Build the inital address form
	 */
	buildAddressForm(isDelivery: boolean) {
		const dateForm = {
			'date': new FormControl(null),
			'time': new FormControl(null),
			'type': new FormControl('Home'),
			'university': new FormControl(null),
			'address': new FormControl(null, Validators.required),
			'addressId': new FormControl(null),
		}
		const contactForm = {
			...dateForm,
			'contactInfo': this.fb.group({
				'phoneNumber': new FormControl('', Validators.compose([
					Validators.required,
					Validators.pattern(this.formValidationService.getPhoneNumberRegex())
				])),
				'type': new FormControl(fromModelsAddressList.PhoneTypeEnum.Home),
				'extension': new FormControl('', Validators.compose([
					Validators.maxLength(5),
					// Validators.pattern('^[0-9]+$')
				]))
			}),
			'firstName': new FormControl(null),
			'lastName': new FormControl(null),
			'email': new FormControl(null)
		}
		const addressForm = {
			...dateForm,
			...contactForm,
			'title': new FormControl('', Validators.maxLength(100)),
			'addressString': new FormControl(null, Validators.required),
			'unitNumber': new FormControl('', Validators.maxLength(50)),
			'unitBuzzer': new FormControl('', Validators.maxLength(5)),
			'entrance': new FormControl('Front Door'),
			'building': new FormControl(null),
			'buildingEntrance': new FormControl('', Validators.maxLength(30)),
			'deliveryIntructions': new FormControl('')
		}

		return !isDelivery ? this.fb.group(contactForm) : this.fb.group(addressForm)
	}

	/**
	 * updateAddressRequiredFields
	 */
	updateAddressRequiredFieldsForGuest(isUser: boolean, addressFormData: FormGroup) {
		if (!isUser) {
			addressFormData.get('firstName').setValidators(Validators.required)
			addressFormData.get('lastName').setValidators(Validators.required)
			addressFormData.get('email').setValidators(Validators.compose([
				Validators.required,
				Validators.email,
				Validators.pattern(this.formValidationService.getEmailRegex())
			]))
		} else {
			addressFormData.get('firstName').clearValidators()
			addressFormData.get('lastName').clearValidators()
			addressFormData.get('email').clearValidators()
		}
		addressFormData.get('firstName').updateValueAndValidity()
		addressFormData.get('lastName').updateValueAndValidity()
		addressFormData.get('email').updateValueAndValidity()

		return addressFormData;
	}

	/**
	 * Update address Fields For Delivery
	 */
	updateAddressRequiredFieldsForDelivery(isDelivery: boolean, addressFormData: FormGroup) {
		if (isDelivery) {
			addressFormData.get('address').setValidators(Validators.required);
			addressFormData.get('addressString').setValidators(Validators.required);
		} else {
			addressFormData.get('address').clearValidators();
			addressFormData.get('addressString').clearValidators();
			addressFormData.get('university').clearValidators();
		}
		addressFormData.get('address').updateValueAndValidity();
		addressFormData.get('addressString').updateValueAndValidity();
		addressFormData.get('university').updateValueAndValidity();

		return addressFormData;
	}
	/**
	 * Update the Form when an address is selected
	 */
	updateAddressFormData(
		address: fromModelsAddressList.AddressListInterface,
		addressFormData: FormGroup,
		isResetContact: boolean,
		isResetDate: boolean,
	) {
		if (address) {
			addressFormData.patchValue({
				'addressId': address.addressId || null,
				'title': address.title || '',
				'type': address.type || 'Home',
				'addressString': this.buildAddresString(address) || '',
				'address': this._setAddress(address),
				'unitNumber': address.unitNumber || '',
				'unitBuzzer': address.unitBuzzer || '',
				'entrance': address.entrance || 'Front Door',
				'university': address.university || null,
				'building': address.building || null,
				'buildingEntrance': address.buildingEntrance || '',
				'firstName': address.firstName || null,
				'lastName': address.lastName || null,
				'email': address.email || null,
			})
			if (isResetContact) {
				addressFormData.patchValue({
					'contactInfo': address.contactInfo ? address.contactInfo : {}
				});
			}
			if (isResetDate) {
				addressFormData.patchValue({
					'date': null,
					'time': null,
				})
			}
		}

		return addressFormData;
	}

	/**
	 * Just reset the form time
	 */
	resetTimeOnly(addressFormData: FormGroup) {
		addressFormData.patchValue({
			'date': null,
			'time': null
		})
		return addressFormData;
	}

	/**
	 * Build Payment form
	 */
	buildPaymentForm() {
		return this.fb.group({
			'nameOnCreditCard': new FormControl('',
				Validators.compose([Validators.required, Validators.minLength(2)])),
			'studentCardNumber': new FormControl(null),
			'studentCardKey': new FormControl(null),
			'paymentMethodAtDoor': new FormControl('Cash'),
			'giftCardNumber': new FormControl('',
				Validators.compose([Validators.minLength(5), Validators.maxLength(5)])),
			'giftCardPin': new FormControl('',
				Validators.compose([Validators.minLength(3), Validators.maxLength(3)])),
			'token': new FormControl(null)
		});
	}

	/**
	 * Credit Card Form Controls && Validation
	 */
	buildCreditCardForm(paymentForm: FormGroup) {
		const requiredFields = ['nameOnCreditCard'];
		const unrequiredFields = ['paymentMethodAtDoor', 'studentCardKey', 'studentCardNumber', 'token']

		let updatedform = this._updateFormFields(unrequiredFields, false, false, paymentForm);
		updatedform = this._updateFormFields(requiredFields, true, false, updatedform);
		return updatedform;
	}

	/**
	 * Pay at door Form
	 */
	buildPayAtDoorForm(paymentForm: FormGroup) {
		const requiredFields = ['paymentMethodAtDoor'];
		const unrequiredFields = ['nameOnCreditCard', 'studentCardKey', 'studentCardNumber']

		let updatedform = this._updateFormFields(unrequiredFields, false, false, paymentForm);
		updatedform = this._updateFormFields(requiredFields, true, false, updatedform);
		return updatedform;
	}

	/**
	 * Pay Via Student Card
	 */
	buildPayViaStudentCardForm(paymentForm: FormGroup) {
		const unrequiredFields = ['paymentMethodAtDoor'];
		const requiredFields = ['nameOnCreditCard', 'studentCardKey', 'studentCardNumber']

		let updatedform = this._updateFormFields(unrequiredFields, false, false, paymentForm);
		updatedform = this._updateFormFields(requiredFields, true, true, updatedform);

		return updatedform;
	}
	/**
	 * User Birthday Builder
	 */
	buildUserBirthdayObject(birthday: string) {
		const isStringValid = birthday && birthday.split('-').length === 3;
		let dateOfBirth = {
			day: null,
			month: null,
			year: null
		};
		if (isStringValid) {
			const dobArray = birthday.split('-')
			dateOfBirth = {
				day: dobArray[2],
				month: dobArray[1],
				year: Number(dobArray[0])
			}
		}
		return dateOfBirth;
	}

	/**
	 * Update form fields for required or not
	 */
	private _updateFormFields(fields: string[], required: boolean, clearInput: boolean, paymentForm: FormGroup) {
		fields.map(field => {
			const formField = paymentForm.get(field);
			formField.clearValidators();
			if (required) {
				formField.setValidators(Validators.required);
			}
			if (clearInput) {
				formField.patchValue(null);
				formField.markAsPristine()
			}
			formField.updateValueAndValidity()
		})

		return paymentForm;
	}
}
