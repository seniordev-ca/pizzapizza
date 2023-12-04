// Angular core
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { AddDeeplinkCoupon } from 'app/common/actions/coupon-wallet';
import * as fromReducers from '../common/reducers';

@Injectable()
export class CanActivateDeepLinkCoupon implements CanActivate {

	constructor(public router: Router, private store: Store<fromReducers.CommonState>,
	) { }
	/**
	 * Following method will block navigation is user didn't complete selection
	 */
	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
		const queryParams = route.queryParams
		if (queryParams.coupon) {
			this.store.dispatch(new AddDeeplinkCoupon(queryParams.coupon));
			this.router.navigate(['/user/sign-in'])
			return false;
		}
		return true;
	}
}
