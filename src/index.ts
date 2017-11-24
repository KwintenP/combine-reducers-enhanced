import {ActionReducerMap} from '@ngrx/store';

export function combineReducersEnhanced<T>(reducers: any, asFunction: boolean = true): Function | ActionReducerMap<T> {
	const reducerKeys = Object.keys(reducers);
	const finalReducers = {};

	for (let i = 0; i < reducerKeys.length; i++) {
		const key = reducerKeys[i];
		if (typeof reducers[key] === 'function') {
			finalReducers[key] = reducers[key];
		} else {
			finalReducers[key] = combineReducersEnhanced(reducers[key]);
		}
	}

	if (!asFunction) {
		return finalReducers as ActionReducerMap<T>;
	}
	const finalReducerKeys = Object.keys(finalReducers);

	return function combination(state = {}, action) {
		let hasChanged = false;
		const nextState = {};
		for (let i = 0; i < finalReducerKeys.length; i++) {
			const key = finalReducerKeys[i];
			const reducer = finalReducers[key];
			const previousStateForKey = state[key];
			const nextStateForKey = reducer(previousStateForKey, action);

			nextState[key] = nextStateForKey;
			hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
		}
		return hasChanged ? nextState : state;
	};
}
