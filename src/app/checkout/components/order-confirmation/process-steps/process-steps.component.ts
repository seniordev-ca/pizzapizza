import {
	Component,
	Input,
	ViewEncapsulation,
	OnInit
} from '@angular/core';
import { OrderStatusTrackerKindEnum } from '../../../models/server-process-order-response';

/**
 * Defines Process active status
 */
enum ProcessStepStatusEnum {
	onWaiting = 'pending',
	onActive = 'in_progress',
	onComplete = 'done',
	onError = 'error'
}

/**
 * Defines Process step interface
 */
interface ProcessStepsEmitterInterface {
	status: ProcessStepStatusEnum | string,
	orderId: number,
	title: string,
	subtitle: string,
	image: string,
	kind: OrderStatusTrackerKindEnum,
	tracking_url?: string,
}

/**
* Decorators for the Process Steps Component
*/
@Component({
	selector: 'app-process-steps',
	templateUrl: './process-steps.component.html',
	styleUrls: ['./process-steps.component.scss'],
	encapsulation: ViewEncapsulation.None,
})

/**
* Process Steps Component
*/
class ProcessStepsComponent implements OnInit {
	@Input() processStepsArray: Array<ProcessStepsEmitterInterface>;
	activeItem: Array<ProcessStepsEmitterInterface>;
	processStatusEnum = ProcessStepStatusEnum;

	constructor() {
	}
	/**
	 * OnInit
	 */
	ngOnInit() {
		this.activeItem = this.processStepsArray.filter(
			item => item.status === ProcessStepStatusEnum.onActive);
	}

}

export {
	ProcessStepsEmitterInterface,
	ProcessStepStatusEnum,
	ProcessStepsComponent
}
