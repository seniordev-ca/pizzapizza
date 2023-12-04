import {
	Component,
	ViewChild,
	OnDestroy,
	ViewEncapsulation
} from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';

// INTERFACES AND ENUMS
import * as modelsUserDetails from '../../models/user-personal-details';
import * as modelsUserActivities from '../../models/user-activities';
import * as modelsOrderHistory from '../../models/order-history';
import * as modelsStoreList from '../../../common/models/store-list';
import * as modelsAddressList from '../../../common/models/address-list';
import {
	UserCreditCardsActions,
	UserCreditCardsEmitterInterface
} from '../../../common/models/user-payment-methods';
import {
	ConfirmationModalComponent
} from '../../../common/components/modals/confirmation-modal/confirmation-modal.component';

import {
	RegisteredKidsClubActionsEnum,
	RegisteredKidsClubEmitterInterface,
	RegisteredKidsClubInterface,
} from '../../models/registered-kids-club';

import {
	AddressFormActionEnum,
	AddressFormEmitterInterface,
} from '../../../common/components/shared/add-address-form/add-address-form.component';
import {
	SignInInterface,
} from '../../components/sign-in/sign-in-form/sign-in-form.component';
import {
	CheckoutPaymentMethodFormInterface
} from '../../../common/components/shared/checkout-payment-method-form/checkout-payment-method-form.component';
import { UISavedCardsInterface } from '../../models/user-saved-cards';
import {
	ServerSetDefaultPaymentMethodInterface,
	ServerDefaultPaymentMethodEnum,
	ServerMealCardRequestInterface,
	ServerPaymentCardTypeEnum
} from '../../models/server-models/server-saved-cards-interfaces';
import { UniversityListInterface } from '../../../common/models/university-list';
import { OrderSummaryInterface } from '../../../checkout/models/order-checkout';

// NGRX
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as fromReducers from '../../reducers';
import * as fromCommon from '../../../common/reducers';
import * as fromCheckout from '../../../checkout/reducers';
import * as actionsAccount from '../../actions/account-actions';
import {
	UserLogsOut, FetchUserEditProfile
} from '../../actions/sign-up-actions';
import { FetchUniversityList, FetchBuildingList } from '../../../common/actions/university';
import { AddOrderToCart, ValidateRepeatOrder, ClearOrdersLoading } from '../../../checkout/actions/orders';

// Services
import { PPFormBuilderService } from '../../../common/services/form-builder.service';
import { BamboraValidationInterface, BamboraLoaderService } from '../../../../utils/payment-methods/bambora.service';
import * as fromActionsAccount from '../../../user/actions/account-actions';


const MAX_ADDRESSES = 10;
const MAX_CREDITCARDS = 5;
const MAX_MEALCARDS = 1;
@Component({
	selector: 'app-root',
	templateUrl: './accounts-container.component.html',
	styleUrls: ['./accounts-container.component.scss'],
	encapsulation: ViewEncapsulation.None,
	providers: [PPFormBuilderService]
})
export class AccountsContainerComponent implements OnDestroy {
	@ViewChild('editProfileModal', { static: true }) editProfileModalRef;
	@ViewChild('kidsClubModal', { static: true }) kidsClubModalRef;
	@ViewChild('overrideMealCardModal', { static: true }) overrideMealCardModal: ConfirmationModalComponent;
	@ViewChild('confirmDeletePayment', { static: true }) confirmDeletePayment: ConfirmationModalComponent;
	@ViewChild('confirmDeleteAddress', { static: true }) confirmDeleteAddress: ConfirmationModalComponent;
	@ViewChild('confirmDeleteStore', { static: true }) confirmDeleteStore: ConfirmationModalComponent;
	@ViewChild('searchModal', { static: true }) searchModal: ConfirmationModalComponent;
	@ViewChild('maxReachedModal', { static: true }) maxReachedModal: ConfirmationModalComponent;
	@ViewChild('cartInvalidModal', { static: true }) cartInvalidModal: ConfirmationModalComponent;
	@ViewChild('checkoutCreditCardModal', { static: true }) checkoutCreditCardModal: ConfirmationModalComponent;

