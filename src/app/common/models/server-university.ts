export interface ServerUniversityInterface {
	code: string,
	name: string,
	meal_card_key: string,
	meal_card: {
		is_enabled: boolean,
		min_length: number,
		max_length: number
	}
}
export interface ServerUniversityBuildingInterface {
	building_key: string,
	building_name: string
}
