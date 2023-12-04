import {
	Component,
	ViewChild,
	Input,
	Output,
	EventEmitter,
	ViewEncapsulation
} from '@angular/core';
import { Router } from '@angular/router';

import {
	SwiperDirective,
	SwiperConfigInterface
} from 'ngx-swiper-wrapper';
import { Store } from '@ngrx/store';

import { SliderInterface } from '../../models/featured-slider';
import { CommonObjectUpdateData } from 'app/common/actions/tag-manager';
import * as fromReducers from '../../reducers';

class CatalogGhostLoader {

	/**
	 * Generate ghost data for home slider
	 * TODO check if typescript could generate empty object from the interface
	 */
	static getFeaturedSliderGhostData() {
		const slides: Array<SliderInterface> = [];
		// push empty object type of interface
		slides.push(<SliderInterface>{
			allergens: null,
			allow_add_to_cart: null,
			allow_customization: null,
			allow_qty_selection: null,
			allow_quick_add: null,
			cal_text: null,
			description: null,
			product_id: null,
			image: null,
			legal: null,
			marketing_badge: {
				color: null,
				font_key: null,
				text: null
			},
			name: null,
			price_text: {
				price_value: null,
				labels: null
			},
			seo_title: null,
			sequence: null,
			subTitle: null,
			style: null
		});
		return slides;
	}
}

/**
 * Component actions
 */
enum FeaturedSliderActions {
	retryClick
}

@Component({
	selector: 'app-featured-products',
	templateUrl: './featured-products.component.html',
	styleUrls: ['./featured-products.component.scss'],
	encapsulation: ViewEncapsulation.None
})
class FeaturedProductsComponent {
	slidesArray: Array<SliderInterface>
	@Input() set slides(slidesArray: Array<SliderInterface>) {
		this.slidesArray = slidesArray;
		this.slidesArray.sort((a, b) => (a.sequence > b.sequence) ? 1 : -1);
		this.config.loop = false;
		this.config.loopedSlides = slidesArray.length;
	};
	@Input() featuredCategory;

	@Input()
	set loading(loading: boolean) {
		this.isLoading = loading;
		// Ghost state needs DOM so generate it
		if (loading) {
			this.slides = CatalogGhostLoader.getFeaturedSliderGhostData();
		}
	}
	@Input()
	set error(error: boolean) {
		this.isError = error;
	}
	@Output() sliderEventEmitter: EventEmitter<FeaturedSliderActions> = new EventEmitter();

	public isLoading: boolean;
	public isError: boolean;
	public isFirstFocus: boolean;
	legalPopOverId: number;

	@ViewChild(SwiperDirective, { static: false }) directiveRef: SwiperDirective;
	// TODO Swiper config
	public config: SwiperConfigInterface = {
		direction: 'horizontal',
		navigation: {
			nextEl: '.swiper-button-next',
			prevEl: '.swiper-button-prev',
		},

		pagination: {
			clickable: true,
			el: '.swiper-pagination'
		},
		a11y: {
			prevSlideMessage: 'Previous Featured Special',
			nextSlideMessage: 'Next Featured Special',
		},
		autoplay: {
			delay: 4000,
			/* required for screen reader accessibility */
			disableOnInteraction: true,
		},
		shortSwipes: false
	};
	constructor(private router: Router,
		private store: Store<fromReducers.State>) { }

	/**
	 * Data fetch retry button handler
	 */
	onRetryClick() {
		this.sliderEventEmitter.emit(FeaturedSliderActions.retryClick);
	}

	/**
	 * show the legal disclaimer on click
	 */
	showLegalPopOver(slideId) {
		this.legalPopOverId === slideId ? this.legalPopOverId = null : this.legalPopOverId = slideId;
	}

	/**
	 * Handle btn click
	 */
	sliderOrderNowPath(slide) {

		const productSlug = slide.seo_title;
		if (slide.kind === 'featured_category') {
			return `/catalog/products/${productSlug}`;
		}
		if (slide.kind === 'combo') {
			return `/catalog/product-combo/${productSlug}`;
		} else {
			return `/catalog/config/${productSlug}`;
		}
	}

	/**
	 * Get the first word
	 */
	getFirstWord(words: string) {
		return words.replace(/ .*/, '');
	}
	/**
	 * Get the remaining words
	 */
	getRemainingString(words: string) {
		const wordArray = words.split(' ');
		wordArray.splice(0, 1);
		return wordArray.join(' ');
	}
	/**
	 * handle Tag Analytics Clicks fpr slider
	 */
	handleTagAnalytics(slide) {
		const data = {
			event: 'productClick',
			ecommerce: {
				click: {
					actionField: {
						list: 'Featured/Specials Carousel'
					},
					products: [{
						name: slide.name,
						id: `${slide.product_id}`,
						brand: slide.isAddableToCartWithoutCustomization ? 'default' : 'customized',
						category: 'undefined',
						position: slide.sequence ? slide.sequence : 'undefined'
					}]
				}
			}
		}
		this.store.dispatch(new CommonObjectUpdateData(data));
	}

	/**
	 * handle focus of Order Now button, stop slider from auto playing
	 */
	handleButtonFocus() {
		this.directiveRef.stopAutoplay();

		if (!this.isFirstFocus) {
			this.isFirstFocus = true;
			this.directiveRef.swiper().wrapperEl.querySelector('div.swiper-slide:first-child button').focus();
			this.directiveRef.setIndex(0);
		}
	}
}

export {
	SliderInterface,
	FeaturedProductsComponent
}
