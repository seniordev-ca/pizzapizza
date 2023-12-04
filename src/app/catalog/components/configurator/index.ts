import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
	ReactiveFormsModule
} from '@angular/forms';

import { CommonPizzaPizzaModule } from '../../../common/common.module';
import { ProductCommonComponentModule } from '../common';

import { ConfiguratorHeaderComponent } from './header/header.component';
import { TabOptionDropDownComponent } from './options-list/tab-option-drop-down/tab-option-drop-down.component';
import { OptionsListComponent } from './options-list/options-list.component';
import { AddItemModalComponent } from './add-item-modal/add-item-modal.component';
import { ProductConfigurationTabsComponent } from './product-configuration-tabs/product-configuration-tabs.component';
import { SideProductDetailsComponent } from './side-product-details/side-product-details.component';

import { SwiperModule } from 'ngx-swiper-wrapper';

// Pipes
import { FormatConfigOptionPipe } from '../../pipes/config-option-pipe';

export const COMPONENTS = [
	ConfiguratorHeaderComponent,
	TabOptionDropDownComponent,
	OptionsListComponent,
	AddItemModalComponent,
	ProductConfigurationTabsComponent,
	SideProductDetailsComponent,
	FormatConfigOptionPipe
];

/**
 * Register all configurator components
 */
@NgModule({
	imports: [
		CommonModule,
		ProductCommonComponentModule,
		CommonPizzaPizzaModule,
		SwiperModule,
		ReactiveFormsModule
	],
	declarations: COMPONENTS,
	exports: COMPONENTS,
})
export class ConfiguratorComponentModule { }
