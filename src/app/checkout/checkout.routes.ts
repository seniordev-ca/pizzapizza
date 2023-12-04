import { Routes } from '@angular/router';

import { CheckoutContainerComponent } from './containers/order-review/checkout-container.component';
import { OrderConfirmationContainerComponent } from './containers/order-confirmation/order-confirmation-container.component';
import { OrderHistoryContainerComponent } from './containers/order-history/order-history-container.component';
import { RepeatOrderContainerComponent } from './containers/repeat-order/repeat-order-container.component';
import { CanActivateCheckoutSignIn } from './guards/checkout-sign-in.guard';

export const routes: Routes = [
	{
		path: 'checkout',
		component: CheckoutContainerComponent,
		canActivate: [CanActivateCheckoutSignIn]
	},
	{
		path: 'checkout/order-confirmation/:orderId',
		component: OrderConfirmationContainerComponent
	},
	{
		path: 'checkout/order-confirmation',
		redirectTo: '/',
		pathMatch: 'full'
	},
	{
		path: 'checkout/order-history',
		component: OrderHistoryContainerComponent
	},
	{
		path: 'checkout/repeat-last-order',
		component: RepeatOrderContainerComponent
	}
];
