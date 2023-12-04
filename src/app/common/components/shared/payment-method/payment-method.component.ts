import {
	Component,
	Input,
	Output,
	EventEmitter,
	ViewEncapsulation
} from '@angular/core';
import {
	UserCreditCardsActions,
	UserCreditCardsEmitterInterface
} from '../../../models/user-payment-methods';

import { UISavedCardsInterface } from '../../../../user/models/user-saved-cards';
import { BamboraLoaderService } from '../../../../../utils/payment-methods/bambora.service';
import { FormControl } from '@angular/forms';
import { ServerPaymentCardStatusEnum } from 'app/user/models/server-models/server-saved-cards-interfaces';


/**
* Used at:
* - checkout/components/cart/checkout-payment-method-form
* - user/components/accounts/activities
*/
@Component({
	selector: 'app-payment-method',
	templateUrl: './payment-method.component.html',
	styleUrls: ['./payment-method.component.scss'],
	providers: [BamboraLoaderService],
	encapsulation: ViewEncapsulation.None
})
export class PaymentMethodComponent {
	@Input() isAccountPage: boolean;
	@Input() userPaymentMethods: UISavedCardsInterface[];
	@Input() selectedPaymentMethod: UISavedCardsInterface;
	@Input() selectedToken: FormControl;
	@Output() userPaymentMethodsEventEmitter: EventEmitter<UserCreditCardsEmitterInterface> =
		new EventEmitter<UserCreditCardsEmitterInterface>();

	ServerPaymentCardStatusEnum = ServerPaymentCardStatusEnum;

	/**
	* Constructor method for the payment method subcomponent
	*/
	constructor(
		private bambora: BamboraLoaderService
	) { }


	/**
	* Click event for the payment methods edit button, which emits the event up to parent containers along with the payment method id
	*/
	onEditClick(event, token) {
		event.stopPropagation();

		this.userPaymentMethodsEventEmitter.emit({
			action: UserCreditCardsActions.onEdit,
			token
		} as UserCreditCardsEmitterInterface
		);
	}

	/**
	* Click event for the payment methods delete button, which emits the event up to parent containers along with the payment method id
	*/
	onDelete(event, token, paymentType) {
		event.stopPropagation();

		this.userPaymentMethodsEventEmitter.emit({
			action: UserCreditCardsActions.onDelete,
			token,
			paymentType
		} as UserCreditCardsEmitterInterface
		);
	}

	/**
	* Click event for the special cards click events -> special cards are masterpass and visa checkout
	*/
	onSelect(event, card: UISavedCardsInterface) {
		event.stopPropagation();

		if (this.isSelected(card)) {
			return false
		}
		this.userPaymentMethodsEventEmitter.emit({
			action: UserCreditCardsActions.onSelect,
			token: card.token,
			paymentType: card.cardType
		} as UserCreditCardsEmitterInterface
		);
	}

	/**
	 * Get Card Logo
	 */
	getCardLogo(cardType) {
		const cardNames = {
			AM: 'amex',
			DI: 'diners',
			JB: 'jcb',
			MC: 'mastercard',
			NN: 'discover',
			VI: 'visa'
		}
		if (cardNames[cardType]) {
			return this.bambora.LOGO_PATH + cardNames[cardType] + '.svg';
		}
		return './static-files/images/user/payment-methods/account-payment-student-card.png';
	}

	/**
	 * Determine if card is selected
	 */
	isSelected(card: UISavedCardsInterface) {
		const isDefault = card.isDefault;
		const selectedViaToken = this.selectedToken ? this.selectedToken.value === card.token : false;
		const selectedViaCard = this.selectedPaymentMethod ? this.selectedPaymentMethod.token === card.token : false;
		return (isDefault && this.isAccountPage) || (!this.isAccountPage && (selectedViaToken || selectedViaCard))
	}
}
