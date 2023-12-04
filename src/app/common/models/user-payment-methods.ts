import { ServerPaymentCardTypeEnum } from '../../user/models/server-models/server-saved-cards-interfaces';
import { UISavedCardsInterface } from '../../user/models/user-saved-cards';

/**
 * Defines actions that can be taken on credit card tabs
 */
enum UserCardTypes {
	masterPass,
	visaCheckout,
	studentCard,
	debitCard,
	masterCard,
	visaCard
}

/**
 * Defines actions that can be taken on credit card tabs
 */
enum UserCreditCardsActions {
	onSelect,
	onSetDefault,
	onEdit,
	onDelete,
	onSelectVisa,
	onSelectMasterPass,
	onSaveNewCard,
	onAddNewCard,
	onSelectAddCreditCard,
	onSelectAddStudentCard,
	onClearDefault
}

/*
/** TODO: Change cards to enums
 */
interface UserCreditCardsEmitterInterface {
	action: UserCreditCardsActions,
	token: string,
	isOpen?: boolean,
	paymentType?: ServerPaymentCardTypeEnum,
	paymentMethods?: UISavedCardsInterface[]
}

interface UserPaymentMethodsInterface {
	userId: number,
	creditCardsInfo: Array<{
		paymentMethodId: number,
		cardType: UserCardTypes,
		cardImage: string,
		cardHolderName: string,
		cardNumber: string,
		isSelected: boolean,
		isSpecialCard: boolean,
		isDefault: boolean
	}>,
}

export {
	UserPaymentMethodsInterface,
	UserCardTypes,
	UserCreditCardsActions,
	UserCreditCardsEmitterInterface
}
