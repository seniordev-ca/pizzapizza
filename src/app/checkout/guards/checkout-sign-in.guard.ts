// Angular core
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import * as fromUser from '../../user/reducers';

@Injectable()
export class CanActivateCheckoutSignIn implements CanActivate {

	constructor(public router: Router, private userStore: Store<fromUser.UserState>) { }
	/**
	 * Following method will block navigation is user didn't complete selection
	 */
	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
		return this.userStore.select(fromUser.isCheckoutReady).pipe(map(authUser => {
			if (!authUser) {
				this.router.navigate(['/user/checkout-sign-in'], { skipLocationChange: true })
			}
			return authUser;
		}))
	}
}
