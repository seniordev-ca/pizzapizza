import {
	Component,
	Input
} from '@angular/core';


interface ClubActionsDataInterface {
	fontKey: string,
	title: string,
	subTitle: string,
	isUpComing: boolean
}


@Component({
	selector: 'app-club-eleven-landing-actions',
	templateUrl: './landing-actions.component.html',
	styleUrls: ['./landing-actions.component.scss']
})


class ClubElevenLandingActionsComponent {
	@Input() clubActionsContent: ClubActionsDataInterface;
	@Input() title: string;
	@Input() subTitle: string;

	constructor() {
	}
}

export {
	ClubElevenLandingActionsComponent,
	ClubActionsDataInterface
}
