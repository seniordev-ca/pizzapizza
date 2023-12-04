export interface SdkResponse {
	errorCode: number,
	errorMessage?: string,
	debugErrorMessage?: string

	productPrice?: number,
	productCalories?: string,
	validation?: {
		isConfigValid: boolean,
		validationMsg: string,
		sub_configurations?: {
			[subconfig: string]: {
				isMaximumAmountReached: boolean,
				isSelectionRequired: boolean
			}
		},
		configurations: {}
		children: {
			[key: number]: {
				isConfigValid: boolean,
				isNotApplicable: boolean,
				validationMsg: string,
				sub_configurations?: {
					[subconfig: string]: {
						isMaximumAmountReached: boolean,
						isSelectionRequired: boolean
					}
				}
				configurations?: {
					[subconfig: string]: {
						isMaximumAmountReached: boolean,
						isSelectionRequired: boolean
					}
				},
				upSizing?: SdkUpsizingResponse,
			}
		},
		notConfiguredLineIds?: number[];
	},
	upSizing?: SdkUpsizingResponse,
	unavailableIngredients: string[],
	twinProductCalories: {
		[key: number]: string
	}
}

export interface SdkUpsizingResponse {
	toProductOption: number,
	message: string
}
