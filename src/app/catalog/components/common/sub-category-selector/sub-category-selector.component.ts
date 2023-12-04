import {
	Component,
	Input,
	Output,
	EventEmitter,
	OnChanges,
	HostListener,
	ViewChild,
	ElementRef,
	ViewEncapsulation,
	Inject,
	PLATFORM_ID
} from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';

interface SubCategoryInterface {
	id: string | number,
	title: string,
	isSelected: boolean,
	personalizedTemplate?: number
}

class GhostSubCategoryHelper {
	/**
	 * Genterate Ghost Subcategories
	 */
	static generateGhostSubCategories(count) {
		let i = 0
		return Array.apply(null, Array(count)).map(function () {
			return {
				id: 'l' + i++,
				title: ' ',
				isSelected: i === 0
			};
		})
	}
}

@Component({
	selector: 'app-sub-category-selector',
	templateUrl: './sub-category-selector.component.html',
	styleUrls: ['./sub-category-selector.component.scss'],
	providers: [],
	encapsulation: ViewEncapsulation.None
})

class SubCategorySelectorComponent implements OnChanges {
	@ViewChild('subCategoryRow', { static: true }) subCategoryRow: ElementRef;

	currentSelected: SubCategoryInterface;
	@Input() subCategoriesArray: SubCategoryInterface[];
	@Input() set loading(loading: boolean) {
		if (loading) {
			this.subCategoriesArray = GhostSubCategoryHelper.generateGhostSubCategories(3)
		}
	}
	@Input() set selected(value: number | string) {
		if (value) {
			this.currentSelected = this.subCategoriesArray.find(item => item.id === value);
		} else {
			this.currentSelected = this.subCategoriesArray[0]
		}
		this.determinePosition();
	}

	@Output() subCategoriesClickEmitter: EventEmitter<number> = new EventEmitter();

	selectPosString = '0px';
	selectWidth = '25%';
	minWidth = '25%';

	private isRenderedOnServer: boolean;


	constructor(
		@Inject(PLATFORM_ID) platformId
	) {
		this.isRenderedOnServer = isPlatformServer(platformId);
	}

	/**
	 * Listen to window resize
	 */
	@HostListener('window:resize', ['$event'])
	onResize(event) {
		if (this.subCategoriesArray) {
			this.determinePosition();
		}
	}
	/**
	 * Handler for input change
	 */
	ngOnChanges() {
		if (!this.subCategoriesArray) {
			return false;
		}
		this.determinePosition();
	}


	/**
	 * Handler for for category click
	 * Consider doing a check here to determine if the clicked item is not the currently selected one
	 */
	productSubCategoriesClick(subCategoryId) {
		this.subCategoriesClickEmitter.emit(subCategoryId);
	}

	/**
	 * Determines position of select background
	*/
	determinePosition() {
		if (this.isRenderedOnServer) {
			return false;
		}

		if (this.subCategoriesArray) {
			this.currentSelected = !this.currentSelected ? this.subCategoriesArray[0] : this.currentSelected;

			const selectedIndex = this.subCategoriesArray.indexOf(this.currentSelected);
			const length = this.subCategoriesArray.length;
			this.minWidth = 100 / length + '%';

			const elmnt = this.subCategoryRow.nativeElement;

			const selectedElment = document.getElementById('subcategory' + selectedIndex);

			const scrollTo = (selectedIndex * 100 / length);
			const selectPos = (selectedIndex * 100 / length);

			if (elmnt && selectedElment) {
				this.selectWidth = selectedElment.offsetWidth + 'px';
				let leftWidth = 0;
				let directLeftSibling = 0;

				this.subCategoriesArray.map(item => {
					const thisIndex = this.subCategoriesArray.indexOf(item);
					const thisElement = document.getElementById('subcategory' + thisIndex);
					if (thisElement) {
						if (thisIndex < selectedIndex) {
							leftWidth += thisElement.offsetWidth;
						}
						if (thisIndex === selectedIndex - 1) {
							directLeftSibling = thisElement.offsetWidth;
						}
					}
				})

				this.selectPosString = leftWidth - 15 + 'px';
				elmnt.scrollLeft = leftWidth - directLeftSibling / 2;
			}
		}
	}
}

export {
	SubCategoryInterface,
	SubCategorySelectorComponent
}
