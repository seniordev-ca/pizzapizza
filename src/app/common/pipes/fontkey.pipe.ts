import { Pipe, PipeTransform } from '@angular/core';
/**
 * In order to use correctly add this pipe to data via the [innerHTML] directive and with class "server-font-icon"
 *
 * <i class="server-font-icon" [innerHTML]="data.fontKey | pp_convertfontkey"></i>
 *
 * If you try to use it directly in your html it will just output a string
 */
@Pipe({
	name: 'pp_convertfontkey'
})
export class ConvertFontKeyPipe implements PipeTransform {
	/**
	 * Transform the server response to the actual html entity
	 * @param key
	 */
	transform(key: string): string {
		if ( key && key.length > 5 && key.charAt(0) === '0' ) {
			return '&' + key.replace('0', '#') + ';';
		}
	}
}
