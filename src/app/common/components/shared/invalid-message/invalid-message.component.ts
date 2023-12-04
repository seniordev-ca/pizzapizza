import {
	Component, Inject,
	Input, LOCALE_ID,
	OnInit
} from '@angular/core';
import {
	FormControl
} from '@angular/forms';

/**
 * Interface for Custom Field Errors
 */
export interface CustomErrorInterface {
	errorName: string,
	errorMessage
}

/**
 * Used on every form input
 */
@Component({
	selector: 'app-form-invalid-message',
	templateUrl: './invalid-message.component.html',
	styleUrls: ['./invalid-message.component.scss']
})

export class InvalidMessageComponent implements OnInit {
	controlCheck: FormControl;
	customError;

	@Input() control: FormControl;
	@Input() invalidText = this.locale === 'en-US' ? 'Invalid' : 'Invalide';
	@Input() emptyText = this.locale === 'en-US' ? 'Missing' : 'Champs requis';
	@Input() customValidation: CustomErrorInterface[];

	constructor(@Inject(LOCALE_ID) private locale: string) {
	}

	/**
	 * We have to wait until the component is initialized before setting the input
	 */
	ngOnInit() {
		this.controlCheck = this.control;
	}

	/**
	 * Check to see if the input is valid
	*/
	isInputInvalid() {
		return( this.control.value !== '' && this.control.invalid && this.control.touched && this.control.dirty )
	}

	/**
	 * Check to see if the input is empty
	*/
	isInputEmpty() {
		return ( (this.control.value === '' || this.control.value === null) && this.control.invalid && this.control.touched );
	}

	/**
	 * Check if both empty OR invalid
	 */
	isInputInvalidOrEmpty() {
		return ( this.isInputInvalid() || this.isInputEmpty() );
	}
	/**
	 * Check if empty OR invalid OR untouched
	 */
	isInputInvalidOrEmptyOrUntouched() {
		return ( (this.isInputInvalid() || this.isInputEmpty()) || this.control.pristine);
	}

	/**
	 * Check custom validation
	 */
	isInputCustomInvalid() {
		if (this.customValidation && this.customValidation.find(error => this.control.hasError(error.errorName))) {
			// Find the custom error thrown and set the message to either the provided message or error name
			const errorThrown = this.customValidation
			.find(error => this.control.hasError(error.errorName));
			this.customError = errorThrown.errorMessage ? errorThrown.errorMessage : this.control.errors[errorThrown.errorName]
			return true;
		}
	}
}
