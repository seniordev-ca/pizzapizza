import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
	ReactiveFormsModule
} from '@angular/forms';

import { UserCommonModule } from '../common';
import { CommonPizzaPizzaModule } from '../../../common/common.module';

import { SignUpFormComponent } from './sign-up-form/sign-up-form.component';
import { SignUpHeaderComponent } from './sign-up-header/sign-up-header.component';
import { SignUpSuccessComponent } from './sign-up-success/sign-up-success.component';

import { RouterModule } from '@angular/router';

import { TextMaskModule } from 'angular2-text-mask';

export const COMPONENTS = [
	SignUpFormComponent,
	SignUpHeaderComponent,
	SignUpSuccessComponent,
];

@NgModule({
	imports: [
		ReactiveFormsModule,

		CommonModule,
		CommonPizzaPizzaModule,

		UserCommonModule,
		RouterModule,

		TextMaskModule
	],
	declarations: COMPONENTS,
	exports: COMPONENTS
})

export class SignUpComponentModule { }
