
// Angular core
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// bootstrap
import {
	NgbModule
} from '@ng-bootstrap/ng-bootstrap';

import { CommonPizzaPizzaModule } from '../common/common.module';

import { HeaderSubContainers } from './sub-containers';
import { HeaderComponentsModule } from './components';
import { HeaderContainersModule } from './containers';

@NgModule({
	imports: [
		RouterModule.forChild([]),
		CommonModule,
		NgbModule,

		CommonPizzaPizzaModule,
		HeaderSubContainers,
		HeaderComponentsModule,
		HeaderContainersModule,
	],
	exports: [
		HeaderContainersModule
	],
})

export class HeaderModule {
}
