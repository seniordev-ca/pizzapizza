import { ServerDefaultPaymentMethodEnum } from './server-models/server-saved-cards-interfaces';
import { SignUpClubElevenElevenInterface } from '../components/common/sign-up-club-eleven-eleven/sign-up-club-eleven-eleven.component';
/** TODO: Change cards to enums
 */
interface UserSummaryInterface {
	firstName: string,
	lastName: string,
	profilePic: string,
	customerId: string,
	contactNumber: {
		phoneNumber: string,
		type: string,
		extension: string
	},
	email: string,
	userHasCouponsInWallet?: boolean,
	isUserHasWallet?: boolean,
	defaultPayment?: {
		paymentMethod: ServerDefaultPaymentMethodEnum,
		token: string
	},
	isClubElevenElevenMember?: boolean,
	clubElevenElevenData?: SignUpClubElevenElevenInterface,
	isUserHasMealCard?: boolean,
	isClubElevenElevenPrefillAvail?: boolean,
	earnedText?: string
}
interface UserProfileInterface extends UserSummaryInterface {
	optInLanguage?: UserOptInLanguageEnum,
	birthday?: string,
	isOptedIn?: boolean,
	isCartUpdated?: boolean
}
/**
 * Defines actions that can be taken on personal details component
 */
enum UserPersonalDetailsActions {
	onEditProfile,
	onSignOutProfile,
	onUserImageAdd,
	onUserImageClose,
	onUserImageUpload,
	onUserImageSave,
	onUserImageClear
}

/*
/** TODO: Change cards to enums
 */
interface UserPersonalDetailsEmitterInterface {
	action: UserPersonalDetailsActions,
	userId: number,
	imageData?: string;
}

/**
 * Enum for front end language sectors
 */
enum UserOptInLanguageEnum {
	French = 'French',
	Engish = 'English'
}

export {
	UserSummaryInterface,
	UserPersonalDetailsActions,
	UserPersonalDetailsEmitterInterface,
	UserProfileInterface,
	UserOptInLanguageEnum
}
