import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SwiperModule } from 'ngx-swiper-wrapper';
import { TextMaskModule } from 'angular2-text-mask';

import {
	ReactiveFormsModule
} from '@angular/forms';

import { CartModalComponent } from './cart-modal/cart-modal.component';
import { CartItemComponent } from './cart-item/cart-item.component';
import { CheckoutAddressFormComponent } from './checkout-address-form/checkout-address-form.component';
import { CommonPizzaPizzaModule } from '../../../common/common.module';


export const COMPONENTS = [
	CartModalComponent,
	CartItemComponent,
	CheckoutAddressFormComponent
];

@NgModule({
	imports: [
		CommonModule,
		RouterModule,
		SwiperModule,
		CommonPizzaPizzaModule,
		ReactiveFormsModule,
		TextMaskModule
	],
	declarations: COMPONENTS,
	exports: COMPONENTS,
	entryComponents: [CartModalComponent]
})
export class CartComponentsModule { }
