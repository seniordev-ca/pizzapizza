
// Angular core
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// ngrx lib
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

// bootstrap
import {
	NgbModule
} from '@ng-bootstrap/ng-bootstrap';

// ngrx reducers and effect
import { reducers } from './reducers';
import { GlobalEffects } from './effects/global';
import { StoreEffects } from './effects/store';
import { UniversityEffects } from './effects/university';
import { CouponEffects } from './effects/coupons';
import { CouponWalletEffects } from './effects/coupon-wallet';
import { RecommendationEffects } from './effects/recommendations';
import { LocalStorageEffects } from './effects/local-storage';
import { FooterMenuEffects } from './effects/menu';
import { TagManagerEffects } from './effects/tag-manager'

// Components
import { CommonComponentsModule } from './components';

// Containers
import { CommonWidgetsModule } from './widgets';

// Sub containers
import { CommonSubComponentsModule } from './sub-containers';

// PIPES
import { CommonPipesModule } from './pipes';

// Http client for settings fetch
import { SettingsService } from './services/settings.service';
import { StoreService } from './services/store.service';
import { UniversityService } from './services/university.service';
import { CouponService } from './services/coupon.service';
import { RecommendationService } from './services/recommendations';
import { LocalStorageService } from './services/local-storage';

// DIRECTIVES
import { ImagePreloadDirective } from './directives/image-fallback.directive';
import { SpecialCharacterDirective } from './directives/alpha-numeric.directive';
import { MoveToHeadDirective } from './directives/move-to-head.directive';
import { SafeUrlPipe } from './directives/safe-url.pipe';
import { FooterMenuService } from './services/footer-menu.service';
import { TagManagerService } from './services/tag-manager'

@NgModule({
	declarations: [
		ImagePreloadDirective,
		SpecialCharacterDirective,
		MoveToHeadDirective,
		SafeUrlPipe,
	],
	imports: [
		RouterModule.forChild([]),
		CommonModule,
		NgbModule,
		CommonPipesModule,
		CommonComponentsModule,
		CommonSubComponentsModule,

		StoreModule.forFeature('common', reducers),
		EffectsModule.forFeature([
			GlobalEffects,
			StoreEffects,
			UniversityEffects,
			CouponEffects,
			CouponWalletEffects,
			RecommendationEffects,
			LocalStorageEffects,
			FooterMenuEffects,
			TagManagerEffects
		])
	],
	exports: [
		CommonComponentsModule,
		CommonSubComponentsModule,
		CommonPipesModule,
		ImagePreloadDirective,
		SpecialCharacterDirective,
		MoveToHeadDirective,
		SafeUrlPipe,
		CommonWidgetsModule
	],
	providers: [
		SettingsService,
		StoreService,
		UniversityService,
		CouponService,
		RecommendationService,
		LocalStorageService,
		FooterMenuService,
		TagManagerService
	],
})

export class CommonPizzaPizzaModule {
}
