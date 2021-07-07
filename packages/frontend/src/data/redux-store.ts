import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';
import user from './user-slice';

const reduxStore = configureStore({
	reducer: {
		user,
	},
});

export type RootState = ReturnType<typeof reduxStore.getState>;
export default reduxStore;
