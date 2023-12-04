// Angular Core
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgModule, Injectable } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// 3rd party libs
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SocialLoginModule, AuthServiceConfig, LoginOpt } from 'angularx-social-login';
import { GoogleLoginProvider, FacebookLoginProvider, LinkedInLoginProvider } from 'angularx-social-login';

// Env config
import { environment } from '../../environments/environment';

// Module router
import { routes } from './user.routes';
// Common
import { CommonPizzaPizzaModule } from '../common/common.module';

// Components
import { UserComponentsModule } from './components';
// Containers
import { UserContainerModule } from './containers';
import { UserSubContainerModule } from './sub-containers';

// REDUX
import { EffectsModule } from '@ngrx/effects';
import { SignUpEffects } from './effects/sign-up-effects';
import { SignUpService } from './services/sign-up-service';
import { AccountEffects } from './effects/account-effects';
import { AccountService } from './services/account-services';
import { Club1111Effects } from './effects/club1111-effects';
import { SocialLoginService } from './services/social-login';
import { SocialLoginEffect } from './effects/social-login-effects';
import { KidsClubEffects } from './effects/kids-club-effects';
import { KidsClubService } from './services/kids-club-service';

import { AsyncFormValidationService } from '../../utils/async-form-validation';

const fbLoginOptions: LoginOpt = {
	scope: 'email',
	return_scopes: true,
	enable_profile_selector: true
}; // https://developers.facebook.com/docs/reference/javascript/FB.login/v2.11

const googleLoginOptions: LoginOpt = {
	scope: 'profile email'
}; // https://developers.google.com/api-client-library/javascript/reference/referencedocs#gapiauth2clientconfig


const config = new AuthServiceConfig([
	{
		id: GoogleLoginProvider.PROVIDER_ID,
		provider: new GoogleLoginProvider(environment.googleOauthClientId, googleLoginOptions)
	},
	{
		id: FacebookLoginProvider.PROVIDER_ID,
		provider: new FacebookLoginProvider(environment.fbAppId, fbLoginOptions)
	},
	// {
	// 	id: LinkedInLoginProvider.PROVIDER_ID,
	// 	provider: new LinkedInLoginProvider("LinkedIn-client-Id", false, 'en_US')
	// }
]);

/**
 * Social login config
 */
export function provideConfig() {
	return config;
}

@NgModule({
	declarations: [],
	imports: [
		RouterModule.forChild(routes),

		CommonModule,
		FormsModule,
		ReactiveFormsModule,

		UserComponentsModule,
		UserContainerModule,
		UserSubContainerModule,
		NgbModule,

		CommonPizzaPizzaModule,
		SocialLoginModule,

		/**
		 * Import effects for Sign Up
		 */
		EffectsModule.forFeature([
			AccountEffects,
			SignUpEffects,
			Club1111Effects,
			SocialLoginEffect,
			KidsClubEffects
		]),
	],
	exports: [
	],
	providers: [
		NgbActiveModal,
		SignUpService,
		AccountService,
		SocialLoginService,
		KidsClubService,
		AsyncFormValidationService,
		{
			provide: AuthServiceConfig,
			useFactory: provideConfig
		},
		// FacebookLoginProvider,
	]
})

export class UserModule {
}
