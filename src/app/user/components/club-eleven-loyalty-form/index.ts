import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
	FormsModule,
	ReactiveFormsModule
} from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TextMaskModule } from 'angular2-text-mask';


import { CommonPizzaPizzaModule } from '../../../common/common.module';
import { AddFundsComponent } from './add-funds/add-funds.component';
import { PaymentInfoComponent } from './payment-information/payment-info.component';
import { BillingInfoComponent } from './billing-information/billing-info.component';
import { ConfirmEmailComponent } from './confirm-email/confirm-email.component';

export const COMPONENTS = [
	AddFundsComponent,
	PaymentInfoComponent,
	BillingInfoComponent,
	ConfirmEmailComponent
];

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		TextMaskModule,
		ReactiveFormsModule,
		NgbModule,
		CommonPizzaPizzaModule
	],
	declarations: COMPONENTS,
	exports: [ COMPONENTS ] // AccountsComponentModule
})
export class ClubElevenLoyaltyFormComponentsModule { }
