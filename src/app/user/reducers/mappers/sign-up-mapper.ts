// Server Model
import {
	ServerUserRegistrationInputInterface,
	ServerLoginResponseInterface,
	ServerClub1111RegistrationInterface,
	ServerClub1111PrefillInterface,
} from '../../models/server-models/server-user-registration-input';

// View Model
import {
	SignUpFormInterface,
	DateOfBirthInterface,
	SignUpFormErrorInterface
} from '../../components/sign-up/sign-up-form/sign-up-form.component';
import { UserProfileInterface, UserOptInLanguageEnum } from '../../models/user-personal-details'
import { ServerValidationError } from '../../../common/models/server-validation-error';
import { SignUpClubElevenElevenInterface } from '../../components/common/sign-up-club-eleven-eleven/sign-up-club-eleven-eleven.component';
import { ServerDefaultPaymentMethodEnum } from '../../models/server-models/server-saved-cards-interfaces';
/**
 * The role of this class is to map server response to view model
 */
export class SignUpReducerHelper {

	/**
	 * Maps SignUp Info
	 */
	static parseSignUpInfoUIToServer(form: SignUpFormInterface): ServerUserRegistrationInputInterface {
		const request = {
			first_name: form.firstName,
			last_name: form.lastName,
			email: form.emailAddress.trim().toLowerCase(), // trim white space from email
			contact_number: {
				// Remove formating from input mask and only pass numbers
				phone_number: form.phoneNumber.match(/\d+/g).join(''),
				type: form.phoneType,
				extension: form.phoneExtension
			},
			date_of_birth: this._formatUIDOBToServer(form.dateOfBirth),
			lang_preference: form.language === UserOptInLanguageEnum.French ? 'fr' : 'en',
			profile_pic: form.userImage.userImageData,
			optin_pp_promotions: form.ppPromotions === 'yes'
		} as ServerUserRegistrationInputInterface

		// if (!form.userImage.userImageData) {
		// 	delete(request.profile_pic)
		// }

		if (!form.dateOfBirth.year) {
			delete request.date_of_birth
		}

		// Only send the password if there is one (used on the edit page without password)
		if (form.password !== '') {
			request.password = form.password;
		}
		// Only send the club 11-11 details if it is exists
		if (form.clubElevenElevenData) {
			const isExistingUser = false;
			request.optin_club11_promotions = form.clubElevenElevenData.sendClubPromotions === 'yes'
			request.club_11_11 = this.parseSignupClub1111ToServerRequest(form, isExistingUser)
		}

		// If you wante to test errors
		// const errorRequest = {
		// 	...request,
		// 	first_name: null,
		// 	last_name: null,
		// 	email: null,
		// 	contact_number: {
		// 		phone_number: null,
		// 		type: null,
		// 		extension: null
		// 	},
		// 	date_of_birth: null,
		// 	lang_preference: null,
		// 	profile_pic: null,
		// 	optin_pp_promotions: null,
		// 	club11: {
		// 		optin: null,
		// 		is_new_card: null,
		// 		loyalty_card: {
		// 			number: null,
		// 			pin: null
		// 		},
		// 		address_components: null,
		// 	}
		// } as ServerUserRegistrationInputInterface


		return request; // errorRequest
	}

	/**
	 * Parse Club 1111 Registration Request To Server
	 */
	static parseSignupClub1111ToServerRequest(
		form: SignUpFormInterface,
		isExistingUser: boolean
	): ServerClub1111RegistrationInterface {
		const club1111 = form.clubElevenElevenData
		const request = {
			optin: club1111.sendClubPromotions === 'yes',
			is_new_card: club1111.cardNumber ? false : true
		} as ServerClub1111RegistrationInterface

		// if user is registering with existing card
		// TODO - Backend must accept strings for card number because JS does not handle such large conversions
		if (!request.is_new_card) {
			request.loyalty_card = {
				number: club1111.cardNumber,
				pin: Number(club1111.cardPin)
			}
		} else {
			// otherwise we need a new card via address components
			request.address_components = club1111.streetAddress;
			request.apartment_number = club1111.apartmentNumber
		}

		// if existing card is not registered with an address
		if (!request.is_new_card && club1111.token) {
			request.address_components = club1111.streetAddress;
			request.apartment_number = club1111.apartmentNumber

			request.loyalty_token = club1111.token
		}

		if (isExistingUser) {
			request.lang_preference = form.language === UserOptInLanguageEnum.French ? 'fr' : 'en';
			request.date_of_birth = this._formatUIDOBToServer(form.dateOfBirth);
			if (!form.dateOfBirth.year) {
				delete request.date_of_birth
			}
		}
		return request
	}

