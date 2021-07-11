import { configureStore } from '@reduxjs/toolkit';
import user from './user-slice';
import results from './results-slice';

const reduxStore = configureStore({
	reducer: {
		user,
		results,
	},
});

export type RootState = ReturnType<typeof reduxStore.getState>;
export default reduxStore;
