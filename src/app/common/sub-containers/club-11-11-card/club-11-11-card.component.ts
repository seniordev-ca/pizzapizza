// Angular core
import {
	Component,
	Input,
	ViewEncapsulation,
	ViewChild,
	Inject,
	LOCALE_ID
} from '@angular/core';

// NGRX
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';

import { Club11BalanceInterface } from '../../../user/models/club11';
import { UserSummaryInterface } from '../../../user/models/user-personal-details';

// Reducers
import * as fromUser from '../../../user/reducers';
import * as fromCheckout from '../../../checkout/reducers';
import { OrderInformationInterface } from '../../../checkout/components/order-confirmation/order-info/order-info.component';
import { ConfirmationModalComponent } from '../../components/modals/confirmation-modal/confirmation-modal.component';
import { DeleteClubCard, SendClubCardNumber } from '../../../user/actions/club1111-actions';
import { PromptModalComponent } from 'app/common/components/modals/prompt-modal/prompt-modal.component';

/**
 * Enum for parentContainer input
 */
enum ParentContainerEnum {
	CHECKOUT = 'checkout',
	ACCOUNT = 'account',
	LOYALTY = 'loyalty',
	ORDERCONFIRMATION = 'orderConfirmation',
	INCART = 'inCart',
	JUSTFORYOU = 'justForYou'
}
/**
 * Used in
 * - checkout/container/order-confirmation
 * - checkout/container/order-review
 * - user/container/account
 * - user/containers/club-eleven-loyalty
 */
@Component({
	selector: 'app-club-11-11-card',
	templateUrl: './club-11-11-card.component.html',
	styleUrls: ['./club-11-11-card.component.scss'],
	providers: [PromptModalComponent],
	encapsulation: ViewEncapsulation.None
})

export class ClubElevenElevenCardComponent {
	@ViewChild('removeAccount', { static: true }) removeAccount: ConfirmationModalComponent;
	@ViewChild('sendNumberModal', { static: true }) sendNumberModal: PromptModalComponent;
	@ViewChild('emailSent', { static: true }) emailSent: PromptModalComponent;

	ParentContainerEnum = ParentContainerEnum
	@Input() parentContainer: ParentContainerEnum;
	@Input() isPizzaOnly: boolean;
	@Input() isRewardsOnly: boolean;

	userSummary$: Observable<UserSummaryInterface>;
	accountBalance$: Observable<Club11BalanceInterface>;

	cartEarnings$: Observable<{
		registered: string,
		unregistered: string
	}>;

	loyaltyRedeemed$: Observable<number>;

	orderSummary$: Observable<OrderInformationInterface>


	isFR: boolean;

	constructor(
		private store: Store<fromUser.UserState>,
		private confirmModal: ConfirmationModalComponent,
		private promptModal: PromptModalComponent,
		@Inject(LOCALE_ID) public locale: string

	) {
		this.accountBalance$ = this.store.pipe(select(fromUser.getAccountBalance));
		this.userSummary$ = this.store.pipe(select(fromUser.getLoggedInUser));
		this.cartEarnings$ = this.store.pipe(select(fromCheckout.getCartClubEarnings));

		this.loyaltyRedeemed$ = this.store.pipe(select(fromCheckout.getLoyaltyRedeemedInCart));

		this.orderSummary$ = this.store.pipe(select(fromCheckout.getOrderStatus))
		this.isFR = this.locale !== 'en-US';
	}

	/**
	 * Get Account Link
	 */
	getAccountLink(userSummary: UserSummaryInterface) {
		if (!userSummary || !userSummary.isClubElevenElevenMember) {
			return '/user/club-eleven-eleven'
		} else {
			return '/user/club-eleven-eleven/loyalty'
		}
	}

	/**
	* User press edit account icon
	*/
	onEditAccount() {
	}

	/**
	* User press edit account icon
	*/
	onRemoveAccount() {
		// open the modal
		this.confirmModal.onOpen(this.removeAccount);
	}
	/**
	 * User Confirms Delete account
	 */
	onDeleteConfirmed() {
		this.store.dispatch(new DeleteClubCard())
	}

	/**
	 * Determine the path of the svg ---- work in progress
	 */
	determinePath(percent) {
		if (percent) {
			const slicesCount = percent / 20 // we need to find out how many 5ths the user is at
			return Array(slicesCount).fill(1);
		}
	}

	/**
	 * Send card number
	 */
	onSendNumber() {
		this.promptModal.onOpen(this.sendNumberModal)
		console.log('send card number')
	}

	/**
	 * Send Club Number Email
	 */
	sendClubNumber() {
		this.store.dispatch(new SendClubCardNumber());
		this.promptModal.onCancel();
		this.promptModal.onOpen(this.emailSent)
	}

	/**
	 * Determine Text To Display
	 */
	determineText(
		parent: ParentContainerEnum,
		userSummary: UserSummaryInterface,
		orderSummary: OrderInformationInterface,
		clubBalance: Club11BalanceInterface,
		cartEarnings: {
			registered: string,
			unregistered: string
		}
	) {
		const fallBackText = this.isFR ?
			'Connectez-vous ou ouvrez un compte pour commencer à accumuler des sous' : 'Sign in or create an account to start earning dough.';
		let defaultText = null;
		const cartText = userSummary && userSummary.isClubElevenElevenMember ? cartEarnings.registered : cartEarnings.unregistered;

		switch (parent) {
			case ParentContainerEnum.ACCOUNT:
			case ParentContainerEnum.LOYALTY: {
				const defaultUser = userSummary ? userSummary.earnedText : null
				defaultText = userSummary && userSummary.isClubElevenElevenMember ? clubBalance.earnedText : defaultUser

				break
			}
			case ParentContainerEnum.ORDERCONFIRMATION: {
				defaultText = clubBalance && clubBalance.balanceReadyText ? clubBalance.balanceReadyText : orderSummary.earnedText;

				break
			}
			case ParentContainerEnum.CHECKOUT:
			case ParentContainerEnum.INCART: {
				defaultText = clubBalance && clubBalance.balanceReadyText ? clubBalance.balanceReadyText : cartText;

				break
			}

			case ParentContainerEnum.JUSTFORYOU: {
				defaultText = userSummary && userSummary.isClubElevenElevenMember ? clubBalance.earnedText : cartText;

				break
			}
		}
		return defaultText ? defaultText : fallBackText;
	}
}
