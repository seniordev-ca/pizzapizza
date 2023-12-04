/**
 * Angular core
 */
import {
	Component,
	AfterViewInit,
	ViewEncapsulation,
	OnDestroy,
	Inject,
	PLATFORM_ID,
	LOCALE_ID,
	ViewChild,
	OnInit
} from '@angular/core';
import {
	Router,
	RouteConfigLoadStart,
	RouteConfigLoadEnd,
	NavigationEnd,
	NavigationCancel,
	NavigationError
} from '@angular/router';

import { isPlatformBrowser } from '@angular/common';
import { filter } from 'rxjs/operators';

/**
 * ngrx core
 */
import { Store, select, ActionsSubject } from '@ngrx/store';
// ngrx reducers and action
import * as fromCommon from './common/reducers';
import * as fromCheckout from './checkout/reducers';

import {
	GlobalActionsTypes
} from './common/actions/global';

/**
 * Error modal
 */
import {
	ConfirmationModalComponent
} from './common/components/modals/confirmation-modal/confirmation-modal.component';
import {
	UpdateUserCart,
	CartActionsTypes
} from './checkout/actions/cart';

import { SDKActionTypes } from './common/actions/sdk';
import { CartValidationTypes } from './common/actions/cart-validation'
import { Observable } from '../../node_modules/rxjs';
import { ServerValidationError } from './common/models/server-validation-error';
import { AccountActionTypes } from './user/actions/account-actions';
import { TagManagerService } from './common/services/tag-manager';
// import { GetPreviousCartStore } from './common/actions/store';
import { ContactLessComponent } from './contact-less/contact-less.component';
import { StoreServerInterface } from './common/models/server-store';
import { ServerValidationDetails, ValidateErrorCodeEnum } from './common/models/server-validation-error'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
	providers: [ConfirmationModalComponent],
	encapsulation: ViewEncapsulation.None
})

export class AppComponent implements AfterViewInit, OnDestroy, OnInit {
	@ViewChild('globalError', { static: true }) globalError: ConfirmationModalComponent;
	@ViewChild('addressSavedError', { static: true }) addressSavedError: ConfirmationModalComponent;
	@ViewChild('cartFailedModal', { static: true }) cartFailedModal: ConfirmationModalComponent;
	@ViewChild('cartInvalidModal', { static: true }) cartInvalidModal: ConfirmationModalComponent;
	@ViewChild('cartFullModal', { static: true }) cartFullModal: ConfirmationModalComponent;
	@ViewChild('cardValidationModal', { static: true }) cardValidationModal: ConfirmationModalComponent;

	// Showing global loader when lazy module is loading
	isLazyModuleLoading: boolean;
	// Global error state for app initial launch failure
	checkoutSubscriptionRef;
	cartSubscriptionRef;
	actionSubscriptionRef;

	isGlobalError: boolean;
	isUpdateCartFailed: boolean;
	isCartInvalid: boolean;
	isCartFull: boolean;
	isCartOverlayHidden: boolean;
	showPartialCart: boolean;
	hiddenCartRoutes: string[];
	checkoutRoute: string;
	errorMessage: string;
	validationDetails: ServerValidationDetails;
	ValidateErrorCodeEnum = ValidateErrorCodeEnum;
	verifyStore: StoreServerInterface;