	/**
	 * Map Server Response for User Summary to UI
	 */
	static parseUserSummaryServerToUI(userSummary: ServerLoginResponseInterface)
		: UserProfileInterface {
		const clubElevenElevenData = userSummary.club_11_11 ? {
			streetAddress: userSummary.club_11_11.address_components,
			apartmentNumber: userSummary.club_11_11.apartment_number,
			cardNumber: userSummary.club_11_11.loyalty_card.number + '',
			cardPin: userSummary.club_11_11.loyalty_card.pin + '',
			// dateOfBirth: userSummary.club_11_11.date_of_birth,
			language: userSummary.club_11_11.lang_preference,
			sendClubPromotions: userSummary.club_11_11.optin ? 'yes' : 'no',
		} : null

		// Note: we create random string so cache of browser won't be confused with returning image name from server
		// This is temporary solution, ideal is: generate new name on back end
		let result = '';
		const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		const charactersLength = characters.length;
		for (let i = 0; i < 7; i++) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength));
		}
		// Note: Masterpass has been removed but not removed from BE so we treat it as null here
		const defaultPayment = {
			paymentMethod: userSummary.default_payment && userSummary.default_payment.payment_method !== ServerDefaultPaymentMethodEnum.MASTERPASS ?
				userSummary.default_payment.payment_method : null,
			token: userSummary.default_payment && userSummary.default_payment.payment_method !== ServerDefaultPaymentMethodEnum.MASTERPASS ?
				userSummary.default_payment.payment_method === ServerDefaultPaymentMethodEnum.MEAL_CARD ?
					userSummary.meal_card.token : userSummary.default_payment.token : null
		}
		return {
			firstName: userSummary.first_name,
			lastName: userSummary.last_name,
			profilePic: userSummary.profile_pic ? userSummary.profile_pic + `?${result}` : null,
			customerId: userSummary.customer_id,
			userHasCouponsInWallet: userSummary.has_coupon_wallet,
			clubElevenElevenData,
			contactNumber: userSummary.contact_number ? {
				phoneNumber: userSummary.contact_number.phone_number,
				type: userSummary.contact_number.type,
				extension: userSummary.contact_number.extension
			} : {
					phoneNumber: null,
					type: null,
					extension: null
				},
			email: userSummary.email,
			birthday: userSummary.date_of_birth,
			isClubElevenElevenMember: userSummary.club_11_11_member,
			isOptedIn: userSummary.optin_pp_promotions,
			optInLanguage: userSummary.lang_preference === 'fr' ? UserOptInLanguageEnum.French : UserOptInLanguageEnum.Engish,
			isUserHasWallet: userSummary.digital_wallet_exists,
			defaultPayment,
			isClubElevenElevenPrefillAvail: userSummary.prefill_available,
			isUserHasMealCard: userSummary.meal_card && userSummary.meal_card.token ? true : false,
			earnedText: userSummary.club_11_11_earnings,
			isCartUpdated: userSummary.is_cart_updated
		}

	}

	/**
	 * Parse Server Error To UI
	 */
	static parseServerErrorToUIForm(error): SignUpFormErrorInterface {
		let uiError = null
		if (error) {
			const errors = error.errors;
			uiError = {
				dateOfBirth: errors.date_of_birth,
				firstName: errors.first_name,
				lastName: errors.last_name,
				emailAddress: errors.email,
				password: errors.password,
				phoneNumber: errors['contact_number.phone_number'],
				phoneExtension: errors['contact_number.extension'],
				streetAddress: errors['club11.address_components'],
				cardNumber: errors['club11.loyalty_card.number'],
				cardPin: errors['club11.loyalty_card.pin'],
				addressRequired: errors['address_required'],
				invalidCard: errors['invalid_card'],
				token: errors['loyalty_token'],
				giftCard: errors['gift_card'],
				transferAmount: errors['transfer_balance']
			} as SignUpFormErrorInterface
		}

		return uiError;
	}

	/**
	 * Parse Prefill Data To User UI
	 */
	static parsePrefillData(data: ServerClub1111PrefillInterface): SignUpClubElevenElevenInterface {
		return {
			addressString: this._formatAddressToString(data),
			apartmentNumber: data.apartment_number,
			language: data.lang_preference,
			sendClubPromotions: data.optin_club11_promotions ? 'yes' : 'no',
		}
	}

	/**
	 * Parse AddressObject
	 */
	private static _formatAddressToString(address: ServerClub1111PrefillInterface) {
		return address.street_number + ' ' + address.street_address + ', ' + address.province + ', ' + address.postal_code
	}
	/**
	 * Simple Method to parse ui dob to string or null
	 */
	private static _formatUIDOBToServer(dob: DateOfBirthInterface) {
		return dob.year ? dob.year + '-' + dob.month + '-' + dob.day : null
	}
}
