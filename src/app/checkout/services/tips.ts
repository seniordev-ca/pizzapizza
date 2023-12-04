// Core
import { Injectable } from '@angular/core';

// Server models
import {
	TipsRequest
} from '../models/server-tips';

import { ServerCartResponseInterface } from '../models/server-cart-response';
// App HTTP clients
import { ApplicationHttpClient } from '../../../utils/app-http-client';

@Injectable()
export class TipsService {

	constructor(
		private appHttp: ApplicationHttpClient
	) { }

	/**
	 * Redeem club points
	 */
	applyTips(tipRequest: TipsRequest) {
		const methodPath = 'checkout/api/v1/order/set_tips';
		return this.appHttp.post<ServerCartResponseInterface>(methodPath, tipRequest);
	}

}
