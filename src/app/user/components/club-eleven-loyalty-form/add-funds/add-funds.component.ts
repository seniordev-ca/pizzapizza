import {
	Component,
	Input
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Club1111AddFundsSettingsUIInterface } from '../../../models/club11';


@Component({
	selector: 'app-add-funds',
	templateUrl: './add-funds.component.html',
	styleUrls: ['./add-funds.component.scss']
})

export class AddFundsComponent {
	@Input() isAutoReload = false;
	@Input() parentForm: FormGroup;
	@Input() settings: Club1111AddFundsSettingsUIInterface;

	constructor() {}
}
