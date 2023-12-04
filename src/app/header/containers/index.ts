// Angular core
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
	ReactiveFormsModule
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TextMaskModule } from 'angular2-text-mask';

// bootstrap
import {
	NgbModule
} from '@ng-bootstrap/ng-bootstrap';

// Global import
import { CommonPizzaPizzaModule } from '../../common/common.module';

// Sub Modules
import { HeaderSubContainers } from '../sub-containers';

// Components
import { HeaderComponentsModule } from '../components';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { LocationModalComponent } from './location-modal/location-modal.component';
import { FilterSimilarAddresses } from '../pipes/filter-similar.pipe';


// Common container module
export const COMPONENTS = [
	HeaderComponent,
	FooterComponent,
	LocationModalComponent,
	FilterSimilarAddresses
];

@NgModule({
	imports: [
		RouterModule,
		CommonModule,
		NgbModule,
		ReactiveFormsModule,
		TextMaskModule,
		CommonPizzaPizzaModule,
		HeaderSubContainers,
		HeaderComponentsModule,
	],
	entryComponents: [LocationModalComponent],
	declarations: COMPONENTS,
	exports: COMPONENTS
})
export class HeaderContainersModule { }
