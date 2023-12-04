import { Component, ViewChild, AfterViewInit, ChangeDetectorRef, Input, ViewEncapsulation, OnDestroy } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { Product } from '../../../../catalog/models/product';

@Component({
	selector: 'app-cart-modal',
	templateUrl: './cart-modal.component.html',
	styleUrls: ['./cart-modal.component.scss'],
	encapsulation: ViewEncapsulation.None
})

export class CartModalComponent implements AfterViewInit {
	windowHeight = window ? window.outerHeight : 768;
	buttonHeight = 0;
	addCartItemsChangeSubscriptionRef;
	@Input() items: Array<Product>;
	@Input() price: number;
	@Input() expanded: boolean;

	@ViewChild('button', { static: false }) button;

	constructor(public activeModal: NgbActiveModal, private changeRef: ChangeDetectorRef) { }
	/**
	 * Toggle log in / log out for demo purposes
	 */
	toggleItems() {
		// this.service.toggleAddCartItems();
	}

	/**
	 * Dynamic cart hight picker for mobile screen
	 */
	ngAfterViewInit() {
		this.buttonHeight = this.button.nativeElement.getClientRects()[0].height;
		this.changeRef.detectChanges();
	}
}
