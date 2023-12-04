import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';
import { ClubElevenLandingActionsComponent } from './landing-actions/landing-actions.component';
// Common
import { CommonPizzaPizzaModule } from '../../../common/common.module';

export const COMPONENTS = [
	ClubElevenLandingActionsComponent
];

@NgModule({
	imports: [
		CommonModule,
		RouterModule,
		CommonPizzaPizzaModule
	],
	declarations: COMPONENTS,
	exports: [COMPONENTS]
})

export class ClubElevenLandingModule { }