	userState: SignInInterface;
	userActivitiesEnum: modelsUserActivities.UserActivities;
	accountCreditCardErrorRef;
	newCardFailedMessage$: Observable<string>;
	userActivities: modelsUserActivities.UserActivitiesInterface[] = [
		{
			title: 'Order History',
			mainIcon: 'icon-order-history-account-sized',
			actionText: 'See All',
			alternateActionText: '',
			actionIcon: 'icon-arrow-navigate',
			alternateActionIcon: '',
			actionIconBase: '',
			type: modelsUserActivities.UserActivities.orderHistory,
			isCollapsed: true,
			isCancelButtonDisplayed: false
		},
		{
			title: 'Payment Method',
			mainIcon: 'icon-credit-card',
			actionText: 'Add',
			alternateActionText: 'Cancel',
			actionIcon: 'icon-plus-2',
			alternateActionIcon: 'icon-delete',
			actionIconBase: 'icon-plus-1',
			type: modelsUserActivities.UserActivities.paymentMethods,
			isCollapsed: true,
			isCancelButtonDisplayed: false
		},
		{
			title: 'Saved Addresses',
			mainIcon: 'icon-pizza-locator',
			actionText: 'Add',
			alternateActionText: 'Cancel',
			actionIcon: 'icon-plus-2',
			alternateActionIcon: 'icon-delete',
			actionIconBase: 'icon-plus-1',
			type: modelsUserActivities.UserActivities.savedAddresses,
			isCollapsed: true,
			isCancelButtonDisplayed: false
		},
		{
			title: 'Saved Pickup Locations',
			mainIcon: 'icon-pp-speech-bubble',
			actionText: 'Add',
			alternateActionText: 'Cancel',
			actionIcon: 'icon-plus-2',
			alternateActionIcon: 'icon-delete',
			actionIconBase: 'icon-plus-1',
			type: modelsUserActivities.UserActivities.savedPickUpLocations,
			isCollapsed: true,
			isCancelButtonDisplayed: false
		}
	];

	// Kids club
	activeKidsClubUser: RegisteredKidsClubInterface;
	kidsClubUsers$: Observable<RegisteredKidsClubInterface[]>;

	// Refactored Section
	// Subscriptions
	accountSubscriptionRefs;

	// UI
	defaultAddressObject: modelsAddressList.AddressListInterface = {
		addressId: null,
		address: null,
		entrance: 'Front Door',
		contactInfo: {
			phoneNumber: null,
			type: modelsAddressList.PhoneTypeEnum.Home,
			extension: null
		},
		type: modelsAddressList.AddressTypeEnum.Home
	};
	addressFormData: FormGroup;
	isMaxReached: boolean;
	isMealCardAdded: boolean;

	checkoutPaymentForm: FormGroup;
	checkoutPaymentUI: CheckoutPaymentMethodFormInterface;
	bamboraValidation: BamboraValidationInterface;

	creditCardCount = 0;
	mealCardCount = 0;

	activeActivity: modelsUserActivities.UserActivities
	activePaymentType: ServerPaymentCardTypeEnum;
	activePaymentToken: string;
	activeAddressId: number;
	activePickupId: number;

	// Observables
	userSummary$: Observable<modelsUserDetails.UserSummaryInterface>
	savedAddresses$: Observable<modelsAddressList.AddressListInterface[]>;
	universityList$: Observable<UniversityListInterface[]>;
	buildingList$: Observable<UniversityListInterface[]>;

	savedStores$: Observable<modelsStoreList.StoreListInterface[]>;
	storeSearchResults$: Observable<modelsStoreList.StoreListInterface[]>;

