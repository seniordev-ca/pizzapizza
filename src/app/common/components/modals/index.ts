import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
	ReactiveFormsModule
} from '@angular/forms';
import { RouterModule } from '@angular/router';



// Modal components
import { ConfirmationModalComponent } from './confirmation-modal/confirmation-modal.component';
import { PromptModalComponent } from './prompt-modal/prompt-modal.component';
import { VerticalModalComponent } from './vertical-modal/vertical-modal.component';
import { ModalInfoHeaderComponent } from './vertical-modal/vertical-modal-headers/modal-info-header/modal-info-header.component';
import { ModalSimpleHeaderComponent } from './vertical-modal/vertical-modal-headers/modal-simple-header/modal-simple-header.component';

// Import shared module
import { CommonSharedComponentsModule } from '../shared';


export const COMPONENTS = [
	ConfirmationModalComponent,
	PromptModalComponent,
	VerticalModalComponent,
	ModalInfoHeaderComponent,
	ModalSimpleHeaderComponent
];

@NgModule({
	imports: [
		RouterModule,
		CommonModule,

		CommonSharedComponentsModule,

		ReactiveFormsModule
	],
	declarations: COMPONENTS,
	exports: COMPONENTS,
	entryComponents: [COMPONENTS]
})
export class CommonModalsComponentsModule { }
