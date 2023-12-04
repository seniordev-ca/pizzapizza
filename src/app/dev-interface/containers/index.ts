import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
	FormsModule,
	ReactiveFormsModule
} from '@angular/forms';
import { RouterModule } from '@angular/router';

// 3td party libs
import {
	NgbModule
} from '@ng-bootstrap/ng-bootstrap';

// Modal components
import { MenuLinksComponent } from './app-dev-menu/app-dev-menu.component';

export const COMPONENTS = [
	MenuLinksComponent,
];

@NgModule({
	imports: [
		RouterModule,
		CommonModule,
		NgbModule,

		ReactiveFormsModule,
		FormsModule
	],
	declarations: COMPONENTS,
	exports: COMPONENTS
})
export class DevInterfaceContainersModule { }
