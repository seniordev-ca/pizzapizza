import {
	createSelector,
	createFeatureSelector,
	ActionReducerMap,
} from '@ngrx/store';

import * as fromDevReducer from './dev-reducer';
import * as fromRootReducer from '../../root-reducer/root-reducer';

export interface DevState {
	environment: fromDevReducer.State
}

export interface State extends fromRootReducer.State {
	dev: DevState
}

export const reducers: ActionReducerMap<DevState> = {
	environment: fromDevReducer.reducer,
};

export const selectCommonState = createFeatureSelector<DevState>('dev');

export const selectAppDevOptions = createSelector(
	selectCommonState,
	(state: DevState) => state
)
