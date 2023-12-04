import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SwiperModule } from 'ngx-swiper-wrapper';

import { ProductCommonComponentModule } from './common';
import { ConfiguratorComponentModule } from './configurator';

import { CommonPizzaPizzaModule } from '../../common/common.module';

@NgModule({
	imports: [
		CommonModule,
		SwiperModule,
		ProductCommonComponentModule,
		ConfiguratorComponentModule,
		CommonPizzaPizzaModule
	],
	declarations: [
	],
	exports: [
		ProductCommonComponentModule,
		ConfiguratorComponentModule,
	],
})
export class CatalogComponentsModule { }
