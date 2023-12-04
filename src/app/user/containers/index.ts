import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import {
	FormsModule,
	ReactiveFormsModule
} from '@angular/forms';
import { RouterModule } from '@angular/router';

import { CommonPizzaPizzaModule } from '../../common/common.module';
import { UserComponentsModule } from '../components';
import { UserSubContainerModule } from '../sub-containers';

import { AccountsContainerComponent } from './accounts/accounts-container.component';
import { SignInContainerComponent } from './sign-in/sign-in-container.component';
import { SignUpContainerComponent } from './sign-up/sign-up-container.component';
import { ClubElevenLandingComponent } from './club-eleven-landing/club-eleven-landing.component';
import { ClubElevenLoyaltyComponent } from './club-eleven-loyalty/club-eleven-loyalty.component';
import { ClubElevenLearnMoreComponent } from './club-eleven-learn-more/club-eleven-learn-more.component';
import { AccountActivityComponentComponent } from './account-activity/account-activity.component'
import { ClubElevenTransferComponent } from './club-eleven-transfer/club-eleven-transfer.component';
import { EditProfileComponent } from './account-edit-vertical-modal/edit-profile.component';
import { KidsClubModalComponent } from './account-kids-club-vertical-modal/kids-club-modal.component';
import { SignInCheckoutContainerComponent } from './sign-in-checkout/sign-in-checkout-container.component';

// Modules

export const CONTAINERS = [
	AccountsContainerComponent,
	SignInContainerComponent,
	SignUpContainerComponent,
	ClubElevenLandingComponent,
	ClubElevenLoyaltyComponent,
	ClubElevenLearnMoreComponent,
	AccountActivityComponentComponent,
	ClubElevenTransferComponent,
	EditProfileComponent,
	KidsClubModalComponent,
	SignInCheckoutContainerComponent
];

@NgModule({
	imports: [
		NgbModule,
		FormsModule,
		ReactiveFormsModule,
		CommonModule,
		RouterModule,
		UserComponentsModule,
		UserSubContainerModule,
		CommonPizzaPizzaModule
	],
	entryComponents: [],
	declarations: CONTAINERS,
	exports: CONTAINERS
})

export class UserContainerModule { }
