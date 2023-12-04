import {
	Component,
	Input,
	Output,
	EventEmitter
} from '@angular/core';

import {
	RegisteredKidsClubEmitterInterface,
	RegisteredKidsClubActionsEnum
} from '../../../models/registered-kids-club';


@Component({
	selector: 'app-kids-club',
	templateUrl: './kids-club.component.html',
	styleUrls: ['./kids-club.component.scss'],
})


export class KidsClubComponent {
	@Output() userKidsClubEventEmitter: EventEmitter<RegisteredKidsClubEmitterInterface> =
	new EventEmitter<RegisteredKidsClubEmitterInterface>();

	@Input() isRegisterButtonLoading: boolean;

	constructor() {}

	/**
	* Click event for the payment methods edit button, which emits the event up to parent containers along with the payment method id
	*/
	onRegisterAccount(event) {
		event.stopPropagation();

		this.userKidsClubEventEmitter.emit({
			action: RegisteredKidsClubActionsEnum.onAddChild
		} as RegisteredKidsClubEmitterInterface
		);
	}
}
