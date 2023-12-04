import {
	Component,
	AfterViewInit,
	Input,
	Output,
	EventEmitter,
	OnDestroy,
	OnInit,
	Inject,
	PLATFORM_ID
} from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';

/**
 * ngrx core
 */
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

// Reducers
import * as fromCommon from '../../../common/reducers';
import * as fromDev from '../../reducers';

// Actions
import {
	SetBaseApiUrl,
	SetMockHeader,
	ToggleMockImageBaseUrl
} from '../../actions/dev-actions';

import {
	Router,
	NavigationStart,
	NavigationCancel,
	NavigationEnd
} from '@angular/router';

import { environment } from '../../../../environments/environment';

@Component({
	selector: 'app-dev-menu',
	templateUrl: './app-dev-menu.component.html',
	styleUrls: ['./app-dev-menu.component.scss']
})

export class MenuLinksComponent implements OnInit, OnDestroy {
	isMobileOpen = false;
	isMockImageBaseUrl = null;

	devOptionsSubscriptionRef;
	appEnvironments$: Observable<{
		label: string,
		url: string
	}[]>

	apiMock$: Observable<{
		header_val: string,
		label: string
	}[]>

	selectedBaseUrl: string;
	selectedMockHeader: string;

	isHtmlHidden = false;

	private isRenderedOnServer: boolean;
	constructor(
		private commonStore: Store<fromCommon.CommonState>,
		private devStore: Store<fromDev.DevState>,
		private router: Router,
		@Inject(PLATFORM_ID) platformId
	) {
		this.isHtmlHidden = !environment.isEnvPickerEnabled;

		this.isRenderedOnServer = isPlatformServer(platformId);

		this.appEnvironments$ = this.commonStore.pipe(select(fromCommon.selectEnvironments));
		this.apiMock$ = this.commonStore.pipe(select(fromCommon.selectMockHeaders));

		const devOptions$ = this.devStore.pipe(select(fromDev.selectAppDevOptions));

		this.devOptionsSubscriptionRef = devOptions$.subscribe(devOptions => {
			this.selectedBaseUrl = devOptions.environment.baseApiUrl;
			this.selectedMockHeader = devOptions.environment.mockHeader;
			this.isMockImageBaseUrl = devOptions.environment.isMockImageBaseUrl;
		});
	}

	/**
	 * Handler for env button click
	 */
	onEnvClick(envUrl) {
		if (envUrl === null) {
			// Reset is dispatched here in case if the app crashed
			localStorage.removeItem('devOptions');
		} else {
			localStorage.removeItem('selectedStore');
			this.devStore.dispatch(new SetBaseApiUrl(envUrl));
		}

		if (typeof window === 'object') {
			window.location.reload();
		}
	}

	/**
	 * Hander for mock header click
	 */
	onMockHeaderClick(mockHeader) {
		localStorage.removeItem('selectedStore');
		this.devStore.dispatch(new SetMockHeader(mockHeader));
	}

	/**
	 * Get browser window width
	*/
	getWidth() {
		if (this.isRenderedOnServer) {
			return 0;
		}

		return Math.max(
			document.body.scrollWidth,
			document.documentElement.scrollWidth,
			document.body.offsetWidth,
			document.documentElement.offsetWidth,
			document.documentElement.clientWidth
		);
	}

	/**
	 * Adding class for mobile demo box
	*/
	onBoxClick() {
		if (this.getWidth() <= 768) {
			this.isMobileOpen = true;
			console.log(this.getWidth(), this.isMobileOpen)
		}
	}

	/**
	 * Handle Image mock
	 */
	toggleMockImage() {
		this.devStore.dispatch(new ToggleMockImageBaseUrl());
	}

	/**
	 * Close btn handler
	 */
	onMobileClose(e: Event) {
		console.log(e);
		e.stopPropagation();
		this.isMobileOpen = false;
	}
	/**
	 * Listening for event on change url
	 */

	ngOnInit() {
		this.router.events
			.subscribe((event) => {
				if (event instanceof NavigationEnd) {
					this.isMobileOpen = false;
				}
			});
	}
	/**
	 * Angular destructor
	 */
	ngOnDestroy() {
		this._unsubscribeFromAll();
	}
	/**
	 * Unsubscribe
	 */
	private _unsubscribeFromAll() {
		if (this.devOptionsSubscriptionRef) {
			this.devOptionsSubscriptionRef.unsubscribe();
		}
	}
}
