import {
	Component,
	ViewEncapsulation,
	ViewChild,
	AfterViewInit,
	ElementRef,
	Renderer2,
	OnDestroy
} from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
// NgRx
import { Store, select } from '@ngrx/store';
import * as fromCatalog from '../../reducers';
import {
	SendPizzaAssistantMessage,
	OpenPizzaAssistantProductInModal,
	RemoveProductFromPizzaAssistant,
	ClearPizzaAssistant
} from '../../actions/pizza-assistant';
import { Observable } from 'rxjs';
import { Product } from '../../models/product';
import { ProductItemEmitterInterface, ProductItemActionsEnum } from '../../components/common/product-item/product-item.component';
import { SpeechService } from '../../../../utils/app-speech-recognition';

// actions
import { LocationsDataLayer, CommonObjectUpdateData } from '../../../common/actions/tag-manager'
import { ServerPizzaAssistantCombo } from 'app/catalog/models/server-pizza-assistant';
import { ConfirmationModalComponent } from 'app/common/components/modals/confirmation-modal/confirmation-modal.component';
import { Router } from '@angular/router';

@Component({
	selector: 'app-pizza-assistant-open',
	templateUrl: './pizza-assistant.component.html',
	styleUrls: ['./pizza-assistant.component.scss'],
	encapsulation: ViewEncapsulation.None,
	providers: [SpeechService]
})

class PizzaAssistantComponent implements AfterViewInit, OnDestroy {
	@ViewChild('messageInput', { static: false }) messageInput: ElementRef;
	@ViewChild('verticalModalConfigurator', { static: true }) configuratorVerticalModalRef;
	@ViewChild('guardModalForNormal', { static: true }) guardModalForNormal: ConfirmationModalComponent;


	configModalOpen: boolean;
	messageForm: FormGroup;
	isVerticalModalOpen: boolean;
	isVerticalCompModalOpen: boolean;


	assistantMessage$: Observable<string>;
	assistantProducts$: Observable<Product[]>;
	isLoading$: Observable<boolean>
	isPAHelpConfigLoaded$: Observable<boolean>
	isChatActive: boolean;
	isSpeechAvailable: boolean;
	speechSubscriptionRef;
	isDoneButtonValid$: Observable<boolean>;
	helpConfigData$: Observable<string[]>;
	comboProduct$: Observable<ServerPizzaAssistantCombo>;

	assistantProductsRef;
	assistantMessageRef;
	isNavigationBlockedByLeaveConfirmModal: boolean;
	nextStateUrl: string;

	constructor(
		private fb: FormBuilder,
		private renderer: Renderer2,
		private store: Store<fromCatalog.CatalogState>,
		private speech: SpeechService,
		private confirmModal: ConfirmationModalComponent,
		private router: Router
	) {
		this.configModalOpen = false;
		this.messageForm = this.fb.group({
			'message': new FormControl(null, Validators.compose([Validators.required]))
		})
		this.isVerticalModalOpen = false;
		this.isVerticalCompModalOpen = false;
		this.assistantMessage$ = this.store.pipe(select(fromCatalog.getPizzaAssistantMessage));
		this.assistantProducts$ = this.store.pipe(select(fromCatalog.getPizzaAssistantProducts));
		this.isLoading$ = this.store.pipe(select(fromCatalog.getIsPizzaAssistantLoading));
		this.isPAHelpConfigLoaded$ = this.store.pipe(select(fromCatalog.getPizzaAssistantHelpConfigLoaded));
		this.helpConfigData$ = this.store.pipe(select(fromCatalog.getPizzaAssistantHelpConfig));
		this.isDoneButtonValid$ = this.store.pipe(select(fromCatalog.isDoneButtonValid));

		this.comboProduct$ = this.store.pipe(select(fromCatalog.getPizzaAssistantCombo));
		this.assistantMessageRef = this.assistantMessage$.subscribe(message => {
			if (message) {
				this.messageForm.reset();
			}
		});

		this.assistantProductsRef = this.assistantProducts$.subscribe(products => {
			this.isNavigationBlockedByLeaveConfirmModal = products && products.length > 0;
		})
		// uncomment this line to activate speech if available
		// this.isSpeechAvailable = this.speech.isSpeechAvailable();

	}

/**
 * Catch verticalModalConfiguratorEventHandler emits
 */
	checkIfModalOpen(event) {

		if (event.isClose) {
			this.isVerticalModalOpen = false;
		} else { this.isVerticalModalOpen = true;
		}
	}

	/**
 * Catch checkIfPizzaAssistantCompModalOpen emits
 */
	checkIfPizzaAssistantCompModalOpen(event) {
		if (event.isClose) {
			this.isVerticalCompModalOpen = false;
		} else { this.isVerticalCompModalOpen = true;
		}
	}

