
/**
 * Product init client language
 */
export enum LangEnum {
	en,
	fr
}

/**
 * Product init client
 */
export enum PlatformEnum {
	web,
	ios,
	android
}

export interface InitProductResult {
	errorCode: number,
	errorMessage?: string,
	debugErrorMessage?: string
}

export interface ProductValidation {
	isConfigValid: boolean,
	notConfiguredLineIds?: number[];
	isNotApplicable?: boolean,
	validationMsg: string,
	upSizing?: UpSizingInterface,
	configurations?: {
		[lineId: number]: {
			isSelectionRequired: boolean,
			isMaximumAmountReached: boolean
		}
	}
	children?: {
		[lineId: number]: ProductValidation
	}
}

export interface UpSizingInterface {
	toProductOption: number
	message: string,
}

export interface GetProductInfoResult {
	errorCode: number,
	errorMessage?: string,
	debugErrorMessage?: string

	productPrice?: number,
	productCalories?: string,
	twinProductCalories?: {
		[lineId: number]: string
	},

	validation?: ProductValidation,
	upSizing?: UpSizingInterface,

	unavailableIngredients?: string[]
}
