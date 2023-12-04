import { ServerOrderDetailsInterface } from './server-order-details';
import { ProcessStepStatusEnum } from '../components/order-confirmation/process-steps/process-steps.component';

export interface ServerProcessOrderResponse extends ServerOrderDetailsInterface {
	phone_number: string,
	phone_number_extension?: string,
	delivery_address: string,
	tracker: [{
		status: string,
		description: string,
		title: string
	}],
	name: string,
	guarantee_text: string,
	id?: number,
	club_11_11_earnings?: string
}
export interface FutureHoursResponse {
	date: string, // yyyy-mm-dd
	day_code: number, // 0=Monday -> 6=Sunday
	times: [string]
}

export interface ServerOrderStatusResponse {
	tracker: ServerOrderStatusTrackerStep[],
	next_status_avail_in_sec: number,
	is_final_status: boolean
}

/**
 * Enum for tracker kinds
 */
export enum OrderStatusTrackerKindEnum {
	IMG = 'image',
	MAP = 'map'
}
export interface ServerOrderStatusTrackerStep {
	status: ProcessStepStatusEnum,
	description: string,
	title: string,
	kind: OrderStatusTrackerKindEnum,
	image_data: string,
	tracking_url?: string,
}
