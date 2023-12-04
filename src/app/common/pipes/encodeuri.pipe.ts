import { Pipe, PipeTransform } from '@angular/core';
import { isString } from 'util';

@Pipe({
	name: 'encodeURI'
})
export class EncodeURIPipe implements PipeTransform {

	/**
	 * Encode string to uri, remove extra whitespace and replace whitespace with -
	 */
	transform(input) {

		if (!isString(input)) {
			return input;
		}

		let replacement = input.replace(' - ', ' ');
		replacement = replacement.trim().replace(/\s+/g, '-').toLowerCase();

		return encodeURIComponent(replacement)
	}
}
