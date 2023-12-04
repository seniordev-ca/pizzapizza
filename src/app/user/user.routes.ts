
import { Routes } from '@angular/router';

import { AccountsContainerComponent } from './containers/accounts/accounts-container.component';
import { AccountActivityComponentComponent } from './containers/account-activity/account-activity.component'
import { SignInContainerComponent } from './containers/sign-in/sign-in-container.component';
import { SignUpContainerComponent } from './containers/sign-up/sign-up-container.component';
import { ClubElevenLandingComponent } from './containers/club-eleven-landing/club-eleven-landing.component';
import { ClubElevenLoyaltyComponent } from './containers/club-eleven-loyalty/club-eleven-loyalty.component';
import { ClubElevenLearnMoreComponent } from './containers/club-eleven-learn-more/club-eleven-learn-more.component';
import { ClubElevenTransferComponent } from './containers/club-eleven-transfer/club-eleven-transfer.component';
import { SignInCheckoutContainerComponent } from './containers/sign-in-checkout/sign-in-checkout-container.component';
import { CanActivateCheckoutSignIn } from 'app/checkout/guards/checkout-sign-in.guard';


export const userRouterEffectUtil = {
	isUserOnClubTransactionPage: (currentRoute: string): boolean => {
		return currentRoute.endsWith('club-eleven-eleven/activity');
	},
	isUserOnCorrectPage: (currentRoute: string, desiredRoute: string): boolean => {
		return currentRoute.endsWith(desiredRoute)
	}
}


export const routes: Routes = [
	// Every category from home page will lead to products list
	{
		path: 'account',
		component: AccountsContainerComponent
	},
	{
		path: 'sign-in',
		component: SignInContainerComponent
	},
	{
		path: 'checkout-sign-in',
		component: SignInCheckoutContainerComponent,
	},
	{
		path: 'reset-pwd',
		component: SignInContainerComponent
	},
	{
		path: 'sign-up',
		component: SignUpContainerComponent
	},
	{
		path: 'club-eleven-eleven',
		component: ClubElevenLandingComponent
	},
	{
		path: 'club-eleven-eleven/activity',
		component: AccountActivityComponentComponent
	},
	{
		path: 'club-eleven-eleven/loyalty',
		component: ClubElevenLoyaltyComponent
	},
	{
		path: 'club-eleven-eleven/learn-more',
		component: ClubElevenLearnMoreComponent
	},
	{
		path: 'club-eleven-eleven/transfer',
		component: ClubElevenTransferComponent
	},
];
