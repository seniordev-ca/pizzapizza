// Angular core
import { Injectable } from '@angular/core';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

// Target container
import { ConfiguratorContainerComponent } from '../containers/configurator/configurator-container.component'

@Injectable()
export class CanDeactivateAddProductGuard implements CanDeactivate<ConfiguratorContainerComponent> {

	constructor() { }
	/**
	 * Following method will block navigation is user didn't complete selection
	 */
	canDeactivate(
		component: ConfiguratorContainerComponent,
		route: ActivatedRouteSnapshot,
		current: RouterStateSnapshot,
		nextState: RouterStateSnapshot
	): boolean {

		// Don't block navigation if not required
		if (!component.isNavChangeConfirmationModalRequired()) {
			return true;
		}

		const nextStateUrl = nextState.url;
		// The benifit with this is that the component will control what happens when guard is triggered
		component.onLeaveAttempt(nextStateUrl);

		return false;
	}
}
