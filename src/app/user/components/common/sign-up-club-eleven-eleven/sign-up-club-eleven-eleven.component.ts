import {
	Component,
	Input,
	Output,
	EventEmitter,
	ViewEncapsulation,
	OnInit
} from '@angular/core';

import {
	FormGroup,
} from '@angular/forms';
import {
	AsyncFormValidationService
} from '../../../../../utils/async-form-validation';
import { DateOfBirthInterface } from '../../sign-up/sign-up-form/sign-up-form.component'
import { UserProfileInterface } from '../../../models/user-personal-details';
import { GoogleAddressComponent } from '../../../../common/models/address-list';
// Reduce, actions
import * as fromUser from '../../../reducers';

// services
import { RegistrationDataLayer } from '../../../../common/actions/tag-manager';
import { DataLayerRegistrationEventEnum } from '../../../../common/models/datalayer-object';
// NGRX
import { Store } from '@ngrx/store';
/**
 * Club 11-11 Sign Up Actions
 */
enum SignUpClubElevenElevenActionsEnum {
	onShowPassword,
	onFormSubmit,
	onNeedCardSelect,
	onHaveCardSelect,
	onSendClubPromotions,
	onNotSendClubPromotions,
	onCreateAccountClick
}

/*
/** Sign Up Emitter
 */
interface SignUpClubElevenElevenEmitterInterface {
	action: SignUpClubElevenElevenActionsEnum;
	formData?: SignUpClubElevenElevenInterface
}

/*
/** Club 11-11 Sign Up Interface
 */
interface SignUpClubElevenElevenInterface {
	streetAddress?: GoogleAddressComponent[],
	apartmentNumber?: string,
	cardNumber?: string,
	cardPin?: string,
	dateOfBirth?: DateOfBirthInterface,
	language?: string,
	sendClubPromotions?: string,
	token?: string,
	addressString?: string
}
interface SignUpClubElevenElevenUIInterface {
	isHaveCardSelected?: boolean,
	isCardAlreadyRegistered?: boolean,
	isEditCard?: boolean,
	isAddressRequired: boolean
}

@Component({
	selector: 'app-sign-up-club-eleven-eleven',
	templateUrl: './sign-up-club-eleven-eleven.component.html',
	styleUrls: ['./sign-up-club-eleven-eleven.component.scss'],
	encapsulation: ViewEncapsulation.None
})
class SignUpClubElevenElevenComponent implements OnInit {
	clubElevenElevenUI: SignUpClubElevenElevenUIInterface;
	@Input() set signUpClugElevenElevenUI(data: SignUpClubElevenElevenUIInterface) {
		this.clubElevenElevenUI = data;
	}
	@Input() signUpClubElevenElevenForm: FormGroup;
	@Input() loggedInUser: UserProfileInterface;

	@Output() signUpClubElevenElevenEventEmitter: EventEmitter<SignUpClubElevenElevenEmitterInterface> =
		new EventEmitter<SignUpClubElevenElevenEmitterInterface>();

	yearOptions = null;
	monthOptions = null;
	dayOptions = null;

	constructor(
		public formValidationService: AsyncFormValidationService,
		private userStore: Store<fromUser.UserState>
	) { }

	/**
	 * Sets initial value for DOB and handles logic for update days count depending on month and year
	 */
	ngOnInit() {
		this.yearOptions = this.formValidationService.getYearRange(100);
		this.monthOptions = this.formValidationService.getMonths();
		this.dayOptions = this.formValidationService.getMaxDaysInMonth();
	}

	/**
	* onFormSubmit
	*/
	onFormSubmit(event) {
		event.preventDefault();
		const action = {
			action: SignUpClubElevenElevenActionsEnum.onFormSubmit,
			formData: this.signUpClubElevenElevenForm.value
		} as SignUpClubElevenElevenEmitterInterface;

		const formDataSteptwo = this.signUpClubElevenElevenForm.value;
		this.signUpClubElevenElevenEventEmitter.emit(action);
	}

	/**
	* onNeedCardSelect
	*/
	onNeedCardSelect(event) {
		const action = {
			action: SignUpClubElevenElevenActionsEnum.onNeedCardSelect
		} as SignUpClubElevenElevenEmitterInterface;
		this.signUpClubElevenElevenEventEmitter.emit(action);
	}

	/**
	* onNeedCardSelect
	*/
	onHaveCardSelect(event) {

		const action = {
			action: SignUpClubElevenElevenActionsEnum.onHaveCardSelect
		} as SignUpClubElevenElevenEmitterInterface;

		this.signUpClubElevenElevenEventEmitter.emit(action);
	}

	/**
	* onSendClubPromotions
	*/
	onCreateAccountClick(event) {

		const action = {
			action: SignUpClubElevenElevenActionsEnum.onCreateAccountClick
		} as SignUpClubElevenElevenEmitterInterface;

		this.signUpClubElevenElevenEventEmitter.emit(action);
	}

	/**
	 * Address Input
	 */
	handleAddressSearchEmitter(event) {
		this.signUpClubElevenElevenForm.patchValue({
			'streetAddress': event.address ? event.address.address_components : null,
			'addressString': event.address ? event.addressString : ''
		})
	}


}

export {
	SignUpClubElevenElevenComponent,
	SignUpClubElevenElevenInterface,
	SignUpClubElevenElevenActionsEnum,
	SignUpClubElevenElevenEmitterInterface,
	SignUpClubElevenElevenUIInterface
}
