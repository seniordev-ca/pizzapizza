import { Component, ViewEncapsulation } from '@angular/core';

import * as modelsUserDetails from '../../models/user-personal-details';

// NG RX core
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

// Reduce, actions
import * as fromUser from '../../reducers';

// services
import { UpdateDataLayer, RegistrationDataLayer } from '../../../common/actions/tag-manager';
import { DataLayerEventEnum, DataLayerRegistrationEventEnum } from '../../../common/models/datalayer-object';


@Component({
	selector: 'app-club-eleven-landing',
	templateUrl: './club-eleven-landing.component.html',
	styleUrls: ['./club-eleven-landing.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class ClubElevenLandingComponent {
	userSummary$: Observable<modelsUserDetails.UserSummaryInterface>

	constructor(
		private userStore: Store<fromUser.UserState>
	) {
		// Integrated content
		this.userSummary$ = this.userStore.pipe(select(fromUser.getLoggedInUser));
	}

	/**
	 * needed for tag manager
	*/
	handleSignInCTAcLick() {
		this.userStore.dispatch(new UpdateDataLayer(DataLayerEventEnum.SIGNINCTA, 'Club 11-11'))
	}
	/**
	 *  tag manager Register Buttons
	*/
	handleSignUPCTAcLick() {
		this.userStore.dispatch(new RegistrationDataLayer(DataLayerRegistrationEventEnum.REGSTARTED, 'Club 11-11') )
	}

}
