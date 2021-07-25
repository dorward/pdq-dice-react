import { configureStore } from '@reduxjs/toolkit';
import editMode from './edit-mode-slice';
import results from './results-slice';
import user from './user-slice';
import whoami from './whoami-slice';

const reduxStore = configureStore({
	reducer: {
		user,
		results,
		whoami,
		editMode,
	},
});

export type RootState = ReturnType<typeof reduxStore.getState>;
export default reduxStore;
