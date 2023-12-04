import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
	ReactiveFormsModule
} from '@angular/forms';

import { CommonPizzaPizzaModule } from '../../../common/common.module';
import { SignInFormComponent } from './sign-in-form/sign-in-form.component';

import { RouterModule } from '@angular/router';


export const COMPONENTS = [
	SignInFormComponent
];


@NgModule({
	imports: [
		CommonModule,
		CommonPizzaPizzaModule,
		RouterModule,
		ReactiveFormsModule
	],
	declarations: COMPONENTS,
	exports: COMPONENTS
})

export class SignInComponentModule { }
