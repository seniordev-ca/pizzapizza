interface ServerPaymentRequestInterface {
	token: string,
	name?: string,
	existing_card_token?: string
}
interface ServerPaymentResponseInterface {
	cards: ServerPaymentMethodInterface[],
	recent_token: string
}
interface ServerPaymentMethodInterface {
	token: string,
	card_type: ServerPaymentCardTypeEnum,
	name: string,
	number: string,
	status: ServerPaymentCardStatusEnum
}
interface ServerSetDefaultPaymentMethodInterface {
	default_payment: {
		payment_method: ServerDefaultPaymentMethodEnum,
		token?: string
	}
}

interface ServerMealCardRequestInterface {
	overwrite: boolean,
	name: string,
	key: string,
	number: number
}

/**
 * Payment Method Enum
 */
enum ServerDefaultPaymentMethodEnum {
	VISA = 'VISA',
	MASTERPASS = 'MASTERPASS',
	WALLET = 'WALLET',
	MEAL_CARD = 'MEAL_CARD'
}
/**
 * Card Type Enum
 */
enum ServerPaymentCardTypeEnum {
	AM = 'AM',
	DI = 'DI',
	JB = 'JB',
	MC = 'MC',
	NN = 'NN',
	VI = 'VI',
	MealCard = 'MealCard'
}
/**
 * Card Status Enum
 */
enum ServerPaymentCardStatusEnum {
	VALID = 'valid',
	EXPIRED = 'expired'
}

export {
	ServerPaymentRequestInterface,
	ServerPaymentResponseInterface,
	ServerPaymentMethodInterface,
	ServerPaymentCardTypeEnum,
	ServerDefaultPaymentMethodEnum,
	ServerSetDefaultPaymentMethodInterface,
	ServerMealCardRequestInterface,
	ServerPaymentCardStatusEnum
}

