import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';

import { SwiperModule } from 'ngx-swiper-wrapper';

import { AdBannerComponent } from './ad-banner/ad-banner.component';
import { AppPromotionComponent } from './app-promotion/app-promotion.component';
import { PizzaAssistantComponent } from './pizza-assistant/pizza-assistant.component';
import { FeaturedProductsComponent } from './featured-products/featured-products.component';
import { RecommendationsComponent } from './recommendations/recommendations.component';
import { CategoryCardComponent } from './menu/category-card/category-card.component';
import { MenuComponent } from './menu/menu.component';


// Common
import { CommonPizzaPizzaModule } from '../../common/common.module';


const COMPONENTS = [
	AdBannerComponent,
	AppPromotionComponent,
	PizzaAssistantComponent,
	FeaturedProductsComponent,
	RecommendationsComponent,
	CategoryCardComponent,
	MenuComponent
]

@NgModule({
	imports: [
		CommonModule,
		SwiperModule,
		NgbModule,
		RouterModule,
		CommonPizzaPizzaModule
	],
	declarations: COMPONENTS,
	exports: COMPONENTS,
})
export class HomeComponentsModule { }
