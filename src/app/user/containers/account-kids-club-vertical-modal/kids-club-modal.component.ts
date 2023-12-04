import {
	Component,
	Input,
	Output,
	EventEmitter,
	ViewEncapsulation,
	ViewChild,
	OnInit,
	OnDestroy
} from '@angular/core';

import {
	FormBuilder,
	FormGroup,
	Validators,
	AbstractControl
} from '@angular/forms';
import {
	AsyncFormValidationService
} from '../../../../utils/async-form-validation';
import {
	ConfirmationModalComponent
} from '../../../common/components/modals/confirmation-modal/confirmation-modal.component';

import { Store, ActionsSubject, select } from '@ngrx/store';
import * as fromReducers from '../../reducers';
import { DeleteKidsClubUser, UpdateKidsClub, RegisterNewKidsClub, KidsClubActionTypes } from '../../actions/kids-club-actions';
import { RegisteredKidsClubInterface } from '../../models/registered-kids-club';
import { DateOfBirthInterface } from '../../components/sign-up/sign-up-form/sign-up-form.component';
import { PPFormBuilderService } from '../../../common/services/form-builder.service';
import { DropdDownOptionInterface } from '../../../common/components/shared/styled-dropdown/styled-dropdown.component';
import { filter } from 'rxjs/operators';

/*
/** Sign Up Interface
 */
interface KidsClubSignUpFormInterface {
	firstName: string;
	lastName: string;
	dateOfBirth: DateOfBirthInterface;
	gender?: string;
	id?: number;
}

/**
* Kids Club Modal component
*/
@Component({
	selector: 'app-kids-club-modal-vertical-modal',
	templateUrl: './kids-club-modal.component.html',
	styleUrls: ['./kids-club-modal.component.scss'],
	encapsulation: ViewEncapsulation.None,
	providers: [AsyncFormValidationService, PPFormBuilderService]
})

/**
* Subscribe on store events and dispatch users event
*/
export class KidsClubModalComponent implements OnInit, OnDestroy {
	@ViewChild('kidsClubVerticalModal', { static: true }) kidsClubVerticalModalRef;
	@ViewChild('confirmUnsubscribe', { static: true }) confirmUnsubscribe: ConfirmationModalComponent;

	@Input() set activeKidsClubUser(input: RegisteredKidsClubInterface) {
		if (input) {
			const dateOfBirth = this.formBuilderService.buildUserBirthdayObject(input.dateOfBirth)
			const userDetails = {
				'firstName': input.firstName,
				'lastName': input.lastName,
				'dateOfBirth': dateOfBirth,
				'id': input.id,
				'gender': input.gender
			} as KidsClubSignUpFormInterface
			this.signUpForm.patchValue(userDetails)
		} else {
			this.signUpForm.reset()
		}
	}

	@Output() userKidsClubEventModalCloseEmitter: EventEmitter<boolean> =
		new EventEmitter<boolean>();
	signUpForm: FormGroup;
	validDays: DropdDownOptionInterface[]
	yearOptions: string[];
	monthOptions: string[];
	validDaysSubscriptionRef;
	validationBirthDateRef;
	errorBirthDateMappingRef;
	/**
	 * Component constructor
	 */
	constructor(
		private confirmModal: ConfirmationModalComponent,
		private fb: FormBuilder,
		private formBuilderService: PPFormBuilderService,
		private store: Store<fromReducers.UserState>,
		public formValidationService: AsyncFormValidationService,
		private dispatcher: ActionsSubject) {
		const formData = {
			'firstName': null,
			'lastName': null,
			'dateOfBirth': {
				'day': null,
				'month': null,
				'year': null
			},
			'id': null,
			'gender': null
		} as KidsClubSignUpFormInterface;

		this.signUpForm = this.fb.group({
			'firstName': [formData.firstName, Validators.compose([Validators.required])],
			'lastName': [formData.lastName, Validators.compose([Validators.required])],
			'gender': [formData.gender, Validators.compose([Validators.required])],
			'dateOfBirth': this.fb.group({
				'day': [formData.dateOfBirth.day, Validators.compose([
					Validators.required,
					Validators.pattern(/^[0-9]*$/)
				])],
				'month': [formData.dateOfBirth.month, Validators.compose([
					Validators.required,
					Validators.pattern(/^[0-9]*$/)
				])],
				'year': [formData.dateOfBirth.year, Validators.compose([
					Validators.required,
					Validators.pattern(/^[0-9]*$/)
				])]
			}, Validators.compose([Validators.required])),
			'id': [formData.id]
		});
		this.validationBirthDateRef = this.dispatcher.pipe(
			filter(action => action.type === KidsClubActionTypes.UpdateKidsClubSuccess ||
				action.type === KidsClubActionTypes.RegisterNewKidsClubSuccess))
			.subscribe(action => {
				this.close();
			})
		this.errorBirthDateMappingRef = this.store.pipe(select(fromReducers.getKidsClubProfileErrors)).subscribe(errors => {
			if (errors) {
				this._mapUpdateProfileErrorsToForm(errors);
			}
		})
	}

