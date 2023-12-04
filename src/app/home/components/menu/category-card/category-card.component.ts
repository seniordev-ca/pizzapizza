import { Component, Input, ViewEncapsulation } from '@angular/core';

import { Category } from '../../../../catalog/models/category';

@Component({
	selector: 'app-menu-category-card',
	templateUrl: './category-card.component.html',
	styleUrls: ['./category-card.component.scss'],
	encapsulation: ViewEncapsulation.None

})

export class CategoryCardComponent {
	@Input() category: Category;
	@Input() index: number;

	/**
	 * Determine the correct default image based on style code
	 */
	setDefaultImg(style) {
		const darkStyles = ['gradient-clay', 'gradient-navy', 'gradient-jade', 'gradient-green', 'gradient-black', 'gradient-teal'];
		return darkStyles.indexOf(style) > -1 ? './static-files/images/default-image.white.svg' : './static-files/images/default-image.svg';
	}
}
