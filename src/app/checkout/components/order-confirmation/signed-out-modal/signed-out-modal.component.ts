import {
	Component,
	Input,
	OnInit,
	ViewChild
} from '@angular/core';
import { Router } from '@angular/router';

/**
* Product configuration page component
*/
@Component({
	selector: 'app-signed-out-modal',
	templateUrl: './signed-out-modal.component.html',
	styleUrls: ['./signed-out-modal.component.scss'],
})

/**
* Subscribe on store events and dispatch users event
*/
export class SignedOutModalComponent {
	@ViewChild('signedOutVerticalModal', { static: true }) signedOutVerticalModalRef;
	@Input() set openOnLoad (open: boolean) {
		if (open) {
			this.open()
		}
	};
	constructor(
		private router: Router
	) { }
	/**
	 * Proxy event to vertical modal to open it
	*/
	open() {
		this.signedOutVerticalModalRef.openModal()
	}

	/**
	 * Proxy event to vertical modal to close it
	*/
	close() {
		this.signedOutVerticalModalRef.closeModal()
	}

	/**
	 * Handle user sign up click
	 */
	createAccount() {
		this.router.navigate(['/user/sign-up'])
		const body = document.getElementsByTagName('body')[0];
        body.classList.remove('body-vertical-modal-open');

	}

}
