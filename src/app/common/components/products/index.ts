import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';

// Products components
import { QuantitySelectorComponent } from './quantity-selector/quantity-selector.component'

export const COMPONENTS = [
	QuantitySelectorComponent
];

@NgModule({
	imports: [
		RouterModule,
		CommonModule,
	],
	declarations: COMPONENTS,
	exports: COMPONENTS
})
export class CommonProductsComponentsModule { }
