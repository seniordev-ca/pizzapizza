// Angular Core
import { Injectable, Inject } from '@angular/core';
import { LOCALE_ID } from '@angular/core';

// Ng Rx
import { Store } from '@ngrx/store';
// Reactive operators
import { Effect, Actions, ofType } from '@ngrx/effects';
import { map, catchError, exhaustMap, flatMap, filter, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';
// import 'rxjs/add/observable/fromPromise';
import { State } from '../../root-reducer/root-reducer';

// Models
import {
	ProductKinds,
	ServerProductConfig
} from '../models/server-product-config';

// Actions
import {
	ServerCartResponseProductListInterface, ServerCartResponseInterface
} from '../../checkout/models/server-cart-response';

import {
	ConfiguratorActionsTypes,

	FetchProductConfig,
	FetchSingleProductSuccess,
	FetchSingleConfigurableComboSuccess,
	FetchTwinProductConfigSuccess,

	FetchProductConfigFailure,

	CopyComboProductIntoConfigurable,

	CopyServerCartToConfigurable,
	TwinProductSliderChange,

	ProductConfigurationChanged,
	ChangeProductSize,
	TwinProductSetNext
} from '../actions/configurator';

import {
	CatalogComboConfigListTypes,
} from '../actions/combo-config';

import {
	SaveSdkProductInfo,
	LoadSDKAfterConfigSuccess,
	LoadSDKFailed,
	SaveSdkProductInfoFailed,
	SDKActionTypes
} from '../../common/actions/sdk';

import {
	BuildSingleProductAddToCartRequest,
	BuildComboProductAddToCartRequest,
	BuildSingleConfigurableProductAddToCartRequest,
	BuildTwinProductAddToCartRequest,
	CartActionsTypes,
	ClearAddToCartRequest,
	AddConfigurableProductToCart
} from '../../checkout/actions/cart';

// Services
import { ConfiguratorService } from '../services/configurator';
import { Router } from '@angular/router';
import { SdkResponse } from '../models/server-sdk';
import { EditCustomizableCouponProduct } from '../../common/actions/coupons';
import { FetchPersonalizedTemplateByID } from '../actions/personalized-templates';
import { CatalogMyPizzaTypes } from '../actions/my-pizzas';
import { OrderActionsTypes } from 'app/checkout/actions/orders';

@Injectable()
export class ConfiguratorEffects {
	/**
	 * App is launched and this configurator route
	 * Take product id from URL and dispatch an action
	 */
	@Effect()
	clearCartOnConfiguratorPage = this.actions.pipe(
		filter(action =>
			action.type === '@ngrx/router-store/navigated'
			|| action.type === CartActionsTypes.FetchUserCartSuccess
			|| action.type === ConfiguratorActionsTypes.ReloadProductConfig
		),
		withLatestFrom(this.store),
		filter(([action, state]) => {
			const isAppLaunched = state.common.settings.isFetched && state.common.store.selectedStore;
			const isConfiguratorRoute = state.router.state.url.startsWith('/catalog/config');
			const routerParams = state.router.state.params;
			const isProductListRoute = state.router.state.url.startsWith('/catalog/products');
			const isComboConfigRoute = state.router.state.url.startsWith('/catalog/product-combo');
			const isMyPizzaConfigRoute = state.router.state.url.startsWith('/catalog/my-pizzas')

			const isConfigPageLoaded = (isAppLaunched && isConfiguratorRoute && routerParams.singleProductId);
			// const isCategoryPageLoaded = (isAppLaunched && isProductListRoute);
			const isComboConfigPageLoaded = (isAppLaunched && isComboConfigRoute);
			const isMyPizzaConfigPageLoaded = (isAppLaunched && isMyPizzaConfigRoute);

			return (isConfigPageLoaded || isComboConfigPageLoaded || isMyPizzaConfigPageLoaded)
		}),
		flatMap(([action, state]) => {
			return [
				new ClearAddToCartRequest()
			]
		})
	);

	@Effect()
	loadConfiguratorPage = this.actions.pipe(
		filter(action =>
			action.type === '@ngrx/router-store/navigated'
			|| action.type === CartActionsTypes.FetchUserCartSuccess
			|| action.type === ConfiguratorActionsTypes.ReloadProductConfig
			|| action.type === SDKActionTypes.InitialSDKLoadSuccess
			|| action.type === CatalogMyPizzaTypes.FetchMyPizzaListSuccess
		),
		withLatestFrom(this.store),
		filter(([action, state]) => {
			const isAppLaunched = state.common.settings.isFetched && state.common.store.selectedStore;
			const isConfiguratorRoute = state.router.state.url.startsWith('/catalog/config');
			const isMyPizzaRoute = state.router.state.url.startsWith('/catalog/my-pizzas');
			const isMyPizzasFetched = isMyPizzaRoute && state.catalog.myPizzas.isFetched;
			const routerParams = state.router.state.params;
			const isCorrectRoute = isConfiguratorRoute || isMyPizzasFetched;
			const isSDKLoaded = state.common.sdk.isFetched;
			return isAppLaunched && isCorrectRoute && routerParams.singleProductId && isSDKLoaded
		}),
		map(([action, state]) => {
			// Take product id from URL
			const productSlug = state.router.state.params.singleProductId;
			const currentStoreId = state.common.store.selectedStore.store_id;
			const catalogBaseUrls = state.common.settings.data.web_links.image_urls;
			const productFromNGRX = state.catalog.configurableItem.entities[productSlug];
			if (productFromNGRX) {

				console.log('in ngrx')

				switch (productFromNGRX.kind) {
					case ProductKinds.single:
						return new FetchSingleProductSuccess(productFromNGRX, catalogBaseUrls);

					case ProductKinds.single_configurable_combo:
						return new FetchSingleConfigurableComboSuccess(productFromNGRX, catalogBaseUrls);

					case ProductKinds.twin:
						return new FetchTwinProductConfigSuccess(productFromNGRX, catalogBaseUrls);

					default:
						return new FetchProductConfigFailure();
				}

			} else {
				return new FetchProductConfig(currentStoreId, productSlug);
			}
		})
	)

	/**
	 * Checking if product is stored in local memory and
	 * fetching product config
	 */
	@Effect()
	fetchProductConfiguration = this.actions.pipe(
		ofType(ConfiguratorActionsTypes.FetchProductConfig),
		withLatestFrom(this.store),
		filter(([action, state]) => {
			const productSlug = action['productId']
			// const currentStoreId = state.common.store.selectedStore.store_id;
			// const catalogBaseUrls = state.common.settings.data.web_links.image_urls;
			const productFromNGRX = state.catalog.configurableItem.entities[productSlug];
			const isProductInLocalMemory = productFromNGRX ? true : false;
			return !isProductInLocalMemory && productSlug;
		}),
		exhaustMap(([action, state]) => {
			return this.configuratorService
				.getProductConfig(action['storeId'], action['productId'])
				.pipe(
					map(productConfig => {
						const catalogBaseUrls = state.common.settings.data.web_links.image_urls;

						switch (productConfig.kind) {
							case ProductKinds.single:
								return new FetchSingleProductSuccess(productConfig, catalogBaseUrls);

							case ProductKinds.single_configurable_combo:
								return new FetchSingleConfigurableComboSuccess(productConfig, catalogBaseUrls);

							case ProductKinds.twin:
								return new FetchTwinProductConfigSuccess(productConfig, catalogBaseUrls);

							default:
								console.warn('Invalid product kind: ' + productConfig.kind);
								return new FetchProductConfigFailure();
						}

					}),
					catchError(error => of(new FetchProductConfigFailure()))
				)

		})
	)

	/**
	 * Navigation to index page is configurator loading failing
	 */
	@Effect({ dispatch: false })
	onFetchConfigError = this.actions.pipe(
		ofType(ConfiguratorActionsTypes.FetchProductConfigFailure),
		withLatestFrom(this.store),
		filter(([action, state]) => {
			const isAppLaunched = state.common.settings.isFetched && state.common.store.selectedStore;
			const isConfiguratorRoute = state.router.state.url.startsWith('/catalog/config');
			const isMyPizzaRoute = state.router.state.url.startsWith('/catalog/my-pizzas');
			const routerParams = state.router.state.params;
			return isAppLaunched && isConfiguratorRoute && routerParams.singleProductId
		}),
		map(() => this.router.navigate(['/']))
	)

	/**
	 * For editing mode copying product from card response into configurator
	 */
	@Effect()
	copyServerCartToConfig = this.actions.pipe(
		filter(action =>
			action.type === CartActionsTypes.BuildSingleProductAddToCartRequest
			|| action.type === CartActionsTypes.BuildTwinProductAddToCartRequest
			// || action.type === CartActionsTypes.BuildComboProductAddToCartRequest
			|| action.type === CartActionsTypes.BuildSingleConfigurableProductAddToCartRequest
		),
		withLatestFrom(this.store),
		filter(([action, state]) => {
			return !state.catalog.configurableItem.isCartProductCopiedToConfigurable;
		}),
		flatMap(([action, state]) => {
			const actionType = action['type'] as string;
			const cartProduct = action['cardProduct'] as ServerCartResponseProductListInterface;
			let currentKind = null as ProductKinds;

			switch (actionType) {
				case CartActionsTypes.BuildSingleProductAddToCartRequest: {
					currentKind = ProductKinds.single;
					break;
				}
				case CartActionsTypes.BuildTwinProductAddToCartRequest: {
					currentKind = ProductKinds.twin;
					break;
				}
				case CartActionsTypes.BuildComboProductAddToCartRequest: {
					currentKind = ProductKinds.combo;
					break;
				}
				case CartActionsTypes.BuildSingleConfigurableProductAddToCartRequest: {
					currentKind = ProductKinds.single_configurable_combo;
					break;
				}
			}
			const pushActions = [];

			if (cartProduct && cartProduct.coupon_key) {
				const key = cartProduct.coupon_key;
				const seoTitle = cartProduct.seo_title;
				pushActions.push(new EditCustomizableCouponProduct(key, seoTitle))
			}
			pushActions.push(new CopyServerCartToConfigurable(currentKind, cartProduct))

			return pushActions;
		})
	)

	/**
	 * On Edit page load twin ONLY when coming from config page "add to cart"
	 */
	@Effect()
	copyCartTwin = this.actions.pipe(
		ofType(ConfiguratorActionsTypes.CopyServerCartToConfigurable),
		withLatestFrom(this.store),
		filter(([action, store]) => {
			const routerHistory = store.router.state.history;
			const currentParams = store.router.state.params;
			const currentRoute = store.router.state.url;
			const currentIndex = routerHistory.filter(route => route.url = currentRoute)
			// todo: this seems strange but works
			const previousIndex = routerHistory[routerHistory.indexOf(currentIndex[currentIndex.length - 2]) - 1];
			const isFromSelf = previousIndex ? currentParams.singleProductId === previousIndex.params.singleProductId : false;
			const isTwin = action['productKind'] === ProductKinds.twin;
			const isCartItem = action['cardProduct'];

			return isTwin && isCartItem && isFromSelf
		}),
		map(([action, store]) => {
			const cartItem = action['cardProduct'] as ServerCartResponseProductListInterface;
			const lineId = cartItem.child_items[cartItem.child_items.length - 1].line_id
			return new TwinProductSliderChange(lineId, 2);
		})
	)

	@Effect()
	loadSDK = this.actions.pipe(
		filter(action =>
			action.type === ConfiguratorActionsTypes.FetchSingleProductSuccess
			|| action.type === ConfiguratorActionsTypes.FetchSingleConfigurableComboSuccess
			|| action.type === ConfiguratorActionsTypes.FetchTwinProductConfigSuccess
			|| action.type === CatalogComboConfigListTypes.FetchComboConfigSuccess
		),
		withLatestFrom(this.store),
		exhaustMap(([action, state]) => {
			// load SDK based on the productConfig
			const productConfig = action['serverProductConfig'];
			const comboConfig = action['productComboServerConfig'];

			let configData = null;
			try {
				configData = productConfig ? productConfig.js_data : comboConfig.js_data;
			} catch (e) {
				console.error('js data field is missing in product config');
			}
			return this.configuratorService.initProduct(configData, 'web', this.locale).pipe(
				map(sdkResponse => new LoadSDKAfterConfigSuccess()),
				catchError((error: SdkResponse) => of(new LoadSDKFailed(error)))
			)
		})
	)

	/**
	 * User is configuring item from product list
	 */
	@Effect()
	loadConfigurationFromProductList = this.actions.pipe(
		ofType(ConfiguratorActionsTypes.OpenQuickAddSingleProductModal),
		withLatestFrom(this.store),
		map(([action, state]) => {
			// Take product id from action payload
			const productSlug = action['productId'];
			const baseUrl = state.common.settings.data.web_links.image_urls;

			const currentStoreId = state.common.store.selectedStore.store_id;
			const productFromNGRX = state.catalog.configurableItem.entities[productSlug];
			if (productFromNGRX) {

				// get the first configurable product
				const serverProduct = productFromNGRX.data.products.find(product => product.allow_customization);
				// if there are more than one products regardless of customization status we will need them
				const extraProducts = productFromNGRX.data.products.filter(product => product.product_id !== serverProduct.product_id)
				serverProduct.kind = productFromNGRX.kind;
				if (productFromNGRX.kind === ProductKinds.single_configurable_combo) {
					serverProduct.name = productFromNGRX.data.combo.name;
					serverProduct.image = productFromNGRX.data.combo.image;
					// baseUrl = state.common.settings.data.web_links.image_urls;
				}
				serverProduct.extra_products = extraProducts;
				return new FetchSingleProductSuccess(
					productFromNGRX,
					baseUrl
				)
			} else {
				return new FetchProductConfig(currentStoreId, productSlug);
			}
		})
	)

	/**
	 * Copy data from combo configurator product field into configurable item
	 */
	@Effect()
	configureComboProductInModal = this.actions.pipe(
		filter(action => action.type === ConfiguratorActionsTypes.ConfigureComboProductInModal
			|| action.type === CartActionsTypes.RemoveUnavailableIngredientsFromTwinInCart),
		withLatestFrom(this.store),
		map(([action, state]) => {
			const productLineId = action['productLineId'] as number;

			const currentComboSlug = state.catalog.comboConfig.activeProductSlug;
			const fullComboServerConfig = state.catalog.comboConfig.entities[currentComboSlug] as ServerProductConfig;
			const productImageBaseUrl = state.common.settings.data.web_links.image_urls;

			// If action is edit that reducer needs current add to cart request state
			const currentComboAddToCartRequest = state.checkout.cart.addToCartRequest;

			// Product is not configured by the customer
			return new CopyComboProductIntoConfigurable(
				fullComboServerConfig,
				productImageBaseUrl,
				productLineId,
				currentComboAddToCartRequest
			)
		})
	)

	/**
	 * Revert Previous Size
	 */
	@Effect()
	revertProductSize = this.actions.pipe(
		ofType(ConfiguratorActionsTypes.RevertToPreviousSize),
		withLatestFrom(this.store),
		map(([action, store]) => {
			const previousSize = store.catalog.configurableItem.previousProductSize;
			return new ChangeProductSize(previousSize)
		})
	)
	/**
	 * Build add to cart request on any configuration change
	 * This is required for product validation via SDK and sending it to the server
	 */
	@Effect()
	buildCartRequest = this.actions.pipe(
		filter(action =>
			action.type === ConfiguratorActionsTypes.FetchSingleProductSuccess
			|| action.type === ConfiguratorActionsTypes.FetchSingleConfigurableComboSuccess
			|| action.type === ConfiguratorActionsTypes.FetchTwinProductConfigSuccess
			|| action.type === CatalogComboConfigListTypes.FetchComboConfigSuccess

			|| action.type === ConfiguratorActionsTypes.ChangeProductSize
			|| action.type === ConfiguratorActionsTypes.IncreaseConfigurableItemQuantity
			|| action.type === ConfiguratorActionsTypes.DecreaseConfigurableItemQuantity
			|| action.type === ConfiguratorActionsTypes.OptionsResetSelected
			|| action.type === ConfiguratorActionsTypes.OptionsSelectUnSelect
			|| action.type === ConfiguratorActionsTypes.OptionsSetHalfHalf
			|| action.type === ConfiguratorActionsTypes.OptionsUpdateQuantity
			|| action.type === ConfiguratorActionsTypes.OptionsUpdateDropDown
			|| action.type === ConfiguratorActionsTypes.CopyComboProductIntoConfigurable
			|| action.type === ConfiguratorActionsTypes.RemoveUnavailableToppings

			|| action.type === ConfiguratorActionsTypes.UpdateCartRequestFromPizzaAssistant
			|| action.type === CartActionsTypes.SetTwinAddToCartRequestToConfigurator
			// The below is causing issues when data is malformed
			// || action.type === StoreActionsTypes.SelectStore
		),
		withLatestFrom(this.store),
		map(([action, state]) => {
			const configuratorState = state.catalog.configurableItem;
			const storeState = state.common.store;
			const currentAddToCartRequest = state.checkout.cart.addToCartRequest;

			let productKind = configuratorState.productKind;
			const isComboPage = 'comboId' in state.router.state.params;
			if (isComboPage) {
				productKind = ProductKinds.combo;
			}
			const isMyPizzaRoute = state.router.state.url.startsWith('/catalog/my-pizzas');
			const productId = state.router.state.params.myPizzaId
			const myPizzaCartConfig = isMyPizzaRoute ? state.catalog.myPizzas.entities[productId].cart_request : null

			// Check if that is edit by URL
			const cartItemId = Number(state.router.state.params.cartItemId);
			const serverCart = state.checkout.cart.serverCart;
			const cardProductByCartItemId = serverCart ? serverCart.products.find(product => product.cart_item_id === cartItemId) : null
			// If URL is under edit mode, find product in server cart response
			let cardProduct = myPizzaCartConfig;
			if (cardProductByCartItemId) {
				if (!cardProductByCartItemId && cartItemId) {
					const basePath = isComboPage ? 'product-combo' : 'config';
					const seoTitle = isComboPage ? state.router.state.params.comboId : state.router.state.params.singleProductId;
					console.error(`CRITICAL | No product in cart with cart id: ${cartItemId}`);
					this.router.navigate([`/catalog/${basePath}/${seoTitle}`]);
				}
				cardProduct = cardProductByCartItemId;
			}

			switch (productKind) {
				case ProductKinds.single:
					return new BuildSingleProductAddToCartRequest(
						configuratorState,
						storeState,
						currentAddToCartRequest,
						cardProduct
					);

				case ProductKinds.combo:
					const currentComboSlug = state.catalog.comboConfig.activeProductSlug;
					const currentComboConfig = state.catalog.comboConfig.entities[currentComboSlug];

					return new BuildComboProductAddToCartRequest(
						currentComboConfig,
						configuratorState,
						storeState,
						currentAddToCartRequest,
						cardProduct
					);

				case ProductKinds.single_configurable_combo:
					return new BuildSingleConfigurableProductAddToCartRequest(
						configuratorState,
						storeState,
						currentAddToCartRequest,
						cardProduct
					);

				case ProductKinds.twin:
					return new BuildTwinProductAddToCartRequest(
						configuratorState,
						storeState,
						currentAddToCartRequest,
						cardProduct
					);

				default:
					console.error('CRITICAL | Invalid product kind -->', productKind);
			}

		})
	)

	/**
	 * Run SDK Get Product Info
	 */
	@Effect()
	updateViewBasedOnSDK = this.actions.pipe(
		filter(action =>
			action.type === CartActionsTypes.BuildSingleProductAddToCartRequest
			|| action.type === CartActionsTypes.BuildSingleConfigurableProductAddToCartRequest
			|| action.type === CartActionsTypes.BuildTwinProductAddToCartRequest

			|| action.type === CartActionsTypes.BuildComboProductAddToCartRequest
			|| action.type === CartActionsTypes.RevertAddToCartRequest
			|| action.type === CartActionsTypes.AddFlatComboProductToCartRequest
			|| action.type === CatalogComboConfigListTypes.DecreaseComboQuantity
			|| action.type === CatalogComboConfigListTypes.IncreaseComboQuantity
			|| action.type === ConfiguratorActionsTypes.ResetComboProductInCartRequestArray
			|| action.type === CartActionsTypes.AddValidIncompleteProductToCartRequest
			|| action.type === CartActionsTypes.RemoveComboProductFromCartRequest
			// || action.type === CartActionsTypes.RemoveUnavailableIngredientsFromTwinInCart

		),
		withLatestFrom(this.store),
		filter(([action, state]) => state.common.sdk.isFetched),
		exhaustMap(([action, state]) => {
			// Product slug for singe and combo is under different data slices
			let currentProductSlug = state.catalog.configurableItem.productSeoTitle;
			if (
				action.type === CartActionsTypes.BuildComboProductAddToCartRequest
				|| action.type === CartActionsTypes.AddFlatComboProductToCartRequest
				|| action.type === CartActionsTypes.RemoveComboProductFromCartRequest
				|| action.type === CatalogComboConfigListTypes.DecreaseComboQuantity
				|| action.type === CatalogComboConfigListTypes.IncreaseComboQuantity
				|| action.type === ConfiguratorActionsTypes.ResetComboProductInCartRequestArray
				// || action.type === CartActionsTypes.RemoveUnavailableIngredientsFromTwinInCart
			) {
				currentProductSlug = state.catalog.comboConfig.activeProductSlug;
			}

			const addToCartRequest = state.checkout.cart.addToCartRequest;
			return this.configuratorService.getProductInfo(addToCartRequest).pipe(
				map(sdkResult => {
					return new SaveSdkProductInfo(sdkResult, currentProductSlug);
				}),
				catchError((error: SdkResponse) =>
					of(new SaveSdkProductInfoFailed(error))
				)
			)
		})
	)


	@Effect()
	setNextAsConfigurable = this.actions.pipe(
		ofType(ConfiguratorActionsTypes.TwinProductSetNext),
		withLatestFrom(this.store),
		map(([action, state]) => {
			const sliderIndex = 1;
			const secondSlider = state.catalog.configurableItem.viewProductsSlider[sliderIndex];
			const twinProductSliderChange = secondSlider.productLineId;
			return new TwinProductSliderChange(twinProductSliderChange, sliderIndex);
		})
	)

	/**
	 * Load Edit Config On Add To Cart
	 */
	@Effect({ dispatch: false })
	redirectToConfigPageAfterAdding = this.actions.pipe(
		ofType(CartActionsTypes.AddConfigurableProductToCartSuccess),
		withLatestFrom(this.store),
		filter(([action, state]) => {
			const isAppLaunched = state.common.settings.isFetched && state.common.store.selectedStore;
			const isConfiguratorRoute = state.router.state.url.startsWith('/catalog/config');
			const isMyPizzaRoute = state.router.state.url.startsWith('/catalog/my-pizzas')
			const routerParams = state.router.state.params;

			const isConfigPageLoaded = (isAppLaunched && (isConfiguratorRoute || isMyPizzaRoute) && routerParams.singleProductId);
			return isConfigPageLoaded
		}),
		map(([action, state]) => {
			let seoTitle = '';
			let basePath = '';
			seoTitle = state.router.state.params.singleProductId;
			basePath = 'config';
			const response = action['serverResponse'] as ServerCartResponseInterface;
			const cartId = response.last_item_id;

			this.router.navigate([`/catalog/${basePath}/${cartId}/${seoTitle}`]);
		})
	);


	/**
	 * Due to UX 3.02 navigate to main page when adding combo success
	 */
	@Effect({ dispatch: false })
	redirectToHomeIfComboAdded = this.actions.pipe(
		filter(action => action.type === CartActionsTypes.AddComboToCartSuccess
			|| action.type === CartActionsTypes.AddProductArrayToCartSuccess),
		map(() => {
			this.router.navigate([`/`]);
		})
	)

	/**
	 * Redirect If User Deletes Cart Item
	 */
	@Effect({ dispatch: false })
	redirectToConfigPageAfterDeleting = this.actions.pipe(
		filter(action =>
			action.type === CartActionsTypes.RemoveCartItem
			|| action.type === OrderActionsTypes.ClearCartSuccess
		),
		withLatestFrom(this.store),
		filter(([action, state]) => {
			const isAppLaunched = state.common.settings.isFetched && state.common.store.selectedStore;
			const isConfiguratorRoute = state.router.state.url.startsWith('/catalog/config');
			const routerParams = state.router.state.params;

			const isConfigPageLoaded = (isAppLaunched && isConfiguratorRoute && routerParams.singleProductId);
			const isComboRoute = state.router.state.url.startsWith('/catalog/product-combo');
			const isComboPageLoaded = (isAppLaunched && isComboRoute && routerParams.comboId);

			const isCurrentCartItem = action.type === OrderActionsTypes.ClearCartSuccess ||
				routerParams.cartItemId === action['productCartId'].toString();

			return (isConfigPageLoaded || isComboPageLoaded) && isCurrentCartItem
		}),
		map(([action, state]) => {
			const isComboRoute = state.router.state.url.startsWith('/catalog/product-combo');
			const isConfiguratorRoute = state.router.state.url.startsWith('/catalog/config');
			let seoTitle = '';
			let basePath = '';
			if (isConfiguratorRoute) {
				seoTitle = state.router.state.params.singleProductId;
				basePath = 'config';
			} else if (isComboRoute) {
				seoTitle = state.router.state.params.comboId;
				basePath = 'product-combo';

			}
			this.router.navigate([`/catalog/${basePath}/${seoTitle}`]);
		})
	);

	/**
	 * Directly add configurable item to cart if we are on the product list page and there is only one product option
	 * (this is triggered when quick add is clicked)
	 */
	@Effect()
	addDirectlyToCartOnCategoryPage = this.actions.pipe(
		filter(action =>
			action.type === ConfiguratorActionsTypes.FetchSingleProductSuccess
			|| action.type === ConfiguratorActionsTypes.FetchSingleConfigurableComboSuccess
		),
		withLatestFrom(this.store),
		filter(([action, state]) => {
			const routerParams = state.router.state.params;
			const isProductListRoute = state.router.state.url.startsWith('/catalog/products');
			const isCategoryPageLoaded = isProductListRoute;
			const productConfig = action['serverProductConfig'] as ServerProductConfig
			const isSingleConfigAvailableForCheckout = productConfig.kind === ProductKinds.single
				? productConfig.data.products[0].product_options.options.length < 2 : false;
			const isSingleComboAvailableForCheckout = productConfig.kind === ProductKinds.single_configurable_combo
				? productConfig.data.products.find(product => product.allow_customization).product_options.options.length < 2 : false
			return isCategoryPageLoaded && (isSingleConfigAvailableForCheckout || isSingleComboAvailableForCheckout)
		}),
		map(() => new AddConfigurableProductToCart())
	)


	/**
	 * Set flag which is used to bring "close config" pop up
	 */
	@Effect()
	setConfigurationPristineFlag = this.actions.pipe(
		filter(action =>
			action.type === ConfiguratorActionsTypes.ChangeProductSize
			|| action.type === ConfiguratorActionsTypes.IncreaseConfigurableItemQuantity
			|| action.type === ConfiguratorActionsTypes.DecreaseConfigurableItemQuantity
			|| action.type === ConfiguratorActionsTypes.OptionsResetSelected
			|| action.type === ConfiguratorActionsTypes.OptionsSelectUnSelect
			|| action.type === ConfiguratorActionsTypes.OptionsSetHalfHalf
			|| action.type === ConfiguratorActionsTypes.OptionsUpdateQuantity
			|| action.type === ConfiguratorActionsTypes.OptionsUpdateDropDown
		),
		withLatestFrom(this.store),
		filter(([action, state]) => {
			const isProductConfigurationPristine = state.catalog.configurableItem.isProductConfigurationPristine;
			return isProductConfigurationPristine;
		}),
		map(() => new ProductConfigurationChanged())
	)

	/**
	 * On Subconfig change load template for personalized message if required
	 */
	@Effect()
	onSubconfigChange = this.actions.pipe(
		ofType(ConfiguratorActionsTypes.ChangeProductSubConfiguration),
		withLatestFrom(this.store),
		filter(([action, store]) => {
			const selectedConfig = store.catalog.configurableItem.viewProductSubConfiguration.find(config => config.isSelected);
			return selectedConfig.personalizedTemplate ? true : false
		}),
		map(([action, store]) => {
			const selectedConfig = store.catalog.configurableItem.viewProductSubConfiguration.find(config => config.isSelected);
			return new FetchPersonalizedTemplateByID(selectedConfig.personalizedTemplate)
		})
	)

	constructor(
		private actions: Actions,
		private store: Store<State>,
		private router: Router,
		private configuratorService: ConfiguratorService,
		@Inject(LOCALE_ID) public locale: string
	) { }
}


