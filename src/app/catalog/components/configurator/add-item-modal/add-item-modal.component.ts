import {
	Component,
	Input,
	Output,
	EventEmitter,
	ViewEncapsulation,
	ViewChild,
	ElementRef
} from '@angular/core';

interface NewItemCategorieInterface {
	groupName: string,
	groupMenu: Array<{
		id: number,
		title: string,
		setTitle: string,
	}>
}

/**
 * Add modal events
 */
enum NewItemModalActionsEnum {
	onCloseClick,
	onMenuClick
}

interface NewItemModalEventEmitterInterface {
	action: NewItemModalActionsEnum,
	menuId: number,
	menuSeoTitle: string
}

/**
* Item configuration header
*/
@Component({
	selector: 'app-add-item-modal',
	templateUrl: './add-item-modal.component.html',
	styleUrls: ['./add-item-modal.component.scss'],
	providers: [],
	encapsulation: ViewEncapsulation.None
})

/**
* Receive props and emit events to root element
*/
class AddItemModalComponent {
	@Input() isLoading: boolean;
	@Output() addItemEventEmitter: EventEmitter<NewItemModalEventEmitterInterface>
		= new EventEmitter<NewItemModalEventEmitterInterface>()
	@Input() addItemContent: NewItemCategorieInterface[];
	@ViewChild('closeBtnOnModal', { static: true }) myCloseBtnOnModal: ElementRef;

	/**
	 * Handler for loop in modal for accessibility
	 */
	onFocusLastGuard() {
		this.myCloseBtnOnModal.nativeElement.focus();
	}

	/**
	 * Handler for close item modal
	 */
	closeItemModal(event) {
		this.addItemEventEmitter.emit({
			action: NewItemModalActionsEnum.onCloseClick,
		} as NewItemModalEventEmitterInterface);
	}

	/**
	 * Handler for menu click
	 */
	onMenuClick(event, menuId, menuSeoTitle) {
		this.addItemEventEmitter.emit({
			action: NewItemModalActionsEnum.onMenuClick,
			menuId,
			menuSeoTitle
		} as NewItemModalEventEmitterInterface);
	}



}

export {
	AddItemModalComponent,
	NewItemCategorieInterface,
	NewItemModalActionsEnum,
	NewItemModalEventEmitterInterface
}
