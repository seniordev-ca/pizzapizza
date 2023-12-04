import {
	Component,
	Input,
	Output,
	EventEmitter
} from '@angular/core';
import {
	RegisteredKidsClubActionsEnum,
	RegisteredKidsClubEmitterInterface,
	RegisteredKidsClubInterface
} from '../../../models/registered-kids-club';


@Component({
	selector: 'app-registered-kids-club',
	templateUrl: './registered-kids-club.component.html',
	styleUrls: ['./registered-kids-club.component.scss'],
})

export class RegisteredKidsClubComponent {
	@Input() registeredKidsClub: RegisteredKidsClubInterface[];
	@Output() registeredKidsClubEventEmitter: EventEmitter<RegisteredKidsClubEmitterInterface> =
	new EventEmitter<RegisteredKidsClubEmitterInterface>();
	constructor() {}

	/**
	* Click event for the add child method which which emits the child id - Come back to this
	*/
	onAddChild(event) {
		event.stopPropagation();

		this.registeredKidsClubEventEmitter.emit({
			action: RegisteredKidsClubActionsEnum.onAddChild
			} as RegisteredKidsClubEmitterInterface
		);
	}

	/**
	* Click event for the edit child method which emits the user id
	*/
	onEditChild(event, kidsClubUser) {
		event.stopPropagation();

		this.registeredKidsClubEventEmitter.emit({
			action: RegisteredKidsClubActionsEnum.onEditChild,
			kidsClubUser
			} as RegisteredKidsClubEmitterInterface
		);
	}
}
