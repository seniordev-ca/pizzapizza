// Angular core
import {
	Component
} from '@angular/core';
import { Store } from '@ngrx/store';
import { ShowLocationModal } from 'app/common/actions/store';
import * as fromCommon from '../../../reducers';

/**
 * Used in
 */
@Component({
	selector: 'app-in-page-message',
	templateUrl: './in-page-message.component.html',
	styleUrls: ['./in-page-message.component.scss']
})

export class InPageMessageComponent {
	constructor(
		private store: Store<fromCommon.CommonState>,
	) {}

	/**
	 * Open navigation menu modal for locations
	 */
	openLocationModal() {
		this.store.dispatch(new ShowLocationModal(true))
	}
}
