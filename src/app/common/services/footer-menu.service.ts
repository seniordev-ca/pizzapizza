// Angular Core
import {
	Injectable,
} from '@angular/core';
// Reactive operators
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
// Utils
import { ApplicationHttpClient } from '../../../utils/app-http-client';

// Models
import { ApplicationWPHttpClient } from 'utils/app-wp-http-client';
import { ServerMenuInterface, ServerMenuItemInterface } from '../models/server-menu';

/**
 * Footer Menu service consumer
 */
@Injectable()
export class FooterMenuService {
	constructor(
		private http: ApplicationHttpClient,
	) {}

	/**
	 * Get Footer Menu
	 */
	getFooterMenu(): Observable<ServerMenuInterface> {
		const methodPath =  'application/api/v1/wordpress/footer_menus/';

		return this.http.get<ServerMenuInterface>(methodPath);
		// .pipe(
		// 	map(response => {
		// 		const isArray = response ? response.items instanceof Array : false

		// 		if (isArray && response.items.length >= 1) {
		// 			return response.items;
		// 		} else {
		// 			const errorMsg = 'Footer data has not valid format';
		// 			console.warn(errorMsg)
		// 			throw new Error(errorMsg)
		// 		}
		// 	})
		// );
	}
}

