// App
import { AppComponent } from './app.component';

// Router
import { routes } from './app.routes';

// Angular core
import { NgModule, PLATFORM_ID, LOCALE_ID, APP_ID, Inject, Injector, ErrorHandler } from '@angular/core';
import { isPlatformBrowser, CommonModule, registerLocaleData } from '@angular/common';

import { BrowserModule, BrowserTransferStateModule, TransferState } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import localeFr from '@angular/common/locales/fr';

// NGRX core
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import {
	StoreRouterConnectingModule,
	RouterStateSerializer
} from '@ngrx/router-store';

// 3td party libs
import {
	NgbModule,
	NgbActiveModal,
	NgbModalModule
} from '@ng-bootstrap/ng-bootstrap';
import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module } from 'ng-recaptcha';

// App utils
import { GoogleMapsModule } from '../utils/google-maps/google-maps.module';
import { GoogleMapsService } from '../utils/google-maps/google-maps.service';
import { GlobalErrorHandler } from '../utils/app-js-errors-logger';
import {
	ApplicationHttpClient,
	applicationHttpClientCreator
} from '../utils/app-http-client';
import { JSLoaderService } from '../utils/app-load-script-client';

// Environment config
import { environment } from '../environments/environment';

// NGRX
import {
	reducers,
	metaReducers
} from './root-reducer/root-reducer';
import {
	CustomRouterStateSerializer
} from '../utils/app-redux-router'

// Global services
import { ApplicationLocalStorageClient } from '../utils/app-localstorage-client';
import { ApplicationSessionsStorage } from '../utils/app-session-storage';
import { ApplicationCookieClient } from '../utils/app-cookie-client';
import { AppSettingService } from '../utils/app-settings'
import { FeaturedProductService } from './catalog/services/featured-products';
import { CategoryService } from './catalog/services/category';
import { JustForYouService } from './catalog/services/just-for-you';
import { PaymentService } from './checkout/services/payment';
import { CartService } from './checkout/services/cart';
import { OrderService } from './checkout/services/orders';
import { SignUpService } from './user/services/sign-up-service';
import { Club11Service } from './user/services/club11-services';

// Global effects
import { FeaturedProductsEffects } from './catalog/effects/featured-product';
import { CategoryEffects } from './catalog/effects/category';
import { JustForYouEffects } from './catalog/effects/just-for-you';
import { CartEffect } from './checkout/effects/cart';
import { OrderEffect } from './checkout/effects/orders';
import { PaymentEffect } from './checkout/effects/payment';
import { SignUpEffects } from './user/effects/sign-up-effects';
import { AccountEffects } from './user/effects/account-effects';
import { AccountService } from './user/services/account-services';
import { Club1111Effects } from './user/effects/club1111-effects';
import { GiftCardEffects } from './user/effects/giftcard-effects';
import { LoyaltyEffect } from './checkout/effects/loyalty';
import { TipsEffect } from './checkout/effects/tips';


// Global components. NO lazy loading
import { CommonPizzaPizzaModule } from './common/common.module';
import { HeaderModule } from './header/header.module';
import { CheckoutModule } from './checkout/checkout.module';
import { StoreComponentsModule } from './store/components';

// Dev menu
// TODO configure webpack to not include this component into prod builds
import { DevInterfaceModule } from './dev-interface/dev-interface.module';
import { DevInterfaceService } from './dev-interface/dev-interface.service';

import { GiftCardService } from './user/services/gift-card-services';
import { LoyaltyService } from './checkout/services/loyalty';
import { TipsService } from './checkout/services/tips';

import { applicationWPHttpClientCreator, ApplicationWPHttpClient } from '@pp/utils/app-wp-http-client';
import { ApplicationHttpCaptcha } from '@pp/utils/app-http-captcha';
import { ApplicationHttpErrors } from '@pp/utils/app-http-errors';
import { ContactLessComponent } from './contact-less/contact-less.component';
import { MetaService } from './store/meta.service';
import { CanActivateDeepLinkCoupon } from './guards/deeplink-coupon.guard';

