import {
	Component,
	OnInit
} from '@angular/core';
import {
	FormBuilder,
	FormGroup,
	Validators
} from '@angular/forms';

// NG RX core
import { Store, select } from '@ngrx/store';
// Reduce, actions
import * as fromUser from '../../reducers';
import * as fromCommon from '../../../common/reducers';
import { Observable } from 'rxjs';
import { FetchGiftCardTransactions, ClearGiftCardTransactions } from '../../actions/gift-card';
import { ClubTransactionsResponse } from '../../models/server-models/server-club11';
import { AsyncFormValidationService } from '../../../../utils/async-form-validation';

/**
 * Possible states for balance check modal
 */
enum BalanceModalState {
	cardInput,
	cardBalance,
	transactionsHistory
}

@Component({
	selector: 'app-balance-vertical-modal',
	templateUrl: './balance-vertical-modal.component.html',
	styleUrls: ['./balance-vertical-modal.component.scss']
})
export class BalanceVerticalModalComponent implements OnInit {
	balanceModalState = BalanceModalState;
	cardInputForm: FormGroup;

	inputFormState: BalanceModalState;

	giftCardHistory$: Observable<ClubTransactionsResponse>
	learnMoreLink$: Observable<string>

	constructor(
		private fb: FormBuilder,
		private userStore: Store<fromUser.UserState>,
		private commonStore: Store<fromCommon.CommonState>,
		public formValidationService: AsyncFormValidationService
	) {
		this.inputFormState = BalanceModalState.cardInput;

		this.cardInputForm = this.fb.group({
			'cardNumber': [
				'', Validators.compose([
					Validators.required,
					Validators.pattern('^[0-9]*$')
				])
			],
			'cardPin': [
				'', Validators.compose([
					Validators.required,
					Validators.pattern('^[0-9]*$')
				])
			]
		})
		this.giftCardHistory$ = this.userStore.pipe(select(fromUser.getGiftCardHistory))
		this.learnMoreLink$ = this.commonStore.pipe(select(fromCommon.getLearnMoreLink))

	}

	/**
	 * Component constructor
	 */
	ngOnInit() {

	};

	/**
	 * On Balance check click
	 */
	onBalanceCheckClick() {
		const cardNumber = this.cardInputForm.get('cardNumber').value;
		const cardPin = this.cardInputForm.get('cardPin').value
		this.userStore.dispatch(new FetchGiftCardTransactions(cardNumber, Number(cardPin)))
	}

	/**
	 * On View history click
	 */
	onViewHistoryClick(event) {
		event.preventDefault()
		this.inputFormState = BalanceModalState.transactionsHistory
	}

	/**
	 * On Open Modal
	 */
	onOpenModal() {

		this.inputFormState = BalanceModalState.cardInput;
		this.cardInputForm.reset()
		this.userStore.dispatch(new ClearGiftCardTransactions())
	}


}
