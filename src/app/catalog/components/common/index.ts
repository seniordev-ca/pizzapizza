import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { SwiperModule } from 'ngx-swiper-wrapper';

import { ProductHeaderComponent } from './product-header/product-header.component';
import { ProductItemComponent } from './product-item/product-item.component';
import { ProductSizePickerComponent } from './product-size-picker/product-size-picker.component';
import { ProductSubHeaderComponent } from './product-sub-header/product-sub-header.component';
import { QuickAddModalComponent } from './quick-add-modal/quick-add-modal.component';
import { SubCategorySelectorComponent } from './sub-category-selector/sub-category-selector.component';
import { ProductAddBtnComponent } from './add-product-btn/add-product-btn.component';

import { CommonPizzaPizzaModule } from '../../../common/common.module';

export const COMPONENTS = [
	ProductHeaderComponent,
	ProductItemComponent,
	ProductSizePickerComponent,
	ProductSubHeaderComponent,
	QuickAddModalComponent,
	SubCategorySelectorComponent,
	ProductAddBtnComponent
];


@NgModule({
	imports: [
		CommonModule,
		RouterModule,
		CommonPizzaPizzaModule,
		SwiperModule
	],
	declarations: COMPONENTS,
	exports: COMPONENTS,
})
export class ProductCommonComponentModule { }
