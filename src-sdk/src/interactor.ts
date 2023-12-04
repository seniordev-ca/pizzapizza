
// Utils
import { Decoding } from './utils/decoding';

// Handlers
import { PpLogging } from './handlers/logging';
import { DataValidation } from './handlers/data-validation';
import { IngredientsHandler } from './handlers/ingredients';
import { ProductValidationHandler } from './handlers/product-validation';
import { SingleProductHandler } from './handlers/single-product';
import { ComboProductHandler } from './handlers/combo-product';
import { NewComboProductHandler } from './handlers/new-combo-products';
import { UpsizeMessageHandler } from './handlers/upsize-message';

// Models
import {
	LangEnum,
	PlatformEnum,
	ProductValidation,
	GetProductInfoResult,
} from './models/sdk-interface';
import {
	PriceCaloriesInterface,
	Kinds,
	BaseComboInterface
} from './models/interactor';
import {
	JsDataInterface
} from './models/js-validation-data';
import {
	AddCartServerRequestInterface,
	AddCartProductServerRequestInterface
} from './models/add-to-cart-request';

class Interactor {
	// Product input data
	_lang: LangEnum;
	_platform: PlatformEnum;
	_jsData: JsDataInterface;
	_addToCartRequest: AddCartServerRequestInterface;

	// Runtime data
	_jsJsDataIsValid = false;

	// Handlers
	_ingredientsHandler: IngredientsHandler;
	_productValidationHandler: ProductValidationHandler;
	_singleProductHandler: SingleProductHandler;
	_comboProductHandler: BaseComboInterface;
	_upsizeMessageHandlers: UpsizeMessageHandler;

	/**
	 * Passing product config to interactor
	 */
	initProduct(jsData: string, platform: PlatformEnum, lang: LangEnum) {
		// Validation could trow exception to top.
		DataValidation.validateInitProductData(jsData, platform, lang);
		this._lang = lang;
		this._jsJsDataIsValid = false;
		// Decode JS data
		try {
			this._jsData = Decoding.decode(jsData);
		} catch (error) {
			DataValidation.trowErrorByCode(1, error);
		}

		// Could trow exception to top
		DataValidation.validateDecodedJsData(this._jsData);
		this._jsJsDataIsValid = true;
	}

	/**
	 * Get pricing/calories/validation based on add to card request
	 */
	getProductConfig(addToCartRequest: AddCartServerRequestInterface): GetProductInfoResult {
		if (PpLogging.isEnabled()) {
			console.log('\nget product config:');
			console.log(addToCartRequest);
			console.log(this._jsData);
			console.log('\n\n');
		}

		// Data integrity check
		if (!this._jsJsDataIsValid) {
			DataValidation.trowErrorByCode(4);
		}
		if (this._jsData.product_id !== addToCartRequest.products[0].product_id) {
			DataValidation.trowErrorByCode(5);
		}

		// Save add to cart request
		this._addToCartRequest = addToCartRequest;
		const isNewComboProduct = 'new_combo' in this._jsData;

		// Initiate handlers
		this._ingredientsHandler = new IngredientsHandler(this._jsData, this._addToCartRequest);
		this._productValidationHandler = new ProductValidationHandler(this._jsData.kind, this._lang);
		this._singleProductHandler = new SingleProductHandler(
			this._jsData,
			this._addToCartRequest,
			this._ingredientsHandler,
			this._lang
		);

		if (isNewComboProduct) {
			this._comboProductHandler = new NewComboProductHandler(
				this._jsData,
				this._addToCartRequest,
				this._ingredientsHandler,
				this._productValidationHandler,
				this._lang
			);
		} else {
			this._comboProductHandler = new ComboProductHandler(
				this._jsData,
				this._addToCartRequest,
				this._ingredientsHandler,
				this._productValidationHandler,
				this._lang
			);
		}

		this._upsizeMessageHandlers = new UpsizeMessageHandler(
			this._jsData,
			this._addToCartRequest,
			this._singleProductHandler,
			this._comboProductHandler,
			this._lang
		)

		// Check is all selected ingredients are available for selected size
		const unavailableIngredients = this._ingredientsHandler.getUnavailableIngredients();



		// Validation could trow exception to top.
		DataValidation.validateGetProductConfig(addToCartRequest, this._jsData);

		const kindFromJsData = this._jsData.kind;
		// Info data
		let priceAndCalories = {} as PriceCaloriesInterface;
		let productValidation = {} as ProductValidation;

		switch (kindFromJsData) {
			// Handler for single product
			case Kinds.single:
				const jsDataForProduct = this._jsData.products[0];
				const addToCartRequestProduct = this._addToCartRequest.products[0] as AddCartProductServerRequestInterface;
				productValidation = this._productValidationHandler.validateProducts(this._jsData, jsDataForProduct, addToCartRequestProduct);
				priceAndCalories = this._singleProductHandler.getSingleWithIngredientPrice();
				break;

			// Handler for combo, single configurable item and twin products
			// single configurable item has kind combo in js data
			case Kinds.combo:
			case Kinds.twin:
				const addToCartRequestDeepCopy = JSON.parse(JSON.stringify(this._addToCartRequest));
				productValidation = this._comboProductHandler.getComboTwinValidation();
				priceAndCalories = this._comboProductHandler.getComboWithIngredientsPrice(addToCartRequestDeepCopy);
				break;
		}

		const sdkSuccessResult = {
			errorCode: 0,
			productPrice: priceAndCalories.price,
			productCalories: priceAndCalories.calories,
			validation: productValidation
		} as GetProductInfoResult;

		// Apply twin product calories
		if (this._jsData.kind === Kinds.twin) {
			sdkSuccessResult.twinProductCalories = priceAndCalories.twinCalories
		}

		// Apply upsize message
		const upSizing = this._upsizeMessageHandlers.getUpSizingOffer(priceAndCalories);


		if (upSizing) {
			sdkSuccessResult.upSizing = upSizing;
		}
		if (unavailableIngredients.length !== 0) {
			sdkSuccessResult['unavailableIngredients'] = unavailableIngredients;

			// console.log('SDK results:');
			// console.log(JSON.stringify(sdkSuccessResult));
			// console.log(sdkSuccessResult);

			// return sdkSuccessResult;
		}
		if (PpLogging.isEnabled()) {
			console.log('SDK results:');
			console.log(JSON.stringify(sdkSuccessResult));
			console.log(sdkSuccessResult);
		}

		return sdkSuccessResult;
	}

}


/**
 * This approach is allowing to encapsulate private methods after compiling to ES5
 */
const interactor = new Interactor();
export {
	interactor
}
