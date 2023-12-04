// Angular Core
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Libs
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// Modules
import { CommonPizzaPizzaModule } from '../../common/common.module';
import { UserComponentsModule } from '../components';

// Containers
import { CouponWalletComponent } from './coupon-wallet/coupon-wallet.component'
import { BalanceVerticalModalComponent } from './balance-vertical-modal/balance-vertical-modal.component'

export const CONTAINERS = [
	CouponWalletComponent,
	BalanceVerticalModalComponent
];

@NgModule({
	imports: [
		NgbModule,
		FormsModule,
		ReactiveFormsModule,
		CommonModule,
		RouterModule,
		UserComponentsModule,
		CommonPizzaPizzaModule
	],
	entryComponents: [],
	declarations: CONTAINERS,
	exports: CONTAINERS
})

export class UserSubContainerModule { }
