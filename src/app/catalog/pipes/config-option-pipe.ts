import { Pipe, PipeTransform } from '@angular/core';
import { OptionSummary } from '../models/configurator';
@Pipe({
	name: 'formatConfigOption'
})
export class FormatConfigOptionPipe implements PipeTransform {
	/**
	 * Take the array of selected options and format it to a string
	 */
	transform(option: OptionSummary): string {

		if (!option) {
			return null;
		}
		const extraInfo = option.additionalInfo ? ' ( ' + option.additionalInfo + ' )' : '';

		const optionText = option.quantity > 1 ? option.text + ' (X' + option.quantity + ')' : option.text + extraInfo;
		// optionText = option.direction !== HalfHalfOptionsEnum.center ? optionText + ' (' + option.direction + ')' : optionText;

		const optionFormatted = optionText;
		return optionFormatted.trim()
	}
}
