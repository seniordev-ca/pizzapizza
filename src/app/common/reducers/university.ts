// Actions
import {
	createEntityAdapter,
	EntityAdapter,
	EntityState
} from '@ngrx/entity';
import {
	UniversityActions,
	UniversityActionsTypes
} from '../actions/university';
import { UniversityListInterface } from '../models/university-list';
import { ServerUniversityBuildingInterface } from '../models/server-university';

export interface State extends EntityState<{id: string, buildings: ServerUniversityBuildingInterface[]}> {
	ids: string[],
	isUniveristyListFetched: boolean,
	universityList: UniversityListInterface[],
	buildingList: UniversityListInterface[]
}
export const adapter: EntityAdapter<{id: string, buildings: ServerUniversityBuildingInterface[]}> =
	createEntityAdapter<{id: string, buildings: ServerUniversityBuildingInterface[]}>({
	selectId: (universityList: {id: string, buildings: ServerUniversityBuildingInterface[]}) => universityList.id,
	sortComparer: false
})
export const initialState: State = adapter.getInitialState({
	ids: [],
	isUniveristyListFetched: false,
	universityList: null,
	buildingList: null
})

/**
 * Store reducer
 */
export function reducer(
	state = initialState,
	action: UniversityActions
): State {

	switch (action.type) {

		case UniversityActionsTypes.FetchUniversityListSuccess: {
			const universityPlaceHolder = [{
				value: null,
				label: action.locale === 'en-US' ? 'Select University' : 'Sélectionnez l\'université'
			}] as UniversityListInterface[]
			const universityList = action.universityList;
			let universities = universityPlaceHolder;
			let mappedUniversities: UniversityListInterface[];
			mappedUniversities = universityList.map(university => {
				return {
					value: university.code,
					label: university.name,
					mealKey: university.meal_card_key,
					mealCard: {
						isEnabled: university.meal_card.is_enabled,
						minLength: university.meal_card.min_length,
						maxLength: university.meal_card.max_length
					}
				} as UniversityListInterface
			});
			universities = universities.concat(mappedUniversities)
			return {
				...state,
				isUniveristyListFetched: true,
				universityList: universities
			}
		}

		case UniversityActionsTypes.FetchBuildingList: {
			return {
				...state,
				buildingList: null
			}
		}
		case UniversityActionsTypes.FetchBuildingListSuccess: {
			const universityCode = action.universityCode;
			const buildingPlaceHolder = [{
				value: null,
				label: action.locale === 'en-US' ? 'Select Building' : 'Sélectionnez un bâtiment'
			}] as UniversityListInterface[];
			const buildingList = action.buildingList;
			let buildings = buildingPlaceHolder;
			const mappedBuildings = buildingList.map(building => {
				return {
					value: building.building_key,
					label: building.building_name
				}
			});
			buildings = buildings.concat(mappedBuildings);

			const entityObject = {
				id: universityCode,
				buildings: buildingList,
			}

			return adapter.upsertOne(entityObject, {
				...state,
				buildingList: buildings
			})
		}
		default: {
			return state
		}
	}
}
