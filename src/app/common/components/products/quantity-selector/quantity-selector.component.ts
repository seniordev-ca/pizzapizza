import {
	Component,
	Input,
	Output,
	EventEmitter,
	ViewEncapsulation,
} from '@angular/core';
import { OnChanges } from '@angular/core';
import {select, Store} from '@ngrx/store';
import * as fromCatalog from '@pp/app/catalog/reducers';

interface QuantitySelectorInterface {
	maxQuantity: number,
	quantity: number,
	title: string
}

/**
 * Possible components events
 */
enum QuantitySelectorActionsEnum {
	onPlusClick,
	onMinusClick
}

interface QuantitySelectorEmitterInterface {
	action: QuantitySelectorActionsEnum
}

/**
 * User in:
 * - catalog/components/common/product-sub-header
 * - catalog/components/configurator/header
 * - catalog/components/configurator/side-products-details
 * - checkout/components/cart/cart-item
 * - common/component/products/products-items
 */
@Component({
	selector: 'app-quantity-selector',
	templateUrl: './quantity-selector.component.html',
	styleUrls: ['./quantity-selector.component.scss'],
	encapsulation: ViewEncapsulation.None
})

class QuantitySelectorComponent implements OnChanges {
	quantitySelectorContentData: QuantitySelectorInterface = {
		maxQuantity: null,
		quantity: null,
		title: ''
	}
	@Input() set quantitySelectorContent (data: QuantitySelectorInterface) {
		this.quantitySelectorContentData = {
			maxQuantity: data.maxQuantity,
			quantity: data.quantity,
			title: data.title
		}
		this.updateActiveStates()
	}
	@Output() quantitySelectorEventEmitter: EventEmitter<QuantitySelectorEmitterInterface>
		= new EventEmitter<QuantitySelectorEmitterInterface>();

	isMinusActive: boolean;
	isPlusActive: boolean;

	constructor(
		private store: Store<fromCatalog.CatalogState>
	) {
		this.updateActiveStates()
	}

	/**
	 * Indicate if component is ghost
	 */
	ngOnChanges() {
		this.updateActiveStates()
	}

	/**
	* User press plus icon
	*/
	decrementItem() {
		if (this.isMinusActive) {
			this.quantitySelectorEventEmitter.emit({
				action: QuantitySelectorActionsEnum.onMinusClick
			} as QuantitySelectorEmitterInterface)
		}
		this.updateActiveStates()
	}

	/**
	* User press minus icon
	*/
	incrementItem() {
		if (this.isPlusActive) {
			this.quantitySelectorEventEmitter.emit({
				action: QuantitySelectorActionsEnum.onPlusClick
			} as QuantitySelectorEmitterInterface)
		}
		this.updateActiveStates()
	}

	/**
	 * Update UI state based on changed data
	 */
	updateActiveStates() {
		const currentCount = this.quantitySelectorContentData.quantity;
		const maxCount = this.quantitySelectorContentData.maxQuantity;

		if (!currentCount) {
			// Ghost state
			this.isMinusActive = false;
			this.isPlusActive = false;
		} else if (currentCount <= 1) {
			// Minimum
			this.isMinusActive = false;
			this.isPlusActive = true;
		} else if (currentCount > 1 && currentCount < maxCount) {
			// Middle
			this.isMinusActive = true;
			this.isPlusActive = true;
		} else if (currentCount >= maxCount) {
			// Maximum
			this.isMinusActive = true;
			this.isPlusActive = false;
		}
		// Max Qty Reach
		if (maxCount < currentCount) {
			this.isPlusActive = false;
		}
	}
}

export {
	QuantitySelectorComponent,
	QuantitySelectorInterface,
	QuantitySelectorActionsEnum,
	QuantitySelectorEmitterInterface
}
