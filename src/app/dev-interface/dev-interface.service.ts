import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';

import * as fromDev from './reducers';

@Injectable()
export class DevInterfaceService {
	private devSetting;

	/**
	 * Listen to commons store which has setting and save it into the variable
	 * Idea is to provide settings for components as not Observable
	 */
	constructor(
		private devStore: Store<fromDev.DevState>,
	) {
		this.devStore.pipe(select(fromDev.selectAppDevOptions))
			.subscribe(devSetting => this.devSetting = devSetting)
	}

	/**
	 * Used in app http client
	 */
	getDevSetting() {
		return this.devSetting;
	}
}
