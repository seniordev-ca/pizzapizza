import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
	AsyncFormValidationService
} from '../../../../../utils/async-form-validation';
@Component({
	selector: 'app-confirm-email',
	templateUrl: './confirm-email.component.html',
	styleUrls: ['./confirm-email.component.scss']
})

export class ConfirmEmailComponent implements OnInit {

	@Input() emailForm: FormGroup

	/**
	* Initiate rules for form validation
	*/
	constructor(
		public formValidationService: AsyncFormValidationService,
	) {
	}

	/**
	 * Component constructor
	 */
	ngOnInit() {
	};
}
