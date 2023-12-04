// Angular Core
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

// 3td party libs
import { SwiperModule } from 'ngx-swiper-wrapper';

// Module router
import { routes } from './home.routes';

// ngrx
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { CommonPizzaPizzaModule } from '../common/common.module';

// Components
import { HomeComponentsModule } from './components';
import { HomeContainerComponent } from './containers/home/home-container.component';
import { HomeSubContainersModule } from './sub-containers';

// ng rx
import { reducers } from './reducers';
import { HomeEffects } from './effects/home'
import { BannerEffect } from './effects/banner';
import { BannerService } from './services/banner';

export const COMPONENTS = [
	HomeContainerComponent,
];

@NgModule({
	declarations: COMPONENTS,
	imports: [
		RouterModule.forChild(routes),
		CommonPizzaPizzaModule,
		HomeComponentsModule,
		HomeSubContainersModule,
		SwiperModule,

		StoreModule.forFeature('home', reducers),
		EffectsModule.forFeature([
			BannerEffect,
			HomeEffects
		])
	],
	exports: [

	],
	providers: [
		BannerService
	]
})

export class HomeModule {
}
