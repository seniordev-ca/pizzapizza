import {
	Component,
	OnInit,
	Input
} from '@angular/core';
import {
	FormBuilder,
	FormGroup,
	Validators
} from '@angular/forms';
import {
	AsyncFormValidationService
} from '../../../../../utils/async-form-validation';

/**
 * Billing Interface
 */
export interface BillingFormInterface {
	address1: string;
	address2?: string;
	city: string;
	province: string;
	postalCode: string;
	country: string;
	phoneNumber: string;
}

@Component({
	selector: 'app-billing-info',
	templateUrl: './billing-info.component.html',
	styleUrls: ['./billing-info.component.scss'],
})

export class BillingInfoComponent implements OnInit {
	@Input() parentForm: FormGroup;

	billingInfo: FormGroup;

	constructor(private fb: FormBuilder,
		public formValidationService: AsyncFormValidationService) {
		this.billingInfo = fb.group({
			'address1': [ '', Validators.compose([Validators.required])],
			'address2': [ '', Validators.compose([Validators.required])],
			'city': [ '', Validators.compose([Validators.required])],
			'province': [ '', Validators.compose([Validators.required])],
			'postalCode': [ '', Validators.compose([Validators.required])],
			'country': [ '', Validators.compose([Validators.required])],
			'phoneNumber': [ '', Validators.compose([Validators.required])],
			})
	}

	/**
	 * Set the form group to the parent form
	*/
	ngOnInit() {
		this.parentForm.addControl('billingInfo', this.billingInfo );
	}

}
