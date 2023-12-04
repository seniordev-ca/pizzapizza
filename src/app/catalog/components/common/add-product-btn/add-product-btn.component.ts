// Angular core
import {
	Component,
	Input,
	Output,
	EventEmitter,
	ViewEncapsulation
} from '@angular/core';

// Models
import { addToCartBtnEnum } from '../../../models/configurator';

export interface AddBtnEmitterInterface {
	action: string
}
@Component({
	selector: 'app-add-product-btn',
	templateUrl: './add-product-btn.component.html',
	styleUrls: ['./add-product-btn.component.scss'],
	encapsulation: ViewEncapsulation.None
})

export class ProductAddBtnComponent {
	addToCartBtnEnum = addToCartBtnEnum;

	@Input() btnState: addToCartBtnEnum;
	@Input() btnAriaLabel: string;
	@Input() isInValid: boolean;
	@Input() isVerticalModalOpen: boolean;
	@Output() onClickEventEmitter: EventEmitter<AddBtnEmitterInterface>
		= new EventEmitter<AddBtnEmitterInterface>();

	constructor() {
	}
	/**
	 * Add to Cart Pass Through
	 */
	addToCartHandler() {
		this.onClickEventEmitter.emit({
			action: 'addToCartClick'
		})
	}
}

