import editMode from './edit-mode-slice';
import lastRoll from './last-roll-slice';
import results from './results-slice';
import roll from './roll-slice';
import user from './user-slice';
import whoami from './whoami-slice';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { clearSession } from './session';

const reducer = combineReducers({
    editMode,
    lastRoll,
    results,
    roll,
    user,
    whoami,
});

const reduxStore = configureStore({
    reducer: (state: ReturnType<typeof reducer> | undefined, action) =>
        reducer(clearSession.match(action) ? undefined : state, action),
});

export type RootState = ReturnType<typeof reduxStore.getState>;
export default reduxStore;