	orderInfoData$: Observable<OrderSummaryInterface[]>;
	isOrdersLoading$: Observable<boolean>;
	savedCards$: Observable<UISavedCardsInterface[]>;
	defaultPaymentMethod$: Observable<ServerDefaultPaymentMethodEnum>;
	universitiesWithMealCard$: Observable<UniversityListInterface[]>

	selectedOrderID: number;
	invalidProducts$: Observable<string[]>;

	isStoreSearchLoading$: Observable<boolean>;
	isStoreSearchError$: Observable<boolean>;
	isLocationError: boolean;

	/**
	* Constructor for account container which instantiates state
	*/
	constructor(
		private confirmModal: ConfirmationModalComponent,
		private router: Router,
		private store: Store<fromReducers.UserState>,
		private commonStore: Store<fromCommon.CommonState>,
		private checkoutStore: Store<fromCheckout.CheckoutState>,
		private bamboraService: BamboraLoaderService,
		private ppFormBuilder: PPFormBuilderService
	) {
		/**
		 * Integrated Data
		 */
		this.accountSubscriptionRefs = {}
		this.checkoutPaymentUI = {
			isCreditCardSelected: false,
			isStudentCardSelected: false
		}
		this.addressFormData = this.ppFormBuilder.buildAddressForm(true);
		this.checkoutPaymentForm = this.ppFormBuilder.buildPaymentForm();

		this.bamboraValidation = this.bamboraService.getFormValidation();

		this.orderInfoData$ = this.checkoutStore.pipe(select(fromCheckout.getOrderHistory));
		this.isOrdersLoading$ = this.checkoutStore.pipe(select(fromCheckout.isOrdersLoading));

		this.userSummary$ = this.store.pipe(select(fromReducers.getLoggedInUser));
		this.savedAddresses$ = this.store.pipe(select(fromReducers.getSavedAddresses));
		this.universityList$ = this.commonStore.pipe(select(fromCommon.getUniversities));
		this.buildingList$ = this.commonStore.pipe(select(fromCommon.getBuildingList));

		this.savedStores$ = this.store.pipe(select(fromReducers.getUserStores));
		this.storeSearchResults$ = this.store.pipe(select(fromReducers.getStoreList));

		this.savedCards$ = this.store.pipe(select(fromReducers.getSavedCards));
		this.defaultPaymentMethod$ = this.store.pipe(select(fromReducers.getDefaultPaymentMethod));
		this.universitiesWithMealCard$ = this.commonStore.pipe(select(fromCommon.getUniversitiesWithMealCard))

		this.accountSubscriptionRefs.selectedAddressRef = this.store.pipe(select(fromReducers.getSelectedAddress)).subscribe(address => {
			if (address) {
				this.addressFormData = this.ppFormBuilder.updateAddressFormData(address, this.addressFormData, true, false)
			}
		});
		this.accountSubscriptionRefs.defaultPaymentMethodSubscriptionRef = this.defaultPaymentMethod$.subscribe(paymentMethod => {
			this.checkoutPaymentUI.isVisaCheckoutSelected = paymentMethod === ServerDefaultPaymentMethodEnum.VISA;
			this.checkoutPaymentUI.isMasterPassSelected = paymentMethod === ServerDefaultPaymentMethodEnum.MASTERPASS;
		})
		this.accountSubscriptionRefs.userSummarRef = this.userSummary$.subscribe(user => {
			if (user) {
				this.isMealCardAdded = user.isUserHasMealCard;
			}
		})

		this.kidsClubUsers$ = this.store.select(fromReducers.getKidsClubUsers)

		this.accountSubscriptionRefs.savedCardsRef = this.savedCards$.subscribe(cards => {
			if (cards) {
				this.creditCardCount = cards.filter(card => card.cardType !== ServerPaymentCardTypeEnum.MealCard).length;
				this.mealCardCount = cards.filter(card => card.cardType === ServerPaymentCardTypeEnum.MealCard).length
				const isCreditMaxed = this.creditCardCount >= MAX_CREDITCARDS;
				const isMealCardMaxed = this.mealCardCount >= MAX_MEALCARDS;
				this.checkoutPaymentUI.isCreditCardSelected = !isCreditMaxed;
				this.checkoutPaymentUI.isStudentCardSelected = isCreditMaxed && !isMealCardMaxed;
			}
			if (this.checkoutPaymentUI.isCreditCardSelected) {
				this.checkoutPaymentForm = this.ppFormBuilder.buildCreditCardForm(this.checkoutPaymentForm)
			} else if (this.checkoutPaymentUI.isStudentCardSelected) {
				this.checkoutPaymentForm = this.ppFormBuilder.buildPayViaStudentCardForm(this.checkoutPaymentForm);
			}
		})
		this.accountCreditCardErrorRef = this.store.pipe(select(fromReducers.getAddCardFailure))
		.subscribe(isError => {
			if (isError) {
				console.log('Error Credit Card', isError);
				this.confirmModal.onOpen(this.checkoutCreditCardModal)
			}
		})
		this.invalidProducts$ = this.store.pipe(select(fromCheckout.getInvalidProductsFromRepeatOrder))
		this.accountSubscriptionRefs.invalidOrderSubscriptionRef = this.invalidProducts$.subscribe(order => {
			if (order) {
				this.confirmModal.onOpen(this.cartInvalidModal)
			}
		})

		this.isStoreSearchLoading$ = this.store.pipe(select(fromReducers.getisStoreSearchLoading));
		this.isStoreSearchError$ = this.store.pipe(select(fromReducers.getisStoreSearchError));
		this.newCardFailedMessage$ = this.store.pipe(select(fromReducers.getAddCardFailure));

	}
	/**
	 * Angular destructor
	 */
	ngOnDestroy() {
		for (const key in this.accountSubscriptionRefs) {
			if (this.accountSubscriptionRefs[key]) {
				this.accountSubscriptionRefs[key].unsubscribe();
			}
		}
		this.accountCreditCardErrorRef.unsubscribe();
		this.bamboraService.destroy();
	}

