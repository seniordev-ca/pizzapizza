// Angular Core
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

// 3td party libs
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// Module router
import { routes } from './store.routes';

// Common
import { CommonPizzaPizzaModule } from '../common/common.module';

// Components
import { StoreComponentsModule } from './components';

// Containers
import { StoreLocatorContainerComponent } from './containers/store-locator/store-locator-container.component';

// ngrx reducers and effect
// ngrx lib
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { reducers } from './reducers';
import { StoreLocatorEffects } from './effects/store-locator';

export const COMPONENTS = [
	StoreLocatorContainerComponent,
];

@NgModule({
	declarations: [
		COMPONENTS,
	],
	imports: [
		RouterModule.forChild(routes),
		CommonModule,
		NgbModule,
		FormsModule,
		StoreModule.forFeature('storelocator', reducers),
		EffectsModule.forFeature([
			StoreLocatorEffects
		]),
		StoreComponentsModule,
		CommonPizzaPizzaModule
	],
	exports: [
	],
})

export class StoreLocatorModule {
}
