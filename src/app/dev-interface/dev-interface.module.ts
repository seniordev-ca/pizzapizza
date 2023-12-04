
// Angular core
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// ngrx lib
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

// bootstrap
import {
	NgbModule
} from '@ng-bootstrap/ng-bootstrap';

import { DevInterfaceContainersModule } from './containers';

import { reducers } from './reducers';
import { DevEffects } from './effects/dev-actions';

@NgModule({
	declarations: [

	],
	imports: [
		RouterModule.forChild([]),
		CommonModule,
		NgbModule,
		DevInterfaceContainersModule,

		StoreModule.forFeature('dev', reducers),
		EffectsModule.forFeature([
			DevEffects
		])
	],
	exports: [
		DevInterfaceContainersModule
	],
	providers: [

	]
})

export class DevInterfaceModule {
}
