import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CommonPizzaPizzaModule } from '../../common/common.module';
import { StoreResultComponent } from './store-locator/store-result/store-result.component';

// TODO remove me and use REDUX model
import { LocationPickUpListService } from '../simulation-data/location-pick-up-list.service';

export const COMPONENTS = [
	StoreResultComponent,
]

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		RouterModule,
		CommonPizzaPizzaModule
	],
	declarations: [
		COMPONENTS
	],
	entryComponents: [ ],
	providers: [LocationPickUpListService],
	exports: [
		COMPONENTS,
	],
})
export class StoreComponentsModule { }
