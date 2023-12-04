import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
	FormsModule,
	ReactiveFormsModule
} from '@angular/forms';
import { TextMaskModule } from 'angular2-text-mask';

import { CommonPizzaPizzaModule } from '../../../common/common.module';
import { UserCommonModule } from '../common';

import { PersonalDetailsComponent } from './personal-details/personal-details.component';
import { ActivitiesComponent } from './activities/activities.component';
import { KidsClubComponent } from './kids-club/kids-club.component';
import { OrderHistoryComponent } from './activities/order-history/order-history.component';
import { RegisteredKidsClubComponent } from './registered-kids-club/registered-kids-club.component';

export const COMPONENTS = [
	PersonalDetailsComponent,
	ActivitiesComponent,
	KidsClubComponent,
	RegisteredKidsClubComponent,
	OrderHistoryComponent,
];

@NgModule({
	imports: [
		FormsModule,
		ReactiveFormsModule,
		CommonModule,
		CommonPizzaPizzaModule,
		UserCommonModule,
		TextMaskModule
	],
	entryComponents: [],
	declarations: COMPONENTS,
	exports: COMPONENTS
})

export class AccountsComponentModule { }
