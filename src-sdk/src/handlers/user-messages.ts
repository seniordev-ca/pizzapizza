import {
	Kinds
} from '../models/interactor';
import {
	LangEnum
} from '../models/sdk-interface';

interface JsDataValidationObject {
	selectedQuantity: number
	hasIncludedOptions: boolean,

	included_quantity: number
	maximum_quantity: number
	is_required: boolean
	name: {
		[lang: string]: string
	}
	defaultProductOptionId?: string
}
export class UserMessagesHandler {
	static lang: LangEnum;
	static nounTranslation = {
		en: ' and ',
		fr: ' et '
	}
	_messageBuilderData: JsDataValidationObject[];
	_productKind: Kinds;

	/**
	 * Gets copy for upsize message
	 */
	static getUpSizeMessage(sizeName: string, calDiff, priceDiff: number) {
		let calories = calDiff;
		// this will happen only in case its twin product
		if (typeof calDiff === 'object') {
			calories = (calDiff['1'] + UserMessagesHandler.nounTranslation[UserMessagesHandler.lang] + calDiff['2']).toString();
		}
		const upsizeMsg = {
			en: `Do you want to upsize to ${sizeName} (${calories}) for only an extra $${priceDiff.toFixed(2).toLocaleString()}?`,
			fr: `Voulez-vous passer à ${sizeName} (${calories}) pour seulement un extra ${priceDiff.toFixed(2).toLocaleString()}$?`
		}
		return upsizeMsg[UserMessagesHandler.lang];
	}

	/**
	 * Gets combo validation messages
	 */
	static getComboValidationMessage() {
		const generalMessage = {
			en: 'There are one or more items requiring configuration.',
			fr: 'Il existe un ou plusieurs éléments nécessitant une configuration.'
		}
		return generalMessage[UserMessagesHandler.lang];
	}

	constructor(productKind: Kinds, lang: LangEnum) {
		this._productKind = productKind;
		UserMessagesHandler.lang = lang;
		this._messageBuilderData = [] as JsDataValidationObject[];
	}

	/**
	 * we need to add product option id here
	 */
	addValidationObject(
		defaultProductOptionId,
		validationObject: JsDataValidationObject,
		cardQuantity: number = 0,
		hasIncludedOptions = false) {
		validationObject.selectedQuantity = cardQuantity;
		validationObject.hasIncludedOptions = hasIncludedOptions;
		validationObject.defaultProductOptionId = defaultProductOptionId
		this._messageBuilderData.push(validationObject);
	}

	/**
	 * Resets validations messages
	 */
	resetValidationObject() {
		this._messageBuilderData = [] as JsDataValidationObject[];
	}

	/**
	 * TODO:
	 * - Add product kind check
	 */
	getProductValidationMessage(twinsCountProduct?) {
		if (this._messageBuilderData.length === 0) {
			// No validation object
			return '';
		}

		if (this._productKind === Kinds.single) {
			// Product is single
			const singleValidationMessage = this._getValidationMessageForSingle(UserMessagesHandler.lang);
			return singleValidationMessage;
		} else {
			const comboValidationMessage = this._getValidationMessageForCombo(twinsCountProduct);
			return comboValidationMessage;
		}

	}

	/**
	 * Gets validation message for combo
	 */
	private _getValidationMessageForCombo(twinsCountProduct?) {
		const langKey = UserMessagesHandler.lang;
		const translation = {
			choose: {
				en: 'Choose ',
				fr: 'Choisir '
			},
			remove: {
				en: 'Please, remove ',
				fr: 'S\'il vous plaît, supprimer '
			}
		};
		let resultMessage = translation.choose[UserMessagesHandler.lang]
		const validationsCount = this._messageBuilderData.length - 1;

		this._messageBuilderData.forEach((validation, index) => {
			const ingredientName = validation.name[langKey];

			// if (validation.hasIncludedOptions) {
			// this will show us amount of stuff still left to be chosen for all combos
			if (validation.included_quantity[validation.defaultProductOptionId] > 0) {
				let selectionAllowed = validation.included_quantity[validation.defaultProductOptionId] - validation.selectedQuantity;

				if (selectionAllowed < 0) {
					resultMessage = translation.remove[UserMessagesHandler.lang];
					selectionAllowed = Math.abs(selectionAllowed);
				}
				resultMessage += selectionAllowed + ' ';
			}

			resultMessage += ingredientName;
			if (index !== validationsCount) {
				resultMessage += UserMessagesHandler.nounTranslation[UserMessagesHandler.lang];
			}
		});
		// for twins being included in combo should make no message returned -> client feedback
		// suggestion: remove validation message only for twins and leave it for other products in combo
		if (this._productKind === Kinds.combo && twinsCountProduct > 0) {
			resultMessage = ''
		}
		return resultMessage;
	}

	/**
	 * Gets validation message for single
	 */
	private _getValidationMessageForSingle(language) {
		const messageTranslations = {
			verbSingle: {
				en: 'is',
				fr: 'est'
			},
			verbPlural: {
				en: 'are',
				fr: 'sont'
			},
			required: {
				en: 'required',
				fr: 'nécessaire'
			},
			available: {
				en: 'available',
				fr: 'disponible'
			},
			shouldBeRemoved: {
				en: 'should be removed',
				fr: 'devrait être supprimé '
			}

		}
		const subConfigValidationObj = this._messageBuilderData[0]
		const langKey = language;
		const subConfigName = subConfigValidationObj.name[langKey]

		let quantity = subConfigValidationObj.included_quantity[subConfigValidationObj.defaultProductOptionId];
		if (quantity === 0 && subConfigValidationObj.is_required[subConfigValidationObj.defaultProductOptionId]) {
			quantity = 1;
		}
		if (subConfigValidationObj.selectedQuantity) {
			quantity = quantity - subConfigValidationObj.selectedQuantity;
		}
		// fix the message if multiple items needed to be required
		let verb = messageTranslations.verbSingle[langKey]
		let plural = ''
		if (quantity > 1) {
			verb = messageTranslations.verbPlural[langKey];
			plural = 's'
		}
		let demand = messageTranslations.required[langKey];
		if (subConfigValidationObj.is_required[subConfigValidationObj.defaultProductOptionId]) {
			demand = messageTranslations.required[langKey];
		} else if (!subConfigValidationObj.is_required[subConfigValidationObj.defaultProductOptionId]) {
			demand = messageTranslations.available[langKey];
		}
		const combinedMessage = {
			en: `There ${verb} ${quantity} more selection${plural} that ${verb} ${demand} in section ${subConfigName}. `,
			fr: `Il y a  ${verb} ${quantity} plus de sélection${plural} que ${verb} ${demand} dans la section ${subConfigName}. `
		}
		let message = combinedMessage[langKey]

		if (quantity < 0) {
			quantity = Math.abs(quantity);
			demand = messageTranslations.shouldBeRemoved[langKey];
			const negativeQtyMsg = {
				en: `There ${verb} ${quantity} selection that ${demand} in section ${subConfigName}. `,
				fr: `Il y a ${verb} ${quantity} de sélection ${demand} dans la section ${subConfigName}. `
			}
			message = negativeQtyMsg[langKey];
		}
		return message;
	}

}
