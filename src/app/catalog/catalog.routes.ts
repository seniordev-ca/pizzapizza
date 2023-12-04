import { Routes } from '@angular/router';

import { ConfiguratorContainerComponent } from './containers/configurator/configurator-container.component';
import { ProductsContainerComponent } from './containers/product-category/product-category.component';
import { ProductComboContainerComponent } from './containers/product-combo/product-combo-container.component';
import { PizzaAssistantComponent } from './containers/pizza-assistant/pizza-assistant.component';
import { JustForYouProductContainerComponent } from './containers/just-for-you-products/just-for-you-products-container.component'
import { JustForYouProductListContainerComponent } from './containers/just-for-you-list/just-for-you-list.component';
import { MyPizzasContainerComponent } from './containers/my-pizzas/my-pizzas.component'
import { CanDeactivateAddProductGuard } from './guards/can-leave-configurator.guard';

export const routes: Routes = [
	{
		path: 'products/:productSlug',
		component: ProductsContainerComponent
	},
	{
		path: 'products/:productSlug/store',
		redirectTo: 'products/:productSlug',
		pathMatch: 'full'
	},
	{
		path: 'products/:productSlug/store/:storeId/:deliveryType',
		component: ProductsContainerComponent
	},
	{
		path: 'products',
		redirectTo: '/',
		pathMatch: 'full'
	},
	{
		path: 'config/:singleProductId',
		component: ConfiguratorContainerComponent,
		// canDeactivate: [CanDeactivateAddProductGuard]
	},
	{
		path: 'config/:singleProductId/store',
		redirectTo: 'config/:singleProductId',
		pathMatch: 'full'
	},
	{
		path: 'config/:cartItemId/:singleProductId',
		component: ConfiguratorContainerComponent,
		// canDeactivate: [CanDeactivateAddProductGuard]
	},
	{
		path: 'config/:cartItemId/:singleProductId/store',
		redirectTo: 'config/:cartItemId/:singleProductId',
		pathMatch: 'full'
	},
	{
		path: 'config/:singleProductId/store/:storeId/:deliveryType',
		component: ConfiguratorContainerComponent,
		// canDeactivate: [CanDeactivateAddProductGuard]
	},
	{
		path: 'config/:cartItemId/:singleProductId/store/:storeId/:deliveryType',
		component: ConfiguratorContainerComponent,
		// canDeactivate: [CanDeactivateAddProductGuard]
	},
	{
		path: 'config/',
		redirectTo: '/',
		pathMatch: 'full'
	},
	{
		path: 'product-combo/:comboId/store',
		redirectTo: 'product-combo/:comboId',
		pathMatch: 'full'
	},
	{
		path: 'product-combo/:cartItemId/:comboId/store',
		redirectTo: 'product-combo/:cartItemId/:comboId',
		pathMatch: 'full'
	},
	{
		path: 'product-combo/:comboId',
		component: ProductComboContainerComponent,
		canDeactivate: [CanDeactivateAddProductGuard]
	},
	{
		path: 'product-combo/:cartItemId/:comboId',
		component: ProductComboContainerComponent,
		canDeactivate: [CanDeactivateAddProductGuard]
	},
	{
		path: 'product-combo/:comboId/store/:storeId/:deliveryType',
		component: ProductComboContainerComponent,
		canDeactivate: [CanDeactivateAddProductGuard]
	},
	{
		path: 'product-combo/:cartItemId/:comboId/store/:storeId/:deliveryType',
		component: ProductComboContainerComponent,
		canDeactivate: [CanDeactivateAddProductGuard]
	},
	{
		path: 'product-combo',
		redirectTo: '/',
		pathMatch: 'full'
	},
	{
		path: 'pizza-assistant',
		component: PizzaAssistantComponent,
		canDeactivate: [CanDeactivateAddProductGuard]
	},
	{
		path: 'just-for-you/:productSlug',
		component: JustForYouProductContainerComponent
	},
	{
		path: 'just-for-you',
		component: JustForYouProductListContainerComponent
	},
	{
		path: 'my-pizzas',
		component: MyPizzasContainerComponent
	},
	{
		path: 'my-pizzas/:singleProductId/:myPizzaId',
		component: ConfiguratorContainerComponent
	}
];
