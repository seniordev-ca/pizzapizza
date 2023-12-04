import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
	FormsModule,
	ReactiveFormsModule
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TextMaskModule } from 'angular2-text-mask';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// Module components
// import { AddCouponComponent } from './add-coupon/add-coupon.component';
import { AddressListComponent } from './address-list/address-list.component';
import { InvalidMessageComponent } from './invalid-message/invalid-message.component';
import { MobileLandscapeMessageComponent } from './mobile-landscape-message/landscape-message.component';
import { PaymentMethodComponent } from './payment-method/payment-method.component';
import { StoreListComponent } from './store-list/store-list.component';
import { SubHeaderNavigationComponent } from './sub-header-navigation/sub-header-navigation.component';

import { StyledDropdownComponent } from './styled-dropdown/styled-dropdown.component';
import { AddressAutoCompleteComponent } from './address-search-input/address-search.component'
import { AddAddressFormComponent } from './add-address-form/add-address-form.component';
import { AddPickUpLocationFormComponent } from './add-pick-up-location-form/add-pick-up-location-form.component';
import { CheckoutPaymentMethodFormComponent } from './checkout-payment-method-form/checkout-payment-method-form.component';
import { CommonPipesModule } from '../../pipes';
import { AsyncFormValidationService } from '../../../../utils/async-form-validation';

import { StoreSearchModalComponent } from './store-search-modal/store-search-modal.component';
import {CheckoutTipsFormComponent} from './checkout-tips-form/checkout-tips-form.component';
import { InPageMessageComponent } from './in-page-message/in-page-message.component';
// 3td party libs


export const COMPONENTS = [
	// AddCouponComponent,
	AddressListComponent,
	InvalidMessageComponent,
	MobileLandscapeMessageComponent,
	PaymentMethodComponent,
	StoreListComponent,
	SubHeaderNavigationComponent,
	StyledDropdownComponent,
	AddressAutoCompleteComponent,
	AddAddressFormComponent,
	AddPickUpLocationFormComponent,
	CheckoutPaymentMethodFormComponent,
	StoreSearchModalComponent,
	CheckoutTipsFormComponent,
	InPageMessageComponent
];

@NgModule({
	imports: [
		RouterModule,
		CommonModule,

		FormsModule,
		ReactiveFormsModule,
		CommonPipesModule,
		TextMaskModule,
		NgbModule
	],
	declarations: COMPONENTS,
	exports: COMPONENTS,
	providers: [AsyncFormValidationService]
})
export class CommonSharedComponentsModule { }
