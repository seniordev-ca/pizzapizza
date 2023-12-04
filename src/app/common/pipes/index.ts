import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { PhonePipe } from './phonenumber.pipe';
import { ConvertFontKeyPipe } from './fontkey.pipe';
import { EncodeURIPipe } from './encodeuri.pipe';
import { CartItemDescriptionPipe } from './cart-item-description.pipe';

@NgModule({
	imports: [CommonModule],
	declarations: [
		PhonePipe,
		ConvertFontKeyPipe,
		EncodeURIPipe,
		CartItemDescriptionPipe
	],
	exports: [
		CommonModule,
		FormsModule,
		PhonePipe,
		ConvertFontKeyPipe,
		EncodeURIPipe,
		CartItemDescriptionPipe
	]
})
export class CommonPipesModule { }
