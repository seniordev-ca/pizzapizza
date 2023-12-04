import { RouterStateSerializer } from '@ngrx/router-store';
import { RouterStateSnapshot, Params } from '@angular/router';

/**
 * The RouterStateSerializer takes the current RouterStateSnapshot
 * and returns any pertinent information needed. The snapshot contains
 * all information about the state of the router at the given point in time.
 * The entire snapshot is complex and not always needed. In this case, you only
 * need the URL and query parameters from the snapshot in the store. Other items could be
 * returned such as route parameters and static route data.
 */
interface RouterDetailsInterface {
	url: string;
	params: Params;
	queryParams: Params;
}
export interface RouterStateUrl extends RouterDetailsInterface {
	history: RouterDetailsInterface[]
}
const history = [] as RouterDetailsInterface[]

/**
 * Generate an REDUX action on navigation change
 */
export class CustomRouterStateSerializer

implements RouterStateSerializer<RouterStateUrl> {
	/**
	 * Generate event with URL params
	 */
	serialize(routerState: RouterStateSnapshot): RouterStateUrl {
		let route = routerState.root;

		while (route.firstChild) {
			route = route.firstChild;
		}

		const { url, root: { queryParams } } = routerState;
		const { params } = route;
		history.push({
			url,
			params,
			queryParams
		})
		// Only return an object including the URL, params and query params
		// instead of the entire snapshot
		return { url, params, queryParams, history };
	}
}
