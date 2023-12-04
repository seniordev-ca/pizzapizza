import {
	Component,
	Input,
	Output,
	EventEmitter,
	OnInit,
	ViewEncapsulation
} from '@angular/core';

import {
	QuantitySelectorInterface,
	QuantitySelectorEmitterInterface
} from '../../../../common/components/products/quantity-selector/quantity-selector.component'
import { addToCartBtnEnum } from '../../../models/configurator';
import { AddBtnEmitterInterface } from '../add-product-btn/add-product-btn.component'

export interface ProductSubHeaderInterface {
	itemTitle?: string,
	itemDescription: string,
	itemConfigText?: string

	itemPrice: number | string,
	backgroundImage?: string,
	isComboPage?: boolean,
	itemCount?: number
}

@Component({
	selector: 'app-product-sub-header',
	templateUrl: './product-sub-header.component.html',
	styleUrls: ['./product-sub-header.component.scss'],
	encapsulation: ViewEncapsulation.None
})

export class ProductSubHeaderComponent {
	@Input() quantitySelectorContent: QuantitySelectorInterface;
	@Input() productSubHeaderContent: ProductSubHeaderInterface;
	@Input() btnState: addToCartBtnEnum;
	@Input() isValid: boolean;
	@Input() itemTitle: string;
	@Input() itemDescription: string;
	@Input() itemConfigText: string;
	@Input() isVerticalModalOpen: boolean;

	@Output() onClickEventEmitter: EventEmitter<AddBtnEmitterInterface>
		= new EventEmitter<AddBtnEmitterInterface>();
	@Output() quantitySelectorEventEmitter: EventEmitter<QuantitySelectorEmitterInterface>
		= new EventEmitter<QuantitySelectorEmitterInterface>();

	ghost: boolean;
	quickAddModal: boolean;
	isActive: boolean;

	constructor() {
		this.quickAddModal = false;
		this.isActive = false;
	}

	/**
	* Event Handler for the app quantity selector component
	*/
	quantitySelectorEventHandler(event) {
		this.quantitySelectorEventEmitter.emit(event);
	}
	/**
	 * Add Btn Emitter Pass Through
	 */
	btnClickEventHandler(event) {
		this.onClickEventEmitter.emit(event);
	}

	/**
	* Demo handler
	*/
	onQuickAddButtonClick() {
		this.quickAddModal = true;
	}

	/**
	* Demo handler
	*/
	onActiveClick() {
		alert('clicked');
		this.isActive = true;
	}
}
