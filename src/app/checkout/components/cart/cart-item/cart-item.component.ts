// Angular core
import {
	Component,
	Input,
	ViewEncapsulation,
	Output,
	EventEmitter,
	OnChanges
} from '@angular/core';

// View interface
import { Product } from '../../../../catalog/models/product';
import {
	QuantitySelectorInterface,
	QuantitySelectorActionsEnum
} from '../../../../common/components/products/quantity-selector/quantity-selector.component';

/**
 * Actions for cart product
 */
enum cartItemAction {
	removeItem,
	editItem,
	increaseQuantity,
	decreaseQuantity
}

interface CartItemEmitterInterface {
	action: cartItemAction,
	cartId?: number,
	cartItem?: Product
}

@Component({
	selector: 'app-cart-item',
	templateUrl: './cart-item.component.html',
	styleUrls: ['./cart-item.component.scss'],
	encapsulation: ViewEncapsulation.None
})
class CartItemComponent implements OnChanges {
	cartItem: Product;
	cartItemRemoved: boolean;
	quantitySelectorContent: QuantitySelectorInterface;

	@Input() isCompact = true;
	@Input() isUpdating: boolean;
	@Input() isFirst: boolean;
	@Input() set cartProduct(product: Product) {
		this.cartItem = product;
		this.quantitySelectorContent = {
			quantity: product.quantity,
			maxQuantity: 1000, // this should come from the server at some point
			title: product.name
		}
	};
	@Output() cartProductEventEmitter: EventEmitter<CartItemEmitterInterface>
		= new EventEmitter<CartItemEmitterInterface>();


	// @Output() quantitySelectorEventEmitter: EventEmitter<QuantitySelectorEmitterInterface>
	// 	= new EventEmitter<QuantitySelectorEmitterInterface>();

	// @Output() orderSummaryDataEventEmitter: EventEmitter<OrderSummaryEmitterInterface>
	// 		= new EventEmitter<OrderSummaryEmitterInterface>();

	// @Input() orderSummaryData: OrderSummaryInterface;
	// @Output() orderSummaryDataEventEmitter: EventEmitter<OrderSummaryEmitterInterface>
	// 		= new EventEmitter<OrderSummaryEmitterInterface>();

	constructor() { }

	/**
	* Event Handler for the app quantity selector component
	*/
	quantitySelectorEventHandler(event, product: Product) {
		// this.quantitySelectorEventEmitter.emit(event);
		if (this.isUpdating) {
			return false;
		}
		const action = event.action;

		this.cartProductEventEmitter.emit({
			action: action === QuantitySelectorActionsEnum.onPlusClick ? cartItemAction.increaseQuantity : cartItemAction.decreaseQuantity,
			cartId: product.cardId
		})
	}

	/**
	* Method to remove item
	*/
	onRemoveItem(event, product: Product) {
		event.stopPropagation();
		this.cartItemRemoved = true;

		this.cartProductEventEmitter.emit({
			action: cartItemAction.removeItem,
			cartId: product.cardId
		})
	}

	/**
	* Method to edit item
	*/
	onEditItem(event, item: Product) {
		event.stopPropagation();

		this.cartProductEventEmitter.emit({
			action: cartItemAction.editItem,
			cartItem: item,
		} as CartItemEmitterInterface
		);
	}

	/**
	* Method to customize item
	*/
	onCustomizeItem(event, id) {
		event.stopPropagation();

		// this.orderSummaryDataEventEmitter.emit({
		// 	action: OrderSummaryActionsEnum.onCustomizeItem,
		// 	id
		// 	} as OrderSummaryEmitterInterface
		// );
	}

	/**
	 * Keep track of changes
	 */
	ngOnChanges() {
		this.quantitySelectorContent = {
			quantity: this.cartItem.quantity,
			maxQuantity: 1000, // this should come from the server at some point
			title: this.cartItem.name
		}
	}
}

export {
	CartItemComponent,
	cartItemAction,
	CartItemEmitterInterface
}
