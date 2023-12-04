import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import { UserSummaryInterface } from '../../../user/models/user-personal-details';
// NG RX core
import { Store, select } from '@ngrx/store';
// Reduce, actions
import * as fromUser from '../../../user/reducers';
// services
import { UpdateDataLayer, RegistrationDataLayer } from '../../../common/actions/tag-manager';
import { DataLayerEventEnum, DataLayerRegistrationEventEnum } from '../../../common/models/datalayer-object';
import { dispatch } from 'rxjs/internal/observable/range';
@Component({
	selector: 'app-login-register',
	templateUrl: './login-register.component.html',
	styleUrls: ['./login-register.component.scss']
})

export class LoginRegisterComponent {
	@Input() userDetails: UserSummaryInterface;
	@Output() menuItemClickEmitter: EventEmitter<boolean> = new EventEmitter();
	constructor(
		private router: Router,
		private userStore: Store<fromUser.UserState>
	) { }

	/**
	 * Handles click on links to get to another page from mobile modal menu
	 */
	menuItemClickHandler() {
		this.menuItemClickEmitter.emit(true);
	}

	/**
	 * Handles click on sign in for tag manager
	 */
	handleCTASignInHeader() {
		this.userStore.dispatch(new UpdateDataLayer(DataLayerEventEnum.SIGNINCTA, 'Header'))
	}

	/**
	 * Handles click on sign up for tag manager
	 */
	handleCTASignUPHeader() {
		this.userStore.dispatch(new RegistrationDataLayer(DataLayerRegistrationEventEnum.REGSTARTED, 'Header'))
	}
}
