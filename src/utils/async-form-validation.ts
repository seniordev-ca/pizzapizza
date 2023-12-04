import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { LOCALE_ID } from '@angular/core';
import { ApplicationHttpClient } from './app-http-client';

import {
	ServerUserRegistrationEmailCheck,
	ServerUserRegistrationEmailCheckResult
} from '../app/user/models/server-models/server-user-registration-input'
import { AbstractControl } from '@angular/forms';

/**
 * AsyncFormValidationService - Place any async form validation we need here
 */
@Injectable()
export class AsyncFormValidationService {
	tooShortText = 'Too Short';
	strongText = 'Strong';
	weakText = 'Weak';
	yearText = 'Year';
	monthText = 'Month';
	dayText = 'Day';

	constructor(
		private appHttp: ApplicationHttpClient,
		@Inject(LOCALE_ID) public locale: string
	) {
		if (this.locale === 'fr') {
			this.tooShortText = 'Trop court';
			this.strongText = 'Fort';
			this.weakText = 'Faible';
			this.yearText = 'Année';
			this.monthText = 'Mois';
			this.dayText = 'journée';
		}
	}

	/**
	 * Used for form UI validation
	 */
	public isInputInvalid(control) {
		return (control.value !== '' && control.invalid && control.touched && control.dirty)
	}

	/**
	* Used for form UI validation
	*/
	public isInputEmpty(control) {
		return ((control.value === '' || control.value === null) && control.invalid && control.touched);
	}

	/**
	 * Used for form UI validation
	 */
	public isInputInvalidOrEmpty(control) {
		return (this.isInputInvalid(control) || this.isInputEmpty(control));
	}

	/**
	 * Used for form UI validation
	 */
	public isInputInvalidOrEmptyOrUntouched(control) {
		return ((this.isInputInvalid(control) || this.isInputEmpty(control)) || control.pristine);
	}

	/**
 	* Checks if email exists by posting the string which we get from the payload value
	*/
	checkIfUserEmailExists(payload: ServerUserRegistrationEmailCheck): Observable<ServerUserRegistrationEmailCheckResult> {
		const param = payload;
		const apiPath = 'user/api/v1/email_exists';
		return this.appHttp.post<ServerUserRegistrationEmailCheckResult>(apiPath, param);
		// return this.appHttp.post<ServerUserRegistrationEmailCheck>(apiPath, param);
	}
	/**
	 * Determine Strength of Password
	 */
	validatePasswordStrength(control: AbstractControl) {
		const length = control && control.value ? control.value.length : 0;
		let strength = length > 0 ? this.tooShortText : '';
		if (length > 6 && length < 26) {
			strength = length < 26 && length > 12 ? this.strongText : this.weakText;
		}
		strength = length > 25 ? '' : strength;
		return strength;
	}
	/**
	* Sets the year range available in the date picker
	*/
	getYearRange(maxDate) {
		const CURRENT_YEAR = new Date().getFullYear();
		const START_YEAR = CURRENT_YEAR - maxDate;
		const YEARS = [];
		for (let i = START_YEAR; i <= CURRENT_YEAR; i++) {
			YEARS.push(i);
		}
		YEARS.push({ value: null, label: this.yearText })
		YEARS.reverse();

		return YEARS;
	}
	/**
	 *  Get Months
	 */
	getMonths() {
		const MONTHS = []
		MONTHS.push({ value: null, label: this.monthText })
		for (let i = 1; i <= 12; i++) {
			MONTHS.push(('0' + i).slice(-2));
		}
		return MONTHS;
	}
	/**
	 * Sets the days based on the month/year provided
	 */
	getDaysInMonth(year, month) {
		const DAYS = [];
		DAYS.push({ value: null, label: this.dayText })
		for (let i = 1; i <= new Date(year, month, 0).getDate(); i++) {
			DAYS.push(('0' + i).slice(-2));
		}

		return DAYS;
	}
	/**
	 * Sets max days
	 */
	getMaxDaysInMonth() {
		const DAYS = [];
		DAYS.push({ value: null, label: this.dayText })
		for (let i = 1; i <= 31; i++) {
			DAYS.push(('0' + i).slice(-2));
		}

		return DAYS;
	}

	/**
	 * Keeping the phonenumber mask in one location so we can edit it easily
	 */
	getPhoneNumberMask() {
		return ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]
	}

	/**
	 * Keeping the postal code mask in one location
	 */
	getPostalCodeMask() {
		return [/[A-Z]/i, /\d/, /[A-Z]/i, ' ', /\d/, /[A-Z]/i, /\d/]
	}

	/**
	 * Max Length of name fields
	 */
	getNameFieldMaxlength() {
		return 25;
	}

	/**
	 * Email Regex
	 */
	getEmailRegex() {
		return '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$';
	}

	/**
	 * Phone Number Regex
	 */
	getPhoneNumberRegex() {
		return '^(\\+?[01])?[-.\\s]?\\(?[1-9]\\d{2}\\)?[-.\\s]?\\d{3}[-.\\s]?\\d{4}'
	}

	/**
	 * Postal Code
	 */
	getPostalCodeRegex() {
		return new RegExp(/[A-Za-z][1-9][A-Za-z]\s[1-9][A-Za-z][1-9]/g)
	}

	/**
	 * Simple Validator for only positive numbers
	 */
	positiveNumberOnly(control): { [key: string]: boolean; } {
		if (Number(control.value) > 0 || !control.value) {
			return null
		} else {
			return { negativeNumber: true };
		}
	}
}
