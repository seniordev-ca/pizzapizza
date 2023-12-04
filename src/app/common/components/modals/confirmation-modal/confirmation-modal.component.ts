// Angular Core
import {
	Component,
	Input,
	ViewEncapsulation,
	ContentChild,
	TemplateRef,
	ViewContainerRef,
	OnInit,
	OnDestroy,
	Inject,
	PLATFORM_ID,
	ChangeDetectorRef
} from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';

import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

interface ModalDataInterface {
	icon: string;
	class?: string;
}

@Component({
	selector: 'app-confirmation-modal',
	templateUrl: './confirmation-modal.component.html',
	styleUrls: ['./confirmation-modal.component.scss'],
	encapsulation: ViewEncapsulation.None
})

class ConfirmationModalComponent implements OnInit, OnDestroy {
	@Input() data: ModalDataInterface;
	@ContentChild(TemplateRef, /* TODO: add static flag */ { static: false }) childrenTemplate: TemplateRef<ViewContainerRef>;
	@Input() title: string;
	@Input() subtitle: string;
	@Input() text: string;
	@Input() leftButtonText: string;
	@Input() rightButtonText: string;

	buttonLoad: boolean;
	isModalOpen: boolean;
	private isRenderedOnServer: boolean;

	constructor(
		public activeModal: NgbActiveModal,
		public modalService: NgbModal,
		@Inject(PLATFORM_ID) platformId
	) {
		this.isRenderedOnServer = isPlatformServer(platformId);
		this.buttonLoad = false;
		this.isModalOpen = false;
	}

	/**
	 * When the modal is init we need the body to not be scrollable
	 */
	ngOnInit() {
		if (this.isRenderedOnServer) {
			return false;
		}
		const body = document.getElementsByTagName('body')[0];
		body.classList.add('body-confirmation-modal-open');
	}

	/**
	 * remove the body class on destroy
	 */
	ngOnDestroy() {
		if (this.isRenderedOnServer) {
			return false;
		}
		const body = document.getElementsByTagName('body')[0];
		body.classList.remove('body-confirmation-modal-open');
	}
	/**
	 * Open Method that is used on external components. See Club 1111 Loyalty component for an example
	 */
	onOpen(content, className?: string) {
		// open the modal
		// event.preventDefault();
		this.isModalOpen = true;
		this.activeModal = this.modalService.open(content, {
			windowClass: 'confirmation-modal-container ' + className, keyboard: false, backdrop: 'static'
		});

	}
	/**
	* Confirm click on button
	*/
	onConfirm() {
		this.buttonLoad = true;
		this.buttonLoad = false;
		this.isModalOpen = false;
		this.activeModal.close(true);
	}

	/**
	* Close the modal
	*/
	onCancel() {
		this.isModalOpen = false;
		this.activeModal.close(false);
	}

	/**
	 * returns boolean of open state
	 */
	isOpen() {
		return this.isModalOpen
	}
}

export {
	ModalDataInterface,
	ConfirmationModalComponent
}
