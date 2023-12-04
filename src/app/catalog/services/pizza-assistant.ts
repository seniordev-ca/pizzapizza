import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApplicationHttpClient } from '../../../utils/app-http-client';

import { ServerPizzaAssistantResponse, ServerPizzaAssistantHelp } from '../models/server-pizza-assistant';

/**
 * Pizza Assistant service
 */
@Injectable()
export class PizzaAssistantService {
	constructor(
		private appHttp: ApplicationHttpClient
	) { }

	/**
	 * Send Message
	 */
	sendMessage(storeId, message): Observable<ServerPizzaAssistantResponse> {
		const body = {
			input_text: message,
			store_id: storeId
		}
		const methodPath = 'catalog/api/v1/pizza_assistant/';

		return this.appHttp.post<ServerPizzaAssistantResponse>(methodPath, body);
	}
	/**
	 * Get Help Example
	 */
	receiveHelp() {
		const methodPath = 'catalog/api/v1/pizza_assistant/';
		return this.appHttp.get<ServerPizzaAssistantHelp>(methodPath);
	}
}