registerLocaleData(localeFr);

@NgModule({
	declarations: [
		AppComponent,
		ContactLessComponent
	],
	entryComponents: [ContactLessComponent],
	imports: [
		// Angular core
		CommonModule,
		HttpClientModule,
		BrowserModule.withServerTransition({ appId: 'pp-v2' }),
		BrowserTransferStateModule,
		// Bootstrap lib
		NgbModule.forRoot(),
		NgbModalModule.forRoot(),
		// Recaptcha lib
		RecaptchaV3Module,

		// Main router
		RouterModule.forRoot(routes),

		// ngrx store and effect
		StoreModule.forRoot(reducers, { metaReducers }),
		EffectsModule.forRoot([
			FeaturedProductsEffects,
			CategoryEffects,
			JustForYouEffects,
			SignUpEffects,
			AccountEffects,
			CartEffect,
			OrderEffect,
			PaymentEffect,
			Club1111Effects,
			GiftCardEffects,
			LoyaltyEffect,
			TipsEffect
		]),

		// Router -> REDUX proxy
		StoreRouterConnectingModule.forRoot({
			stateKey: 'router',
		}),

		// Not Lazy Modules
		CommonPizzaPizzaModule,
		HeaderModule,
		CheckoutModule,
		StoreComponentsModule,

		// Google SDK
		GoogleMapsModule.forRoot({
			libraries: ['places']
		}),

		// TODO include only for dev
		StoreDevtoolsModule.instrument({
			name: 'NgRx Store DevTools'
		}),

		DevInterfaceModule
	],
	providers: [
		GoogleMapsService,
		// ApplicationLocalStorageClient,
		JSLoaderService,

		FeaturedProductService,
		CategoryService,
		AppSettingService,
		JustForYouService,
		PaymentService,
		SignUpService,
		Club11Service,
		AccountService,
		CartService,
		OrderService,
		GiftCardService,
		LoyaltyService,
		TipsService,
		MetaService,

		NgbActiveModal,
		ApplicationLocalStorageClient,
		ApplicationCookieClient,
		ApplicationSessionsStorage,
		// Proxy to catch JS errors
		{
			provide: ErrorHandler,
			useClass: GlobalErrorHandler
		},

		// Proxy router for ng/rx
		{
			provide: RouterStateSerializer,
			useClass: CustomRouterStateSerializer
		},
		// ReCaptcha v3 private key
		{
			provide: RECAPTCHA_V3_SITE_KEY,
			useValue: environment.recaptchaClientKey
		},
		// MW/SSR remote integration
		{
			provide: ApplicationHttpClient,
			useFactory: applicationHttpClientCreator,
			deps: [
				HttpClient,
				DevInterfaceService,
				ApplicationSessionsStorage,
				PLATFORM_ID,
				LOCALE_ID,
				TransferState,
				ApplicationCookieClient,
				Injector
			],
		},
		// Wordpress remote integration
		{
			provide: ApplicationWPHttpClient,
			useFactory: applicationWPHttpClientCreator,
			deps: [
				HttpClient
			]
		},
		// Register captcha http interceptor
		{
			provide: HTTP_INTERCEPTORS,
			useClass: ApplicationHttpCaptcha,
			multi: true
		},
		// Register global error http interceptor
		{
			provide: HTTP_INTERCEPTORS,
			useClass: ApplicationHttpErrors,
			multi: true
		},
		// Dev service
		DevInterfaceService,
		// Guards
		CanActivateDeepLinkCoupon
	],
	bootstrap: [
		AppComponent
	]
})

export class AppModule {

	constructor(
		@Inject(PLATFORM_ID) private platformId: Object,
		@Inject(APP_ID) private appId: string
	) {
		const platform = isPlatformBrowser(platformId) ?
			'in the browser' : 'on the server';
		console.log(`Running ${platform} with appId=${appId}`);

	}
}
