import { Pipe, PipeTransform } from '@angular/core';
import { ServerCartResponseConfigOptions } from '../../checkout/models/server-cart-response';
import { HalfHalfOptionsEnum } from '../../catalog/models/configurator';
/**
 * In order to use correctly add this pipe to data via the [innerHTML] directive and with class "server-font-icon"
 *
 * <i class="server-font-icon" [innerHTML]="data.fontKey | pp_convertfontkey"></i>
 *
 * If you try to use it directly in your html it will just output a string
 */
@Pipe({
	name: 'mapCartItemDescription'
})
export class CartItemDescriptionPipe implements PipeTransform {
	/**
	 * Transform the server response to the actual html entity
	 * @param key
	 */
	transform(configOption: ServerCartResponseConfigOptions): string {
		const extraInfo = configOption.subconfig_option ? ' ( ' + configOption.subconfig_option.name + ' ) ' : '';
		let extraOptions = '';
		const isGLuten = configOption.is_gluten ? 'Contains Gluten' : '';
		const isPremuim = configOption.is_premium ? 'Extra Charge' : '';
		const isComma = isGLuten && isPremuim ? ', ' : '';
		extraOptions = isGLuten || isPremuim ? ' (' + isGLuten + isComma + isPremuim + ')' : '';
		const quantityString =
			configOption.quantity > 1 ? '(X' + configOption.quantity + ')' : '';
		const directionString =
			configOption.direction !== HalfHalfOptionsEnum.center
				? `(${configOption.direction})`
				: '';
		return configOption.name + extraInfo + quantityString + directionString + extraOptions;
	}
}
