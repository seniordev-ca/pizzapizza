
// Models
import {
	UpSizingInterface, LangEnum
} from '../models/sdk-interface';
import {
	JsDataInterface
} from '../models/js-validation-data';
import {
	AddCartServerRequestInterface
} from '../models/add-to-cart-request';
import {
	Kinds,
	BaseComboInterface
} from '../models/interactor';

// Handlers
import { PpLogging } from './logging';
import { UserMessagesHandler } from '../handlers/user-messages';
import { SingleProductHandler } from '../handlers/single-product';


export class UpsizeMessageHandler {
	// Product input data
	_jsData: JsDataInterface;
	_addToCartRequest: AddCartServerRequestInterface;

	_singleProductHandler: SingleProductHandler;
	_comboProductHandler: BaseComboInterface;

	// Runtime data
	_twinsUpsizeLineIDAndProdId = [];
	_currentProductOptionIdTwinsDict = {};
	_kindFromJsData;
	_lang: LangEnum;


	constructor(
		jsData: JsDataInterface,
		addToCartRequest: AddCartServerRequestInterface,
		singleProductHandler: SingleProductHandler,
		comboProductHandler: BaseComboInterface,
		lang: LangEnum
	) {
		this._jsData = jsData;
		this._addToCartRequest = addToCartRequest;
		this._lang = lang;

		this._singleProductHandler = singleProductHandler;
		this._comboProductHandler = comboProductHandler;
	}


	/**
	 * Build upSize object based on add to cart request and js data
	 */
	public getUpSizingOffer(currentSelectionPriceCal): UpSizingInterface {
		this._kindFromJsData = this._jsData.kind;

		// No upSize for combo
		if (this._kindFromJsData === Kinds.combo) {
			return null;
		}


		const productJsData = this._jsData.products[0];
		const productJsDataTwinsArray = [];
		const isPizza = productJsData.is_pizza;
		if (this._kindFromJsData === Kinds.twin) {
			this._jsData.products.forEach(product => {
				productJsDataTwinsArray.push(product);
			});
		}

		// Only for Pizza
		if (!isPizza) {
			return null;
		}
		this._twinsUpsizeLineIDAndProdId = [];

		const upSizeProduct = this._getUpsizeProductObj(productJsData);
		// Check is product is largest
		if (!upSizeProduct) {
			return null;
		}

		const upSizeMessage = this._getUpsizeMessage(upSizeProduct, currentSelectionPriceCal);
		if (!upSizeMessage) {
			return null;
		}
		let toProductOptionID = parseInt(upSizeProduct.productOptionId, 10);

		// if twin return second twin id and not upsize product option id
		if (this._kindFromJsData === Kinds.twin) {
			// do sequence here to grab second twin productId (UI wise it will be second slide)
			// since we are haveing button "add to cart" on second twin pizza
			this._twinsUpsizeLineIDAndProdId.sort((left, right) => left.sequence - right.sequence)
			toProductOptionID = this._twinsUpsizeLineIDAndProdId[this._twinsUpsizeLineIDAndProdId.length - 1].product_option_id
		}
		return {
			toProductOption: toProductOptionID,
			message: upSizeMessage
		}
	}

