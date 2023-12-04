import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { Location } from '@angular/common';
import { OnChanges } from '@angular/core';
import { Router } from '@angular/router';

// actions
import { LocationsDataLayer } from '../../../../common/actions/tag-manager'
/**
 * ngrx
 */
import { Store } from '@ngrx/store';

import * as fromCommon from '../../../../common/reducers';

interface SubHeaderNavigationInterface {
	title?: string,
	textColor?: string,
	iconColor?: string,
	hasBackgroundImage?: boolean,
	backgroundImage?: string,
	backToLocation?: string,
	disableNavigationDispatching?: boolean
}

/**
* Item configuration page component
*/
@Component({
	selector: 'app-sub-header-navigation',
	templateUrl: './sub-header-navigation.component.html',
	styleUrls: ['./sub-header-navigation.component.scss'],
	encapsulation: ViewEncapsulation.None
})

/**
* Subscribe on store events and dispatch users event
*/
class SubHeaderNavigationComponent implements OnChanges {
	@Input() subHeaderNavContent: SubHeaderNavigationInterface;
	@Input() title: string;
	@Input() navText: string;
	@Input() isVerticalModalOpen: string;

	constructor(
		private location: Location,
		private router: Router,
		private store: Store<fromCommon.State>,
	) { }

	/**
	 * Check if data is available
	 */
	ngOnChanges() {
		this.subHeaderNavContent = this.subHeaderNavContent || {} as SubHeaderNavigationInterface;
	}
	/**
	 * Handler for clicking back button
	 */
	onBackClick() {
		if (this.title === 'PIZZA ASSISTANT') {
			this.store.dispatch(new LocationsDataLayer('backassistant', 'Closes', 'Back'))
		}
		if (this.subHeaderNavContent.backToLocation) {
			this.router.navigate([this.subHeaderNavContent.backToLocation])
		} else {
			this.location.back();
		}
	}
}

export {
	SubHeaderNavigationInterface,
	SubHeaderNavigationComponent
}
