import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CartComponentsModule } from './cart';
import { CommonPizzaPizzaModule } from '../../common/common.module';
import { OrderConfirmationComponentsModule } from './order-confirmation';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		CartComponentsModule,
		CommonPizzaPizzaModule
	],
	declarations: [
	],
	exports: [
		CartComponentsModule,
		OrderConfirmationComponentsModule,
	],
})
export class CheckoutComponentsModule { }
