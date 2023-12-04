import { ServerDefaultPaymentMethodEnum, ServerPaymentMethodInterface } from './server-saved-cards-interfaces';
import { PhoneTypeEnum, GoogleAddressComponent, ServerAddressObject } from '../../../common/models/address-list';

interface ServerPhoneNumberInterface {
	type: PhoneTypeEnum,
	phone_number: string,
	extension?: string
}

interface ServerUserRegistrationInputInterface {
	email?: string,
	password?: string,
	first_name: string,
	last_name: string,
	contact_number: ServerPhoneNumberInterface,
	profile_pic?: string,
	legacy_customer_id?: number,
	customer_type?: string,
	date_of_birth?: string,
	optin_pp_promotions?: boolean,
	lang_preference?: string,
	optin_club11_promotions?: boolean,
	digital_wallet_exists?: boolean,
	club_11_11?: ServerClub1111RegistrationInterface
}

interface ServerClub1111RegistrationInterface {
	optin: boolean,
	is_new_card: boolean,
	loyalty_token?: string,
	address?:  ServerAddressObject,
	apartment_number?: string,
	address_components?: GoogleAddressComponent[],
	loyalty_card?: {
		number: string,
		pin: number
	},
	lang_preference?: string,
	date_of_birth?: string
}

interface ServerClub1111PrefillInterface extends ServerAddressObject {
	apartment_number: string,
	lang_preference: string,
	optin_club11_promotions: true
}

interface ServerUserRegistrationEmailCheck {
	user_email: string;
}

interface ServerUserRegistrationEmailCheckResult {
	exists: boolean;
}

interface ServerLoginRequestInterface {
	username: string,
	password: string
}
/**
 * Enum To keep track of how user signs in
 */
enum SignInTypeEnum {
	EMAIL = 'Email',
	GOOGLE = 'Google',
	FACEBOOK = 'Facebook'
}
interface ServerLoginResponseInterface extends ServerUserRegistrationInputInterface {
	loyalty_card_token: string,
	expires_in: number,
	has_coupon_wallet: boolean,
	is_cart_updated: boolean,
	default_address_id?: number,
	lang_preference?: string,
	customer_stores?: number[],
	access_token?: string,
	refresh_token?: string
	digital_wallet_exists?: boolean,
	default_payment?: {
		payment_method?: ServerDefaultPaymentMethodEnum,
		token?: string
	}
	club_11_11_member?: boolean,
	club_11_11?: ServerClub1111RegistrationInterface,
	customer_id?: string,
	meal_card?: ServerPaymentMethodInterface,
	prefill_available?: boolean;
	registration_status?: ServerRegistrationStatusEnum,
	club_11_11_earnings?: string,
}

interface ServerClub1111RegistrationResponse {
	loyalty_card_token?: string,
	success: boolean
}
interface ServerLoginErrorResponse {
	message: string,
	error_code: string,
	request_id: string
}
interface ServerUpdateProfileErrorResponse {
	message: string,
	errors: ServerUserRegistrationInputInterface,
	request_id: string
}

/**
 * Registration Status
 */
enum ServerRegistrationStatusEnum {
	CLUB_11_11_FAIL = 'CLUB_11_11_FAIL',
	CLUB_11_11_SUCCESS = 'CLUB_11_11_SUCCESS',
	NO_CLUB_11_11 = 'NO_CLUB_11_11'
}

export {
	ServerPhoneNumberInterface,
	ServerUserRegistrationInputInterface,
	ServerUserRegistrationEmailCheck,
	ServerUserRegistrationEmailCheckResult,
	ServerLoginRequestInterface,
	ServerLoginResponseInterface,
	ServerLoginErrorResponse,
	ServerClub1111RegistrationInterface,
	ServerClub1111PrefillInterface,
	ServerRegistrationStatusEnum,
	ServerClub1111RegistrationResponse,
	ServerUpdateProfileErrorResponse,
	SignInTypeEnum
}