	invalidCartProducts$: Observable<string>
	isAddressUndeliverable$: Observable<boolean>
	calorieText$: Observable<string>;
	isPlatformBrowser: boolean;
	selectedStore$: Observable<StoreServerInterface>;
	storeSubscription;
	storeData: StoreServerInterface;
	isZenDesk$: Observable<boolean>;
	constructor(
		private modalService: NgbModal,
		private confirmModal: ConfirmationModalComponent,
		private router: Router,
		private store: Store<fromCommon.State>,
		private actions: ActionsSubject,
		private tagManagerService: TagManagerService,
		@Inject(PLATFORM_ID) private platformId: Object,
		@Inject(LOCALE_ID) public locale: string,
	) {
		this.storeSubscription = {};
		this.hiddenCartRoutes = ['/catalog/pizza-assistant', '/user/sign-in', '/user/checkout-sign-in'];
		this.checkoutRoute = '/checkout';
		this.isPlatformBrowser = isPlatformBrowser(platformId);
		this.tagManagerService.init();
		this.isLazyModuleLoading = false;
		this.calorieText$ = this.store.pipe(select(fromCommon.getGlobalCalorieDisclaimer));

		// Show global loading ONLY when lazy module is loading
		this.router.events.subscribe((navEvent) => {
			if (navEvent instanceof RouteConfigLoadStart) {
				this.isLazyModuleLoading = true;
			} else if (navEvent instanceof RouteConfigLoadEnd) {
				this.isLazyModuleLoading = false;
			} else if (navEvent instanceof NavigationEnd) {
				try {
					document.getElementById('pre-angular').style.display = 'none';
				} catch (e) { }
			} else if (navEvent instanceof NavigationError) {
				this.confirmModal.onOpen(this.globalError)
			}
		});

		const showGlobalErrorForActions = [
			GlobalActionsTypes.AppInitialLoadFailed,
			GlobalActionsTypes.RateLimitReached,
			CartActionsTypes.ValidateCartFailed,
			CartActionsTypes.UpdateUserCartFailed,
			CartValidationTypes.ShowValidation,
			SDKActionTypes.SaveSdkProductInfoFailed,
			CartActionsTypes.TooManyItemsInCartFailure,
			AccountActionTypes.UpdateAddressRequestFailure
		]

		// Global error message if setting or get default store failed
		this.actionSubscriptionRef = this.actions.pipe(
			filter(action => {
				const type = action.type as GlobalActionsTypes | CartActionsTypes | SDKActionTypes | AccountActionTypes
				return showGlobalErrorForActions.indexOf(type) > -1
			})
		).subscribe((action) => {
			console.warn('Failed Action:', action)

			this.isUpdateCartFailed = action.type === CartActionsTypes.ValidateCartFailed || action.type === CartActionsTypes.UpdateUserCartFailed;

			if (this.isUpdateCartFailed) {
				this.confirmModal.onOpen(this.cartFailedModal)
			}

			if (action.type === CartValidationTypes.ShowValidation) {
				this.validationDetails = action['validationDetails']
				this.verifyStore = action['store'];
				this.confirmModal.onOpen(this.cardValidationModal)
			}

			this.isCartFull = action.type === CartActionsTypes.TooManyItemsInCartFailure ? true : false;
			if (this.isCartFull) {
				this.confirmModal.onOpen(this.cartFullModal)
			}

			if (action.type === AccountActionTypes.UpdateAddressRequestFailure) {
				const error = action['error'] as ServerValidationError;
				this.errorMessage = error.errors.address ? error.errors.address : null;
				this.confirmModal.onOpen(this.addressSavedError)
			}

			if (action.type === GlobalActionsTypes.AppInitialLoadFailed ||
				action.type === GlobalActionsTypes.RateLimitReached) {
				this.confirmModal.onOpen(this.globalError)
			}
		})

		this.cartSubscriptionRef = this.store.pipe(select(fromCheckout.getIsCartValid)).subscribe(isValid => {
			this.isCartInvalid = !isValid && isValid !== null ? true : false;
			if (this.isCartInvalid) {
				this.confirmModal.onOpen(this.cartInvalidModal)
			}
		});

		this.invalidCartProducts$ = this.store.pipe(select(fromCheckout.getInvalidCartProducts))

	}

