// Angular core
import {
	Component,
	Input,
	Output,
	EventEmitter,
	OnInit,
	OnChanges,
	ViewChild,
	SimpleChanges,
	ChangeDetectorRef,
	ViewEncapsulation
} from '@angular/core';

// Sub components interfaces
import {
	Product
} from '../../../models/product';

// 3th party libs
import {
	SwiperDirective,
	SwiperConfigInterface
} from 'ngx-swiper-wrapper';

// Product image slider interface
interface ConfigurableProductsSliderInterface {
	productId: string,
	productLineId: number,
	productImageUrl: string,
	ingredients: Array<{
		image: string,
		id: string,
		zIndex: string
	}>
}

/**
 * Defines actions which could happen in header
 */
enum headerActionsEnum {
	openNewItemModal,
	addToCart,
	sliderProductChange,
	editItem
}

interface ConfiguratorHeaderEmitterInterface {
	action: headerActionsEnum,
	productId?: string,
	lineId?: number,
	slideIndex: number
}

/**
* Item configuration header
*/
@Component({
	selector: 'app-configurator-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss'],
	providers: [],
	encapsulation: ViewEncapsulation.None
})

/**
* Receive props and emit events to root element
*/
class ConfiguratorHeaderComponent implements OnInit, OnChanges {
	// Style Conditionals
	@Input() isHeaderStrippedVersion: boolean;
	@Input() isProductEditMode: boolean;

	// Content for configurator header
	@Input() configuratorProductInfo: Product;
	@Input() configuratorProductsSlider: Array<ConfigurableProductsSliderInterface>;
	@Output() configuratorHeaderEventEmitter: EventEmitter<ConfiguratorHeaderEmitterInterface> = new EventEmitter()


	isSliderScrollActive: boolean;

	// Swiper config and reference for controlling
	private productImageSwiperConfig: SwiperConfigInterface;

	minWidth: string;
	@ViewChild(SwiperDirective, { static: false }) sliderDirectiveRef: SwiperDirective;

	// Swiper custom pagination
	currentSliderIndex = 0;
	totalSliderCount: number;
	isIndexChangeSilent: boolean;
	// paginationRenderArray: Array<{
	// 	index: number,
	// 	isSelected: boolean
	// }> = []

	/**
	 * Constructor
	 */
	constructor(private changeDetectionRef: ChangeDetectorRef) {
		// changeDetectionRef provides access for forcing view rendering.
		// Required for slider touch start event handler.
	}

	/**
	 * Component constructor
	 */
	ngOnInit() {
		this.isSliderScrollActive = false;
	}

	/**
	 * On input change handler
	 */
	ngOnChanges(changes: SimpleChanges) {
		if (changes.configuratorProductInfo) {
			const change = changes.configuratorProductInfo.currentValue as Product;
			const slideIndex = change.lineId - 1;
			if (this.sliderDirectiveRef) {
				this.isIndexChangeSilent = true;
				this.sliderDirectiveRef.setIndex(slideIndex);
			} else {
				this.currentSliderIndex = slideIndex ? slideIndex : 0;
			}
		}
		if (changes.configuratorProductsSlider) {
			if (changes.configuratorProductsSlider.currentValue.length >= 1) {
				// TODO DOM needs to established after ghost state
				this._applySwiperConfig(changes.configuratorProductsSlider.currentValue.length);

			}
		}
	}

	/**
	 * Apply config to swiper slider
	 */
	private _applySwiperConfig(length) {
		const count = length > 1 ? 3 : 1;
		// TODO Swiper config
		// http://idangero.us/swiper/api/
		this.productImageSwiperConfig = {
			direction: 'horizontal',
			centeredSlides: true,
			slidesPerView: count,
			slideToClickedSlide: true,
			initialSlide: this.currentSliderIndex
			// onlyExternal: length === 1
		}
		// Change this to something dynamic if need be
		this.minWidth = 100 / count + '%';
		// this.productImageSwiperConfig.onTouchMove = null;
	}


	/**
	 * Handler for slide gesture start
	 */
	onTouchStart() {
		this.isIndexChangeSilent = false;
		this.isSliderScrollActive = true;
		this.changeDetectionRef.detectChanges();
	}

	/**
	 * Handler for slide gesture end
	 */
	onTouchEnd() {
		this.isSliderScrollActive = false;
		this.changeDetectionRef.detectChanges();
	}

	/**
	 * Handler for custom pagination click
	 */
	onCustomPageClick(pageIndex) {
		this.isIndexChangeSilent = false;

		this.currentSliderIndex = pageIndex;
		this.sliderDirectiveRef.setIndex(pageIndex);
	}

	/**
	 * Used for virtual DOM rendering change detection
	 */
	trackIngByFn(index, item) {
		return item.zIndex;
	}

	/**
	 * Swiper doesn't support pagination out of slider DOM.
	 * Thats why code has custom view model for pagination
	 */
	onIndexChange(currentIndex) {
		// Update view model for pagination
		this.currentSliderIndex = currentIndex;
		// Take current combo option in slider
		const currentTwinOption = this.configuratorProductsSlider[currentIndex]

		if (!this.isIndexChangeSilent) {
			// // Emit event
			this.configuratorHeaderEventEmitter.emit({
				action: headerActionsEnum.sliderProductChange,
				lineId: currentTwinOption.productLineId,
				slideIndex: currentIndex
			})
			this.isIndexChangeSilent = false;
		}
	}

}

export {
	ConfiguratorHeaderComponent,
	ConfigurableProductsSliderInterface,
	headerActionsEnum
}
