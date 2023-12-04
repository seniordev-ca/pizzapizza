import {
	Component,
	Input,
	ViewEncapsulation,
	ContentChild,
	TemplateRef,
	ViewContainerRef
} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalDataInterface } from '../confirmation-modal/confirmation-modal.component'

@Component({
	selector: 'app-prompt-modal',
	templateUrl: './prompt-modal.component.html',
	styleUrls: ['./prompt-modal.component.scss'],
	encapsulation: ViewEncapsulation.None
})

class PromptModalComponent {
	@Input() data: ModalDataInterface = {
		icon: null,
	};
	@Input() title: string;
	@Input() text: string;
	@ContentChild(TemplateRef, /* TODO: add static flag */ { static: false }) childrenTemplate: TemplateRef<ViewContainerRef>;
	modalReference;
	/**
	* Initiate rules for form validation
	*/
	constructor(
		public modalService: NgbModal
	) {}

	/**
	* Close the modal
	*/
	onCancel() {
		this.modalReference.close(true);
	}

	/**
	 * Open Method that is used on external components. See Sign In Container for an example
	 */
	onOpen(content) {
		// open the modal
		this.modalReference = this.modalService.open(content, {
			windowClass: 'prompt-modal', keyboard: true
		});
	}
}

export {
	PromptModalComponent
}
