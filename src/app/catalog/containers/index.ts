import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
	FormsModule,
	ReactiveFormsModule
} from '@angular/forms';
import { CatalogComponentsModule } from '../components';

import { CommonPizzaPizzaModule } from '../../common/common.module';
import { ProductsContainerComponent } from './product-category/product-category.component';
import { ConfiguratorContainerComponent } from './configurator/configurator-container.component';
import { ProductComboContainerComponent } from './product-combo/product-combo-container.component';
import { JustForYouProductContainerComponent } from './just-for-you-products/just-for-you-products-container.component';
import { JustForYouProductListContainerComponent } from './just-for-you-list/just-for-you-list.component';
import { MyPizzasContainerComponent } from './my-pizzas/my-pizzas.component'
import { PizzaAssistantComponent } from './pizza-assistant/pizza-assistant.component';
import { PizzaAssistantOrderModalContainerComponent } from './pizza-assistant-order-modal/pizza-assistant-order-modal';

export const CONTAINERS = [
	ProductsContainerComponent,
	ConfiguratorContainerComponent,
	ProductComboContainerComponent,
	PizzaAssistantComponent,
	JustForYouProductContainerComponent,
	JustForYouProductListContainerComponent,
	MyPizzasContainerComponent,
	PizzaAssistantOrderModalContainerComponent
];

@NgModule({
	imports: [
		CommonModule,
		CommonPizzaPizzaModule,
		CatalogComponentsModule,
		RouterModule,
		FormsModule,
		ReactiveFormsModule
	],
	declarations: CONTAINERS,
	exports: [
		CONTAINERS
	],
})
export class CatalogContainersModule { }
