import {
	Component,
	Input,
	Output,
	EventEmitter,
	OnChanges,
	OnDestroy,
	HostListener,
	ElementRef,
	ViewChild,
	OnInit
} from '@angular/core';

import { ActionsSubject } from '@ngrx/store';
import { ConfiguratorActionsTypes } from '../../../actions/configurator'
import { filter } from 'rxjs/operators';

interface ConfigurationTabInterface {
	id: string,
	fontKey: string,
	tabText: string,
	isSelected: boolean,
	isAvailableForProduct: boolean,
	notAvailableForSize: [number]
}

/**
* Item configuration page component
*/
@Component({
	selector: 'app-product-configurator-tabs',
	templateUrl: './product-configuration-tabs.component.html',
	styleUrls: ['./product-configuration-tabs.component.scss'],
})


/**
* Subscribe on store events and dispatch users event
*/
export class ProductConfigurationTabsComponent implements OnChanges, OnDestroy, OnInit {
	@ViewChild('selectTabs', { static: true }) selectTabs: ElementRef;

	currentSelected: ConfigurationTabInterface;
	dispatcherSubscriptionRef;
	@Input() productConfigurationTabsArray: Array<ConfigurationTabInterface>;
	@Input() set selected(value: string) {
		if (value) {
			this.currentSelected = this.productConfigurationTabsArray.find(item => item.id === value);
		} else {
			this.currentSelected = this.productConfigurationTabsArray[0]
		}
		this.determinePosition();
	}
	@Output() productConfigurationClickEmitter: EventEmitter<number> = new EventEmitter();

	// Hides components if it is empty
	selectPosString: string;
	selectWidth: string;

	constructor(
		private dispatcher: ActionsSubject
	) {
		// Listens to certain actions that might modify the tabs
		this.dispatcherSubscriptionRef = this.dispatcher.pipe(
			filter(action =>
				action.type === ConfiguratorActionsTypes.ChangeProductConfiguration ||
				action.type === ConfiguratorActionsTypes.ChangeProductSize)
		).subscribe(() =>
			this.determinePosition()
		);
	}

	/**
	 * On load
	 */
	ngOnInit() {
		this.determinePosition()
	}

	/**
	 * Listen to window resize
	 */
	@HostListener('window:resize', ['$event'])
	onResize(event) {
		this.determinePosition();
	}
	/**
	 * Handler for input change
	 */
	ngOnChanges() {
		if (!this.productConfigurationTabsArray) {
			return false;
		}
		this.determinePosition();
	}
	/**
	 * Angular destructor
	 */
	ngOnDestroy() {
		this._unsubscribeFromAll();
	}
	/**
	 * Unsubscribe from all direct listenings
	 */
	private _unsubscribeFromAll() {
		if (this.dispatcherSubscriptionRef) {
			this.dispatcherSubscriptionRef.unsubscribe();
		}
	}
	/**
	 * Handler for tab option click event
	 */
	configurationTabClick(tabId) {
		this.productConfigurationClickEmitter.emit(tabId);
		this.determinePosition();
	}
	/**
	 * Determines position of select background
	 * TODO FIX THE LOGIC TO COVER ALL UI STATE!
	*/
	determinePosition() {
		const hiddenCount = this.productConfigurationTabsArray.filter(item => !item.isAvailableForProduct).length;
		const length = this.productConfigurationTabsArray.length;
		const width = this.selectTabs.nativeElement.offsetWidth;
		const count = width < 768 && width > 0 ? 2 : (length - hiddenCount);

		const selectedIndex = this.productConfigurationTabsArray.indexOf(this.currentSelected);
		this.selectWidth = 100 / count + '%';

		const selectPosition = selectedIndex < 0 || (selectedIndex * 100 / (length - hiddenCount)) > 100
			? 0
			: (selectedIndex * 100 / count);

		const scrollTo = (selectedIndex * 100 / count);

		this.selectPosString = selectPosition + '%';
		this.selectTabs.nativeElement.scrollLeft = width * (scrollTo * .01);
	}
}

export {
	ConfigurationTabInterface
}
