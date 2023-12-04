import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { CommonPizzaPizzaModule } from '../../common/common.module';
import { AccountsComponentModule } from './accounts'

import { ClubElevenLandingModule } from './club-eleven-landing'
import { ClubElevenLoyaltyFormComponentsModule } from './club-eleven-loyalty-form';
import { SignInComponentModule } from './sign-in'
import { SignUpComponentModule } from './sign-up'
import { UserCommonModule } from './common'

const COMPONENTS = [
	AccountsComponentModule,
	ClubElevenLandingModule,
	ClubElevenLoyaltyFormComponentsModule,
	UserCommonModule,
	SignInComponentModule,
	SignUpComponentModule,
]

@NgModule({
	imports: [
		CommonModule,
		COMPONENTS,
		NgbModule,
		CommonPizzaPizzaModule
	],
	declarations: [

	],
	exports: [
		COMPONENTS,
	]
})
export class UserComponentsModule { }
