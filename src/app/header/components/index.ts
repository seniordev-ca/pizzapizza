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
import { CommonPizzaPizzaModule } from '../../common/common.module';
// Sub Modules
import { HeaderSubContainers } from '../sub-containers';
// Components
import { LoginRegisterComponent } from './login-register/login-register.component';
import { MobileNavComponent } from '../containers/mobile-nav/mobile-nav.component';
import { StoreSelectorComponent } from './store-selector-for-header/store-selector.component';
import { LocationPickUpListComponent } from './location-pick-up-list/location-pick-up-list.component';

// Common container module
export const COMPONENTS = [
	LoginRegisterComponent,
	MobileNavComponent,
	StoreSelectorComponent,
	LocationPickUpListComponent,
];

@NgModule({
	imports: [
		RouterModule,
		CommonModule,

		NgbModule,
		ReactiveFormsModule,

		CommonPizzaPizzaModule,
		HeaderSubContainers
	],
	declarations: COMPONENTS,
	exports: COMPONENTS
})
export class HeaderComponentsModule { }
