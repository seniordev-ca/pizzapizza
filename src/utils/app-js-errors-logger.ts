import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';

import { TagManagerService } from '../app/common/services/tag-manager';

@Injectable()
export class GlobalErrorHandler extends ErrorHandler {
	constructor(
		private injector: Injector,
		private tagManagerService: TagManagerService,
	) {
		super();
	}

	/**
	 * Any JS crash will call this function
	 */
	handleError(error: Error) {
		const location = this.injector.get(LocationStrategy);
		// const message = error.message ? error.message : error.toString();
		const url = location instanceof PathLocationStrategy
			? location.path() : '';

		// Removes line brakes from call stack
		const stack = error.stack ? error.stack.replace(/(\r\n|\n|\r)/gm, '') : null;
		const customError = {
			event: 'customJSError',
			eventCategory: 'JavaScript Errors',
			eventAction: stack,
			eventLabel: url
		};

		this.tagManagerService.pushToDataLayer(customError);
		super.handleError(error);
	}
}
