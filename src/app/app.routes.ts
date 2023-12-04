import { Routes } from '@angular/router';
import { CanActivateDeepLinkCoupon } from './guards/deeplink-coupon.guard';

export const routes: Routes = [
	{
		path: '',
		loadChildren: () => import('./home/home.module').then(m => m.HomeModule),
		canActivate: [CanActivateDeepLinkCoupon]
	},
	{
		path: 'catalog',
		loadChildren: () => import('./catalog/catalog.module').then(m => m.CatalogModule)
	},
	{
		path: 'user',
		loadChildren: () => import('./user/user.module').then(m => m.UserModule)
	},
	{
		path: 'restaurant-locator',
		loadChildren: () => import('./store/store.module').then(m => m.StoreLocatorModule)
	},
	{
		path: 'store',
		redirectTo: '/',
		pathMatch: 'full'
	},
	{
		path: 'store/:storeId',
		redirectTo: '/',
		pathMatch: 'full'
	},
	{
		path: 'store/:storeId/:deliveryType',
		loadChildren: () => import('./home/home.module').then(m => m.HomeModule),
		canActivate: [CanActivateDeepLinkCoupon]
	},
];
