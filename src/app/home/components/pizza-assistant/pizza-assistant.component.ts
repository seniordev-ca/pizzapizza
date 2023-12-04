import { Component, Input } from '@angular/core';
import { UserSummaryInterface } from '../../../user/models/user-personal-details';
@Component({
	selector: 'app-pizza-assistant',
	templateUrl: './pizza-assistant.component.html',
	styleUrls: ['./pizza-assistant.component.scss']
})

export class PizzaAssistantComponent {
	@Input() userDetails: UserSummaryInterface;

	constructor() {
	}

}
