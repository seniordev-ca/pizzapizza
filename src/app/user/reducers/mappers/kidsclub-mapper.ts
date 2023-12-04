import { KidsClubSignUpFormInterface } from '../../containers/account-kids-club-vertical-modal/kids-club-modal.component';
import { DateOfBirthInterface } from '../../components/sign-up/sign-up-form/sign-up-form.component';
import { RegisteredKidsClubInterface } from '../../models/registered-kids-club';
import { ServerKidsClubInterface } from '../../models/server-models/server-kids-club';

export class KidsClubReducerHelp {
	/**
	 * Parse UI Form To Registration/Update Request
	 */
	static parseUIToServerKidsClub(formData: KidsClubSignUpFormInterface): ServerKidsClubInterface {
		const serverKidsClub = {
			first_name: formData.firstName,
			last_name: formData.lastName,
			date_of_birth: this._formatUIDOBToServer(formData.dateOfBirth),
			gender: formData.gender
		} as ServerKidsClubInterface

		if (formData.id) {
			serverKidsClub.id = formData.id
		}

		return serverKidsClub
	}

	/**
	 * Parse Server Data To UI
	 */
	static parseSeverToUIKidsClub(data: ServerKidsClubInterface): RegisteredKidsClubInterface {
		const uiKidsClub = {
			firstName: data.first_name,
			lastName: data.last_name,
			gender: data.gender,
			dateOfBirth: data.date_of_birth,
			dobDisplayString: this._formatDOBServerToUI(data.date_of_birth),
			id: data.id
		} as RegisteredKidsClubInterface

		return uiKidsClub
	}


	/**
	 * Display String For DOB
	 */
	private static _formatDOBServerToUI(dob: string) {
		const isStringValid = dob && dob.split('-').length === 3;
		let dateOfBirth = null;
		if (isStringValid) {
			const dobArray = dob.split('-')
			dateOfBirth = dobArray[2] + '-' + dobArray[1] + '-' + dobArray[0];
		}
		return dateOfBirth;
	}
	/**
	 * Simple Method to parse ui dob to string or null
	 */
	private static _formatUIDOBToServer(dob: DateOfBirthInterface) {
		return dob.year ? dob.year + '-' + dob.month + '-' + dob.day : ''
	}
}
