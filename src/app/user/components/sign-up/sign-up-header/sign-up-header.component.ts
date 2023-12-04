import { Component, Input, ViewEncapsulation } from '@angular/core';
import { Location } from '@angular/common';
import {
	SignUpContainerInterface,
	SignUpContainerStateEnum
} from '../../../containers/sign-up/sign-up-container.component';

/**
* Item configuration page component
*/
@Component({
	selector: 'app-sign-up-header',
	templateUrl: './sign-up-header.component.html',
	styleUrls: ['./sign-up-header.component.scss'],
	encapsulation: ViewEncapsulation.None
})

/**
* Subscribe on store events and dispatch users event
*/
class SignUpHeaderComponent {
	@Input() headerContent: string;
	@Input() signUpContainerData: SignUpContainerInterface;

	SignUpContainerStateEnum = SignUpContainerStateEnum;

	constructor(private location: Location) {
		const signUpStepsData = this.signUpContainerData || {} as SignUpContainerInterface;
	}

	/**
	 * Handler for clicking back button
	 */
	onBackClick() {
		this.location.back();
	}
}

export {
	SignUpHeaderComponent
}
