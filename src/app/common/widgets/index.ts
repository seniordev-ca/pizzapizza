import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Products components
import { AddCouponWidgetComponent } from './add-coupon/add-coupon.widget'

export const COMPONENTS = [
	AddCouponWidgetComponent
];

@NgModule({
	imports: [
		RouterModule,
		CommonModule,
		FormsModule
	],
	declarations: COMPONENTS,
	exports: COMPONENTS
})
export class CommonWidgetsModule { }
