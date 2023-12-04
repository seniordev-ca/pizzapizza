// Angular Core
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// 3td party libs
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// ngrx TODO

// Module router
import { routes } from './checkout.routes';

// Components
import { CheckoutComponentsModule } from './components';

// Common
import { CommonPizzaPizzaModule } from '../common/common.module';

// Containers
import { GlobalCartOverlayComponent } from './containers/global-cart-overlay/global-cart-overlay.component';
import { CheckoutContainerComponent } from './containers/order-review/checkout-container.component';
import { OrderConfirmationContainerComponent } from './containers/order-confirmation/order-confirmation-container.component';
import { OrderHistoryContainerComponent } from './containers/order-history/order-history-container.component';
import { OrderConfirmationModalComponent } from './containers/order-confirmation-details-modal/order-confirmation-modal.component';
import { RepeatOrderContainerComponent } from './containers/repeat-order/repeat-order-container.component';

// SDK
import { BamboraLoaderService } from '../../utils/payment-methods/bambora.service';
import { VisaCheckoutService } from '../../utils/payment-methods/visa-checkout';

// User
import { UserSubContainerModule } from '../user/sub-containers/index'

// Guards
import { CanActivateCheckoutSignIn } from './guards/checkout-sign-in.guard';

export const COMPONENTS = [
	GlobalCartOverlayComponent,
	CheckoutContainerComponent,
	OrderConfirmationContainerComponent,
	OrderHistoryContainerComponent,
	OrderConfirmationModalComponent,
	RepeatOrderContainerComponent
];

@NgModule({
	declarations: [
		COMPONENTS,
	],
	imports: [
		RouterModule.forChild(routes),
		CommonModule,
		NgbModule,
		CommonPizzaPizzaModule,
		CheckoutComponentsModule,
		UserSubContainerModule
	],
	exports: [
		GlobalCartOverlayComponent
	],
	providers: [BamboraLoaderService, VisaCheckoutService, CanActivateCheckoutSignIn]
})

export class CheckoutModule {
}
