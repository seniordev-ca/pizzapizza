// Angular core
import {
	Component,
	Input,
	Output,
	EventEmitter,
	ViewEncapsulation,
	OnInit,
	OnDestroy,
	Inject,
	PLATFORM_ID
} from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';

// View Models
import { SizePickerTabInterface } from '../product-size-picker/product-size-picker.component';
import { Product } from '../../../models/product';

/**
 * Quick add modal actions enum
 */
enum QuickAddModalActionEnum {
	onCloseClick,
	onProductSizeChange,
	onAddToCartClick
}

/**
 * Quick add event emitter interface
 */
interface QuickAddEventEmitterInterface {
	action: QuickAddModalActionEnum,
	sizeId?: number,
	productId?: string
}

/**
 * Used in:
 * - common/components/products/product-item
 */
@Component({
	selector: 'app-quick-add-modal',
	templateUrl: './quick-add-modal.component.html',
	styleUrls: ['./quick-add-modal.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class QuickAddModalComponent implements OnInit, OnDestroy {
	@Input() configuratorProductInfo: Product;
	@Input() productSizePickerTabsArray: SizePickerTabInterface;
	@Input() isLoading: boolean;
	@Output() quickAddModalEventEmitter: EventEmitter<QuickAddEventEmitterInterface> = new EventEmitter();

	private isRenderedOnServer: boolean;
	constructor(
		@Inject(PLATFORM_ID) platformId
	) {
		this.isRenderedOnServer = isPlatformServer(platformId);
	}

	/**
	* Add to cart handler
	*/
	addToCart(productId) {
		this.quickAddModalEventEmitter.emit({
			action: QuickAddModalActionEnum.onAddToCartClick,
			productId
		})
	}

	/**
	 * Close modal handler
	 */
	closeQuickAddModal() {
		this.quickAddModalEventEmitter.emit({
			action: QuickAddModalActionEnum.onCloseClick
		})
	}

	/**
	 * Product size change hander
	 */
	productSizePickerEventHandler(sizeId) {
		this.quickAddModalEventEmitter.emit({
			action: QuickAddModalActionEnum.onProductSizeChange,
			sizeId
		})
	}

	/**
	 * Life cycle hook to stop main page from scrolling
	 */
	ngOnInit() {
		if (this.isRenderedOnServer) {
			return false;
		}
		const body = document.getElementsByTagName('body')[0];
		body.classList.add('body-cart-modal-is-open');
	}

	/**
	 * Life cycle hook to release main page for scrolling
	 */
	ngOnDestroy() {
		if (this.isRenderedOnServer) {
			return false;
		}
		const body = document.getElementsByTagName('body')[0];
		body.classList.remove('body-cart-modal-is-open');
	}
}

export {
	QuickAddModalActionEnum,
	QuickAddEventEmitterInterface
}
