import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { OrderInfoComponent } from './order-info/order-info.component';
import { ProcessStepsComponent } from './process-steps/process-steps.component';
import { SignedOutModalComponent } from './signed-out-modal/signed-out-modal.component';
import { CommonPizzaPizzaModule } from '../../../common/common.module';
import { OrderSummaryComponent } from './order-summary/order-summary.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		CommonPizzaPizzaModule,
		RouterModule
	],
	declarations: [
		ProcessStepsComponent,
		OrderInfoComponent,
		SignedOutModalComponent,
		OrderSummaryComponent
	],
	exports: [
		ProcessStepsComponent,
		OrderInfoComponent,
		SignedOutModalComponent,
		OrderSummaryComponent
	],
})
export class OrderConfirmationComponentsModule { }