	/**
	 * Save User Card
	 */
	_bamborbaSaveCard() {
		const nameOnCard = this.checkoutPaymentForm.get('nameOnCreditCard').value;
		const existingToken = this.checkoutPaymentForm.get('token').value;
		this.accountSubscriptionRefs.bamboraSubmitSubscriptionRef = this.bamboraService.onSubmit().subscribe(token => {
			if (token.error) {
				// TODO - How to handle error
			} else {
				const bamboraSuccessToken = {
					token: token.token,
					name: nameOnCard
				}
				this.commonStore.dispatch(new actionsAccount.AddUserCard(bamboraSuccessToken, existingToken));
			}
		})
	}

	/**
	 * Save Meal Card
	 */
	_saveMealCard() {
		const formData = this.checkoutPaymentForm.value;
		const saveCardRequest = {
			name: formData.nameOnCreditCard,
			key: formData.studentCardKey,
			number: Number(formData.studentCardNumber),
			overwrite: true
		} as ServerMealCardRequestInterface

		if (!this.isMealCardAdded) {
			this.store.dispatch(new actionsAccount.SaveMealCard(saveCardRequest))
			return false;
		}

		this.confirmModal.onOpen(this.overrideMealCardModal);
	}
	/**
	 * Confirm Override
	 */
	confirmOverride() {
		const formData = this.checkoutPaymentForm.value;
		const saveCardRequest = {
			name: formData.nameOnCreditCard,
			key: formData.studentCardKey,
			number: Number(formData.studentCardNumber),
			overwrite: true
		} as ServerMealCardRequestInterface
		this.store.dispatch(new actionsAccount.SaveMealCard(saveCardRequest))
	}

