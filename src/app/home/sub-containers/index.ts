import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Bootstrap
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// Components under the module
import { HeaderAlertComponent } from './header-alert/header-alert.component';

// Common
import { CommonPizzaPizzaModule } from '../../common/common.module';

const COMPONENTS = [
	HeaderAlertComponent
]

@NgModule({
	imports: [
		CommonModule,
		RouterModule,
		CommonPizzaPizzaModule,
		NgbModule
	],
	declarations: COMPONENTS,
	exports: COMPONENTS,
})
export class HomeSubContainersModule { }
