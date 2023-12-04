import {
	Component,
	Input,
	Output,
	EventEmitter,
	ViewEncapsulation
} from '@angular/core';


interface SizePickerTabInterface {
	id: number,
	title: string,
	subTitle: string,
	fontKey: string,
	isSelected: boolean,
	maxToppingQuantity: number
}

/**
 * Used at:
 * - catalog/component/configurator/header
 * - catalog/component/configurator/side-product-details
 * - common/component/products/quick-add-modal
 */
@Component({
	selector: 'app-product-size-picker',
	templateUrl: './product-size-picker.component.html',
	styleUrls: ['./product-size-picker.component.scss'],
	providers: [],
	encapsulation: ViewEncapsulation.None
})

export class ProductSizePickerComponent {
	@Input() productSizePickerTabsArray: Array<SizePickerTabInterface>
	@Output() productSizePickerTabClickEmitter: EventEmitter<number> = new EventEmitter();

	/**
	 * Handler for product size tab click
	 */
	productSizePickerTabClick(productSizeId) {
		this.productSizePickerTabClickEmitter.emit(productSizeId);
	}
}

export {
	SizePickerTabInterface
}