	/**
	 * User Confirms Delete Payment
	 */
	onConfirmDeletePayment() {
		if (this.activePaymentType !== ServerPaymentCardTypeEnum.MealCard) {
			this.store.dispatch(new actionsAccount.DeletePaymentMethod(this.activePaymentToken))
		} else {
			this.store.dispatch(new actionsAccount.DeleteMealCard())
		}
	}
	/**
	* Handles events and sets modal and edit states for the credit card actions a user can perform
	*/
	handleUserPaymentMethodEventEmitter(event: UserCreditCardsEmitterInterface) {
		switch (event.action) {
			case (UserCreditCardsActions.onDelete): {
				this.activePaymentType = event.paymentType;
				this.activePaymentToken = event.token;
				this.confirmModal.onOpen(this.confirmDeletePayment)

				break
			}

			case (UserCreditCardsActions.onSelect): {
				const request = {
					default_payment: {
						token: event.token,
						payment_method: event.paymentType === ServerPaymentCardTypeEnum.MealCard ?
							ServerDefaultPaymentMethodEnum.MEAL_CARD : ServerDefaultPaymentMethodEnum.WALLET
					}
				} as ServerSetDefaultPaymentMethodInterface
				this.store.dispatch(new actionsAccount.SetUserDefaultPaymentMethod(request))

				break
			}

			case (UserCreditCardsActions.onSelectVisa): {
				const request = {
					default_payment: {
						payment_method: ServerDefaultPaymentMethodEnum.VISA
					}
				} as ServerSetDefaultPaymentMethodInterface
				this.store.dispatch(new actionsAccount.SetUserDefaultPaymentMethod(request))
				break
			}

			case (UserCreditCardsActions.onSelectMasterPass): {
				const request = {
					default_payment: {
						payment_method: ServerDefaultPaymentMethodEnum.MASTERPASS
					}
				} as ServerSetDefaultPaymentMethodInterface
				this.store.dispatch(new actionsAccount.SetUserDefaultPaymentMethod(request))
				break
			}

			case (UserCreditCardsActions.onClearDefault): {
				this.store.dispatch(new actionsAccount.SetUserDefaultPaymentMethod(null))
				break
			}
			case (UserCreditCardsActions.onSaveNewCard): {
				if (this.checkoutPaymentUI.isCreditCardSelected) {
					this._bamborbaSaveCard();
					this.checkoutPaymentForm.patchValue({
						'nameOnCreditCard': '',
						'token': null
					})
				} else {
					this._saveMealCard()
				}
				this.userActivities.forEach((userActivitie) => {
					if (userActivitie.type === modelsUserActivities.UserActivities.paymentMethods) {
						userActivitie.isCollapsed = !userActivitie.isCollapsed;
						userActivitie.isCancelButtonDisplayed = !userActivitie.isCancelButtonDisplayed;
					}
				})

				break
			}
			case (UserCreditCardsActions.onEdit): {
				console.log('test', event)
				this.checkoutPaymentForm = this.ppFormBuilder.buildCreditCardForm(this.checkoutPaymentForm);
				this.checkoutPaymentForm.patchValue({
					'token' : event.token
				});
				this.checkoutPaymentUI.isCreditCardSelected = true;
				this.checkoutPaymentUI.isStudentCardSelected = false;
				this.activeActivity = modelsUserActivities.UserActivities.paymentMethods;
				this.userActivities.forEach((userActivitie) => {
					if (userActivitie.type === modelsUserActivities.UserActivities.paymentMethods) {
						userActivitie.isCollapsed = false;
						userActivitie.isCancelButtonDisplayed = true;
					}
				})
				this.bamboraService.initCustomCheckout();

				this.checkoutPaymentForm.markAsUntouched()
				break
			}

			case UserCreditCardsActions.onSelectAddStudentCard:
			case UserCreditCardsActions.onSelectAddCreditCard: {
				this.activeActivity = modelsUserActivities.UserActivities.paymentMethods;
				const isStudenCard = event.action === UserCreditCardsActions.onSelectAddStudentCard

				const isCreditCardsMaxed = !isStudenCard && this.creditCardCount >= MAX_CREDITCARDS;
				// const isMealCardMaxed = isStudenCard && this.mealCardCount >= MAX_MEALCARDS;

				this.isMaxReached = isCreditCardsMaxed

				if (!this.isMaxReached) {
					this.checkoutPaymentUI.isStudentCardSelected = isStudenCard;
					this.checkoutPaymentUI.isCreditCardSelected = !isStudenCard;
					this.checkoutPaymentForm = this.ppFormBuilder.buildCreditCardForm(this.checkoutPaymentForm);

					if (isStudenCard) {
						this.checkoutPaymentForm = this.ppFormBuilder.buildPayViaStudentCardForm(this.checkoutPaymentForm);
						this.commonStore.dispatch(new FetchUniversityList())
					}
				}

				this.checkoutPaymentForm.markAsUntouched()

				break
			}
			default: {
				console.log('No Action Selected', event)
			}

		}

		if (this.isMaxReached) {
			this.confirmModal.onOpen(this.maxReachedModal)
		}
	}

