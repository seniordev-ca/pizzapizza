// Angular core
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
	ReactiveFormsModule
} from '@angular/forms';
import { RouterModule } from '@angular/router';

// bootstrap
import {
	NgbModule
} from '@ng-bootstrap/ng-bootstrap';

// Common module import
import { ClubElevenHeaderComponent } from './club11-header-balance/club-eleven-balance.component';
// Common container module
export const COMPONENTS = [
	ClubElevenHeaderComponent
];

@NgModule({
	imports: [
		RouterModule,
		CommonModule,

		NgbModule,
		ReactiveFormsModule,
	],
	declarations: COMPONENTS,
	exports: COMPONENTS
})
export class HeaderSubContainers { }
