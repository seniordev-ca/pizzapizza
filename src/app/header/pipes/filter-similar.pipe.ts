import { Pipe, PipeTransform } from '@angular/core';
import { ServerSimilarAddressInterface } from 'app/common/models/server-store';

@Pipe({
	name: 'filterByCity',
	pure: false
})
export class FilterSimilarAddresses implements PipeTransform {
	/**
	 * Filter Addresses By City
	 */
	transform(items: ServerSimilarAddressInterface[], filter: string): ServerSimilarAddressInterface[] {
		if (!items || !filter) {
			return items;
		}
		// filter items array, items which match and return true will be
		// kept, false will be filtered out
		return items.filter(item => item.city === filter);
	}
}
