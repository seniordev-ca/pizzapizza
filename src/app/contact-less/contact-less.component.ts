import { Component, Input} from '@angular/core';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';


@Component({
	selector: 'app-contact-less',
	templateUrl: './contact-less.component.html',
	styleUrls: ['./contact-less.component.scss']
})
export class ContactLessComponent {

@Input() imageUrl: string;
@Input() imageLink: string;
@Input() label: string;
constructor( public activeModal: NgbActiveModal) {}
	/**
	 *  contact-less Popup
	 */
dismissModal(msg) {
this.activeModal.dismiss(msg)
}

}