	/**
	* Personal Details Event Handler
	*/
	handlePersonalDetailsEventEmitter(event: modelsUserDetails.UserPersonalDetailsEmitterInterface) {
		switch (event.action) {
			case modelsUserDetails.UserPersonalDetailsActions.onEditProfile: {
				this.editProfileModalRef.open();
				this.store.dispatch(new FetchUserEditProfile());
				break
			}
			case modelsUserDetails.UserPersonalDetailsActions.onSignOutProfile: {
				this.store.dispatch(new UserLogsOut());
				break
			}
			default: {
				console.log('incorrect action set', event)
			}
		}
	}

	/**
	* Order History Items Event Handler
	*/
	handleOrderHistoryEventEmitter(event: modelsOrderHistory.OrderHistoryEmitterInterface) {
		if (event.action === modelsOrderHistory.OrderHistoryActionsEnum.onAddToCartClick) {
			this.selectedOrderID = event.orderId;
			this.checkoutStore.dispatch(new ValidateRepeatOrder(event.orderId))
		}
	}

	/**
	* Address Form Event Handler
	*/
	handleAddressFormEventEmitter(event: AddressFormEmitterInterface) {
		switch (event.action) {
			case AddressFormActionEnum.onSaveAddress: {
				const formData = event.formData;
				formData.isSaved = true;
				this.store.dispatch(new actionsAccount.UpdateAddressRequest(formData));
				this.userActivities.forEach((userActivitie) => {
					if (userActivitie.type === modelsUserActivities.UserActivities.savedAddresses) {
						this.addressFormData = this.ppFormBuilder.updateAddressFormData(this.defaultAddressObject, this.addressFormData, true, false)

						this.store.dispatch(new actionsAccount.GetAddressByID(null))
						userActivitie.isCollapsed = !userActivitie.isCollapsed;
						userActivitie.isCancelButtonDisplayed = !userActivitie.isCancelButtonDisplayed;
					}
				})
				break
			}
			case AddressFormActionEnum.onFetchUniversityList: {
				this.commonStore.dispatch(new FetchUniversityList())
				break
			}
			case AddressFormActionEnum.onFetchBuildingList: {
				const val = event.universityId;
				this.commonStore.dispatch(new FetchBuildingList(val))
				break
			}
			default: {
				console.log(event)
			}
		}
	}

