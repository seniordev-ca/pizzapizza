import { Action } from '@ngrx/store';
import { KidsClubSignUpFormInterface } from '../containers/account-kids-club-vertical-modal/kids-club-modal.component';
import { ServerKidsClubInterface } from '../models/server-models/server-kids-club';
import { ServerValidationError } from 'app/common/models/server-validation-error';

/**
 * Kids Club Actions
 */
export enum KidsClubActionTypes {
	RegisterNewKidsClub = '[User](KidsClub) New Kids Club Registration',
	RegisterNewKidsClubSuccess = 'User](KidsClub) New Kids Club Registration Success',
	RegisterNewKidsClubFailure = 'User](KidsClub) New Kids Club Registration Failure',

	FetchUserKidsClub = '[User](KidsClub) Fetch Users Kids Club Details',
	FetchUserKidsClubSuccess = '[User](KidsClub) Fetch Users Kids Club Details Success',
	FetchUserKidsClubFailure = '[User](KidsClub) Fetch Users Kids Club Details Failure',

	DeleteKidsClubUser = '[User](KidsClub) Delete Kids Club Registration',
	DeleteKidsClubUserSuccess = 'User](KidsClub) Delete Kids Club Registration Success',
	DeleteKidsClubUserFailure = 'User](KidsClub) Delete Kids Club Registration Failure',

	UpdateKidsClub = '[User](KidsClub) Update Kids Club Registration',
	UpdateKidsClubSuccess = 'User](KidsClub) Update Kids Club Registration Success',
	UpdateKidsClubFailure = 'User](KidsClub) Update Kids Club Registration Failure',
}

export class RegisterNewKidsClub implements Action {
	readonly type = KidsClubActionTypes.RegisterNewKidsClub;
	constructor(public registration: KidsClubSignUpFormInterface) {}
}
export class RegisterNewKidsClubSuccess implements Action {
	readonly type = KidsClubActionTypes.RegisterNewKidsClubSuccess;
	constructor(public response: ServerKidsClubInterface) {}
}
export class RegisterNewKidsClubFailure implements Action {
	readonly type = KidsClubActionTypes.RegisterNewKidsClubFailure
	constructor(public errorResponse: ServerValidationError) {}
}

export class FetchUserKidsClub implements Action {
	readonly type = KidsClubActionTypes.FetchUserKidsClub
}
export class FetchUserKidsClubSuccess implements Action {
	readonly type = KidsClubActionTypes.FetchUserKidsClubSuccess
	constructor(public response: ServerKidsClubInterface[]) {}
}
export class FetchUserKidsClubFailure implements Action {
	readonly type = KidsClubActionTypes.FetchUserKidsClubFailure
}

export class DeleteKidsClubUser implements Action {
	readonly type = KidsClubActionTypes.DeleteKidsClubUser;
	constructor(public id: number) {}
}
export class DeleteKidsClubUserSuccess implements Action {
	readonly type = KidsClubActionTypes.DeleteKidsClubUserSuccess
	constructor(public id: number) {}
}
export class DeleteKidsClubUserFailure implements Action {
	readonly type = KidsClubActionTypes.DeleteKidsClubUserFailure
}

export class UpdateKidsClub implements Action {
	readonly type = KidsClubActionTypes.UpdateKidsClub;
	constructor(public registration: KidsClubSignUpFormInterface) {}
}
export class UpdateKidsClubSuccess implements Action {
	readonly type = KidsClubActionTypes.UpdateKidsClubSuccess;
	constructor(public response: ServerKidsClubInterface) {}
}
export class UpdateKidsClubFailure implements Action {
	readonly type = KidsClubActionTypes.UpdateKidsClubFailure
	constructor(public errorResponse: ServerValidationError) {}
}

/**
 * NGRX actions for Kids club
 */
export type KidsClubActions =
	| RegisterNewKidsClub
	| RegisterNewKidsClubSuccess
	| RegisterNewKidsClubFailure

	| FetchUserKidsClub
	| FetchUserKidsClubFailure
	| FetchUserKidsClubSuccess

	| DeleteKidsClubUser
	| DeleteKidsClubUserFailure
	| DeleteKidsClubUserSuccess

	| UpdateKidsClub
	| UpdateKidsClubFailure
	| UpdateKidsClubSuccess
