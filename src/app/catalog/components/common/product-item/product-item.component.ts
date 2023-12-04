import {
	Component,
	Input,
	Output,
	EventEmitter,
	ViewEncapsulation,
	ContentChild,
	TemplateRef,
	ViewContainerRef,
	ViewChild,
	ElementRef
} from '@angular/core';
import {
	QuantitySelectorInterface,
	QuantitySelectorActionsEnum
} from '../../../../common/components/products/quantity-selector/quantity-selector.component'

import {
	Product
} from '../../../models/product';
import { CommonObjectUpdateData } from 'app/common/actions/tag-manager';
import { Store } from '@ngrx/store';
import * as fromReducers from '../../../reducers';
import { ProductListEffects } from 'app/catalog/effects/product-list';
/**
* Product list actions enum
*/
enum ProductItemActionsEnum {
	onAddToCartClick,
	onQuickAddButtonClick,
	onCustomizeButtonClick,
	onProductQuantityChange
}

/**
* Product list event emitter interface
*/
interface ProductItemEmitterInterface {
	action: ProductItemActionsEnum,
	name?: string,
	isAddableToCartWithoutCustomization?: boolean,
	sequence?: number,
	pizzaAssistantLabel?: string,
	productId: string,
	quantity?: number,
	isCombo?: boolean,
	productSlug?: string,
	lineId?: number,
	isValid?: boolean,
	pizzaID?: string,
	isConfigOption?: boolean
	isSelected?: boolean
}

/**
 * Used at:
 * - catalog/component/product-combo/product-combo-items
 * - catalog/containers/products-category
 */
@Component({
	selector: 'app-product-item',
	templateUrl: './product-item.component.html',
	styleUrls: ['./product-item.component.scss'],
	encapsulation: ViewEncapsulation.None
})

class ProductItemComponent {
	@ContentChild(TemplateRef, /* TODO: add static flag */ { static: false }) quickAddModalTemplate: TemplateRef<ViewContainerRef>;
	@ViewChild('focusOnModalItems', { static: true }) myFocusOnModalItems: ElementRef;
	@Input() isVerticalModalOpen: boolean;
	isQuickAddFormOpened: boolean;
	isProductWithTwoButtons: boolean;
	productItem: Product;
	productURL: string;
	quantitySelectorContent: QuantitySelectorInterface;

	@Input() isComboItem: boolean;
	@Input() isQuickAddButtonLoading: boolean;

	@Input() set productItemInput(product: Product) {
		this.productItem = product;
		if (product.isComboProduct) {
			this.productURL = `/catalog/product-combo/${product.seoTitle}`;
		} else {
			const slug = product.pizzaId ? `/catalog/my-pizzas/${product.seoTitle}/${product.pizzaId}` : `/catalog/config/${product.seoTitle}`;
			this.productURL = slug;
		}
		this.quantitySelectorContent = {
			maxQuantity: this.productItem.isMaxReached ? -1 : 100, // TODO: I'd assume the server should send us max quanity per item ?
			quantity: this.productItem.quantity ? this.productItem.quantity : 1,
			title: this.productItem.name
		} as QuantitySelectorInterface;
		this.isProductHaveTwoButtons()
	};
	@Output() productItemEventEmitter: EventEmitter<ProductItemEmitterInterface>
		= new EventEmitter<ProductItemEmitterInterface>();

	ProductItemActionsEnum = ProductItemActionsEnum;

	constructor(private store: Store<fromReducers.CatalogState>) { }

	/**
	* Event Handler for the app quantity selector component
	*/
	quantitySelectorEventHandler(event) {
		if (event.action === QuantitySelectorActionsEnum.onPlusClick) {
			this.quantitySelectorContent.quantity++;
		}

		if (event.action === QuantitySelectorActionsEnum.onMinusClick) {
			if (this.quantitySelectorContent.quantity > 1) {
				this.quantitySelectorContent.quantity--;
			}
		}
		this.productItemEventEmitter.emit({
			action: ProductItemActionsEnum.onProductQuantityChange,
			productId: this.productItem.id,
			quantity: this.quantitySelectorContent.quantity,
			isConfigOption: this.productItem.isConfigOption
		})
	}
	/**
	 * Handles the button click via a switch instead of multiple methods
	 */
	onButtonClick(product: Product, action: ProductItemActionsEnum) {
		if (action === ProductItemActionsEnum.onAddToCartClick) {
			this.quantitySelectorContent.quantity = 1;

		}
		this.productItemEventEmitter.emit({
			action: action,
			name: product.name,
			productId: product.id,
			isAddableToCartWithoutCustomization: product.isAddableToCartWithoutCustomization,
			pizzaAssistantLabel: product.pizzaAssistantLabel,
			sequence: product.sequence,
			isCombo: product.isComboProduct,
			productSlug: product.seoTitle,
			lineId: product.lineId,
			pizzaID: product.pizzaId,
			isValid: product.isMaxReached && !product.isSelected ? false : true,
			isConfigOption: product.isConfigOption,
			isSelected: product.isSelected
		} as ProductItemEmitterInterface);

	}

	/**
	 * Determine if Product has two buttons
	 */
	isProductHaveTwoButtons() {
		const buttons = [
			this.productItem.isQuickAddAllowed,
			this.productItem.isAddableToCartWithoutCustomization,
			this.productItem.isCustomizationAllowed,
			// this.productItem.isQuantityIncrementerDisplayed
		];
		this.isProductWithTwoButtons = buttons.filter(button => button).length > 1;
	}
}

export {
	ProductItemComponent,
	ProductItemEmitterInterface,
	ProductItemActionsEnum
}