	/**
	 * User Confirms Delete Address
	 */
	onConfirmDeleteAddress() {
		this.store.dispatch(new actionsAccount.DeleteAddressRequest(this.activeAddressId));
	}
	/**
	* Saved Addresses event handler
	*/
	handleSavedAddressesEventEmitter(event: modelsAddressList.UserSavedAddressesEmitterInterface) {
		const UserSavedAddressesActionsEnum = modelsAddressList.UserSavedAddressesActionsEnum;
		switch (event.action) {
			case UserSavedAddressesActionsEnum.onDelete: {
				this.activeAddressId = event.addressId;
				this.confirmModal.onOpen(this.confirmDeleteAddress);
				break;
			}

			case UserSavedAddressesActionsEnum.onSetDefault: {
				this.store.dispatch(new actionsAccount.SetDefaultAddress(event.addressId));
				break
			}

			case UserSavedAddressesActionsEnum.onEdit: {
				this.userActivities.forEach((userActivitie) => {
					if (userActivitie.type === modelsUserActivities.UserActivities.savedAddresses) {
						userActivitie.isCollapsed = false;
						userActivitie.isCancelButtonDisplayed = true;
					}
				})
				this.store.dispatch(new actionsAccount.GetAddressByID(event.addressId))

				break
			}

			default: {
				console.log('incorrect action', event)
			}
		}
	}

	/**
	 * Confirm that the user wants to delete the store
	 */
	onConfirmDeleteStore() {
		this.store.dispatch(new actionsAccount.UpdateStoreRequest(this.activePickupId, true));
	}
	/**
	* Store List Event Handler
	*/
	handleStoreListEventEmitter(event: modelsStoreList.UserSavedPickupLocationsEmitterInterface) {
		switch (event.action) {
			case modelsStoreList.UserSavedPickupLocationsActionsEnum.onDelete: {
				this.activePickupId = event.storeId;
				this.confirmModal.onOpen(this.confirmDeleteStore);
				break
			}
			case modelsStoreList.UserSavedPickupLocationsActionsEnum.onSetDefault: {
				this.store.dispatch(new actionsAccount.UpdateStoreRequest(event.storeId, false, true));
				break
			}
			default: {
				console.log('incorrect action provided', event)
			}
		}
	}

	/**
	 * Close Store Search Modal
	 */
	handleCloseStoreSearch() {
		this.userActivities.forEach((userActivitie) => {
			if (userActivitie.type === modelsUserActivities.UserActivities.savedPickUpLocations) {
				userActivitie.isCancelButtonDisplayed = false;
			}
		})
		this.confirmModal.onCancel();
		this.store.dispatch(new actionsAccount.ClearStoreSearch());
	}
	/**
	 * Handle Store Search
	 */
	handleStoreSearchEmitter(event) {
		if (event.error) {
			this.isLocationError = true;
			this.store.dispatch(new actionsAccount.ClearStoreSearch)
			return false
		}
		if (event.address) {
			this.store.dispatch(new actionsAccount.SearchForStores(event.address));
		}
		switch (event.action) {

			case modelsStoreList.UserSavedPickupLocationsActionsEnum.onSelect: {
				this.handleCloseStoreSearch();

				this.store.dispatch(new actionsAccount.UpdateStoreRequest(event.storeId));
				break
			}
		}
	}

