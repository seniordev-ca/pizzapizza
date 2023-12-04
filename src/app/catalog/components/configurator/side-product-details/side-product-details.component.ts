// Angular core
import {
	Component,
	Input,
	Output,
	EventEmitter,
	OnInit,
	ViewEncapsulation
} from '@angular/core';

// View models
import { SizePickerTabInterface } from '../../common/product-size-picker/product-size-picker.component'
import {
	QuantitySelectorInterface,
	QuantitySelectorEmitterInterface
} from '../../../../common/components/products/quantity-selector/quantity-selector.component'
import { Product } from '../../../models/product';
import { HalfHalfOptionsEnum } from '../options-list/options-list.component'
import {
	ConfigurationUiInterface
} from '../../../containers/configurator/configurator-container.component'
import {
	AddBtnEmitterInterface
} from '../../common/add-product-btn/add-product-btn.component'
import {OptionSummary} from '@pp/app/catalog/models/configurator';
/*
import {
	ConfiguratorHeaderInterface,
	addToCartBtnEnums
} from '../header/header.component'
*/
/**
* Item configuration header
*/
@Component({
	selector: 'app-side-product-details',
	templateUrl: './side-product-details.component.html',
	styleUrls: ['./side-product-details.component.scss'],
	providers: [],
	encapsulation: ViewEncapsulation.None
})

export class SideProductDetailsComponent implements OnInit {

	// Product configuration
	@Input() configuratorProductInfo: Product;
	@Output() sideMenuEventEmitter: EventEmitter<AddBtnEmitterInterface>
		= new EventEmitter<AddBtnEmitterInterface>()

	// Product size
	@Input() productSizePickerTabsArray: Array<SizePickerTabInterface>;
	@Output() productSizePickerTabClickEmitter: EventEmitter<number> = new EventEmitter();

	// Product quantity
	@Input() quantitySelectorContent: QuantitySelectorInterface;
	@Output() quantitySelectorEventEmitter: EventEmitter<QuantitySelectorEmitterInterface>
		= new EventEmitter<QuantitySelectorEmitterInterface>();

	@Input() configurationUi: ConfigurationUiInterface;
	@Input() isCombo: boolean;
	@Input() isValid: boolean;


	// Make enums available on view model
	// addToCartBtnEnums = addToCartBtnEnums
	HalfHalfOptionsEnum = HalfHalfOptionsEnum

	/**
	 * Component constructor
	 */
	ngOnInit() {

	}

	/**
	 * Used for virtual DOM rendering change detection
	 */
	trackIngByFn(index, item) {
		return item.zIndex;
	}

	/**
	 * Handler for add to cart button
	 */
	addToCartHandler(event) {
		// console.log(event)
		this.sideMenuEventEmitter.emit(event)
	}

	/**
	 * Proxy event to parent component
	 */
	quantitySelectorEventHandler(event) {
		this.quantitySelectorEventEmitter.emit(event);
	}

	/**
	 * Proxy event to parent
	 */
	productSizePickerTabClickHandler(productSizeId) {
		this.productSizePickerTabClickEmitter.emit(productSizeId);
	}

	/**
	 * Get aria-label text for Add to Cart Button from subText Array - Side product Detail
	 */
	getAriaLabelTextFromSubText(subText: OptionSummary[] | string) {
		if (!subText) {
			return 'Add To Cart';
		}

		if (typeof subText === 'string') {
			return subText;
		}
		let ariaLabel = 'Add ';
		subText.forEach(value => {
			if (value.quantity > 0) {
				ariaLabel += `${value.quantity} ${value.text} `;
			}
		});
		ariaLabel += 'to cart';
		return ariaLabel;
	}
}
