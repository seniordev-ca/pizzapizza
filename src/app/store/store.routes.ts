import { Routes } from '@angular/router';

import { StoreLocatorContainerComponent } from './containers/store-locator/store-locator-container.component';

export const routes: Routes = [
	{
		path: '',
		component: StoreLocatorContainerComponent
	},
	{
		path: ':province',
		component: StoreLocatorContainerComponent
	},
	{
		path: ':province/:city',
		component: StoreLocatorContainerComponent
	},
	{
		path: ':province/:city/:storeAddress/:storeId',
		component: StoreLocatorContainerComponent
	},
];