	/**
	* Store List Event Handler
	*/
	handleUserActivityEventEmitter(event: modelsUserActivities.UserActivitiesEmitterInterface) {
		this.isMaxReached = false;
		const eventType = event.type;
		const eventCount = event.activityLength;
		this.activeActivity = eventType;
		const selectedActivity = this.userActivities.find(activity => activity.type === eventType);
		switch (eventType) {
			case modelsUserActivities.UserActivities.paymentMethods: {
				const isCreditCardsMaxed = this.creditCardCount >= MAX_CREDITCARDS && !selectedActivity.isCancelButtonDisplayed;
				const isMealCardMaxed = this.mealCardCount >= MAX_MEALCARDS && !selectedActivity.isCancelButtonDisplayed;

				this.isMaxReached = isCreditCardsMaxed && isMealCardMaxed

				if (isCreditCardsMaxed && !isMealCardMaxed) {
					this.checkoutPaymentUI.isCreditCardSelected = false;
					this.checkoutPaymentUI.isStudentCardSelected = true;
					this.commonStore.dispatch(new FetchUniversityList())
					this.checkoutPaymentForm = this.ppFormBuilder.buildPayViaStudentCardForm(this.checkoutPaymentForm);
				} else if (!isCreditCardsMaxed) {
					this.checkoutPaymentForm = this.ppFormBuilder.buildCreditCardForm(this.checkoutPaymentForm);
					this.checkoutPaymentUI.isCreditCardSelected = true;
					this.checkoutPaymentUI.isStudentCardSelected = false;
				}

				if (!isCreditCardsMaxed && selectedActivity.isCollapsed) {
					this.bamboraService.initCustomCheckout();
				}

				this.checkoutPaymentForm.markAsUntouched();

				break
			}
			case modelsUserActivities.UserActivities.savedAddresses: {
				this.addressFormData = this.ppFormBuilder.updateAddressFormData(this.defaultAddressObject, this.addressFormData, true, false)
				this.store.dispatch(new actionsAccount.GetAddressByID(null));

				this.isMaxReached = eventCount >= MAX_ADDRESSES
					&& !selectedActivity.isCancelButtonDisplayed
				break
			}
			case modelsUserActivities.UserActivities.savedPickUpLocations: {
				// selectedActivity.isCollapsed = !selectedActivity.isCollapsed;
				// selectedActivity.isCancelButtonDisplayed = !selectedActivity.isCancelButtonDisplayed;
				this.isMaxReached = eventCount >= MAX_ADDRESSES
					&& !selectedActivity.isCancelButtonDisplayed;
				if (!this.isMaxReached) {
					this.confirmModal.onOpen(this.searchModal, 'store-search-modal-container');
				}
				break
			}
			case modelsUserActivities.UserActivities.orderHistory: {
				if (eventCount > 0) {
					this.router.navigate(['/checkout/order-history']);
				} else if (eventCount < 1) {
					this.router.navigate(['/']);
				}
				break
			}
			default: {
				console.log('incorrect activity provided')
			}
		}

		// TODO refactor me
		// Can we simplify code below?
		if (!this.isMaxReached) {
			selectedActivity.isCollapsed = !selectedActivity.isCollapsed;
			selectedActivity.isCancelButtonDisplayed = !selectedActivity.isCancelButtonDisplayed;
		}

		this.userActivities = this.userActivities.map(activity => {
			return activity.type === selectedActivity.type ? selectedActivity : activity;
		})

		if (this.isMaxReached) {
			this.confirmModal.onOpen(this.maxReachedModal)
		}
	}

	/**
	* Registered Kids Club Event Handler
	*/
	handleRegisteredKidsClubEventEmitter(event: RegisteredKidsClubEmitterInterface) {
		switch (event.action) {
			case RegisteredKidsClubActionsEnum.onAddChild:
			case RegisteredKidsClubActionsEnum.onEditChild: {
				this.activeKidsClubUser = event.kidsClubUser;
				this.kidsClubModalRef.open();
				break
			}
			default: {
				console.log('incorrect action provided', event)
			}
		}
	}

	/**
	 * We need to clear activeKidsClubUser on Modal Close
	 */
	handleKidsClubModalClose(isClosed) {
		if (isClosed) {
			this.activeKidsClubUser = null
		}
	}

	/**
	 * Add Order To cart
	 */
	onConfirmChangeClickHandler(addToCart: boolean) {
		if (!addToCart) {
			this.store.dispatch(new ClearOrdersLoading());
			this.selectedOrderID = null;
			return false;
		}
		this.store.dispatch(new AddOrderToCart(this.selectedOrderID))
		this.selectedOrderID = null;
	}

	/**
	 * Handle Store Search on Retry
	 */
	handleRetryLocationEmitter(event) {
		this.isLocationError = false;
		this.store.dispatch(new actionsAccount.ClearStoreSearch());
	}
	/**
	  * Handle when user gets notified about failure to add credit card
	  */
	handleCreditCardFailure() {
		this.store.dispatch(new fromActionsAccount.ClearCardFailureMessage())
	}
}
