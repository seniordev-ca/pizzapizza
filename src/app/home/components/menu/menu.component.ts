// Angular core
import {
	Component,
	Input,
	ViewEncapsulation,
	EventEmitter,
	Output
} from '@angular/core';

// Model
import {
	Category
} from '../../../catalog/models/category';
import {
	sizes
} from '../../../catalog/models/server-product-ui';

class GhostGenerator {
	static ghostItemsCount = 13;
	static mediusSizeAfter = 1;
	static smallSizeAfter = 9;

	/**
	 * Ghost data generator
	 */
	static getCategories() {
		const ghostArray: Array<Category> = [];

		for (let i = 0; i !== this.ghostItemsCount; i++) {
			let ghostSize = sizes.large;
			if (i >= this.mediusSizeAfter && i < this.smallSizeAfter) {
				ghostSize = sizes.medium;
			} else if (i >= this.smallSizeAfter) {
				ghostSize = sizes.small;
			}

			ghostArray.push({
				id: null,
				parentId: null,
				productsAvailable: null,
				name: null,
				image: undefined,
				sequence: null,
				seoTitle: null,
				uiMetadata: {
					size: ghostSize,
					style: null
				}
			})
		}

		return ghostArray;
	}
}

@Component({
	selector: 'app-menu-categories',
	templateUrl: './menu.component.html',
	styleUrls: ['./menu.component.scss'],
	encapsulation: ViewEncapsulation.None
})

export class MenuComponent {
	@Input() categories: Category[];
	@Input()
	set loading(loading: boolean) {
		this.isLoading = loading;
		if (loading) {
			this.categories = GhostGenerator.getCategories();
		}
	}
	@Input()
	set error(error: boolean) {
		this.isError = error;
	};
	@Output() retryEventEmitter: EventEmitter<boolean> = new EventEmitter();


	isError: boolean;
	isLoading: boolean;

	/**
	 * Handler for retry button
	 */
	onRetryClick() {
		this.retryEventEmitter.emit();
	}
}
