import {
	Component,
	ViewEncapsulation,
	ContentChild,
	TemplateRef,
	ViewContainerRef,
	Output,
	EventEmitter,
	Inject,
	PLATFORM_ID,
	ViewChild,
	ElementRef
} from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';

interface VerticalModalOutputEmitterInterface {
	isClose: boolean
}

@Component({
	selector: 'app-vertical-modal',
	templateUrl: './vertical-modal.component.html',
	styleUrls: ['./vertical-modal.component.scss'],
	encapsulation: ViewEncapsulation.None
})

/**
* TODO add nav listener to remove body class on back btn click
*/
class VerticalModalComponent {
	@ViewChild('verticalModalWrap', { static: true }) verticalModalWrap: ElementRef;
	@ContentChild(TemplateRef, /* TODO: add static flag */ { static: false }) childrenTemplate: TemplateRef<ViewContainerRef>;

	@Output() verticalModalOutputEmitter: EventEmitter<VerticalModalOutputEmitterInterface>
		= new EventEmitter<VerticalModalOutputEmitterInterface>();
		@Output() verticalModalComponentOutputEmitter: EventEmitter<VerticalModalOutputEmitterInterface>
		= new EventEmitter<VerticalModalOutputEmitterInterface>();
	inModalOpen = false;
	private isRenderedOnServer: boolean;

	constructor(
		@Inject(PLATFORM_ID) platformId
	) {
		this.isRenderedOnServer = isPlatformServer(platformId);
	}


	/**
	 * Internal handler for close modal click
	*/
	onModalCloseBtnClick() {
		this.verticalModalOutputEmitter.emit({
			isClose: true
		})
		this.verticalModalComponentOutputEmitter.emit({
			isClose: true
		})
		this.closeModal();
	}

	/**
	 * Changing view model and adding global class to body for proper scrolling
	 */
	openModal() {
		if (this.isRenderedOnServer) {
			return false;
		}
		this.inModalOpen = true;
		const body = document.getElementsByTagName('body')[0];
		body.classList.add('body-vertical-modal-open');
		this.verticalModalWrap.nativeElement.scrollTop = 0;
		this.verticalModalOutputEmitter.emit({
			isClose: false
		})
		this.verticalModalComponentOutputEmitter.emit({
			isClose: false
		})
	}

	/**
	 * Changing view model and removing global class to body for proper scrolling
	 */
	closeModal() {
		if (this.isRenderedOnServer) {
			return false;
		}

		this.inModalOpen = false;
		const body = document.getElementsByTagName('body')[0];
		body.classList.remove('body-vertical-modal-open');
		this.verticalModalOutputEmitter.emit({
			isClose: true
		})
		this.verticalModalComponentOutputEmitter.emit({
			isClose: true
		})
	}


}

export {
	VerticalModalComponent
}
