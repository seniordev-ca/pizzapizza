import {
	Component,
	ViewEncapsulation,
	OnInit,
	ViewChild,
	OnDestroy,
	HostBinding,
	ElementRef,
	Pipe,
	PipeTransform,
	Renderer2,
	Inject,
} from '@angular/core';

import { DomSanitizer} from '@angular/platform-browser';

import { DOCUMENT } from '@angular/common';

import {
	OrderInformationInterface,
	OrderInfoEmitterInterface,
	OrderInfoActionsEnum,
} from '../../components/order-confirmation/order-info/order-info.component';

import {
	ProcessStepsEmitterInterface,
	ProcessStepStatusEnum
} from '../../components/order-confirmation/process-steps/process-steps.component';

// NgRx
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
// Reducers
import * as fromCheckout from '../../reducers';
import * as fromUser from '../../../user/reducers';
import * as fromRoot from '../../../root-reducer/root-reducer';

import { OrderSummaryInterface, OrderTypeEnum } from '../../models/order-checkout';
import { OrderStatusTrackerKindEnum } from '../../models/server-process-order-response';
import { StoreServerInterface } from '../../../common/models/server-store';
import * as fromCommon from '../../../common/reducers';

@Component({
	selector: 'app-order-confirmation',
	templateUrl: './order-confirmation-container.component.html',
	styleUrls: ['./order-confirmation-container.component.scss'],
	encapsulation: ViewEncapsulation.None
})

export class OrderConfirmationContainerComponent implements OnInit, OnDestroy {
	@ViewChild('orderDetailsVerticalModal', { static: false }) orderDetailsVerticalModalRef;
	@ViewChild('fs', {static: false}) fs: ElementRef;
	@HostBinding('class.is-fullscreen') isFullscreen = false;
	isActive = false;
	orderTrackerStatusKindEnum;
	orderTypeEnum;
	orderInfoData$: Observable<OrderInformationInterface>;
	activeOrder$: Observable<OrderSummaryInterface>;
	isUserLoggedin$: Observable<boolean>;
	isOrderStatusError$: Observable<boolean>;

	subscriptionRefs;
	urlSafe;

	activeStep: ProcessStepsEmitterInterface;
	processStepsArray: Array<ProcessStepsEmitterInterface>;
	openSignedOutModal: boolean;
	isPreviousRouteCheckout: boolean;
	imagePath: String = './static-files/images/img_tracker.png';
	kindTracker: String = 'tracker';
	inProgressStatus: String = 'in_progress';
	selectedStore$: Observable<StoreServerInterface>;

	constructor(
		@Inject(DOCUMENT) private document: Document,
		private renderer: Renderer2,
		private userStore: Store<fromUser.UserState>,
		private store: Store<fromCheckout.CheckoutState>,
		private sanitizer: DomSanitizer,
		private stores: Store<fromCommon.State>,
	) {
		this.selectedStore$ = this.stores.pipe(select(fromCommon.getSelectedStore));
		this.orderTrackerStatusKindEnum = OrderStatusTrackerKindEnum;
		this.orderTypeEnum = OrderTypeEnum;


		this.subscriptionRefs = {};
		this.activeOrder$ = this.store.pipe(select(fromCheckout.getActiveOrder));
		this.orderInfoData$ = this.store.pipe(select(fromCheckout.getOrderStatus));
		this.subscriptionRefs.orderInfoSubscriptionRef = this.orderInfoData$.subscribe(order => {
			if (order.tracker) {
				this.processStepsArray = order.tracker;
				this.activeStep = this.processStepsArray.find(processStep => processStep.status === ProcessStepStatusEnum.onActive);
						if (this.activeStep && this.activeStep.kind && this.activeStep.kind
							=== this.kindTracker && this.activeStep.status === this.inProgressStatus) {
							this.renderer.addClass(this.document.body, this.activeStep.kind);
							this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(this.activeStep.tracking_url);
							this.openFullscreen();
						}
			}
		})
		this.subscriptionRefs.routerHistoryRef = this.store.pipe(select(fromRoot.getRouterHistory)).subscribe(history => {
			this.isPreviousRouteCheckout = history ? history[history.length - 2].url.startsWith('/checkout') : false;
		})
		this.isUserLoggedin$ = this.userStore.pipe(select(fromUser.isUserLoggedIn))
		this.subscriptionRefs.userSummaryRef = this.isUserLoggedin$.subscribe(userLoggedIn => {
			if (!userLoggedIn && !this.openSignedOutModal && this.isPreviousRouteCheckout) {
				this.openSignedOutModal = true;
			}
		})
		this.isOrderStatusError$ = this.store.pipe(select(fromCheckout.isOrderStatusFailure));
	}

	/**
	 * OnInit
	 */
	ngOnInit() {
	}
	/**
	 * Angular destructor
	 */
	ngOnDestroy() {
		this._unsubscribeFromAll();
		this.closeFullscreen();
	}
	/**
	 * Unsubscribe from all direct listenings
	 */
	private _unsubscribeFromAll() {
		for (const key in this.subscriptionRefs) {
			if (this.subscriptionRefs[key]) {
				this.subscriptionRefs[key].unsubscribe();
			}
		}
		this.openSignedOutModal = false;
	}

	/**
	* Order Summary Event Handler
	*/
	handleOrderInfoDataEventEmitter(event: OrderInfoEmitterInterface) {
		if (event.action === OrderInfoActionsEnum.onViewOrderClick) {
			this.orderDetailsVerticalModalRef.open();
		}
	}
/**
* open full screen
*/
openFullscreen(): void {
	this.renderer.addClass(this.document.body, this.activeStep.kind);
	this.isFullscreen = true;
	this.isActive = true;
}
/**
* close full screen
*/
closeFullscreen(): void {
	this.renderer.removeClass(this.document.body, this.activeStep.kind);
	this.isFullscreen = false;
	this.isActive =  false;
}

}
