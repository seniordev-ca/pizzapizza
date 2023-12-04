import {
	Component,
	ViewEncapsulation,
	ViewChild,
	Output,
	EventEmitter,
	Input
} from '@angular/core';

import {
	Product
} from '../../models/product';

import { ProductSubHeaderInterface } from '../../components/common/product-sub-header/product-sub-header.component';
// NgRx
import { Store, select } from '@ngrx/store';
import * as fromCatalog from '../../reducers';
import { Observable } from 'rxjs';
import { addToCartBtnEnum } from '../../models/configurator';
import { AddPizzaAssistantProductsToCart } from '../../../checkout/actions/cart';
import { ProductItemEmitterInterface } from '../../components/common/product-item/product-item.component';
interface VerticalModalOutputEmitterInterface {
	isClose: boolean
}
@Component({
	selector: 'app-pizza-assistant-order-modal-container',
	templateUrl: './pizza-assistant-order-modal.html',
	styleUrls: ['./pizza-assistant-order-modal.scss'],
	encapsulation: ViewEncapsulation.None
})


export class PizzaAssistantOrderModalContainerComponent {
	@Input() isVerticalModalOpen: boolean;
	@ViewChild('configuratorVerticalModal', { static: true }) configuratorVerticalModalRef;
	@ViewChild('verticalModalConfigurator', { static: false }) verticalModalConfigurator;
	@Output() verticalModalComponentOutputEmitter: EventEmitter<VerticalModalOutputEmitterInterface>
		= new EventEmitter<VerticalModalOutputEmitterInterface>();
	@Output() verticalModalOutputEmitter: EventEmitter<VerticalModalOutputEmitterInterface>
	= new EventEmitter<VerticalModalOutputEmitterInterface>();

	@Output() productItemEventEmitter: EventEmitter<ProductItemEmitterInterface>
	= new EventEmitter<ProductItemEmitterInterface>();

	assistantProducts$: Observable<Product[]>;
	assistantOrderDescription$: Observable<ProductSubHeaderInterface>;
	btnState: addToCartBtnEnum = addToCartBtnEnum.active;

	constructor(
		private store: Store<fromCatalog.CatalogState>,
		) {
			this.assistantProducts$ = this.store.pipe(select(fromCatalog.getPizzaAssistantProducts))
		this.assistantOrderDescription$ = this.store.pipe(select(fromCatalog.getPizzaAssistantOrderDetails));
	}
	/**
	 * Public method for opening configuration modal
	*/
	open() {
		this.btnState = addToCartBtnEnum.active;
		this.configuratorVerticalModalRef.openModal();
		this.verticalModalComponentOutputEmitter.emit({
			isClose: false
		})
	}

	/**
	 * Public method for closing configuration modal
	 */
	close() {
		this.configuratorVerticalModalRef.closeModal();
		this.verticalModalComponentOutputEmitter.emit({
			isClose: true
		})
	}


		/**
	 * When Vertical Pizza Assistant Modal is closed via 'X'
	 */
	handleCloseModalClick(event) {

		this.verticalModalComponentOutputEmitter.emit({
			isClose: event.isClose
		})
	}

			/**
	 * When Vertical Pizza Assistant Modal is closed via 'X'
	 */
		handleCloseSimpleModalClick(event) {
				this.verticalModalOutputEmitter.emit({
					isClose: event.isClose
				})
}

	/**
	 * Handler for the product combo
	 */
	handleOnClickEventEmitter(event) {
		switch (this.btnState) {
			case (addToCartBtnEnum.active): {
				this.btnState = addToCartBtnEnum.loading;
				this.store.dispatch(new AddPizzaAssistantProductsToCart());
				this.close();
				break
			}
			default: {
				console.warn(this.btnState, 'Btn State Incorrect')
			}
		}
	}


	/**
	 * Handler for the product list
	 */
	productListEventHandler(event: ProductItemEmitterInterface) {
		this.productItemEventEmitter.emit(event);
	}
}