	/**
	 * On Init
	 */
	ngOnInit() {
		this.yearOptions = this.formValidationService.getYearRange(11);
		this.monthOptions = this.formValidationService.getMonths();
		this.getValidDays()
	}

	/**
	 * Destroy
	 */
	ngOnDestroy() {
		if (this.validDaysSubscriptionRef) {
			this.validDaysSubscriptionRef.unsubscribe()
		}
		this.validationBirthDateRef.unsubscribe();
		this.errorBirthDateMappingRef.unsubscribe();
	}
	/**
	 * Public handler for open modal
	*/
	open() {
		this.kidsClubVerticalModalRef.openModal();
		this.subscribeToDateChanges()
	}

	/**
	 * Public handler for close modal
	*/
	close() {
		this.userKidsClubEventModalCloseEmitter.emit(true)
		this.kidsClubVerticalModalRef.closeModal();
	}

	/**
	 * User Confirms Unsubscribe
	 */
	onConfirmUnsubscribe() {
		const id = this.signUpForm.get('id').value;
		this.store.dispatch(new DeleteKidsClubUser(id))
		this.close()
	}
	/**
	 * Remove from kids club
	*/
	unsubscribe() {
		// prepare the data for modal
		this.confirmModal.onOpen(this.confirmUnsubscribe);
	}

	/**
	 * Save Kids Club User
	 */
	onSaveKidsClubUser() {
		const isUpdate = this.signUpForm.get('id').value
		const formData = this.signUpForm.value

		if (isUpdate) {
			// Update Action
			this.store.dispatch(new UpdateKidsClub(formData))
			// this.close()

			return false
		}

		// Register Action
		this.store.dispatch(new RegisterNewKidsClub(formData))

		// only close if saved successfully
		// this.close()
	}

	/**
	 * Subscribing to date changes - TODO: resolve
	 */
	subscribeToDateChanges() {
		this.validDaysSubscriptionRef = this.signUpForm.get('dateOfBirth').valueChanges.subscribe(changes => {
			this.getValidDays()
		})
	}

	/**
	 * Get Valid Days In Month
	 */
	getValidDays() {
		const dobControl = this.signUpForm.get('dateOfBirth').value;
		const monthValue = dobControl.month;
		const yearValue = dobControl.year;
		this.validDays = this.formValidationService.getDaysInMonth(yearValue, monthValue);
	}


	/**
	* Map Errors to UI Form on Edit Profile modal window
	*/
	private _mapUpdateProfileErrorsToForm(error) {
		for (const key in error) {
			if (key && this.signUpForm.get(key) && error[key]) {
				const formControl = this.signUpForm.get(key);
				this._setFormControlErrors(formControl, key, error[key]);
			}
		}
	}

	/**
	* set errors for form control
	*/
	private _setFormControlErrors(formControl: AbstractControl, key: string, value: string) {
		// setTimeout used to avoid angulars validation reseting
		formControl.setErrors({
			'incorrect': value
		}, { emitEvent: true });
	}

}

export {
	KidsClubSignUpFormInterface
}
