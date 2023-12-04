import { Action } from '@ngrx/store';
import { ServerUniversityInterface, ServerUniversityBuildingInterface } from '../models/server-university';

/**
 * University Action Enum
 */
export enum UniversityActionsTypes {
	FetchUniversityList = '[Common](University) Fetch University List',
	FetchUniversityListSuccess = '[Common](University) Fetch University List Success',
	FetchUniversityListFailed = '[Common](University) Fetch University List Failed',

	FetchBuildingList = '[Common](University) Fetch Building List',
	FetchBuildingListSuccess = '[Common](University) Fetch Building List Success',
	FetchBuildingListFailed = '[Common](University) Fetch Building List Failed'
}

export class FetchUniversityList implements Action {
	readonly type = UniversityActionsTypes.FetchUniversityList;
}
export class FetchUniversityListSuccess implements Action {
	readonly type = UniversityActionsTypes.FetchUniversityListSuccess;
	constructor(public universityList: ServerUniversityInterface[], public locale: string) { }
}
export class FetchUniversityListFailed implements Action {
	readonly type = UniversityActionsTypes.FetchUniversityListFailed;
}

export class FetchBuildingList implements Action {
	readonly type = UniversityActionsTypes.FetchBuildingList;
	constructor(public code: string) { }
}
export class FetchBuildingListSuccess implements Action {
	readonly type = UniversityActionsTypes.FetchBuildingListSuccess;
	constructor(public buildingList: ServerUniversityBuildingInterface[], public universityCode: string,
				public locale: string) { }
}
export class FetchBuildingListFailed implements Action {
	readonly type = UniversityActionsTypes.FetchBuildingListFailed;
}

export type UniversityActions =
	| FetchUniversityList
	| FetchUniversityListSuccess
	| FetchUniversityListFailed

	| FetchBuildingList
	| FetchBuildingListSuccess
	| FetchBuildingListFailed

