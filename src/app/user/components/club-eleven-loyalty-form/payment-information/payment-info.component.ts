import {
	Component,
	Input,
	Output,
	EventEmitter,
	AfterViewInit,
	OnDestroy,
	ViewEncapsulation
} from '@angular/core';
import {
	FormGroup,
} from '@angular/forms';
import { BamboraValidationInterface } from '../../../../../utils/payment-methods/bambora.service';
import {
	AsyncFormValidationService
} from '../../../../../utils/async-form-validation';

@Component({
	selector: 'app-payment-info',
	templateUrl: './payment-info.component.html',
	styleUrls: ['./payment-info.component.scss'],
	encapsulation: ViewEncapsulation.None
})


export class PaymentInfoComponent implements AfterViewInit, OnDestroy {
	@Input() parentForm: FormGroup;
	@Input() bamboraValidation: BamboraValidationInterface;
	@Input() isAutoReload: boolean;
	@Output() isOpenEvent: EventEmitter<boolean>
	= new EventEmitter<boolean>();

	isTooltipOpen = false;

	constructor(public formValidationService: AsyncFormValidationService) {
	}

	/**
	 * In order to mount bambora we need to emit an event when component is loaded
	 */
	ngAfterViewInit() {
		this.isOpenEvent.emit(true)
	}

	/**
	 * We might need to unmount on destroy
	 */
	ngOnDestroy() {
		this.isOpenEvent.emit(false)
	}
}
