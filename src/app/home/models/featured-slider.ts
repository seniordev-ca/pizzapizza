import { ServerProductInListInterface } from '../../catalog/models/server-product-in-list';

export interface SliderInterface extends ServerProductInListInterface {
	style: {
		colorOne: string,
		colorTwo: string,
		colorBackground: string
	};
}