	/**
	 * Gets upsize message
	 */
	private _getUpsizeMessage(upSizeProduct, currentSelectionPriceCal) {
		const upSizeProductId = parseInt(upSizeProduct.productOptionId, 10);
		// if twin then get seond upsized productOptionId
		let offeredProductPrice = {};

		// No upsale if product ingredients are not applicable for bigger size
		try {
			let twinsUpsizeIdArray;
			let notExistingToppingsOnUpsizedProduct = 0;
			// Get price and calories for next size twin product
			if (this._kindFromJsData === Kinds.twin) {

				// find second upsized product option Id
				this._jsData.combo.combinations.forEach(combination => {
					if (combination.product_option_ids.indexOf(upSizeProductId) > -1) {
						twinsUpsizeIdArray = combination.product_option_ids;
						// convert to dictionary with related line ids
						this._jsData.products.forEach(jsDataProduct => {
							twinsUpsizeIdArray.forEach(upsizeProdOptId => {
								if (upsizeProdOptId in jsDataProduct.product_options) {
									this._twinsUpsizeLineIDAndProdId.push({
										line_id: jsDataProduct.line_id,
										product_option_id: upsizeProdOptId,
										sequence: jsDataProduct.sequence
									})
								}
							})
						})
						const addToCartRequest = JSON.parse(JSON.stringify(this._addToCartRequest)) as AddCartServerRequestInterface;
						// finding by line id assign then new product option ids
						this._twinsUpsizeLineIDAndProdId.forEach(upsizeTwinProduct => {
							addToCartRequest.products[0].child_items.forEach(addToCartTwin => {
								if (addToCartTwin.line_id === upsizeTwinProduct.line_id) {
									addToCartTwin.product_option_id = upsizeTwinProduct.product_option_id;
								}
							})
						})

						// check if upsize is possible by checking if all ATR ingredients exists in given upsized pizza'
						addToCartRequest.products[0].child_items.forEach(upsizedTwin => {
							upsizedTwin.config_options.forEach(configOption => {
								const configOptionsFromServer = this._jsData.products.filter(prod => prod.line_id === upsizedTwin.line_id)[0].configuration_options;
								if (!configOptionsFromServer[configOption.config_code].product_options[upsizedTwin.product_option_id]) {
									if (PpLogging.isEnabled()) {
										console.log('this does not exists in given size', upsizedTwin.product_option_id, ' -', configOption.config_code)
									}
									notExistingToppingsOnUpsizedProduct++;
								}
							})
						})
						// pass to calculate new add to cart request
						offeredProductPrice = this._comboProductHandler.getComboWithIngredientsPrice(addToCartRequest);
					}
				})
				if (notExistingToppingsOnUpsizedProduct > 0) {
					return null
				}
			} else {
				// single pizza logic for upsize
				let notAvailableToppingsForUpsize = 0;
				// check if upsize product has all the given toppings
				const atrToppingsForPizza = this._addToCartRequest.products[0].config_options.map(topping => topping.config_code)
				atrToppingsForPizza.forEach(topping => {
					if (!this._jsData.products[0].configuration_options[topping].product_options[upSizeProductId]) {
						notAvailableToppingsForUpsize++;
					}
				})
				if (notAvailableToppingsForUpsize > 0) {
					return null
				} else {
					offeredProductPrice = this._singleProductHandler.getSingleWithIngredientPrice(upSizeProductId);
				}
			}


		} catch (e) {
			console.warn('ERROR --->', e)
			return null;
		}

		const upSizeSizeName = upSizeProduct.size_name[this._lang];
		let priceDiff = offeredProductPrice['price'] - currentSelectionPriceCal.price;
		const offeredProdCal = offeredProductPrice['twinCalories'] ? offeredProductPrice['twinCalories'] : offeredProductPrice['calories'];

		// Round to at most 2 decimal places
		priceDiff = Math.round(priceDiff * 100) / 100;

		// Build upSale message
		const upSizeMessage = UserMessagesHandler.getUpSizeMessage(upSizeSizeName, offeredProdCal, priceDiff);

		return upSizeMessage;
	}

	/**
	 * Gets upsize product object
	 */
	private _getUpsizeProductObj(productJsData) {
		let requestProductOptionId = this._addToCartRequest.products[0].product_option_id;
		if (this._kindFromJsData === Kinds.twin) {

			// find both product option ids for twins and make dict based on line id
			this._addToCartRequest.products[0].child_items.forEach(twinChild => {
				if (!this._currentProductOptionIdTwinsDict[twinChild.line_id]) {
					this._currentProductOptionIdTwinsDict[twinChild.line_id] = twinChild.product_option_id;
				}
			});
			requestProductOptionId = this._addToCartRequest.products[0].child_items[0].product_option_id;
		}

		// Dict to Array
		const productOptionsArr = [];
		for (const productOptionId in productJsData.product_options) {
			if (productJsData.product_options[productOptionId]) {
				productOptionsArr.push(
					{
						...productJsData.product_options[productOptionId],
						productOptionId
					}
				);
			}
		}

		// Order by to find upSale size price
		productOptionsArr.sort((left, right) => left.base_price - right.base_price);
		const currentConfigOption = productOptionsArr.filter(el => parseInt(el.productOptionId, 10) === requestProductOptionId);
		const currentProductIndex = productOptionsArr.indexOf(currentConfigOption[0]);

		// Check if current product is not largest one
		if (currentProductIndex === productOptionsArr.length - 1) {
			return null;
		}

		// Next product by size
		const upSizeProduct = productOptionsArr[currentProductIndex + 1];

		// get line id fo upsize product option
		return upSizeProduct;
	}
}