	/**
	 * Close Cart Full Popup
	 */
	onCloseCartFull() {
		this.isCartFull = false;
	}
	/**
	 *  contact-less Popup
	 */
	ngOnInit() {
		if (!sessionStorage.getItem(this.locale + 'isContactLess')) {
			sessionStorage.setItem(this.locale + 'isContactLess', 'true')
			this.isZenDesk$ = this.store.pipe(select(fromCommon.getZendDeskEnable));
			this.selectedStore$ = this.store.pipe(select(fromCommon.getSelectedStore));
			this.storeSubscription.store = this.selectedStore$.subscribe(data => {
				if (data && data.store_message) {
					this.storeData = data;
					this.storeData = JSON.parse(this.storeData.store_message);
					const imageLink = this.storeData['message_box']['image_link'];
					const image = this.storeData['message_box']['image'];
					const label = this.storeData['message_box']['buttons'][0];
					const modalRef = this.modalService.open(ContactLessComponent, {
					}).componentInstance;
					modalRef.imageLink = imageLink;
					modalRef.imageUrl = image;
					modalRef.label = label['label'];
					if (modalRef.reason) {
						// tslint:disable-next-line:no-any
						modalRef.result.then((data1: any) => { modalRef.close() },
							// tslint:disable-next-line: no-any
							(reason: any) => { })
					}
				}
			})
			this.isZenDesk$.subscribe(isZenDesk => {
				this.loadZenDeskScript(isZenDesk);
			})
		}
	}
	/**
	 * TODO think about REDUX model
	 * Avoid subscribing here
	 */
	ngAfterViewInit() {
		this._subscribeOnRouteChangeForUI();
	}

	/** On destroy unsubscribe */
	ngOnDestroy() {
		if (this.checkoutSubscriptionRef) {
			this.checkoutSubscriptionRef.unsubscribe();
		}
		if (this.actionSubscriptionRef) {
			this.actionSubscriptionRef.unsubscribe();
		}
		if (this.cartSubscriptionRef) {
			this.cartSubscriptionRef.unsubscribe();
		}
	}

	/**
	 * Handler for retry button
	 */
	onRetryClickHandler() {
		if (isPlatformBrowser(this.platformId)) {
			window.location.reload();
		}
	}
	/**
	 * Handler for Update Cart Failure
	 */
	onAcceptCartUpdateFailure() {
		this.isUpdateCartFailed = false;
	}
	/**
	 * Handle user confirms store change
	 */
	onConfirmChangeClickHandler(store: StoreServerInterface, forceChange: boolean) {
		const isKeepValidationState = !forceChange;
		this.isCartInvalid = false;
		const cartOptions = {
			removeInvalid: true,
			store,
			isKeepValidationState
		}
		this.store.dispatch(new UpdateUserCart(cartOptions))
	}
	/**
	 * Validate age confirmation
	 */
	onAgeVerifyHandler(isVerified) {
		const cartOptions = {
			removeInvalid: !isVerified,
			confirmAge: isVerified,
			skipStoreUpdate: true
		}
		this.store.dispatch(new UpdateUserCart(cartOptions))
	}
	/**
	 * Handle user cancel store change
	 */
	onCancelChangeClickHandler() {
		this.isCartInvalid = false;
		// this.store.dispatch(new GetPreviousCartStore())
	}
	/**
	 * Router change listener
	 * - Hides footer rendered on server for some routes
	 * - Scrolls to top of the page on route change
	 */
	private _subscribeOnRouteChangeForUI() {
		this.router.events
			.subscribe((event) => {
				if ('url' in this.router && this.hiddenCartRoutes.indexOf(this.router.url) > -1) {
					this.isCartOverlayHidden = true;
				} else {
					this.isCartOverlayHidden = false;
				}
				if ('url' in this.router && this.router.url === this.checkoutRoute) {
					this.showPartialCart = true;
				} else {
					this.showPartialCart = false;
				}

				if (event instanceof NavigationEnd || event instanceof NavigationCancel) {
					if (isPlatformBrowser(this.platformId)) {
						window.scrollTo(0, 0);
					}
				}
			});
	}

	// Load ZenDesk script
	private loadZenDeskScript = (isZenDesk) => {
		if (isZenDesk && !document.getElementById('ze-snippet')) {
			const script = document.createElement('script');
			script.type = 'text/javascript';
			script.src = `https://static.zdassets.com/ekr/snippet.js?key=7eba262a-be1d-4c49-b51f-e778f38e1e0c`;
			script.id = 'ze-snippet';
			document.head.appendChild(script);
		}
		return null;
	}

}
