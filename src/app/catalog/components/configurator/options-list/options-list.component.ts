// Angular core
import {
	Component,
	OnInit,
	OnDestroy,
	Input,
	Output,
	EventEmitter,
	HostListener,
	ViewChild,
	ElementRef,
	OnChanges,
	ViewEncapsulation,
	Inject,
	PLATFORM_ID
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

// View Models
import { SizePickerTabInterface } from '../../common/product-size-picker/product-size-picker.component'
import {
	QuantitySelectorInterface,
	QuantitySelectorEmitterInterface
} from '../../../../common/components/products/quantity-selector/quantity-selector.component'
import { AddBtnEmitterInterface } from '../../common/add-product-btn/add-product-btn.component'
import { Product } from '../../../models/product';
import {
	OptionTabModeEnum,
	HalfHalfOptionsEnum,
	OptionsDropDown,
	OptionTabsInterface
} from '../../../models/configurator';
import {
	ConfigurationUiInterface
} from '../../../containers/configurator/configurator-container.component'
import { SubCategoryInterface } from '../../common/sub-category-selector/sub-category-selector.component';
import { FormGroup } from '@angular/forms';
import { PersonalizedTemplateUI } from '../../../models/personalized-templates';


/**
 * Defines all action which could happen
 */
enum OptionListActionsEnum {
	optionClick,
	optionQuantityClick,
	optionHalfHalfClick,
	optionDropDownChange,
	resetOptionClick,
}

interface OptionListEmitterInterface {
	action: OptionListActionsEnum,
	optionId?: number,
	halfHalfMode?: HalfHalfOptionsEnum,
	quantity?: number,
	dropDownValue?: string,
	isValid?: boolean
}


class OptionListGhostLoader {




	/**
	 * Ghost data for options list
	 */
	static getOptionList() {
		const optionsList: Array<OptionTabsInterface> = [];
		const GHOST_OPTIONS_COUNT = 12;

		for (let i = 0; i !== GHOST_OPTIONS_COUNT; i++) {
			optionsList.push({
				id: null,
				parentId: null,
				name: null,
				productImage: null,
				ingredientsOverlayImage: null,
				calText: null,
				quantity: null,
				tag: null,
				halfHalfOption: null,
				optionMode: null,
				selected: null,
				isVisible: true,
				isAvailableForProduct: true,
				allowMultiSelect: null,
				optionDropDown: null,
				serverCopy: null,
				isPremium: false,
				isDipOnWings: false,
				isGluten: false,
				isMediumOnly: false,
				isSmallOnly: false,
				zIndex: null
			})
		}
		return optionsList;
	}
}

/**
 * Option list component
 */
@Component({
	selector: 'app-configurator-options-list',
	templateUrl: './options-list.component.html',
	styleUrls: ['./options-list.component.scss'],
	encapsulation: ViewEncapsulation.None,
})

/**
* Subscribe on store events and dispatch users event
*/
class OptionsListComponent implements OnChanges, OnInit, OnDestroy {
	FIX_SIDE_MENU_TOP_OFFSET = 0;

	// Pass enum to view
	OptionTabModeEnum = OptionTabModeEnum;
	HalfHalfOptionsEnum = HalfHalfOptionsEnum;
	@Input() isHeaderStrippedVersion: boolean;
	@Input() isPizzaAssistant: boolean;

	@Input() configuratorProductInfo: Product;
	@Input() productOptionListArray: Array<OptionTabsInterface>
	@Output() productListEventEmitter: EventEmitter<OptionListEmitterInterface> = new EventEmitter();
	@Input()
	set loading(loading: boolean) {
		if (loading) {
			this.productOptionListArray = OptionListGhostLoader.getOptionList();
		}
	}

	// Product size data proxy for side product details
	@Input() productSizePickerTabsArray: Array<SizePickerTabInterface>;
	@Output() productSizePickerTabClickEmitter: EventEmitter<number> = new EventEmitter();

	// Quantity selector proxy
	@Input() quantitySelectorContent: QuantitySelectorInterface;
	@Output() quantitySelectorEventEmitter: EventEmitter<QuantitySelectorEmitterInterface>
		= new EventEmitter<QuantitySelectorEmitterInterface>();

	// Product configuration options
	@Input() configurationUi: ConfigurationUiInterface;
	@Output() sideMenuEventEmitter: EventEmitter<AddBtnEmitterInterface>
		= new EventEmitter<AddBtnEmitterInterface>()

	@Input() maxQtyForTopping: number;

	isPersonalMessageTab: boolean
	@Input() subCategories: SubCategoryInterface[]
	@Input() set selectedSubCategory(selected: string) {
		if (selected && this.subCategories) {
			const selectedCategory = this.subCategories.find(category => category.id === selected)
			this.isPersonalMessageTab = selectedCategory && selectedCategory.personalizedTemplate ? true : false;
		}
	}
	@Input() personalizationForm: FormGroup;
	@Input() personalizationTemplate: PersonalizedTemplateUI

	/**
	 * Save references for option list and side menu wrappers to handle left menu scroll
	 */
	@ViewChild('productsOptionsWrap', { static: true }) optionWrapElementRef: ElementRef;
	@ViewChild('sideProductDetails', { static: true }) sideProductElementRef: ElementRef;
	@ViewChild('addBtn', { static: true }) myAddBtn: ElementRef;
	// Side menu offset top would change the value when users scrolls
	sideMenuTopOffset: number;
	isScrollCollapsed: boolean;

	messageRef;

	private isBrowser: boolean;
	constructor(
		@Inject(PLATFORM_ID) platformId
	) {
		this.isBrowser = isPlatformBrowser(platformId);
	}

	/**
	 * Initiate component
	 */
	ngOnInit() {
		this.sideMenuTopOffset = 0;
		// On message type dropdown changes
		this.messageRef = this.personalizationForm.get('message').valueChanges.subscribe(newVal => {
			if (!this.personalizationTemplate) {
				return false;
			}
			// If not custom message than clear it
			if (this.personalizationTemplate.customMessageLabel !== newVal) {
				this.personalizationForm.get('customMessage').setValue(null)
			}
		})
	}

	/**
	 * Destructure
	 */
	ngOnDestroy() {
		this.messageRef.unsubscribe();
	}

	/**
	 * Unpack component input data
	 */
	ngOnChanges() {
	}

	/**
	 * Proxy event to parent
	 */
	productSizePickerTabClickHandler(productSizeId) {
		this.productSizePickerTabClickEmitter.emit(productSizeId);
	}

	/**
	 * Proxy event to parent component
	 */
	quantitySelectorEventHandler(event) {
		this.quantitySelectorEventEmitter.emit(event);
	}

	/**
	 * Proxy event from side menu
	 */
	sideMenuEventHandler(event) {
		this.sideMenuEventEmitter.emit(event);
	}

	/**
	 * Handler for production option click
	 */
	onOptionClick(event, halfHalfMode, optionId, isValid, isSelected, allowMultiSelect) {
		this.productListEventEmitter.emit({
			action: OptionListActionsEnum.optionClick,
			halfHalfMode,
			optionId,
			isValid: !isSelected && allowMultiSelect ? !isValid : true
		} as OptionListEmitterInterface);
	}


	/**
	 * Hander for reset option click
	 */
	onResetClick(event) {
		if (this.isPersonalMessageTab) {
			this.personalizationForm.setValue({
				'message_from': '',
				'message_to': '',
				'message': '',
				'customMessage': null
			});
			return false;
		}
		this.productListEventEmitter.emit({
			action: OptionListActionsEnum.resetOptionClick
		} as OptionListEmitterInterface);
	}

	/**
	 * Handler for half half option click
	 */
	onHalfHalfClick(event, optionId, halfHalfMode) {
		event.stopPropagation();
		this.productListEventEmitter.emit({
			action: OptionListActionsEnum.optionHalfHalfClick,
			optionId,
			halfHalfMode
		} as OptionListEmitterInterface);
	}

	/**
	 * Hander for incrementor
	 */
	onOptionQuantityChange(event, optionId, value, isValid, isDisabled) {
		event.stopPropagation();

		if (!isDisabled) {
			this.productListEventEmitter.emit({
				action: OptionListActionsEnum.optionQuantityClick,
				optionId,
				quantity: value,
				isValid
			} as OptionListEmitterInterface);


		}
		this.myAddBtn.nativeElement.focus();
	}

	/**
	 * Option drop down list click handler
	 * to prevent parent block to close
	 */
	onOptionDropDownClick(optionId, dropDownValue) {
		this.productListEventEmitter.emit({
			action: OptionListActionsEnum.optionDropDownChange,
			optionId,
			dropDownValue
		})
	}

	/**
	 * Handler for flowing right menu
	 */
	@HostListener('window:scroll', ['$event']) onScrollEvent($event) {
		// Get the button element from header. It is not a child of this component so we have to use getElementById
		if (this.isBrowser) {
			const btnElemt = document.getElementById('headerProductBtn');
			if (this.optionWrapElementRef && btnElemt.getBoundingClientRect()) {
				this.isScrollCollapsed = (btnElemt.getBoundingClientRect().bottom < 1)
			}
		}
	}

}

export {
	OptionTabsInterface,
	OptionsListComponent,
	OptionTabModeEnum,
	OptionsDropDown,

	OptionListActionsEnum,
	HalfHalfOptionsEnum,
	OptionListEmitterInterface
}
