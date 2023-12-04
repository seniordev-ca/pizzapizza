// Angular Core
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// 3td party libs
import { SwiperModule } from 'ngx-swiper-wrapper';

// ngrx
import { EffectsModule } from '@ngrx/effects';
// import { reducers } from './reducers/index';
// import { CategoryEffects } from './effects/category';
import { ProductListEffects } from './effects/product-list';
import { ProductListService } from './services/product-list';
import { PizzaAssistantService } from './services/pizza-assistant';

import { ComboConfigEffects } from './effects/combo-config';
import { ComboConfigService } from './services/combo-config';

// Module router
import { routes } from './catalog.routes'

// Effect
import { ConfiguratorEffects } from './effects/configurator'
import { TemplateEffects } from './effects/personalized-templates';
import { MyPizzaEffects } from './effects/my-pizzas';
import { PizzaAssistantEffects } from './effects/pizza-assistant';

// Services
import { ConfiguratorService } from './services/configurator';

// Common Components
import { CommonPizzaPizzaModule } from '../common/common.module';
// Module Components
import { CatalogComponentsModule } from './components';
// Module Containers
import { CatalogContainersModule } from './containers';
// Guars
import { CanDeactivateAddProductGuard } from './guards/can-leave-configurator.guard'

@NgModule({
	imports: [
		RouterModule.forChild(routes),
		CommonModule,
		SwiperModule,
		CatalogComponentsModule,
		CommonPizzaPizzaModule,
		CatalogContainersModule,
		/**
		 * For that module effect are imported globally
		 * because module is lazy but used on a lot of pages
		 */

		/**
		 * Import effect related ONLY to configurator
		 */
		EffectsModule.forFeature([
			ConfiguratorEffects,
			ProductListEffects,
			ComboConfigEffects,
			TemplateEffects,
			MyPizzaEffects,
			PizzaAssistantEffects
		]),
	],
	providers: [
		ProductListService,
		ConfiguratorService,
		ComboConfigService,
		CanDeactivateAddProductGuard,
		PizzaAssistantService
	],
	exports: [

	]
})

export class CatalogModule {
}
