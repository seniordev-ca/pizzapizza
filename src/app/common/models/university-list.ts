export interface UniversityListInterface {
	value: string,
	label: string,
	mealKey?: string,
	code?: string,
	mealCard?: {
		isEnabled: boolean,
		minLength: number,
		maxLength: number
	}
}