	/**
	 * After View Init we need to set the input to focus
	 */
	ngAfterViewInit() {
		this.renderer.selectRootElement(this.messageInput.nativeElement).focus();
		document.body.classList.toggle('pizza-assistant-open');
	}

	/**
	 * Submit form
	 */
	onFormSubmit() {
		const message = this.messageForm.get('message').value.toLowerCase()
		this.store.dispatch(new SendPizzaAssistantMessage(message))
	}

	/**
	 * Open Product
	 */
	onProductClick(lineId: number, isCustomizationAllowed: boolean) {
		if (isCustomizationAllowed) {
			this.store.dispatch(new OpenPizzaAssistantProductInModal(lineId));
			this.configuratorVerticalModalRef.open();
			this.isVerticalModalOpen = true;
		}
	}

	/**
	 * Remove Product
	 */
	onProductClose(lineId: number) {
		this.store.dispatch(new RemoveProductFromPizzaAssistant(lineId))
	}
	/**
	 * Handle data for tag analytics
	 */
	handleTagAnalytics(event) {
		const data = {
			event: 'productClick',
			ecommerce: {
				click: {
					actionField: {
						list: 'Menu'
					},
					products: [{
						name: event.name,
						id: `${event.productId}`,
						brand: event.isAddableToCartWithoutCustomization ? 'default' : 'customized',
						category: 'undefined',
						position: event.sequence ? event.sequence : 'undefined'
					}]
				}
			}
		}
		if (!event.lineId) {
			this.store.dispatch(new CommonObjectUpdateData(data, 'customizeBtnClick'));
		} else if (event.lineId && event.pizzaAssistantLabel) {
			this.store.dispatch(new CommonObjectUpdateData(data, 'pizzaAssistant'));
		}
	}
	/**
	 * Handler for the product list
	 */
	productListEventHandler(event: ProductItemEmitterInterface) {
		switch (event.action) {
			case (ProductItemActionsEnum.onCustomizeButtonClick): {
				const lineId = event.lineId;
				this.store.dispatch(new OpenPizzaAssistantProductInModal(lineId));
				this.configuratorVerticalModalRef.open();
				this.handleTagAnalytics(event)
				break
			}
		}
	}

	/**
	 * Handle help click for tag manager
	 */
	handleHelpClickEvent() {
		this.store.dispatch(new LocationsDataLayer('helpassistant', 'Help clicks', ''))
		this.isVerticalModalOpen = true;
	}

	/**
	 * Handle 'I am done' click for tag manager
	 */
	handleIamDoneClickEvent() {
		this.store.dispatch(new LocationsDataLayer('doneassistant', 'Views of suggestions', 'I\'m done'))
	}
	/**
	 * Destroy
	 */
	ngOnDestroy() {
		this.isChatActive = false;
		this.speech.DestroySpeechObject();
		if (this.speechSubscriptionRef) {
			this.speechSubscriptionRef.unsubscribe();
		}
		this.assistantProductsRef.unsubscribe();
		this.assistantMessageRef.unsubscribe();
		document.body.classList.toggle('pizza-assistant-open');
		this.isVerticalModalOpen = false;
	}


	/**
	 * activate speech
	 */
	activateSpeechStart(event): void {
		event.preventDefault();
		if (this.isChatActive) {
			this.isChatActive = false;
			this.speech.DestroySpeechObject();
			this.speechSubscriptionRef.unsubscribe();
		} else {
			this.isChatActive = true;
			this.speechSubscriptionRef = this.speech.record()
				.subscribe(
					// listener
					(value) => {
						console.log(value)
						this.messageForm.get('message').patchValue(value);
						this.onFormSubmit();
					},
					// error
					(err) => {
						console.log(err);
						if (err.error === 'no-speech') {
							// this.activateSpeechStart(null);
						}
					},
					// end
					() => {
						console.log('end chat');
						this.isChatActive = false;
					});
		}
	}


	/**
	 * Method is used by can-leave-configurator guard
	 */
	isNavChangeConfirmationModalRequired() {
		return this.isNavigationBlockedByLeaveConfirmModal;
	}

	/**
	 * On user agreed to loose not saved configuration from can-leave-configurator guard
	 */
	onLeaveModalConfirmed() {
		// This action will update isNavigationBlockedByLeaveConfirmModal to activate navigation
		this.store.dispatch(new ClearPizzaAssistant());

	}
	/**
	 * Confirm Leave Attempt
	 */
	confirmLeaveAttempt() {
		this.onLeaveModalConfirmed();
		this.router.navigate([this.nextStateUrl]);
	}
	/**
	 * Cancel Leave Attempt
	 */
	cancelLeaveAttempt() {
	}

	/**
	 * On Leave Leave Attempt
	 */
	onLeaveAttempt(nextStateUrl: string) {
		this.nextStateUrl = nextStateUrl;
		this.confirmModal.onOpen(this.guardModalForNormal);
	}


}

export {
	PizzaAssistantComponent
}
