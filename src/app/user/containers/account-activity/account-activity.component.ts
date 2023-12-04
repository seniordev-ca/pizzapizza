// Angular Core
import {
	Component,
	ViewEncapsulation
} from '@angular/core';

// NG RX core
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

// Reducer DAL
import * as fromUser from '../../reducers';

// Models
import { SubHeaderNavigationInterface } from '../../../common/components/shared/sub-header-navigation/sub-header-navigation.component';
import { TransactionHistoryRowInterface, Club11BalanceInterface } from '../../models/club11'

@Component({
	selector: 'app-account-activity',
	templateUrl: './account-activity.component.html',
	styleUrls: ['./account-activity.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class AccountActivityComponentComponent {
	subHeaderNavContent: SubHeaderNavigationInterface;
	accountBalance$: Observable<Club11BalanceInterface>;
	transactionHistory$: Observable<TransactionHistoryRowInterface[]>;

	constructor(
		private userStore: Store<fromUser.UserState>
	) {
		// Content for top header
		this.subHeaderNavContent = {
			textColor: '#4C3017',
			iconColor: '#EE5A00'
		};

		this.transactionHistory$ = this.userStore.pipe(select(fromUser.getTransactionHistory));
		this.accountBalance$ = this.userStore.pipe(select(fromUser.getAccountBalance));

	}
}
