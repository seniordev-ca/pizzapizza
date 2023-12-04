import {
	Component,
	Input,
	Output,
	EventEmitter,
	ViewEncapsulation
} from '@angular/core';
import {
	UserPersonalDetailsActions,
	UserPersonalDetailsEmitterInterface,
	UserSummaryInterface
} from '../../../models/user-personal-details';
import {
	UserImageInterface
} from '../../sign-up/sign-up-form/sign-up-form.component'
import { Store } from '@ngrx/store';
import * as fromUser from '../../../../user/reducers';
import { CommonUseUpdateDataLayer } from '../../../../common/actions/tag-manager'
@Component({
	selector: 'app-personal-details',
	templateUrl: './personal-details.component.html',
	styleUrls: ['./personal-details.component.scss'],
	encapsulation: ViewEncapsulation.None
})

export class PersonalDetailsComponent {
	user: UserSummaryInterface;
	userImage: UserImageInterface
	@Input() set userPersonalDetails(user: UserSummaryInterface) {
		this.user = user;
		if (user) {
			this.userImage = {
				userImageData: user.profilePic,
			}
		}

	}
	@Output() personalDetailsEventEmitter: EventEmitter<UserPersonalDetailsEmitterInterface> =
		new EventEmitter<UserPersonalDetailsEmitterInterface>();
	modalResult: boolean;

	constructor(private userStore: Store<fromUser.UserState>) {
	}

	/**
	* Method to edit profile, will bubble up to event handler in container
	*/
	onEditProfile(event) {
		event.stopPropagation();
		this.userStore.dispatch(new CommonUseUpdateDataLayer('editprofile', 'Account', 'Clicks to Edit Profile', ''))
		const action = {
			action: UserPersonalDetailsActions.onEditProfile,
		} as UserPersonalDetailsEmitterInterface;

		this.personalDetailsEventEmitter.emit(action);
	}
	/**
	 * User Image Pass Through
	 */
	userImageEventEmitterHandler(event) {
		this.personalDetailsEventEmitter.emit(event);

	}
	/**
	* Method to sign out of profile, will bubble up to event handler in container
	*/
	onSignOutProfile(event) {
		event.stopPropagation();

		const action = {
			action: UserPersonalDetailsActions.onSignOutProfile,
		} as UserPersonalDetailsEmitterInterface;

		this.personalDetailsEventEmitter.emit(action);
	}
}
