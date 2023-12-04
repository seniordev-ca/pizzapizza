// Core
import {
	Component,
	OnDestroy,
	Inject,
	PLATFORM_ID
} from '@angular/core';

// NGRX
import {
	Store,
	select,
	ActionsSubject
} from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';

// Reducer selectors
import * as fromCommon from '../../../common/reducers';
import { UIFooterMenuInterface } from 'app/common/models/footer-menu';
import { AppSocialLinkInterface } from 'app/common/models/server-app-settings';
import { SDKActionTypes } from '../../../common/actions/sdk';

import { buildRevision } from '../../../../revision';
import { environment } from '../../../../environments/environment';

// Dev info
declare var ppSdk;
@Component({
	selector: 'app-footer',
	templateUrl: './footer.component.html',
	styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnDestroy {
	isDeploymentVersionVisible = environment.isEnvPickerEnabled;
	footerMenu$: Observable<UIFooterMenuInterface[]>;
	legalMenu$: Observable<UIFooterMenuInterface[]>;
	socialLinks$: Observable<AppSocialLinkInterface>;
	sdkVersion = '';
	buildRevision = '';
	sdkLoadedRef = null;
	public isCollapsed = [];

	constructor(
		private store: Store<fromCommon.State>,
		private actions: ActionsSubject,
		@Inject(PLATFORM_ID) private platformId: Object
	) {
		this.buildRevision = buildRevision;
		this.footerMenu$ = this.store.pipe(select(fromCommon.getFooterMenu))
		this.legalMenu$ = this.store.pipe(select(fromCommon.getLegalMenu))
		this.socialLinks$ = this.store.pipe(select(fromCommon.getSocialLinks))

		if (isPlatformBrowser(platformId)) {
			this.sdkLoadedRef = this.actions.pipe(
				filter(action => action.type === SDKActionTypes.InitialSDKLoadSuccess)
			).subscribe((action) => {
				const sdkVersion = ppSdk.version;
				if (sdkVersion) {
					this.sdkVersion = sdkVersion;
					this.sdkLoadedRef.unsubscribe();
				}
			});
		}
	}

	/**
	 * Unsubscribe on destroy
	 */
	ngOnDestroy() {
		if (this.sdkLoadedRef) {
			this.sdkLoadedRef.unsubscribe();
		}
	}

}
