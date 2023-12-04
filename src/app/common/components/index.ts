// Angular core
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
	ReactiveFormsModule
} from '@angular/forms';
import { RouterModule } from '@angular/router';

// 3td party libs
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// Common container module
import { CommonModalsComponentsModule} from './modals';
import { CommonProductsComponentsModule } from './products'
import { CommonSharedComponentsModule } from './shared';

@NgModule({
	imports: [
		RouterModule,
		CommonModule,

		NgbModule,
		ReactiveFormsModule,

		CommonModalsComponentsModule,
		CommonProductsComponentsModule,
		CommonSharedComponentsModule,
	],
	declarations: [],
	exports: [
		CommonModalsComponentsModule,
		CommonProductsComponentsModule,
		CommonSharedComponentsModule
	]
})
export class CommonComponentsModule { }
