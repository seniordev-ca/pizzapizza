import { Component, Input, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { CommonObjectUpdateData } from 'app/common/actions/tag-manager';
import { SwiperConfigInterface, SwiperDirective } from 'ngx-swiper-wrapper';
import { Observable } from 'rxjs';
import { Product } from '../../../catalog/models/product';
import { AddBasicProductToCart } from '../../../checkout/actions/cart';
// Reduce, actions
import * as fromReducers from '../../reducers';


@Component({
	selector: 'app-upsells',
	templateUrl: './upsells.component.html',
	styleUrls: ['./upsells.component.scss'],
})
export class UpsellsComponent implements OnDestroy {
	@ViewChild(SwiperDirective, { static: false }) directiveRef: SwiperDirective;
	@Input() parentContainer: string;

	productSlides: Product[];
	public config: SwiperConfigInterface;

	isLoading$: Observable<boolean>;
	recommendedProductsSubscription;

	constructor(
		private store: Store<fromReducers.CommonState>,
		private router: Router
	) {
		this.config = {
			direction: 'horizontal',
			navigation: {
				nextEl: '.swiper-button-next',
				prevEl: '.swiper-button-prev',
			},
			autoplay: false,
			slidesPerView: 'auto',
			// spaceBetween: 10,

			// breakpoints: {
			// 	576: {
			// 		slidesPerView: 'auto'
			// 	},
			// 	992: {
			// 		slidesPerView: 2
			// 	}
			// },
			shortSwipes: false,
		};
		this.recommendedProductsSubscription = this.store
			.pipe(select(fromReducers.getRecommendations))
			.subscribe((products) => {
				if (products) {
					this.productSlides = products;
					// this.config.slidesPerView = this.parentContainer === 'cart' ? 2 : 'auto';
				}
			});
		this.isLoading$ = this.store.pipe(
			select(fromReducers.getRecommendationsLoadingState)
		);
	}

	/**
	 * Unsubscribe
	 */
	ngOnDestroy() {
		if (this.recommendedProductsSubscription) {
			this.recommendedProductsSubscription.unsubscribe();
		}
	}

	/**
	 * Handles the button click via a switch instead of multiple methods
	 */
	onButtonClick(product: Product) {
		// dispatch action with product info for Tag Analytics
		let list = '';
		console.log('parentContainer -------- ', this.parentContainer);
		list =
			this.parentContainer === 'cart'
				? 'You May Also Like - Checkout'
				: 'You May Also Like - Category';
		list =
			this.parentContainer === 'miniModal' ||
				this.parentContainer === 'configurator'
				? 'You May Also Like - Product Details'
				: list;
		list =
			this.parentContainer === 'productCategory'
				? 'You May Also Like - Category'
				: list;

		const data = {
			event: 'productClick',
			ecommerce: {
				click: {
					actionField: {
						list: list,
					},
					products: [
						{
							name: product.name,
							id: `${product.id}`,
							brand: product.isAddableToCartWithoutCustomization
								? 'default'
								: 'customized',
							category: 'undefined',
							position: product.sequence,
						},
					],
				},
			},
		};
		this.store.dispatch(new CommonObjectUpdateData(data));

		if (product.isCustomizationAllowed) {
			const productSlug = product.seoTitle;
			const route = product.isComboProduct
				? '/catalog/product-combo/'
				: '/catalog/config/';
			this.router.navigate([route + productSlug]);

			return false;
		}
		const isRecommendation = true;
		this.store.dispatch(
			new AddBasicProductToCart(product.id, isRecommendation)
		);
		this.directiveRef.update();
	}
	// To detect SPACE or ENTER key press
	// tslint:disable-next-line:completed-docs
	onKeydownEvent(event: KeyboardEvent, product: Product): void {
		if (event.keyCode === 32 || event.keyCode === 13) {
			this.onButtonClick(product);
		}
	}
}
