import editMode from './edit-mode-slice';
import lastRoll from './last-roll-slice';
import results from './results-slice';
import roll from './roll-slice';
import user from './user-slice';
import whoami from './whoami-slice';
import { configureStore } from '@reduxjs/toolkit';

const reduxStore = configureStore({
	reducer: {
		editMode,
		lastRoll,
		results,
		roll,
		user,
		whoami,
	},
});

export type RootState = ReturnType<typeof reduxStore.getState>;
export default reduxStore;
