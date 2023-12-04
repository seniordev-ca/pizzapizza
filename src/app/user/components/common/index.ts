import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import {
	ReactiveFormsModule
} from '@angular/forms';


import { CommonPizzaPizzaModule } from '../../../common/common.module';

import { CouponsListComponent } from './coupons-list/coupons-list.component'
import { UserImageComponent } from './user-image/user-image.component';
import { SignUpClubElevenElevenComponent } from './sign-up-club-eleven-eleven/sign-up-club-eleven-eleven.component';

export const COMPONENTS = [
	CouponsListComponent,
	SignUpClubElevenElevenComponent,
	UserImageComponent
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

export class UserCommonModule { }
