// Angular core
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SwiperModule } from 'ngx-swiper-wrapper';

import {
	ReactiveFormsModule
} from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ClubElevenElevenCardComponent } from './club-11-11-card/club-11-11-card.component';
import { RedeemModalComponent } from './redeem-modal/redeem-modal.component';
import { UpsellsComponent } from './upsells/upsells.component';

import { CommonComponentsModule } from '../components/index'


// Common container module
const CONTAINERS = [
	ClubElevenElevenCardComponent,
	RedeemModalComponent,
	UpsellsComponent
]

@NgModule({
	imports: [
		RouterModule,
		CommonModule,
		ReactiveFormsModule,
		SwiperModule,
		CommonComponentsModule
	],
	declarations: [CONTAINERS],
	exports: CONTAINERS
})
export class CommonSubComponentsModule { }
