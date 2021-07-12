import { configureStore } from '@reduxjs/toolkit';
import user from './user-slice';
import results from './results-slice';
import whoami from './whoami-slice';

const reduxStore = configureStore({
	reducer: {
		user,
		results,
		whoami,
	},
});

export type RootState = ReturnType<typeof reduxStore.getState>;
export default reduxStore;
